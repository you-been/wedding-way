import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Chip.module.css';

// DESIGN.md chip: filter(알약 · 회색 면) · category(8px 둥글기 · 테두리 + 아이콘), 선택 = 잉크 채움
interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  active?: boolean;
  variant?: 'filter' | 'category';
  size?: 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

export default function Chip({ active, variant = 'filter', size = 'md', className = '', children, ...rest }: Props) {
  const cls = [styles.chip, styles[variant], size === 'lg' ? styles.lg : '', active ? styles.active : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={active} {...rest}>
      {children}
    </button>
  );
}

/** 칩 묶음 (줄바꿈, 모바일은 한 줄 가로 스크롤 옵션) */
export function ChipGroup({ children, scroll, label, className = '' }: { children: ReactNode; scroll?: boolean; label?: string; className?: string }) {
  return (
    <div className={`${styles.group} ${scroll ? styles.scroll : ''} ${className}`} role="group" aria-label={label}>
      {children}
    </div>
  );
}
