import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodObject } from "zod";
import { ValidationError } from "../utils/ValidationError.js";

function buildNestedErrors(
 issues: ZodError["issues"],
): Record<string, unknown> {
 const errors: Record<string, unknown> = {};

 for (const issue of issues) {
  const [first, ...rest] = issue.path;
  const key = String(first ?? "root");

  if (rest.length === 0) {
   errors[key] = issue.message;
   continue;
  }

  if (!errors[key] || typeof errors[key] !== "object") {
   errors[key] = {};
  }

  let current = errors[key] as Record<string, unknown>;

  for (const segment of rest.slice(0, -1)) {
   const s = String(segment);

   if (!current[s] || typeof current[s] !== "object") {
    current[s] = {};
   }

   current = current[s] as Record<string, unknown>;
  }

  current[String(rest[rest.length - 1])] = issue.message;
 }

 return errors;
}

export const validate =
 (schema: ZodObject) =>
 (req: Request, _res: Response, next: NextFunction): void => {
  try {
   schema.parse({
    body: req.body,
    query: req.query,
    params: req.params,
   });

   next();
  } catch (error) {
   if (error instanceof ZodError) {
    const errors = buildNestedErrors(error.issues);

    next(new ValidationError("Data tidak valid", errors));
    return;
   }

   next(error);
  }
 };
