import { categoryAvg } from '../../data/categories';
import styles from './PriceLine.module.css';

/** 가격: 공개 업체는 금액, 비공개 업체는 '상담 후 안내' + 카테고리 시장 평균 (DESIGN.md 원칙: 가격을 숨기지 않는다) */
export default function PriceLine({ price, cat }: { price: string | null; cat: string }) {
  if (price) return <div className={styles.price}>{price}</div>;
  const avg = categoryAvg(cat);
  return (
    <>
      <div className={`${styles.price} ${styles.closed}`}>상담 후 안내</div>
      {avg && <div className={styles.avg}>{cat} 평균 {avg}</div>}
    </>
  );
}
