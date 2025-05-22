import { AxiosError } from 'axios';
import { apiClient } from '@/app/api/utils/apiClient';
import { LoginCredentials, AuthResponse } from '@/app/types/auth.types';
import { ENDPOINTS } from '@/app/api/config';


export class AuthService {
    public static async login(credentials: LoginCredentials, router: ReturnType<typeof import('next/navigation').useRouter>): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
            if (response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
            }
            return response;
        } catch (error) {
            this.handleAuthError(error as AxiosError, router);
            throw error;
        }
    }

    public static logout(router:  ReturnType<typeof import('next/navigation').useRouter>): void {
        this.clearAuthData();
        router.push('/login');
    }

    private static clearAuthData(): void {
        localStorage.removeItem('accessToken');
    }

    private static handleAuthError(error: AxiosError, router: ReturnType<typeof import('next/navigation').useRouter>): void {
        if (error.response?.status === 401) {
            this.clearAuthData();
            router.push('/login');
        }
    }
}