import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getSocialMedias = async (_req: Request, res: Response) => {
 try {
  const socialMedias = await prisma.socialMedia.findMany({
   orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
   message: "Data media sosial berhasil diambil",
   data: socialMedias,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createSocialMedia = async (req: Request, res: Response) => {
 try {
  const socialMedia = await prisma.socialMedia.create({
   data: req.body,
  });

  return res.status(201).json({
   message: "Data media sosial berhasil dibuat",
   data: socialMedia,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateSocialMedia = async (req: Request, res: Response) => {
 try {
  const socialMediaId = Number(req.params.id);

  if (Number.isNaN(socialMediaId)) {
   return res.status(400).json({
    message: "ID media sosial tidak valid",
   });
  }

  const existingSocialMedia = await prisma.socialMedia.findUnique({
   where: { id: socialMediaId },
  });

  if (!existingSocialMedia) {
   return res.status(404).json({
    message: "Data media sosial tidak ditemukan",
   });
  }

  const socialMedia = await prisma.socialMedia.update({
   where: { id: socialMediaId },
   data: req.body,
  });

  return res.status(200).json({
   message: "Data media sosial berhasil diperbarui",
   data: socialMedia,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteSocialMedia = async (req: Request, res: Response) => {
 try {
  const socialMediaId = Number(req.params.id);

  if (Number.isNaN(socialMediaId)) {
   return res.status(400).json({
    message: "ID media sosial tidak valid",
   });
  }

  const existingSocialMedia = await prisma.socialMedia.findUnique({
   where: { id: socialMediaId },
  });

  if (!existingSocialMedia) {
   return res.status(404).json({
    message: "Data media sosial tidak ditemukan",
   });
  }

  await prisma.socialMedia.delete({
   where: { id: socialMediaId },
  });

  return res.status(200).json({
   message: "Data media sosial berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
