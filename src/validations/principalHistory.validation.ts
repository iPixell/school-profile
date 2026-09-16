import { z } from "zod";

export const CreatePrincipalHistorySchema = z.object({
 name: z.string().min(1, "Nama wajib diisi"),
 period: z.string().min(1, "Periode wajib diisi"),
});

export const UpdatePrincipalHistorySchema =
 CreatePrincipalHistorySchema.partial();
