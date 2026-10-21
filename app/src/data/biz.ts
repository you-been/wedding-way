// 내 업체 (업체 회원 페이지) 더미 데이터 · 계산
import type { DayStatus } from '../components/ui/Calendar';
import { VENDORS, type Vendor } from './vendors';

export interface BizProfile {
  photos: string[]; // public/images/*.jpg 파일 이름
  cat: string;
  region: string;
  type: string;
  priceMode: 'none' | 'range';
  priceMin: string;
  priceMax: string;
  moods: string[];
  intro: string;
  insta: string;
}

export const BIZ_DEFAULT: BizProfile = {
  photos: ['biz_07', 'biz_03'], cat: '아이폰스냅', region: '서울 · 제주', type: '1인 작가',
  priceMode: 'range', priceMin: '35만 원', priceMax: '75만 원', moods: ['#클래식', '#빈티지', '#내추럴'],
  intro: '자연광과 필름 감성을 담는 1인 아이폰스냅 작가입니다. 제주 · 서울 야외 촬영 위주로 진행해요.', insta: '',
};

export interface Inquiry { id: number; who: string; when: string; tags: string[]; text: string; status: 'new' | 'done'; reply?: string }
export const INQUIRIES: Inquiry[] = [
  { id: 1, who: '예비부부 K', when: '10.18', tags: ['2027.06.12', '예산 50만 원'], text: '6/12 제주 스냅 가능할까요? 오후 시간대로 생각하고 있어요.', status: 'new' },
  { id: 2, who: '예비부부 L', when: '10.17', tags: ['스탠다드 패키지'], text: '스탠다드 패키지로 주말에 촬영하면 추가금이 있나요?', status: 'new' },
  { id: 3, who: '예비부부 P', when: '10.15', tags: ['2027.04 셋째 주'], text: '4월 셋째 주 서울 일정 문의드려요.', status: 'done', reply: '4월 19일 오전이 가능해요! 원하시는 장소를 알려주세요.' },
];

const pad2 = (n: number) => String(n).padStart(2, '0');
export const dayKey = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

/** 일정: ok(예약 가능) · no(마감) · booked(예약 확정). 바꾼 날짜만 marks에 저장 */
export function bizDayStatus(marks: Record<string, DayStatus>, y: number, m: number, d: number): DayStatus {
  const mark = marks[dayKey(y, m, d)];
  if (mark) return mark;
  const dow = new Date(y, m, d).getDay();
  if ([3, 10, 17, 18, 25].includes(d)) return 'booked';
  return dow === 0 || dow === 6 || d % 4 === 0 ? 'ok' : 'no';
}
export const NEXT_STATUS: Record<string, DayStatus> = { ok: 'no', no: 'booked', booked: 'ok', few: 'no' };

export type BizTab = 'home' | 'profile' | 'inquiry' | 'schedule' | 'account';

/** 프로필 완성도: 필수 4개 15%씩 + 선택 4개 10%씩 */
export function bizChecks(p: BizProfile, name: string): { label: string; ok: boolean; w: number; tab: BizTab }[] {
  return [
    { label: '대표 사진', ok: p.photos.length > 0, w: 15, tab: 'profile' },
    { label: '업종', ok: !!p.cat, w: 15, tab: 'profile' },
    { label: '업체명', ok: !!name, w: 15, tab: 'profile' },
    { label: '무드 태그', ok: p.moods.length > 0, w: 15, tab: 'profile' },
    { label: '가격 공개', ok: p.priceMode === 'range' && !!p.priceMin && !!p.priceMax, w: 10, tab: 'profile' },
    { label: '소개글', ok: p.intro.trim().length >= 10, w: 10, tab: 'profile' },
    { label: '인스타 연동', ok: !!p.insta.trim(), w: 10, tab: 'profile' },
    { label: '예약 일정', ok: true, w: 10, tab: 'schedule' },
  ];
}

export const bizPriceText = (p: BizProfile) => (p.priceMode === 'range' && p.priceMin && p.priceMax ? `${p.priceMin.replace(/\s*원$/, '')}~${p.priceMax}` : null);

/** 예비부부에게 보이는 업체 상세용 (저장된 정보 기준) */
export const profileToVendor = (p: BizProfile, name: string): Vendor => ({
  ...VENDORS[0], id: 0, photo: p.photos[0], name, cat: p.cat,
  region: p.region || '지역 미입력', type: p.type || '유형 미입력', price: bizPriceText(p), moods: p.moods,
  insta: !!p.insta, handle: p.insta || undefined, intro: p.intro.trim().length >= 10,
});
