import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import styles from './FilterMenu.module.css';

/** 디렉토리 필터 버튼 + 선택 창 (크몽 category-filter-control: 36px · 테두리 #e4e5ed · 8px)
    열 때 onOpen으로 고른 값을 임시값에 옮기고, 적용을 눌러야 반영. 모바일은 아래에서 올라오는 시트 */
export default function FilterMenu({ label, value, wide, onOpen, onApply, onReset, children }: {
  label: string;
  value?: string; // 고른 값 요약 (없으면 필터 이름만)
  wide?: boolean; // 넓은 창 (지역)
  onOpen: () => void;
  onApply: () => void;
  onReset: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const close = (focus = false) => { setOpen(false); if (focus) btnRef.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(true); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className={styles.menu} ref={boxRef}>
      <button ref={btnRef} type="button" className={`${styles.trigger} ${value ? styles.active : ''}`} aria-expanded={open} aria-controls={id}
        onClick={() => { if (!open) onOpen(); setOpen(!open); }}>
        <span>{label}{value && <b> · {value}</b>}</span><ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => close()} aria-hidden="true" />
          <div id={id} className={`${styles.panel} ${wide ? styles.wide : ''}`} role="dialog" aria-label={`${label} 필터`}>
            <p className={styles.sheetTitle}>{label}</p>
            <div className={styles.body}>{children}</div>
            <div className={styles.foot}>
              <button type="button" className={styles.reset} onClick={onReset}>초기화</button>
              <Button size="sm" onClick={() => { onApply(); close(true); }}>적용</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** 선택 창 안의 체크 · 라디오 한 줄 */
export function MenuOption({ type = 'checkbox', name, checked, onChange, children }: {
  type?: 'checkbox' | 'radio'; name?: string; checked: boolean; onChange: () => void; children: ReactNode;
}) {
  return (
    <label className={styles.option}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}

/** 선택 창 안의 소제목 */
export const MenuGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className={styles.group} role="group" aria-label={title}><small>{title}</small>{children}</div>
);
