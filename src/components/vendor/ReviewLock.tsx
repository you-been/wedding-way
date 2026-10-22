import { Lock, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router';
import type { Review } from '../../data/reviews';
import { PATHS } from '../../routes';
import Button from '../ui/Button';
import ReviewCard from './ReviewCard';
import styles from './ReviewLock.module.css';

// 비로그인용 자리 표시 후기: 실제 후기는 그리지 않음 → 개발자 도구로 블러 · 안내를 지워도 내용이 보이지 않음
const MASK = '○○○ ○○ ○○○○ ○○○ ○○ ○○○○○ ○○○ ○○ ○○○○ ○○○ ○○○ ○○○○ ○○ ○○○ ○○○○ ○○ ○○○○○ ○○○ ○○○○.';
const MASKED: Review[] = [5, 4, 5].map((stars, i) => ({
  id: -1 - i, who: '○○○', when: '○○○○.○○ 본식', vendor: '○○○ ○○ · ○○○', stars,
  verified: i !== 2, price: '○○만 원', extra: '○○○ ○○', photos: [], text: MASK,
}));

/** 실후기 잠금: 흐린 자리 표시 카드 위에 로그인 안내 */
export default function ReviewLock() {
  const { pathname, search } = useLocation();
  return (
    <div className={styles.lock}>
      <div className={styles.masked} aria-hidden="true" inert>
        {MASKED.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
      <div className={styles.card}>
        <span className={styles.icon}><Lock aria-hidden="true" /></span>
        <h2>로그인하면 실후기를 볼 수 있어요</h2>
        <p>로그인 후 업체 실후기를 확인해보세요!</p>
        <Button to={`${PATHS.login}?next=${encodeURIComponent(pathname + search)}`}>로그인하고 후기 보기</Button>
      </div>
    </div>
  );
}

/** 후기가 하나도 없을 때: 가릴 내용이 없으니 로그인 안내 · 블러 없이 빈 상태만 */
export function ReviewEmpty() {
  return (
    <div className={styles.empty}>
      <MessageSquare aria-hidden="true" />
      <b>아직 인증 후기가 없어요</b>
      <p>계약이 확인된 후기가 올라오면 여기에 보여드려요.</p>
    </div>
  );
}
