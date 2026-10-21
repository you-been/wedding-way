import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 예비부부 ↔ 업체 모드: 메뉴 구성을 정함 (업체 모드 = '내 웨딩' 대신 '내 업체')
interface ModeState {
  bizMode: boolean;
  tipClosed: boolean; // 헤더의 '업체회원이신가요?' 안내를 닫았는지
  splashDone: boolean; // 첫 방문 갈림길을 지나갔는지
  setBizMode: (biz: boolean) => void;
  closeTip: () => void;
  finishSplash: () => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      bizMode: false,
      tipClosed: false,
      splashDone: false,
      setBizMode: (bizMode) => set({ bizMode }),
      closeTip: () => set({ tipClosed: true }),
      finishSplash: () => set({ splashDone: true }),
    }),
    { name: 'gs-mode' },
  ),
);
