import { Router } from "express";
import {
 getSchoolProfile,
 createSchoolProfile,
 updateSchoolProfile,
 deleteSchoolProfile,
} from "../controllers/schoolProfile.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateSchoolProfileSchema,
 UpdateSchoolProfileSchema,
} from "../validations/schoolProfile.validation.js";
import { uploadImage as uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getSchoolProfile);

router.post(
 "/",
 authenticate,
 uploadImageMiddleware.fields([
  { name: "banner", maxCount: 1 },
  { name: "logo", maxCount: 1 },
 ]),
 validate(CreateSchoolProfileSchema),
 createSchoolProfile,
);

router.put(
 "/",
 authenticate,
 uploadImageMiddleware.fields([
  { name: "banner", maxCount: 1 },
  { name: "logo", maxCount: 1 },
 ]),
 validate(UpdateSchoolProfileSchema),
 updateSchoolProfile,
);

router.delete("/", authenticate, deleteSchoolProfile);

export default router;
