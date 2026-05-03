import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BookRecord } from '@/models/bookRecord';

interface BookRecordState {
  bookRecords: BookRecord[];
}

const initialState: BookRecordState = {
  bookRecords: [],
};

const bookRecordSlice = createSlice({
  name: 'bookRecord',
  initialState,
  reducers: {
    setBookRecords(state, action: PayloadAction<BookRecord[]>) {
      state.bookRecords = action.payload;
    },
    appendBookRecords(state, action: PayloadAction<BookRecord[]>) {
      state.bookRecords.push(...action.payload);
    },
    updateBookRecord(state, action: PayloadAction<BookRecord>) {
      const index = state.bookRecords.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.bookRecords[index] = action.payload;
    },
    clearBookRecords(state) {
      state.bookRecords = [];
    },
  },
});

export const { setBookRecords, appendBookRecords, updateBookRecord, clearBookRecords } =
  bookRecordSlice.actions;
export default bookRecordSlice.reducer;
