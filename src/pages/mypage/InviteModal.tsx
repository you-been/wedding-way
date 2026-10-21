import { Link } from 'react-router';
import { Bookmark, Copy, ListChecks, MessageCircle, Unlink, Wallet } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { PATHS } from '../../routes';
import { INVITE_CODE, useCoupleStore } from '../../stores/coupleStore';
import { toast } from '../../stores/toastStore';
import styles from './Invite.module.css';

export const invitePath = (from: string) => `${PATHS.invite}?code=${INVITE_CODE}&from=${encodeURIComponent(from)}`;

export function InvitePerks() {
  return (
    <ul className={styles.perks}>
      <li><span><ListChecks /></span><b>타임라인 함께 체크</b><small>한 명이 완료하면 둘 다 반영돼요</small></li>
      <li><span><Wallet /></span><b>예산 함께 관리</b><small>항목별 금액을 같이 정해요</small></li>
      <li><span><Bookmark /></span><b>찜한 업체 공유</b><small>서로 찜한 업체를 한곳에서 봐요</small></li>
    </ul>
  );
}

/** 짝꿍 초대 · 연동 관리 */
export default function InviteModal({ me, onClose }: { me: string; onClose: () => void }) {
  const { couple, unlink } = useCoupleStore();
  const url = `${location.origin}${invitePath(me)}`;

  const copy = () => {
    const done = () => toast('초대 링크를 복사했어요');
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => toast('링크를 길게 눌러 복사해 주세요'));
    else toast('링크를 길게 눌러 복사해 주세요');
  };

  return (
    <Modal open onClose={onClose} title={couple ? '짝꿍과 연동 중' : '짝꿍 초대하기'} width={480}>
      {couple ? (
        <>
          <div className={styles.linked}>
            <span className={`${styles.avatars} ${styles.lg}`}><i>{couple.a[0]}</i><i className={styles.b}>{couple.b[0]}</i></span>
            <b>{couple.a} ♥ {couple.b}</b>
            <small>{couple.since.replaceAll('-', '.')}부터 내 웨딩을 함께 관리하고 있어요</small>
          </div>
          <InvitePerks />
          <button type="button" className={styles.unlink} onClick={() => { unlink(); onClose(); toast(`${couple.b === me ? couple.a : couple.b} 님과의 연동을 해제했어요`); }}>
            <Unlink />연동 해제
          </button>
        </>
      ) : (
        <>
          <p className={styles.lead}>초대 링크를 받은 짝꿍이 수락하면, 내 웨딩을 함께 보고 고칠 수 있어요.</p>
          <InvitePerks />
          <button type="button" className={styles.kakao} onClick={() => toast('카카오톡 공유 창이 열려요. 짝꿍을 골라 초대 링크를 보내세요 (프로토타입)')}>
            <MessageCircle />카카오톡으로 초대하기
          </button>
          <div className={styles.linkRow}>
            <input type="text" readOnly value={url} aria-label="초대 링크" onFocus={(e) => e.target.select()} />
            <button type="button" className={styles.copy} onClick={copy}><Copy />복사</button>
          </div>
          <p className={styles.note}>링크는 7일 동안 유효해요. 한 명만 연동할 수 있어요.</p>
          <Link className={styles.demo} to={invitePath(me)} onClick={onClose}>프로토타입: 짝꿍이 받는 초대 화면 보기 →</Link>
        </>
      )}
    </Modal>
  );
}
