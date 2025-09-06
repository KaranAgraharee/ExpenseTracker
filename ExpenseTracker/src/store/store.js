import { configureStore } from '@reduxjs/toolkit'
import NavbarSlice from './slicer/navButton'
import ExpenseSlice from './slicer/expenseSlice'
import GroupSlice from './slicer/GroupSlice'
import UserSlice from './slicer/userSlice'
import Current_ExpenseSlice from './slicer/CurrentExpense'
import Current_GroupSlice  from './slicer/CurrentGroup'
import ContactSlice  from './slicer/ContactSlice'
import Billslice from './slicer/billslice'
import { BudgetSlice } from './slicer/Budgetslice'

export default configureStore({
  reducer: {
    navButton: NavbarSlice,
    expense: ExpenseSlice,
    Group: GroupSlice,
    user: UserSlice,
    Current_Expense: Current_ExpenseSlice,
    Current_Group : Current_GroupSlice,
    Contacts: ContactSlice,
    Bills:Billslice,
    Budget:BudgetSlice,
  },
})