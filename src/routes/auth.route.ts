import { Router } from "express";
import {
 login,
 forgotPassword,
 resetPassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 LoginSchema,
 ForgotPasswordSchema,
 ResetPasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.post("/forgot-password", validate(ForgotPasswordSchema), forgotPassword);

router.post("/reset-password", validate(ResetPasswordSchema), resetPassword);

export default router;
