import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '../routes';
import { toast } from '../stores/toastStore';

// 홈으로 옮긴 뒤 실행할 정리 작업 (AppLayout이 화면이 바뀐 직후 runPendingSignOut으로 실행)
let pending: (() => void) | null = null;

export function runPendingSignOut() {
  const run = pending;
  pending = null;
  run?.();
}

/** 로그아웃 · 탈퇴: 홈 화면으로 바뀐 다음에 계정을 지움
    (회원 전용 화면에 있는 채로 지우면 RequireAuth가 로그인 화면으로 보내 홈 이동을 덮어씀) */
export function useSignOut() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (clear: () => void, message: string) => {
    const done = () => { clear(); toast(message); };
    if (pathname === PATHS.home) return done();
    pending = done;
    navigate(PATHS.home);
  };
}
