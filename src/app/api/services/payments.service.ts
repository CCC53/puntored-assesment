import { apiClient } from '../utils/apiClient';
import { ENDPOINTS } from '../config';
import { CancelPaymentBody, CancelPaymentResponse, GeneratePaymentBody, GeneratePaymentResponse, GetPaymentResponse } from '../../types/payments.types';

export class PaymentsService {
    public static async generatePayment(data: GeneratePaymentBody) {
        try {
            const response = await apiClient.post<GeneratePaymentResponse>(ENDPOINTS.REFERENCES.CORE, data);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public static async cancelPayment(data: CancelPaymentBody) {
        try {
            const response = await apiClient.put<CancelPaymentResponse>(ENDPOINTS.REFERENCES.CANCEL, data);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public static async getPayment(reference: string, paymentId: string) {
        try {
            const response = await apiClient.get<GetPaymentResponse>(`${ENDPOINTS.REFERENCES.CORE}/${reference}/${paymentId}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}