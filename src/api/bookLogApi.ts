import { axiosClient } from './utils/axiosClient';

export const bookLogApi = {
  saveLog: (data: {
    bookRecordId: number;
    isOver: boolean;
    pageStart: number;
    pageEnd: number;
    readingTime: number;
    questions: string[];
    answers: string[];
    logType: string;
  }) => axiosClient.post('/book/log', data),

  saveOverLog: (data: {
    bookRecordId: number;
    questions: string[];
    answers: string[];
    logType: string;
  }) => axiosClient.post('/book/log/over', data),

  getLogsByRecordId: (id: number) =>
    axiosClient.get(`/book/log/${id}`),

  getQuestionsByLogId: (id: number) =>
    axiosClient.get(`/book/log/question/${id}`),
};
