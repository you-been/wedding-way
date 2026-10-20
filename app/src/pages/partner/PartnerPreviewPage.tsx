import { Link } from 'react-router';
import { ChevronLeft, Eye } from 'lucide-react';
import { profileToVendor } from '../../data/biz';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useBizStore } from '../../stores/bizStore';
import VendorPage from '../vendor/VendorPage';
import styles from './PartnerPreviewPage.module.css';

/** 내 업체 미리보기: 저장된 업체 정보로 예비부부가 보는 업체 상세를 그대로 보여줌 */
export default function PartnerPreviewPage() {
  const profile = useBizStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const name = user?.type === 'biz' ? user.bizName : '필름하루 스냅';
  return (
    <>
      <div className={styles.bar}>
        <div className={`wrap ${styles.inner}`}>
          <span><Eye />예비부부에게 보이는 화면이에요 (저장된 정보 기준)</span>
          <Link to={PATHS.partnerDash}><ChevronLeft />내 업체로 돌아가기</Link>
        </div>
      </div>
      <VendorPage vendor={profileToVendor(profile, name)} />
    </>
  );
}
