import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

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
