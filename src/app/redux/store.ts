import { configureStore } from "@reduxjs/toolkit";
import { paymentSlice } from "./payments.slice";

export const store = configureStore({
    reducer: {
        payments: paymentSlice.reducer
    }
});

export type AppDispatch = typeof store.dispatch;