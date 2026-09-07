import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { LoginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validate(LoginSchema), login);

router.get("/test-auth", authenticate, (req, res) => {
 res.json({
  message: "Authentication berhasil",
  admin: req.admin,
 });
});

export default router;
