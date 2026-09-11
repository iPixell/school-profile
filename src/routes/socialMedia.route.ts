import { Router } from "express";
import {
 getSocialMedias,
 createSocialMedia,
 updateSocialMedia,
 deleteSocialMedia,
} from "../controllers/socialMedia.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateSocialMediaSchema } from "../validations/socialMedia.validation.js";

const router = Router();

router.get("/", getSocialMedia);

router.post(
 "/",
 authenticate,
 validate(CreateSocialMediaSchema),
 createSocialMedia,
);

router.put(
 "/:id",
 authenticate,
 validate(CreateSocialMediaSchema),
 updateSocialMedia,
);

router.delete("/:id", authenticate, deleteSocialMedia);

export default router;
