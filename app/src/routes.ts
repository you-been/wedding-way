import type { AccountType } from './types';

// 화면 주소 · 이름 · 필요한 계정 유형 (플로우 맵과 라우터가 함께 씀)
export interface ScreenDef {
  path: string;
  title: string;
  group: '시작' | '예비부부' | '업체' | '계정';
  auth?: AccountType;
}

export const PATHS = {
  home: '/',
  welcome: '/welcome',
  flow: '/flow',
  guide: '/guide',
  onboarding: '/onboarding',
  budget: '/budget',
  budgetResult: '/budget/result',
  directory: '/directory',
  vendor: '/vendors/:id',
  reviews: '/reviews',
  reviewWrite: '/reviews/write',
  mypage: '/mypage',
  invite: '/invite',
  partner: '/partner',
  partnerJoin: '/partner/join',
  partnerDash: '/partner/dashboard',
  login: '/login',
  signup: '/signup',
  signupBiz: '/signup/biz',
} as const;

export const vendorPath = (id: number | string) => `/vendors/${id}`;

export const SCREENS: ScreenDef[] = [
  { path: PATHS.welcome, title: '첫 방문 갈림길', group: '시작' },
  { path: PATHS.home, title: '홈', group: '시작' },
  { path: PATHS.guide, title: '새내기 가이드', group: '시작' },
  { path: PATHS.onboarding, title: '취향 진단', group: '예비부부' },
  { path: PATHS.budget, title: '예산 진단', group: '예비부부' },
  { path: PATHS.budgetResult, title: '진단 리포트', group: '예비부부' },
  { path: PATHS.directory, title: '업체 디렉토리', group: '예비부부' },
  { path: PATHS.vendor, title: '업체 상세', group: '예비부부' },
  { path: PATHS.reviews, title: '인증 실후기', group: '예비부부' },
  { path: PATHS.reviewWrite, title: '후기 작성', group: '예비부부', auth: 'user' },
  { path: PATHS.mypage, title: '내 웨딩', group: '예비부부', auth: 'user' },
  { path: PATHS.invite, title: '짝꿍 초대 받기', group: '예비부부' },
  { path: PATHS.partner, title: '우리 업체 알리기', group: '업체' },
  { path: PATHS.partnerJoin, title: '업체 소개 만들기', group: '업체', auth: 'biz' },
  { path: PATHS.partnerDash, title: '내 업체', group: '업체', auth: 'biz' },
  { path: PATHS.login, title: '로그인', group: '계정' },
  { path: PATHS.signup, title: '예비부부 회원가입', group: '계정' },
  { path: PATHS.signupBiz, title: '업체 회원가입', group: '계정' },
];

/** 업체 화면: 업체 포인트 색(biz-theme)을 씀 */
export const BIZ_PATHS: string[] = [PATHS.partner, PATHS.partnerJoin, PATHS.partnerDash, PATHS.signupBiz];
