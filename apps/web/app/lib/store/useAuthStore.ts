import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface User {
  userId: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  checkAuth: () => Promise<void>;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null, // Let persist handle loading this from storage
      isInitialized: false,

      checkAuth: async () => {
        const token = get().token;
        console.log(token);
        if (!token) {
          set({ user: null, isInitialized: true });
          return;
        }
        try {
          // Use NEXT_PUBLIC_ prefix for client-side access
          const apiUrl = process.env.NEXT_PUBLIC_HTTP_URL;
          const res = await axios.get(`${apiUrl}/isloggedin`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: res.data.user, isInitialized: true });
        } catch (err) {
          get().logout();
        }
      },

      login: (userData, token) => {
        set({ user: userData, token, isInitialized: true });
      },

      logout: () => {
        set({ user: null, token: null, isInitialized: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only save user/token; isInitialized should reset to false on refresh
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
