import type { LucideIcon } from 'lucide-react';
import {
  Aperture, Brush, Camera, Church, Clapperboard, ClipboardList, Flower2, Gift, HandHeart,
  Image, LayoutGrid, Mail, Mic, Scissors, Shirt, Smartphone, Sparkles, Wallet,
} from 'lucide-react';

// 업종 (홈 카테고리 타일 · 디렉토리 칩 · 업체 정보)
export interface Category {
  name: string;
  Icon: LucideIcon;
  avg?: string; // 시장 평균가 (프로토타입 예시) — 가격 비공개 업체에 참고용으로 표시
}

export const ALL_CATEGORY = '전체';

export const CATEGORIES: Category[] = [
  { name: ALL_CATEGORY, Icon: LayoutGrid },
  { name: '플래너', Icon: ClipboardList, avg: '동행 80~150만 원' },
  { name: '웨딩홀', Icon: Church, avg: '식대 5~8만 원' },
  { name: '스튜디오', Icon: Aperture, avg: '150~250만 원' },
  { name: '드레스', Icon: Sparkles, avg: '200~350만 원' },
  { name: '메이크업', Icon: Brush, avg: '40~70만 원' },
  { name: '헬퍼', Icon: HandHeart, avg: '15~30만 원' },
  { name: '헤어변형', Icon: Scissors, avg: '40~60만 원' },
  { name: '아이폰스냅', Icon: Smartphone, avg: '40~55만 원' },
  { name: '본식스냅', Icon: Camera, avg: '80~150만 원' },
  { name: '식전영상', Icon: Clapperboard, avg: '20~40만 원' },
  { name: '웨딩플라워', Icon: Flower2, avg: '20~40만 원' },
  { name: '웨딩소품', Icon: Gift, avg: '5~20만 원' },
  { name: '모바일청첩장', Icon: Mail, avg: '3~8만 원' },
  { name: '본식사회자', Icon: Mic, avg: '30~50만 원' },
  { name: '축의대', Icon: Wallet, avg: '15~25만 원' },
  { name: '예복·한복', Icon: Shirt, avg: '80~150만 원' },
];

/** '전체'를 뺀 실제 업종 */
export const BUSINESS_CATEGORIES = CATEGORIES.filter((c) => c.name !== ALL_CATEGORY);

export const categoryIcon = (name: string): LucideIcon => CATEGORIES.find((c) => c.name === name)?.Icon ?? Image;
export const categoryAvg = (name: string) => CATEGORIES.find((c) => c.name === name)?.avg;

/** 무드 태그 (취향 진단 · 업체 정보 · 추천) */
export const MOODS = ['#클래식', '#빈티지', '#미니멀', '#내추럴', '#러블리', '#유니크', '#모던', '#로맨틱', '#감성적', '#고급스러움', '#따뜻함', '#전통적', '#경건함'] as const;
export type Mood = (typeof MOODS)[number];
