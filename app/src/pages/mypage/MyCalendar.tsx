import { ChevronLeft, ChevronRight, Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import { WEDDING_ITEM, ymd, type TlItem } from '../../data/timeline';
import styles from './MyPage.module.css';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** 내 캘린더: 날짜를 정한 타임라인 항목을 칩으로, 예식일은 '본식' 표시 */
export default function MyCalendar({ items, wedding, view, setView, onOpen }: {
  items: TlItem[]; wedding: string; view: { y: number; m: number }; setView: (v: { y: number; m: number }) => void; onOpen: (id: string) => void;
}) {
  const { y, m } = view;
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const today = ymd(new Date());
  const byDate: Record<string, TlItem[]> = {};
  items.filter((it) => it.date && !it.hidden && it.id !== WEDDING_ITEM).forEach((it) => { (byDate[it.date!] ??= []).push(it); });
  const weddingVisible = items.some((it) => it.id === WEDDING_ITEM && !it.hidden);
  const shift = (n: number) => { const d = new Date(y, m + n, 1); setView({ y: d.getFullYear(), m: d.getMonth() }); };

  return (
    <div className={styles.cal}>
      <div className={styles.calHead}>
        <button type="button" className={styles.calNav} onClick={() => shift(-1)} aria-label="이전 달"><ChevronLeft /></button>
        <h3 aria-live="polite">{y}년 {m + 1}월</h3>
        <button type="button" className={styles.calNav} onClick={() => shift(1)} aria-label="다음 달"><ChevronRight /></button>
        <Button size="sm" variant="ghost" className={styles.calToday} onClick={() => { const d = new Date(); setView({ y: d.getFullYear(), m: d.getMonth() }); }}>오늘</Button>
      </div>
      <div className={styles.calGrid}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d} className={styles.dow}>{d}</div>)}
        {Array.from({ length: first }, (_, i) => <div key={`e${i}`} className={styles.empty} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const key = `${y}-${pad2(m + 1)}-${pad2(d)}`;
          const list = byDate[key] ?? [];
          const cls = [styles.cell, key === today && styles.today, key === wedding && styles.weddingDay, (first + i) % 7 === 0 && styles.sun].filter(Boolean).join(' ');
          return (
            <div key={key} className={cls}>
              <span className={styles.day}>{d}</span>
              {key === wedding && (weddingVisible
                ? <button type="button" className={styles.weddingMark} onClick={() => onOpen(WEDDING_ITEM)}><Gem />본식</button>
                : <span className={styles.weddingMark}><Gem />본식</span>)}
              {list.slice(0, 2).map((it) => <button key={it.id} type="button" className={`${styles.calChip} ${it.done ? styles.done : ''}`} onClick={() => onOpen(it.id)}>{it.t}</button>)}
              {list.length > 2 && <span className={styles.calMore}>+{list.length - 2}</span>}
            </div>
          );
        })}
      </div>
      <p className={styles.calHint}>타임라인 항목을 눌러 날짜를 정하면 여기에 표시돼요.</p>
    </div>
  );
}
