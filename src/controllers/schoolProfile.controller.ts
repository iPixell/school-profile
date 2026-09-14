import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

export const getSchoolProfile = async (_req: Request, res: Response) => {
 try {
  const schoolProfile = await prisma.schoolProfile.findFirst();

  if (!schoolProfile) {
   return res.status(404).json({
    message: "Data profil sekolah belum tersedia",
   });
  }

  return res.status(200).json({
   message: "Data profil sekolah berhasil diambil",
   data: schoolProfile,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createSchoolProfile = async (req: Request, res: Response) => {
 try {
  const existingProfile = await prisma.schoolProfile.findFirst();

  if (existingProfile) {
   return res.status(409).json({
    message: "Profil sekolah sudah tersedia",
   });
  }

  const files = req.files as {
   banner?: Express.Multer.File[];
   logo?: Express.Multer.File[];
  };

  let bannerUrl: string | undefined;
  let logoUrl: string | undefined;

  if (files?.banner?.[0]) {
   bannerUrl = await uploadImage(
    files.banner[0].buffer,
    `school-profile/banner-${Date.now()}`,
    files.banner[0].mimetype,
   );
  }

  if (files?.logo?.[0]) {
   logoUrl = await uploadImage(
    files.logo[0].buffer,
    `school-profile/logo-${Date.now()}`,
    files.logo[0].mimetype,
   );
  }

  const schoolProfile = await prisma.schoolProfile.create({
   data: {
    ...req.body,
    bannerUrl,
    logoUrl,
   },
  });

  return res.status(201).json({
   message: "Profil sekolah berhasil dibuat",
   data: schoolProfile,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateSchoolProfile = async (req: Request, res: Response) => {
 try {
  const existingProfile = await prisma.schoolProfile.findFirst();

  if (!existingProfile) {
   return res.status(404).json({
    message: "Data profil sekolah belum tersedia",
   });
  }

  const files = req.files as {
   banner?: Express.Multer.File[];
   logo?: Express.Multer.File[];
  };

  let bannerUrl = existingProfile.bannerUrl;
  let logoUrl = existingProfile.logoUrl;

  if (files?.banner?.[0]) {
   const newBannerPath = `school-profile/banner-${Date.now()}`;

   bannerUrl = await uploadImage(
    files.banner[0].buffer,
    newBannerPath,
    files.banner[0].mimetype,
   );

   if (existingProfile.bannerUrl) {
    const oldBannerPath = getFilePathFromUrl(existingProfile.bannerUrl);

    await deleteImage(oldBannerPath);
   }
  }

  if (files?.logo?.[0]) {
   const newLogoPath = `school-profile/logo-${Date.now()}`;

   logoUrl = await uploadImage(
    files.logo[0].buffer,
    newLogoPath,
    files.logo[0].mimetype,
   );

   if (existingProfile.logoUrl) {
    const oldLogoPath = getFilePathFromUrl(existingProfile.logoUrl);

    await deleteImage(oldLogoPath);
   }
  }

  const schoolProfile = await prisma.schoolProfile.update({
   where: {
    id: existingProfile.id,
   },
   data: {
    ...req.body,
    bannerUrl,
    logoUrl,
   },
  });

  return res.status(200).json({
   message: "Profil sekolah berhasil diperbarui",
   data: schoolProfile,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteSchoolProfile = async (req: Request, res: Response) => {
 try {
  const schoolProfile = await prisma.schoolProfile.findFirst();

  if (!schoolProfile) {
   return res.status(404).json({
    message: "Data profil sekolah tidak ditemukan",
   });
  }

  if (schoolProfile.bannerUrl) {
   const bannerPath = getFilePathFromUrl(schoolProfile.bannerUrl);
   await deleteImage(bannerPath);
  }

  if (schoolProfile.logoUrl) {
   const logoPath = getFilePathFromUrl(schoolProfile.logoUrl);
   await deleteImage(logoPath);
  }

  await prisma.schoolProfile.delete({
   where: {
    id: schoolProfile.id,
   },
  });

  return res.status(200).json({
   message: "Data profil sekolah berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
