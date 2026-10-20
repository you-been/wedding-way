import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './TextField.module.css';

// DESIGN.md text-field: 레이블(14px/700) + 52px 입력칸, 포커스 시 2px 잉크 외곽선
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  note?: ReactNode; // 레이블 옆 작은 글씨 (선택 · 8자 이상 등)
}

export default function TextField({ label, note, className = '', ...input }: Props) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}{note && <small>{note}</small>}</span>
      <input className={styles.input} {...input} />
    </label>
  );
}

/** 레이블만 같은 모양으로 (칩 · 버튼 묶음 등 input이 아닌 내용) */
export function FieldGroup({ label, note, children, className = '' }: { label: ReactNode; note?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}{note && <small>{note}</small>}</span>
      {children}
    </div>
  );
}

export const inputClass = styles.input;
