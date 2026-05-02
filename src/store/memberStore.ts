import { create } from 'zustand';
import type { Member } from '@/models/member';

interface MemberState {
  member: Member | null;
  setMember: (member: Member) => void;
  clear: () => void;
}

export const useMemberStore = create<MemberState>()((set) => ({
  member: null,
  setMember: (member) => set({ member }),
  clear: () => set({ member: null }),
}));
