import { Filters } from "./components.types";
import { CancelPaymentBody } from "./payments.types";

export interface FormErrors {
    username: string;
    password: string;
    general?: string;
}

export interface CancelPaymentAndRefreshBody {
    body: CancelPaymentBody;
    filters: Filters;
}

export type FormValue = string | number | Date | null;
export type FormValues = Record<string, FormValue>;