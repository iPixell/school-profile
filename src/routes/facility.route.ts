import { Router } from "express";
import {
 getFacilities,
 createFacility,
 updateFacility,
 deleteFacility,
} from "../controllers/facility.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateFacilitySchema,
 UpdateFacilitySchema,
} from "../validations/facility.validation.js";
import { uploadImage as uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getFacilities);

router.post(
 "/",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(CreateFacilitySchema),
 createFacility,
);
router.put(
 "/:id",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(UpdateFacilitySchema),
 updateFacility,
);

router.delete("/:id", authenticate, deleteFacility);

export default router;
