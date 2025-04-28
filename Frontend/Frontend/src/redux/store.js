import { configureStore } from '@reduxjs/toolkit';
import auth, { globalSlice } from "./auth/auth"

export const store = configureStore({
    reducer:
        { dataSlice: auth } 
})
