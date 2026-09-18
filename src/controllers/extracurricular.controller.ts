import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getExtracurriculars = catchAsync(async (_req, res) => {
 const extracurriculars = await prisma.extracurricular.findMany({
  orderBy: {
   createdAt: "desc",
  },
 });

 res.status(200).json({
  message: "Data ekstrakurikuler berhasil diambil",
  data: extracurriculars,
 });
});

export const getExtracurricularById = catchAsync(async (req, res) => {
 const extracurricularId = Number(req.params.id);

 if (Number.isNaN(extracurricularId)) {
  throw new AppError("ID ekstrakurikuler tidak valid", 400);
 }

 const extracurricular = await prisma.extracurricular.findUnique({
  where: {
   id: extracurricularId,
  },
  include: {
   media: {
    orderBy: {
     createdAt: "desc",
    },
   },
  },
 });

 if (!extracurricular) {
  throw new AppError("Data ekstrakurikuler tidak ditemukan", 404);
 }

 res.status(200).json({
  message: "Detail ekstrakurikuler berhasil diambil",
  data: extracurricular,
 });
});

export const createExtracurricular = catchAsync(async (req, res) => {
 const file = req.file;

 let photoUrl: string | undefined;

 if (file) {
  photoUrl = await uploadImage(
   file.buffer,
   `extracurriculars/photo-${Date.now()}-${crypto.randomUUID()}`,
   file.mimetype,
  );
 }

 const extracurricular = await prisma.extracurricular.create({
  data: {
   name: req.body.name,
   photoUrl,
  },
 });

 res.status(201).json({
  message: "Data ekstrakurikuler berhasil dibuat",
  data: extracurricular,
 });
});

export const updateExtracurricular = catchAsync(async (req, res) => {
 const extracurricularId = Number(req.params.id);

 if (Number.isNaN(extracurricularId)) {
  throw new AppError("ID ekstrakurikuler tidak valid", 400);
 }

 const existingExtracurricular = await prisma.extracurricular.findUnique({
  where: {
   id: extracurricularId,
  },
 });

 if (!existingExtracurricular) {
  throw new AppError("Data ekstrakurikuler tidak ditemukan", 404);
 }

 let photoUrl = existingExtracurricular.photoUrl;

 if (req.file) {
  photoUrl = await uploadImage(
   req.file.buffer,
   `extracurriculars/photo-${Date.now()}-${crypto.randomUUID()}`,
   req.file.mimetype,
  );

  if (existingExtracurricular.photoUrl) {
   const oldFilePath = getFilePathFromUrl(existingExtracurricular.photoUrl);

   await deleteImage(oldFilePath);
  }
 }

 const extracurricular = await prisma.extracurricular.update({
  where: {
   id: extracurricularId,
  },
  data: {
   name: req.body.name,
   photoUrl,
  },
 });

 res.status(200).json({
  message: "Data ekstrakurikuler berhasil diperbarui",
  data: extracurricular,
 });
});

export const deleteExtracurricular = catchAsync(async (req, res) => {
 const extracurricularId = Number(req.params.id);

 if (Number.isNaN(extracurricularId)) {
  throw new AppError("ID ekstrakurikuler tidak valid", 400);
 }

 const existingExtracurricular = await prisma.extracurricular.findUnique({
  where: {
   id: extracurricularId,
  },
  include: {
   media: true,
  },
 });

 if (!existingExtracurricular) {
  throw new AppError("Data ekstrakurikuler tidak ditemukan", 404);
 }

 if (existingExtracurricular.photoUrl) {
  const filePath = getFilePathFromUrl(existingExtracurricular.photoUrl);

  await deleteImage(filePath);
 }

 for (const media of existingExtracurricular.media) {
  const filePath = getFilePathFromUrl(media.url);

  await deleteImage(filePath);
 }

 await prisma.extracurricular.delete({
  where: {
   id: extracurricularId,
  },
 });

 res.status(200).json({
  message: "Data ekstrakurikuler berhasil dihapus",
 });
});
