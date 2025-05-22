import { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentsService } from "@/app/api/services/payments.service";
import { Filters } from "@/app//types/components.types";
import { StoreData } from "@/app/types/store.types";
import { CancelPaymentAndRefreshBody } from "@/app/types/form.types";
import { showSuccessToast, showErrorToast } from "@/app/utils/toast";
import { GetPaymentBodyForAction } from "@/app/types/payments.types";

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

const handleError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.responseMessage || error.message || 'Se ha producido un error';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Se ha producido un error inesperado';
};

export const searchPayments = createAsyncThunk('payments/searchPayments', async (filters: Filters, { getState, rejectWithValue }) => {
    try {
        const state = getState() as { payments: StoreData };
        const { currentPage, pageSize } = state.payments;
        const response = await PaymentsService.searchPayments({ ...filters, page: currentPage, paginate: pageSize });
        showSuccessToast('Pagos obtenidos con éxito');
        return response;
    } catch (error) {
        return rejectWithValue(handleError(error));
    }
});

export const countPaymentsForStats = createAsyncThunk('payments/countPaymentsForStats', async (filters: Filters, { rejectWithValue }) => {
    try {
        const response = await PaymentsService.countPaymentsForStats(filters);
        showSuccessToast('Estadísticas obtenidas con éxito');
        return response;
    } catch (error) {
        return rejectWithValue(handleError(error));
    }
});

export const cancelPaymentAndRefresh = createAsyncThunk('payments/cancelPaymentAndRefresh', async (body: CancelPaymentAndRefreshBody, { rejectWithValue }) => {
    try {
        const response = await PaymentsService.cancelPayment(body);
        showSuccessToast('Pago cancelado con éxito');
        return response;
    } catch (error) {
        return rejectWithValue(handleError(error));
    }
});

export const getPaymentForDetails = createAsyncThunk('payments/getPaymentForDetails', async ({ reference, id }: GetPaymentBodyForAction, { rejectWithValue }) => {
    try {
        const response = await PaymentsService.getPayment(reference, id);
        showSuccessToast('Pago obtenido con éxito');
        return response;
    } catch (error) {
        return rejectWithValue(handleError(error));
    }
})

export const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
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
                showErrorToast(action.payload as string);
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
                showErrorToast(action.payload as string);
            })
            .addCase(cancelPaymentAndRefresh.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelPaymentAndRefresh.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.payments = action.payload.data.content;
                    state.totalElements = action.payload.data.page.totalElements;
                    state.totalPages = action.payload.data.page.totalPages;
                    state.currentPage = action.payload.data.page.number;
                    state.pageSize = action.payload.data.page.size;
                }
            })
            .addCase(cancelPaymentAndRefresh.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showErrorToast(action.payload as string);
            })
            .addCase(getPaymentForDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentForDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.selectedPayment = action.payload.data;
                }
            })
            .addCase(getPaymentForDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showErrorToast(action.payload as string);
            })
    }
});

export const { clearSelectedPayment, setPage, setPageSize } = paymentSlice.actions;
export default paymentSlice.reducer;