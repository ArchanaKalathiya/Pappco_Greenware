import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../redux/features/auth/authSlice'
import prodcutReducer from './features/product/productSlice'
import filterReducer from "./features/product/filterSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        filter:filterReducer,
        product: prodcutReducer,
    }
});


    