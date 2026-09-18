import { Router } from "express";
import {
 login,
 forgotPassword,
 resetPassword,
 refreshAccessToken,
 logout,
} from "../controllers/auth.controller.js";
import {
 LoginSchema,
 ForgotPasswordSchema,
 ResetPasswordSchema,
} from "../validations/auth.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 loginRateLimiter,
 forgotPasswordRateLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/login", loginRateLimiter, validate(LoginSchema), login);

router.post(
 "/forgot-password",
 forgotPasswordRateLimiter,
 validate(ForgotPasswordSchema),
 forgotPassword,
);

router.post("/reset-password", validate(ResetPasswordSchema), resetPassword);
export default router;

router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
