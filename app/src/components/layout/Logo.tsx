import { Link } from 'react-router';
import { PATHS } from '../../routes';
import styles from './Logo.module.css';

/** 결심 로고: 핑크 사각형 + 글자. asText면 링크 없이 글자만 (첫 방문 갈림길 등) */
export default function Logo({ className = '', asText = false }: { className?: string; asText?: boolean }) {
  const cls = `${styles.logo} ${className}`;
  if (asText) return <div className={cls}>결심</div>;
  return <Link to={PATHS.home} className={cls}>결심</Link>;
}
