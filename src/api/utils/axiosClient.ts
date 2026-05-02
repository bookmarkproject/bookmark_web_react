import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = 'https://bookmarkapp.store';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 — accessToken 자동 주입
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 — 401 시 토큰 갱신 후 재시도
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();
        const res = await axios.post(`${BASE_URL}/auth/refresh/token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch {
        useAuthStore.getState().clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
