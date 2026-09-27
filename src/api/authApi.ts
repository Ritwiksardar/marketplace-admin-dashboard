import apiClient from './client';
import { store } from '../store';
import { logout, setCredentials } from '../store/slices/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginUser {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  success?: boolean;
  message?: string;
  user?: LoginUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: LoginUser;
    [key: string]: unknown;
  };
}

const normalizeUser = (user?: LoginUser): LoginUser | undefined => {
  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name ?? user.username ?? 'Admin User',
    email: user.email,
    role: user.role ?? 'admin',
  };
};

const getNestedValue = <T>(payload: Record<string, unknown>, key: string): T | undefined => {
  const direct = payload[key] as T | undefined;
  if (direct !== undefined) {
    return direct;
  }

  const nested = payload.data as Record<string, unknown> | undefined;
  return nested?.[key] as T | undefined;
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/email/login', credentials);
    const payload = (response.data ?? {}) as Record<string, unknown>;
    const token = (getNestedValue<string>(payload, 'token') ?? getNestedValue<string>(payload, 'accessToken')) ?? '';
    const user = normalizeUser((getNestedValue<LoginUser>(payload, 'user') ?? (payload.data as Record<string, unknown> | undefined)?.user) as LoginUser | undefined);

    if (!token) {
      throw new Error('Login succeeded but no access token was returned.');
    }

    store.dispatch(setCredentials({ token, user }));

    return {
      ...payload,
      ...(payload.data && typeof payload.data === 'object' ? (payload.data as Record<string, unknown>) : {}),
      token,
      user,
    };
  },

  logout: () => {
    store.dispatch(logout());
  },
};

export default authApi;
