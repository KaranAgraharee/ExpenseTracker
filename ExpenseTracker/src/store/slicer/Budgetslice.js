import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Budget: 0
}

export const BudgetSlice = createSlice({
    name: "Budget",
    initialState,
    reducers: {
        setBills:(state, action) =>{
            state.Budget = action.payload
        }
    }
})

export const{setBills} = BudgetSlice.actions

export default BudgetSlice.reducer