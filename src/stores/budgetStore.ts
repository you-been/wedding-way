import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calcBudget, initialBudget, type BudgetData } from '../data/budget';
import type { Tier } from '../data/vendors';

// 예산 진단 입력 상태 (진단 → 리포트 → 내 웨딩 예산 탭이 같이 씀)
interface BudgetState extends BudgetData {
  /** 복사본을 고쳐서 한 번에 반영. fn이 false를 돌려주면 변경을 버림 */
  edit: (fn: (draft: BudgetData) => void | boolean) => boolean;
  reset: () => void;
}

const pick = ({ cats, locks, hallSetup, wish }: BudgetData): BudgetData => ({ cats, locks, hallSetup, wish });

export const useBudgetStore = create<BudgetState>()(
  persist<BudgetState, [], [], BudgetData>(
    (set, get) => ({
      ...initialBudget(),
      edit: (fn) => {
        const draft = structuredClone(pick(get()));
        if (fn(draft) === false) return false;
        set(draft);
        return true;
      },
      reset: () => set(initialBudget()),
    }),
    { name: 'gs-budget', partialize: pick },
  ),
);

/** 예산 진단 총예산으로 판정된 가격대 (추천 이유 '예산 범위 안'에 씀) */
export const useMyTier = (): Tier => useBudgetStore((s) => calcBudget(s).tier.key);
