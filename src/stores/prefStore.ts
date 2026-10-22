import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HallRegionId } from '../data/budget';

// 취향 진단 결과 (디렉토리 추천 · 예산 진단 시작값 · 내 웨딩 예식일에 쓰임)
export type PrepMethod = '플래너 동행' | '플래너 비동행' | '일부 동행' | '완전 워크인 (셀프)';

interface PrefState {
  method: PrepMethod;
  weddingDate: string; // YYYY-MM-DD
  guests: string;
  venue: string;
  region: HallRegionId; // 예식 지역 (예식장 · 식대 추천에 씀)
  budgetPreset: string;
  budgetCustom: number; // '직접 입력'으로 정한 총예산 (만 원)
  moods: string[];
  set: (patch: Partial<Omit<PrefState, 'set' | 'toggleMood'>>) => void;
  toggleMood: (m: string) => void;
}

export const usePrefStore = create<PrefState>()(
  persist(
    (set) => ({
      method: '플래너 동행',
      weddingDate: '2027-06-12',
      guests: '100~200명',
      venue: '웨딩홀',
      region: 'seoul',
      budgetPreset: '4~5천만 원대',
      budgetCustom: 0,
      moods: ['#감성적', '#빈티지'],
      set: (patch) => set(patch),
      toggleMood: (m) => set((s) => ({ moods: s.moods.includes(m) ? s.moods.filter((x) => x !== m) : [...s.moods, m] })),
    }),
    { name: 'gs-pref' },
  ),
);
