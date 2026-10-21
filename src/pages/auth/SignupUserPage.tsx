import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Panel from '../../components/ui/Panel';
import Terms, { requiredOk, type TermItem } from '../../components/ui/Terms';
import TextField, { FieldGroup } from '../../components/ui/TextField';
import { useFinishLogin } from '../../hooks/useFinishLogin';
import { PATHS } from '../../routes';
import { FIELD_LABELS, PHONE_RE, SNS, type SnsProvider } from './snsProfiles';
import styles from './auth.module.css';

const TERMS: TermItem[] = [
  { label: '만 14세 이상이에요', required: true },
  { label: '이용약관 동의', required: true },
  { label: '개인정보 수집 · 이용 동의', required: true },
  { label: '혜택 · 이벤트 알림 받기', required: false },
];

/** 예비부부 가입: SNS에서 받아온 정보는 미리 채우고, 나머지만 입력 */
export default function SignupUserPage() {
  const [params] = useSearchParams();
  const provider = (params.get('provider') as SnsProvider) in SNS ? (params.get('provider') as SnsProvider) : 'kakao';
  const sns = SNS[provider];
  const got = sns.profile;
  const finish = useFinishLogin();

  const [name, setName] = useState(got.name ?? '');
  const [nick, setNick] = useState(got.nick ?? '');
  const [gender, setGender] = useState<'F' | 'M' | undefined>(got.gender);
  const [birth, setBirth] = useState(got.birth ?? '');
  const [phone, setPhone] = useState(got.phone ?? '');
  const [terms, setTerms] = useState(TERMS.map(() => false));
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError('이름을 입력해 주세요.');
    if (nick.trim().length < 2) return setError('닉네임을 2자 이상 입력해 주세요.');
    if (!PHONE_RE.test(phone.trim())) return setError('연락처를 010-0000-0000 형식으로 입력해 주세요.');
    if (!requiredOk(TERMS, terms)) return setError('필수 약관에 동의해 주세요.');
    setError('');
    finish({ type: 'user', name: name.trim(), nick: nick.trim(), phone: phone.trim(), gender, birth: birth || undefined }, `가입을 환영해요, ${nick.trim()} 님!`, PATHS.mypage);
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <Link to={PATHS.login} className={styles.back}><ChevronLeft />로그인</Link>
        <div className={`${styles.head} ${styles.headLeft}`}>
          <span className={styles.kicker}>{sns.name}로 가입 중</span>
          <h1>조금만 더 알려주세요</h1>
          <p>맞춤 타임라인과 업체 추천에 쓰여요.</p>
        </div>

        <Panel className={styles.panel}>
          <p className={styles.fetched}>
            {sns.name}에서 <b>{Object.keys(got).map((k) => FIELD_LABELS[k]).join(' · ')}</b>을(를) 받아왔어요. 확인 후 수정할 수 있어요.
            {provider === 'kakao' && <><br /><small>카카오는 이름 · 연락처를 받으려면 비즈앱 검수가 필요해 직접 입력받아요.</small></>}
          </p>
          <TextField label="이름" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="실명" />
          <TextField label="닉네임" note="후기 · 커뮤니티에 표시돼요" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={12} placeholder="2~12자" />
          <FieldGroup label="성별" note="선택">
            <ChipGroup label="성별">
              <Chip active={gender === 'F'} onClick={() => setGender(gender === 'F' ? undefined : 'F')}>여성</Chip>
              <Chip active={gender === 'M'} onClick={() => setGender(gender === 'M' ? undefined : 'M')}>남성</Chip>
            </ChipGroup>
          </FieldGroup>
          <TextField label="생일" note="선택" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
          <TextField label="연락처" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
        </Panel>

        <Panel className={styles.panel}><Terms items={TERMS} checked={terms} onChange={setTerms} /></Panel>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Button block className={styles.submit} onClick={submit}>가입 완료</Button>
      </div>
    </div>
  );
}
