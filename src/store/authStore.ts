import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  changePasswordToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setChangePasswordToken: (token: string) => void;
  clearChangePasswordToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      changePasswordToken: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearTokens: () =>
        set({ accessToken: null, refreshToken: null }),

      setChangePasswordToken: (token) =>
        set({ changePasswordToken: token }),

      clearChangePasswordToken: () =>
        set({ changePasswordToken: null }),
    }),
    {
      name: 'bookmark-auth',
      // accessToken은 메모리에만, refreshToken만 localStorage에 유지
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    }
  )
);
