import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Chip, { ChipGroup } from '../components/ui/Chip';
import Tag from '../components/ui/Tag';
import Panel from '../components/ui/Panel';
import PageHead from '../components/ui/PageHead';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import Calendar, { CalendarLegend, type DayStatus } from '../components/ui/Calendar';
import VendorCard from '../components/vendor/VendorCard';
import ReviewCard from '../components/vendor/ReviewCard';
import { BUSINESS_CATEGORIES, MOODS } from '../data/categories';
import { getReviews, getVendorsByIds } from '../data/api';
import { toast } from '../stores/toastStore';
import styles from './UiKitPage.module.css';

// 프로토타입 확인용: 공통 컴포넌트 모음 (DESIGN.md 컴포넌트 · 상태를 한 화면에서 비교)
export default function UiKitPage() {
  const [tab, setTab] = useState<'a' | 'b' | 'c'>('a');
  const [moods, setMoods] = useState<string[]>(['#클래식']);
  const [cat, setCat] = useState('아이폰스냅');
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState<Record<number, DayStatus>>({});
  const dayStatus = (d: number, dow: number): DayStatus => marks[d] ?? ([3, 10, 17].includes(d) ? 'booked' : dow === 0 || dow === 6 ? 'ok' : d % 5 === 0 ? 'few' : 'no');
  const cycle = (d: number) => setMarks((m) => ({ ...m, [d]: ({ ok: 'no', no: 'booked', booked: 'ok', few: 'ok' } as const)[dayStatus(d, new Date(2026, 9, d).getDay())] }));

  return (
    <div className="page">
      <div className="wrap">
        <PageHead title="UI 모음" desc="공통 컴포넌트를 한 화면에서 확인해요. (프로토타입 확인용)">
          <Button onClick={() => toast('알림이 이렇게 떠요')}>알림 보기</Button>
        </PageHead>

        <h2 className={styles.h}>버튼</h2>
        <div className={styles.row}>
          <Button>잉크 버튼 <ArrowRight /></Button>
          <Button variant="brand">핑크 버튼</Button>
          <Button variant="ghost"><Plus />회색 테두리</Button>
          <Button variant="outline">아웃라인 40px</Button>
          <Button size="sm">작은 버튼</Button>
          <Button disabled>비활성</Button>
        </div>
        <div className={`biz-theme ${styles.row}`}>
          <Button variant="brand">업체 화면 핑크(로즈 브라운)</Button>
          <Tag tone="brand">업체 태그</Tag>
        </div>

        <h2 className={styles.h}>칩 · 태그</h2>
        <ChipGroup label="무드 태그">
          {MOODS.map((m) => <Chip key={m} active={moods.includes(m)} onClick={() => setMoods((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]))}>{m}</Chip>)}
        </ChipGroup>
        <ChipGroup label="업종" scroll className={styles.mt}>
          {BUSINESS_CATEGORIES.slice(0, 8).map(({ name, Icon }) => <Chip key={name} variant="category" active={cat === name} onClick={() => setCat(name)}><Icon />{name}</Chip>)}
        </ChipGroup>
        <div className={`${styles.row} ${styles.mt}`}>
          <Tag>기본</Tag><Tag tone="ink">계약 완료</Tag><Tag tone="brand">NEW</Tag><Tag tone="soft">+50만</Tag>
        </div>

        <h2 className={styles.h}>탭 · 패널 · 창</h2>
        <Tabs label="예시 탭" value={tab} onChange={setTab} items={[{ value: 'a', label: '대시보드' }, { value: 'b', label: '업체 정보' }, { value: 'c', label: '문의' }]} />
        <div className={styles.grid3}>
          <Panel title="기본 패널" action={<button className={styles.more}>전체 보기 <ArrowRight /></button>}>흰 면 · 1px 테두리 · 12px 둥글기</Panel>
          <Panel tone="soft" title="옅은 포인트 면">공유 띠 · 안내</Panel>
          <Panel tone="gray" title="회색 면"><Button size="sm" onClick={() => setOpen(true)}>창 열기</Button></Panel>
        </div>
        <Modal open={open} onClose={() => setOpen(false)} title="창 제목" kicker="작은 머리말">
          <p className={styles.p}>Esc 키나 바깥을 누르면 닫혀요. 모바일에서는 아래에서 올라와요.</p>
          <Button block onClick={() => setOpen(false)}>확인</Button>
        </Modal>

        <h2 className={styles.h}>캘린더 (날짜를 눌러 바꿔 보세요)</h2>
        <Panel className={styles.cal}>
          <Calendar year={2026} month={9} status={dayStatus} onDayClick={cycle} />
          <CalendarLegend items={['ok', 'few', 'no', 'booked']} />
        </Panel>

        <h2 className={styles.h}>업체 카드</h2>
        <div className={styles.grid4}>
          {getVendorsByIds([1, 4, 3, 5]).map((v) => <VendorCard key={v.id} vendor={v} reasons={v.id === 1 ? ['#클래식 일치', '예산 범위 안'] : undefined} />)}
        </div>

        <h2 className={styles.h}>후기 카드</h2>
        <div className={styles.stack}>
          {getReviews().slice(0, 2).map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      </div>
    </div>
  );
}
