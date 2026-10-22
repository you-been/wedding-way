import type { AccountType } from '../types';
import { useAuthStore } from './authStore';
import { useBizStore } from './bizStore';
import { useBudgetStore } from './budgetStore';
import { useCoupleStore } from './coupleStore';
import { useFavoriteStore } from './favoriteStore';
import { useModeStore } from './modeStore';
import { usePrefStore } from './prefStore';
import { useTimelineStore } from './timelineStore';

interface PersistedStore<T> {
  getInitialState: () => T;
  setState: (state: T, replace: true) => void;
  persist: { clearStorage: () => void };
}

/** 처음 상태로 되돌리고 이 브라우저에 저장된 값도 지움 */
const wipe = <T,>(store: PersistedStore<T>) => {
  store.setState(store.getInitialState(), true);
  store.persist.clearStorage();
};

/** 회원 탈퇴 (프로토타입: 서버 없이 이 브라우저의 계정 · 회원 데이터를 지움) */
export function withdraw(type: AccountType) {
  if (type === 'biz') wipe(useBizStore);
  else [useFavoriteStore, useTimelineStore, useBudgetStore, usePrefStore, useCoupleStore].forEach((s) => wipe(s as PersistedStore<unknown>));
  wipe(useAuthStore);
  useModeStore.getState().setBizMode(false);
}
