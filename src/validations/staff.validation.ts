import { z } from "zod";

export const CreateStaffSchema = z.object({
 name: z.string().min(1, "Nama staff wajib diisi"),

 position: z.string().min(1, "Jabatan wajib diisi"),

 type: z
  .enum(["TEACHER", "ADMINISTRATIVE"])
  .refine(
   (value) => value === "TEACHER" || value === "ADMINISTRATIVE",
   "Tipe staff tidak valid",
  ),

 classTaught: z.string().optional(),

 photoUrl: z.string().url("Format URL foto tidak valid").optional(),
});
