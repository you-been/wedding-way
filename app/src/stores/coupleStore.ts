import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 짝꿍 연동 (프로토타입: 이 브라우저에만 저장)
export interface Couple { a: string; b: string; since: string } // a = 초대한 사람, b = 수락한 사람
export const INVITE_CODE = 'A7K2P9';
export const DEMO_PARTNER = '준혁'; // 같은 브라우저로 시연할 때 수락하는 예시 짝꿍

interface CoupleState {
  couple: Couple | null;
  link: (c: Couple) => void;
  unlink: () => void;
}

export const useCoupleStore = create<CoupleState>()(
  persist(
    (set) => ({
      couple: null,
      link: (couple) => set({ couple }),
      unlink: () => set({ couple: null }),
    }),
    { name: 'gs-couple' },
  ),
);
