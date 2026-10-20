import { Link } from 'react-router';
import { PATHS } from '../../routes';
import styles from './Logo.module.css';

/** 결심 로고: 핑크 사각형 + 글자 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to={PATHS.home} className={`${styles.logo} ${className}`}>
      결심
    </Link>
  );
}
