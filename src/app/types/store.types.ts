import { BasePaymentData } from "./payments.types";

export interface StoreData {
    payments: (BasePaymentData & { dueDate: string; authorizationNumber: string; paymentDate: string; externalId: string })[];
    selectedPayment: BasePaymentData | null;
    loading: boolean;
}