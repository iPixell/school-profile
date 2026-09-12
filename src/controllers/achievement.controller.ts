import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getAchievements = async (_req: Request, res: Response) => {
 try {
  const achievements = await prisma.achievement.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });

  return res.status(200).json({
   message: "Data prestasi berhasil diambil",
   data: achievements,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const getLatestAchievements = async (_req: Request, res: Response) => {
 try {
  const achievements = await prisma.achievement.findMany({
   orderBy: {
    createdAt: "desc",
   },
   take: 3,
  });

  return res.status(200).json({
   message: "3 prestasi terbaru berhasil diambil",
   data: achievements,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createAchievement = async (req: Request, res: Response) => {
 try {
  const achievement = await prisma.achievement.create({
   data: req.body,
  });

  return res.status(201).json({
   message: "Data prestasi berhasil dibuat",
   data: achievement,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateAchievement = async (req: Request, res: Response) => {
 try {
  const achievementId = Number(req.params.id);

  if (Number.isNaN(achievementId)) {
   return res.status(400).json({
    message: "ID prestasi tidak valid",
   });
  }

  const existingAchievement = await prisma.achievement.findUnique({
   where: {
    id: achievementId,
   },
  });

  if (!existingAchievement) {
   return res.status(404).json({
    message: "Data prestasi tidak ditemukan",
   });
  }

  const achievement = await prisma.achievement.update({
   where: {
    id: achievementId,
   },
   data: req.body,
  });

  return res.status(200).json({
   message: "Data prestasi berhasil diperbarui",
   data: achievement,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteAchievement = async (req: Request, res: Response) => {
 try {
  const achievementId = Number(req.params.id);

  if (Number.isNaN(achievementId)) {
   return res.status(400).json({
    message: "ID prestasi tidak valid",
   });
  }

  const existingAchievement = await prisma.achievement.findUnique({
   where: {
    id: achievementId,
   },
  });

  if (!existingAchievement) {
   return res.status(404).json({
    message: "Data prestasi tidak ditemukan",
   });
  }

  await prisma.achievement.delete({
   where: {
    id: achievementId,
   },
  });

  return res.status(200).json({
   message: "Data prestasi berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
