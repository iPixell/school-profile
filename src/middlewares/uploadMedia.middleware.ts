import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

export const uploadMedia = multer({
 storage,
 limits: {
  fileSize: 50 * 1024 * 1024,
 },
 fileFilter: (_req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");

  if (!isImage && !isVideo) {
   return cb(new Error("File harus berupa gambar atau video"));
  }

  cb(null, true);
 },
});

export const validateMediaFileSize = (
 req: Request,
 _res: Response,
 next: NextFunction,
) => {
 const file = req.file;

 if (!file) {
  return next();
 }

 const isImage = file.mimetype.startsWith("image/");
 const isVideo = file.mimetype.startsWith("video/");

 if (isImage && file.size > 5 * 1024 * 1024) {
  return next(new AppError("Ukuran foto maksimal 5 MB", 400));
 }

 if (isVideo && file.size > 50 * 1024 * 1024) {
  return next(new AppError("Ukuran video maksimal 50 MB", 400));
 }

 next();
};
