import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getAchievements = catchAsync(async (_req, res) => {
 const achievements = await prisma.achievement.findMany({
  orderBy: {
   createdAt: "desc",
  },
 });

 res.status(200).json({
  message: "Data prestasi berhasil diambil",
  data: achievements,
 });
});

export const getLatestAchievements = catchAsync(async (_req, res) => {
 const achievements = await prisma.achievement.findMany({
  orderBy: {
   createdAt: "desc",
  },
  take: 3,
 });

 res.status(200).json({
  message: "3 prestasi terbaru berhasil diambil",
  data: achievements,
 });
});

export const createAchievement = catchAsync(async (req, res) => {
 const file = req.file;

 let photoUrl: string | undefined;

 if (file) {
  photoUrl = await uploadImage(
   file.buffer,
   `achievements/photo-${Date.now()}`,
   file.mimetype,
  );
 }

 const achievement = await prisma.achievement.create({
  data: {
   competition: req.body.competition,
   studentName: req.body.studentName,
   rank: req.body.rank,
   level: req.body.level,
   year: Number(req.body.year),
   photoUrl,
  },
 });

 res.status(201).json({
  message: "Data prestasi berhasil dibuat",
  data: achievement,
 });
});

export const updateAchievement = catchAsync(async (req, res) => {
 const achievementId = Number(req.params.id);

 if (Number.isNaN(achievementId)) {
  throw new AppError("ID prestasi tidak valid", 400);
 }

 const existingAchievement = await prisma.achievement.findUnique({
  where: {
   id: achievementId,
  },
 });

 if (!existingAchievement) {
  throw new AppError("Data prestasi tidak ditemukan", 404);
 }

 let photoUrl = existingAchievement.photoUrl;

 if (req.file) {
  photoUrl = await uploadImage(
   req.file.buffer,
   `achievements/photo-${Date.now()}`,
   req.file.mimetype,
  );

  if (existingAchievement.photoUrl) {
   const oldFilePath = getFilePathFromUrl(existingAchievement.photoUrl);
   await deleteImage(oldFilePath);
  }
 }

 const achievement = await prisma.achievement.update({
  where: {
   id: achievementId,
  },
  data: {
   competition: req.body.competition,
   studentName: req.body.studentName,
   rank: req.body.rank,
   level: req.body.level,
   year:
    req.body.year !== undefined
     ? Number(req.body.year)
     : existingAchievement.year,
   photoUrl,
  },
 });

 res.status(200).json({
  message: "Data prestasi berhasil diperbarui",
  data: achievement,
 });
});

export const deleteAchievement = catchAsync(async (req, res) => {
 const achievementId = Number(req.params.id);

 if (Number.isNaN(achievementId)) {
  throw new AppError("ID prestasi tidak valid", 400);
 }

 const existingAchievement = await prisma.achievement.findUnique({
  where: {
   id: achievementId,
  },
 });

 if (!existingAchievement) {
  throw new AppError("Data prestasi tidak ditemukan", 404);
 }

 if (existingAchievement.photoUrl) {
  const filePath = getFilePathFromUrl(existingAchievement.photoUrl);
  await deleteImage(filePath);
 }

 await prisma.achievement.delete({
  where: {
   id: achievementId,
  },
 });

 res.status(200).json({
  message: "Data prestasi berhasil dihapus",
 });
});
