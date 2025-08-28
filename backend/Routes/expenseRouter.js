import { Router } from "express"
import { ensureAuthenticated } from "../middleware/Auth.js"
import { getExpenses, createExpense, updateExpense ,deleteExpense } from "../controller/expenseController.js"

export const ExpenseRouter = Router()

ExpenseRouter.post('/expense', ensureAuthenticated, createExpense)
ExpenseRouter.get('/expense', ensureAuthenticated, getExpenses)
ExpenseRouter.put('/expense', ensureAuthenticated, updateExpense)
ExpenseRouter.delete('/expense', ensureAuthenticated, deleteExpense)
