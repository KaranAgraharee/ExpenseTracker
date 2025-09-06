import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Bills: []
}

export const Billslice = createSlice({
    name: "Bills",
    initialState,
    reducers: {
        setBills:(state, action) =>{
            state.Bills = action.payload
        }
    }
})

export const{setBills} = Billslice.actions

export default Billslice.reducer