import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

export const getExtracurriculars = async (_req: Request, res: Response) => {
 try {
  const extracurriculars = await prisma.extracurricular.findMany({
   orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
   message: "Data ekstrakurikuler berhasil diambil",
   data: extracurriculars,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createExtracurricular = async (req: Request, res: Response) => {
 try {
  const file = req.file;

  let photoUrl: string | undefined;

  if (file) {
   photoUrl = await uploadImage(
    file.buffer,
    `extracurriculars/photo-${Date.now()}`,
    file.mimetype,
   );
  }

  const extracurricular = await prisma.extracurricular.create({
   data: {
    ...req.body,
    photoUrl,
   },
  });

  return res.status(201).json({
   message: "Data ekstrakurikuler berhasil dibuat",
   data: extracurricular,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateExtracurricular = async (req: Request, res: Response) => {
 try {
  const extracurricularId = Number(req.params.id);

  if (Number.isNaN(extracurricularId)) {
   return res.status(400).json({
    message: "ID ekstrakurikuler tidak valid",
   });
  }

  const existingExtracurricular = await prisma.extracurricular.findUnique({
   where: {
    id: extracurricularId,
   },
  });

  if (!existingExtracurricular) {
   return res.status(404).json({
    message: "Data ekstrakurikuler tidak ditemukan",
   });
  }

  let photoUrl = existingExtracurricular.photoUrl;

  if (req.file) {
   photoUrl = await uploadImage(
    req.file.buffer,
    `extracurriculars/photo-${Date.now()}`,
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
    ...req.body,
    photoUrl,
   },
  });

  return res.status(200).json({
   message: "Data ekstrakurikuler berhasil diperbarui",
   data: extracurricular,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteExtracurricular = async (req: Request, res: Response) => {
 try {
  const extracurricularId = Number(req.params.id);

  if (Number.isNaN(extracurricularId)) {
   return res.status(400).json({
    message: "ID ekstrakurikuler tidak valid",
   });
  }

  const existingExtracurricular = await prisma.extracurricular.findUnique({
   where: {
    id: extracurricularId,
   },
  });

  if (!existingExtracurricular) {
   return res.status(404).json({
    message: "Data ekstrakurikuler tidak ditemukan",
   });
  }

  if (existingExtracurricular.photoUrl) {
   const filePath = getFilePathFromUrl(existingExtracurricular.photoUrl);

   await deleteImage(filePath);
  }

  await prisma.extracurricular.delete({
   where: {
    id: extracurricularId,
   },
  });

  return res.status(200).json({
   message: "Data ekstrakurikuler berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
