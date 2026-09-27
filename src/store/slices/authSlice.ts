import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialToken = getStoredToken();

const initialState: AuthState = {
  token: initialToken,
  user: getStoredUser(),
  isAuthenticated: Boolean(initialToken),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: AuthUser | null }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user ?? null;
      state.isAuthenticated = true;

      try {
        localStorage.setItem('auth_token', token);
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('auth_user');
        }
      } catch (err) {
        console.error('Failed to persist auth state:', err);
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      try {
        localStorage.setItem('auth_token', action.payload);
      } catch (err) {
        console.error('Failed to persist token to localStorage:', err);
      }
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem('auth_user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('auth_user');
        }
      } catch (err) {
        console.error('Failed to persist user to localStorage:', err);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } catch (err) {
        console.error('Failed to clear auth state from localStorage:', err);
      }
    },
  },
});

export const { setCredentials, setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
