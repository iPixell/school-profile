import { Router } from "express";
import {
 getPrincipalHistories,
 createPrincipalHistory,
 updatePrincipalHistory,
 deletePrincipalHistory,
} from "../controllers/principalHistory.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
 CreatePrincipalHistorySchema,
 UpdatePrincipalHistorySchema,
} from "../validations/principalHistory.validation.js";

const router = Router();

router.get("/", getPrincipalHistories);

router.post(
 "/",
 authenticate,
 validate(CreatePrincipalHistorySchema),
 createPrincipalHistory,
);

router.put(
 "/:id",
 authenticate,
 validate(UpdatePrincipalHistorySchema),
 updatePrincipalHistory,
);

router.delete("/:id", authenticate, deletePrincipalHistory);

export default router;
