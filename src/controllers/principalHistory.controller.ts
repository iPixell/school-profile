import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getPrincipalHistories = catchAsync(
 async (_req: Request, res: Response) => {
  const data = await prisma.principalHistory.findMany({
   orderBy: { createdAt: "asc" },
  });

  res.status(200).json({
   message: "Riwayat pejabat kepala sekolah berhasil diambil",
   data,
  });
 },
);

export const createPrincipalHistory = catchAsync(
 async (req: Request, res: Response) => {
  const { name, period } = req.body;

  const data = await prisma.principalHistory.create({
   data: {
    name,
    period,
   },
  });

  res.status(201).json({
   message: "Riwayat pejabat kepala sekolah berhasil ditambahkan",
   data,
  });
 },
);

export const updatePrincipalHistory = catchAsync(
 async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await prisma.principalHistory.findUnique({
   where: { id },
  });

  if (!existing) {
   throw new AppError(
    "Data riwayat pejabat kepala sekolah tidak ditemukan",
    404,
   );
  }

  const data = await prisma.principalHistory.update({
   where: { id },
   data: req.body,
  });

  res.status(200).json({
   message: "Riwayat pejabat kepala sekolah berhasil diperbarui",
   data,
  });
 },
);

export const deletePrincipalHistory = catchAsync(
 async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await prisma.principalHistory.findUnique({
   where: { id },
  });

  if (!existing) {
   throw new AppError(
    "Data riwayat pejabat kepala sekolah tidak ditemukan",
    404,
   );
  }

  await prisma.principalHistory.delete({
   where: { id },
  });

  res.status(200).json({
   message: "Riwayat pejabat kepala sekolah berhasil dihapus",
  });
 },
);
