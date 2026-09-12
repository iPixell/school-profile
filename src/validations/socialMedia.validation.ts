import { z } from "zod";

export const CreateSocialMediaSchema = z.object({
 platform: z.string().min(1, "Platform wajib diisi"),
 url: z.string().url("Format URL social media tidak valid"),
});

export const UpdateSocialMediaSchema = CreateSocialMediaSchema.partial();
