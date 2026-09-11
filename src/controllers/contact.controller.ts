import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export const getContact = async (_req: Request, res: Response) => {
 try {
  const contact = await prisma.contact.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });

  return res.status(200).json({
   message: "Data contact berhasil diambil",
   data: contact,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const createContact = async (req: Request, res: Response) => {
 try {
  const contact = await prisma.contact.create({
   data: req.body,
  });

  return res.status(201).json({
   message: "Data contact berhasil dibuat",
   data: contact,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const updateContact = async (req: Request, res: Response) => {
 try {
  const contactId = Number(req.params.id);

  if (Number.isNaN(contactId)) {
   return res.status(400).json({
    message: "ID contact tidak valid",
   });
  }

  const existingContact = await prisma.contact.findUnique({
   where: {
    id: contactId,
   },
  });

  if (!existingContact) {
   return res.status(404).json({
    message: "Data contact tidak ditemukan",
   });
  }

  const contact = await prisma.contact.update({
   where: {
    id: contactId,
   },
   data: req.body,
  });

  return res.status(200).json({
   message: "Data contact berhasil diperbarui",
   data: contact,
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};

export const deleteContact = async (req: Request, res: Response) => {
 try {
  const contactId = Number(req.params.id);

  if (Number.isNaN(contactId)) {
   return res.status(400).json({
    message: "ID contact tidak valid",
   });
  }

  const existingContact = await prisma.contact.findUnique({
   where: {
    id: contactId,
   },
  });

  if (!existingContact) {
   return res.status(404).json({
    message: "Data contact tidak ditemukan",
   });
  }

  await prisma.contact.delete({
   where: {
    id: contactId,
   },
  });

  return res.status(200).json({
   message: "Data contact berhasil dihapus",
  });
 } catch (error) {
  console.error(error);

  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
  });
 }
};
