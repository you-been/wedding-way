import { create } from 'zustand';

// 화면 아래 잠깐 뜨는 알림
interface ToastState {
  message: string;
  visible: boolean;
  show: (message: string) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>()((set) => ({
  message: '',
  visible: false,
  show: (message) => {
    clearTimeout(timer);
    set({ message, visible: true });
    timer = setTimeout(() => set({ visible: false }), 2200);
  },
}));

/** 컴포넌트 밖에서도 쓸 수 있는 알림 함수 */
export const toast = (message: string) => useToastStore.getState().show(message);
