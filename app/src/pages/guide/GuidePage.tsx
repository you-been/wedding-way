import { useState } from 'react';
import { Link } from 'react-router';
import { Gem } from 'lucide-react';
import Button from '../../components/ui/Button';
import Tag from '../../components/ui/Tag';
import { PATHS } from '../../routes';
import steps from '../onboarding/steps.module.css';
import styles from './GuidePage.module.css';

// 새내기 가이드: 카드 4장을 넘겨 보며 결혼 준비의 큰 그림을 잡음
const PHASES = [
  ['D-12~10개월', '준비 시작 & 웨딩홀 계약'],
  ['D-10~8개월', '준비 방식 결정 & 스드메'],
  ['D-8~6개월', '신혼여행 · 예복 · 반지 계약'],
  ['D-6~4개월', '드레스 투어 & 스튜디오 촬영'],
  ['D-4~2개월', '청첩장 · 한복 준비'],
  ['D-1~0개월', '드레스 가봉 & 본식 최종 점검'],
];
const FIRST = [
  ['예산 정하기', '양가 지원금과 우리 예산을 맞춰 총예산을 정해요.'],
  ['웨딩홀 계약', '날짜와 하객 규모가 여기서 정해져요. 인기 홀은 1년 전에 마감돼요.'],
  ['준비 방식 정하기', '플래너와 함께할지, 직접 고를지에 따라 이후 과정이 달라져요.'],
];
const METHODS: [string, string, string, boolean?][] = [
  ['플래너 동행', '투어부터 본식까지 함께. 가장 편하지만 제휴 업체 중심이에요.', '시간 적게'],
  ['플래너 비동행', '상담 · 예약만 도움받고 투어는 직접 다녀요.', '비용 절약'],
  ['일부 동행', '드레스 투어처럼 중요한 순간만 골라서 함께해요.', '균형형'],
  ['완전 워크인', '업체를 하나하나 직접 골라요. 인디 업체도 자유롭게.', '자유도 최고', true],
];
const TOTAL = 4;

export default function GuidePage() {
  const [step, setStep] = useState(1);
  const go = (n: number) => setStep(Math.min(Math.max(n, 1), TOTAL));

  return (
    <div className="page">
      <div className={`wrap ${steps.wrap}`}>
        <div className={styles.top}>
          <div className={styles.dots} aria-label={`${step} / ${TOTAL}`}>
            {Array.from({ length: TOTAL }, (_, i) => <i key={i} className={i === step - 1 ? styles.on : undefined} />)}
          </div>
          <Link to={PATHS.onboarding} className={styles.skip}>건너뛰기</Link>
        </div>

        <section key={step} className={`${styles.card} ${steps.step}`} aria-live="polite">
          {step === 1 && (
            <>
              <span className={styles.kicker}>새내기 가이드 1/4</span>
              <h2>결혼 준비, 큰 그림부터 볼까요?</h2>
              <p className={styles.lead}>보통 본식 1년 전부터 6단계로 준비해요.</p>
              <ol className={styles.phases}>
                {PHASES.map(([when, what], i) => <li key={when}><span className={i === 0 ? styles.now : undefined}>{i + 1}</span><em>{when}</em><b>{what}</b></li>)}
              </ol>
            </>
          )}
          {step === 2 && (
            <>
              <span className={styles.kicker}>새내기 가이드 2/4</span>
              <h2>가장 먼저 할 일은 딱 3가지</h2>
              <p className={styles.lead}>이 세 가지가 정해지면 나머지는 순서대로 따라와요.</p>
              <div className={styles.first}>
                {FIRST.map(([t, d], i) => <div key={t}><span>{i + 1}</span><b>{t}</b><p>{d}</p></div>)}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <span className={styles.kicker}>새내기 가이드 3/4</span>
              <h2>준비 방식은 4가지예요</h2>
              <p className={styles.lead}>정답은 없어요. 우리에게 맞는 방식이 있을 뿐이에요.</p>
              <div className={styles.methods}>
                {METHODS.map(([t, d, tag, hl]) => <div key={t}><b>{t}</b><p>{d}</p><Tag tone={hl ? 'brand' : 'default'}>{tag}</Tag></div>)}
              </div>
            </>
          )}
          {step === 4 && (
            <div className={styles.final}>
              <span className={styles.finalIco}><Gem /></span>
              <span className={styles.kicker}>새내기 가이드 4/4</span>
              <h2>이제 우리 커플에게 맞춰볼까요?</h2>
              <p className={styles.lead}>1분 진단으로 준비 방식 추천, 맞춤 예산, D-Day 타임라인까지 한 번에 받아보세요.</p>
              <Button to={PATHS.onboarding} className={styles.finalBtn}>1분 진단 시작</Button>
              <Link to={PATHS.home} className={styles.later}>나중에 할게요</Link>
            </div>
          )}
        </section>

        {step < TOTAL && (
          <div className={steps.actions}>
            <Button variant="ghost" onClick={() => go(step - 1)} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>이전</Button>
            <Button onClick={() => go(step + 1)}>다음</Button>
          </div>
        )}
      </div>
    </div>
  );
}
