import { useNavigate, useSearchParams } from 'react-router';
import { SCREENS } from '../routes';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';
import type { AuthUser } from '../types';

/**
 * 로그인 · 가입을 마치고 이동: 주소의 next(원래 가려던 화면)가 이 계정으로 열 수 있으면 그리로, 아니면 기본 화면으로.
 * next는 이 사이트 안의 경로('/'로 시작)만 받는다.
 */
export function useFinishLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (user: AuthUser, message: string, fallback: string) => {
    login(user);
    toast(message);
    const next = params.get('next');
    const safe = next && next.startsWith('/') && !next.startsWith('//') ? next : null;
    const need = safe ? SCREENS.find((s) => s.path === safe.split('?')[0])?.auth : undefined;
    navigate(safe && (!need || need === user.type) ? safe : fallback, { replace: true });
  };
}
