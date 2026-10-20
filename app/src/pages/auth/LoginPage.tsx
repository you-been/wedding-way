import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Heart, Store } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import Panel from '../../components/ui/Panel';
import Tabs from '../../components/ui/Tabs';
import TextField from '../../components/ui/TextField';
import { useFinishLogin } from '../../hooks/useFinishLogin';
import { PATHS } from '../../routes';
import { authLabel, useAuthStore } from '../../stores/authStore';
import { toast } from '../../stores/toastStore';
import type { AccountType } from '../../types';
import { DEMO_BIZ, DEMO_USER, SNS, type SnsProvider } from './snsProfiles';
import styles from './auth.module.css';

const COPY: Record<AccountType, { title: string; desc: string }> = {
  user: { title: '로그인하고 나만의 웨딩 계획을 짜보세요!', desc: '타임라인 · 예산 · 찜한 업체를 내 웨딩에 모아둘 수 있어요.' },
  biz: { title: '업체회원으로 로그인하고 우리 업체를 알려보세요!', desc: '업체 소개를 만들고 문의 · 일정을 한곳에서 관리해요.' },
};

/** 로그인: 예비부부(SNS) · 웨딩 업체(이메일) */
export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const finish = useFinishLogin();
  const next = params.get('next');
  const [type, setType] = useState<AccountType>(params.get('type') === 'biz' ? 'biz' : 'user');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const copy = next ? COPY[type] : { title: '결심에 오신 걸 환영해요', desc: '로그인하고 우리만의 웨딩 계획을 이어가세요.' };
  const nextQuery = next ? `&next=${encodeURIComponent(next)}` : '';

  const bizLogin = () => {
    if (!email.trim() || !pw) { setError('이메일과 비밀번호를 입력해 주세요.'); return; }
    // 프로토타입: 어떤 계정이든 예시 업체로 로그인
    finish({ ...DEMO_BIZ, email: email.trim() }, `${DEMO_BIZ.bizName}으로 로그인했어요`, PATHS.partnerDash);
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.head}>
          <Logo asText className={styles.logo} />
          <h1>{copy.title}</h1>
          <p>{copy.desc}</p>
        </div>

        {user && (
          <p className={styles.current}>
            {next && user.type !== type
              ? <>지금은 {user.type === 'biz' ? '업체 계정' : '예비부부 계정'}(<b>{authLabel(user)}</b>)으로 로그인되어 있어요. 이 기능은 {type === 'biz' ? '업체회원' : '예비부부 회원'}만 이용할 수 있어요.</>
              : <>지금 {user.type === 'biz' ? '업체 계정' : '예비부부 계정'}(<b>{authLabel(user)}</b>)으로 로그인되어 있어요. 다른 계정으로 로그인하면 전환돼요.</>}
          </p>
        )}

        <Tabs label="계정 유형" stretch value={type} onChange={(t) => { setType(t); setError(''); }} items={[
          { value: 'user', label: <><Heart />예비부부</> },
          { value: 'biz', label: <><Store />웨딩 업체</> },
        ]} />

        {type === 'user' ? (
          <Panel className={styles.panel}>
            <p className={styles.lead}>SNS 계정으로 3초 만에 시작하세요</p>
            <div className={styles.sns}>
              {(Object.keys(SNS) as SnsProvider[]).map((p) => (
                <button key={p} type="button" className={`${styles.snsBtn} ${styles[p]}`} onClick={() => navigate(`${PATHS.signup}?provider=${p}${nextQuery}`)}>
                  <b>{SNS[p].mark}</b>{SNS[p].name}로 시작하기
                </button>
              ))}
            </div>
            <p className={styles.note}>처음이면 간단한 추가 정보 입력 후 가입이 완료돼요.</p>
            <button type="button" className={styles.demo} onClick={() => finish(DEMO_USER, `${DEMO_USER.nick} 님, 다시 만나 반가워요`, PATHS.mypage)}>
              프로토타입: 가입된 회원(민지)으로 바로 로그인 →
            </button>
          </Panel>
        ) : (
          <Panel className={styles.panel}>
            <p className={styles.lead}>업체회원은 이메일로 로그인해요</p>
            <TextField label="이메일 (아이디)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@filmharu.kr" autoComplete="username" />
            <TextField label="비밀번호" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호" autoComplete="current-password" onKeyDown={(e) => e.key === 'Enter' && bizLogin()} />
            {error && <p className={styles.error} role="alert">{error}</p>}
            <Button block className={styles.submit} onClick={bizLogin}>로그인</Button>
            <div className={styles.links}>
              <button type="button" onClick={() => toast('비밀번호 재설정 메일을 보냈어요 (프로토타입)')}>비밀번호 찾기</button>
              <Link to={`${PATHS.signupBiz}${next ? `?next=${encodeURIComponent(next)}` : ''}`}>업체 회원가입</Link>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
