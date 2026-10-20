import { useState } from 'react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Modal from '../../components/ui/Modal';
import { GUEST_OPTIONS, HALL_REGIONS, HALL_TYPES, hallEstimate, won, type HallRegionId, type HallSetup, type HallTypeId } from '../../data/budget';
import styles from './HallModal.module.css';

const TITLES = { 1: '어떤 예식을 생각하세요?', 2: '어느 지역에서 하세요?', 3: '하객은 몇 명 정도 예상하세요?' } as const;
const STEPS = ['예식 종류', '지역', '하객 수'];

/** 예식장 · 식대 추천받기: 예식 종류 → 지역 → 하객 수 → 예상 비용 */
export default function HallModal({ initial, onClose, onApply }: { initial: HallSetup | null; onClose: () => void; onApply: (s: HallSetup) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<HallTypeId | null>(initial?.type ?? null);
  const [region, setRegion] = useState<HallRegionId | null>(initial?.region ?? null);
  const [guests, setGuests] = useState(initial?.guests ?? 200);
  const est = type && region ? hallEstimate(type, region, guests) : null;
  const ready = (step === 1 && type) || (step === 2 && region) || (step === 3 && guests > 0);

  const next = () => {
    if (step < 3) setStep((step + 1) as 2 | 3);
    else if (type && region && est) onApply({ type, region, guests, total: est.total });
  };

  return (
    <Modal open onClose={onClose} kicker="예식장 · 식대 추천받기" title={TITLES[step]} width={560}>
      <ol className={styles.progress}>
        {STEPS.map((s, i) => <li key={s} className={i + 1 === step ? styles.on : i + 1 < step ? styles.done : ''} aria-current={i + 1 === step ? 'step' : undefined}>{s}</li>)}
      </ol>

      {step === 1 && (
        <div className={styles.options}>
          {HALL_TYPES.map((t) => <button key={t.id} type="button" className={`${styles.opt} ${type === t.id ? styles.active : ''}`} aria-pressed={type === t.id} onClick={() => setType(t.id)}><b>{t.name}</b><small>{t.d}</small></button>)}
        </div>
      )}
      {step === 2 && (
        <div className={styles.options}>
          {HALL_REGIONS.map((r) => <button key={r.id} type="button" className={`${styles.opt} ${region === r.id ? styles.active : ''}`} aria-pressed={region === r.id} onClick={() => setRegion(r.id)}><b>{r.name}</b></button>)}
        </div>
      )}
      {step === 3 && (
        <>
          <ChipGroup label="하객 수">
            {GUEST_OPTIONS.map((g) => <Chip key={g} active={guests === g} onClick={() => setGuests(g)}>{g === 300 ? '300명 이상' : `${g}명`}</Chip>)}
          </ChipGroup>
          <label className={styles.guestInput}>직접 입력 <input type="number" min={10} max={1000} step={10} value={guests} onChange={(e) => setGuests(Math.max(Math.round(+e.target.value || 0), 0))} /> 명</label>
          {est && (
            <div className={styles.result}>
              <small>예상 비용</small>
              <strong>약 {won(est.total)}</strong>
              <ul>
                <li>식대 {(Math.round(est.meal * 10) / 10).toLocaleString()}만 원 × {guests}명<span>{won(est.food)}</span></li>
                <li>대관료<span>{won(est.base)}</span></li>
              </ul>
              <p>예시 단가로 계산한 참고 금액이에요. 실제 견적은 예식장마다 달라요.</p>
            </div>
          )}
        </>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => setStep((step - 1) as 1 | 2)} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>이전</Button>
        <Button onClick={next} disabled={!ready}>{step === 3 ? '이 금액 적용' : '다음'}</Button>
      </div>
    </Modal>
  );
}
