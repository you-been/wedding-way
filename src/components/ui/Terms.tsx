import styles from './Terms.module.css';

export interface TermItem {
  label: string;
  required: boolean;
}

/** 약관 동의: 전체 동의 + 항목별 체크 (checked는 항목 순서대로) */
export default function Terms({ items, checked, onChange }: { items: TermItem[]; checked: boolean[]; onChange: (next: boolean[]) => void }) {
  const all = checked.every(Boolean);
  return (
    <div className={styles.terms}>
      <label className={styles.all}>
        <input type="checkbox" checked={all} onChange={(e) => onChange(items.map(() => e.target.checked))} /> <b>전체 동의</b>
      </label>
      {items.map((t, i) => (
        <label key={t.label}>
          <input type="checkbox" checked={checked[i]} onChange={(e) => onChange(checked.map((c, k) => (k === i ? e.target.checked : c)))} />
          [{t.required ? '필수' : '선택'}] {t.label}
        </label>
      ))}
    </div>
  );
}

export const requiredOk = (items: TermItem[], checked: boolean[]) => items.every((t, i) => !t.required || checked[i]);
