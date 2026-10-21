import type { ReactNode } from 'react';
import styles from './Tag.module.css';

// 작은 라벨: default(회색) · ink(검정, 완료 · 확인됨) · brand(포인트 면) · soft(옅은 포인트 면)
export type TagTone = 'default' | 'ink' | 'brand' | 'soft';

export default function Tag({ tone = 'default', children, className = '' }: { tone?: TagTone; children: ReactNode; className?: string }) {
  return <span className={`${styles.tag} ${styles[tone]} ${className}`}>{children}</span>;
}
