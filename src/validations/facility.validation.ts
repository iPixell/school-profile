import { z } from "zod";

export const CreateFacilitySchema = z.object({
 name: z.string().min(1, "Nama fasilitas wajib diisi"),
 description: z.string().optional(),
});

export const UpdateFacilitySchema = CreateFacilitySchema.partial();
