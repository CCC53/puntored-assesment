export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    responseCode: number;
    responseMessage: string;
    data: {
        token: string;
        createdAt: string;
    }
}

export interface AuthError {
    responseCode: number;
    responseMessage: string;
    data: {
        errors: {
            message: string;
        }
    }
}