import { NavLink, useLocation } from 'react-router';
import { Home, Wallet, LayoutGrid, Star, Heart, Store } from 'lucide-react';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useModeStore } from '../../stores/modeStore';
import styles from './TabBar.module.css';

/** 모바일 하단 탭바 (760px 이하) */
export default function TabBar() {
  const bizMode = useModeStore((s) => s.bizMode);
  const isBizUser = useAuthStore((s) => s.user?.type === 'biz');
  const { pathname } = useLocation();
  const tabs = [
    { to: PATHS.home, label: '홈', Icon: Home, end: true },
    { to: PATHS.budget, label: '예산', Icon: Wallet },
    { to: PATHS.directory, label: '디렉토리', Icon: LayoutGrid },
    { to: PATHS.reviews, label: '실후기', Icon: Star },
    bizMode
      ? { to: isBizUser ? PATHS.partnerDash : PATHS.partner, label: '내 업체', Icon: Store, match: PATHS.partner }
      : { to: PATHS.mypage, label: '내 웨딩', Icon: Heart },
  ];
  return (
    <nav className={styles.tabbar} aria-label="하단 메뉴">
      {tabs.map(({ to, label, Icon, end, match }) => (
        <NavLink key={label} to={to} end={end} className={({ isActive }) => (isActive || (match && pathname.startsWith(match)) ? styles.active : undefined)}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
