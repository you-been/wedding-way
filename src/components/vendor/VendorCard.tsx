import { Link } from 'react-router';
import { BadgeCheck, Bookmark, Star } from 'lucide-react';
import { categoryIcon } from '../../data/categories';
import { imageUrl, type Vendor } from '../../data/vendors';
import { vendorPath } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { toast } from '../../stores/toastStore';
import { useMemberAction } from '../../hooks/useMemberAction';
import PriceLine from './PriceLine';
import styles from './VendorCard.module.css';

interface Props {
  vendor: Vendor;
  height?: number; // 사진 높이 (디렉토리 메이슨리는 업체마다 다름)
  reasons?: string[]; // 추천 이유 (진단 리포트)
}

/** DESIGN.md vendor-card: 사진 + 아래 정보, 테두리 · 그림자 없음. 사진 없는 업체는 회색 면 + 카테고리 아이콘 */
export default function VendorCard({ vendor: v, height = 180, reasons }: Props) {
  const saved = useFavoriteStore((s) => s.ids.includes(v.id));
  const toggle = useFavoriteStore((s) => s.toggle);
  const member = useMemberAction('user');
  const isBiz = useAuthStore((s) => s.user?.type === 'biz'); // 찜은 예비부부만
  const Icon = categoryIcon(v.cat);
  const src = imageUrl(v.photo);

  const onLike = () => member(() => toast(toggle(v.id) ? '찜 목록에 담았어요' : '찜을 해제했어요'));

  return (
    <article className={styles.card}>
      <Link to={vendorPath(v.id)} className={styles.link}>
        <div className={styles.thumb} style={{ height }}>
          {src ? <img src={src} alt={`${v.name} · ${v.cat}`} loading="lazy" /> : <span className={styles.empty} aria-hidden="true"><Icon /></span>}
        </div>
        <div className={styles.body}>
          <span className={styles.tag}>{v.cat}</span>
          <h4>{v.name}</h4>
          <div className={styles.meta}>{v.region} · {v.type}</div>
          <PriceLine price={v.price} cat={v.cat} />
          {reasons && reasons.length > 0 && <div className={styles.why}>{reasons.map((r) => <span key={r}>{r}</span>)}</div>}
          <div className={styles.foot}>
            {v.reviews > 0 ? (
              <>
                <span className={styles.rating}><Star />{v.rating}</span>
                <span>후기 {v.reviews}</span>
                <span className={styles.verified}><BadgeCheck />인증 {v.verified}</span>
              </>
            ) : <span>아직 후기 없음</span>}
          </div>
        </div>
      </Link>
      {!isBiz && <button className={`${styles.like} ${saved ? styles.on : ''}`} onClick={onLike} aria-pressed={saved} aria-label={`${v.name} 찜하기`}>
        <Bookmark />
      </button>}
    </article>
  );
}
