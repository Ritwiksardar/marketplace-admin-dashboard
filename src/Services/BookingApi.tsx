import axios from 'axios';
import type { Booking } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    accessToken?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/email/login', credentials);
        const payload = response.data ?? {};
        const token = payload.token ?? payload.accessToken;

        if (!token) {
            throw new Error('Login succeeded but no access token was returned.');
        }

        localStorage.setItem('auth_token', token);
        return payload;
    },

    logout: (): void => {
        localStorage.removeItem('auth_token');
    },
};

export const bookingApi = {
    list: async (): Promise<Booking[]> => {
        const response = await apiClient.get<Booking[]>('/bookings');
        return response.data;
    },

    getById: async (bookingId: string): Promise<Booking> => {
        const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
        return response.data;
    },

    updateStatus: async (bookingId: string, status: Booking['status']): Promise<Booking> => {
        const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/status`, { status });
        return response.data;
    },
    
};

export default apiClient;
