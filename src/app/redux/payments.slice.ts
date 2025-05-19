import { createSlice } from "@reduxjs/toolkit";
import { StoreData } from "../types/store.types";

const initialState: StoreData = {
    payments: [],
    loading: false,
    selectedPayment: null
}

export const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {}
});

export const {} = paymentSlice.actions;