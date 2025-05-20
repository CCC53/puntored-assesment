import { PaymentRow } from "./payments.types";

export interface StoreData {
    payments: PaymentRow[];
    loading: boolean;
    selectedPayment: PaymentRow | null;
    error: string | null;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalPayments: Record<string, number>;
}