import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getStaff = catchAsync(async (_req, res) => {
 const staff = await prisma.staff.findMany({
  orderBy: {
   createdAt: "desc",
  },
 });

 res.status(200).json({
  message: "Data staff berhasil diambil",
  data: staff,
 });
});

export const createStaff = catchAsync(async (req, res) => {
 const file = req.file;

 let photoUrl: string | undefined;

 if (file) {
  photoUrl = await uploadImage(
   file.buffer,
   `staff/photo-${Date.now()}`,
   file.mimetype,
  );
 }

 const staff = await prisma.staff.create({
  data: {
   name: req.body.name,
   position: req.body.position,
   type: req.body.type,
   classTaught: req.body.classTaught,
   photoUrl,
  },
 });

 res.status(201).json({
  message: "Staff berhasil dibuat",
  data: staff,
 });
});

export const updateStaff = catchAsync(async (req, res) => {
 const staffId = Number(req.params.id);

 if (Number.isNaN(staffId)) {
  throw new AppError("ID staff tidak valid", 400);
 }

 const existingStaff = await prisma.staff.findUnique({
  where: {
   id: staffId,
  },
 });

 if (!existingStaff) {
  throw new AppError("Data staff tidak ditemukan", 404);
 }

 let photoUrl = existingStaff.photoUrl;

 if (req.file) {
  photoUrl = await uploadImage(
   req.file.buffer,
   `staff/photo-${Date.now()}`,
   req.file.mimetype,
  );

  if (existingStaff.photoUrl) {
   const oldFilePath = getFilePathFromUrl(existingStaff.photoUrl);
   await deleteImage(oldFilePath);
  }
 }

 const staff = await prisma.staff.update({
  where: {
   id: staffId,
  },
  data: {
   name: req.body.name,
   position: req.body.position,
   type: req.body.type,
   classTaught: req.body.classTaught,
   photoUrl,
  },
 });

 res.status(200).json({
  message: "Data staff berhasil diperbarui",
  data: staff,
 });
});

export const deleteStaff = catchAsync(async (req, res) => {
 const staffId = Number(req.params.id);

 if (Number.isNaN(staffId)) {
  throw new AppError("ID staff tidak valid", 400);
 }

 const existingStaff = await prisma.staff.findUnique({
  where: {
   id: staffId,
  },
 });

 if (!existingStaff) {
  throw new AppError("Data staff tidak ditemukan", 404);
 }

 if (existingStaff.photoUrl) {
  const filePath = getFilePathFromUrl(existingStaff.photoUrl);
  await deleteImage(filePath);
 }

 await prisma.staff.delete({
  where: {
   id: staffId,
  },
 });

 res.status(200).json({
  message: "Data staff berhasil dihapus",
 });
});
