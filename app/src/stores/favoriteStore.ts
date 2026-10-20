import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 찜한 업체 (내 웨딩 '찜한 업체'에 보임)
interface FavoriteState {
  ids: number[];
  toggle: (id: number) => boolean; // 찜했으면 true
  has: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ids: [1, 2, 4, 3], // 프로토타입 시작 상태
      toggle: (id) => {
        const on = !get().ids.includes(id);
        set({ ids: on ? [...get().ids, id] : get().ids.filter((x) => x !== id) });
        return on;
      },
      has: (id) => get().ids.includes(id),
    }),
    { name: 'gs-favorites' },
  ),
);
