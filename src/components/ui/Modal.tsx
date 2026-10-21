import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  kicker?: ReactNode;
  width?: number;
  children: ReactNode;
}

/** 가운데 창 (모바일은 아래에서 올라오는 시트). Esc · 바깥 클릭으로 닫힘, 열려 있는 동안 배경 스크롤 막음 */
export default function Modal({ open, onClose, title, kicker, width = 520, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div ref={ref} className={styles.modal} style={{ width: `min(${width}px, calc(100% - 32px))` }} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} tabIndex={-1}>
        <div className={styles.head}>
          <div>
            {kicker && <span className={styles.kicker}>{kicker}</span>}
            <h2>{title}</h2>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="닫기"><X /></button>
        </div>
        {children}
      </div>
    </>,
    document.body,
  );
}
