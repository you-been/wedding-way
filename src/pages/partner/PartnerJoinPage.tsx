import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AtSign, CalendarDays, Check, FilePenLine, Images, Plus, Wallet, type LucideIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import Calendar from '../../components/ui/Calendar';
import Chip, { ChipGroup } from '../../components/ui/Chip';
import Stepper from '../../components/ui/Stepper';
import Tag from '../../components/ui/Tag';
import AreaPicker from '../../components/vendor/AreaPicker';
import VendorPreviewCard from '../../components/vendor/VendorPreviewCard';
import { BUSINESS_CATEGORIES, MOODS } from '../../data/categories';
import { EMPTY_AREA, areaLabel } from '../../data/regions';
import { imageUrl } from '../../data/vendors';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useBizStore } from '../../stores/bizStore';
import { toast } from '../../stores/toastStore';
import steps from '../onboarding/steps.module.css';
import styles from './PartnerJoinPage.module.css';

type Opt = 'insta' | 'schedule' | 'price' | 'intro';
const OPTIONS: { key: Opt; label: string; desc: string; Icon: LucideIcon }[] = [
  { key: 'insta', label: '인스타 연동', desc: '게시물을 사진으로 불러와요', Icon: Images },
  { key: 'schedule', label: '예약 일정', desc: '가능한 날짜를 보여줘요', Icon: CalendarDays },
  { key: 'price', label: '가격', desc: '공개 범위를 정해요', Icon: Wallet },
  { key: 'intro', label: '상세 소개', desc: '서비스 범위 · 소개글', Icon: FilePenLine },
];
const IMPORTS = ['biz_07', 'biz_08', 'biz_03', 'biz_12', 'biz_04', 'biz_10'];
type PriceMode = 'none' | 'range' | 'detail';

/** 업체 소개 만들기: 필수(기본 정보 · 무드) → 고른 선택 항목만 → 완료 */
export default function PartnerJoinPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { profile, saveProfile } = useBizStore();
  const [idx, setIdx] = useState(0);
  const [cats, setCats] = useState<string[]>(['아이폰스냅']);
  const [name, setName] = useState(user?.type === 'biz' ? user.bizName : '필름하루 스냅');
  const [area, setArea] = useState(EMPTY_AREA);
  const [moods, setMoods] = useState<string[]>([]);
  const [moodError, setMoodError] = useState(false);
  const [picked, setPicked] = useState<Opt[]>([]);
  const [imports, setImports] = useState(['biz_07', 'biz_08', 'biz_12', 'biz_10']);
  const [open, setOpen] = useState<Record<number, boolean>>({}); // 일정: 바꾼 날짜 (2027년 5월)
  const [priceMode, setPriceMode] = useState<PriceMode>('none');
  const [priceMin, setPriceMin] = useState('35만 원');
  const [priceMax, setPriceMax] = useState('75만 원');
  const [intro, setIntro] = useState('');

  const seq = ['basic', 'mood', 'pick', ...OPTIONS.map((o) => o.key).filter((k) => picked.includes(k)), 'done'];
  const key = seq[idx];
  const total = seq.length - 1; // 완료 화면은 단계 수에서 제외
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const price = picked.includes('price') && priceMode !== 'none' ? `${priceMin} ~ ${priceMax}` : null;

  const next = () => {
    if (key === 'mood' && !moods.length) { setMoodError(true); return; }
    if (seq[idx + 1] === 'done') {
      // 입력한 내용으로 내 업체 정보를 채움
      saveProfile({
        ...profile, cat: cats[0] ?? profile.cat, area: areaLabel(area) ? area : profile.area, moods,
        priceMode: price ? 'range' : 'none', priceMin, priceMax,
        intro: intro.trim() || profile.intro, insta: picked.includes('insta') ? 'filmharu.snap' : profile.insta,
      });
    }
    setIdx(idx + 1);
  };
  const prev = () => (idx === 0 ? navigate(-1) : setIdx(idx - 1));
  const later = OPTIONS.filter((o) => !picked.includes(o.key)).map((o) => o.label);

  return (
    <div className="page">
      <div className={`wrap ${steps.wrap}`}>
        <div className={styles.head}>
          <h1>3분 만에 업체 소개 만들기</h1>
          <p>필수 정보만 넣고, 나머지는 원하는 것만 골라서 추가하세요.</p>
        </div>
        {key !== 'done' && <div className={styles.stepper}><Stepper step={idx + 1} total={total} /></div>}

        <section key={key} className={steps.step}>
          {key === 'basic' && (
            <>
              <h2 className={steps.stepTitle}>기본 정보 <Tag>필수</Tag></h2>
              <p className={steps.stepDesc}>예비부부에게 가장 먼저 보이는 정보예요.</p>
              <div className={steps.field}><span>대표 사진</span>
                <div className={styles.uploadRow}>
                  {profile.photos.map((p, i) => <img key={p} className={styles.thumb} src={imageUrl(p)!} alt={`대표 사진 ${i + 1}`} />)}
                  <button type="button" className={styles.uploadAdd} onClick={() => toast('사진 선택 창이 열려요 (프로토타입)')}><Plus /><small>사진 추가</small></button>
                </div>
              </div>
              <div className={steps.field}><span>업종</span>
                <ChipGroup label="업종">{BUSINESS_CATEGORIES.map((c) => <Chip key={c.name} active={cats.includes(c.name)} onClick={() => setCats(toggle(cats, c.name))}>{c.name}</Chip>)}</ChipGroup>
              </div>
              <label className={steps.field}><span>업체 / 활동명</span><input className={steps.input} value={name} onChange={(e) => setName(e.target.value)} /></label>
              <div className={steps.field}><span>활동 지역 <small className={styles.muted}>선택</small></span><AreaPicker value={area} onChange={setArea} /></div>
            </>
          )}

          {key === 'mood' && (
            <>
              <h2 className={steps.stepTitle}>우리 업체의 무드 <Tag>필수 · 1개 이상</Tag></h2>
              <p className={steps.stepDesc}>고른 무드로 취향이 맞는 예비부부에게 추천돼요.</p>
              <ChipGroup label="무드">{MOODS.map((m) => <Chip key={m} size="lg" active={moods.includes(m)} onClick={() => { setMoods(toggle(moods, m)); setMoodError(false); }}>{m}</Chip>)}</ChipGroup>
              {moodError && <p className={styles.error} role="alert">무드 태그를 1개 이상 골라주세요.</p>}
            </>
          )}

          {key === 'pick' && (
            <>
              <h2 className={steps.stepTitle}>더 알리고 싶은 것이 있나요? <Tag tone="brand">선택</Tag></h2>
              <p className={steps.stepDesc}>고른 항목만 이어서 입력해요. 나머지는 나중에 언제든 추가할 수 있어요.</p>
              <div className={styles.pickGrid}>
                {OPTIONS.map(({ key: k, label, desc, Icon }) => (
                  <button key={k} type="button" aria-pressed={picked.includes(k)} className={`${styles.pick} ${picked.includes(k) ? styles.pickOn : ''}`} onClick={() => setPicked(toggle(picked, k))}>
                    <b><Icon />{label}</b><small>{desc}</small>
                  </button>
                ))}
              </div>
              <p className={styles.hint}>아무것도 고르지 않아도 바로 완료할 수 있어요. 많이 채울수록 예비부부에게 더 위에 소개돼요.</p>
            </>
          )}

          {key === 'insta' && (
            <>
              <h2 className={steps.stepTitle}>인스타그램 연동 <Tag tone="brand">선택</Tag></h2>
              <p className={steps.stepDesc}>게시물을 불러와 업체 소개 사진으로 정리해 드려요.</p>
              <Button block onClick={() => toast('@filmharu.snap 계정이 연결되었어요')}><AtSign />Instagram으로 연결</Button>
              <div className={styles.importGrid}>
                {IMPORTS.map((p) => (
                  <button key={p} type="button" aria-pressed={imports.includes(p)} aria-label={`게시물 ${p.slice(-2)}`} className={`${styles.ph} ${imports.includes(p) ? styles.sel : ''}`} onClick={() => setImports(toggle(imports, p))}>
                    <img src={imageUrl(p)!} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <p className={styles.hint}>소개에 쓸 게시물을 선택하세요</p>
            </>
          )}

          {key === 'schedule' && (
            <>
              <h2 className={steps.stepTitle}>예약 가능 일정 <Tag tone="brand">선택</Tag></h2>
              <p className={steps.stepDesc}>날짜를 눌러 가능/불가를 바꿀 수 있어요.</p>
              <Calendar year={2027} month={4}
                status={(d, dow) => ((open[d] ?? (dow === 0 || dow === 6)) ? 'ok' : 'no')}
                onDayClick={(d) => { const dow = new Date(2027, 4, d).getDay(); setOpen({ ...open, [d]: !(open[d] ?? (dow === 0 || dow === 6)) }); }} />
            </>
          )}

          {key === 'price' && (
            <>
              <h2 className={steps.stepTitle}>가격 <Tag tone="brand">선택</Tag></h2>
              <p className={steps.stepDesc}>공개 범위를 골라주세요. 언제든 바꿀 수 있어요.</p>
              <ChipGroup label="가격 공개 범위">
                {([['none', '공개 안 함'], ['range', '범위만'], ['detail', '상세']] as [PriceMode, string][]).map(([m, l]) => <Chip key={m} active={priceMode === m} onClick={() => setPriceMode(m)}>{l}</Chip>)}
              </ChipGroup>
              {priceMode === 'none' && <p className={styles.hint}>예비부부에게는 '상담 후 안내'로 표시돼요.</p>}
              {priceMode !== 'none' && (
                <div className={styles.priceRange}>
                  <label className={steps.field}><span>최저</span><input className={steps.input} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} /></label>
                  <span>~</span>
                  <label className={steps.field}><span>최고</span><input className={steps.input} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} /></label>
                </div>
              )}
              {priceMode === 'detail' && (
                <>
                  <label className={steps.field}><span>패키지 구성</span><textarea className={styles.textarea} rows={3} placeholder="예: 베이직 2시간 35만 원 / 스탠다드 3시간 48만 원" /></label>
                  <label className={steps.field}><span>추가금 항목</span><textarea className={styles.textarea} rows={2} placeholder="예: 주말 +5만 원, 출장비 별도" /></label>
                </>
              )}
            </>
          )}

          {key === 'intro' && (
            <>
              <h2 className={steps.stepTitle}>상세 소개 <Tag tone="brand">선택</Tag></h2>
              <p className={steps.stepDesc}>어떤 서비스를 제공하는지 자유롭게 적어주세요.</p>
              <label className={steps.field}><span>소개글</span><textarea className={styles.textarea} rows={5} value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="예: 자연광과 필름 감성을 담는 1인 아이폰스냅 작가입니다." /></label>
              <label className={steps.field}><span>서비스 범위</span><textarea className={styles.textarea} rows={3} placeholder="예: 촬영 2시간 · 원본 전체 제공 · 보정 30장" /></label>
            </>
          )}

          {key === 'done' && (
            <div className={styles.done}>
              <div className={styles.doneIco}><Check /></div>
              <h2>업체 소개가 준비됐어요!</h2>
              <p className={styles.muted}>{user?.type === 'biz' && !user.proof ? '증빙 서류를 올리면 검토 후 예비부부에게 소개돼요.' : '검토 후 24시간 이내에 예비부부에게 소개돼요.'}</p>
              <div className={styles.preview}>
                <small>예비부부에게는 이렇게 보여요</small>
                <VendorPreviewCard photo="biz_07" cat={cats[0] ?? '업종'} name={name} meta={areaLabel(area) || undefined} price={price} moods={moods} height={150} />
              </div>
              {later.length > 0 && <p className={styles.hint}>{later.join(' · ')}은(는) 내 업체에서 언제든 추가할 수 있어요.</p>}
              <Button to={PATHS.partnerDash}>내 업체로</Button>
            </div>
          )}
        </section>

        {key !== 'done' && (
          <div className={steps.actions}>
            <Button variant="ghost" onClick={prev}>이전</Button>
            <Button onClick={next}>{seq[idx + 1] === 'done' ? '완료' : '다음'}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
