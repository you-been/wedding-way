import { useState } from 'react';
import { PenLine } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import PageHead from '../../components/ui/PageHead';
import ReviewCard from '../../components/vendor/ReviewCard';
import { getReviews } from '../../data/api';
import type { Review } from '../../data/reviews';
import { PATHS } from '../../routes';
import styles from './ReviewsPage.module.css';

// 필터: 전체 · 인증 후기만 · 업종 (후기의 '업체명 · 업종'에서 업종으로 거름)
const FILTERS: { label: string; test: (r: Review) => boolean }[] = [
  { label: '전체', test: () => true },
  { label: '인증 후기만', test: (r) => r.verified },
  { label: '스드메', test: (r) => /스튜디오|드레스|메이크업/.test(r.vendor) },
  { label: '플래너', test: (r) => r.vendor.includes('플래너') },
  { label: '스냅', test: (r) => r.vendor.includes('스냅') },
  { label: '헤어변형', test: (r) => r.vendor.includes('헤어변형') },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState(FILTERS[0].label);
  const list = getReviews().filter(FILTERS.find((f) => f.label === filter)!.test);

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <PageHead title="인증 실후기" desc="견적서 · 결제 내역으로 실제 계약이 확인된 후기만 인증 배지가 붙어요.">
          <Button to={PATHS.reviewWrite} className={styles.write}><PenLine />후기 쓰기</Button>
        </PageHead>
        <ChipGroup label="후기 필터" scroll className={styles.filters}>
          {FILTERS.map((f) => <Chip key={f.label} active={filter === f.label} onClick={() => setFilter(f.label)}>{f.label}</Chip>)}
        </ChipGroup>
        <div className={styles.list}>
          {list.length ? list.map((r) => <ReviewCard key={r.id} review={r} />) : <p className={styles.empty}>해당하는 후기가 아직 없어요.</p>}
        </div>
      </div>
    </div>
  );
}
