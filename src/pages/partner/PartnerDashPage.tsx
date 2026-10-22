import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowRight, Check, ChevronLeft, ChevronRight, CornerDownRight, Eye, MapPin, Plus, Reply, Store, Tag as TagIcon, TrendingUp, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Calendar, { CalendarLegend } from '../../components/ui/Calendar';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Panel from '../../components/ui/Panel';
import Tabs from '../../components/ui/Tabs';
import Tag from '../../components/ui/Tag';
import VendorPreviewCard from '../../components/vendor/VendorPreviewCard';
import { NEXT_STATUS, bizChecks, bizDayStatus, bizPriceText, dayKey, type BizProfile, type BizTab } from '../../data/biz';
import { BUSINESS_CATEGORIES, MOODS } from '../../data/categories';
import { VENDORS, imageUrl } from '../../data/vendors';
import { useSignOut } from '../../hooks/useSignOut';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useBizStore } from '../../stores/bizStore';
import { toast } from '../../stores/toastStore';
import { withdraw } from '../../stores/withdraw';
import type { BizUser } from '../../types';
import styles from './PartnerDashPage.module.css';

const TABS: BizTab[] = ['home', 'profile', 'inquiry', 'schedule', 'account'];
const PROOF_LABEL = { biz: '사업자 등록증', free: '신분증 + 포트폴리오' };

/* ② 업체 정보: 입력하는 대로 오른쪽 미리보기가 바뀌고, 저장해야 반영 */
function ProfileForm({ user }: { user: BizUser }) {
  const { profile, saveProfile } = useBizStore();
  const update = useAuthStore((s) => s.update);
  const [p, setP] = useState<BizProfile>(profile);
  const [name, setName] = useState(user.bizName);
  const [error, setError] = useState('');
  const set = (patch: Partial<BizProfile>) => setP({ ...p, ...patch });

  const addPhoto = () => {
    const pool = VENDORS.map((v) => v.photo).filter((x): x is string => !!x && !p.photos.includes(x));
    if (pool.length) { set({ photos: [...p.photos, pool[0]] }); toast('사진을 추가했어요 (프로토타입: 예시 사진)'); }
  };
  const save = () => {
    const miss = [!p.photos.length && '대표 사진', !p.cat && '업종', !name.trim() && '업체명', !p.moods.length && '무드 태그'].filter(Boolean);
    if (miss.length) { setError(`필수 항목을 채워주세요: ${miss.join(', ')}`); return; }
    setError('');
    saveProfile({ ...p, insta: p.insta.trim().replace(/^@/, '') });
    if (name.trim() !== user.bizName) update({ bizName: name.trim() });
    toast('업체 정보를 저장했어요');
  };

  return (
    <div className={styles.profile}>
      <Panel className={styles.form}>
        <div className={styles.field}><span>대표 사진 <small>필수</small></span>
          <div className={styles.uploadRow}>
            {p.photos.map((ph, i) => (
              <span key={ph} className={styles.thumbWrap}>
                <img className={styles.thumb} src={imageUrl(ph)!} alt={`대표 사진 ${i + 1}`} />
                <button type="button" className={styles.thumbDel} aria-label={`사진 ${i + 1} 삭제`} onClick={() => set({ photos: p.photos.filter((x) => x !== ph) })}><X /></button>
              </span>
            ))}
            {p.photos.length < 5 && <button type="button" className={styles.uploadAdd} onClick={addPhoto}><Plus /><small>사진 추가</small></button>}
          </div>
        </div>
        <div className={styles.field}><span>업종 <small>필수</small></span>
          <ChipGroup label="업종">{BUSINESS_CATEGORIES.map((c) => <Chip key={c.name} active={p.cat === c.name} onClick={() => set({ cat: c.name })}>{c.name}</Chip>)}</ChipGroup>
        </div>
        <label className={styles.field}><span>업체 / 활동명 <small>필수</small></span><input maxLength={20} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <div className={styles.row}>
          <label className={styles.field}><span>활동 지역</span><input value={p.region} onChange={(e) => set({ region: e.target.value })} placeholder="예: 서울, 제주" /></label>
          <label className={styles.field}><span>유형</span><input value={p.type} onChange={(e) => set({ type: e.target.value })} placeholder="예: 1인 작가" /></label>
        </div>
        <div className={styles.field}><span>가격 공개</span>
          <ChipGroup label="가격 공개">
            <Chip active={p.priceMode === 'none'} onClick={() => set({ priceMode: 'none' })}>공개 안 함</Chip>
            <Chip active={p.priceMode === 'range'} onClick={() => set({ priceMode: 'range' })}>범위만</Chip>
          </ChipGroup>
          {p.priceMode === 'range' && (
            <div className={styles.priceRange}>
              <label className={styles.field}><span>최저</span><input value={p.priceMin} onChange={(e) => set({ priceMin: e.target.value })} placeholder="예: 35만 원" /></label>
              <span>~</span>
              <label className={styles.field}><span>최고</span><input value={p.priceMax} onChange={(e) => set({ priceMax: e.target.value })} placeholder="예: 75만 원" /></label>
            </div>
          )}
        </div>
        <div className={styles.field}><span>무드 태그 <small>필수 · 1개 이상</small></span>
          <ChipGroup label="무드 태그">{MOODS.map((m) => <Chip key={m} active={p.moods.includes(m)} onClick={() => set({ moods: p.moods.includes(m) ? p.moods.filter((x) => x !== m) : [...p.moods, m] })}>{m}</Chip>)}</ChipGroup>
        </div>
        <label className={styles.field}><span>소개글</span><textarea rows={4} value={p.intro} onChange={(e) => set({ intro: e.target.value })} placeholder="어떤 서비스를 제공하는지 알려주세요." /></label>
        <label className={styles.field}><span>인스타그램 계정</span><input value={p.insta} onChange={(e) => set({ insta: e.target.value })} placeholder="예: filmharu.snap" /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <Button block onClick={save}>저장하기</Button>
      </Panel>
      <aside className={styles.previewCol}>
        <small className={styles.previewLabel}>예비부부에게 이렇게 보여요</small>
        <VendorPreviewCard photo={p.photos[0]} cat={p.cat} name={name.trim()} meta={[p.region, p.type].filter(Boolean).join(' · ') || '지역 · 유형'}
          price={bizPriceText(p)} moods={p.moods} insta={p.insta.trim().replace(/^@/, '') || undefined} />
      </aside>
    </div>
  );
}

/** 내 업체: 배너(요약 · 프로필 완성도) + 대시보드 · 업체 정보 · 문의 · 일정 · 계정 */
export default function PartnerDashPage() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [params, setParams] = useSearchParams();
  const tab = (TABS as string[]).includes(params.get('tab') ?? '') ? (params.get('tab') as BizTab) : 'home';
  const go = (t: BizTab) => setParams(t === 'home' ? {} : { tab: t }, { replace: true });
  const auth = useAuthStore();
  const user = auth.user as BizUser;
  const { profile, marks, inquiries, mark, reply } = useBizStore();
  const [inqFilter, setInqFilter] = useState<'all' | 'new' | 'done'>('all');
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [cal, setCal] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

  const now = new Date();
  const checks = bizChecks(profile, user.bizName);
  const pct = checks.reduce((s, c) => s + (c.ok ? c.w : 0), 0);
  const todo = checks.filter((c) => !c.ok);
  const newCount = inquiries.filter((q) => q.status === 'new').length;
  const monthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const booked = Array.from({ length: monthDays }, (_, i) => bizDayStatus(marks, now.getFullYear(), now.getMonth(), i + 1)).filter((s) => s === 'booked').length;
  const open = !!user.proof;

  const openInquiry = (id: number, isNew: boolean) => { setReplyOpen(isNew ? id : null); setReplyText(''); go('inquiry'); };
  const sendReply = (id: number, who: string) => {
    if (!replyText.trim()) { toast('답장 내용을 입력해 주세요'); return; }
    reply(id, replyText.trim());
    setReplyOpen(null);
    toast(`${who} 님에게 답장을 보냈어요`);
  };
  const uploadProof = () => { auth.update({ proof: 'biz' }); toast('증빙 서류를 올렸어요 · 검토 후 디렉토리에 소개돼요'); };

  return (
    <div className="page">
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.head}>
          <div>
            <span className={styles.kicker}><Store />내 업체</span>
            <h1>{user.bizName}</h1>
            <ul className={styles.meta}>
              <li><TagIcon />{profile.cat}</li>
              <li><MapPin />{profile.region || '지역 미입력'}</li>
              <li className={`${styles.status} ${open ? '' : styles.off}`}><i />{open ? '디렉토리 공개 중' : '비공개 · 증빙 필요'}</li>
            </ul>
            <div className={styles.stats}>
              <div className={styles.stat}><small>이번 주 조회</small><strong>1,284</strong><span className={styles.statNote}><TrendingUp />18%</span></div>
              <div className={styles.stat}><small>새 문의</small><strong>{newCount}</strong><span className={styles.statNote}>답장을 기다려요</span></div>
              <div className={styles.stat}><small>찜</small><strong>86</strong><span className={styles.statNote}><TrendingUp />9</span></div>
              <div className={styles.stat}><small>예약 확정</small><strong>{booked}</strong><span className={styles.statNote}>이번 달</span></div>
            </div>
          </div>
          <div className={styles.sideCard}>
            <small>프로필 완성도</small>
            <strong>{pct}%</strong>
            <span className={styles.bar}><i style={{ width: `${pct}%` }} /></span>
            <ul className={styles.todo}>
              {todo.length
                ? todo.map((c) => <li key={c.label}><button type="button" onClick={() => go(c.tab)}><Plus />{c.label}<em>+{c.w}%</em></button></li>)
                : <li className={styles.allDone}><Check />모든 항목을 채웠어요</li>}
            </ul>
            <button type="button" className={styles.previewBtn} onClick={() => navigate(PATHS.partnerPreview)}><Eye />예비부부에게 보이는 페이지 보기</button>
          </div>
        </div>

        {!open && (
          <Panel tone="soft" className={styles.proofBanner}>
            <div><b>증빙 서류를 올리면 디렉토리에 소개돼요</b><p>지금은 프로필이 비공개 상태예요. 사업자 등록증, 또는 프리랜서라면 신분증 + 포트폴리오를 올려주세요.</p></div>
            <Button onClick={uploadProof}>증빙 서류 올리기</Button>
          </Panel>
        )}

        <Tabs label="내 업체" value={tab} onChange={go} items={[
            { value: 'home', label: '대시보드' },
            { value: 'profile', label: '업체 정보' },
            { value: 'inquiry', label: <>문의 {newCount > 0 && <span className={styles.count}>{newCount}</span>}</> },
            { value: 'schedule', label: '일정' },
            { value: 'account', label: '계정' },
          ]} />

        {tab === 'home' && (
          <div className={styles.grid}>
            <Panel title="새 문의" action={<button type="button" className={styles.more} onClick={() => go('inquiry')}>전체 보기 <ArrowRight /></button>}>
              <ul className={styles.inqList}>
                {inquiries.map((q) => (
                  <li key={q.id}><button type="button" onClick={() => openInquiry(q.id, q.status === 'new')}>
                    <b>{q.who}</b><span className={styles.inqText}>{q.text}</span><Tag tone={q.status === 'new' ? 'brand' : 'default'}>{q.status === 'new' ? 'NEW' : '답변 완료'}</Tag>
                  </button></li>
                ))}
              </ul>
            </Panel>
            <Panel title="이번 달 일정" action={<button type="button" className={styles.more} onClick={() => go('schedule')}>일정 관리 <ArrowRight /></button>}>
              <Calendar year={now.getFullYear()} month={now.getMonth()} status={(d) => bizDayStatus(marks, now.getFullYear(), now.getMonth(), d)} />
            </Panel>
          </div>
        )}

        {tab === 'profile' && <ProfileForm key={profile.cat + user.bizName} user={user} />}

        {tab === 'inquiry' && (
          <>
            <ChipGroup label="문의 상태" className={styles.filters}>
              {([['all', '전체'], ['new', '새 문의'], ['done', '답변 완료']] as const).map(([k, l]) => <Chip key={k} active={inqFilter === k} onClick={() => setInqFilter(k)}>{l}</Chip>)}
            </ChipGroup>
            <div className={styles.inqCards}>
              {inquiries.filter((q) => inqFilter === 'all' || q.status === inqFilter).map((q) => (
                <article key={q.id} className={`${styles.inq} ${q.status === 'new' ? styles.inqNew : ''}`}>
                  <div className={styles.inqTop}>
                    <span className={styles.avatar}>{q.who.slice(-1)}</span>
                    <b>{q.who}</b><small>{q.when}</small>
                    <Tag tone={q.status === 'new' ? 'brand' : 'default'}>{q.status === 'new' ? '새 문의' : '답변 완료'}</Tag>
                  </div>
                  <p>{q.text}</p>
                  <div className={styles.inqTags}>{q.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                  {q.status === 'done' ? (
                    <div className={styles.reply}><small><CornerDownRight />내 답장</small><p>{q.reply}</p></div>
                  ) : replyOpen === q.id ? (
                    <div className={styles.replyForm}>
                      <textarea rows={3} autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="답장을 입력하세요" aria-label="답장" />
                      <div>
                        <Button size="sm" variant="ghost" onClick={() => setReplyOpen(null)}>취소</Button>
                        <Button size="sm" onClick={() => sendReply(q.id, q.who)}>보내기</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className={styles.replyBtn} onClick={() => { setReplyOpen(q.id); setReplyText(''); }}><Reply />답장하기</Button>
                  )}
                </article>
              ))}
              {!inquiries.some((q) => inqFilter === 'all' || q.status === inqFilter) && <p className={styles.empty}>해당하는 문의가 없어요.</p>}
            </div>
          </>
        )}

        {tab === 'schedule' && (
          <Panel>
            <div className={styles.schedHead}>
              <button type="button" className={styles.calNav} aria-label="이전 달" onClick={() => { const d = new Date(cal.y, cal.m - 1, 1); setCal({ y: d.getFullYear(), m: d.getMonth() }); }}><ChevronLeft /></button>
              <h3>{cal.y}년 {cal.m + 1}월</h3>
              <button type="button" className={styles.calNav} aria-label="다음 달" onClick={() => { const d = new Date(cal.y, cal.m + 1, 1); setCal({ y: d.getFullYear(), m: d.getMonth() }); }}><ChevronRight /></button>
              <p>날짜를 누르면 <b>예약 가능 → 마감 → 예약 확정</b> 순으로 바뀌어요.</p>
            </div>
            <Calendar year={cal.y} month={cal.m} showTitle={false}
              status={(d) => bizDayStatus(marks, cal.y, cal.m, d)}
              onDayClick={(d) => mark(dayKey(cal.y, cal.m, d), NEXT_STATUS[bizDayStatus(marks, cal.y, cal.m, d)])} />
            <CalendarLegend items={['ok', 'no', 'booked']} />
            <p className={styles.schedNote}>예비부부에게는 예약 가능 · 마감만 보이고, 예약 확정은 마감으로 보여요.</p>
          </Panel>
        )}

        {tab === 'account' && (
          <Panel>
            <dl className={styles.acc}>
              <div><dt>로그인 이메일</dt><dd>{user.email || '-'}</dd></div>
              <div><dt>업체명</dt><dd>{user.bizName}</dd></div>
              <div><dt>연락처</dt><dd>{user.phone || '-'}</dd></div>
              <div><dt>주소</dt><dd>{user.address || '-'}</dd></div>
              <div><dt>증빙 서류</dt><dd>{user.proof
                ? <Tag tone="ink">{PROOF_LABEL[user.proof]} 확인됨</Tag>
                : <><Tag tone="brand">미제출</Tag> <Button size="sm" onClick={uploadProof}>올리기</Button></>}</dd></div>
              <div><dt>요금제</dt><dd>업체 등록 · 지금은 무료</dd></div>
            </dl>
            <div className={styles.accActions}>
              <Button size="sm" variant="ghost" onClick={() => toast('비밀번호 변경 메일을 보냈어요 (프로토타입)')}>비밀번호 변경</Button>
              <Button size="sm" variant="ghost" onClick={() => signOut(auth.logout, '로그아웃했어요')}>로그아웃</Button>
              <button type="button" className={styles.withdraw} onClick={() => {
                if (!confirm('정말 탈퇴할까요?\n업체 정보 · 예약 일정이 모두 지워지고 디렉토리에서도 내려가요. 되돌릴 수 없어요.')) return;
                signOut(() => withdraw('biz'), '탈퇴했어요. 그동안 함께해 주셔서 고마워요');
              }}>회원 탈퇴</button>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
