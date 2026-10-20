// 공통 타입

/** 증빙 서류 종류: 사업자 등록증 · 프리랜서(신분증 + 포트폴리오) */
export type ProofKind = 'biz' | 'free';

/** 예비부부 회원 (SNS 가입) */
export interface ConsumerUser {
  type: 'user';
  nick: string;
  name?: string;
  gender?: 'F' | 'M';
  birth?: string;
  phone?: string;
}

/** 업체 회원 (이메일 가입) */
export interface BizUser {
  type: 'biz';
  email: string;
  bizName: string;
  phone: string;
  address: string;
  proof: ProofKind | null;
}

export type AuthUser = ConsumerUser | BizUser;
export type AccountType = AuthUser['type'];
