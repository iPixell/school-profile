import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { LoginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validate(LoginSchema), login);

export default router;
