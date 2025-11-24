import { create } from 'zustand';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    login: (user: User) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    checkAuth: async () => {
        try {
            const { data } = await api.get('/me');
            set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
    login: (user) => set({ user, isAuthenticated: true }),
    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        }
    },
}));
