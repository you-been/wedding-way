import { TIER_HIGH, TIER_LOW, TIER_MIN, TIERS, pieGradient, tierOf, tierPos, won, type PieItem } from '../../data/budget';
import styles from './BudgetParts.module.css';

/** 가격대 이름 태그: 가성비 = 회색, 표준 = 핑크, 고급 = 잉크 */
export function TierName({ total }: { total: number }) {
  const t = tierOf(total);
  return <b className={`${styles.tierName} ${styles[`tier${TIERS.indexOf(t)}`]}`}>{t.name}</b>;
}

/** 총예산 → 가성비 · 표준 · 고급 눈금. total = 판정 금액(직접 추가 항목 제외) */
export function TierScale({ total, excluded = 0, className = '' }: { total: number; excluded?: number; className?: string }) {
  const t = tierOf(total);
  return (
    <div className={`${styles.tier} ${className}`}>
      <p className={styles.tierLine}>이 예산은 <TierName total={total} /> 수준이에요</p>
      <div className={styles.scale}>
        {TIERS.map((x) => <span key={x.key} className={x === t ? styles.on : ''}>{x.name}</span>)}
        <i className={styles.marker} style={{ left: `${(tierPos(total) * 100).toFixed(1)}%` }} />
      </div>
      <div className={styles.ticks}><span>{won(TIER_LOW)}</span><span>{won(TIER_HIGH)}</span></div>
      {total < TIER_MIN && <p className={styles.lowNote}>가성비형 기준({won(TIER_MIN)})보다 낮은 예산이에요. 항목을 줄이거나 우선순위를 정해 보세요.</p>}
      {excluded > 0 && <p className={styles.small}>직접 추가한 항목은 판정에서 제외</p>}
    </div>
  );
}

/** 도넛 차트 */
export function Pie({ items, total, large }: { items: PieItem[]; total: number; large?: boolean }) {
  return <div className={`${styles.pie} ${large ? styles.pieLg : ''}`} style={{ background: pieGradient(items, total) }} role="img" aria-label="예산 구성 차트" />;
}

/** 범례: 항목 · 비율 · 금액, 하위(스드메 · 위시리스트)는 들여서 */
export function Legend({ items, total }: { items: PieItem[]; total: number }) {
  const pct = (a: number) => (total ? Math.round((a / total) * 100) : 0);
  return (
    <ul className={styles.legend}>
      {items.flatMap((it) => [
        <li key={it.name}><i style={{ background: it.color }} />{it.name}<span>{pct(it.amount)}% · {won(it.amount)}</span></li>,
        ...(it.legend ?? it.subs ?? []).map((s) => <li key={`${it.name}-${s.name}`} className={styles.legendSub}>ㄴ {s.name}<span>{won(s.amount)}</span></li>),
      ])}
    </ul>
  );
}
