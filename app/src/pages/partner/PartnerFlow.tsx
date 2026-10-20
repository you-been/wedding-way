import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { BadgeCheck, CalendarCheck, CalendarDays, FilePenLine, Images, Wallet } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import styles from './PartnerPage.module.css';

/* ---------- 카드 설명 애니메이션 ----------
   강조된 카드 안의 data-seq 요소를 순서대로 켜고, 다 보여준 뒤 함께 사라졌다가 처음부터 반복.
   다른 카드로 넘어가면 그 순간 모습 그대로 정지(진행 중이던 전환 · 애니메이션까지),
   다시 돌아오면 멈춘 지점부터 이어서 재생 (초기화하지 않음) */
function useSequence(active: boolean, last: number, artRef: React.RefObject<HTMLDivElement | null>, reduced: boolean) {
  const [n, setN] = useState(0);
  const st = useRef<{ n: number; fn: (() => void) | null; due: number; timer: number | null; remaining: number }>({ n: 0, fn: null, due: 0, timer: null, remaining: 0 });

  useEffect(() => {
    const s = st.current;
    const anims = (action: 'pause' | 'play') => artRef.current?.getAnimations({ subtree: true }).forEach((a) => a[action]());
    if (reduced) return;
    const schedule = (fn: () => void, ms: number) => {
      s.fn = fn;
      s.due = performance.now() + ms;
      s.timer = window.setTimeout(() => { s.timer = null; fn(); }, ms);
    };
    const tick = () => {
      s.n += 1;
      setN(s.n);
      schedule(s.n < last ? tick : fadeOut, s.n < last ? 800 : 3000);
    };
    const fadeOut = () => {
      s.n = 0;
      setN(0);
      schedule(tick, 1100);
    };
    if (!active) { anims('pause'); return; }
    anims('play');
    if (s.fn) schedule(s.fn, s.remaining); // 멈췄던 곳부터 이어서
    else schedule(tick, 500);
    return () => {
      if (s.timer) { clearTimeout(s.timer); s.timer = null; s.remaining = Math.max(0, s.due - performance.now()); }
      anims('pause');
    };
  }, [active, last, artRef, reduced]);

  const on = (i: number) => (reduced || n >= i ? styles.on : '');
  return on;
}

function Step({ index, active, reduced, art, artClass, last, title, small, desc }: {
  index: number; active: boolean; reduced: boolean; last: number; artClass: string;
  art: (on: (i: number) => string) => ReactNode; title: ReactNode; small: string; desc: string;
}) {
  const artRef = useRef<HTMLDivElement>(null);
  const on = useSequence(active, last, artRef, reduced);
  return (
    <li className={`${styles.step} ${active ? styles.stepActive : ''}`} data-step={index}>
      <div ref={artRef} className={`${styles.stepArt} ${artClass}`} aria-hidden="true">{art(on)}</div>
      <div className={styles.stepBody}><small>{small}</small><b>{title}</b><p>{desc}</p></div>
    </li>
  );
}

/** 이렇게 진행돼요: 세로 스크롤 동안 화면에 고정되고 카드 줄이 옆으로 넘어감 */
export default function PartnerFlow() {
  const reduced = usePrefersReducedMotion();
  const flowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const nameRef = useRef<HTMLSpanElement>(null);

  // 타이핑 폭을 실제 글자 폭에 맞춤
  useLayoutEffect(() => {
    const t = nameRef.current;
    if (!t) return;
    const r = document.createRange();
    r.selectNodeContents(t);
    t.style.setProperty('--w', `${Math.ceil(r.getBoundingClientRect().width)}px`);
  }, []);

  // 섹션이 고정된 동안의 스크롤 진행률(0~1)을 목표로 두고, 매 프레임 조금씩 따라가며(관성) 카드 줄을 밀고 크기를 바꿈
  useEffect(() => {
    const flow = flowRef.current;
    const track = trackRef.current;
    if (!flow || !track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (reduced) {
      track.style.transform = '';
      cards.forEach((c) => { c.style.transform = ''; });
      return;
    }
    const s = { cur: 0, target: 0, maxShift: 0, raf: 0 };
    const render = (p: number) => {
      const pos = p * (cards.length - 1);
      track.style.transform = `translate3d(${(-p * s.maxShift).toFixed(1)}px, 0, 0)`;
      cards.forEach((c, i) => {
        const d = Math.min(1, Math.abs(i - pos));
        const eased = d * d * (3 - 2 * d); // smoothstep
        c.style.transform = `scale(${(1 - 0.1 * eased).toFixed(4)})`;
      });
      setActive(Math.round(pos));
    };
    const step = () => {
      s.raf = 0;
      s.cur += (s.target - s.cur) * 0.12;
      if (Math.abs(s.target - s.cur) < 0.0004) s.cur = s.target;
      render(s.cur);
      if (s.cur !== s.target) s.raf = requestAnimationFrame(step);
    };
    const update = () => {
      const sticky = flow.firstElementChild as HTMLElement;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const range = flow.offsetHeight - sticky.offsetHeight;
      s.target = range > 0 ? Math.min(1, Math.max(0, (top - flow.getBoundingClientRect().top) / range)) : 0;
      s.maxShift = Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
      if (!s.raf) s.raf = requestAnimationFrame(step);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(s.raf);
    };
  }, [reduced]);

  const isActive = (i: number) => reduced || active === i;

  return (
    <div className={styles.flow} ref={flowRef}>
      <div className={styles.flowSticky}>
        <div className="wrap">
          <div className={`${styles.head} ${styles.flowHead}`}>
            <h2>이렇게 진행돼요</h2>
            <div className={styles.dots} aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} className={active === i ? styles.on : ''} />)}</div>
          </div>
        </div>
        <div className={styles.viewport}>
          <ol className={styles.track} ref={trackRef}>
            <Step index={0} active={isActive(0)} reduced={reduced} last={6} artClass={styles.artA1} small="Step 1"
              title={<>필수 정보 4가지를<br />입력해요</>} desc="대표 사진 · 업종 · 업체명 · 무드 태그"
              art={(on) => (
                <div className={`${styles.a1Form} ${styles.float}`}>
                  <div className={styles.a1Photos}><i className={`${styles.p1} ${on(1)}`} /><i className={`${styles.p2} ${on(2)}`} /><i className={styles.add} /></div>
                  <span className={`${styles.a1Chip} ${on(3)}`}>아이폰스냅</span>
                  <div className={styles.a1Name}><span ref={nameRef} className={on(4)}>필름하루 스냅</span></div>
                  <div className={styles.a1Moods}><em className={on(5)}>#야외스냅</em><em className={on(6)}>#필름감성</em></div>
                </div>
              )} />
            <Step index={1} active={isActive(1)} reduced={reduced} last={4} artClass={styles.artA2} small="Step 2"
              title={<>보여주고 싶은 항목만<br />골라서 추가해요</>} desc="인스타 · 일정 · 가격 · 상세 소개 (선택)"
              art={(on) => (
                <ul className={`${styles.a2List} ${styles.float}`}>
                  {([[Images, '인스타 연동'], [CalendarDays, '예약 일정'], [Wallet, '가격 공개'], [FilePenLine, '상세 소개']] as const).map(([I, t], k) => (
                    <li key={t} className={on(k + 1)}><I />{t}<span className={styles.a2Tg} /></li>
                  ))}
                </ul>
              )} />
            <Step index={2} active={isActive(2)} reduced={reduced} last={2} artClass={styles.artA3} small="Step 3"
              title={<>검토 후 디렉토리에<br />소개돼요</>} desc="24시간 이내 · 취향이 맞는 예비부부에게 추천"
              art={(on) => (
                <>
                  <div className={styles.a3Grid}><i /><i /><i /><i /><i /></div>
                  <div className={`${styles.a3Card} ${on(1)}`}><span className={styles.a3Img} /><b>필름하루 스냅</b><small>아이폰스냅 · 35~75만 원</small></div>
                  <span className={`${styles.a3Stamp} ${on(2)}`}><BadgeCheck />검토 완료</span>
                </>
              )} />
            <Step index={3} active={isActive(3)} reduced={reduced} last={3} artClass={styles.artA4} small="Step 4"
              title={<>문의를 받고<br />예약을 확정해요</>} desc="내 업체에서 문의 · 일정을 한눈에"
              art={(on) => (
                <div className={`${styles.a4Chat} ${styles.float}`}>
                  <p className={`${styles.a4In} ${on(1)}`}>6/12 제주 스냅 가능할까요?</p>
                  <p className={`${styles.a4Out} ${on(2)}`}>네, 그날 오후 가능해요!</p>
                  <span className={`${styles.a4Done} ${on(3)}`}><CalendarCheck />6월 12일 예약 확정</span>
                </div>
              )} />
          </ol>
        </div>
      </div>
    </div>
  );
}
