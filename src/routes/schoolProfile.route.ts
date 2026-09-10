import { Router } from "express";
import {
 getSchoolProfile,
 createSchoolProfile,
} from "../controllers/schoolProfile.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateSchoolProfileSchema } from "../validations/schoolProfile.validation.js";

const router = Router();

router.get("/", getSchoolProfile);

router.post(
 "/",
 authenticate,
 validate(CreateSchoolProfileSchema),
 createSchoolProfile,
);

export default router;
