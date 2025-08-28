import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    Group: []
}
export const GroupSlice = createSlice({
    name: 'Group',
    initialState,
    reducers: {
        Groups: (state, action) =>{
            state.Group=action.payload
        },
    }
})

export const {Groups} = GroupSlice.actions

export default GroupSlice.reducer