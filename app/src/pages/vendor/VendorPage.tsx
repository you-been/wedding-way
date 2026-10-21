import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, AtSign, Bookmark, ChartColumn, ChevronLeft, Plus, Star } from 'lucide-react';
import Button from '../../components/ui/Button';
import Calendar, { CalendarLegend, type DayStatus } from '../../components/ui/Calendar';
import Tabs from '../../components/ui/Tabs';
import Tag from '../../components/ui/Tag';
import ReviewCard from '../../components/vendor/ReviewCard';
import { categoryAvg, categoryIcon } from '../../data/categories';
import { getReviews, getVendor, getVendors } from '../../data/api';
import { recoReasons } from '../../data/recommend';
import { useMyTier } from '../../stores/budgetStore';
import { imageUrl, type Vendor } from '../../data/vendors';
import { useMemberAction } from '../../hooks/useMemberAction';
import { PATHS } from '../../routes';
import { useAuthStore } from '../../stores/authStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { usePrefStore } from '../../stores/prefStore';
import { toast } from '../../stores/toastStore';
import PlaceholderPage from '../PlaceholderPage';
import styles from './VendorPage.module.css';

type Tab = 'info' | 'price' | 'review' | 'schedule';

// 예약 가능 일정 (프로토타입 예시: 2027년 6월)
const schedStatus = (d: number, dow: number): DayStatus => (dow === 6 || dow === 0 ? (d % 3 === 0 ? 'no' : 'few') : d % 5 === 0 ? 'no' : 'ok');

/** 업체 상세: 사진 · 소개 · 가격 · 인증 후기 · 예약 가능 일정 + 오른쪽 정보 카드 */
export default function VendorPage({ vendor: given }: { vendor?: Vendor }) {
  const { id } = useParams();
  const v = given ?? getVendor(Number(id));
  if (!v) return <PlaceholderPage title="업체를 찾을 수 없어요" />;
  return <VendorDetail key={v.id} v={v} preview={!!given} />;
}

function VendorDetail({ v, preview }: { v: Vendor; preview: boolean }) {
  const isBiz = useAuthStore((s) => s.user?.type === 'biz') && !preview; // 업체 회원은 찜 · 예산에 담기 같은 예비부부 동작을 보지 않음
  const [tab, setTab] = useState<Tab>('info');
  const moods = usePrefStore((s) => s.moods);
  const myTier = useMyTier();
  const saved = useFavoriteStore((s) => s.ids.includes(v.id));
  const toggleFav = useFavoriteStore((s) => s.toggle);
  const member = useMemberAction('user');
  const reasons = recoReasons(v, moods, myTier);
  const avg = categoryAvg(v.cat);
  const Icon = categoryIcon(v.cat);

  // 갤러리: 큰 칸은 이 업체 사진, 작은 칸은 다른 목업 사진을 이어서 (프로토타입용)
  const pool = getVendors().map((x) => x.photo).filter((p): p is string => !!p);
  const start = Math.max(0, pool.indexOf(v.photo ?? ''));
  const shots = Array.from({ length: 4 }, (_, i) => pool[(start + 1 + i) % pool.length]);

  const inquire = (msg: string) => () => member(() => toast(msg));

  return (
    <div className="page">
      <div className="wrap">
        <Link to={PATHS.directory} className={styles.back}><ChevronLeft />디렉토리</Link>
        <div className={styles.layout}>
          <div className={styles.gallery}>
            {v.photo ? <img className={styles.big} src={imageUrl(v.photo)!} alt={`${v.name} 대표 사진`} /> : <span className={`${styles.big} ${styles.empty}`} aria-hidden="true"><Icon /></span>}
            {shots.map((p, i) => (
              <span key={p + i} className={`${styles.shot} ${i === 3 ? styles.moreShot : ''}`}>
                <img src={imageUrl(p)!} alt="" loading="lazy" />{i === 3 && <b>+24</b>}
              </span>
            ))}
          </div>

          <aside className={styles.side}>
            <div className={styles.card}>
              <span className={styles.cat}>{v.cat}</span>
              <h1>{v.name}</h1>
              <p className={styles.meta}>{v.region} · {v.type}</p>
              <div className={styles.rating}><Star /><b>{v.rating}</b><span>후기 {v.reviews} · 인증 {v.verified}</span></div>
              <div className={styles.priceBox}>
                <small>{v.price ? '평균 견적' : '가격'}</small>
                <strong>{v.price ?? '상담 후 안내'}</strong>
                {!v.price && avg && <small>{v.cat} 시장 평균 {avg}</small>}
              </div>
              <Button block onClick={inquire('문의 요청을 보냈어요 (프로토타입)')}>상담 · 예약 문의</Button>
              {!isBiz && (
              <div className={styles.sideBtns}>
                <Button variant="ghost" className={saved ? styles.liked : undefined} aria-pressed={saved} onClick={() => member(() => toast(toggleFav(v.id) ? '찜 목록에 담았어요' : '찜을 해제했어요'))}>
                  <Bookmark />{saved ? '찜함' : '찜하기'}
                </Button>
                <Button variant="ghost" onClick={() => toast('예산 진단에 추가했어요')}><Plus />예산에 담기</Button>
              </div>
              )}
              {v.insta && <button className={styles.insta} onClick={() => toast('인스타그램으로 이동 (프로토타입)')}><AtSign />{v.handle ?? 'instagram'}</button>}
              {reasons.length > 0 && (
                <div className={styles.why}>
                  <small>이 업체를 추천한 이유</small>
                  <div>{reasons.map((r) => <span key={r}>{r}</span>)}</div>
                </div>
              )}
              <p className={styles.neutral}>결심은 업체와 별도 제휴 수수료 없이 정보를 동일 기준으로 노출합니다.</p>
            </div>
          </aside>

          <div className={styles.main}>
            <Tabs label="업체 정보" value={tab} onChange={setTab} items={[
              { value: 'info', label: '소개 · 서비스 범위' },
              { value: 'price', label: '가격 · 견적' },
              { value: 'review', label: <>인증 후기 <span className={styles.count}>{v.verified}</span></> },
              { value: 'schedule', label: '예약 가능 일정' },
            ]} />

            {tab === 'info' && (
              <section className={styles.panel}>
                <p className={styles.intro}>자연광과 필름 감성을 담는 1인 아이폰스냅 작가입니다. 제주 · 서울 야외 촬영 위주로 진행하며, 원본 전체 제공과 빠른 보정이 강점이에요.</p>
                <h2>서비스 범위</h2>
                <ul className={styles.check}>
                  <li>촬영 2시간 · 2~3곳 로케이션</li><li>원본 전체 제공 (500장 이상)</li><li>보정본 30장 · 촬영 후 2주 내 전달</li><li>출장 가능 지역: 서울 · 경기 · 제주</li>
                </ul>
                <div className={styles.tags}>{v.moods.map((m) => <Tag key={m}>{m}</Tag>)}</div>
              </section>
            )}

            {tab === 'price' && (
              <section className={styles.panel}>
                {v.price ? (
                  <>
                    <table className={styles.priceTable}>
                      <tbody>
                        <tr><th>베이직</th><td>2시간 · 보정 20장</td><td><b>35만 원</b></td></tr>
                        <tr><th>스탠다드</th><td>3시간 · 보정 30장</td><td><b>48만 원</b></td></tr>
                        <tr><th>제주 패키지</th><td>4시간 · 보정 40장</td><td><b>75만 원</b></td></tr>
                      </tbody>
                    </table>
                    <h2>추가금 안내 <Tag tone="ink">투명 공개</Tag></h2>
                    <ul className={`${styles.check} ${styles.dot}`}>
                      <li>주말 · 공휴일 +5만 원</li><li>로케이션 추가 1곳당 +3만 원</li><li>출장비 (서울 외) 실비 별도</li>
                    </ul>
                    {avg && <div className={styles.hint}><ChartColumn /><span>{v.cat} 시장 평균가 <b>{avg}</b> · 이 업체는 <b>평균 수준</b>이에요.</span></div>}
                  </>
                ) : (
                  <div className={styles.closed}>
                    <b>상담 후 가격을 안내하는 업체예요</b>
                    <p>원하는 날짜와 구성을 알려주시면 맞춤 견적을 받을 수 있어요.</p>
                    {avg && <div className={styles.hint}><ChartColumn /><span>{v.cat} 시장 평균가 <b>{avg}</b> · 참고용</span></div>}
                    <Button onClick={inquire('견적 문의를 보냈어요 (프로토타입)')}>견적 문의하기</Button>
                  </div>
                )}
              </section>
            )}

            {tab === 'review' && (
              <section className={styles.panel}>
                <div className={styles.reviews}>{getReviews().slice(0, 2).map((r) => <ReviewCard key={r.id} review={r} />)}</div>
                <Link to={PATHS.reviews} className={styles.moreLink}>전체 후기 보기 <ArrowRight /></Link>
              </section>
            )}

            {tab === 'schedule' && (
              <section className={styles.panel}>
                {v.schedule === false ? (
                  <div className={styles.closed}>
                    <b>일정은 문의로 확인해 주세요</b>
                    <p>이 업체는 예약 가능 일정을 따로 공개하지 않아요. 원하는 날짜를 보내면 가능 여부를 알려드려요.</p>
                    <Button onClick={inquire('일정 문의를 보냈어요 (프로토타입)')}>일정 문의하기</Button>
                  </div>
                ) : (
                  <>
                    <Calendar year={2027} month={5} status={schedStatus} />
                    <CalendarLegend items={['ok', 'few', 'no']} />
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
