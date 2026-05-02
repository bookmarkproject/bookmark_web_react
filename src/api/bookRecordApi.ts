import { axiosClient } from './utils/axiosClient';
import type { Book } from '@/models/book';

export const bookRecordApi = {
  create: (book: Book) =>
    axiosClient.post('/book/record', { book }),

  getMyRecords: () =>
    axiosClient.get('/book/record/me'),

  getById: (id: number) =>
    axiosClient.get(`/book/record/${id}`),

  getByIsbn: (isbn: string) =>
    axiosClient.get('/book/record/recording', { params: { isbn } }),
};
