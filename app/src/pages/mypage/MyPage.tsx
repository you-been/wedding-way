import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowRight, Calendar, CalendarHeart, GripVertical, Heart, Link as LinkIcon, MapPin, Plus, UserPlus } from 'lucide-react';
import Panel from '../../components/ui/Panel';
import Tabs from '../../components/ui/Tabs';
import Tag, { type TagTone } from '../../components/ui/Tag';
import VendorCard from '../../components/vendor/VendorCard';
import { getVendorsByIds } from '../../data/api';
import { TL_PHASES, ddayText, weddingInfo, weekday } from '../../data/timeline';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { toast } from '../../stores/toastStore';
import { usePhaseTitle, useTimelineStore } from '../../stores/timelineStore';
import InviteModal from './InviteModal';
import ItemDrawer from './ItemDrawer';
import MyCalendar from './MyCalendar';
import Timeline from './Timeline';
import styles from './MyPage.module.css';
import inv from './Invite.module.css';

type Tab = 'timeline' | 'budget';

// 예산 · 찜 탭 (프로토타입 예시 수치)
const CONFIRMED: { name: string; reco: string; amount: string; status: string; tone: TagTone }[] = [
  { name: '예식장', reco: '870만', amount: '920만', status: '+50만', tone: 'brand' },
  { name: '스드메', reco: '1,040만', amount: '-', status: '탐색 중', tone: 'default' },
  { name: '아이폰스냅', reco: '45만', amount: '48만', status: '계약 완료', tone: 'ink' },
  { name: '헤어변형', reco: '50만', amount: '-', status: '미정', tone: 'default' },
];

/** 내 웨딩: 배너(D-day · 진행률 · 짝꿍) + 타임라인 · 캘린더 / 예산 · 찜 */
export default function MyPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('tab') === 'budget' ? 'budget' : 'timeline';
  const user = useAuthStore((s) => s.user);
  const me = user?.type === 'user' ? user.nick : '민지';
  const couple = useCoupleStore((s) => s.couple);
  const favIds = useFavoriteStore((s) => s.ids);
  const { wedding, items, setWedding, update, reset } = useTimelineStore();
  const { days, nowIdx } = weddingInfo(wedding);
  const phaseTitle = usePhaseTitle();
  const [openId, setOpenId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [calView, setCalView] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

  const visible = items.filter((it) => !it.hidden);
  const doneCount = visible.filter((it) => it.done).length;
  const pct = visible.length ? Math.round((doneCount / visible.length) * 100) : 0;
  const hidden = items.filter((it) => it.hidden);
  const openItem = items.find((it) => it.id === openId);

  const onReset = () => {
    if (!confirm('타임라인을 처음 상태로 되돌릴까요?\n순서 · 숨긴 항목 · 직접 추가한 항목 · 날짜 · 메모 · 단계 이름이 모두 초기화돼요.')) return;
    reset();
    setShowHidden(false);
    toast('기본 타임라인으로 되돌렸어요');
  };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        {/* 상단 배너: 왼쪽 정보 · 요약 수치, 오른쪽 D-day 카드 */}
        <div className={styles.head}>
          <div>
            <span className={styles.kicker}><Heart />내 웨딩</span>
            <h1>{couple ? `${couple.a} ♥ ${couple.b} 님의 웨딩` : `${me} 님의 웨딩`}</h1>
            <ul className={styles.meta}>
              <li><CalendarHeart />본식 <b>{wedding.replaceAll('-', '.')} ({weekday(wedding)})</b></li>
              <li><MapPin />더채플 강남</li>
            </ul>
            <div className={styles.couple}>
              {couple ? (
                <>
                  <span className={inv.avatars}><i>{couple.a[0]}</i><i className={inv.b}>{couple.b[0]}</i></span>
                  <span className={styles.coupleText}><b>{couple.a === me ? couple.b : couple.a} 님과 함께 관리 중</b><small><LinkIcon />타임라인 · 예산 · 찜한 업체가 연동돼요</small></span>
                  <button type="button" className={`${styles.coupleBtn} ${styles.ghost}`} onClick={() => setInviteOpen(true)}>연동 관리</button>
                </>
              ) : (
                <>
                  <span className={inv.avatars}><i>{me[0]}</i><i className={inv.add}><Plus /></i></span>
                  <span className={styles.coupleText}><b>짝꿍과 함께 준비해요</b><small>초대하면 계획을 함께 보고 고칠 수 있어요</small></span>
                  <button type="button" className={styles.coupleBtn} onClick={() => setInviteOpen(true)}><UserPlus />짝꿍 초대하기</button>
                </>
              )}
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <small>준비 진행률</small>
                <strong>{pct}%</strong>
                <span className={styles.statBar}><i style={{ width: `${pct}%` }} /></span>
              </div>
              <div className={styles.stat}>
                <small>지금 단계</small>
                <strong>{phaseTitle(nowIdx)}</strong>
                <span className={styles.statNote}>Phase {nowIdx + 1} / {TL_PHASES.length}</span>
              </div>
              <div className={styles.stat}>
                <small>예산 사용</small>
                <strong>1,420만</strong>
                <span className={styles.statNote}>/ 3,000만 원</span>
              </div>
            </div>
          </div>
          <div className={styles.ddayCard}>
            <small>본식까지</small>
            <strong className={styles.dday}>{ddayText(days)}</strong>
            <label className={styles.date}><Calendar /><span>예식일</span><input type="date" value={wedding} onChange={(e) => e.target.value && setWedding(e.target.value)} /></label>
          </div>
        </div>

        <div className={styles.tabs}><Tabs stretch label="내 웨딩" value={tab} onChange={(t) => setParams(t === 'timeline' ? {} : { tab: t }, { replace: true })} items={[
          { value: 'timeline', label: '타임라인 · 캘린더' },
          { value: 'budget', label: '예산 · 찜' },
        ]} /></div>

        {tab === 'timeline' ? (
          <div className={styles.panelIn}>
            <Panel className={styles.calPanel}>
              <MyCalendar items={items} wedding={wedding} view={calView} setView={setCalView} onOpen={setOpenId} />
            </Panel>

            <div className={styles.toolbar}>
              <div className={styles.tlTitle}>
                <h2>내 타임라인</h2>
                {hidden.length > 0 && <button type="button" className={styles.textBtn} aria-expanded={showHidden} onClick={() => setShowHidden(!showHidden)}>숨긴 항목 {hidden.length}개 {showHidden ? '▴' : '▾'}</button>}
              </div>
              <div className={styles.progress}>
                <div className={styles.progressBar}><i style={{ width: `${pct}%` }} /></div>
                <span>{pct}% 완료 ({doneCount}/{visible.length})</span>
              </div>
            </div>
            {showHidden && hidden.length > 0 && (
              <Panel className={styles.hiddenList}>
                {hidden.map((it) => (
                  <div key={it.id} className={styles.hiddenRow}>
                    <span><b>{it.t}</b> <small>Phase {it.phase + 1}</small></span>
                    <button type="button" className={styles.smallBtn} onClick={() => { update(it.id, { hidden: false }); toast('타임라인에 되살렸어요'); }}>되살리기</button>
                  </div>
                ))}
              </Panel>
            )}
            <div className={styles.help}>
              <p><GripVertical />를 끌어서 순서나 단계를 바꾸고, 항목을 누르면 날짜 · 메모를 추가할 수 있어요. 변경 내용은 이 브라우저에 저장돼요.</p>
              <button type="button" className={styles.reset} onClick={onReset}>기본값으로 되돌리기</button>
            </div>
            <Timeline items={items} nowIdx={nowIdx} onOpen={setOpenId} />
          </div>
        ) : (
          <div className={styles.panelIn}>
            <div className={styles.dashGrid}>
              <Panel>
                <small className={styles.muted}>예산 사용 현황</small>
                <div className={styles.money}><b>1,420만</b> / 3,000만 원</div>
                <div className={styles.miniBar}><i style={{ width: '47%' }} /></div>
                <Link to={PATHS.budgetResult} className={styles.more}>진단 리포트 <ArrowRight /></Link>
              </Panel>
              <Panel>
                <small className={styles.muted}>이번 달 할 일</small>
                <ul className={styles.todo}>
                  <li className={styles.done}>웨딩홀 계약</li>
                  <li>준비 방식 결정</li>
                  <li>스드메 업체 서칭</li>
                </ul>
              </Panel>
            </div>
            <Panel title="예산 항목별 확정 현황">
              <table className={styles.table}>
                <thead><tr><th>항목</th><th>권장 예산</th><th>확정 금액</th><th>상태</th></tr></thead>
                <tbody>{CONFIRMED.map((r) => <tr key={r.name}><td>{r.name}</td><td>{r.reco}</td><td>{r.amount}</td><td><Tag tone={r.tone}>{r.status}</Tag></td></tr>)}</tbody>
              </table>
            </Panel>
            <div className={styles.sectionHead}><h2>찜한 업체</h2><Link to={PATHS.directory} className={styles.more}>디렉토리 <ArrowRight /></Link></div>
            {favIds.length
              ? <div className={styles.vendors}>{getVendorsByIds(favIds).map((v) => <VendorCard key={v.id} vendor={v} />)}</div>
              : <p className={styles.empty}>아직 찜한 업체가 없어요. 디렉토리에서 마음에 드는 업체를 찜해 보세요.</p>}
          </div>
        )}
      </div>

      {openItem && <ItemDrawer key={openItem.id} item={openItem} wedding={wedding} onClose={() => setOpenId(null)}
        onDated={(d) => { const [y, m] = d.split('-').map(Number); setCalView({ y, m: m - 1 }); }} />}
      {inviteOpen && <InviteModal me={me} onClose={() => setInviteOpen(false)} />}
    </div>
  );
}
