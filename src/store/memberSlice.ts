import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Member } from '@/models/member';

interface MemberState {
  member: Member | null;
}

const initialState: MemberState = {
  member: null,
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setMember(state, action: PayloadAction<Member>) {
      state.member = action.payload;
    },
    clearMember(state) {
      state.member = null;
    },
  },
});

export const { setMember, clearMember } = memberSlice.actions;
export default memberSlice.reducer;
