import { z } from "zod";

export const LoginSchema = z.object({
 email: z.string().email("Format email tidak valid"),

 password: z.string().min(1, "Password wajib diisi"),
});

export const ResetPasswordSchema = z.object({
 token: z.string().min(1, "Token wajib diisi"),

 newPassword: z.string().min(8, "Password minimal 8 karakter"),
});
