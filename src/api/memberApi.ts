import { axiosClient } from './utils/axiosClient';

export const memberApi = {
  getMe: () =>
    axiosClient.get('/member/me'),

  deleteAccount: (id: number) =>
    axiosClient.delete(`/member/${id}`),

  uploadProfileImage: (formData: FormData) =>
    axiosClient.post('/member/profile/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getProfileImageUrl: () =>
    axiosClient.get('/member/profile'),
};
