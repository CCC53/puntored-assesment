import { BasePaymentData } from "./payments.types";

export interface StoreData {
    payments: (BasePaymentData & {
        dueDate: string;
        authorizationNumber: string;
        paymentDate: string;
        externalId: string;
    })[];
    loading: boolean;
    selectedPayment: (BasePaymentData & {
        dueDate: string;
        authorizationNumber: string;
        paymentDate: string;
        externalId: string;
    }) | null;
    error: string | null;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}