import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Panel.module.css';

// DESIGN.md panel: 흰 면 · 1px 테두리 · 12px 둥글기 · 24px 안쪽 여백 · 그림자 없음
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  action?: ReactNode; // 제목 오른쪽 (예: 전체 보기)
  tone?: 'default' | 'soft' | 'gray';
}

export default function Panel({ title, action, tone = 'default', className = '', children, ...rest }: Props) {
  const toneCls = tone === 'default' ? '' : styles[tone];
  return (
    <div className={`${styles.panel} ${toneCls} ${className}`} {...rest}>
      {(title || action) && (
        <div className={styles.head}>
          {title && <h3>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
