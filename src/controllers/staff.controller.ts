import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getStaff = async (_req: Request, res: Response) => {
 try {
  const staff = await prisma.staff.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });

  return res.status(200).json({
   message: "Data staff berhasil diambil",
   data: staff,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createStaff = async (req: Request, res: Response) => {
 try {
  const staff = await prisma.staff.create({
   data: req.body,
  });

  return res.status(201).json({
   message: "Data staff berhasil dibuat",
   data: staff,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
