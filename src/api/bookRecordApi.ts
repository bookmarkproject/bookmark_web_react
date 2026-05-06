import { axiosClient } from './utils/axiosClient';
import type { Book } from '@/models/book';
import type { BookRecord } from '@/models/bookRecord';

const normalize = (r: any): BookRecord => ({ ...r, book: r.bookResponse ?? r.book });

export const bookRecordApi = {
  create: (book: Book) =>
    axiosClient.post<BookRecord>('/book/record', book).then((res) => ({
      ...res,
      data: normalize(res.data),
    })),

  getMyRecords: () =>
    axiosClient.get<BookRecord[]>('/book/record/me').then((res) => ({
      ...res,
      data: res.data.map(normalize),
    })),

  getById: (id: number) =>
    axiosClient.get<BookRecord>(`/book/record/${id}`).then((res) => ({
      ...res,
      data: normalize(res.data),
    })),

  getByIsbn: (isbn: string) =>
    axiosClient.get('/book/record/recording', { params: { isbn } }),
};
