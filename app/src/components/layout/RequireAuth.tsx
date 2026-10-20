import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import type { AccountType } from '../../types';

/** 회원 전용 화면: 계정 유형이 맞지 않으면 로그인으로 (로그인 후 원래 화면으로 돌아옴) */
export default function RequireAuth({ type, children }: { type: AccountType; children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const { pathname, search } = useLocation();
  if (user?.type !== type) {
    const next = encodeURIComponent(pathname + search);
    return <Navigate to={`${PATHS.login}?type=${type}&next=${next}`} replace />;
  }
  return <>{children}</>;
}
