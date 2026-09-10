import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

export const login = async (req: Request, res: Response) => {
 try {
  const { email, password } = req.body;

  // Cari akun Admin berdasarkan email
  const admin = await prisma.admin.findUnique({
   where: { email },
  });

  // Kalau akun tidak ditemukan
  if (!admin) {
   return res.status(401).json({
    message: "Email atau password salah",
   });
  }

  const accessToken = generateAccessToken({
   adminId: admin.id,
   email: admin.email,
  });

  // Bandingkan password dari user dengan passwordHash di database
  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

  // Kalau password salah
  if (!passwordMatch) {
   return res.status(401).json({
    message: "Email atau password salah",
   });
  }

  // Login berhasil
  return res.status(200).json({
   message: "Login berhasil",
   accessToken,
   admin: {
    id: admin.id,
    email: admin.email,
   },
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const forgotPassword = async (req: Request, res: Response) => {
 try {
  const { email } = req.body;

  const admin = await prisma.admin.findUnique({
   where: { email },
  });

  // Jangan memberi tahu apakah email tersebut terdaftar atau tidak.
  if (!admin) {
   return res.status(200).json({
    message: "Jika email terdaftar, instruksi reset password akan dikirim.",
   });
  }

  // Membuat token acak yang sulit ditebak.
  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.deleteMany({
   where: {
    adminId: admin.id,
    usedAt: null,
   },
  });

  // Yang disimpan ke database adalah hash token,
  // bukan token aslinya.
  const tokenHash = crypto
   .createHash("sha256")
   .update(resetToken)
   .digest("hex");

  // Token berlaku selama 15 menit.
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.create({
   data: {
    adminId: admin.id,
    tokenHash,
    expiresAt,
   },
  });

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(email, resetUrl);
  return res.status(200).json({
   message: "Jika email terdaftar, instruksi reset password akan dikirim.",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const resetPassword = async (req: Request, res: Response) => {
 try {
  const { token, newPassword } = req.body;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const resetToken = await prisma.passwordResetToken.findUnique({
   where: {
    tokenHash,
   },
  });

  if (!resetToken) {
   return res.status(400).json({
    message: "Token reset password tidak valid",
   });
  }

  if (resetToken.usedAt) {
   return res.status(400).json({
    message: "Token reset password sudah digunakan",
   });
  }

  if (resetToken.expiresAt < new Date()) {
   return res.status(400).json({
    message: "Token reset password sudah kedaluwarsa",
   });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
   prisma.admin.update({
    where: {
     id: resetToken.adminId,
    },
    data: {
     passwordHash,
    },
   }),

   prisma.passwordResetToken.update({
    where: {
     id: resetToken.id,
    },
    data: {
     usedAt: new Date(),
    },
   }),
  ]);

  return res.status(200).json({
   message: "Password berhasil diubah",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
