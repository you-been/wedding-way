import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Info, Search, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import PageHead from '../../components/ui/PageHead';
import VendorCard from '../../components/vendor/VendorCard';
import { ALL_CATEGORY, CATEGORIES } from '../../data/categories';
import { getVendors } from '../../data/api';
import { priceNumber, vendorScore } from '../../data/recommend';
import { REGION_GROUPS, areaWords, inArea, subLabel } from '../../data/regions';
import { TIER_ORDER, type Tier, type Vendor } from '../../data/vendors';
import { useMyTier } from '../../stores/budgetStore';
import { usePrefStore } from '../../stores/prefStore';
import FilterMenu, { MenuGroup, MenuOption } from './FilterMenu';
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

/** 필터 값: 가격대 · 지역(시 · 도 하나 + 세부 지역 여러 개) · 전국 출장 · 온라인 · 옵션 */
interface Filters { tiers: Tier[]; sido: string | null; subs: string[]; reach: Reach[]; options: string[] }
const NO_FILTER: Filters = { tiers: [], sido: null, subs: [], reach: [], options: [] };

const toggle = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
const more = (list: string[]) => (list.length > 1 ? `${list[0]} 외 ${list.length - 1}` : list[0]);
/** 시 · 도마다 업체가 있는 세부 지역 */
const subsWithVendors = (sido: string) => REGION_GROUPS.find((g) => g.name === sido)!.subs.filter((sub) => getVendors().some((v) => v.area.areas[sido]?.includes(sub)));

/** 업체 디렉토리: 카테고리 · 가격대 · 지역 · 옵션 · 검색으로 같은 기준에서 비교 (광고 · 유료 우선 노출 없음) */
export default function DirectoryPage() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat') ?? ALL_CATEGORY;
  const moods = usePrefStore((s) => s.moods);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const myTier = useMyTier();
  // 처음엔 예산 진단 결과의 '예산 범위 안' 가격대만 (표준이면 가성비 · 표준)
  const [f, setF] = useState<Filters>(() => ({ ...NO_FILTER, tiers: TIER_ORDER.slice(0, TIER_ORDER.indexOf(myTier) + 1) }));
  const [draft, setDraft] = useState<Filters>(f); // 열린 선택 창에서 고르는 중인 값 (적용하면 f로)
  const [sort, setSort] = useState<Sort>('취향 맞춤순');
  const d = (patch: Partial<Filters>) => setDraft({ ...draft, ...patch });

  const list = useMemo(() => {
    const q = submitted.trim().replace(/^#/, '');
    const filtered = getVendors().filter((v) =>
      (cat === ALL_CATEGORY || v.cat === cat)
      && (!f.tiers.length || f.tiers.includes(v.tier))
      && (!(f.sido || f.reach.length) || (!!f.sido && inArea(v.area, f.sido, f.subs)) || f.reach.some((r) => v.area[r]))
      && OPTIONS.filter((o) => f.options.includes(o.label)).every((o) => o.test(v))
      && (!q || [v.name, v.cat, ...areaWords(v.area), ...v.moods].some((t) => t.includes(q))));
    const by: Record<Sort, (a: Vendor, b: Vendor) => number> = {
      '취향 맞춤순': (a, b) => vendorScore(b, moods) - vendorScore(a, moods),
      '후기 많은 순': (a, b) => b.reviews - a.reviews,
      '낮은 가격순': (a, b) => priceNumber(a.price) - priceNumber(b.price),
      '최신 등록순': (a, b) => b.id - a.id,
    };
    return [...filtered].sort(by[sort]);
  }, [cat, f, submitted, sort, moods]);

  const setCat = (name: string) => setParams(name === ALL_CATEGORY ? {} : { cat: name }, { replace: true });
  const regionValue = [
    ...(f.sido ? [f.subs.length ? more(f.subs.map((sub) => subLabel(f.sido!, sub))) : `${f.sido} 전체`] : []),
    ...REACHES.filter(([r]) => f.reach.includes(r)).map(([, label]) => label),
  ];
  // 고른 조건 태그 (× 누르면 그 조건만 뺌)
  const tags: { label: string; remove: Partial<Filters> }[] = [
    ...f.tiers.map((t) => ({ label: t, remove: { tiers: f.tiers.filter((x) => x !== t) } })),
    ...(f.sido && !f.subs.length ? [{ label: `${f.sido} 전체`, remove: { sido: null, subs: [] } }] : []),
    ...(f.sido ? f.subs.map((sub) => ({ label: subLabel(f.sido!, sub), remove: { subs: f.subs.filter((x) => x !== sub) } })) : []),
    ...REACHES.filter(([r]) => f.reach.includes(r)).map(([r, label]) => ({ label, remove: { reach: f.reach.filter((x) => x !== r) } })),
    ...f.options.map((o) => ({ label: o, remove: { options: f.options.filter((x) => x !== o) } })),
  ];
  const open = () => setDraft(f);
  const apply = () => setF(draft);

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

        <div className={styles.toolbar}>
          <div className={styles.filterBar} role="group" aria-label="필터">
            <FilterMenu label="가격대" value={f.tiers.length ? f.tiers.join(', ') : undefined} onOpen={open} onApply={apply} onReset={() => d({ tiers: [] })}>
              <MenuGroup title="여러 개 선택 가능">
                {TIERS.map((t) => <MenuOption key={t} checked={draft.tiers.includes(t)} onChange={() => d({ tiers: toggle(draft.tiers, t) })}>{t}</MenuOption>)}
              </MenuGroup>
            </FilterMenu>
            <FilterMenu label="지역" wide value={regionValue.length ? regionValue.join(' · ') : undefined} onOpen={open} onApply={apply} onReset={() => d({ sido: null, subs: [], reach: [] })}>
              <MenuGroup title="시 · 도 · 하나만 선택">
                <ChipGroup label="시 · 도" className={styles.sidoChips}>
                  <Chip active={!draft.sido} onClick={() => d({ sido: null, subs: [] })}>전체</Chip>
                  {REGION_GROUPS.map((g) => <Chip key={g.name} active={draft.sido === g.name} onClick={() => d({ sido: g.name, subs: [] })}>{g.name}</Chip>)}
                </ChipGroup>
              </MenuGroup>
              {draft.sido && (
                <MenuGroup title="세부 지역 · 여러 개 선택 가능">
                  <div className={styles.subGrid}>
                    <MenuOption checked={!draft.subs.length} onChange={() => d({ subs: [] })}>{draft.sido} 전체</MenuOption>
                    {subsWithVendors(draft.sido).map((sub) => <MenuOption key={sub} checked={draft.subs.includes(sub)} onChange={() => d({ subs: toggle(draft.subs, sub) })}>{sub}</MenuOption>)}
                  </div>
                </MenuGroup>
              )}
              <MenuGroup title="지역과 상관없이">
                {REACHES.map(([r, label]) => <MenuOption key={r} checked={draft.reach.includes(r)} onChange={() => d({ reach: toggle(draft.reach, r) })}>{label}</MenuOption>)}
              </MenuGroup>
            </FilterMenu>
            <FilterMenu label="옵션" value={f.options.length ? more(f.options) : undefined} onOpen={open} onApply={apply} onReset={() => d({ options: [] })}>
              <MenuGroup title="여러 개 선택 가능">
                {OPTIONS.map((o) => <MenuOption key={o.label} checked={draft.options.includes(o.label)} onChange={() => d({ options: toggle(draft.options, o.label) })}>{o.label}</MenuOption>)}
              </MenuGroup>
            </FilterMenu>
          </div>
          <div className={styles.sortWrap}>
            <p className={styles.count}><b className="num">{list.length}</b>개 업체</p>
            <button type="button" className={styles.info} aria-label="정렬 기준 안내" aria-describedby="sortTip"><Info /></button>
            <span className={styles.tip} id="sortTip" role="tooltip">정보 충실도 · 인증 후기 · 취향 일치 기준이에요. 광고나 유료 우선 노출은 없어요.</span>
            <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="정렬">
              {SORTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((t) => (
              <button key={t.label} type="button" className={styles.tag} onClick={() => setF({ ...f, ...t.remove })} aria-label={`${t.label} 조건 빼기`}>
                {t.label}<X aria-hidden="true" />
              </button>
            ))}
            <button type="button" className={styles.clear} onClick={() => setF(NO_FILTER)}>초기화</button>
          </div>
        )}

        {list.length === 0
          ? <p className={styles.empty}>조건에 맞는 업체가 아직 없어요. 필터를 줄여 보세요.</p>
          : <div className={styles.grid}>{list.map((v) => <VendorCard key={v.id} vendor={v} />)}</div>}
      </div>
    </div>
  );
}
