import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css'; // 전역 토큰 · 기본 스타일을 먼저 (컴포넌트 CSS가 뒤에서 덮어쓸 수 있게)
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
