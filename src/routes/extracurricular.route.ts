import { Router } from "express";
import {
 getExtracurriculars,
 createExtracurricular,
 updateExtracurricular,
 deleteExtracurricular,
} from "../controllers/extracurricular.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateExtracurricularSchema,
 UpdateExtracurricularSchema,
} from "../validations/extracurricular.validation.js";

const router = Router();

router.get("/", getExtracurriculars);

router.post(
 "/",
 authenticate,
 validate(CreateExtracurricularSchema),
 createExtracurricular,
);

router.put(
 "/:id",
 authenticate,
 validate(UpdateExtracurricularSchema),
 updateExtracurricular,
);

router.delete("/:id", authenticate, deleteExtracurricular);

export default router;
