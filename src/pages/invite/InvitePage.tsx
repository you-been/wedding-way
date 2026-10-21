import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Heart, MailOpen, UserRound } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ymd } from '../../data/timeline';
import { InvitePerks } from '../mypage/InviteModal';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { DEMO_PARTNER, useCoupleStore } from '../../stores/coupleStore';
import { toast } from '../../stores/toastStore';
import styles from './InvitePage.module.css';

/** 짝꿍 초대 받기 (초대 링크로 들어오는 화면) */
export default function InvitePage() {
  const [params] = useSearchParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { couple, link } = useCoupleStore();
  const from = (params.get('from') || '민지').slice(0, 12);

  const note = couple ? `이미 ${couple.a} ♥ ${couple.b} 님으로 연동되어 있어요. 수락하면 새로 연동돼요.`
    : user?.type !== 'user' ? '수락하려면 로그인이 필요해요. 카카오로 3초 만에 시작할 수 있어요.'
      : user.nick === from ? `프로토타입: 같은 브라우저라 짝꿍(${DEMO_PARTNER}) 계정으로 수락한 것처럼 처리해요.` : '';

  const accept = () => {
    if (user?.type !== 'user') { navigate(`${PATHS.login}?type=user&next=${encodeURIComponent(pathname + search)}`); return; }
    link({ a: from, b: user.nick === from ? DEMO_PARTNER : user.nick, since: ymd(new Date()) });
    navigate(PATHS.mypage);
    toast(`${from} 님과 내 웨딩이 연동됐어요. 이제 함께 관리해요`);
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.card}>
          <div className={styles.avatars} aria-hidden="true"><i>{from[0]}</i><span className={styles.heart}><Heart /></span><i className={styles.add}><UserRound /></i></div>
          <span className={styles.kicker}><MailOpen />짝꿍 초대</span>
          <h1>{from} 님이 함께 결혼 준비를<br />하자고 초대했어요</h1>
          <p className={styles.desc}>수락하면 <b>{from}</b> 님의 내 웨딩과 연동돼서, 같은 계획을 함께 보고 고칠 수 있어요.</p>
          <InvitePerks />
          <Button block onClick={accept}>초대 수락하고 함께 관리하기</Button>
          <Link to={PATHS.home} className={styles.later}>다음에 할게요</Link>
          {note && <p className={styles.note}>{note}</p>}
        </div>
      </div>
    </div>
  );
}
