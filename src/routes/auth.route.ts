import { Router } from "express";
import {
 login,
 forgotPassword,
 resetPassword,
} from "../controllers/auth.controller.js";
import {
 LoginSchema,
 ForgotPasswordSchema,
 ResetPasswordSchema,
} from "../validations/auth.validation.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/login", validate(LoginSchema), login);

router.post("/forgot-password", validate(ForgotPasswordSchema), forgotPassword);

router.post("/reset-password", validate(ResetPasswordSchema), resetPassword);

export default router;
