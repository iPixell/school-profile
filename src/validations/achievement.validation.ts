import { z } from "zod";

export const CreateAchievementSchema = z.object({
 competition: z.string().min(1, "Nama kompetisi wajib diisi"),
 studentName: z.string().min(1, "Nama siswa wajib diisi"),
 rank: z.string().min(1, "Juara wajib diisi"),
 level: z.string().min(1, "Tingkat kompetisi wajib diisi"),
 year: z.coerce
  .number()
  .int("Tahun harus berupa bilangan bulat")
  .min(1900, "Tahun tidak valid"),
});

export const UpdateAchievementSchema = CreateAchievementSchema.partial();
