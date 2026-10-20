// 내 타임라인 기본 데이터 (기획서 표준 타임라인 기준)
import { PATHS } from '../routes';

export const TL_PHASES = [
  { title: '준비 시작 & 웨딩홀', from: 12, to: 10 },
  { title: '준비 방식 & 스드메', from: 10, to: 8 },
  { title: '주요 계약', from: 8, to: 6 },
  { title: '촬영 준비', from: 6, to: 4 },
  { title: '청첩장 & 본식 준비', from: 4, to: 2 },
  { title: '최종 점검', from: 1, to: 0 },
];

export interface TlItem {
  id: string;
  phase: number;
  t: string;
  d: string;
  link: [string, string] | null; // [이름, 경로]
  tag: string | null;
  done: boolean;
  hidden: boolean;
  custom: boolean;
  date: string | null; // YYYY-MM-DD
  memo: string;
}

const DIR = (cat: string): [string, string] => ['업체 보기', `${PATHS.directory}?cat=${encodeURIComponent(cat)}`];
type Def = [number, string, string, string, ([string, string] | null)?, string?];
const TL_DEFAULT: Def[] = [
  [0, 'greet', '양가 인사', '양가 부모님께 인사 드리고 결혼 허락 받기'],
  [0, 'budget', '예산 논의', '양가 지원금과 우리 예산을 맞춰 총예산 정하기', ['예산 진단', PATHS.budget]],
  [0, 'hall-tour', '웨딩홀 투어', '인기 홀은 1년 전 예약 오픈 시점에 바로 투어', DIR('웨딩홀')],
  [0, 'hall-contract', '웨딩홀 계약', '날짜와 대략적인 하객 규모가 여기서 정해져요'],
  [1, 'method', '준비 방식 결정', '플래너(동행 · 비동행 · 일부동행) vs 워크인', ['새내기 가이드', PATHS.guide]],
  [1, 'planner', '플래너 상담', '동행 범위와 스드메 조합 상담', DIR('플래너'), '플래너 이용 시'],
  [1, 'studio', '스튜디오 선정', '토탈 vs 비토탈 함께 결정', DIR('스튜디오')],
  [1, 'dress-shop', '드레스샵 선정', '촬영 · 본식 드레스샵 정하기', DIR('드레스')],
  [1, 'makeup', '메이크업 선정', '촬영 · 본식 메이크업 숍 정하기', DIR('메이크업')],
  [1, 'main-snap', '본식스냅 예약', '인기 작가는 일찍 마감돼요', DIR('본식스냅')],
  [1, 'iphone-snap', '아이폰/야외스냅 예약', '제주 · 야외 촬영은 날씨 좋은 날짜가 빨리 차요', DIR('아이폰스냅')],
  [2, 'meet', '상견례', '양가 부모님 일정 조율'],
  [2, 'honeymoon', '신혼여행 예약', '해외는 항공권 가격 변동을 고려해 미리 예약'],
  [2, 'suit', '예복 맞춤/대여', '제작 기간과 촬영일을 역산해서 계약', DIR('예복·한복')],
  [2, 'ring-tour', '웨딩밴드 투어', '제작에 2~3달 걸려요'],
  [2, 'ring-contract', '웨딩밴드 계약', '촬영 2~3달 전까지 계약'],
  [3, 'dress-tour', '드레스 투어', '2~3곳 방문, 본식 드레스 4벌 정도 피팅', DIR('드레스')],
  [3, 'hair', '헤어변형 예약', '1인 숍이 많아 스튜디오 일정 확정 직후 바로 예약', DIR('헤어변형')],
  [3, 'shoot-dress', '촬영 드레스 셀렉', '6벌 정도 피팅 후 촬영용 3~4벌 결정', null, '비토탈'],
  [3, 'shoot', '스튜디오 촬영', '야외/실내 스튜디오 촬영'],
  [4, 'photo-select', '사진 셀렉', '촬영 원본에서 보정할 사진 고르기'],
  [4, 'retouch', '보정', '스튜디오 보정은 약 3개월 — 사설 보정도 고려'],
  [4, 'm-invite', '모바일 청첩장', '보정본 일정에 맞춰 제작', DIR('모바일청첩장')],
  [4, 'p-invite', '종이 청첩장', '디자인 · 수량 정하고 주문'],
  [4, 'hanbok', '혼주 한복 피팅', '양가 어머니 동행, 대여 또는 맞춤', DIR('예복·한복')],
  [4, 'invite-meet', '청첩장 모임', '지인 · 동료들에게 소식 전하기'],
  [4, 'video', '식전영상 제작', '사진 · 영상 소스 미리 모아두기', DIR('식전영상')],
  [4, 'mc', '사회자 섭외', '지인 또는 전문 사회자', DIR('본식사회자')],
  [4, 'flower', '부케/플라워 예약', '드레스 · 홀 분위기에 맞춰서', DIR('웨딩플라워')],
  [5, 'main-dress', '본식 드레스 셀렉', '본식 때 입을 드레스 최종 결정'],
  [5, 'fitting', '가봉', '체형에 맞게 가봉'],
  [5, 'final-meet', '본식 최종 미팅', '식순 · 음악 · 연출 확정'],
  [5, 'tasting', '시식', '웨딩홀 시식이 가능하면 진행'],
  [5, 'helper', '헬퍼 확정', '드레스샵 포함 여부 확인', DIR('헬퍼')],
  [5, 'gift-desk', '축의대 확정', '지인 또는 대행 서비스', DIR('축의대')],
  [5, 'wedding', '본식 당일', '축하해요!'],
  [5, 'trip', '신혼여행 출발', '즐거운 여행 되세요'],
];

export const WEDDING_ITEM = 'wedding'; // '본식 당일' — 날짜는 항상 예식일과 같음
export const DEFAULT_WEDDING = '2027-06-12';

export const defaultItems = (): TlItem[] => TL_DEFAULT.map(([phase, id, t, d, link, tag]) => ({
  id, phase, t, d, link: link ?? null, tag: tag ?? null, done: false, hidden: false, custom: false, date: null, memo: '',
}));

/* 날짜 도우미 */
const pad2 = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const fmtMD = (s: string) => { const [, m, d] = s.split('-'); return `${+m}/${+d}`; };
const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

/** 예식일까지 남은 날 · 지금 단계 */
export function weddingInfo(wedding: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((parse(wedding).getTime() - today.getTime()) / 86400000);
  let nowIdx = TL_PHASES.findIndex((p) => days / 30.4 >= p.to);
  if (nowIdx === -1) nowIdx = TL_PHASES.length - 1;
  return { days, nowIdx };
}
export const ddayText = (days: number) => (days > 0 ? `D-${days}` : days === 0 ? 'D-Day' : `D+${-days}`);
export const weekday = (s: string) => '일월화수목금토'[parse(s).getDay()];

/** 단계 시기에 맞춘 추천 날짜 (예식일에서 단계 중간 개월 수만큼 앞) */
export function suggestDate(wedding: string, phase: number) {
  const p = TL_PHASES[phase];
  const d = parse(wedding);
  d.setMonth(d.getMonth() - Math.round((p.from + p.to) / 2));
  return ymd(d);
}

/** 순서 · 단계 변경: 배열에서 빼서 목표 단계의 beforeId 앞(없으면 단계 맨 끝)에 넣음 (새 배열) */
export function moveItem(items: TlItem[], id: string, toPhase: number, beforeId: string | null = null): TlItem[] {
  const from = items.findIndex((it) => it.id === id);
  if (from < 0 || id === beforeId) return items;
  const list = items.slice();
  const [item] = list.splice(from, 1);
  const moved = { ...item, phase: toPhase };
  let at = beforeId ? list.findIndex((it) => it.id === beforeId) : -1;
  if (at < 0) {
    const last = list.map((it) => it.phase).lastIndexOf(toPhase);
    at = last >= 0 ? last + 1 : list.length;
  }
  list.splice(at, 0, moved);
  return list;
}
