import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

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

  const schoolProfile = await prisma.schoolProfile.create({
   data: req.body,
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
