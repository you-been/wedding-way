import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '../routes';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';
import type { AccountType } from '../types';

/**
 * 회원 전용 동작(찜 · 문의 · 저장)을 감싼다.
 * 계정 유형이 맞으면 동작을 실행하고, 아니면 로그인으로 보낸다 (업체 계정이 예비부부 동작을 누르면 안내만).
 */
export function useMemberAction(type: AccountType = 'user') {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  return (action: () => void) => {
    if (user?.type === type) { action(); return; }
    if (user) { toast(type === 'user' ? '예비부부 회원만 이용할 수 있어요' : '업체 회원만 이용할 수 있어요'); return; }
    navigate(`${PATHS.login}?type=${type}&next=${encodeURIComponent(pathname + search)}`);
  };
}
