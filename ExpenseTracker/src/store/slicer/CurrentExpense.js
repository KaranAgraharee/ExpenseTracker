import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    Current_Expense: []
}

export const Current_ExpenseSlice = createSlice({
    name: 'Current_Expense',
    initialState,
    reducers: {
        SetCurrent_Expense: (state, action) =>{
            state.Current_Expense = action.payload
        },
    }
})

export const {SetCurrent_Expense} = Current_ExpenseSlice.actions

export default Current_ExpenseSlice.reducer