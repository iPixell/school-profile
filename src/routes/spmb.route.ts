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
import { uploadImage as uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getSpmb);

router.post(
 "/",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(CreateSpmbSchema),
 createSpmb,
);

router.put(
 "/:id",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(UpdateSpmbSchema),
 updateSpmb,
);

router.delete("/:id", authenticate, deleteSpmb);

export default router;
