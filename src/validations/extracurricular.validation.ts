import { z } from "zod";

export const CreateExtracurricularSchema = z.object({
 name: z.string().min(1, "Nama ekstrakurikuler wajib diisi"),
});

export const UpdateExtracurricularSchema =
 CreateExtracurricularSchema.partial();
