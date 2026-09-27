import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject token into outgoing HTTP requests
apiClient.interceptors.request.use(
  (config) => {
    // Read token from Redux store first, with fallback to localStorage
    const token = store.getState().auth.token ?? localStorage.getItem('auth_token');

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth failures (401 Unauthorized) globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      // Clear token from Redux store and localStorage when token expires or becomes invalid
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;
