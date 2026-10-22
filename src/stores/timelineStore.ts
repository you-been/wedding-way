import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WEDDING, TL_PHASES, WEDDING_ITEM, defaultItems, moveItem, weddingInfo, type TlItem } from '../data/timeline';
import { usePrefStore } from './prefStore';

// 내 타임라인 (이 브라우저에 저장). 순서 = 배열 순서, phase로 단계 구분
interface TimelineState {
  wedding: string;
  venue: string; // 예식장 이름 (내 웨딩 배너에서 입력, 빈 값이면 미정). 타임라인 초기화와 상관없이 유지
  items: TlItem[];
  phaseNames: Record<number, string>; // 사용자가 바꾼 단계 이름 (없으면 기본 이름)
  setWedding: (date: string) => void;
  setVenue: (name: string) => void;
  update: (id: string, patch: Partial<TlItem>) => void;
  move: (id: string, toPhase: number, beforeId?: string | null) => void;
  add: (phase: number, title: string) => void;
  renamePhase: (phase: number, name: string) => void; // 빈 이름이면 기본 이름으로
  reset: () => void;
}

// 기본 항목의 문구 (저장된 항목에 최신 문구를 덮을 때). 스토어 생성 중 불러오기에서 쓰이므로 위에 선언
const pickCopy = ({ t, d, link, tag }: TlItem) => ({ t, d, link, tag });

// 처음 열었을 때 이미 지난 단계의 항목은 완료로 표시
const fresh = (wedding: string) => {
  const { nowIdx } = weddingInfo(wedding);
  return defaultItems().map((it) => ({ ...it, done: it.phase < nowIdx, date: it.id === WEDDING_ITEM ? wedding : null }));
};

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      wedding: DEFAULT_WEDDING,
      venue: '',
      items: fresh(DEFAULT_WEDDING),
      phaseNames: {},
      setWedding: (wedding) => {
        set({ wedding, items: get().items.map((it) => (it.id === WEDDING_ITEM ? { ...it, date: wedding } : it)) });
        usePrefStore.getState().set({ weddingDate: wedding });
      },
      setVenue: (name) => set({ venue: name.trim() }),
      update: (id, patch) => set({ items: get().items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }),
      move: (id, toPhase, beforeId = null) => set({ items: moveItem(get().items, id, toPhase, beforeId) }),
      add: (phase, title) => {
        const id = `c${Date.now()}`;
        const item: TlItem = { id, phase, t: title, d: '', link: null, tag: '직접 추가', done: false, hidden: false, custom: true, date: null, memo: '' };
        set({ items: moveItem([...get().items, item], id, phase) }); // 해당 단계 맨 끝으로
      },
      renamePhase: (phase, name) => {
        const next = { ...get().phaseNames };
        const t = name.trim();
        if (!t || t === TL_PHASES[phase].title) delete next[phase]; else next[phase] = t;
        set({ phaseNames: next });
      },
      reset: () => set({ wedding: DEFAULT_WEDDING, items: fresh(DEFAULT_WEDDING), phaseNames: {} }),
    }),
    {
      name: 'gs-timeline',
      onRehydrateStorage: () => (_state, error) => { if (error) console.error('[timeline] 저장된 타임라인을 불러오지 못했어요', error); },
      partialize: ({ wedding, venue, items, phaseNames }) => ({ wedding, venue, items, phaseNames }),
      // 저장된 순서 · 사용자 입력은 유지하고 기본 항목 문구는 최신으로. 새로 생긴 기본 항목은 해당 단계 끝에
      merge: (persisted, current) => {
        const saved = persisted as Partial<TimelineState> | undefined;
        if (!saved?.items) return current;
        const defaults = new Map(defaultItems().map((it) => [it.id, it]));
        let items = saved.items
          .filter((it) => it.custom || defaults.has(it.id))
          .map((it) => (it.custom ? it : { ...it, ...pickCopy(defaults.get(it.id)!) }));
        defaults.forEach((it, id) => { if (!items.some((x) => x.id === id)) items = moveItem([...items, it], id, it.phase); });
        return { ...current, wedding: saved.wedding ?? current.wedding, venue: saved.venue ?? '', items, phaseNames: saved.phaseNames ?? {} };
      },
    },
  ),
);


/** 단계 이름 (사용자가 바꿨으면 그 이름) */
export const usePhaseTitle = () => {
  const names = useTimelineStore((st) => st.phaseNames);
  return (phase: number) => names[phase] ?? TL_PHASES[phase].title;
};
