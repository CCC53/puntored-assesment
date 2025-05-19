import { AxiosError } from 'axios';

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

export class ErrorHandler {
    public static handle(error: AxiosError): ApiError {
        if (error.response) {
            const data = error.response.data as { message?: string; code?: string };
            return {
                message: data.message || 'An error occurred',
                code: data.code || 'UNKNOWN_ERROR',
                status: error.response.status
            };
        } else if (error.request) {
            return {
                message: 'No response from server',
                code: 'NETWORK_ERROR',
                status: 0
            };
        }
        return {
            message: error.message || 'An error occurred',
            code: 'REQUEST_SETUP_ERROR',
            status: 0
        };
    }
}