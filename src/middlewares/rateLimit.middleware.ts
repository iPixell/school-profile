import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 limit: 20,
 standardHeaders: "draft-8",
 legacyHeaders: false,
 message: {
  success: false,
  message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
 },
});

export const forgotPasswordRateLimiter = rateLimit({
 windowMs: 3 * 60 * 1000,
 limit: 3,
 standardHeaders: "draft-8",
 legacyHeaders: false,
 message: {
  success: false,
  message: "Terlalu banyak permintaan reset password. Silakan coba lagi nanti.",
 },
});
