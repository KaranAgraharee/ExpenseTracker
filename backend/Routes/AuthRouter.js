import { Router } from "express"
import { getuser, login,logout,sendOtp,signup, verifyOTP } from "../controller/authcontroller.js"
import { signupValidation, loginValidation } from "../middleware/Authvalidation.js"
import { AddMember } from "../controller/Groupcontroller.js"
import { ensureAuthenticated } from "../middleware/Auth.js"
import { UserAccount, setBudget } from "../controller/expenseController.js"


export const AuthRouter = Router()

AuthRouter.post('/login', loginValidation, login)


AuthRouter.post('/signup', signupValidation, signup)

AuthRouter.get('/verify-user', ensureAuthenticated, getuser, UserAccount)

AuthRouter.get('/logout',ensureAuthenticated, logout)

AuthRouter.post('/send-otp', sendOtp )

AuthRouter.post('/verify-otp', verifyOTP)

AuthRouter.get('/user/search', AddMember)

AuthRouter.post('/set_budget', ensureAuthenticated, setBudget)

