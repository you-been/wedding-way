import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Lightbulb } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Stepper from '../../components/ui/Stepper';
import { publicImage } from '../../data/vendors';
import { PATHS } from '../../routes';
import { usePrefStore, type PrepMethod } from '../../stores/prefStore';
import { toast } from '../../stores/toastStore';
import styles from './steps.module.css';

const METHODS: [PrepMethod, string][] = [
  ['플래너 동행', '투어부터 본식까지 플래너가 함께해요'],
  ['플래너 비동행', '상담·예약만 도움 받고 투어는 직접'],
  ['일부 동행', '드레스 투어 등 중요한 순간만 함께'],
  ['완전 워크인 (셀프)', '발품 팔아도 내 취향대로 온전히 커스텀'],
];
const GUESTS = ['50명 이하', '50~100명', '100~200명', '200명 이상'];
const VENUES = ['웨딩홀', '호텔', '하우스·카페 스몰웨딩', '야외', '미정'];
const BUDGETS = ['3천만 원대', '4~5천만 원대', '5,500만 원 이상', '직접 입력'];
// 무드 사진: 업체 목업 사진 중 무드에 어울리는 것
const MOOD_PHOTOS: [string, string][] = [
  ['#감성적', 'biz_03'], ['#클래식', 'biz_09'], ['#빈티지', 'biz_02'], ['#미니멀', 'biz_06'],
  ['#내추럴', 'biz_13'], ['#전통적', 'biz_05'], ['#유니크', 'biz_01'], ['#따뜻함', 'biz_08'],
  ['#고급스러움', 'biz_04'], ['#로맨틱', 'biz_10'], ['#모던', 'biz_11'], ['#러블리', 'biz_15'], 
  ['#경건함', 'biz_14']
];
const TOTAL = 4;

/** 취향 진단: 준비 방식 → 예식 정보 → 예산 → 무드 (결과는 취향 저장소에 저장) */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const pref = usePrefStore();
  const navigate = useNavigate();

  const next = () => {
    if (step < TOTAL) { setStep(step + 1); return; }
    toast('진단 완료! 맞춤 예산을 계산했어요');
    navigate(PATHS.budget);
  };
  const prev = () => (step > 1 ? setStep(step - 1) : navigate(-1));

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.top}><Stepper step={step} total={TOTAL} /></div>

        <section key={step} className={styles.step}>
          {step === 1 && (
            <>
              <h2 className={styles.stepTitle}>결혼식, 어떻게 준비하고 싶으세요?</h2>
              <p className={styles.stepDesc}>준비 방식에 따라 타임라인과 추천 업체가 달라져요.</p>
              <div className={styles.options} role="radiogroup" aria-label="준비 방식">
                {METHODS.map(([m, d]) => (
                  <button key={m} type="button" role="radio" aria-checked={pref.method === m} className={`${styles.option} ${pref.method === m ? styles.optionOn : ''}`} onClick={() => pref.set({ method: m })}>
                    <b>{m}</b><small>{d}</small>
                  </button>
                ))}
              </div>
              <Link to={PATHS.guide} className={styles.textLink}>잘 모르겠어요 · 새내기 가이드로 차이 먼저 보기 <ArrowRight /></Link>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className={styles.stepTitle}>예식 정보를 알려주세요</h2>
              <p className={styles.stepDesc}>대략적인 정보만으로도 예산을 추천해 드려요.</p>
              <label className={styles.field}>
                <span>예식 예정일</span>
                <input type="date" className={styles.input} value={pref.weddingDate} onChange={(e) => pref.set({ weddingDate: e.target.value })} />
              </label>
              <div className={styles.field}>
                <span>예상 하객 수</span>
                <ChipGroup label="예상 하객 수">{GUESTS.map((g) => <Chip key={g} active={pref.guests === g} onClick={() => pref.set({ guests: g })}>{g}</Chip>)}</ChipGroup>
              </div>
              <div className={styles.field}>
                <span>예식 형태</span>
                <ChipGroup label="예식 형태">{VENUES.map((v) => <Chip key={v} active={pref.venue === v} onClick={() => pref.set({ venue: v })}>{v}</Chip>)}</ChipGroup>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className={styles.stepTitle}>생각하는 총 예산은요?</h2>
              <p className={styles.stepDesc}>시장 평균 프리셋 중에 고르거나 직접 입력하세요.</p>
              <ChipGroup label="총 예산">{BUDGETS.map((b) => <Chip key={b} size="lg" active={pref.budgetPreset === b} onClick={() => pref.set({ budgetPreset: b })}>{b}</Chip>)}</ChipGroup>
              <div className={styles.hint}><Lightbulb /><span>하객 {pref.guests} · {pref.venue} 기준, 비슷한 커플의 평균 예산은 <b>약 3,200만 원</b>이에요.</span></div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className={styles.stepTitle}>끌리는 무드를 골라주세요</h2>
              <p className={styles.stepDesc}>여러 개 선택 가능 · 디렉토리 추천에 반영돼요.</p>
              <div className={styles.moods}>
                {MOOD_PHOTOS.map(([m, photo]) => {
                  const on = pref.moods.includes(m);
                  return (
                    <button key={m} type="button" aria-pressed={on} className={`${styles.mood} ${on ? styles.moodOn : ''}`} onClick={() => pref.toggleMood(m)}>
                      <img src={publicImage(`${photo}.jpg`)} alt="" loading="lazy" />{m}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={prev}>이전</Button>
          <Button onClick={next}>{step === TOTAL ? '진단 완료' : '다음'}</Button>
        </div>
      </div>
    </div>
  );
}
