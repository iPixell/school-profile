import { z } from "zod";

export const CreateExtracurricularSchema = z.object({
 name: z.string().min(1, "Nama ekstrakurikuler wajib diisi"),
 description: z.string().optional(),
 photoUrl: z.string().url("Format URL foto tidak valid").optional(),
});

export const UpdateExtracurricularSchema =
 CreateExtracurricularSchema.partial();
