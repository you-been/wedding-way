import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, BadgeCheck, Bookmark, CalendarCheck, Camera, Check, ChevronLeft, ChevronRight, Church, Flower2, Mail, Mic, PiggyBank, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import { BUSINESS_CATEGORIES } from '../../data/categories';
import { getFeedVendors } from '../../data/api';
import { imageUrl } from '../../data/vendors';
import { useMemberAction } from '../../hooks/useMemberAction';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { PATHS, vendorPath } from '../../routes';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { toast } from '../../stores/toastStore';
import styles from './HomePage.module.css';

/* 히어로: 진단 결과 예시 카드 (조건별로 금액 · 막대가 바뀜). 금액 단위 만 원 */
const HERO_ROWS = ['예식장 · 식대', '스드메', '본식스냅', '예복 · 한복', '기타 준비 비용'];
const HERO_SCENARIOS = [
  { cond: '서울 웨딩홀 · 하객 150명', badge: '평균 범위 안', rows: [1350, 620, 120, 110, 740] },
  { cond: '경기 하우스웨딩 · 하객 80명', badge: '평균보다 낮은 편', rows: [900, 540, 150, 90, 520] },
  { cond: '서울 호텔 · 하객 250명', badge: '평균보다 높은 편', rows: [3100, 880, 180, 160, 980] },
  { cond: '제주 스몰웨딩 · 하객 40명', badge: '평균보다 낮은 편', rows: [380, 450, 90, 70, 410] },
];
const HERO_BAR_MAX = 3100; // 막대 길이 기준 (시나리오끼리 비교되게 고정)
const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);

const PROMOS = [
  { to: `${PATHS.directory}?cat=${encodeURIComponent('아이폰스냅')}`, img: '/images/banner_01.jpg', alt: '빈티지 제주스냅 찾는다면? 들꽃스냅 패키지 프로모션 · 제주스냅+드레스+헤어메이크업 패키지 할인 중' },
  { to: PATHS.guide, img: '/images/banner_02.jpg', alt: '웨딩준비 뭐부터 해야 할지 모르겠다면? 블라썸 웨딩 페스타 · 결심회원 한정 프로모션 진행 중' },
];

function HeroCard() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(HERO_SCENARIOS[0].rows);
  const shownRef = useRef(shown);
  const paused = useRef(false);
  const sc = HERO_SCENARIOS[idx];

  // 3.2초마다 다음 예시 (마우스를 올리면 멈춤, 움직임 줄이기 설정이면 첫 예시만)
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => { if (!paused.current && !document.hidden) setIdx((i) => (i + 1) % HERO_SCENARIOS.length); }, 3200);
    return () => clearInterval(t);
  }, [reduced]);

  // 금액은 0.7초 동안 이전 값에서 새 값으로 카운트
  useEffect(() => {
    const from = shownRef.current;
    const to = HERO_SCENARIOS[idx].rows;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(Math.max((now - start) / 700, 0), 1);
      const e = 1 - (1 - p) ** 3;
      const next = to.map((v, i) => Math.round(from[i] + (v - from[i]) * e));
      shownRef.current = next;
      setShown(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [idx]);

  return (
    <div className={styles.heroCard} aria-label="예산 진단 결과 예시" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <div className={styles.hcTop}><span>예산 진단 결과 예시</span><span>{sc.cond}</span></div>
      <div className={styles.hcTotal}><small>예상 총비용</small><strong>{sum(shown).toLocaleString()}만 원</strong><span className={styles.hcBadge}>{sc.badge}</span></div>
      <ul className={styles.hcRows}>
        {HERO_ROWS.map((label, i) => (
          <li key={label}><span>{label}</span><i style={{ '--w': `${(sc.rows[i] / HERO_BAR_MAX) * 100}%` } as React.CSSProperties} /><b>{shown[i].toLocaleString()}만</b></li>
        ))}
      </ul>
      <Link to={PATHS.budget} className={styles.hcLink}>내 조건으로 진단하기 <ArrowRight /></Link>
    </div>
  );
}

function Promo() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const go = (n: number) => setI((n + PROMOS.length) % PROMOS.length);

  // 5초마다 다음 배너 (마우스를 올리거나 초점이 있으면 멈춤)
  useEffect(() => {
    if (reduced || hold) return;
    const t = setInterval(() => setI((x) => (x + 1) % PROMOS.length), 5000);
    return () => clearInterval(t);
  }, [reduced, hold]);

  return (
    <div className={styles.promo} aria-roledescription="carousel" aria-label="프로모션 배너"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className={styles.promoTrack} style={{ transform: `translateX(${-i * 100}%)` }}>
        {PROMOS.map((p, k) => (
          <Link key={p.img} to={p.to} className={styles.promoSlide} aria-roledescription="slide" aria-label={`${k + 1} / ${PROMOS.length}`} aria-hidden={k !== i} tabIndex={k === i ? 0 : -1}>
            <img src={p.img} alt={p.alt} loading={k ? 'lazy' : undefined} />
          </Link>
        ))}
      </div>
      <button type="button" className={`${styles.promoNav} ${styles.prev}`} onClick={() => go(i - 1)} aria-label="이전 배너"><ChevronLeft /></button>
      <button type="button" className={`${styles.promoNav} ${styles.next}`} onClick={() => go(i + 1)} aria-label="다음 배너"><ChevronRight /></button>
      <span className={styles.promoCount} aria-hidden="true"><b>{i + 1}</b> / {PROMOS.length}</span>
    </div>
  );
}

function PhotoFeed() {
  const reduced = usePrefersReducedMotion();
  const feed = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const favorites = useFavoriteStore((s) => s.ids);
  const toggle = useFavoriteStore((s) => s.toggle);
  const member = useMemberAction('user');

  // 양끝에서는 이전 · 다음 버튼을 숨김
  const update = () => {
    const el = feed.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  };
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const slide = (dir: number) => {
    const el = feed.current;
    if (!el) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (el.clientWidth + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className={styles.slider}>
      <button type="button" className={`${styles.feedNav} ${styles.prev}`} onClick={() => slide(-1)} disabled={edge.start} aria-label="이전 사진"><ChevronLeft /></button>
      <div className={styles.feed} ref={feed} onScroll={update} tabIndex={0} aria-label="업체 사진 목록, 좌우로 넘겨보세요">
        {getFeedVendors().map((v) => {
          const saved = favorites.includes(v.id);
          return (
            <div key={v.id} className={styles.photo}>
              <Link to={vendorPath(v.id)} className={styles.photoLink}>
                <img src={imageUrl(v.photo) ?? ''} alt={`${v.name} · ${v.cat}`} loading="lazy" />
                <span className={styles.photoMeta}><span className={styles.avatar}>{v.name[0]}</span><b>{v.name}</b><small>{v.cat}</small></span>
              </Link>
              <button type="button" className={`${styles.save} ${saved ? styles.saveOn : ''}`} aria-pressed={saved} aria-label={`${v.name} 찜하기`}
                onClick={() => member(() => toast(toggle(v.id) ? '찜 목록에 담았어요' : '찜을 해제했어요'))}>
                <Bookmark />
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" className={`${styles.feedNav} ${styles.next}`} onClick={() => slide(1)} disabled={edge.end} aria-label="다음 사진"><ChevronRight /></button>
    </div>
  );
}

/** 홈: 핑크 히어로 + 카테고리 · 배너 · 사진 피드 · 활용 안내 */
export default function HomePage() {
  return (
    <div className="page">
      <div className={styles.hero}>
        <div className={`wrap ${styles.heroInner}`}>
          <div>
            <h1>패키지 말고,<br />우리다운 결혼식.</h1>
            <p className={styles.lead}>플래너부터 아이폰스냅 · 헤어변형 같은 인디 업체까지,<br />내 예산과 취향으로 비교하고 계획하세요.</p>
            <div className={styles.cta}>
              <Button to={PATHS.budget}>무료 예산 진단하기 <ArrowRight /></Button>
              <Button to={PATHS.onboarding} variant="line">취향 진단 시작</Button>
            </div>
            <p className={styles.note}>회원가입 없이 바로 이용할 수 있고 결과는 링크로 공유할 수 있어요</p>
          </div>
          <HeroCard />
        </div>
      </div>

      <section className="wrap section">
        <div className={styles.head}>
          <h2>무엇을 준비하세요?</h2>
          <Link to={PATHS.directory} className={styles.more}>전체 보기 <ArrowRight /></Link>
        </div>
        <div className={styles.cats}>
          {BUSINESS_CATEGORIES.map(({ name, Icon }) => (
            <Link key={name} to={`${PATHS.directory}?cat=${encodeURIComponent(name)}`} className={styles.cat}><span className={styles.catIco}><Icon /></span>{name}</Link>
          ))}
        </div>
      </section>

      <section className={`wrap section ${styles.promoWrap}`}><Promo /></section>

      <section className="wrap section">
        <div className={styles.head}>
          <div>
            <h2>이런 업체 찾고 있나요?</h2>
            <p>취향에 맞는 업체를 모아봤어요.</p>
          </div>
          <Link to={PATHS.directory} className={styles.more}>디렉토리 <ArrowRight /></Link>
        </div>
        <PhotoFeed />
      </section>

      <section className="wrap section">
        <div className={styles.head}><h2>결심을 더 잘 활용하는 방법</h2></div>
        <div className={styles.guide}>
          {/* 일러스트 영역은 예시 — 실제 아이콘 · 일러스트로 교체 */}
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artBudget}`} aria-hidden="true">
              <div className={styles.receipt}>
                <span className={styles.receiptLabel}>예산 진단 결과</span>
                {[['78%', '예식장'], ['52%', '스드메'], ['30%', '본식스냅']].map(([w, t]) => (
                  <span key={t} className={styles.line}><i style={{ '--w': w } as React.CSSProperties} /><b>{t}</b></span>
                ))}
              </div>
              <div className={styles.saveBadge}><BadgeCheck /> 평균보다 120만 원 아꼈어요</div>
              <span className={styles.coin}><PiggyBank /></span>
            </div>
            <h3>똑똑한 예산 진단</h3>
            <p>항목별 평균가와 비교해서 꼭 쓸 곳엔 쓰고, 아낄 곳은 아껴요. <br />우리 예산을 현명하게 세워보세요.</p>
            <Button to={PATHS.budget} variant="outline">예산 진단 바로가기</Button>
          </article>
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artRoute}`} aria-hidden="true">
              <ul className={styles.plan}>
                <li className={styles.done}><Check /><b>웨딩홀 계약</b><em>D-300</em></li>
                <li className={styles.done}><Check /><b>스드메 예약</b><em>D-240</em></li>
                <li className={styles.now}><i /><b>청첩장 주문</b><em>6/12</em></li>
              </ul>
              <span className={styles.coin}><CalendarCheck /></span>
            </div>
            <h3>나만의 웨딩 로드맵</h3>
            <p>준비 순서를 우리 방식대로 짜고, <br />일정은 캘린더로 한눈에 관리해요.</p>
            <Button to={`${PATHS.mypage}?tab=timeline`} variant="outline">내 타임라인 보러가기</Button>
          </article>
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artCats}`} aria-hidden="true">
              <div className={styles.tiles}>
                {[Church, Camera, Sparkles, Flower2, Mic, Mail].map((I, k) => <span key={k}><I /></span>)}
              </div>
            </div>
            <h3>카테고리 무제한 비교</h3>
            <p>스드메부터 식전영상, 축의대, 본식 사회자까지 <br />한곳에서 같은 기준으로 비교해요.</p>
            <Button to={PATHS.directory} variant="outline">업체 디렉토리 보러가기</Button>
          </article>
        </div>
      </section>
    </div>
  );
}
