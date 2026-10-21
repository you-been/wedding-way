import { useState } from 'react';
import { Link } from 'react-router';
import { Check, ChevronLeft, Info, Search, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Panel from '../../components/ui/Panel';
import Terms, { requiredOk, type TermItem } from '../../components/ui/Terms';
import TextField, { FieldGroup, inputClass } from '../../components/ui/TextField';
import { useFinishLogin } from '../../hooks/useFinishLogin';
import { PATHS } from '../../routes';
import { toast } from '../../stores/toastStore';
import type { ProofKind } from '../../types';
import { EMAIL_RE, PHONE_RE } from './snsProfiles';
import styles from './auth.module.css';

const TERMS: TermItem[] = [
  { label: '업체회원 이용약관 동의', required: true },
  { label: '개인정보 수집 · 이용 동의', required: true },
  { label: '업체 운영 소식 받기', required: false },
];
const PROOF_LABEL: Record<ProofKind, string> = { biz: '사업자 등록증', free: '신분증 + 포트폴리오' };

/** 업체 가입: 이메일 계정 + 업체 정보. 증빙 서류는 선택(디렉토리 공개 전에만 필요) */
export default function SignupBizPage() {
  const finish = useFinishLogin();
  const [form, setForm] = useState({ email: '', pw: '', pw2: '', name: '', phone: '', addr: '', addr2: '' });
  const [kind, setKind] = useState<ProofKind>('biz');
  const [uploaded, setUploaded] = useState<ProofKind | null>(null);
  const [terms, setTerms] = useState(TERMS.map(() => false));
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = () => {
    if (!EMAIL_RE.test(form.email.trim())) return setError('이메일을 정확히 입력해 주세요.');
    if (form.pw.length < 8) return setError('비밀번호를 8자 이상 입력해 주세요.');
    if (form.pw !== form.pw2) return setError('비밀번호가 서로 달라요.');
    if (!form.name.trim()) return setError('업체명을 입력해 주세요.');
    if (!PHONE_RE.test(form.phone.trim())) return setError('연락처를 정확히 입력해 주세요.');
    if (!form.addr) return setError('주소를 검색해 주세요.');
    if (!requiredOk(TERMS, terms)) return setError('필수 약관에 동의해 주세요.');
    setError('');
    finish(
      { type: 'biz', email: form.email.trim(), bizName: form.name.trim(), phone: form.phone.trim(), address: `${form.addr} ${form.addr2.trim()}`.trim(), proof: uploaded },
      uploaded ? '가입 완료! 업체 소개를 만들어 볼까요?' : '가입 완료! 증빙 서류는 내 업체에서 올릴 수 있어요',
      PATHS.partnerJoin,
    );
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <Link to={`${PATHS.login}?type=biz`} className={styles.back}><ChevronLeft />로그인</Link>
        <div className={`${styles.head} ${styles.headLeft}`}>
          <span className={styles.kicker}>업체 회원</span>
          <h1>업체 회원가입</h1>
          <p>가입 후 바로 업체 소개를 만들 수 있어요.</p>
        </div>

        <Panel className={styles.panel} title="계정 정보">
          <TextField label="이메일 (아이디)" type="email" value={form.email} onChange={set('email')} placeholder="hello@filmharu.kr" autoComplete="username" />
          <TextField label="비밀번호" note="8자 이상" type="password" value={form.pw} onChange={set('pw')} autoComplete="new-password" />
          <TextField label="비밀번호 확인" type="password" value={form.pw2} onChange={set('pw2')} autoComplete="new-password" />
        </Panel>

        <Panel className={styles.panel} title="업체 정보">
          <TextField label="업체명 / 활동명" value={form.name} onChange={set('name')} maxLength={30} placeholder="예: 필름하루 스냅" />
          <TextField label="연락처" type="tel" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000 또는 02-000-0000" />
          <FieldGroup label="주소">
            <div className={styles.addrRow}>
              <input className={inputClass} value={form.addr} placeholder="주소 검색을 눌러주세요" readOnly aria-label="주소" />
              <Button variant="outline" className={styles.addrBtn} onClick={() => { setForm({ ...form, addr: '서울 마포구 양화로 45' }); toast('주소 검색 창이 열려요 (프로토타입) · 예시 주소를 넣었어요'); }}><Search />주소 검색</Button>
            </div>
            <input className={`${inputClass} ${styles.addrDetail}`} value={form.addr2} onChange={set('addr2')} placeholder="상세 주소 (선택)" aria-label="상세 주소" />
          </FieldGroup>
        </Panel>

        <Panel className={styles.panel} title={<>증빙 서류 <small className={styles.small}>선택</small></>}>
          <div className={styles.notice}><Info /><span>가입은 증빙 없이도 할 수 있어요. 하지만 <b>디렉토리에 우리 업체를 소개하려면 증빙 서류가 필요해요.</b> 지금 올리지 않아도 가입 후 내 업체에서 올릴 수 있어요.</span></div>
          <div className={styles.proofs} role="radiogroup" aria-label="증빙 종류">
            {(['biz', 'free'] as ProofKind[]).map((k) => (
              <button key={k} type="button" role="radio" aria-checked={kind === k} className={`${styles.proof} ${kind === k ? styles.proofOn : ''}`} onClick={() => setKind(k)}>
                <b>{k === 'biz' ? '사업자 등록증' : '프리랜서 증빙'}</b><small>{k === 'biz' ? '사업자등록을 한 업체' : '신분증 + 활동 포트폴리오'}</small>
              </button>
            ))}
          </div>
          {kind === 'free' && <TextField label="포트폴리오 링크" type="url" placeholder="인스타그램 · 블로그 · 웹사이트 주소" />}
          <button type="button" className={`${styles.upload} ${uploaded === kind ? styles.uploadDone : ''}`} onClick={() => { setUploaded(kind); toast(`${PROOF_LABEL[kind]}을(를) 올렸어요 (프로토타입)`); }}>
            {uploaded === kind ? <><Check />{PROOF_LABEL[kind]} 업로드됨 · 다시 올리기</> : <><Upload />{kind === 'free' ? '신분증' : '사업자 등록증'} 업로드 (JPG, PNG, PDF)</>}
          </button>
          <p className={styles.note}>제출한 서류는 확인 용도로만 쓰이고 다른 사용자에게 공개되지 않아요.</p>
        </Panel>

        <Panel className={styles.panel}><Terms items={TERMS} checked={terms} onChange={setTerms} /></Panel>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Button block className={styles.submit} onClick={submit}>가입하고 업체 소개 만들기</Button>
      </div>
    </div>
  );
}
