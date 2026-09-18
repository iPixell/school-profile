import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import {
 generateRefreshToken,
 hashRefreshToken,
} from "../utils/refreshToken.js";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

const setRefreshTokenCookie = (res: Response, token: string) => {
 res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  path: "/api/auth",
 });
};

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

 const refreshToken = generateRefreshToken();
 const refreshTokenHash = hashRefreshToken(refreshToken);

 const expiresAt = new Date(
  Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
 );

 await prisma.refreshSession.create({
  data: {
   userId: user.id,
   tokenHash: refreshTokenHash,
   expiresAt,
  },
 });

 setRefreshTokenCookie(res, refreshToken);

 res.status(200).json({
  message: "Login berhasil",
  accessToken,
  user: {
   id: user.id,
   email: user.email,
  },
 });
});

export const refreshAccessToken = catchAsync(async (req, res) => {
 const refreshToken = req.cookies?.refreshToken;

 if (!refreshToken) {
  throw new AppError("Refresh token diperlukan", 401);
 }

 const tokenHash = hashRefreshToken(refreshToken);

 const session = await prisma.refreshSession.findUnique({
  where: {
   tokenHash,
  },
  include: {
   user: true,
  },
 });

 if (!session) {
  throw new AppError("Refresh token tidak valid", 401);
 }

 if (session.revokedAt) {
  throw new AppError("Refresh token sudah tidak berlaku", 401);
 }

 if (session.expiresAt < new Date()) {
  throw new AppError("Refresh token sudah kedaluwarsa", 401);
 }

 const newAccessToken = generateAccessToken({
  userId: session.user.id,
  email: session.user.email,
 });

 const newRefreshToken = generateRefreshToken();
 const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

 const newExpiresAt = new Date(
  Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
 );

 await prisma.$transaction([
  prisma.refreshSession.update({
   where: {
    id: session.id,
   },
   data: {
    revokedAt: new Date(),
   },
  }),
  prisma.refreshSession.create({
   data: {
    userId: session.user.id,
    tokenHash: newRefreshTokenHash,
    expiresAt: newExpiresAt,
   },
  }),
 ]);

 setRefreshTokenCookie(res, newRefreshToken);

 res.status(200).json({
  message: "Access token berhasil diperbarui",
  accessToken: newAccessToken,
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

 const frontendUrl = process.env.FRONTEND_URL;

 if (!frontendUrl) {
  throw new AppError("FRONTEND_URL belum dikonfigurasi", 500);
 }

 const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
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
  prisma.refreshSession.updateMany({
   where: {
    userId: resetToken.userId,
    revokedAt: null,
   },
   data: {
    revokedAt: new Date(),
   },
  }),
 ]);

 res.status(200).json({
  message: "Password berhasil diubah",
 });
});

export const logout = catchAsync(async (req, res) => {
 const refreshToken = req.cookies?.refreshToken;

 if (refreshToken) {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshSession.updateMany({
   where: {
    tokenHash,
    revokedAt: null,
   },
   data: {
    revokedAt: new Date(),
   },
  });
 }

 res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
 });

 res.status(200).json({
  message: "Logout berhasil",
 });
});
