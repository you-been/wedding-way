import { Link } from 'react-router';
import { Lock } from 'lucide-react';
import { PATHS, SCREENS, vendorPath } from '../routes';
import styles from './FlowMapPage.module.css';

// 프로토타입 안내: 화면 구성과 사용자 흐름 (각 칸을 누르면 그 화면으로 이동)
type Node = { label: string; desc?: string; to?: string; tone?: 'hl' | 'biz' | 'ghost' };
type Flow = { title: string; rows: Node[][]; sep?: string };

const FLOWS: Flow[] = [
  {
    title: '첫 방문 갈림길',
    sep: '/',
    rows: [[
      { label: '첫 방문 갈림길', desc: '처음 한 번만 보여요', to: PATHS.welcome, tone: 'hl' },
      { label: '예비부부', desc: '새내기 가이드로', to: PATHS.guide },
      { label: '웨딩 업체', desc: '업체 모드 · 우리 업체 알리기', to: PATHS.partner, tone: 'biz' },
      { label: '둘러보기', desc: '홈', to: PATHS.home, tone: 'ghost' },
    ]],
  },
  {
    title: '예비부부 메인 흐름',
    rows: [[
      { label: '새내기 가이드', desc: '큰 그림 · 첫 할 일 · 준비 방식', to: PATHS.guide },
      { label: '취향 진단', desc: '준비 방식 · 예식 정보 · 예산 · 무드', to: PATHS.onboarding },
      { label: '예산 진단', desc: '기본 항목 · 위시리스트 · 중요도', to: PATHS.budget, tone: 'hl' },
      { label: '진단 리포트', desc: '구성 · 평균가 비교 · 공유', to: PATHS.budgetResult, tone: 'hl' },
      { label: '업체 디렉토리', desc: '카테고리 · 가격대 · 지역', to: PATHS.directory },
      { label: '업체 상세', desc: '사진 · 가격 · 후기 · 일정', to: vendorPath(1) },
      { label: '내 웨딩', desc: '타임라인 · 예산 · 찜', to: PATHS.mypage },
    ]],
  },
  {
    title: '내 웨딩 · 짝꿍과 함께',
    rows: [[
      { label: '내 웨딩', desc: '타임라인 · 캘린더 / 예산 · 찜', to: PATHS.mypage },
      { label: '짝꿍 초대', desc: '카카오톡 · 링크 복사', to: PATHS.mypage },
      { label: '초대 받기', desc: '짝꿍이 링크로 들어와 수락', to: PATHS.invite, tone: 'hl' },
      { label: '함께 관리', desc: 'A ♥ B 님의 웨딩', to: PATHS.mypage },
    ]],
  },
  {
    title: '후기',
    rows: [[
      { label: '업체 상세', to: vendorPath(1) },
      { label: '인증 실후기', desc: '계약 인증 배지', to: PATHS.reviews },
      { label: '후기 작성', desc: '별점 · 증빙 업로드', to: PATHS.reviewWrite },
    ]],
  },
  {
    title: '웨딩 업체',
    rows: [[
      { label: '결심 Biz 전환', desc: '헤더 스위치 · 내 웨딩 → 내 업체', tone: 'ghost' },
      { label: '우리 업체 알리기', desc: '필수 4가지 · 진행 순서 · 요금', to: PATHS.partner, tone: 'biz' },
      { label: '업체 회원가입', desc: '이메일 · 증빙 서류(선택)', to: PATHS.signupBiz, tone: 'biz' },
      { label: '업체 소개 만들기', desc: '필수 정보 → 골라서 추가', to: PATHS.partnerJoin, tone: 'biz' },
      { label: '내 업체', desc: '대시보드 · 업체 정보 · 문의 · 일정 · 계정', to: PATHS.partnerDash, tone: 'biz' },
    ]],
  },
  {
    title: '회원가입 · 로그인',
    rows: [
      [
        { label: '비회원', desc: '예산 진단 · 디렉토리 · 실후기', tone: 'ghost' },
        { label: '로그인', desc: '내 웨딩 · 찜 · 문의 · 후기 쓰기 시', to: PATHS.login, tone: 'hl' },
        { label: 'SNS 가입 · 추가 정보', desc: '카카오 · 네이버 · 구글', to: PATHS.signup },
        { label: '내 웨딩', to: PATHS.mypage },
      ],
      [
        { label: '업체 로그인', desc: '내 업체 · 소개 만들기 시', to: `${PATHS.login}?type=biz`, tone: 'biz' },
        { label: '업체 회원가입', to: PATHS.signupBiz, tone: 'biz' },
        { label: '내 업체', to: PATHS.partnerDash, tone: 'biz' },
      ],
    ],
  },
];

function FlowNode({ n }: { n: Node }) {
  const cls = `${styles.node} ${n.tone ? styles[n.tone] : ''}`;
  const body = <><b>{n.label}</b>{n.desc && <small>{n.desc}</small>}</>;
  return n.to ? <Link to={n.to} className={cls}>{body}</Link> : <span className={cls}>{body}</span>;
}

export default function FlowMapPage() {
  return (
    <div className="page">
      <div className="wrap">
        <div className={styles.head}>
          <h1>화면 구성 · 사용자 흐름</h1>
          <p>프로토타입 안내용 화면이에요. 칸을 누르면 그 화면으로 이동해요. 공통 컴포넌트는 <Link to={PATHS.uiKit}>UI 모음</Link>에서 볼 수 있어요.</p>
        </div>

        {FLOWS.map((f, i) => (
          <section key={f.title} className={styles.flowSec}>
            <h2><span>{i + 1}</span>{f.title}</h2>
            {f.rows.map((row, r) => (
              <div key={r} className={styles.flow}>
                {row.map((n, k) => (
                  <span key={n.label + k} className={styles.step}>
                    {k > 0 && <span className={styles.arrow} aria-hidden="true">{f.sep ?? '→'}</span>}
                    <FlowNode n={n} />
                  </span>
                ))}
              </div>
            ))}
          </section>
        ))}

        <section className={styles.flowSec}>
          <h2><span>{FLOWS.length + 1}</span>전체 화면 목록</h2>
          <ul className={styles.list}>
            {SCREENS.map((s, i) => (
              <li key={s.path}>
                <Link to={s.path === PATHS.vendor ? vendorPath(1) : s.path}>
                  <em className="num">{String(i).padStart(2, '0')}</em>
                  <b>{s.title}</b>
                  <code>{s.path}</code>
                  {s.auth && <span className={styles.auth}><Lock aria-hidden="true" />{s.auth === 'biz' ? '업체 로그인' : '로그인'}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
