import axios from 'axios';
import { store } from '@/store/store';
import { setAccessToken, clearAccessToken } from '@/store/authSlice';

const BASE_URL = 'https://bookmarkapp.store';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // refreshToken 쿠키 자동 전송
});

// 요청 인터셉터 — accessToken 자동 주입
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
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
        // refreshToken은 HttpOnly 쿠키로 자동 전송됨 (바디 불필요)
        const res = await axios.post(
          `${BASE_URL}/auth/refresh/token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        store.dispatch(setAccessToken(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch {
        store.dispatch(clearAccessToken());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
