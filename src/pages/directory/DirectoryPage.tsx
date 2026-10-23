import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Info, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import PageHead from '../../components/ui/PageHead';
import VendorCard from '../../components/vendor/VendorCard';
import { ALL_CATEGORY, CATEGORIES } from '../../data/categories';
import { getVendors } from '../../data/api';
import { priceNumber, vendorScore } from '../../data/recommend';
import { REGION_GROUPS, areaWords, inArea } from '../../data/regions';
import { TIER_ORDER, type Tier, type Vendor } from '../../data/vendors';
import { useColumns } from '../../hooks/useColumns';
import { useMyTier } from '../../stores/budgetStore';
import { usePrefStore } from '../../stores/prefStore';
import styles from './DirectoryPage.module.css';

const TIERS: Tier[] = ['가성비', '표준', '프리미엄'];
type Reach = 'nationwide' | 'online';
const REACHES: [Reach, string][] = [['nationwide', '전국 출장 가능'], ['online', '온라인 진행']];
const OPTIONS: { label: string; test: (v: Vendor) => boolean }[] = [
  { label: '인증후기 있음', test: (v) => v.verified > 0 },
  { label: '이번 달 예약 가능', test: (v) => v.schedule !== false },
  { label: '1인 업체', test: (v) => v.type.startsWith('1인') },
];
const SORTS = ['취향 맞춤순', '후기 많은 순', '낮은 가격순', '최신 등록순'] as const;
type Sort = (typeof SORTS)[number];

const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

/** 업체 디렉토리: 카테고리 · 가격대 · 지역 · 옵션 · 검색으로 같은 기준에서 비교 (광고 · 유료 우선 노출 없음) */
export default function DirectoryPage() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? ALL_CATEGORY;
  const moods = usePrefStore((s) => s.moods);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const myTier = useMyTier();
  // 처음엔 예산 진단 결과의 '예산 범위 안' 가격대만 (표준이면 가성비 · 표준)
  const [tiers, setTiers] = useState<Tier[]>(() => TIER_ORDER.slice(0, TIER_ORDER.indexOf(myTier) + 1));
  const [sido, setSido] = useState<string | null>(null); // 시 · 도는 하나만
  const [subs, setSubs] = useState<string[]>([]); // 세부 지역은 여러 개 (비우면 시 · 도 전체)
  const [reach, setReach] = useState<Reach[]>([]); // 전국 출장 · 온라인은 지역과 따로
  const [options, setOptions] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('취향 맞춤순');
  const { ref, cols } = useColumns<HTMLDivElement>();
  // 고른 시 · 도의 세부 지역 중 업체가 있는 곳만 칩으로
  const subOptions = sido ? REGION_GROUPS.find((g) => g.name === sido)!.subs.filter((sub) => getVendors().some((v) => v.area.areas[sido]?.includes(sub))) : [];
  const pickSido = (name: string) => { setSido(sido === name ? null : name); setSubs([]); };

  const list = useMemo(() => {
    const q = submitted.trim().replace(/^#/, '');
    const filtered = getVendors().filter((v) =>
      (cat === ALL_CATEGORY || v.cat === cat)
      && (!tiers.length || tiers.includes(v.tier))
      && (!(sido || reach.length) || (!!sido && inArea(v.area, sido, subs)) || reach.some((r) => v.area[r]))
      && OPTIONS.filter((o) => options.includes(o.label)).every((o) => o.test(v))
      && (!q || [v.name, v.cat, ...areaWords(v.area), ...v.moods].some((t) => t.includes(q))));
    const by: Record<Sort, (a: Vendor, b: Vendor) => number> = {
      '취향 맞춤순': (a, b) => vendorScore(b, moods) - vendorScore(a, moods),
      '후기 많은 순': (a, b) => b.reviews - a.reviews,
      '낮은 가격순': (a, b) => priceNumber(a.price) - priceNumber(b.price),
      '최신 등록순': (a, b) => b.id - a.id,
    };
    return [...filtered].sort(by[sort]);
  }, [cat, tiers, sido, subs, reach, options, submitted, sort, moods]);

  // 메이슨리: 순위대로 가장 짧은 기둥에 차례로 넣음 (가로로 읽어도 순위가 유지됨)
  const columns = useMemo(() => {
    const out = Array.from({ length: cols }, () => ({ h: 0, items: [] as Vendor[] }));
    list.forEach((v) => {
      const col = out.reduce((min, c) => (c.h < min.h ? c : min));
      col.items.push(v);
      col.h += v.h + 170; // 사진 높이 + 카드 본문 대략치
    });
    return out;
  }, [list, cols]);

  const setCat = (name: string) => setParams(name === ALL_CATEGORY ? {} : { cat: name }, { replace: true });

  return (
    <div className="page">
      <div className="wrap">
        <PageHead title="업체 디렉토리" desc="제휴 수수료와 무관하게, 같은 기준으로 비교해요.">
          <form className={styles.search} role="search" onSubmit={(e) => { e.preventDefault(); setSubmitted(query); }}>
            <Search aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setSubmitted(''); }} placeholder="업체명, 지역, #태그로 검색 (예: #클래식)" aria-label="업체 검색" />
            <Button type="submit" size="sm" className={styles.searchBtn}>검색</Button>
          </form>
        </PageHead>

        <ChipGroup label="카테고리" scroll className={styles.cats}>
          {CATEGORIES.map(({ name, Icon }) => <Chip key={name} variant="category" active={cat === name} onClick={() => setCat(name)}><Icon />{name}</Chip>)}
        </ChipGroup>

        <div className={styles.filters}>
          <FilterRow label="가격대">{TIERS.map((t) => <Chip key={t} active={tiers.includes(t)} onClick={() => setTiers(toggle(tiers, t))}>{t}</Chip>)}</FilterRow>
          <FilterRow label="지역">
            {REGION_GROUPS.map((g) => <Chip key={g.name} active={sido === g.name} onClick={() => pickSido(g.name)}>{g.name}</Chip>)}
            <span className={styles.chipSep} aria-hidden="true" />
            {REACHES.map(([r, label]) => <Chip key={r} active={reach.includes(r)} onClick={() => setReach(toggle(reach, r))}>{label}</Chip>)}
          </FilterRow>
          {sido && subOptions.length > 0 && (
            <FilterRow label="세부 지역" wide>
              <Chip active={!subs.length} onClick={() => setSubs([])}>{sido} 전체</Chip>
              {subOptions.map((sub) => <Chip key={sub} active={subs.includes(sub)} onClick={() => setSubs(toggle(subs, sub))}>{sub}</Chip>)}
            </FilterRow>
          )}
          <FilterRow label="옵션">{OPTIONS.map((o) => <Chip key={o.label} active={options.includes(o.label)} onClick={() => setOptions(toggle(options, o.label))}>{o.label}</Chip>)}</FilterRow>
        </div>

        <div className={styles.toolbar}>
          <p className={styles.count}><b className="num">{list.length}</b>개 업체</p>
          <div className={styles.sortWrap}>
            <button type="button" className={styles.info} aria-label="정렬 기준 안내" aria-describedby="sortTip"><Info /></button>
            <span className={styles.tip} id="sortTip" role="tooltip">정보 충실도 · 인증 후기 · 취향 일치 기준이에요. 광고나 유료 우선 노출은 없어요.</span>
            <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="정렬">
              {SORTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div ref={ref} className={styles.masonry}>
          {list.length === 0 && <p className={styles.empty}>조건에 맞는 업체가 아직 없어요. 필터를 줄여 보세요.</p>}
          {list.length > 0 && columns.map((c, i) => (
            <div key={i} className={styles.col}>
              {c.items.map((v) => <VendorCard key={v.id} vendor={v} height={v.h} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`${styles.filterRow} ${wide ? styles.wide : ''}`}>
      <span className={styles.filterLabel}>{label}</span>
      <ChipGroup label={label}>{children}</ChipGroup>
    </div>
  );
}
