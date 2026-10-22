import { useLocation } from 'react-router';
import { BIZ_PATHS } from '../routes';
import { useAuthStore } from '../stores/authStore';
import { useModeStore } from '../stores/modeStore';

/** 업체 모드(결심 Biz) 켜짐 여부
    - 업체 계정: 헤더 스위치로 고른 값 (디렉토리 등 다른 화면에 가도 유지)
    - 개인 계정 · 비회원: 지금 화면이 업체 화면(우리 업체 알리기 · 업체 가입 · 업체 회원가입)이면 켜짐
      → 업체 화면을 벗어나면 저절로 꺼지고, 스위치는 업체 화면으로 가는 지름길 역할 */
export function useBizMode() {
  const stored = useModeStore((s) => s.bizMode);
  const isBizUser = useAuthStore((s) => s.user?.type === 'biz');
  const { pathname } = useLocation();
  return isBizUser ? stored : BIZ_PATHS.includes(pathname);
}
