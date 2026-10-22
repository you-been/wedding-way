import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 예산 항목별 계약금 · 확정 금액 (잔금은 확정 금액 − 계약금으로 계산) (계약하면 내 웨딩 > 예산 · 찜에서 직접 기록). 키는 예산 진단 항목 id, 금액은 만 원
export type SpendField = 'confirmed' | 'deposit';

interface SpendState {
  confirmed: Record<string, number>;
  deposit: Record<string, number>;
  setAmount: (field: SpendField, key: string, amount: number | null) => void;
}

export const useSpendStore = create<SpendState>()(
  persist(
    (set) => ({
      confirmed: {},
      deposit: {},
      setAmount: (field, key, amount) => set((s) => {
        const next = { ...s[field] };
        if (amount === null) delete next[key];
        else next[key] = amount;
        return { [field]: next };
      }),
    }),
    { name: 'gs-spend' },
  ),
);
