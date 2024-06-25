import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../redux/features/auth/authSlice'
import prodcutReducer from './features/product/productSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: prodcutReducer,
    }
});


