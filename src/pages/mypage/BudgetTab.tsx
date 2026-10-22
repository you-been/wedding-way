import { Link } from 'react-router';
import { ArrowRight, Check, Pin, SlidersHorizontal } from 'lucide-react';
import Panel from '../../components/ui/Panel';
import Tag from '../../components/ui/Tag';
import VendorCard from '../../components/vendor/VendorCard';
import { getVendorsByIds } from '../../data/api';
import { calcBudget, pinAmount, won } from '../../data/budget';
import { REGION_CHOICES, prefTotal } from '../../data/prefBudget';
import { weddingInfo } from '../../data/timeline';
import { PATHS } from '../../routes';
import { useBudgetStore } from '../../stores/budgetStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { usePrefStore } from '../../stores/prefStore';
import { toast } from '../../stores/toastStore';
import { useSpendStore } from '../../stores/spendStore';
import { usePhaseTitle, useTimelineStore } from '../../stores/timelineStore';
import styles from './MyPage.module.css';

const TODO_MAX = 4;

/** 예산 진단 항목 + 계약금 · 확정 금액 · 잔금 요약 (배너 '예산 사용'과 이 탭이 같이 씀) */
export function useBudgetSummary() {
  const budget = useBudgetStore();
  const { confirmed, deposit } = useSpendStore();
  const calc = calcBudget(budget);
  const rows = calc.base.map((it) => {
    const done = confirmed[it.key];
    const paid = deposit[it.key];
    return {
      key: it.key, name: it.name, color: it.color, plan: Math.round(it.amount), done, paid,
      bal: done != null && paid != null ? Math.max(done - paid, 0) : undefined, // 잔금 = 확정 금액 − 계약금
      pinned: it.subs ? it.subs.every((x) => x.pinned) : it.pinned, // 예산 진단에서 고정된 항목
    };
  });
  const sum = (pick: (r: (typeof rows)[number]) => number) => rows.reduce((s, r) => s + pick(r), 0);
  return {
    rows, total: Math.round(calc.E),
    used: sum((r) => r.done ?? 0),
    paid: sum((r) => r.paid ?? 0),
    balance: sum((r) => r.bal ?? 0),
    doneCount: rows.filter((r) => r.done != null).length,
  };
}

/** 금액 입력칸 (만 원). 칸 이름은 표 머리에 있고, 모바일에서는 칸 위에 보여줌 */
function AmountInput({ label, name, value, onChange }: { label: string; name: string; value: number | undefined; onChange: (v: number | null) => void }) {
  return (
    <label className={styles.spendInput}>
      <small>{label}</small>
      <input type="number" inputMode="numeric" min={0} placeholder="입력" value={value ?? ''} aria-label={`${name} ${label} (만 원)`}
        onChange={(e) => onChange(e.target.value === '' ? null : Math.max(0, Math.round(Number(e.target.value) || 0)))} />
      <em>만 원</em>
    </label>
  );
}

/** 내 웨딩 > 예산 · 찜: 예산 사용 현황 · 지금 할 일 · 항목별 확정 현황 · 내 취향 · 찜한 업체 */
export default function BudgetTab({ onShowTimeline }: { onShowTimeline: () => void }) {
  const { rows, total, used, paid, balance, doneCount } = useBudgetSummary();
  const setAmount = useSpendStore((s) => s.setAmount);
  const editBudget = useBudgetStore((s) => s.edit);
  const reflect = (key: string, name: string, amount: number) => {
    if (editBudget((d) => pinAmount(d, key, amount))) toast(`예산 진단에 ${name} ${won(amount)}을 고정했어요`);
  };
  const favIds = useFavoriteStore((s) => s.ids);
  const { wedding, items, update } = useTimelineStore();
  const phaseTitle = usePhaseTitle();
  const { nowIdx } = weddingInfo(wedding);
  const pref = usePrefStore();

  // 지금 단계의 할 일: 안 끝낸 것 먼저, 최대 4개 (체크하면 타임라인에도 반영)
  const phaseItems = items.filter((it) => !it.hidden && it.phase === nowIdx);
  const todo = [...phaseItems.filter((it) => !it.done), ...phaseItems.filter((it) => it.done)].slice(0, TODO_MAX);
  const leftCount = phaseItems.filter((it) => !it.done).length;
  const pct = total ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const prefBudget = pref.budgetPreset === '직접 입력' ? (prefTotal(pref) ? won(prefTotal(pref)!) : '직접 입력') : pref.budgetPreset;

  return (
    <div className={styles.panelIn}>
      <div className={styles.dashGrid}>
        <Panel title="예산 사용 현황" action={<Link to={PATHS.budget} className={styles.more}>예산 진단 <ArrowRight /></Link>}>
          <div className={styles.money}><b>{won(used)}</b> / {won(total)}</div>
          <div className={styles.miniBar}><i style={{ width: `${pct}%` }} /></div>
          <p className={styles.spendNote}>
            {doneCount ? <>계약을 확정한 {doneCount}개 항목 합계예요 · 남은 예산 <b>{won(Math.max(total - used, 0))}</b></> : '아래 확정 현황에 계약 금액을 입력하면 여기에 모여요.'}
          </p>
          {(paid > 0 || balance > 0) && (
            <dl className={styles.payStats}>
              <div><dt>낸 계약금</dt><dd>{won(paid)}</dd></div>
              <div><dt>남은 잔금</dt><dd>{won(balance)}</dd></div>
            </dl>
          )}
        </Panel>
        <Panel title="지금 할 일" action={<button type="button" className={styles.more} onClick={onShowTimeline}>타임라인 <ArrowRight /></button>}>
          <p className={styles.todoNote}>{phaseTitle(nowIdx)} 단계 · {leftCount ? `남은 일 ${leftCount}개` : '모두 마쳤어요'} · 체크하면 타임라인에도 반영돼요</p>
          {todo.length ? (
            <ul className={styles.todoList}>
              {todo.map((it) => (
                <li key={it.id}>
                  <label className={it.done ? styles.todoDone : undefined}>
                    <input type="checkbox" checked={it.done} onChange={(e) => update(it.id, { done: e.target.checked })} />
                    <span>{it.t}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : <p className={styles.spendNote}>이 단계에 표시할 할 일이 없어요.</p>}
        </Panel>
      </div>

      <Panel title="예산 항목별 확정 현황" className={styles.spendPanel}
        action={<Link to={PATHS.budget} className={styles.more}><SlidersHorizontal />항목 · 예산 수정</Link>}>
        <p className={styles.spendGuide}>
          <b>예산</b>은 예산 진단에서 정한 금액이에요. 업체와 계약하면 <b>계약금</b>과 <b>확정 금액</b>을 기록해 두세요. 잔금은 확정 금액에서 계약금을 빼서 알려드려요. 확정 금액은 <b>예산 진단에 반영</b>해 고정할 수 있어요.
        </p>
        <div className={styles.spendHead} aria-hidden="true"><span>항목</span><span>예산</span><span>계약금</span><span>확정 금액</span><span>상태</span></div>
        <ul className={styles.spendList}>
          {rows.map((r) => {
            const diff = r.done != null ? r.done - r.plan : 0;
            return (
              <li key={r.key} className={styles.spendRow}>
                <span className={styles.spendName}><i style={{ background: r.color }} />{r.name}</span>
                <span className={styles.spendPlan}><small>예산</small>{won(r.plan)}</span>
                <div className={styles.payCol}>
                  <AmountInput label="계약금" name={r.name} value={r.paid} onChange={(v) => setAmount('deposit', r.key, v)} />
                  {r.bal != null && <small className={styles.balance}>잔금 {won(r.bal)}</small>}
                </div>
                <AmountInput label="확정 금액" name={r.name} value={r.done} onChange={(v) => setAmount('confirmed', r.key, v)} />
                <span className={styles.spendState}>
                  {r.done == null ? <Tag>미정</Tag> : diff > 0 ? <Tag tone="brand">+{won(diff)} 초과</Tag> : <Tag tone="ink">예산 안{diff < 0 ? ` · ${won(-diff)} 남음` : ''}</Tag>}
                  {r.done != null && (r.pinned && diff === 0
                    ? <small className={styles.reflected}><Check />예산 진단에 반영됨</small>
                    : <button type="button" className={styles.reflectBtn} onClick={() => reflect(r.key, r.name, r.done!)}><Pin />예산 진단에 반영</button>)}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="내 취향" className={styles.prefPanel}
        action={<Link to={PATHS.onboarding} className={styles.more}>다시 진단하기 <ArrowRight /></Link>}>
        <p className={styles.spendGuide}>취향 진단에서 고른 내용이에요. 업체 추천과 예산 시작값에 쓰여요.</p>
        <dl className={styles.prefList}>
          <div><dt>준비 방식</dt><dd>{pref.method}</dd></div>
          <div><dt>예식 예정일</dt><dd>{pref.weddingDate.replaceAll('-', '.')}</dd></div>
          <div><dt>하객 수</dt><dd>{pref.guests}</dd></div>
          <div><dt>예식 형태</dt><dd>{pref.venue}</dd></div>
          <div><dt>예식 지역</dt><dd>{REGION_CHOICES.find((r) => r.id === pref.region)?.name ?? '-'}</dd></div>
          <div><dt>총 예산</dt><dd>{prefBudget}</dd></div>
          <div className={styles.prefMoods}><dt>무드</dt><dd>{pref.moods.length ? pref.moods.map((m) => <Tag key={m} tone="soft">{m}</Tag>) : '고른 무드가 없어요'}</dd></div>
        </dl>
      </Panel>

      <div className={styles.sectionHead}><h2>찜한 업체</h2><Link to={PATHS.directory} className={styles.more}>디렉토리 <ArrowRight /></Link></div>
      {favIds.length
        ? <div className={styles.vendors}>{getVendorsByIds(favIds).map((v) => <VendorCard key={v.id} vendor={v} />)}</div>
        : <p className={styles.empty}>아직 찜한 업체가 없어요. 디렉토리에서 마음에 드는 업체를 찜해 보세요.</p>}
    </div>
  );
}
