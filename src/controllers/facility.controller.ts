import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

export const getFacilities = async (_req: Request, res: Response) => {
 try {
  const facilities = await prisma.facility.findMany({
   orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
   message: "Data fasilitas berhasil diambil",
   data: facilities,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createFacility = async (req: Request, res: Response) => {
 try {
  const file = req.file;

  let photoUrl: string | undefined;

  if (file) {
   photoUrl = await uploadImage(
    file.buffer,
    `facilities/photo-${Date.now()}`,
    file.mimetype,
   );
  }

  const facility = await prisma.facility.create({
   data: {
    ...req.body,
    photoUrl,
   },
  });

  return res.status(201).json({
   message: "Data fasilitas berhasil dibuat",
   data: facility,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateFacility = async (req: Request, res: Response) => {
 try {
  const facilityId = Number(req.params.id);

  if (Number.isNaN(facilityId)) {
   return res.status(400).json({
    message: "ID fasilitas tidak valid",
   });
  }

  const existingFacility = await prisma.facility.findUnique({
   where: {
    id: facilityId,
   },
  });

  if (!existingFacility) {
   return res.status(404).json({
    message: "Data fasilitas tidak ditemukan",
   });
  }

  let photoUrl = existingFacility.photoUrl;

  if (req.file) {
   photoUrl = await uploadImage(
    req.file.buffer,
    `facilities/photo-${Date.now()}`,
    req.file.mimetype,
   );

   if (existingFacility.photoUrl) {
    const oldFilePath = getFilePathFromUrl(existingFacility.photoUrl);

    await deleteImage(oldFilePath);
   }
  }

  const facility = await prisma.facility.update({
   where: {
    id: facilityId,
   },
   data: {
    ...req.body,
    photoUrl,
   },
  });

  return res.status(200).json({
   message: "Data fasilitas berhasil diperbarui",
   data: facility,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteFacility = async (req: Request, res: Response) => {
 try {
  const facilityId = Number(req.params.id);

  if (Number.isNaN(facilityId)) {
   return res.status(400).json({
    message: "ID fasilitas tidak valid",
   });
  }

  const existingFacility = await prisma.facility.findUnique({
   where: {
    id: facilityId,
   },
  });

  if (!existingFacility) {
   return res.status(404).json({
    message: "Data fasilitas tidak ditemukan",
   });
  }

  if (existingFacility.photoUrl) {
   const filePath = getFilePathFromUrl(existingFacility.photoUrl);

   await deleteImage(filePath);
  }

  await prisma.facility.delete({
   where: {
    id: facilityId,
   },
  });

  return res.status(200).json({
   message: "Data fasilitas berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
