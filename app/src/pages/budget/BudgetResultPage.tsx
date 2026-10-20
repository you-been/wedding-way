import { Link } from 'react-router';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Panel from '../../components/ui/Panel';
import VendorCard from '../../components/vendor/VendorCard';
import { WISHLIST, calcBudget, compareToAvg, isCustomKey, removedBasics, won, type CompareKind } from '../../data/budget';
import { getVendors } from '../../data/api';
import { recoReasons, vendorScore } from '../../data/recommend';
import { useMemberAction } from '../../hooks/useMemberAction';
import { PATHS } from '../../routes';
import { useBudgetStore } from '../../stores/budgetStore';
import { usePrefStore } from '../../stores/prefStore';
import { toast } from '../../stores/toastStore';
import { Legend, Pie, TierScale } from './BudgetParts';
import styles from './BudgetResultPage.module.css';

interface Row { key: string; name: string; amount: number; avg: number; sub?: boolean; tag: { label: string; kind?: CompareKind | 'off' | 'wish' }; below?: boolean }

/** 진단 리포트: 총예산 밸런스 · 구성 · 평균가 비교 · 맞는 업체 */
export default function BudgetResultPage() {
  const b = useBudgetStore();
  const moods = usePrefStore((s) => s.moods);
  const member = useMemberAction('user');
  const r = calcBudget(b);

  // 내가 정한 금액을 평균가와 비교 (직접 추가 항목은 평균가가 없어 제외)
  const rows: Row[] = [];
  const compared: { name: string; ratio: number; pctText: string }[] = [];
  const add = (key: string, name: string, amount: number, avg: number, opts: { sub?: boolean; group?: boolean; custom?: boolean; below?: boolean }) => {
    const c = compareToAvg(amount, avg);
    if (c && !opts.group) compared.push({ name, ...c });
    rows.push({ key, name, amount, avg, sub: opts.sub, below: opts.below, tag: c ? { label: `${c.label}${c.pctText}`, kind: c.kind } : { label: opts.custom ? '직접 입력' : '-' } });
  };
  const wishRows = (sub: boolean) => WISHLIST.filter((w) => b.wish.includes(w.name)).forEach((w) =>
    rows.push({ key: `wish-${w.name}`, name: w.name, amount: w.cost, avg: w.cost, sub, tag: { label: '위시리스트', kind: 'wish' } }));
  r.base.forEach((it) => {
    const avg = it.id === 'etc' ? r.U : isCustomKey(b, it.id) ? 0 : it.est;
    add(it.key, it.name, it.amount, avg, { group: !!it.subs, custom: it.custom, below: it.belowFloor });
    it.subs?.forEach((x) => add(x.key, x.name, x.amount, x.est, { sub: true, below: x.belowFloor }));
    if (it.id === 'etc') wishRows(true);
  });
  if (!r.hasEtc) wishRows(false);
  const removed = removedBasics(b);

  const up = compared.filter((c) => c.ratio >= 1.5).sort((a, z) => z.ratio - a.ratio);
  const down = compared.filter((c) => c.ratio <= 2 / 3).sort((a, z) => a.ratio - z.ratio);
  const fmt = (list: typeof compared) => list.map((c) => `${c.name} ${c.pctText.trim()}`).join(', ');
  const downText = [fmt(down), ...removed.map((x) => `${x.name}(안 함)`)].filter(Boolean).join(', ');
  const notes: string[] = [];
  if (up.length) notes.push(`평균보다 많이 쓴 항목: ${fmt(up)}`);
  if (downText) notes.push(`아낀 항목: ${downText}`);
  if (!up.length && !downText && compared.length) notes.push('모든 항목이 평균 수준이에요.');
  if (r.below.length) notes.push(`최저선 미만: ${r.below.join(', ')}`);
  if (r.overflow > 0) notes.push(r.hasEtc ? `위시리스트가 기타 준비 비용보다 ${won(r.overflow)} 많아요.` : '위시리스트는 예산에 포함되지 않았어요.');

  const matched = getVendors()
    .filter((v) => recoReasons(v, moods, r.tier.key).includes('예산 범위 안') || b.wish.some((w) => w.includes(v.cat)))
    .sort((a, z) => vendorScore(z, moods) - vendorScore(a, moods))
    .slice(0, 4);

  return (
    <div className="page">
      <div className="wrap">
        <Link to={PATHS.budget} className={styles.back}><ChevronLeft />조건 수정</Link>
        <Panel className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>총예산 밸런스 진단</span>
            <h1>총예산 {won(r.E)} · {r.tier.name}</h1>
            <div className={styles.notes}>{notes.map((n) => <p key={n}>{n}</p>)}</div>
          </div>
          <TierScale total={r.tierTotal} excluded={r.customSum} />
        </Panel>

        <div className={styles.grid}>
          <Panel title="내 예산 구성">
            <div className={styles.pieWrap}>
              <Pie items={r.items} total={r.C} large />
              <Legend items={r.items} total={r.C} />
            </div>
          </Panel>
          <Panel title="내 예산 분석">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>항목</th><th>내 금액</th><th>평균가</th><th>비교</th></tr></thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.key} className={x.sub ? styles.subRow : ''}>
                      <td>{x.sub ? 'ㄴ ' : ''}{x.name}</td>
                      <td>{x.tag.kind === 'wish' ? won(x.amount) : <b>{won(x.amount)}</b>}</td>
                      <td className={styles.muted}>{x.avg ? won(x.avg) : '-'}</td>
                      <td>
                        <span className={`${styles.cmp} ${x.tag.kind ? styles[x.tag.kind] : ''}`}>{x.tag.label}</span>
                        {x.below && <span className={`${styles.cmp} ${styles.danger}`}>최저선 미만</span>}
                      </td>
                    </tr>
                  ))}
                  {removed.length > 0 && <tr className={styles.offHead}><td colSpan={4}>안 하는 항목</td></tr>}
                  {removed.map((x) => (
                    <tr key={`off-${x.name}`} className={styles.offRow}>
                      <td>{x.name}</td><td>0원</td><td>{won(x.avg)}</td><td><span className={`${styles.cmp} ${styles.off}`}>안 함</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.foot}>* 평균가의 1.5배 이상 높은 편 · 2배 이상 많이 높은 편</p>
          </Panel>
        </div>

        <Panel className={styles.block} title="진단 결과에 맞는 업체" action={<Link to={PATHS.directory} className={styles.more}>맞춤 디렉토리로 이동 <ArrowRight /></Link>}>
          <p className={styles.recoNote}>입력하신 예산 · 취향을 기준으로 골랐어요.</p>
          <div className={styles.vendors}>
            {matched.map((v) => <VendorCard key={v.id} vendor={v} reasons={recoReasons(v, moods, r.tier.key)} />)}
          </div>
        </Panel>

        <Panel tone="soft" className={`${styles.block} ${styles.share}`}>
          <div><b>결과를 저장하거나 공유해 보세요</b><p>예비 배우자 · 웨딩 카페에 공유하고 의견을 받아보세요.</p></div>
          <div className={styles.shareBtns}>
            <Button variant="ghost" className={styles.shareBtn} onClick={() => toast('링크가 복사되었어요')}>링크 복사</Button>
            <Button variant="ghost" className={styles.shareBtn} onClick={() => toast('카카오톡 공유 (프로토타입)')}>카카오톡</Button>
            <Button variant="ghost" className={styles.shareBtn} onClick={() => toast('이미지 저장 (프로토타입)')}>이미지 저장</Button>
            <Button className={styles.shareBtn} onClick={() => member(() => toast('내 웨딩에 저장했어요'))}>내 웨딩에 저장</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
