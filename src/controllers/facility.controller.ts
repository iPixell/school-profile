import { prisma } from "../config/prisma.js";
import {
 uploadImage,
 deleteImage,
 getFilePathFromUrl,
} from "../services/storage.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getFacilities = catchAsync(async (_req, res) => {
 const facilities = await prisma.facility.findMany({
  orderBy: { createdAt: "desc" },
 });

 res.status(200).json({
  message: "Data fasilitas berhasil diambil",
  data: facilities,
 });
});

export const createFacility = catchAsync(async (req, res) => {
 const file = req.file;

 let photoUrl: string | undefined;

 if (file) {
  photoUrl = await uploadImage(
   file.buffer,
   `facilities/photo-${Date.now()}`,
   file.mimetype,
  );
 }

 const facility = await prisma.facility.create({
  data: {
   name: req.body.name,
   description: req.body.description,
   photoUrl,
  },
 });

 res.status(201).json({
  message: "Data fasilitas berhasil dibuat",
  data: facility,
 });
});

export const updateFacility = catchAsync(async (req, res) => {
 const facilityId = Number(req.params.id);

 if (Number.isNaN(facilityId)) {
  throw new AppError("ID fasilitas tidak valid", 400);
 }

 const existingFacility = await prisma.facility.findUnique({
  where: {
   id: facilityId,
  },
 });

 if (!existingFacility) {
  throw new AppError("Data fasilitas tidak ditemukan", 404);
 }

 let photoUrl = existingFacility.photoUrl;

 if (req.file) {
  photoUrl = await uploadImage(
   req.file.buffer,
   `facilities/photo-${Date.now()}`,
   req.file.mimetype,
  );

  if (existingFacility.photoUrl) {
   const oldFilePath = getFilePathFromUrl(existingFacility.photoUrl);

   await deleteImage(oldFilePath);
  }
 }

 const facility = await prisma.facility.update({
  where: {
   id: facilityId,
  },
  data: {
   name: req.body.name,
   description: req.body.description,
   photoUrl,
  },
 });

 res.status(200).json({
  message: "Data fasilitas berhasil diperbarui",
  data: facility,
 });
});

export const deleteFacility = catchAsync(async (req, res) => {
 const facilityId = Number(req.params.id);

 if (Number.isNaN(facilityId)) {
  throw new AppError("ID fasilitas tidak valid", 400);
 }

 const existingFacility = await prisma.facility.findUnique({
  where: {
   id: facilityId,
  },
 });

 if (!existingFacility) {
  throw new AppError("Data fasilitas tidak ditemukan", 404);
 }

 if (existingFacility.photoUrl) {
  const filePath = getFilePathFromUrl(existingFacility.photoUrl);

  await deleteImage(filePath);
 }

 await prisma.facility.delete({
  where: {
   id: facilityId,
  },
 });

 res.status(200).json({
  message: "Data fasilitas berhasil dihapus",
 });
});
