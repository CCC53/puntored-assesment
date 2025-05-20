export enum ValidPaymentStatus {
    CREATED = "01",
    PAID = "02",
    CANCELED = "03",
    EXPIRED = "04"
}

export interface BasePaymentData {
    paymentId: number;
    amount: number;
    reference: string;
    description: string;
    status: ValidPaymentStatus;
    callBackURL: string;
    callbackACKID: string;
    cancelDescription: string;
}

export interface GeneratePaymentBody {
    externalId: string;
    amount: number;
    description: string;
    dueDate: string;
    callbackURL: string;
}

export interface GeneratePaymentResponse {
    responseCode: number;
    responseMessage: string;
    data: {
        paymentId: number;
        reference: string;
        amount: number;
        description: string;
        creationDate: string;
        message: string;
    }
}

export interface GetPaymentResponse {
    responseCode: number;
    responseMessage: string;
    data: BasePaymentData & {
        dueDate: string;
    }
}

export interface CancelPaymentBody {
    reference: string;
    status: ValidPaymentStatus;
    updateDescription: string;
}

export interface CancelPaymentResponse {
    responseCode: number;
    responseMessage: string;
    data: {
        paymentId: number;
        creationDate: string;
        reference: string;
        status: ValidPaymentStatus;
        message: string;
        cancelDescription: string;
        updatedAt: string;
    }
}

export interface SearchPaymentsResponse {
    responseCode: number;
    responseMessage: string;
    data: {
        content: (BasePaymentData & {
            dueDate: string;
            authorizationNumber: string;
            paymentDate: string;
            externalId: string;
        })[];
        page: {
            size: number;
            number: number;
            totalElements: number;
            totalPages: number;
        }
    }
}

export type PaymentRow = BasePaymentData & {
    dueDate: string;
    authorizationNumber: string;
    paymentDate: string;
    externalId: string;
};