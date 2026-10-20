import { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router';
import { BIZ_PATHS, PATHS } from '../../routes';
import { useModeStore } from '../../stores/modeStore';
import Header from './Header';
import Footer from './Footer';
import TabBar from './TabBar';
import Toast from './Toast';
import styles from './AppLayout.module.css';

/** 모든 화면 공통 틀: 헤더 · 본문 · 푸터 · 하단 탭바 · 알림 · 플로우 맵 버튼 */
export default function AppLayout() {
  const { pathname } = useLocation();
  const splashDone = useModeStore((s) => s.splashDone);
  const isWelcome = pathname === PATHS.welcome;

  // 화면이 바뀌면 맨 위로
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // 첫 방문이면 홈 대신 갈림길로
  if (pathname === PATHS.home && !splashDone) return <Navigate to={PATHS.welcome} replace />;

  const isBiz = BIZ_PATHS.some((p) => pathname === p);
  return (
    <div className={isBiz ? 'biz-theme' : undefined}>
      {!isWelcome && <Header />}
      <main>
        <Outlet />
      </main>
      {!isWelcome && <Footer />}
      {!isWelcome && <TabBar />}
      {!isWelcome && <Link to={PATHS.flow} className={styles.protoFab} title="화면 구성 · 플로우 보기">플로우 맵</Link>}
      <Toast />
    </div>
  );
}
