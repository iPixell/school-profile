import { Router } from "express";
import {
 addExtracurricularMedia,
 deleteExtracurricularMedia,
} from "../controllers/extracurricularMedia.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
 uploadMedia,
 validateMediaFileSize,
} from "../middlewares/uploadMedia.middleware.js";

const router = Router();

router.post(
 "/:id/media",
 authenticate,
 uploadMedia.single("file"),
 validateMediaFileSize,
 addExtracurricularMedia,
);

router.delete("/:id/media/:mediaId", authenticate, deleteExtracurricularMedia);

export default router;
