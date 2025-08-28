import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    component: 'Dashboard'
}

export const NavbarSlice = createSlice({
    name: 'navButton',
    initialState,
    reducers: {
      Open: (state, action) => {
        state.component = action.payload
      }  
    }
})

export const { Open } = NavbarSlice.actions

export default NavbarSlice.reducer