import { apiClient } from '@/app/api/utils/apiClient';
import { ENDPOINTS } from '@/app/api/config';
import { CancelPaymentResponse, GeneratePaymentBody, GeneratePaymentResponse, GetPaymentResponse, SearchPaymentsResponse, ValidPaymentStatus } from '@/app/types/payments.types';
import { Filters, FiltersMapped } from '@/app/types/components.types';
import { CancelPaymentAndRefreshBody } from '@/app/types/form.types';
import moment from 'moment';
import { AxiosError } from 'axios';

export class PaymentsService {

    private static statuses = [ValidPaymentStatus.CREATED, ValidPaymentStatus.PAID, ValidPaymentStatus.CANCELED, ValidPaymentStatus.EXPIRED];
    private static statusesLabel = ['Creado', 'Pagado', 'Cancelado', 'Expirado']

    private static handleError(error: unknown) {
        if (error instanceof AxiosError) {
            const status = error.response?.status;
            const message = error.response?.data.responseMessage || 'Error';
            if (status && status >= 400 && status < 500) {
                switch (status) {
                    case 400:
                        throw new Error(`Bad Request: ${message}`);
                    case 401:
                        throw new Error(`Unauthorized: ${message}`);
                    case 403:
                        throw new Error(`Forbidden: ${message}`);
                    case 404:
                        throw new Error(`Not Found: ${message}`);
                    case 409:
                        throw new Error(`Conflict: ${message}`);
                    default:
                        throw new Error(`Client Error: ${message}`);
                }
            }

            if (error.response?.data.responseCode === 500) {
                throw new Error('Internal server error');
            }
        }
        throw error;
    }

    public static async generatePayment(data: GeneratePaymentBody) {
        try {
            const response = await apiClient.post<GeneratePaymentResponse>(ENDPOINTS.REFERENCES.CORE, data);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    public static async cancelPayment({ body, filters }: CancelPaymentAndRefreshBody) {
        try {
            const canceled = await apiClient.put<CancelPaymentResponse>(ENDPOINTS.REFERENCES.CANCEL, body);
            console.log(canceled);
            const response = await this.searchPayments(filters);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    public static async getPayment(reference: string, paymentId: string) {
        try {
            const response = await apiClient.get<GetPaymentResponse>(`${ENDPOINTS.REFERENCES.CORE}/${reference}/${paymentId}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    public static async searchPayments({ status, startCreationDate, endCreationDate, startPaymentDate, endPaymentDate }: Filters) {
        try {
            const filters: FiltersMapped = {
                status,
                startCreationDate: startCreationDate ? moment(startCreationDate).format('YYYY-MM-DD HH:mm:ss') : null,
                endCreationDate: endCreationDate ? moment(endCreationDate).format('YYYY-MM-DD HH:mm:ss') : null,
                startPaymentDate: startPaymentDate ? moment(startPaymentDate).format('YYYY-MM-DD HH:mm:ss') : null,
                endPaymentDate: endPaymentDate ? moment(endPaymentDate).format('YYYY-MM-DD HH:mm:ss') : null
            }
            const filtered = Object.entries(filters).filter(([, value]) => value !== null);
            const concatedFilters = filtered.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            const response = await apiClient.get<SearchPaymentsResponse>(`${ENDPOINTS.REFERENCES.SEARCH}?${concatedFilters}`);
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    public static async countPaymentsForStats({ startCreationDate, endCreationDate, startPaymentDate, endPaymentDate }: Filters) {
        try {
            const response = {} as Record<string, number>;
            for (const [index, status] of this.statuses.entries()) {
                const filters: FiltersMapped = {
                    status,
                    startCreationDate: startCreationDate ? moment(startCreationDate).format('YYYY-MM-DD HH:mm:ss') : null,
                    endCreationDate: endCreationDate ? moment(endCreationDate).format('YYYY-MM-DD HH:mm:ss') : null,
                    startPaymentDate: startPaymentDate ? moment(startPaymentDate).format('YYYY-MM-DD HH:mm:ss') : null,
                    endPaymentDate: endPaymentDate ? moment(endPaymentDate).format('YYYY-MM-DD HH:mm:ss') : null
                }
                const filtered = Object.entries(filters).filter(([, value]) => value !== null);
                const concatedFilters = filtered.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
                response[this.statusesLabel[index]] = (await apiClient.get<SearchPaymentsResponse>(`${ENDPOINTS.REFERENCES.SEARCH}?${concatedFilters}`)).data.page.totalElements;
            }
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }
}