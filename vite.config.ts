import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 클래스 이름: 개발 중에는 파일·클래스 이름이 보이게
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
});
