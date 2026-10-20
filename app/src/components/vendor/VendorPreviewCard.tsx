import { AtSign } from 'lucide-react';
import { categoryIcon } from '../../data/categories';
import { imageUrl } from '../../data/vendors';
import PriceLine from './PriceLine';
import styles from './VendorCard.module.css';

interface Props {
  photo?: string;
  cat: string;
  name: string;
  meta?: string;
  price: string | null;
  moods: string[];
  insta?: string;
  height?: number;
}

/** 업체가 입력 중인 정보로 그린 카드 미리보기 (링크 · 찜 없음) */
export default function VendorPreviewCard({ photo, cat, name, meta, price, moods, insta, height = 200 }: Props) {
  const Icon = categoryIcon(cat);
  const src = imageUrl(photo);
  return (
    <div className={styles.card}>
      <div className={styles.thumb} style={{ height }}>
        {src ? <img src={src} alt="" /> : <span className={styles.empty} aria-hidden="true"><Icon /></span>}
      </div>
      <div className={styles.body}>
        <span className={styles.tag}>{cat || '업종'}</span>
        <h4>{name || '업체명'}</h4>
        {meta && <div className={styles.meta}>{meta}</div>}
        <PriceLine price={price} cat={cat} />
        {moods.length > 0 && <div className={styles.why}>{moods.map((m) => <span key={m}>{m}</span>)}</div>}
        {insta && <div className={`${styles.foot} ${styles.verified}`}><span><AtSign />{insta}</span></div>}
      </div>
    </div>
  );
}
