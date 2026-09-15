import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export interface AuthRequest extends Request {
 user?: {
  userId: number;
  email: string;
 };
}

export const authenticate = (
 req: AuthRequest,
 _res: Response,
 next: NextFunction,
): void => {
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

  req.user = {
   userId: payload.userId,
   email: payload.email,
  };

  next();
 } catch {
  throw new AppError("Access token tidak valid atau sudah kedaluwarsa", 401);
 }
};
