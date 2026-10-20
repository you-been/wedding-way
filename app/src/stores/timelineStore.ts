import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WEDDING, WEDDING_ITEM, defaultItems, moveItem, weddingInfo, type TlItem } from '../data/timeline';
import { usePrefStore } from './prefStore';

// 내 타임라인 (이 브라우저에 저장). 순서 = 배열 순서, phase로 단계 구분
interface TimelineState {
  wedding: string;
  items: TlItem[];
  setWedding: (date: string) => void;
  update: (id: string, patch: Partial<TlItem>) => void;
  move: (id: string, toPhase: number, beforeId?: string | null) => void;
  nudge: (id: string, dir: -1 | 1) => void;
  add: (phase: number, title: string) => void;
  reset: () => void;
}

// 처음 열었을 때 이미 지난 단계의 항목은 완료로 표시
const fresh = (wedding: string) => {
  const { nowIdx } = weddingInfo(wedding);
  return defaultItems().map((it) => ({ ...it, done: it.phase < nowIdx, date: it.id === WEDDING_ITEM ? wedding : null }));
};

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      wedding: DEFAULT_WEDDING,
      items: fresh(DEFAULT_WEDDING),
      setWedding: (wedding) => {
        set({ wedding, items: get().items.map((it) => (it.id === WEDDING_ITEM ? { ...it, date: wedding } : it)) });
        usePrefStore.getState().set({ weddingDate: wedding });
      },
      update: (id, patch) => set({ items: get().items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }),
      move: (id, toPhase, beforeId = null) => set({ items: moveItem(get().items, id, toPhase, beforeId) }),
      nudge: (id, dir) => {
        const items = get().items;
        const item = items.find((it) => it.id === id);
        if (!item) return;
        const siblings = items.filter((it) => it.phase === item.phase && !it.hidden);
        const target = siblings[siblings.indexOf(item) + dir];
        if (!target) return;
        set({ items: dir < 0 ? moveItem(items, id, item.phase, target.id) : moveItem(items, target.id, item.phase, id) });
      },
      add: (phase, title) => {
        const id = `c${Date.now()}`;
        const item: TlItem = { id, phase, t: title, d: '', link: null, tag: '직접 추가', done: false, hidden: false, custom: true, date: null, memo: '' };
        set({ items: moveItem([...get().items, item], id, phase) }); // 해당 단계 맨 끝으로
      },
      reset: () => set({ wedding: DEFAULT_WEDDING, items: fresh(DEFAULT_WEDDING) }),
    }),
    {
      name: 'gs-timeline',
      partialize: ({ wedding, items }) => ({ wedding, items }),
      // 저장된 순서 · 사용자 입력은 유지하고 기본 항목 문구는 최신으로. 새로 생긴 기본 항목은 해당 단계 끝에
      merge: (persisted, current) => {
        const saved = persisted as Partial<TimelineState> | undefined;
        if (!saved?.items) return current;
        const defaults = new Map(defaultItems().map((it) => [it.id, it]));
        let items = saved.items
          .filter((it) => it.custom || defaults.has(it.id))
          .map((it) => (it.custom ? it : { ...it, ...pickCopy(defaults.get(it.id)!) }));
        defaults.forEach((it, id) => { if (!items.some((x) => x.id === id)) items = moveItem([...items, it], id, it.phase); });
        return { ...current, wedding: saved.wedding ?? current.wedding, items };
      },
    },
  ),
);

const pickCopy = ({ t, d, link, tag }: TlItem) => ({ t, d, link, tag });
