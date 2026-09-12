import { Router } from "express";
import {
 getContacts,
 createContact,
 updateContact,
 deleteContact,
} from "../controllers/contact.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
 CreateContactSchema,
 UpdateContactSchema,
} from "../validations/contact.validation.js";

const router = Router();

router.get("/", getContacts);

router.post("/", authenticate, validate(CreateContactSchema), createContact);

router.put("/:id", authenticate, validate(UpdateContactSchema), updateContact);

router.delete("/:id", authenticate, deleteContact);

export default router;
