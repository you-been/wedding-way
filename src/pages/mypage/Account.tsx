import { useState } from 'react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Panel from '../../components/ui/Panel';
import TextField, { FieldGroup } from '../../components/ui/TextField';
import { useSignOut } from '../../hooks/useSignOut';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../stores/toastStore';
import { withdraw } from '../../stores/withdraw';
import type { ConsumerUser } from '../../types';
import { PHONE_RE } from '../auth/snsProfiles';
import styles from './MyPage.module.css';

/** 내 웨딩 > 계정: 가입할 때 입력한 기본 정보를 고치고 저장 */
export default function Account({ user }: { user: ConsumerUser }) {
  const update = useAuthStore((s) => s.update);
  const logout = useAuthStore((s) => s.logout);
  const signOut = useSignOut();
  const [name, setName] = useState(user.name ?? '');
  const [nick, setNick] = useState(user.nick);
  const [gender, setGender] = useState(user.gender);
  const [birth, setBirth] = useState(user.birth ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [error, setError] = useState('');

  const changed = name !== (user.name ?? '') || nick !== user.nick || gender !== user.gender
    || birth !== (user.birth ?? '') || phone !== (user.phone ?? '');

  const save = () => {
    if (!name.trim()) return setError('이름을 입력해 주세요.');
    if (nick.trim().length < 2) return setError('닉네임을 2자 이상 입력해 주세요.');
    if (!PHONE_RE.test(phone.trim())) return setError('연락처를 010-0000-0000 형식으로 입력해 주세요.');
    setError('');
    update({ name: name.trim(), nick: nick.trim(), gender, birth: birth || undefined, phone: phone.trim() });
    toast('기본 정보를 저장했어요');
  };

  const onWithdraw = () => {
    if (!confirm('정말 탈퇴할까요?\n찜한 업체 · 타임라인 · 예산 · 짝꿍 연결이 모두 지워지고 되돌릴 수 없어요.')) return;
    signOut(() => withdraw('user'), '탈퇴했어요. 그동안 함께해 주셔서 고마워요');
  };

  return (
    <div className={styles.panelIn}>
      <Panel title="기본 정보" className={styles.accPanel}>
        <p className={styles.accNote}>예비부부 프로필에 쓰이는 정보예요. 닉네임은 후기에 표시돼요.</p>
        <div className={styles.accGrid}>
          <TextField label="이름" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="실명" />
          <TextField label="닉네임" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={12} placeholder="2~12자" />
          <FieldGroup label="성별" note="선택">
            <ChipGroup label="성별">
              <Chip active={gender === 'F'} onClick={() => setGender(gender === 'F' ? undefined : 'F')}>여성</Chip>
              <Chip active={gender === 'M'} onClick={() => setGender(gender === 'M' ? undefined : 'M')}>남성</Chip>
            </ChipGroup>
          </FieldGroup>
          <TextField label="생일" note="선택" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
          <TextField label="연락처" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
        </div>
        {error && <p className={styles.accError} role="alert">{error}</p>}
        <div className={styles.accSave}>
          <Button disabled={!changed} onClick={save}>저장하기</Button>
        </div>
      </Panel>
      <div className={styles.accActions}>
        <Button size="sm" variant="ghost" onClick={() => signOut(logout, '로그아웃했어요')}>로그아웃</Button>
        <button type="button" className={styles.withdraw} onClick={onWithdraw}>회원 탈퇴</button>
      </div>
    </div>
  );
}
