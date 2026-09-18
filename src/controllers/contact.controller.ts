import { prisma } from "../config/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getContacts = catchAsync(async (_req, res) => {
 const contacts = await prisma.contact.findMany({
  orderBy: {
   createdAt: "desc",
  },
 });

 res.status(200).json({
  message: "Data kontak berhasil diambil",
  data: contacts,
 });
});

export const createContact = catchAsync(async (req, res) => {
 const contact = await prisma.contact.create({
  data: {
   address: req.body.address,
   phone: req.body.phone,
   email: req.body.email,
   whatsapp: req.body.whatsapp,
   location: req.body.location,
   googleMaps: req.body.googleMaps,
  },
 });

 res.status(201).json({
  message: "Data kontak berhasil dibuat",
  data: contact,
 });
});

export const updateContact = catchAsync(async (req, res) => {
 const contactId = Number(req.params.id);

 if (Number.isNaN(contactId)) {
  throw new AppError("ID kontak tidak valid", 400);
 }

 const existingContact = await prisma.contact.findUnique({
  where: {
   id: contactId,
  },
 });

 if (!existingContact) {
  throw new AppError("Data kontak tidak ditemukan", 404);
 }

 const contact = await prisma.contact.update({
  where: {
   id: contactId,
  },
  data: {
  address: req.body.address,
  phone: req.body.phone,
  email: req.body.email,
  whatsapp: req.body.whatsapp,
  location: req.body.location,
  googleMaps: req.body.googleMaps,
},
 });

 res.status(200).json({
  message: "Data kontak berhasil diperbarui",
  data: contact,
 });
});

export const deleteContact = catchAsync(async (req, res) => {
 const contactId = Number(req.params.id);

 if (Number.isNaN(contactId)) {
  throw new AppError("ID kontak tidak valid", 400);
 }

 const existingContact = await prisma.contact.findUnique({
  where: {
   id: contactId,
  },
 });

 if (!existingContact) {
  throw new AppError("Data kontak tidak ditemukan", 404);
 }

 await prisma.contact.delete({
  where: {
   id: contactId,
  },
 });

 res.status(200).json({
  message: "Data kontak berhasil dihapus",
 });
});
