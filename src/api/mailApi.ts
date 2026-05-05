import { axiosClient } from './utils/axiosClient';

export const mailApi = {
  sendVerification: (email: string) =>
    axiosClient.post('/mail/send', { email }),

  checkCode: (email: string, authNum: string, type?: string) =>
    axiosClient.post<{ isVerified: boolean; passwordChangeToken?: string }>(
      '/mail/check',
      { email, authNum, type }
    ),
};
