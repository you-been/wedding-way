import { Link } from 'react-router';
import { PATHS } from '../../routes';
import { useBizMode } from '../../hooks/useBizMode';
import styles from './Logo.module.css';

/** 결심 로고: 사각형 + 글자. 사각형은 예비부부 모드 핑크, 업체 모드 업체 테마색. asText면 링크 없이 글자만 (첫 방문 갈림길 등) */
export default function Logo({ className = '', asText = false }: { className?: string; asText?: boolean }) {
  const bizMode = useBizMode();
  const cls = `${styles.logo} ${bizMode ? styles.biz : ''} ${className}`;
  if (asText) return <div className={cls}>결심</div>;
  return <Link to={PATHS.home} className={cls}>결심</Link>;
}
