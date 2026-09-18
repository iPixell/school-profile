import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getSocialMedias = catchAsync(async (_req, res) => {
 const socialMedias = await prisma.socialMedia.findMany({
  orderBy: { createdAt: "desc" },
 });

 res.status(200).json({
  message: "Data media sosial berhasil diambil",
  data: socialMedias,
 });
});

export const createSocialMedia = catchAsync(async (req, res) => {
 const socialMedia = await prisma.socialMedia.create({
  data: {
   platform: req.body.platform,
   url: req.body.url,
  },
 });

 res.status(201).json({
  message: "Data media sosial berhasil dibuat",
  data: socialMedia,
 });
});

export const updateSocialMedia = catchAsync(async (req, res) => {
 const socialMediaId = Number(req.params.id);

 if (Number.isNaN(socialMediaId)) {
  throw new AppError("ID media sosial tidak valid", 400);
 }

 const existingSocialMedia = await prisma.socialMedia.findUnique({
  where: { id: socialMediaId },
 });

 if (!existingSocialMedia) {
  throw new AppError("Data media sosial tidak ditemukan", 404);
 }

 const socialMedia = await prisma.socialMedia.update({
  where: { id: socialMediaId },
  data: {
   platform: req.body.platform,
   url: req.body.url,
  },
 });

 res.status(200).json({
  message: "Data media sosial berhasil diperbarui",
  data: socialMedia,
 });
});

export const deleteSocialMedia = catchAsync(async (req, res) => {
 const socialMediaId = Number(req.params.id);

 if (Number.isNaN(socialMediaId)) {
  throw new AppError("ID media sosial tidak valid", 400);
 }

 const existingSocialMedia = await prisma.socialMedia.findUnique({
  where: { id: socialMediaId },
 });

 if (!existingSocialMedia) {
  throw new AppError("Data media sosial tidak ditemukan", 404);
 }

 await prisma.socialMedia.delete({
  where: { id: socialMediaId },
 });

 res.status(200).json({
  message: "Data media sosial berhasil dihapus",
 });
});
