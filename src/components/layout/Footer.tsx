import { Link } from 'react-router';
import { PATHS } from '../../routes';
import { toast } from '../../stores/toastStore';
import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
  const soon = (label: string) => (e: React.MouseEvent) => { e.preventDefault(); toast(`${label} (프로토타입)`); };
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p>예산과 취향으로 비교하는 중립적 웨딩 큐레이션</p>
        </div>
        <div className={styles.col}>
          <b>탐색</b>
          <Link to={PATHS.budget}>예산 진단</Link>
          <Link to={PATHS.directory}>업체 디렉토리</Link>
          <Link to={PATHS.reviews}>실후기</Link>
          <Link to={PATHS.guide}>새내기 가이드</Link>
        </div>
        <div className={styles.col}>
          <b>업체</b>
          <Link to={PATHS.partner}>우리 업체 알리기</Link>
          <Link to={PATHS.signupBiz}>업체 회원가입</Link>
          <Link to={PATHS.partnerDash}>내 업체</Link>
        </div>
        <div className={styles.col}>
          <b>고객센터</b>
          <a href="#" onClick={soon('이용약관')}>이용약관</a>
          <a href="#" onClick={soon('개인정보처리방침')}>개인정보처리방침</a>
          <a href="#" onClick={soon('문의하기')}>문의하기</a>
        </div>
      </div>
      <div className={`wrap ${styles.bottom}`}>상호 · 대표자 · 사업자등록번호 · 주소 등 회사 정보 영역 (실제 회사 푸터로 교체)</div>
    </footer>
  );
}
