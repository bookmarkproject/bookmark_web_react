import { axiosClient } from './utils/axiosClient';

export const mailApi = {
  sendVerification: (email: string) =>
    axiosClient.post('/mail/send', { email }),

  checkCode: (email: string, code: string) =>
    axiosClient.post('/mail/check', { email, code }),
};
