import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
 windowMs: 5 * 60 * 1000,
 limit: 5,
 standardHeaders: "draft-8",
 legacyHeaders: false,
 message: {
  success: false,
  message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
 },
});

export const forgotPasswordRateLimiter = rateLimit({
 windowMs: 5 * 60 * 1000,
 limit: 3,
 standardHeaders: "draft-8",
 legacyHeaders: false,
 message: {
  success: false,
  message: "Terlalu banyak permintaan reset password. Silakan coba lagi nanti.",
 },
});
