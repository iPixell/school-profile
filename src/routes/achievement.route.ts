import { Router } from "express";
import {
 getAchievements,
 getLatestAchievements,
 createAchievement,
 updateAchievement,
 deleteAchievement,
} from "../controllers/achievement.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateAchievementSchema,
 UpdateAchievementSchema,
} from "../validations/achievement.validation.js";
import { uploadImage as uploadImageMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getAchievements);
router.get("/latest", getLatestAchievements);

router.post(
 "/",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(CreateAchievementSchema),
 createAchievement,
);

router.put(
 "/:id",
 authenticate,
 uploadImageMiddleware.single("photo"),
 validate(UpdateAchievementSchema),
 updateAchievement,
);

router.delete("/:id", authenticate, deleteAchievement);

export default router;
