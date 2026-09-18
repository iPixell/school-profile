import type { Response } from "express";
import crypto from "crypto";
import type { AuthRequest } from "../middlewares/authenticate.middleware.js";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const addExtracurricularMedia = catchAsync(
 async (req: AuthRequest, res: Response) => {
  const extracurricularId = Number(req.params.id);

  if (!Number.isInteger(extracurricularId)) {
   throw new AppError("ID ekstrakurikuler tidak valid", 400);
  }

  if (!req.file) {
   throw new AppError("File dokumentasi wajib diupload", 400);
  }

  const extracurricular = await prisma.extracurricular.findUnique({
   where: {
    id: extracurricularId,
   },
  });

  if (!extracurricular) {
   throw new AppError("Data ekstrakurikuler tidak ditemukan", 404);
  }

  const type = req.file.mimetype.startsWith("video/") ? "VIDEO" : "IMAGE";

  const fileExtension = req.file.originalname.split(".").pop() || "bin";

  const filePath = `extracurricular/${extracurricularId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

  const url = await uploadImage(req.file.buffer, filePath, req.file.mimetype);

  const media = await prisma.extracurricularMedia.create({
   data: {
    extracurricularId,
    type,
    url,
   },
  });

  res.status(201).json({
   success: true,
   message: "Dokumentasi ekstrakurikuler berhasil ditambahkan",
   data: media,
  });
 },
);

export const deleteExtracurricularMedia = catchAsync(
 async (req: AuthRequest, res: Response) => {
  const extracurricularId = Number(req.params.id);
  const mediaId = Number(req.params.mediaId);

  if (!Number.isInteger(extracurricularId)) {
   throw new AppError("ID ekstrakurikuler tidak valid", 400);
  }

  if (!Number.isInteger(mediaId)) {
   throw new AppError("ID dokumentasi tidak valid", 400);
  }

  const media = await prisma.extracurricularMedia.findFirst({
   where: {
    id: mediaId,
    extracurricularId,
   },
  });

  if (!media) {
   throw new AppError("Dokumentasi ekstrakurikuler tidak ditemukan", 404);
  }

  const filePath = getFilePathFromUrl(media.url);

  await deleteImage(filePath);

  await prisma.extracurricularMedia.delete({
   where: {
    id: mediaId,
   },
  });

  res.status(200).json({
   success: true,
   message: "Dokumentasi ekstrakurikuler berhasil dihapus",
  });
 },
);
