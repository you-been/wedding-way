import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { ArrowRight, BadgeCheck, CalendarDays, Check, ChevronDown, FilePenLine, HeartHandshake, Image, Images, AtSign, MessageCircle, Plus, Scale, Sparkles, Store, Tag as TagIcon, Wallet } from 'lucide-react';
import Button from '../../components/ui/Button';
import { BUSINESS_CATEGORIES } from '../../data/categories';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { PATHS } from '../../routes';
import { toast } from '../../stores/toastStore';
import PartnerFlow from './PartnerFlow';
import styles from './PartnerPage.module.css';

const MUST = [
  { Icon: Image, t: '대표 사진', d: '1장 이상 · 첫인상이 돼요' },
  { Icon: TagIcon, t: '업종', d: `${BUSINESS_CATEGORIES.length}개 업종 중 선택` },
  { Icon: Store, t: '업체명', d: '활동명도 괜찮아요' },
  { Icon: Sparkles, t: '무드 태그', d: '1개 이상 · 취향 매칭에 쓰여요' },
];
const OPTIONAL = [
  { Icon: Images, t: '인스타 연동', d: '게시물을 사진으로 자동 정리' },
  { Icon: CalendarDays, t: '예약 일정 공개', d: '반복되는 날짜 문의를 줄여요' },
  { Icon: Wallet, t: '가격 공개', d: '범위만 공개해도 돼요' },
  { Icon: FilePenLine, t: '상세 소개', d: '서비스 범위 · 소개글' },
];
const FAQ = [
  ['가격을 꼭 공개해야 하나요?', "아니요, 선택이에요. 공개하지 않으면 '상담 후 안내'로 표시되고, 나중에 범위만 공개하거나 상세 공개로 바꿀 수 있어요."],
  ['사업자가 아니어도 소개할 수 있나요?', '네. 프리랜서 작가 · 헬퍼 · 플래너는 사업자 등록증 대신 신분증과 활동 포트폴리오(인스타그램 등)로 확인한 뒤 소개해요. 가입은 증빙 없이 할 수 있고, 디렉토리에 공개하기 전에만 필요해요. (프로토타입 예시 정책)'],
  ['수수료가 있나요?', '원래 등록비가 있지만 지금은 무료로 등록할 수 있어요. 무료 기간이 끝나기 전에는 미리 안내해 드리고, 예약 연결 수수료는 받지 않아요. (프로토타입 예시 정책)'],
  ['돈을 내면 더 잘 보이나요?', '아니요. 결심에는 광고나 유료 우선 노출이 없어요. 대신 정보를 충실히 채우고 후기가 쌓일수록 더 위에 소개돼요.'],
];

/** 우리 업체 알리기 (업체용 소개 화면) */
export default function PartnerPage() {
  const reduced = usePrefersReducedMotion();
  const ctaRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [fab, setFab] = useState(false);

  // 고정 버튼: 히어로의 '우리 업체 알리기'가 화면 위로 지나가면 보이고, 맨 아래 배너가 보이면 숨김
  useEffect(() => {
    const update = () => {
      const gnb = document.querySelector('header')?.offsetHeight ?? 64;
      const cta = ctaRef.current?.getBoundingClientRect();
      const banner = bannerRef.current?.getBoundingClientRect();
      setFab(!!cta && !!banner && cta.bottom < gnb && banner.top > innerHeight); // 값이 같으면 다시 그리지 않음
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const toPrice = () => document.getElementById('pt-price')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  return (
    <div className={`page ${styles.page}`}>
      {/* 업체용 히어로: 예비부부 홈(핑크)과 구분되는 잉크 단색 면 */}
      <div className={styles.hero}>
        <div className={`wrap ${styles.heroInner}`}>
          <div>
            <span className={styles.kicker}>업체 회원</span>
            <h1>우리 업체를,<br />딱 맞는 예비부부에게.</h1>
            <p className={styles.lead}>웨딩홀부터 1인 작가 · 헬퍼까지, 규모와 상관없이 소개할 수 있어요. <br />지금은 등록비 없이 시작할 수 있어요.</p>
            <div className={styles.cta} ref={ctaRef}>
              <Button to={PATHS.partnerJoin} variant="brand">우리 업체 알리기 <ArrowRight /></Button>
              <button type="button" className={styles.btnLine} onClick={toPrice}>요금 안내</button>
            </div>
          </div>
          <div className={styles.preview} aria-label="업체 소개 미리보기 예시">
            <span className={styles.previewLabel}>예비부부에게 이렇게 보여요</span>
            <div className={styles.card}>
              <img src="/images/biz_07.jpg" alt="" />
              <div className={styles.cardBody}>
                <span className={styles.tag}>아이폰스냅</span>
                <b>필름하루 스냅</b>
                <small>서울 · 제주 | 1인 작가 · 35~75만 원</small>
                <div className={styles.moods}><span>#야외스냅</span><span>#필름감성</span><span>#내추럴</span></div>
              </div>
              <div className={styles.cardFoot}><BadgeCheck /> 취향이 맞는 예비부부에게 추천돼요</div>
            </div>
          </div>
        </div>
      </div>

      <section className="wrap section">
        <div className={styles.head}><h2>이런 업체와 함께해요</h2></div>
        <div className={styles.cats}>{BUSINESS_CATEGORIES.map(({ name, Icon }) => <span key={name}><Icon />{name}</span>)}</div>
      </section>

      <section className="wrap section">
        <div className={styles.head}><h2>결심에서 업체를 알리면</h2></div>
        <div className={styles.guide}>
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artPink}`} aria-hidden="true">
              <div className={styles.artGrid}>{Array.from({ length: 6 }, (_, i) => <span key={i} />)}</div>
              <span className={styles.coin}><AtSign /></span>
            </div>
            <h3>인스타 연동</h3>
            <p>계정만 연결하면 게시물이 <br />우리 업체 소개 페이지로 자동 정리돼요.</p>
          </article>
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artLilac}`} aria-hidden="true">
              <div className={styles.artCal}>
                <b>6월</b>
                <div>{([['7', 1], ['8', 0], ['14', 1], ['15', 1], ['21', 0], ['22', 1]] as const).map(([d, ok]) => <span key={d} className={ok ? styles.ok : styles.no}>{d}</span>)}</div>
              </div>
              <span className={styles.coin}><CalendarDays /></span>
            </div>
            <h3>일정 공개</h3>
            <p>예약 가능한 날짜를 보여줘서 <br />반복되는 일정 문의를 줄여요.</p>
          </article>
          <article className={styles.gCard}>
            <div className={`${styles.art} ${styles.artMint}`} aria-hidden="true">
              <div className={styles.artMatch}><span>#필름감성</span><HeartHandshake /><span>#야외스냅</span></div>
            </div>
            <h3>취향 매칭</h3>
            <p>광고 없이, 무드와 예산이 맞는 <br />예비부부에게 추천돼요.</p>
          </article>
        </div>
      </section>

      <section className="wrap section">
        <div className={styles.head}>
          <div>
            <h2>필수는 딱 4가지, 나머지는 자유롭게</h2>
            <p>원하는 만큼만 보여주세요. 나중에 언제든 추가하거나 숨길 수 있어요.</p>
          </div>
        </div>
        <div className={styles.free}>
          <div className={styles.freeCol}>
            <div className={styles.freeHead}><span className={styles.freeLabel}>필수</span><b>4가지만 있으면 바로 소개돼요</b></div>
            <ul className={styles.tiles}>
              {MUST.map(({ Icon, t, d }) => <li key={t} className={`${styles.tile} ${styles.must}`}><span className={styles.tileIco}><Icon /></span><b>{t}</b><small>{d}</small><span className={styles.tileMark} aria-hidden="true"><Check /></span></li>)}
            </ul>
          </div>
          <div className={`${styles.freeCol} ${styles.soft}`}>
            <div className={styles.freeHead}><span className={`${styles.freeLabel} ${styles.soft}`}>선택</span><b>원하는 것만, 언제든 추가</b></div>
            <ul className={styles.tiles}>
              {OPTIONAL.map(({ Icon, t, d }) => <li key={t} className={`${styles.tile} ${styles.opt}`}><span className={styles.tileIco}><Icon /></span><b>{t}</b><small>{d}</small><span className={styles.tileMark} aria-hidden="true"><Plus /></span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <PartnerFlow />

      <section className={`wrap section ${styles.priceSection}`} id="pt-price">
        <div className={styles.head}><h2>요금 안내</h2></div>
        <div className={styles.plans}>
          <div className={`${styles.plan} ${styles.planOn}`}>
            <span className={styles.planTag}>현재</span>
            <h3>업체 등록</h3>
            <strong>지금은 무료</strong>
            <p>업체 소개 · 사진 · 무드 · 일정 공개</p>
            <small>원래 등록비가 있는 서비스예요. 무료 기간이 끝나기 전에 미리 안내해 드려요.</small>
          </div>
          <div className={styles.plan}>
            <span className={`${styles.planTag} ${styles.soft}`}>예정</span>
            <h3>관리 구독</h3>
            <strong>필요할 때만</strong>
            <p>문의 · 예약 · 일정 관리 도구, 방문 통계</p>
            <small>등록과 별도로, 원하는 업체만 선택해서 구독해요.</small>
          </div>
        </div>
        <p className={styles.neutral}><Scale /> 구독 여부와 상관없이 모든 업체는 같은 기준으로 소개돼요.</p>
      </section>

      <section className="wrap section">
        <div className={styles.head}><h2>자주 묻는 질문</h2></div>
        <div className={styles.faq}>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}<ChevronDown /></summary><p>{a}</p></details>)}
        </div>
      </section>

      {/* 마지막 배너: 화면 전체 너비 · 배경 이미지 */}
      <div className={styles.banner} ref={bannerRef}>
        <div className={`wrap ${styles.bannerInner}`}>
          <div><h3>3분이면 우리 업체 소개가 완성돼요</h3><p>필수 정보 4가지만 있으면 바로 시작할 수 있어요.</p></div>
          <div className={styles.bannerBtns}>
            <button type="button" className={styles.btnAsk} onClick={() => toast('입점 문의를 남길 수 있는 창이 열려요 (프로토타입)')}><MessageCircle />업체 입점문의</button>
            <Link to={PATHS.partnerJoin} className={styles.btnGo}>우리 업체 알리기 <ArrowRight /></Link>
          </div>
        </div>
      </div>

      {createPortal(
        <Link to={PATHS.partnerJoin} className={`biz-theme ${styles.fab} ${fab ? styles.fabShow : ''}`} tabIndex={fab ? 0 : -1} aria-hidden={!fab}>
          <Store />우리 업체 알리기<ArrowRight />
        </Link>,
        document.body,
      )}
    </div>
  );
}
