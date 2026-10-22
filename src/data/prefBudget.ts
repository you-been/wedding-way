// 취향 진단 답 → 예산 진단 시작값
import { HALL_REGIONS, calcBudget, hallEstimate, initialBudget, setTotal, type BudgetData, type HallRegionId, type HallTypeId } from './budget';

/** 예상 하객 수 칩 → 식대 계산에 쓰는 인원 */
export const GUEST_CHOICES: [label: string, count: number][] = [
  ['50명 이하', 50], ['50~100명', 100], ['100~200명', 150], ['200~300명', 250], ['300명 이상', 300],
];
/** 예식 형태 칩 → 예식장 추천 유형 ('미정'이면 평균가 그대로) */
export const VENUE_CHOICES: [label: string, type: HallTypeId | null][] = [
  ['웨딩홀', 'hall'], ['호텔', 'hotel'], ['하우스·카페 스몰웨딩', 'house'], ['야외', 'outdoor'], ['미정', null],
];
/** 총 예산 칩 → 예산 진단 총예산 (만 원). '직접 입력'은 입력한 금액 */
export const BUDGET_CHOICES: [label: string, total: number | null][] = [
  ['3천만 원대', 3000], ['4~5천만 원대', 4500], ['5,500만 원 이상', 6000], ['직접 입력', null],
];
export const REGION_CHOICES = HALL_REGIONS;

export interface PrefAnswers { guests: string; venue: string; region: HallRegionId; budgetPreset: string; budgetCustom: number }

/** 고른 총예산 (만 원). 직접 입력인데 금액이 없으면 null */
export function prefTotal(p: PrefAnswers): number | null {
  const preset = BUDGET_CHOICES.find(([label]) => label === p.budgetPreset);
  if (!preset) return null;
  return preset[1] ?? (p.budgetCustom > 0 ? p.budgetCustom : null);
}

/** 예식 형태 · 하객 수 · 지역으로 예식장 추천을 넣은 예산 (항목 금액은 평균가) */
function averageBudget(p: PrefAnswers): BudgetData {
  const b = initialBudget();
  const type = VENUE_CHOICES.find(([label]) => label === p.venue)?.[1];
  const guests = GUEST_CHOICES.find(([label]) => label === p.guests)?.[1];
  if (type && guests) b.hallSetup = { type, region: p.region, guests, total: hallEstimate(type, p.region, guests).total };
  return b;
}

/** 진단 조건으로 항목별 평균가를 더한 예산 (만 원) — 3단계 안내에 씀 */
export const prefAverage = (p: PrefAnswers) => Math.round(calcBudget(averageBudget(p)).E);

/** 진단을 마칠 때 예산 진단에 넣을 시작값: 평균가 예산을 고른 총예산에 맞춰 비율대로 조정 */
export function budgetFromPref(p: PrefAnswers): BudgetData {
  const b = averageBudget(p);
  const total = prefTotal(p);
  if (total) setTotal(b, total);
  return b;
}
