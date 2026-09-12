import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
 error: unknown,
 req: Request,
 res: Response,
 next: NextFunction,
) => {
 console.error(error);

 return res.status(500).json({
  message: "Terjadi kesalahan pada server",
 });
};
