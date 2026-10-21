import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { PATHS } from '../../routes';
import { authLabel, useAuthStore } from '../../stores/authStore';
import { useModeStore } from '../../stores/modeStore';
import { toast } from '../../stores/toastStore';
import Logo from './Logo';
import styles from './Header.module.css';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { bizMode, tipClosed, setBizMode, closeTip } = useModeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // '내 업체': 업체 로그인 상태면 내 업체 페이지, 아니면 우리 업체 알리기
  const bizHome = user?.type === 'biz' ? PATHS.partnerDash : PATHS.partner;
  const menu = [
    { to: PATHS.budget, label: '예산 진단' },
    { to: PATHS.directory, label: '업체 디렉토리' },
    { to: PATHS.reviews, label: '실후기' },
    bizMode ? { to: bizHome, label: '내 업체', match: PATHS.partner } : { to: PATHS.mypage, label: '내 웨딩' },
  ];

  const toggleMode = () => {
    closeTip();
    const on = !bizMode;
    setBizMode(on);
    if (on) navigate(bizHome);
    else if (pathname.startsWith(PATHS.partner) || pathname === PATHS.signupBiz) navigate(PATHS.home);
    toast(on ? '업체 모드로 전환했어요' : '예비부부 모드로 전환했어요');
  };

  const onLogout = () => {
    logout();
    toast('로그아웃했어요');
    navigate(PATHS.home);
  };

  return (
    <header className={styles.gnb}>
      <div className={styles.inner}>
        <Logo />
        <nav className={`${styles.menu} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(false)}>
          {menu.map((m) => (
            <NavLink
              key={m.label}
              to={m.to}
              className={({ isActive }) => (isActive || (m.match && pathname.startsWith(m.match)) ? styles.active : undefined)}
            >
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          {/* 예비부부 ↔ 업체 모드 전환 */}
          <div className={styles.mode}>
            <button className={`${styles.switch} ${bizMode ? styles.on : ''}`} role="switch" aria-checked={bizMode} aria-describedby="modeTip" onClick={toggleMode}>
              <span>결심 Biz</span>
              <span className={styles.track} aria-hidden="true"><i /></span>
            </button>
            {!bizMode && !tipClosed && (
              <div className={styles.tip} id="modeTip" role="note">
                <p><b>업체회원</b>이신가요?<br />우리 업체를 <b>딱 맞는 예비부부</b>에게 알려보세요!</p>
                <button className={styles.tipClose} onClick={closeTip} aria-label="안내 닫기"><X /></button>
              </div>
            )}
          </div>

          {user ? (
            <div className={styles.user}>
              <span className={styles.name}>{authLabel(user)} 님</span>
              <button className={styles.logout} onClick={onLogout}>로그아웃</button>
            </div>
          ) : (
            <Link to={PATHS.login} className={styles.login}>로그인</Link>
          )}
          <button className={styles.hamburger} aria-label="메뉴" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}
