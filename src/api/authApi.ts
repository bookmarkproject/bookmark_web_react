import { axiosClient } from './utils/axiosClient';
import type { Member } from '@/models/member';

export interface LoginResponse extends Member {
  accessToken: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post<LoginResponse>('/auth/login', { email, password }),

  signup: (data: {
    email: string;
    password: string;
    name: string;
    nickname: string;
    gender: string;
    phoneNumber: string;
    birthday: string;
  }) => axiosClient.post('/auth/signup', data),

  checkNickname: (nickname: string) =>
    axiosClient.get('/auth/duplication/nickname', { params: { nickname } }),

  findEmail: (name: string, phoneNumber: string) =>
    axiosClient.post<{ email: string }>('/auth/find/email', { name, phoneNumber }),

  changePassword: (data: { email: string; password: string; changePasswordToken: string }) =>
    axiosClient.post('/auth/change/password', data),
};
