import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Budget: 0
}

export const BudgetSlice = createSlice({
    name: "Budget",
    initialState,
    reducers: {
        setBudget:(state, action) =>{
            state.Budget = action.payload
        }
    }
})

export const{setBudget} = BudgetSlice.actions

export default BudgetSlice.reducer