import { Router } from "express";
import {
 getSpmb,
 createSpmb,
 updateSpmb,
 deleteSpmb,
} from "../controllers/spmb.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateSpmbSchema,
 UpdateSpmbSchema,
} from "../validations/spmb.validation.js";

const router = Router();

router.get("/", getSpmb);

router.post("/", authenticate, validate(CreateSpmbSchema), createSpmb);

router.put("/:id", authenticate, validate(UpdateSpmbSchema), updateSpmb);

router.delete("/:id", authenticate, deleteSpmb);

export default router;
