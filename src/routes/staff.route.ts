import { Router } from "express";
import { getStaff, createStaff } from "../controllers/staff.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateStaffSchema } from "../validations/staff.validation.js";

const router = Router();

router.get("/", getStaff);

router.post("/", authenticate, validate(CreateStaffSchema), createStaff);

export default router;
