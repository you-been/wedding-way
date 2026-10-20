import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types';
import { useModeStore } from './modeStore';

// 로그인 상태 (프로토타입: 서버 없이 이 브라우저에 저장)
interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  update: (patch: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => {
        set({ user });
        useModeStore.getState().setBizMode(user.type === 'biz'); // 계정 유형에 맞는 메뉴로
      },
      logout: () => set({ user: null }),
      update: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } as AuthUser } : s)),
    }),
    { name: 'gs-auth' },
  ),
);

/** 화면에 보이는 이름: 업체는 업체명, 예비부부는 닉네임 */
export const authLabel = (u: AuthUser) => (u.type === 'biz' ? u.bizName : u.nick);
