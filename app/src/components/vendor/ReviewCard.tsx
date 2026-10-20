import { BadgeCheck, Star } from 'lucide-react';
import type { Review } from '../../data/reviews';
import { imageUrl } from '../../data/vendors';
import Tag from '../ui/Tag';
import styles from './ReviewCard.module.css';

/** 후기 카드: 계약 인증 배지 · 별점 · 계약금액 · 추가금 · 사진 */
export default function ReviewCard({ review: r }: { review: Review }) {
  return (
    <article className={styles.review}>
      <div className={styles.top}>
        <span className={styles.avatar}>{r.who[0]}</span>
        <span className={styles.who}>{r.who}<small>{r.when} · {r.vendor}</small></span>
        {r.verified
          ? <span className={styles.verified}><BadgeCheck />계약 인증</span>
          : <span className={styles.normal}>일반 후기</span>}
      </div>
      <span className={styles.stars} aria-label={`별점 ${r.stars}점`}>
        {Array.from({ length: 5 }, (_, i) => <Star key={i} className={i < r.stars ? styles.on : undefined} aria-hidden="true" />)}
      </span>
      <p>{r.text}</p>
      {r.verified && (
        <div className={styles.facts}>
          <Tag>계약금액 {r.price}</Tag>
          <Tag tone={r.extra === '추가금 없음' ? 'ink' : 'soft'}>{r.extra}</Tag>
        </div>
      )}
      {r.photos.length > 0 && (
        <div className={styles.photos}>
          {r.photos.map((p) => <img key={p} src={imageUrl(p)!} alt={`${r.vendor} 후기 사진`} loading="lazy" />)}
        </div>
      )}
    </article>
  );
}
