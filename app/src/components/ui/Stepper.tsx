import styles from './Stepper.module.css';

/** 단계 진행 막대 + '2 / 4' (취향 진단 · 업체 소개 만들기) */
export default function Stepper({ step, total }: { step: number; total: number }) {
  const pct = (Math.min(step, total) / total) * 100;
  return (
    <div className={styles.stepper}>
      <div className={styles.bar} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}><b>{Math.min(step, total)}</b> / {total}</span>
    </div>
  );
}
