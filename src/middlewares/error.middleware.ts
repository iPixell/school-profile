import type { Request, Response, NextFunction } from "express";
import multer from "multer";

import { AppError } from "../utils/AppError.js";
import { ValidationError } from "../utils/ValidationError.js";
import { logger } from "../utils/logger.js";

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

 if (error instanceof multer.MulterError) {
  if (error.code === "LIMIT_FILE_SIZE") {
   return res.status(400).json({
    success: false,
    message: "Ukuran file melebihi batas yang diizinkan",
   });
  }

  return res.status(400).json({
   success: false,
   message: "File upload tidak valid",
  });
 }

 if (
  error instanceof Error &&
  (error.message === "File harus berupa gambar" ||
   error.message === "File harus berupa gambar atau video")
 ) {
  return res.status(400).json({
   success: false,
   message: error.message,
  });
 }

 logger.error(
  {
   event: "UNHANDLED_ERROR",
   error,
  },
  "Terjadi kesalahan yang tidak tertangani",
 );

 return res.status(500).json({
  success: false,
  message: "Terjadi kesalahan pada server",
 });
};
