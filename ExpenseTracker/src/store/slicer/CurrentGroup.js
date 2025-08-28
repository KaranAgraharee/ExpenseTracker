import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    Current_Group: null
}

export const Current_GroupSlice = createSlice({
    name: 'Current_Group',
    initialState,
    reducers: {
        SetCurrent_Group: (state, action) =>{
            console.log("redux hit")
            state.Current_Group = action.payload
        },
    }
})

export const {SetCurrent_Group} = Current_GroupSlice.actions

export default Current_GroupSlice.reducer