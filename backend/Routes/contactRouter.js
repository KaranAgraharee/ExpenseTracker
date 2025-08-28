import { Router } from "express"
import { ensureAuthenticated } from "../middleware/Auth.js"
import { createNonGroupContact, getContact } from "../controller/contactcontroller.js"

export const ContactRouter = Router()

ContactRouter.get('/contacts', ensureAuthenticated, getContact)
ContactRouter.post('/contacts', ensureAuthenticated, createNonGroupContact)