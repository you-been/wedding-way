import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Pin, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import PageHead from '../../components/ui/PageHead';
import Panel from '../../components/ui/Panel';
import {
  AVG_COST, BASIC_ITEMS, BUDGET_CATALOG, CUSTOM_MAX, HALL_REGIONS, HALL_TYPES, SHOOT_IDS, WISH_GROUPS, WISHLIST,
  addCat, addCustomCat, avgOf, calcBudget, fmtW, hasSub, isCustomKey, isFreeKey, noShoot, removeCat, resetToAverage,
  setAmount, setSdmSub, setTotal, sliderMax, target, toggleWish, won, type BudgetCalc, type BudgetData, type CalcItem, type CalcSub,
} from '../../data/budget';
import { PATHS } from '../../routes';
import { useBudgetStore } from '../../stores/budgetStore';
import { toast } from '../../stores/toastStore';
import { Legend, Pie, TierName, TierScale } from './BudgetParts';
import HallModal from './HallModal';
import styles from './BudgetPage.module.css';

type Edit = (fn: (d: BudgetData) => void | boolean) => boolean;

/** 숫자 입력칸: 입력 중에는 쓰는 값 그대로, 아니면 계산된 값을 반올림해서 보여줌 */
function NumberInput({ value, onInput, onCommit, ...rest }: { value: number; onInput?: (v: number) => void; onCommit?: (v: number) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onInput'>) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => { if (draft !== null) onCommit?.(+draft || 0); setDraft(null); };
  return (
    <input type="number" {...rest} value={draft ?? Math.round(value)}
      onFocus={(e) => setDraft(e.target.value)}
      onChange={(e) => { setDraft(e.target.value); onInput?.(+e.target.value || 0); }}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
  );
}

/* ① 기본 항목 — ③ 예산 항목(예식장 · 스드메 하위)과 같은 상태를 보여주고 바꿈 */
function BasicItems({ b, edit, openHall }: { b: BudgetData; edit: Edit; openHall: () => void }) {
  const hall = b.cats.some((c) => c.id === 'hall');
  const shoot = SHOOT_IDS.find((id) => hasSub(b, id)) ?? 'none';
  const s = b.hallSetup;
  return (
    <div className={styles.basics}>
      {BASIC_ITEMS.map((item) => {
        if (item.id === 'hall') return (
          <label key="hall" className={`${styles.bsRow} ${hall ? styles.on : ''}`}>
            <input type="checkbox" checked={hall} onChange={(e) => edit((d) => (e.target.checked ? addCat(d, 'hall') : removeCat(d, 'hall')))} />
            <span className={styles.bsMain}>
              <b>{item.name}</b>
              <small>{s ? `${HALL_TYPES.find((x) => x.id === s.type)!.name} · ${HALL_REGIONS.find((x) => x.id === s.region)!.name} · ${s.guests}명 기준` : item.d}</small>
              <span className={styles.bsReco}>
                <button type="button" className={styles.textBtn} onClick={(e) => { e.preventDefault(); openHall(); }}>{s ? '다시 계산하기' : '하객 수 · 예식 형태로 추천받기'} →</button>
                {s && <button type="button" className={`${styles.textBtn} ${styles.mutedBtn}`} onClick={(e) => {
                  e.preventDefault();
                  edit((d) => { d.hallSetup = null; const h = d.cats.find((c) => c.id === 'hall'); if (h) h.w = 1; });
                  toast('예식장 · 식대를 평균가로 되돌렸어요');
                }}>평균가로 되돌리기</button>}
              </span>
            </span>
            <span className={styles.bsPrice}>{s ? `추천 ${won(s.total)}` : `평균 ${won(AVG_COST.hall)}`}</span>
          </label>
        );
        if (item.options) return (
          <div key={item.id} className={`${styles.bsRow} ${styles.shoot} ${shoot !== 'none' ? styles.on : ''}`}>
            <span className={styles.bsMain}><b>{item.name}</b><small>하나만 선택</small></span>
            <div className={styles.bsOptions} role="radiogroup" aria-label="촬영 선택">
              {[...item.options.map((o) => ({ id: o.id, name: o.name, avg: AVG_COST[o.id] })), { id: 'none', name: '안 함', avg: 0 }].map((o) => (
                <button key={o.id} type="button" role="radio" aria-checked={shoot === o.id} className={`${styles.bsOpt} ${shoot === o.id ? styles.active : ''}`}
                  onClick={() => edit((d) => SHOOT_IDS.forEach((id) => setSdmSub(d, id, id === o.id)))}>
                  <b>{o.name}</b>{o.avg > 0 && <small>평균 {won(o.avg)}</small>}
                </button>
              ))}
            </div>
          </div>
        );
        const on = hasSub(b, item.id);
        return (
          <label key={item.id} className={`${styles.bsRow} ${on ? styles.on : ''}`}>
            <input type="checkbox" checked={on} onChange={(e) => edit((d) => setSdmSub(d, item.id, e.target.checked))} />
            <span className={styles.bsMain}><b>{item.name}</b><small>{noShoot(b) && item.dNoShoot ? item.dNoShoot : item.d}</small></span>
            <span className={styles.bsPrice}>평균 {won(avgOf(b, item.id))}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ② 추가 위시리스트 — 분류별 체크 목록 */
function WishList({ b, r, edit }: { b: BudgetData; r: BudgetCalc; edit: Edit }) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  return (
    <>
      <p className={styles.wlSummary}>
        {b.wish.length
          ? <>선택 <b>{b.wish.length}개</b> · 합계 <b>{won(r.U)}</b>{r.hasEtc && <span className={r.overflow > 0 ? styles.over : styles.muted}> / 기타 준비 비용 {won(r.etcAmt)}{r.overflow > 0 && ` (${won(r.overflow)} 부족)`}</span>}</>
          : <span className={styles.muted}>필요한 항목만 골라 주세요.</span>}
      </p>
      {WISH_GROUPS.map(({ id, name, Icon }) => {
        const items = WISHLIST.filter((w) => w.g === id);
        const picked = items.filter((w) => b.wish.includes(w.name));
        const open = !collapsed.includes(id);
        return (
          <div key={id} className={styles.wlGroup}>
            <button type="button" className={styles.wlHead} aria-expanded={open} onClick={() => setCollapsed(open ? [...collapsed, id] : collapsed.filter((x) => x !== id))}>
              <b><Icon />{name}</b>
              <span className={`${styles.wlCount} ${picked.length ? styles.on : ''}`}>{picked.length ? `${picked.length}개 · ${won(picked.reduce((a, w) => a + w.cost, 0))}` : `${items.length}개 항목`}</span>
              <ChevronDown className={`${styles.wlCaret} ${open ? '' : styles.closed}`} />
            </button>
            {open && items.map((w) => {
              const on = b.wish.includes(w.name);
              return (
                <label key={w.name} className={`${styles.wlItem} ${on ? styles.on : ''}`}>
                  <input type="checkbox" checked={on} onChange={(e) => edit((d) => toggleWish(d, w.name, e.target.checked))} />
                  <span className={styles.wlName}><b>{w.name}</b><small>{w.d}</small></span>
                  <span className={styles.wlPrice}>평균 {won(w.cost)}</span>
                </label>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

/* ③ 예산 항목 · 중요도 (key: 'hall' 또는 'sdm.studio') */
function BudgetItems({ b, r, edit }: { b: BudgetData; r: BudgetCalc; edit: Edit }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');

  const note = (it: CalcItem) => (it.id === 'etc' ? `위시리스트 ${won(r.U)}${r.overflow > 0 ? ` · ${won(r.overflow)} 부족` : ''}`
    : isCustomKey(b, it.id) ? '직접 입력' : `${it.id === 'hall' && b.hallSetup ? '추천' : '평균'} ${won(it.est)}`);

  const row = (key: string, name: string, w: number, x: CalcItem | CalcSub, opts: { sub?: boolean; color?: string; group?: { id: string; open: boolean }; item?: CalcItem } = {}) => {
    const free = isFreeKey(b, key);
    const title = x.belowFloor ? '가성비형 최소 금액보다 낮아요' : x.level ? `${x.level.name} 수준` : undefined;
    return (
      <div key={key} className={`${styles.biRow} ${opts.sub ? styles.sub : ''}`}>
        <span className={styles.biName}>
          {opts.color && <i style={{ background: opts.color }} />}{opts.sub ? 'ㄴ ' : ''}{name}
          {opts.item && <small className={`${styles.biNote} ${opts.item.id === 'etc' && r.overflow > 0 ? styles.over : ''}`}>{note(opts.item)}</small>}
          {opts.group && (
            <button type="button" className={styles.biToggle} aria-expanded={opts.group.open} onClick={() => edit((d) => { const c = d.cats.find((y) => y.id === opts.group!.id)!; c.open = !c.open; })}>
              {opts.group.open ? <>접기 <ChevronUp /></> : <>세부 <ChevronDown /></>}
            </button>
          )}
        </span>
        <input type="range" min={free ? 0 : 0.3} max={sliderMax(b, key)} step={free ? 10 : 0.1} value={w}
          aria-label={free ? `${name} 금액 (0~1억 원)` : `${name} 중요도 (평균가의 0.3~${sliderMax(b, key)}배)`}
          onChange={(e) => edit((d) => { const t = target(d, key); if (t) t.w = +e.target.value; })} />
        <output>{fmtW(b, key, w)}</output>
        {opts.group
          ? <span className={`${styles.biAmount} ${x.belowFloor ? styles.low : ''}`} title={title}>{won(x.amount)}</span>
          : (
            <span className={styles.biAmountWrap}>
              <button type="button" className={`${styles.biPin} ${x.pinned ? styles.on : ''}`} aria-pressed={x.pinned} aria-label={`${name} 고정`} title="고정하면 총예산을 바꿔도 이 금액은 그대로예요"
                onClick={() => edit((d) => { d.locks = d.locks.includes(key) ? d.locks.filter((k) => k !== key) : [...d.locks, key]; })}><Pin /></button>
              <NumberInput className={`${styles.biInput} ${x.pinned ? styles.pinned : ''} ${x.belowFloor ? styles.low : ''}`} title={title}
                value={x.amount} min={0} max={free ? CUSTOM_MAX : undefined} step={10} aria-label={`${name} 금액(만 원)`}
                onInput={(v) => edit((d) => setAmount(d, key, v))} />
            </span>
          )}
        <button type="button" className={styles.biDel} aria-label={`${name} 빼기`} title="빼기" onClick={() => edit((d) => removeCat(d, key))}><X /></button>
      </div>
    );
  };

  const addable = BUDGET_CATALOG.filter((c) => !b.cats.some((x) => x.id === c.id));
  const saveCustom = () => {
    const name = customName.trim();
    if (!name) { toast('항목 이름을 입력해 주세요'); return; }
    edit((d) => addCustomCat(d, name));
    setCustomName('');
    setCustomOpen(false);
    toast(`'${name}' 항목을 추가했어요`);
  };

  return (
    <>
      {b.cats.length === 0 && <p className={styles.biEmpty}>예산 항목이 없어요. 아래에서 추가해 주세요.</p>}
      {b.cats.map((c) => {
        const it = r.base.find((x) => x.id === c.id)!;
        if (!c.subs) return row(c.id, c.name, c.w, it, { color: c.color, item: it });
        const def = BUDGET_CATALOG.find((x) => x.id === c.id)!.subs!;
        const hasShoot = c.subs.some((x) => SHOOT_IDS.includes(x.id)); // 스튜디오 · 야외스냅은 둘 중 하나
        const missing = def.filter((s) => !c.subs!.some((x) => x.id === s.id) && !(hasShoot && SHOOT_IDS.includes(s.id)));
        return (
          <div key={c.id}>
            {row(c.id, c.name, c.w, it, { color: c.color, group: { id: c.id, open: c.open } })}
            {c.open && (
              <div className={styles.biSubs}>
                {c.subs.map((s) => row(`${c.id}.${s.id}`, s.name, s.w, it.subs!.find((x) => x.id === s.id)!, { sub: true }))}
                {missing.length > 0 && (
                  <div className={styles.biSubAdd}>{missing.map((s) => <Chip key={s.id} className={styles.smallChip} onClick={() => edit((d) => addCat(d, `${c.id}.${s.id}`))}>+ {s.name}</Chip>)}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.biAdd}>
        <span className={styles.biAddLabel}>+ 항목 추가</span>
        {addable.map((c) => <Chip key={c.id} className={styles.smallChip} onClick={() => edit((d) => addCat(d, c.id))}>{c.name}</Chip>)}
        <Chip className={styles.smallChip} onClick={() => setCustomOpen(true)}>+ 직접 입력</Chip>
      </div>
      {customOpen && (
        <div className={styles.biCustom}>
          <input type="text" maxLength={20} placeholder="예: 혼수, 신혼집 인테리어" value={customName} autoFocus aria-label="추가할 항목 이름"
            onChange={(e) => setCustomName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveCustom()} />
          <Button size="sm" onClick={saveCustom}>추가</Button>
          <Button size="sm" variant="ghost" onClick={() => setCustomOpen(false)}>취소</Button>
        </div>
      )}
    </>
  );
}

/** 예산 진단: ① 기본 항목 ② 위시리스트 ③ 항목 · 중요도 ④ 총예산 + 오른쪽 실시간 미리보기 */
export default function BudgetPage() {
  const b = useBudgetStore();
  const edit = b.edit;
  const r = calcBudget(b);
  const [hallOpen, setHallOpen] = useState(false);

  return (
    <div className="page">
      <div className="wrap">
        <PageHead title="예산 진단" desc="항목을 고르면 평균가로 총예산을 계산해 드려요. 중요도에 따라 우리만의 예산을 계획해 보세요." />
        <div className={styles.layout}>
          <div>
            <Panel className={styles.card} title={<><span className={styles.num}>1</span> 기본 항목</>}>
              <BasicItems b={b} edit={edit} openHall={() => setHallOpen(true)} />
            </Panel>
            <Panel className={styles.card} title={<><span className={styles.num}>2</span> 추가 위시리스트 <small className={styles.muted}>기타 준비 비용에 포함</small></>}>
              <WishList b={b} r={r} edit={edit} />
            </Panel>
            <Panel className={styles.card} title={<><span className={styles.num}>3</span> 예산 항목 · 중요도</>}>
              <p className={styles.hint}><Pin /> 고정한 항목은 총예산을 바꿔도 그대로예요.</p>
              <BudgetItems b={b} r={r} edit={edit} />
            </Panel>
            <Panel className={styles.card} title={<><span className={styles.num}>4</span> 총 결혼 예산</>}>
              <p className={styles.estLine}>총예산을 바꾸면 고정(<Pin />) 외 항목이 같은 비율로 조정돼요.</p>
              <div className={styles.money}>
                <NumberInput value={r.E} step={100} min={0} aria-label="총 결혼 예산 (만 원)"
                  onCommit={(v) => { if (!edit((d) => setTotal(d, Math.max(Math.round(v), 0)))) toast('모든 항목이 고정된 금액이라 조정할 항목이 없어요'); }} />
                <span>만 원</span>
              </div>
              {(r.pinCount > 0 || r.adjusted) && (
                <p className={styles.totalDiff}>
                  {r.pinCount > 0 && <><Pin /> 고정 {r.pinCount}개 <button type="button" className={styles.textBtn} onClick={() => { edit((d) => { d.locks = []; }); toast('고정을 모두 풀었어요'); }}>고정 모두 풀기</button></>}
                  {r.pinCount > 0 && r.adjusted && ' · '}
                  {r.adjusted && <button type="button" className={styles.textBtn} onClick={() => { edit(resetToAverage); toast('모든 항목을 평균가로 되돌렸어요'); }}>평균가로 되돌리기</button>}
                </p>
              )}
              <TierScale className={styles.tier} total={r.tierTotal} excluded={r.customSum} />
            </Panel>
          </div>

          <aside className={styles.side}>
            <Panel className={styles.preview}>
              <span className={styles.pvLabel}>실시간 미리보기</span>
              <div className={styles.pvTotal}>
                <small>총예산</small>
                <strong>{won(r.E)}</strong>
                <div className={styles.pvTier}><TierName total={r.tierTotal} /> 수준{r.customSum > 0 && <small>직접 추가한 항목 제외</small>}</div>
              </div>
              <Pie items={r.items} total={r.C} />
              <Legend items={r.items} total={r.C} />
              <Button to={PATHS.budgetResult} block className={styles.pvCta}>진단 리포트 보기 <ArrowRight /></Button>
            </Panel>
          </aside>
        </div>
      </div>

      {hallOpen && (
        <HallModal initial={b.hallSetup} onClose={() => setHallOpen(false)} onApply={(s) => {
          edit((d) => {
            d.hallSetup = s;
            if (!d.cats.some((c) => c.id === 'hall')) addCat(d, 'hall'); // 빼 둔 상태면 다시 넣음
            d.cats.find((c) => c.id === 'hall')!.w = 1;
          });
          setHallOpen(false);
          toast(`예식장 · 식대를 ${won(s.total)}으로 반영했어요`);
        }} />
      )}
    </div>
  );
}
