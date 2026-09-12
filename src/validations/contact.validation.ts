import { z } from "zod";

export const CreateContactSchema = z.object({
 address: z.string().optional(),
 phone: z.string().optional(),
 email: z.string().email("Format email tidak valid").optional(),
 whatsapp: z.string().optional(),
 location: z.string().optional(),
 googleMaps: z.string().url("Format URL Google Maps tidak valid").optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial();
