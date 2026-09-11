import { z } from "zod";

export const CreateSpmbSchema = z.object({
 title: z.string().min(1, "Judul SPMB wajib diisi"),
 description: z.string().optional(),
 portalUrl: z.string().url("Format URL portal SPMB tidak valid").optional(),
});
