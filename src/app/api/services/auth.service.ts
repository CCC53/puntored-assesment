import { apiClient } from '../utils/apiClient';
import { LoginCredentials, AuthResponse } from '../types/auth.types';

export class AuthService {
    public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/api/auth', credentials);
            if (response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
            }
            return response;
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    public static logout(): void {
        this.clearAuthData();
    }

    private static clearAuthData(): void {
        localStorage.removeItem('accessToken');
    }

    private static handleAuthError(error: any): void {
        if (error.response?.status === 401) {
            this.clearAuthData();
            window.location.href = '/login';
        }
    }
}