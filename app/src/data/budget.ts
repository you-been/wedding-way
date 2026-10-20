// 예산 진단 데이터 · 계산 (프로토타입 예시 금액, 단위 만 원)
// 상태(BudgetData)는 stores/budgetStore가 들고, 여기 함수들은 상태를 읽거나 복사본(draft)을 고친다.
import { Camera, Flower2, Mic, Sparkles, type LucideIcon } from 'lucide-react';

/* ---------- 추가 위시리스트 ---------- */
export const WISH_GROUPS: { id: string; name: string; Icon: LucideIcon }[] = [
  { id: 'shoot', name: '촬영', Icon: Camera },
  { id: 'beauty', name: '뷰티', Icon: Sparkles },
  { id: 'stage', name: '본식 연출', Icon: Mic },
  { id: 'deco', name: '꾸밈 · 기타', Icon: Flower2 },
];
export const WISHLIST = [
  { g: 'shoot', name: '아이폰스냅', cost: 30, d: '감성 아이폰 촬영 · 원본 제공' },
  { g: 'shoot', name: '본식스냅', cost: 100, d: '본식 당일 사진 작가' },
  { g: 'shoot', name: '본식 영상', cost: 80, d: '본식 DVD · 하이라이트 영상' },
  { g: 'shoot', name: '폐백 · 가족 촬영', cost: 20, d: '폐백 · 가족사진 추가 촬영' },
  { g: 'beauty', name: '헤어변형', cost: 40, d: '촬영 중 헤어 스타일 변경' },
  { g: 'beauty', name: '웨딩 네일', cost: 7, d: '본식 전 네일 케어' },
  { g: 'beauty', name: '피부 관리', cost: 20, d: '본식 전 피부 관리 코스' },
  { g: 'beauty', name: '혼주 메이크업', cost: 25, d: '양가 어머님 헤어 · 메이크업' },
  { g: 'stage', name: '식전영상', cost: 15, d: '입장 전 상영 영상' },
  { g: 'stage', name: '본식 사회자', cost: 30, d: '전문 사회자 섭외' },
  { g: 'stage', name: '축가', cost: 30, d: '전문 축가 가수' },
  { g: 'stage', name: '축의대 대행', cost: 20, d: '축의금 접수 대행' },
  { g: 'stage', name: '웨딩 헬퍼', cost: 20, d: '본식 당일 신부 도우미' },
  { g: 'stage', name: '2부 드레스', cost: 30, d: '피로연 · 2부 드레스 대여' },
  { g: 'deco', name: '본식 부케', cost: 30, d: '본식 부케 · 부토니에' },
  { g: 'deco', name: '촬영 부케', cost: 20, d: '스튜디오 · 야외 촬영용 부케' },
  { g: 'deco', name: '본식 꽃장식 업그레이드', cost: 50, d: '버진로드 · 단상 꽃장식' },
  { g: 'deco', name: '웨딩 소품', cost: 10, d: '포토테이블 · 소품' },
  { g: 'deco', name: '모바일 청첩장', cost: 3, d: '디자인 청첩장' },
  { g: 'deco', name: '종이 청첩장', cost: 20, d: '디자인 · 인쇄 · 봉투' },
  { g: 'deco', name: '답례품', cost: 40, d: '하객 답례품' },
];

/* ---------- 기본 항목 (본식 · 스 · 드 · 메) ---------- */
export const BASIC_ITEMS = [
  { id: 'hall', name: '본식 (예식장 · 식대)', d: '대관 · 식대 · 기본 연출' },
  { id: 'shoot', name: '촬영', options: [
    { id: 'studio', name: '스튜디오', d: '실내 스튜디오 촬영' },
    { id: 'outdoor', name: '야외스냅', d: '야외 · 제주 등 로케이션 촬영 (드레스 제외)' },
  ] },
  { id: 'dress', name: '드레스', d: '촬영 · 본식 드레스', dNoShoot: '본식 드레스' },
  { id: 'makeup', name: '메이크업', d: '촬영 · 본식 헤어 · 메이크업', dNoShoot: '본식 헤어 · 메이크업' },
];
export const SHOOT_IDS = ['studio', 'outdoor']; // 둘 중 하나만

/* ---------- 예산 항목 (결심 기준표 항목). 모두 뺄 수 있음 ---------- */
// 차트 색은 항목 구분용 데이터 색 (UI 포인트 색과 별개)
export const BUDGET_CATALOG: { id: string; name: string; color: string; subs?: { id: string; name: string; share: number; optional?: boolean }[] }[] = [
  { id: 'hall', name: '예식장 · 식대', color: '#ff7aa2' },
  { id: 'sdm', name: '스드메', color: '#212224', subs: [
    { id: 'studio', name: '스튜디오', share: 0.40 },
    { id: 'outdoor', name: '야외스냅', share: 0.40, optional: true }, // 스튜디오 대신 고를 때만
    { id: 'dress', name: '드레스', share: 0.35 },
    { id: 'makeup', name: '메이크업', share: 0.25 },
  ] },
  { id: 'jewelry', name: '예물', color: '#6c8cff' },
  { id: 'suit', name: '예복', color: '#5fc4a0' },
  { id: 'honeymoon', name: '신혼여행', color: '#f5b83d' },
  { id: 'etc', name: '기타 준비 비용', color: '#c8cad2' },
];
const CUSTOM_COLORS = ['#9c8cf0', '#ffb38a', '#7fb8e6', '#d9a0e0', '#8fd18f'];
const OVERFLOW_COLOR = '#c2453d';

/* 결심 기준표 — 항목별 [가성비형, 표준형, 고급형]의 [최소, 최대] */
type Ranges = [number, number][];
const REF_TABLE: Record<string, Ranges> = {
  hall: [[1800, 2100], [1900, 2400], [2500, 4000]],
  sdm: [[350, 550], [500, 800], [800, 1500]],
  jewelry: [[105, 245], [280, 630], [700, 1750]], // 기준표 '예물 · 예복'을 7 : 3으로 나눔
  suit: [[45, 105], [120, 270], [300, 750]],
  honeymoon: [[200, 400], [400, 800], [800, 1500]],
  etc: [[100, 200], [300, 600], [500, 1000]],
};
/* 항목 평균가 — 기준표 표준형 중간값 기준 예시 */
export const AVG_COST: Record<string, number> = { hall: 2000, studio: 150, outdoor: 140, dress: 130, makeup: 90, jewelry: 240, suit: 120, honeymoon: 800 };
const AVG_NO_SHOOT: Record<string, number> = { dress: 80, makeup: 60 }; // 촬영을 안 하면 본식만
const SDM_AVG = AVG_COST.studio + AVG_COST.dress + AVG_COST.makeup;
export const CUSTOM_MAX = 10000; // 직접 정하는 항목: 0 ~ 1억 원

/* ---------- 예식장 · 식대 추천 (예시 단가) ---------- */
export const HALL_TYPES = [
  { id: 'hall', name: '웨딩홀', d: '가장 일반적인 예식장', meal: 6.5, base: { gangnam: 800, seoul: 700, metro: 400, city: 250, jeju: 200, local: 200 } },
  { id: 'hotel', name: '호텔', d: '호텔 연회장 · 고급 코스 식사', meal: 13, base: { gangnam: 1400, seoul: 1100, metro: 700, city: 500, jeju: 600, local: 400 } },
  { id: 'house', name: '하우스 · 스몰웨딩', d: '소규모 단독 공간', meal: 9, base: { gangnam: 1100, seoul: 800, metro: 600, city: 400, jeju: 500, local: 350 } },
  { id: 'outdoor', name: '야외', d: '가든 · 야외 정원 예식', meal: 8, base: { gangnam: 1400, seoul: 1100, metro: 800, city: 500, jeju: 800, local: 500 } },
  { id: 'chapel', name: '종교시설', d: '성당 · 교회 · 사찰', meal: 5, base: { gangnam: 250, seoul: 200, metro: 150, city: 100, jeju: 100, local: 100 } },
] as const;
export const HALL_REGIONS = [
  { id: 'gangnam', name: '서울 강남권', rate: 1.25 },
  { id: 'seoul', name: '서울 기타', rate: 1.1 },
  { id: 'metro', name: '경기 · 인천', rate: 1.0 },
  { id: 'city', name: '광역시', rate: 0.9 },
  { id: 'local', name: '그 외 지역', rate: 0.8 },
  { id: 'jeju', name: '제주', rate: 1.0 },
] as const;
export const GUEST_OPTIONS = [50, 100, 150, 200, 300];
export type HallTypeId = (typeof HALL_TYPES)[number]['id'];
export type HallRegionId = (typeof HALL_REGIONS)[number]['id'];

export function hallEstimate(type: HallTypeId, region: HallRegionId, guests: number) {
  const t = HALL_TYPES.find((x) => x.id === type)!;
  const r = HALL_REGIONS.find((x) => x.id === region)!;
  const meal = t.meal * r.rate;
  const base = t.base[r.id];
  return { meal, base, food: meal * guests, total: Math.round(meal * guests + base) };
}

/* ---------- 상태 ---------- */
export interface BudgetSub { id: string; name: string; share: number; w: number }
export interface BudgetCat { id: string; name: string; color: string; w: number; open: boolean; custom?: boolean; subs: BudgetSub[] | null }
export interface HallSetup { type: HallTypeId; region: HallRegionId; guests: number; total: number }
export interface BudgetData {
  cats: BudgetCat[];
  locks: string[]; // 고정한 항목 key ('hall', 'sdm.dress' …) — 총예산을 바꿔도 금액 유지
  hallSetup: HallSetup | null; // 추천받기 결과 — 있으면 예식장 평균가 대신
  wish: string[];
}

const makeCat = (c: (typeof BUDGET_CATALOG)[number]): BudgetCat => ({
  id: c.id, name: c.name, color: c.color, w: 1, open: false,
  subs: c.subs ? c.subs.filter((s) => !s.optional).map(({ id, name, share }) => ({ id, name, share, w: 1 })) : null,
});
const wishSum = (names: string[]) => WISHLIST.filter((w) => names.includes(w.name)).reduce((s, w) => s + w.cost, 0);

export function initialBudget(): BudgetData {
  const wish = ['아이폰스냅', '헤어변형'];
  const cats = BUDGET_CATALOG.map(makeCat);
  cats.find((c) => c.id === 'etc')!.w = wishSum(wish); // 기타 준비 비용 = 금액을 직접 정하는 항목, 시작값은 위시리스트 합계
  return { cats, locks: [], hallSetup: null, wish };
}

/* ---------- 읽기 도우미 ---------- */
export const sdmCat = (b: BudgetData) => b.cats.find((c) => c.id === 'sdm');
export const hasSub = (b: BudgetData, id: string) => !!sdmCat(b)?.subs?.some((s) => s.id === id);
export const noShoot = (b: BudgetData) => !SHOOT_IDS.some((id) => hasSub(b, id));
export const avgOf = (b: BudgetData, id: string) => (noShoot(b) && AVG_NO_SHOOT[id] != null ? AVG_NO_SHOOT[id] : AVG_COST[id]);
export const wishTotal = (b: BudgetData) => wishSum(b.wish);
export const isCustomKey = (b: BudgetData, key: string) => !!b.cats.find((c) => c.id === key)?.custom;
export const isFreeKey = (b: BudgetData, key: string) => key === 'etc' || isCustomKey(b, key); // 슬라이더가 배수가 아닌 금액
export const sliderMax = (b: BudgetData, key: string) => (isFreeKey(b, key) ? CUSTOM_MAX : key === 'hall' ? 5 : 3);
export const won = (man: number) => {
  const v = Math.round(man);
  return v >= 10000 ? `${(v / 10000).toFixed(1)}억 원` : `${v.toLocaleString()}만 원`;
};
export const fmtW = (b: BudgetData, key: string, w: number) => (isFreeKey(b, key) ? won(w) : `×${w.toFixed(1)}`);

/* 실제 금액이 나가는 단위(leaf): 일반 항목, 스드메는 하위 항목. est = 평균가, w = 배수 */
interface Leaf { key: string; cat: BudgetCat; sub?: BudgetSub; est: number; w: number }
function leaves(b: BudgetData): Leaf[] {
  const out: Leaf[] = [];
  b.cats.forEach((c) => {
    if (c.subs) c.subs.forEach((s) => out.push({ key: `${c.id}.${s.id}`, cat: c, sub: s, est: avgOf(b, s.id) ?? 0, w: c.w * s.w }));
    else out.push({ key: c.id, cat: c, est: c.id === 'etc' || c.custom ? 1 : c.id === 'hall' && b.hallSetup ? b.hallSetup.total : AVG_COST[c.id], w: c.w });
  });
  return out;
}
const leafAmount = (l: Leaf) => l.est * l.w; // 항목 금액 = 평균가 × 배수

/* ---------- 고치기 (draft를 직접 바꿈) ---------- */
export function target(b: BudgetData, key: string) {
  const [catId, subId] = key.split('.');
  const cat = b.cats.find((c) => c.id === catId);
  return subId ? cat?.subs?.find((s) => s.id === subId) : cat;
}

export function addCat(b: BudgetData, key: string) {
  const [catId, subId] = key.split('.');
  const def = BUDGET_CATALOG.find((c) => c.id === catId)!;
  if (subId) {
    let cat = b.cats.find((c) => c.id === catId);
    if (!cat) { cat = { ...makeCat(def), subs: [] }; b.cats.push(cat); }
    const s = def.subs!.find((x) => x.id === subId)!;
    cat.subs!.push({ id: s.id, name: s.name, share: s.share, w: 1 });
    cat.subs!.sort((a, z) => def.subs!.findIndex((s2) => s2.id === a.id) - def.subs!.findIndex((s2) => s2.id === z.id));
  } else {
    const cat = makeCat(def);
    if (catId === 'etc') cat.w = wishTotal(b); // 다시 넣으면 위시리스트 합계부터
    b.cats.push(cat);
  }
}

export function removeCat(b: BudgetData, key: string) {
  b.locks = b.locks.filter((k) => k !== key && !k.startsWith(`${key}.`));
  const [catId, subId] = key.split('.');
  const cat = b.cats.find((c) => c.id === catId);
  if (!cat) return;
  if (subId) {
    cat.subs = cat.subs!.filter((s) => s.id !== subId);
    if (!cat.subs.length) b.cats = b.cats.filter((c) => c !== cat); // 하위가 모두 빠지면 묶음도 뺌
  } else {
    b.cats = b.cats.filter((c) => c !== cat);
  }
}

export function addCustomCat(b: BudgetData, name: string) {
  const used = b.cats.filter((c) => c.custom).length;
  b.cats.push({ id: `custom${Date.now()}`, name, color: CUSTOM_COLORS[used % CUSTOM_COLORS.length], w: 0, open: false, custom: true, subs: null }); // 0원에서 시작
}

// 스드메 하위 항목 켜기/끄기 (스드메 묶음이 없으면 새로 만듦)
export function setSdmSub(b: BudgetData, id: string, on: boolean) {
  if (on === hasSub(b, id)) return;
  if (on) addCat(b, `sdm.${id}`); else removeCat(b, `sdm.${id}`);
}

/* 위시리스트 선택 — 기타 준비 비용이 그 항목 가격만큼 정확히 늘거나 줄도록 */
export function toggleWish(b: BudgetData, name: string, on: boolean) {
  const cost = WISHLIST.find((w) => w.name === name)!.cost;
  const etc = b.cats.find((c) => c.id === 'etc');
  b.wish = on ? [...b.wish, name] : b.wish.filter((n) => n !== name);
  if (etc) etc.w = Math.max(etc.w + (on ? cost : -cost), 0); // 기타 준비 비용 금액 = w
}

/* 금액 직접 입력 → 그 금액이 되도록 이 항목의 배수만 바꿈 (총예산은 합계로 따라감) */
export function setAmount(b: BudgetData, key: string, value: number) {
  const leaf = leaves(b).find((l) => l.key === key);
  if (!leaf) return;
  const v = Math.min(Math.max(Math.round(value || 0), 0), isFreeKey(b, key) ? CUSTOM_MAX : Infinity);
  const groupW = leaf.sub ? leaf.cat.w : 1;
  const t = target(b, key);
  if (t && leaf.est > 0 && groupW > 0) t.w = v / (leaf.est * groupW);
}

/* 총예산을 직접 바꾸면: 고정 안 한 항목의 배수를 같은 비율로 조정해서 합계를 맞춤. 조정할 항목이 없으면 false */
export function setTotal(b: BudgetData, total: number) {
  const ls = leaves(b);
  const pinnedSum = ls.filter((l) => b.locks.includes(l.key)).reduce((a, l) => a + leafAmount(l), 0);
  const freeSum = ls.filter((l) => !b.locks.includes(l.key)).reduce((a, l) => a + leafAmount(l), 0);
  if (freeSum <= 0) return false;
  const f = Math.max(total - pinnedSum, 0) / freeSum;
  b.cats.forEach((c) => {
    if (c.subs) c.subs.forEach((s) => { if (!b.locks.includes(`${c.id}.${s.id}`)) s.w *= f; });
    else if (!b.locks.includes(c.id)) c.w *= f;
  });
  return true;
}

export function resetToAverage(b: BudgetData) {
  b.cats.forEach((c) => {
    if (c.id === 'etc') c.w = wishTotal(b);
    else if (!c.custom) c.w = 1; // 직접 추가 항목은 평균가가 없어 그대로
    (c.subs ?? []).forEach((x) => { x.w = 1; });
  });
}

/* ---------- 가격대 판정: 총예산으로 정해지는 결과 ---------- */
export const TIER_MIN = 2500; // 가성비형 기준 최저 — 이보다 낮으면 안내
export const TIER_LOW = 3500; // 미만 → 가성비형
export const TIER_HIGH = 5500; // 이상 → 고급형
export const TIERS = [
  { key: '가성비', name: '가성비형' },
  { key: '표준', name: '표준형' },
  { key: '프리미엄', name: '고급형' },
] as const;
export type BudgetTier = (typeof TIERS)[number];
export const tierOf = (amount: number): BudgetTier => TIERS[amount < TIER_LOW ? 0 : amount < TIER_HIGH ? 1 : 2];
// 눈금 위치 (0~1): 세 구간을 같은 폭으로
export const tierPos = (t: number) => (t < TIER_LOW ? t / TIER_LOW / 3
  : t < TIER_HIGH ? 1 / 3 + (t - TIER_LOW) / (TIER_HIGH - TIER_LOW) / 3
    : 2 / 3 + Math.min((t - TIER_HIGH) / TIER_HIGH, 1) / 3);

/* ---------- 계산 ---------- */
export interface Judged { ranges: Ranges | null; level: BudgetTier | null; belowFloor: boolean }
export interface CalcSub extends Judged { id: string; key: string; name: string; amount: number; est: number; pinned: boolean }
export interface CalcItem extends Judged { id: string; key: string; name: string; color: string; amount: number; est: number; pinned: boolean; custom: boolean; subs: CalcSub[] | null; legend?: { name: string; amount: number }[] }
export interface PieItem { name: string; color: string; amount: number; legend?: { name: string; amount: number }[]; subs?: { name: string; amount: number }[] | null }

const judge = (amount: number, ranges: Ranges | null): Judged => (ranges
  ? { ranges, level: TIERS[amount < ranges[1][0] ? 0 : amount < ranges[2][0] ? 1 : 2], belowFloor: amount < ranges[0][0] }
  : { ranges: null, level: null, belowFloor: false });
const scaled = (ranges: Ranges, f: number): Ranges => ranges.map(([a, z]) => [a * f, z * f]);

/* 1) 항목 금액 = 평균가 × 배수  2) 총예산 = 합계  3) 항목 수준 = 기준표 구간과 비교  4) 위시리스트가 기타 준비 비용보다 크면 부족분 */
export function calcBudget(b: BudgetData) {
  const ls = leaves(b).map((l) => ({ ...l, pinned: b.locks.includes(l.key), amount: leafAmount(l) }));
  const U = wishTotal(b);
  const E = ls.reduce((a, l) => a + l.amount, 0);

  const base: CalcItem[] = b.cats.map((c) => {
    const mine = ls.filter((l) => l.cat === c);
    const amount = mine.reduce((a, l) => a + l.amount, 0);
    const est = mine.reduce((a, l) => a + l.est, 0);
    const subs = c.subs ? mine.map((l) => ({
      id: l.sub!.id, key: l.key, name: l.sub!.name, amount: l.amount, est: l.est, pinned: l.pinned,
      ...judge(l.amount, scaled(REF_TABLE.sdm, l.est / SDM_AVG)),
    })) : null;
    const ranges = c.id === 'etc' ? null : REF_TABLE[c.id] ?? null; // 기타 준비 비용은 위시리스트 부족 여부로 봄
    return { id: c.id, key: c.id, name: c.name, color: c.color, amount, est, subs, custom: !!c.custom, pinned: !c.subs && !!mine[0]?.pinned, ...judge(amount, ranges) };
  });

  const etc = base.find((x) => x.id === 'etc');
  const etcAmt = etc?.amount ?? 0;
  const overflow = Math.max(Math.round(U - etcAmt), 0);
  if (etc) {
    etc.legend = [
      { name: `위시리스트 (${b.wish.length}개)`, amount: Math.min(U, etcAmt) },
      { name: '예비 비용', amount: Math.max(etcAmt - U, 0) },
    ].filter((x) => Math.round(x.amount) > 0);
  }

  const items: PieItem[] = [...base];
  if (overflow > 0) items.push({ name: '위시리스트 부족분', color: OVERFLOW_COLOR, amount: overflow });
  const C = items.reduce((s, it) => s + it.amount, 0);
  const below = base.flatMap((x) => (x.subs ?? [x])).filter((it) => it.belowFloor).map((it) => it.name);
  const adjusted = ls.some((l) => (l.key === 'etc' ? Math.abs(l.w - U) > 0.5 : !l.cat.custom && Math.abs(l.w - 1) > 0.001));
  const customSum = ls.filter((l) => l.cat.custom).reduce((a, l) => a + l.amount, 0); // 직접 추가 항목은 수준 판정에서 제외
  const tierTotal = E - customSum;
  return { E, U, C, items, base, below, tier: tierOf(tierTotal), tierTotal, customSum, etcAmt, overflow, hasEtc: !!etc, adjusted, pinCount: ls.filter((l) => l.pinned).length };
}
export type BudgetCalc = ReturnType<typeof calcBudget>;

export function pieGradient(items: PieItem[], total: number) {
  if (!total) return 'var(--ds-hairline)';
  let acc = 0;
  return `conic-gradient(${items.map((it) => {
    const start = acc;
    acc += (it.amount / total) * 360;
    return `${it.color} ${start}deg ${acc}deg`;
  }).join(',')})`;
}

/* ---------- 리포트 ---------- */
// 기본 항목 중 뺀 것 (안 하는 항목) — 평균가만큼 아낀 것으로 봄
export function removedBasics(b: BudgetData) {
  const has = (id: string) => b.cats.some((c) => c.id === id);
  const out: { name: string; avg: number }[] = [];
  if (!has('hall')) out.push({ name: '예식장 · 식대', avg: b.hallSetup ? b.hallSetup.total : AVG_COST.hall });
  if (noShoot(b)) out.push({ name: '촬영', avg: AVG_COST.studio });
  (['dress', 'makeup'] as const).forEach((id) => { if (!hasSub(b, id)) out.push({ name: id === 'dress' ? '드레스' : '메이크업', avg: avgOf(b, id) }); });
  ['jewelry', 'suit', 'honeymoon'].forEach((id) => { if (!has(id)) out.push({ name: BUDGET_CATALOG.find((c) => c.id === id)!.name, avg: AVG_COST[id] }); });
  if (!has('etc') && wishTotal(b) > 0) out.push({ name: '기타 준비 비용', avg: wishTotal(b) });
  return out;
}

export type CompareKind = 'up2' | 'up' | 'avg' | 'down' | 'down2';
export function compareToAvg(amount: number, avg: number) {
  if (!avg) return null;
  const ratio = amount / avg;
  const pct = Math.round((ratio - 1) * 100);
  const pctText = pct === 0 ? '' : ` ${pct > 0 ? '+' : ''}${pct}%`;
  if (ratio >= 2) return { ratio, pctText, label: '많이 높은 편', kind: 'up2' as CompareKind };
  if (ratio >= 1.5) return { ratio, pctText, label: '높은 편', kind: 'up' as CompareKind };
  if (ratio <= 0.5) return { ratio, pctText, label: '많이 낮은 편', kind: 'down2' as CompareKind };
  if (ratio <= 2 / 3) return { ratio, pctText, label: '낮은 편', kind: 'down' as CompareKind };
  return { ratio, pctText: '', label: '평균 수준', kind: 'avg' as CompareKind };
}
