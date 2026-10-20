import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

// 밑줄 탭 (크몽 category-nav-link: 48px · 16px/500)
export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
}

interface Props<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  stretch?: boolean; // 모바일에서 탭을 같은 폭으로
}

export default function Tabs<T extends string>({ items, value, onChange, label, stretch }: Props<T>) {
  return (
    <div className={`${styles.tabs} ${stretch ? styles.stretch : ''}`} role="tablist" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          role="tab"
          aria-selected={it.value === value}
          className={`${styles.tab} ${it.value === value ? styles.active : ''}`}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
