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
                message: data.message || 'Se ha producido un error',
                code: data.code || 'UNKNOWN_ERROR',
                status: error.response.status
            };
        } else if (error.request) {
            return {
                message: 'Sin respuesta del servidor',
                code: 'NETWORK_ERROR',
                status: 0
            };
        }
        return {
            message: error.message || 'Se ha producido un error',
            code: 'REQUEST_SETUP_ERROR',
            status: 0
        };
    }
}