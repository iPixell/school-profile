import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { ValidationError } from "../utils/ValidationError.js";

export const errorHandler = (
 error: unknown,
 _req: Request,
 res: Response,
 _next: NextFunction,
) => {
 if (error instanceof ValidationError) {
  return res.status(error.statusCode).json({
   success: false,
   message: error.message,
   errors: error.errors,
  });
 }

 if (error instanceof AppError) {
  return res.status(error.statusCode).json({
   success: false,
   message: error.message,
  });
 }

 console.error(error);

 return res.status(500).json({
  success: false,
  message: "Terjadi kesalahan pada server",
 });
};
