import { Filters } from "./components.types";
import { CancelPaymentBody } from "./payments.types";

export interface FormErrors {
    username: string;
    password: string;
    general?: string;
}

export interface FormValues {
    username: string;
    password: string;
}

export interface CancelPaymentAndRefreshBody {
    body: CancelPaymentBody;
    filters: Filters;
}