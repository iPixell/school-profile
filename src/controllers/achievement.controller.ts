import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

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
    ...req.body,
    photoUrl,
   },
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
    ...req.body,
    photoUrl,
   },
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

    if (existingAchievement.photoUrl) {
      const filePath = getFilePathFromUrl(existingAchievement.photoUrl);
      await deleteImage(filePath);
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
