import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    Contacts:[]
}

export const ContactSlice = createSlice({
    name: 'Contacts',
    initialState,
    reducers: {
        setContacts:(state, action) =>{
            state.Contacts = action.payload
        }
    }
})

export const {setContacts} = ContactSlice.actions

export default ContactSlice.reducer