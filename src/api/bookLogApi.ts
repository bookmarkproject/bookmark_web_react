import { axiosClient } from './utils/axiosClient';

export const bookLogApi = {
  saveLog: (data: {
    bookRecordId: number;
    pageStart: number;
    pageEnd: number;
    readingTime: number;
    answers: string[];
  }) => axiosClient.post('/book/log', data),

  saveOverLog: (data: {
    bookRecordId: number;
    answers: string[];
  }) => axiosClient.post('/book/log/over', data),

  getLogsByRecordId: (id: number) =>
    axiosClient.get(`/book/log/${id}`),

  getQuestionsByLogId: (id: number) =>
    axiosClient.get(`/book/log/question/${id}`),
};
