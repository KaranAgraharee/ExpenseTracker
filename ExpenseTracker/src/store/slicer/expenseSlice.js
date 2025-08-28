import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    expense: []
}
export const ExpenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        SetExpense: (state, action) =>{
            state.expense = action.payload
        },
        AddExpense: (state, action) => {
            state.expense.push(action.payload)
        }
    }
})

export const { SetExpense, AddExpense } = ExpenseSlice.actions;

export default ExpenseSlice.reducer