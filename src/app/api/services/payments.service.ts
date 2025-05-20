import { apiClient } from '@/app/api/utils/apiClient';
import { ENDPOINTS } from '@/app/api/config';
import { CancelPaymentBody, CancelPaymentResponse, GeneratePaymentBody, GeneratePaymentResponse, GetPaymentResponse, SearchPaymentsResponse, ValidPaymentStatus } from '@/app/types/payments.types';
import { Filters } from '@/app/types/components.types';

export class PaymentsService {

    private static statuses = [ValidPaymentStatus.CREATED, ValidPaymentStatus.PAID, ValidPaymentStatus.CANCELED, ValidPaymentStatus.EXPIRED];
    private static statusesLabel = ['Creado', 'Pagado', 'Cancelado', 'Expirado']


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
            // const response = await apiClient.get<SearchPaymentsResponse>(`${ENDPOINTS.REFERENCES.SEARCH}?${concatedFilters}`);
            const response = await apiClient.get<SearchPaymentsResponse>(`/1b7d-e4c9-45e1-9972`);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public static async countPaymentsForStats(filters: Filters) {
        try {
            const response = {} as Record<string, number>;
            for(const [index, status] of this.statuses.entries()) {
                filters.status = status;
                const concatedFilters = Object.entries(filters).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
                response[this.statusesLabel[index]] = (await apiClient.get<SearchPaymentsResponse>(`${ENDPOINTS.REFERENCES.SEARCH}?${concatedFilters}`)).data.page.totalElements;
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}