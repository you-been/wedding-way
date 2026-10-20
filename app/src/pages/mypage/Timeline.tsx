import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, ChevronDown, ChevronUp, GripVertical, NotebookPen, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Tag from '../../components/ui/Tag';
import { TL_PHASES, fmtMD, type TlItem } from '../../data/timeline';
import { toast } from '../../stores/toastStore';
import { useTimelineStore } from '../../stores/timelineStore';
import styles from './MyPage.module.css';

type Drop = { kind: 'before' | 'after'; id: string } | { kind: 'into'; phase: number } | null;

/** 단계 끝의 '항목 추가' */
function AddItem({ phase }: { phase: number }) {
  const add = useTimelineStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const save = () => {
    const t = title.trim();
    if (!t) { toast('항목 이름을 입력해 주세요'); return; }
    add(phase, t);
    setTitle('');
    setOpen(false);
    toast(`Phase ${phase + 1}에 '${t}'을(를) 추가했어요`);
  };
  if (!open) return <button type="button" className={styles.textBtn} onClick={() => setOpen(true)}><Plus />항목 추가</button>;
  return (
    <div className={styles.addForm}>
      <input type="text" autoFocus maxLength={40} placeholder="예: 브라이덜 샤워, 웨딩 네일" value={title} aria-label="추가할 항목 이름"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setOpen(false); }} />
      <Button size="sm" onClick={save}>추가</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>취소</Button>
    </div>
  );
}

/** 내 타임라인: 단계별 카드, 손잡이로 끌어서 순서 · 단계 변경 */
export default function Timeline({ items, nowIdx, onOpen }: { items: TlItem[]; nowIdx: number; onOpen: (id: string) => void }) {
  const { update, move, nudge } = useTimelineStore();
  const [open, setOpen] = useState<number[]>([nowIdx]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [armed, setArmed] = useState<string | null>(null); // 손잡이를 잡은 항목만 끌 수 있음
  const [drop, setDrop] = useState<Drop>(null);
  const togglePhase = (i: number) => setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i]);

  const onDrop = () => {
    if (!dragId || !drop) return;
    const item = items.find((it) => it.id === dragId)!;
    let toPhase: number;
    let beforeId: string | null = null;
    if (drop.kind === 'into') toPhase = drop.phase;
    else {
      const target = items.find((it) => it.id === drop.id)!;
      toPhase = target.phase;
      if (drop.kind === 'before') beforeId = target.id;
      else {
        const visible = items.filter((it) => it.phase === toPhase && !it.hidden && it.id !== dragId);
        beforeId = visible[visible.findIndex((it) => it.id === target.id) + 1]?.id ?? null;
      }
    }
    move(dragId, toPhase, beforeId);
    if (!open.includes(toPhase)) setOpen([...open, toPhase]);
    if (item.phase !== toPhase) toast(`Phase ${toPhase + 1}(으)로 옮겼어요`);
  };
  const endDrag = () => { setDragId(null); setArmed(null); setDrop(null); };

  return (
    <div className={styles.timeline}>
      {TL_PHASES.map((p, i) => {
        const list = items.filter((it) => it.phase === i && !it.hidden);
        const isOpen = open.includes(i);
        const into = drop?.kind === 'into' && drop.phase === i;
        return (
          <div key={p.title} className={[styles.phase, i < nowIdx && styles.past, i === nowIdx && styles.now].filter(Boolean).join(' ')}
            onDragOver={(e) => {
              if (!dragId) return;
              e.preventDefault();
              // 접힌 단계 · 단계 제목 · 빈 단계 위에서는 단계 끝으로
              if (!isOpen || !list.length || (e.target as HTMLElement).closest(`.${styles.phaseHead}`)) setDrop({ kind: 'into', phase: i });
            }}
            onDrop={(e) => { e.preventDefault(); onDrop(); endDrag(); }}>
            <div className={`${styles.phaseCard} ${into ? styles.dropInto : ''}`}>
              <button type="button" className={styles.phaseHead} aria-expanded={isOpen} onClick={() => togglePhase(i)}>
                <h3>Phase {i + 1}. {p.title} {i === nowIdx && <Tag tone="brand">지금 할 일</Tag>}</h3>
                <span className={styles.when}>D-{p.from}~{p.to}개월 · {list.filter((it) => it.done).length}/{list.length}</span>
              </button>
              {isOpen && (
                <div className={styles.phaseBody}>
                  {list.length === 0 && <p className={styles.tlEmpty}>항목이 없어요. 여기로 끌어다 놓을 수 있어요.</p>}
                  {list.map((it, idx) => {
                    const mark = drop && drop.kind !== 'into' && drop.id === it.id ? (drop.kind === 'before' ? styles.dropBefore : styles.dropAfter) : '';
                    return (
                      <div key={it.id} className={[styles.tlItem, it.done && styles.done, dragId === it.id && styles.dragging, mark].filter(Boolean).join(' ')}
                        draggable={armed === it.id}
                        onDragStart={(e) => { setDragId(it.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', it.id); }}
                        onDragEnd={endDrag}
                        onDragOver={(e) => {
                          if (!dragId) return;
                          e.preventDefault();
                          e.stopPropagation();
                          if (it.id === dragId) { setDrop(null); return; }
                          const r = e.currentTarget.getBoundingClientRect();
                          const kind = e.clientY < r.top + r.height / 2 ? 'before' : 'after';
                          if (drop?.kind !== kind || drop.id !== it.id) setDrop({ kind, id: it.id });
                        }}
                        onClick={(e) => { if (!(e.target as HTMLElement).closest('input, a, button, [data-handle]')) onOpen(it.id); }}>
                        <span className={styles.handle} data-handle title="끌어서 순서 · 단계 변경" onMouseDown={() => setArmed(it.id)} onMouseUp={() => setArmed(null)}><GripVertical /></span>
                        <input type="checkbox" className={styles.check} checked={it.done} aria-label={`${it.t} 완료`} onChange={(e) => update(it.id, { done: e.target.checked })} />
                        <div className={styles.tlMain}>
                          <b>{it.t}</b>{it.tag && <Tag className={styles.modeTag}>{it.tag}</Tag>}
                          {it.d && <p>{it.d}</p>}
                          {(it.date || it.memo) && (
                            <div className={styles.tlMeta}>
                              {it.date && <span><Calendar />{fmtMD(it.date)}</span>}
                              {it.memo && <span><NotebookPen />메모</span>}
                            </div>
                          )}
                        </div>
                        <div className={styles.tlSide}>
                          <button type="button" className={styles.openBtn} onClick={() => onOpen(it.id)} aria-label={`${it.t} 자세히`}>자세히</button>
                          {it.link && <Link className={styles.linkMore} to={it.link[1]}>{it.link[0]} <ArrowRight /></Link>}
                          <span className={styles.arrows}>
                            <button type="button" aria-label="위로" disabled={idx === 0} onClick={() => nudge(it.id, -1)}><ChevronUp /></button>
                            <button type="button" aria-label="아래로" disabled={idx === list.length - 1} onClick={() => nudge(it.id, 1)}><ChevronDown /></button>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className={styles.add}><AddItem phase={i} /></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
