import { Router } from "express";
import {
 getStaff,
 createStaff,
 updateStaff,
 deleteStaff,
} from "../controllers/staff.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateStaffSchema } from "../validations/staff.validation.js";

const router = Router();

router.get("/", getStaff);

router.post("/", authenticate, validate(CreateStaffSchema), createStaff);

router.put("/:id", authenticate, validate(CreateStaffSchema), updateStaff);

router.delete("/:id", authenticate, deleteStaff);

export default router;
