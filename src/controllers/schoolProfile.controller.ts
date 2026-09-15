import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getSchoolProfile = catchAsync(async (_req, res) => {
 const schoolProfile = await prisma.schoolProfile.findFirst();

 if (!schoolProfile) {
  throw new AppError("Data profil sekolah belum tersedia", 404);
 }

 res.status(200).json({
  message: "Data profil sekolah berhasil diambil",
  data: schoolProfile,
 });
});

export const createSchoolProfile = catchAsync(async (req, res) => {
 const existingProfile = await prisma.schoolProfile.findFirst();

 if (existingProfile) {
  throw new AppError("Profil sekolah sudah tersedia", 409);
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

 res.status(201).json({
  message: "Profil sekolah berhasil dibuat",
  data: schoolProfile,
 });
});

export const updateSchoolProfile = catchAsync(async (req, res) => {
 const existingProfile = await prisma.schoolProfile.findFirst();

 if (!existingProfile) {
  throw new AppError("Data profil sekolah belum tersedia", 404);
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

 res.status(200).json({
  message: "Profil sekolah berhasil diperbarui",
  data: schoolProfile,
 });
});

export const deleteSchoolProfile = catchAsync(async (req, res) => {
 const schoolProfile = await prisma.schoolProfile.findFirst();

 if (!schoolProfile) {
  throw new AppError("Data profil sekolah tidak ditemukan", 404);
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

 res.status(200).json({
  message: "Data profil sekolah berhasil dihapus",
 });
});
