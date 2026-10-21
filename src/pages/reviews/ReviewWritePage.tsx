import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, ShieldCheck, Star, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import PageHead from '../../components/ui/PageHead';
import Panel from '../../components/ui/Panel';
import { PATHS } from '../../routes';
import { toast } from '../../stores/toastStore';
import styles from './ReviewWritePage.module.css';

const EXTRAS = ['없음', '있음 (사전 안내)', '있음 (사전 안내 없음)'];
const PROOFS: [string, string][] = [['견적서 · 계약서', '개인정보 자동 블라인드 처리'], ['결제 내역 캡처', '카카오페이 · 토스 · 카드 내역']];

/** 후기 작성: 업체 · 금액 · 추가금 · 별점 · 내용 + 계약 인증(선택) */
export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [extra, setExtra] = useState(EXTRAS[0]);
  const [stars, setStars] = useState(5);
  const [proof, setProof] = useState(PROOFS[0][0]);

  const submit = () => {
    toast('후기가 등록되었어요. 인증 검토 후 배지가 부여됩니다.');
    navigate(PATHS.reviews);
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <Link to={PATHS.reviews} className={styles.back}><ChevronLeft />후기 피드</Link>
        <PageHead title="후기 작성" desc="실제 진행 과정을 남겨 주시면 다른 예비부부에게 큰 도움이 돼요." />

        <Panel className={styles.panel}>
          <label className={styles.field}><span>업체 선택</span><input className={styles.input} defaultValue="필름하루 스냅 (아이폰스냅)" /></label>
          <label className={styles.field}><span>계약 금액</span><input className={styles.input} placeholder="예: 480,000원" inputMode="numeric" /></label>
          <div className={styles.field}>
            <span>추가금 발생 여부</span>
            <ChipGroup label="추가금 발생 여부">{EXTRAS.map((x) => <Chip key={x} active={extra === x} onClick={() => setExtra(x)}>{x}</Chip>)}</ChipGroup>
          </div>
          <div className={styles.field}>
            <span id="starLabel">만족도</span>
            <div className={styles.stars} role="radiogroup" aria-labelledby="starLabel">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={stars === n} aria-label={`${n}점`} className={n <= stars ? styles.on : undefined} onClick={() => setStars(n)}>
                  <Star />
                </button>
              ))}
            </div>
          </div>
          <label className={styles.field}><span>후기 내용</span><textarea className={styles.textarea} rows={5} placeholder="실제 진행 과정, 좋았던 점과 아쉬운 점을 알려주세요." /></label>
        </Panel>

        <Panel className={styles.panel} title={<><ShieldCheck />계약 인증하기 <small className={styles.small}>선택 · 인증 배지 부여</small></>}>
          <div className={styles.proofs} role="radiogroup" aria-label="인증 방법">
            {PROOFS.map(([t, d]) => (
              <button key={t} type="button" role="radio" aria-checked={proof === t} className={`${styles.proof} ${proof === t ? styles.proofOn : ''}`} onClick={() => setProof(t)}>
                <b>{t}</b><small>{d}</small>
              </button>
            ))}
          </div>
          <button type="button" className={styles.upload} onClick={() => toast('파일 선택 창이 열려요 (프로토타입)')}><Upload />파일 업로드 (JPG, PNG, PDF)</button>
          <p className={styles.note}>업로드한 증빙은 인증 확인 후 즉시 삭제되며, 다른 사용자에게 공개되지 않아요.</p>
        </Panel>

        <Button block onClick={submit}>후기 등록</Button>
      </div>
    </div>
  );
}
