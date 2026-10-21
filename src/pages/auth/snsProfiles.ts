import type { BizUser, ConsumerUser } from '../../types';

export type SnsProvider = 'kakao' | 'naver' | 'google';

// SNS가 동의 후 넘겨주는 정보 (실서비스 기준: 카카오는 이름 · 연락처에 비즈앱 검수, 구글은 이름 · 이메일만 기본 제공)
export const SNS: Record<SnsProvider, { name: string; mark: string; profile: Partial<ConsumerUser> }> = {
  kakao: { name: '카카오', mark: 'K', profile: { nick: '민지' } },
  naver: { name: '네이버', mark: 'N', profile: { name: '김민지', nick: '민지', gender: 'F', birth: '1996-03-14', phone: '010-1234-5678' } },
  google: { name: 'Google', mark: 'G', profile: { name: '김민지' } },
};

export const FIELD_LABELS: Record<string, string> = { name: '이름', nick: '닉네임', gender: '성별', birth: '생일', phone: '연락처' };

/** 프로토타입: 가입된 예비부부 · 예시 업체 계정 */
export const DEMO_USER: ConsumerUser = { type: 'user', name: '김민지', nick: '민지', phone: '010-1234-5678' };
export const DEMO_BIZ: BizUser = { type: 'biz', email: 'hello@filmharu.kr', bizName: '필름하루 스냅', phone: '010-2345-6789', address: '서울 마포구', proof: 'biz' };

export const PHONE_RE = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
