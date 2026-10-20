import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, EyeOff, NotebookPen, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { TL_PHASES, WEDDING_ITEM, fmtMD, suggestDate, type TlItem } from '../../data/timeline';
import { toast } from '../../stores/toastStore';
import { useTimelineStore } from '../../stores/timelineStore';
import styles from './ItemDrawer.module.css';

/** 타임라인 항목 상세: 단계 · 완료 · 일정 · 메모 (직접 추가한 항목은 이름 · 설명도 수정) */
export default function ItemDrawer({ item, wedding, onClose, onDated }: { item: TlItem; wedding: string; onClose: () => void; onDated: (date: string) => void }) {
  const { update, move } = useTimelineStore();
  const isWedding = item.id === WEDDING_ITEM;
  const [date, setDate] = useState(item.date ?? suggestDate(wedding, item.phase));
  const [memoSaved, setMemoSaved] = useState(false);
  const p = TL_PHASES[item.phase];

  // 단계가 바뀌면 (날짜를 아직 안 정했을 때) 추천 날짜도 다시
  useEffect(() => { if (!item.date) setDate(suggestDate(wedding, item.phase)); }, [item.phase, item.date, wedding]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const addCal = () => {
    if (!date) { toast('날짜를 골라주세요'); return; }
    const isNew = !item.date;
    update(item.id, { date });
    onDated(date);
    toast(isNew ? `캘린더 ${fmtMD(date)}에 추가했어요` : `${fmtMD(date)}로 날짜를 바꿨어요`);
  };

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="dwTitle">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Phase {item.phase + 1}. {p.title} · D-{p.from}~{p.to}개월</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="닫기"><X /></button>
        </div>
        <h2 id="dwTitle">{item.t}</h2>
        {!item.custom && item.d && <p className={styles.desc}>{item.d}</p>}
        {item.custom && (
          <div className={styles.edit}>
            <label className={styles.field}><span>항목 이름</span>
              <input type="text" maxLength={40} defaultValue={item.t} onChange={(e) => e.target.value.trim() && update(item.id, { t: e.target.value.trim() })} />
            </label>
            <label className={styles.field}><span>설명 <small>선택</small></span>
              <input type="text" maxLength={60} defaultValue={item.d} placeholder="예: 친구들과 함께" onChange={(e) => update(item.id, { d: e.target.value.trim() })} />
            </label>
          </div>
        )}
        <label className={styles.field}><span>단계</span>
          <select value={item.phase} onChange={(e) => { const to = +e.target.value; move(item.id, to); toast(`Phase ${to + 1}(으)로 옮겼어요`); }}>
            {TL_PHASES.map((ph, i) => <option key={ph.title} value={i}>Phase {i + 1}. {ph.title} (D-{ph.from}~{ph.to}개월)</option>)}
          </select>
        </label>
        <label className={styles.done}><input type="checkbox" checked={item.done} onChange={(e) => update(item.id, { done: e.target.checked })} /> 완료했어요</label>

        <div className={styles.section}>
          <h4><Calendar />일정</h4>
          <div className={styles.dateRow}>
            <input type="date" value={isWedding ? wedding : date} disabled={isWedding} onChange={(e) => setDate(e.target.value)} aria-label="날짜" />
            {!isWedding && <Button size="md" onClick={addCal}>{item.date ? '날짜 변경' : '캘린더에 추가'}</Button>}
          </div>
          <p className={styles.info}>
            {isWedding ? `본식 당일은 예식일(${fmtMD(wedding)})로 자동 설정돼요. 예식일은 화면 위에서 바꿀 수 있어요.`
              : item.date ? `캘린더에 ${fmtMD(item.date)}로 추가돼 있어요.` : '추천 시기에 맞춰 날짜를 미리 채워 뒀어요. 바꿔도 돼요.'}
          </p>
          {!isWedding && item.date && <button type="button" className={styles.textBtn} onClick={() => { update(item.id, { date: null }); toast('캘린더에서 뺐어요'); }}>캘린더에서 빼기</button>}
        </div>

        <div className={styles.section}>
          <h4><NotebookPen />메모 {memoSaved && <small>· 저장됨</small>}</h4>
          <textarea rows={5} defaultValue={item.memo} placeholder="예: 드레스샵 3곳 예약함, 토요일 2시" aria-label="메모"
            onChange={(e) => { update(item.id, { memo: e.target.value }); setMemoSaved(true); }} />
        </div>

        {item.link && <Button to={item.link[1]} variant="ghost" block>{item.link[0]} →</Button>}
        <button type="button" className={styles.hide} onClick={() => { update(item.id, { hidden: true }); onClose(); toast('타임라인에서 뺐어요 · 숨긴 항목에서 되살릴 수 있어요'); }}>
          <EyeOff />내 타임라인에서 빼기
        </button>
      </aside>
    </>,
    document.body,
  );
}
