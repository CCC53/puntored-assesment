import { apiClient } from '@/app/api/utils/apiClient';
import { ENDPOINTS } from '@/app/api/config';
import { CancelPaymentBody, CancelPaymentResponse, GeneratePaymentBody, GeneratePaymentResponse, GetPaymentResponse, SearchPaymentsResponse } from '@/app/types/payments.types';
import { Filters } from '@/app/types/components.types';

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

    public static async searchPayments(filters: Filters) {
        try {
            const concatedFilters = Object.entries(filters).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            const response = await apiClient.get<SearchPaymentsResponse>(`${ENDPOINTS.REFERENCES.SEARCH}?${concatedFilters}`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}