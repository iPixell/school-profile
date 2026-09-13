import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

export const getStaff = async (_req: Request, res: Response) => {
 try {
  const staff = await prisma.staff.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });

  return res.status(200).json({
   message: "Data staff berhasil diambil",
   data: staff,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createStaff = async (req: Request, res: Response) => {
 try {
  const file = req.file;

  let photoUrl: string | undefined;

  if (file) {
   photoUrl = await uploadImage(
    file.buffer,
    `staff/photo-${Date.now()}`,
    file.mimetype,
   );
  }

  const staff = await prisma.staff.create({
   data: {
    ...req.body,
    photoUrl,
   },
  });

  return res.status(201).json({
   message: "Staff berhasil dibuat",
   data: staff,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateStaff = async (req: Request, res: Response) => {
 try {
  const staffId = Number(req.params.id);

  if (Number.isNaN(staffId)) {
   return res.status(400).json({
    message: "ID staff tidak valid",
   });
  }

  const existingStaff = await prisma.staff.findUnique({
   where: {
    id: staffId,
   },
  });

  if (!existingStaff) {
   return res.status(404).json({
    message: "Data staff tidak ditemukan",
   });
  }

  let photoUrl = existingStaff.photoUrl;

  if (req.file) {
   photoUrl = await uploadImage(
    req.file.buffer,
    `staff/photo-${Date.now()}`,
    req.file.mimetype,
   );

   if (existingStaff.photoUrl) {
    const oldFilePath = getFilePathFromUrl(existingStaff.photoUrl);
    await deleteImage(oldFilePath);
   }
  }

  const staff = await prisma.staff.update({
   where: {
    id: staffId,
   },
   data: {
    ...req.body,
    photoUrl,
   },
  });

  return res.status(200).json({
   message: "Data staff berhasil diperbarui",
   data: staff,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteStaff = async (req: Request, res: Response) => {
 try {
  const staffId = Number(req.params.id);

  if (Number.isNaN(staffId)) {
   return res.status(400).json({
    message: "ID staff tidak valid",
   });
  }

  const existingStaff = await prisma.staff.findUnique({
   where: {
    id: staffId,
   },
  });

  if (!existingStaff) {
   return res.status(404).json({
    message: "Data staff tidak ditemukan",
   });
  }

  if (existingStaff.photoUrl) {
   const filePath = getFilePathFromUrl(existingStaff.photoUrl);
   await deleteImage(filePath);
  }

  await prisma.staff.delete({
   where: {
    id: staffId,
   },
  });

  return res.status(200).json({
   message: "Data staff berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
