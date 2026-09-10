import { Router } from "express";
import { getSchoolProfile } from "../controllers/schoolProfile.controller.js";

const router = Router();

router.get("/", getSchoolProfile);

export default router;
