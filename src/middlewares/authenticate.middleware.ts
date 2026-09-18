import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { prisma } from "../config/prisma.js";

export interface AuthRequest extends Request {
 user?: {
  userId: number;
  email: string;
 };
}

export const authenticate = async (
 req: AuthRequest,
 _res: Response,
 next: NextFunction,
): Promise<void> => {
 const authHeader = req.headers.authorization;

 if (!authHeader) {
  throw new AppError("Access token diperlukan", 401);
 }

 const [type, token] = authHeader.split(" ");

 if (type !== "Bearer" || !token) {
  throw new AppError("Format Authorization tidak valid", 401);
 }

 try {
  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
   where: { id: payload.userId },
  });

  if (!user) {
   throw new AppError("User tidak ditemukan", 401);
  }

  req.user = {
   userId: user.id,
   email: user.email,
  };

  next();
 } catch (error) {
  if (error instanceof AppError) {
   throw error;
  }

  throw new AppError("Access token tidak valid atau sudah kedaluwarsa", 401);
 }
};
