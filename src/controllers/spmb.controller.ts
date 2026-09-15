import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getSpmb = catchAsync(async (_req, res) => {
 const spmb = await prisma.spmb.findMany({
  orderBy: { createdAt: "desc" },
 });

 res.status(200).json({
  message: "Data SPMB berhasil diambil",
  data: spmb,
 });
});

export const createSpmb = catchAsync(async (req, res) => {
 const spmb = await prisma.spmb.create({
  data: req.body,
 });

 res.status(201).json({
  message: "Data SPMB berhasil dibuat",
  data: spmb,
 });
});

export const updateSpmb = catchAsync(async (req, res) => {
 const spmbId = Number(req.params.id);

 if (Number.isNaN(spmbId)) {
  throw new AppError("ID SPMB tidak valid", 400);
 }

 const existingSpmb = await prisma.spmb.findUnique({
  where: { id: spmbId },
 });

 if (!existingSpmb) {
  throw new AppError("Data SPMB tidak ditemukan", 404);
 }

 const spmb = await prisma.spmb.update({
  where: { id: spmbId },
  data: req.body,
 });

 res.status(200).json({
  message: "Data SPMB berhasil diperbarui",
  data: spmb,
 });
});

export const deleteSpmb = catchAsync(async (req, res) => {
 const spmbId = Number(req.params.id);

 if (Number.isNaN(spmbId)) {
  throw new AppError("ID SPMB tidak valid", 400);
 }

 const existingSpmb = await prisma.spmb.findUnique({
  where: { id: spmbId },
 });

 if (!existingSpmb) {
  throw new AppError("Data SPMB tidak ditemukan", 404);
 }

 await prisma.spmb.delete({
  where: { id: spmbId },
 });

 res.status(200).json({
  message: "Data SPMB berhasil dihapus",
 });
});
