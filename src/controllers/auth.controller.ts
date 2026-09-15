import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const login = catchAsync(async (req, res) => {
 const { email, password } = req.body;

 const user = await prisma.user.findUnique({
  where: { email },
 });

 if (!user) {
  throw new AppError("Email atau password salah", 401);
 }

 const passwordMatch = await bcrypt.compare(password, user.passwordHash);

 if (!passwordMatch) {
  throw new AppError("Email atau password salah", 401);
 }

 const accessToken = generateAccessToken({
  userId: user.id,
  email: user.email,
 });

 res.status(200).json({
  message: "Login berhasil",
  accessToken,
  user: {
   id: user.id,
   email: user.email,
  },
 });
});

export const forgotPassword = catchAsync(async (req, res) => {
 const { email } = req.body;

 const user = await prisma.user.findUnique({
  where: { email },
 });

 if (!user) {
  res.status(200).json({
   message: "Jika email terdaftar, instruksi reset password akan dikirim.",
  });
  return;
 }

 const resetToken = crypto.randomBytes(32).toString("hex");

 await prisma.passwordResetToken.deleteMany({
  where: {
   userId: user.id,
   usedAt: null,
  },
 });

 const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

 const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

 await prisma.passwordResetToken.create({
  data: {
   userId: user.id,
   tokenHash,
   expiresAt,
  },
 });

 const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

 await sendPasswordResetEmail(email, resetUrl);

 res.status(200).json({
  message: "Jika email terdaftar, instruksi reset password akan dikirim.",
 });
});

export const resetPassword = catchAsync(async (req, res) => {
 const { token, newPassword } = req.body;

 const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

 const resetToken = await prisma.passwordResetToken.findUnique({
  where: { tokenHash },
 });

 if (!resetToken) {
  throw new AppError("Token reset password tidak valid", 400);
 }

 if (resetToken.usedAt) {
  throw new AppError("Token reset password sudah digunakan", 400);
 }

 if (resetToken.expiresAt < new Date()) {
  throw new AppError("Token reset password sudah kedaluwarsa", 400);
 }

 const passwordHash = await bcrypt.hash(newPassword, 12);

 await prisma.$transaction([
  prisma.user.update({
   where: { id: resetToken.userId },
   data: { passwordHash },
  }),
  prisma.passwordResetToken.update({
   where: { id: resetToken.id },
   data: { usedAt: new Date() },
  }),
 ]);

 res.status(200).json({
  message: "Password berhasil diubah",
 });
});
