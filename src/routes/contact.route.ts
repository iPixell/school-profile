import { Router } from "express";
import {
 getContact,
 createContact,
 updateContact,
 deleteContact,
} from "../controllers/contact.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { CreateContactSchema } from "../validations/contact.validation.js";

const router = Router();

router.get("/", getContact);

router.post("/", authenticate, validate(CreateContactSchema), createContact);

router.put("/:id", authenticate, validate(CreateContactSchema), updateContact);

router.delete("/:id", authenticate, deleteContact);

export default router;
