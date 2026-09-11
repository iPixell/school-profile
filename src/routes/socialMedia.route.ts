import { Router } from "express";
import {
 getSocialMedias,
 createSocialMedias,
 updateSocialMedias,
 deleteSocialMedias,
} from "../controllers/socialMedia.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateSocialMediaSchema } from "../validations/socialMedia.validation.js";

const router = Router();

router.get("/", getSocialMedias);

router.post(
 "/",
 authenticate,
 validate(CreateSocialMediaSchema),
 createSocialMedias,
);

router.put(
 "/:id",
 authenticate,
 validate(CreateSocialMediaSchema),
 updateSocialMedias,
);

router.delete("/:id", authenticate, deleteSocialMedias);

export default router;
