import { Router } from "express";
import {
 getAchievements,
 createAchievement,
 updateAchievement,
 deleteAchievement,
} from "../controllers/achievement.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateAchievementSchema } from "../validations/achievement.validation.js";

const router = Router();

router.get("/", getAchievements);

router.post(
 "/",
 authenticate,
 validate(CreateAchievementSchema),
 createAchievement,
);

router.put(
 "/:id",
 authenticate,
 validate(CreateAchievementSchema),
 updateAchievement,
);

router.delete("/:id", authenticate, deleteAchievement);

export default router;
