import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject } from "zod";
import { ValidationError } from "../utils/ValidationError.js";

export const validate =
 (schema: ZodObject) =>
 (req: Request, _res: Response, next: NextFunction): void => {
  try {
   req.body = schema.parse(req.body);
   next();
  } catch (error) {
   if (error instanceof ZodError) {
    const errors: Record<string, unknown> = {};

    for (const issue of error.issues) {
     const key = String(issue.path[0] ?? "root");
     errors[key] = issue.message;
    }

    next(new ValidationError("Data tidak valid", errors));
    return;
   }

   next(error);
  }
 };
