import { Router } from "express";
import { creatBill, deleteBill, UpdateBill, getBill } from "../controller/BillController.js";
import { UserAccount } from "../controller/expenseController.js";
import { ensureAuthenticated } from "../middleware/Auth.js";

export const BillRouter = Router()

BillRouter.get('/getBill', ensureAuthenticated, getBill),
BillRouter.post('/CreateBill', ensureAuthenticated, creatBill, UserAccount),
BillRouter.put('/UpdateBill', ensureAuthenticated, UpdateBill, UserAccount)           
BillRouter.delete('/deleteBill', ensureAuthenticated, deleteBill, UserAccount)           

