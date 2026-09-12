import { z } from "zod";

export const CreateSchoolProfileSchema = z.object({
 schoolName: z.string().min(1, "Nama sekolah wajib diisi"),
 shortInfo: z.string().optional(),
 about: z.string().optional(),
 history: z.string().optional(),
 vision: z.string().optional(),
 mission: z.string().optional(),
 bannerUrl: z.string().url("Format URL banner tidak valid").optional(),
 logoUrl: z.string().url("Format URL logo tidak valid").optional(),
});

export const UpdateSchoolProfileSchema = CreateSchoolProfileSchema.partial();
