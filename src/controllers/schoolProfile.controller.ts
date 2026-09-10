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
