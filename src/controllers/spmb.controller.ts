import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getSpmb = async (_req: Request, res: Response) => {
 try {
  const spmb = await prisma.spmb.findMany({
   orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
   message: "Data SPMB berhasil diambil",
   data: spmb,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createSpmb = async (req: Request, res: Response) => {
 try {
  const spmb = await prisma.spmb.create({
   data: req.body,
  });

  return res.status(201).json({
   message: "Data SPMB berhasil dibuat",
   data: spmb,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateSpmb = async (req: Request, res: Response) => {
 try {
  const spmbId = Number(req.params.id);

  if (Number.isNaN(spmbId)) {
   return res.status(400).json({
    message: "ID SPMB tidak valid",
   });
  }

  const existingSpmb = await prisma.spmb.findUnique({
   where: { id: spmbId },
  });

  if (!existingSpmb) {
   return res.status(404).json({
    message: "Data SPMB tidak ditemukan",
   });
  }

  const spmb = await prisma.spmb.update({
   where: { id: spmbId },
   data: req.body,
  });

  return res.status(200).json({
   message: "Data SPMB berhasil diperbarui",
   data: spmb,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteSpmb = async (req: Request, res: Response) => {
 try {
  const spmbId = Number(req.params.id);

  if (Number.isNaN(spmbId)) {
   return res.status(400).json({
    message: "ID SPMB tidak valid",
   });
  }

  const existingSpmb = await prisma.spmb.findUnique({
   where: { id: spmbId },
  });

  if (!existingSpmb) {
   return res.status(404).json({
    message: "Data SPMB tidak ditemukan",
   });
  }

  await prisma.spmb.delete({
   where: { id: spmbId },
  });

  return res.status(200).json({
   message: "Data SPMB berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
