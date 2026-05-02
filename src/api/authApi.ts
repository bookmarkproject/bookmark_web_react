import axios from 'axios';
import { axiosClient } from './utils/axiosClient';

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post('/auth/login', { email, password }),

  signup: (data: {
    email: string;
    password: string;
    name: string;
    nickname: string;
    gender: string;
    phone: string;
    birthday: string;
  }) => axiosClient.post('/auth/signup', data),

  checkNickname: (nickname: string) =>
    axiosClient.get(`/auth/duplication/nickname`, { params: { nickname } }),

  findEmail: (name: string, phone: string) =>
    axiosClient.post('/auth/find/email', { name, phone }),

  changePassword: (data: { email: string; password: string; changePasswordToken: string }) =>
    axiosClient.post('/auth/change/password', data),

  refreshToken: (refreshToken: string) =>
    axios.post('https://bookmarkapp.store/auth/refresh/token', { refreshToken }),
};
