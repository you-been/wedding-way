// 중립 추천: 광고 없이 정보 충실도 · 인증 후기 · 취향 일치만으로 정렬 (DESIGN.md 원칙 '중립 비교')
import { TIER_ORDER, type Tier, type Vendor } from './vendors';

/** 정렬 점수: 정보 충실도(0~4) + 후기 수 · 인증 후기 수 + 무드 일치 */
export function vendorScore(v: Vendor, myMoods: string[]): number {
  const info = [v.insta, v.schedule !== false, !!v.price, v.intro].filter(Boolean).length;
  const review = Math.log2(1 + v.reviews) * 2 + Math.log2(1 + v.verified) * 4;
  const moodMatch = v.moods.filter((m) => myMoods.includes(m)).length;
  return info * 6 + review + moodMatch * 8;
}

/** 추천 이유 칩: 무드 일치 · 예산 범위 안 · 인증 후기 많음 */
export function recoReasons(v: Vendor, myMoods: string[], myTier: Tier): string[] {
  const reasons: string[] = [];
  const mood = v.moods.find((m) => myMoods.includes(m));
  if (mood) reasons.push(`${mood} 일치`);
  if (TIER_ORDER.indexOf(v.tier) <= TIER_ORDER.indexOf(myTier)) reasons.push('예산 범위 안');
  if (v.verified >= 30) reasons.push('인증 후기 많음');
  return reasons;
}


/** 가격 문자열의 첫 숫자(만 원) — 낮은 가격순 정렬용, 비공개는 맨 뒤 */
export const priceNumber = (price: string | null) => (price ? Number(price.match(/\d+/)?.[0] ?? Infinity) : Infinity);
