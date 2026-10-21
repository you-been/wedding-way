import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 깃허브 페이지(you-been.github.io/wedding-way/)에서 열리도록 배포 빌드 · 미리보기는 저장소 경로를 기준으로 (개발 서버는 /)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/wedding-way/' : '/',
  plugins: [react()],
  css: {
    modules: {
      // 클래스 이름: 개발 중에는 파일·클래스 이름이 보이게
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
}));
