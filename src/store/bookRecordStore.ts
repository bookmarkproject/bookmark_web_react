import { create } from 'zustand';
import type { BookRecord } from '@/models/bookRecord';

interface BookRecordState {
  bookRecords: BookRecord[];
  setBookRecords: (records: BookRecord[]) => void;
  appendBookRecords: (records: BookRecord[]) => void;
  updateBookRecord: (updated: BookRecord) => void;
  getByIsbn: (isbn: string) => BookRecord | undefined;
  clear: () => void;
}

export const useBookRecordStore = create<BookRecordState>()((set, get) => ({
  bookRecords: [],

  setBookRecords: (records) => set({ bookRecords: records }),

  appendBookRecords: (records) =>
    set((state) => ({ bookRecords: [...state.bookRecords, ...records] })),

  updateBookRecord: (updated) =>
    set((state) => ({
      bookRecords: state.bookRecords.map((r) =>
        r.id === updated.id ? updated : r
      ),
    })),

  getByIsbn: (isbn) =>
    get().bookRecords.find((r) => r.book.isbn === isbn),

  clear: () => set({ bookRecords: [] }),
}));
