import type { Book } from './book';

export interface BookRecord {
  id: number;
  book: Book;
  page: number;
  readingTime: number;
  status: '독서중' | '완독';
}
