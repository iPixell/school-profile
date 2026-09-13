import { Router } from "express";
import {
 getStaff,
 createStaff,
 updateStaff,
 deleteStaff,
} from "../controllers/staff.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateStaffSchema,
 UpdateStaffSchema,
} from "../validations/staff.validation.js";
import { uploadImage as uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getStaff);

router.post(
 "/",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(CreateStaffSchema),
 createStaff,
);

router.put(
 "/:id",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(UpdateStaffSchema),
 updateStaff,
);
router.delete("/:id", authenticate, deleteStaff);

export default router;
