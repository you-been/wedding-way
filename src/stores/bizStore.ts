import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayStatus } from '../components/ui/Calendar';
import { BIZ_DEFAULT, INQUIRIES, type BizProfile, type Inquiry } from '../data/biz';

// 내 업체: 업체 정보 · 일정 표시는 이 브라우저에 저장, 문의는 화면을 떠나면 처음 상태로 (프로토타입)
interface BizState {
  profile: BizProfile;
  marks: Record<string, DayStatus>;
  inquiries: Inquiry[];
  saveProfile: (p: BizProfile) => void;
  mark: (key: string, s: DayStatus) => void;
  reply: (id: number, text: string) => void;
}

export const useBizStore = create<BizState>()(
  persist(
    (set, get) => ({
      profile: BIZ_DEFAULT,
      marks: {},
      inquiries: INQUIRIES,
      saveProfile: (profile) => set({ profile }),
      mark: (key, s) => set({ marks: { ...get().marks, [key]: s } }),
      reply: (id, text) => set({ inquiries: get().inquiries.map((q) => (q.id === id ? { ...q, status: 'done', reply: text } : q)) }),
    }),
    {
      name: 'gs-biz',
      partialize: ({ profile, marks }) => ({ profile, marks }),
      // v1: 활동 지역을 글자(region)에서 시 · 도 · 세부 지역(area)으로 바꿈 → 예전 저장값은 기본 활동 지역으로
      version: 1,
      migrate: (saved) => {
        const s = saved as { profile?: Partial<BizProfile> & { region?: string } };
        if (s.profile && !s.profile.area) {
          const profile = { ...s.profile, area: BIZ_DEFAULT.area };
          delete profile.region;
          s.profile = profile;
        }
        return s as unknown as BizState;
      },
    },
  ),
);
