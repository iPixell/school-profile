import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
 user?: {
  userId: number;
  email: string;
 };
}

export const authenticate = (
 req: AuthRequest,
 res: Response,
 next: NextFunction,
): void => {
 try {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
   res.status(401).json({
    message: "Access token diperlukan",
   });
   return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
   res.status(401).json({
    message: "Format Authorization tidak valid",
   });
   return;
  }

  const payload = verifyAccessToken(token);

  req.user = {
   userId: payload.userId,
   email: payload.email,
  };

  next();
 } catch (error) {
  console.error(error);

  res.status(401).json({
   message: "Access token tidak valid atau sudah kedaluwarsa",
  });
 }
};
