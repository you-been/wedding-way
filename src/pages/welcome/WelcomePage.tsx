import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Heart, Store } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import { publicImage } from '../../data/vendors';
import { PATHS } from '../../routes';
import { useModeStore } from '../../stores/modeStore';
import styles from './WelcomePage.module.css';

// 떠다니는 하트: 위치 · 크기 · 속도 · 기울기를 하트마다 다르게 (far = 멀리 있는 작고 흐린 하트)
const HEARTS = [
  { x: '66%', y: '-8%', w: 240, dur: 9, delay: -2, rot: -8 },
  { x: '12%', y: '22%', w: 180, dur: 7, delay: -4, rot: 6 },
  { x: '78%', y: '40%', w: 360, dur: 11, delay: 0, rot: 4 },
  { x: '-5%', y: '72%', w: 290, dur: 10, delay: -6, rot: -5 },
  { x: '3%', y: '1%', w: 110, dur: 8, delay: -1, rot: 10, far: true },
];

/** 첫 방문 갈림길: 예비부부 / 웨딩 업체 / 둘러보기 (고르면 다시 안 보임) */
export default function WelcomePage() {
  const finishSplash = useModeStore((s) => s.finishSplash);
  const setBizMode = useModeStore((s) => s.setBizMode);
  const choose = (biz?: boolean) => () => {
    finishSplash();
    if (biz !== undefined) setBizMode(biz);
  };

  return (
    <div className={styles.splash}>
      <div className={styles.hearts} aria-hidden="true">
        {HEARTS.map((h, i) => (
          <img
            key={i}
            src={publicImage('heart.png')}
            alt=""
            className={h.far ? styles.far : undefined}
            style={{ '--x': h.x, '--y': h.y, '--w': `${h.w}px`, '--dur': `${h.dur}s`, '--delay': `${h.delay}s`, '--rot': `${h.rot}deg` } as CSSProperties}
          />
        ))}
      </div>

      <div className={styles.inner}>
        <Logo asText className={styles.logo} />
        <h1>결혼을 결심한 순간,<br />준비도 여기서 시작해요.</h1>
        <p className={styles.sub}>어떤 분이신지 알려주시면 딱 맞는 길로 안내해 드릴게요.</p>

        <div className={styles.choices}>
          <Link to={PATHS.guide} className={styles.card} onClick={choose(false)}>
            <span className={styles.ico}><Heart /></span>
            <b>결혼을 준비하고 있어요</b>
            <small>막 결혼을 결심했다면, 큰 그림부터 함께 볼게요</small>
            <span className={styles.go}>새내기 가이드 보기 <ArrowRight /></span>
          </Link>
          <Link to={PATHS.partner} className={`${styles.card} ${styles.biz}`} onClick={choose(true)}>
            <span className={styles.ico}><Store /></span>
            <b>웨딩 관련 일을 하고 있어요</b>
            <small>스튜디오 · 드레스 · 스냅 · 플래너 등, 우리 업체를 예비부부에게 알려보세요</small>
            <span className={styles.go}>우리 업체 알리기 <ArrowRight /></span>
          </Link>
        </div>

        <Link to={PATHS.home} className={styles.skip} onClick={choose()}>일단 둘러볼게요</Link>
      </div>
    </div>
  );
}
