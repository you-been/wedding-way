import styles from './Calendar.module.css';

// 예약 가능 일정 달력: ok(예약 가능) · few(마감 임박) · no(마감) · booked(예약 확정)
export type DayStatus = 'ok' | 'few' | 'no' | 'booked';

interface Props {
  year: number;
  month: number; // 0~11
  status: (day: number, dow: number) => DayStatus;
  onDayClick?: (day: number) => void; // 있으면 날짜를 눌러 바꿀 수 있음
  showTitle?: boolean;
}

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const LABEL: Record<DayStatus, string> = { ok: '예약 가능', few: '마감 임박', no: '마감', booked: '예약 확정' };

export default function Calendar({ year, month, status, onDayClick, showTitle = true }: Props) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return (
    <div>
      {showTitle && <div className={styles.title}>{year}년 {month + 1}월</div>}
      <div className={`${styles.grid} ${onDayClick ? styles.editable : ''}`} role="grid" aria-label={`${year}년 ${month + 1}월`}>
        {DOW.map((d) => <div key={d} className={styles.dow}>{d}</div>)}
        {Array.from({ length: first }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const s = status(d, (first + i) % 7);
          const cls = `${styles.day} ${styles[s]}`;
          return onDayClick
            ? <button key={d} type="button" className={cls} onClick={() => onDayClick(d)} aria-label={`${d}일 ${LABEL[s]}`}>{d}</button>
            : <div key={d} className={cls} aria-label={`${d}일 ${LABEL[s]}`}>{d}</div>;
        })}
      </div>
    </div>
  );
}

/** 달력 범례 */
export function CalendarLegend({ items }: { items: DayStatus[] }) {
  return (
    <div className={styles.legend}>
      {items.map((s) => <span key={s}><i className={styles[`dot_${s}`]} />{LABEL[s]}</span>)}
    </div>
  );
}
