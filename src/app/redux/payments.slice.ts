import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StoreData } from "@/app/types/store.types";
import { PaymentsService } from "@/app/api/services/payments.service";
import { Filters } from "@/app//types/components.types";

const initialState: StoreData = {
    payments: [],
    loading: false,
    selectedPayment: null,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    totalPayments: {}
}

export const searchPayments = createAsyncThunk('payments/searchPayments', async (filters: Filters, { rejectWithValue }) => {
    try {
        const response = await PaymentsService.searchPayments(filters);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const countPaymentsForStats = createAsyncThunk('payments/countPaymentsForStats', async (filters: Filters, { rejectWithValue }) => {
    try {
        const response = await PaymentsService.countPaymentsForStats(filters);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setSelectedPayment: (state, action) => {
            state.selectedPayment = action.payload;
        },
        clearSelectedPayment: (state) => {
            state.selectedPayment = null;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPayments.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.payments = action.payload.data.content;
                    state.totalElements = action.payload.data.page.totalElements;
                    state.totalPages = action.payload.data.page.totalPages;
                    state.currentPage = action.payload.data.page.number;
                    state.pageSize = action.payload.data.page.size;
                }
            })
            .addCase(searchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(countPaymentsForStats.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(countPaymentsForStats.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.totalPayments = action.payload;
                }
            })
            .addCase(countPaymentsForStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { setSelectedPayment, clearSelectedPayment, setPage, setPageSize } = paymentSlice.actions;
export default paymentSlice.reducer;