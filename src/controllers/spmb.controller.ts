import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import crypto from "crypto";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";

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
 const file = req.file;

 let photoUrl: string | undefined;

 if (file) {
  photoUrl = await uploadImage(
   file.buffer,
   `spmb/photo-${Date.now()}-${crypto.randomUUID()}`,
   file.mimetype,
  );
 }

 const spmb = await prisma.spmb.create({
  data: {
   title: req.body.title,
   description: req.body.description,
   photoUrl,
   portalUrl: req.body.portalUrl,
  },
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

 let photoUrl = existingSpmb.photoUrl;

 if (req.file) {
  photoUrl = await uploadImage(
   req.file.buffer,
   `spmb/photo-${Date.now()}-${crypto.randomUUID()}`,
   req.file.mimetype,
  );

  if (existingSpmb.photoUrl) {
   const oldFilePath = getFilePathFromUrl(existingSpmb.photoUrl);
   await deleteImage(oldFilePath);
  }
 }

 const spmb = await prisma.spmb.update({
  where: { id: spmbId },
  data: {
   title: req.body.title,
   description: req.body.description,
   photoUrl,
   portalUrl: req.body.portalUrl,
  },
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

 if (existingSpmb.photoUrl) {
  const filePath = getFilePathFromUrl(existingSpmb.photoUrl);
  await deleteImage(filePath);
 }

 await prisma.spmb.delete({
  where: { id: spmbId },
 });

 res.status(200).json({
  message: "Data SPMB berhasil dihapus",
 });
});
