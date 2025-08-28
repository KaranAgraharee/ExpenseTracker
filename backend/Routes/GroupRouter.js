import { Router } from "express"
import { ensureAuthenticated } from "../middleware/Auth.js"
import {  CreatGroup, GetGroup, leaveGroup, UpdateGroup, AddMember } from "../controller/Groupcontroller.js"
import { CreateaContacts } from "../controller/contactcontroller.js"


export const GroupRouter = Router()

GroupRouter.post('/group', ensureAuthenticated, CreatGroup, CreateaContacts)
GroupRouter.get('/group', ensureAuthenticated, GetGroup)
GroupRouter.get('/group/members', ensureAuthenticated, AddMember)
GroupRouter.put('/group/update', ensureAuthenticated, UpdateGroup)
GroupRouter.put('/group/leave', ensureAuthenticated, leaveGroup)