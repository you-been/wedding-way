import { REGION_GROUPS, type ServiceArea } from '../../data/regions';
import Chip, { ChipGroup } from '../ui/Chip';
import styles from './AreaPicker.module.css';

const toggle = (list: string[], x: string) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

/** 업체 활동 지역 고르기: 전국 출장 · 온라인 진행(고르면 지역 선택은 비활성화) 또는 시 · 도(여러 개) → 시 · 도마다 세부 지역(비우면 전체) */
export default function AreaPicker({ value, onChange }: { value: ServiceArea; onChange: (next: ServiceArea) => void }) {
  const { areas } = value;
  const regionOff = value.nationwide || value.online; // 지역과 상관없이 활동 → 지역 선택 안 함
  const setAreas = (next: ServiceArea['areas']) => onChange({ ...value, areas: next });
  const toggleSido = (sido: string) => {
    const next = { ...areas };
    if (sido in next) delete next[sido]; else next[sido] = [];
    // 시 · 도 순서를 목록 순서대로 유지
    setAreas(Object.fromEntries(REGION_GROUPS.filter((g) => g.name in next).map((g) => [g.name, next[g.name]])));
  };
  // 전국 출장 · 온라인을 켜면 골라 둔 지역은 비움 (숨은 값이 디렉토리 검색에 섞이지 않게)
  const toggleReach = (key: 'nationwide' | 'online') => {
    const on = !value[key];
    onChange({ ...value, [key]: on, areas: on ? {} : areas });
  };

  return (
    <div className={styles.picker}>
      <div className={styles.reach}>
        <small>지역과 상관없이 활동해요</small>
        <ChipGroup label="전국 출장 · 온라인 진행">
          <Chip active={value.nationwide} onClick={() => toggleReach('nationwide')}>전국 출장 가능</Chip>
          <Chip active={value.online} onClick={() => toggleReach('online')}>온라인 진행</Chip>
        </ChipGroup>
      </div>
      <fieldset className={styles.region} disabled={regionOff}>
        <legend>활동하는 시 · 도</legend>
        {regionOff && <p className={styles.off}>전국 출장 · 온라인 업체는 지역을 고르지 않아요. 디렉토리에서 ‘전국 출장 가능’ · ‘온라인 진행’으로 찾을 수 있어요.</p>}
        <ChipGroup label="시 · 도">
          {REGION_GROUPS.map((g) => <Chip key={g.name} active={g.name in areas} onClick={() => toggleSido(g.name)}>{g.name}</Chip>)}
        </ChipGroup>
        {REGION_GROUPS.filter((g) => g.name in areas).map((g) => {
          const subs = areas[g.name];
          return (
            <div key={g.name} className={styles.subs}>
              <small>{g.name} 세부 지역 · 여러 개 선택 가능</small>
              <ChipGroup label={`${g.name} 세부 지역`}>
                <Chip active={!subs.length} onClick={() => setAreas({ ...areas, [g.name]: [] })}>{g.name} 전체</Chip>
                {g.subs.map((sub) => <Chip key={sub} active={subs.includes(sub)} onClick={() => setAreas({ ...areas, [g.name]: toggle(subs, sub) })}>{sub}</Chip>)}
              </ChipGroup>
            </div>
          );
        })}
      </fieldset>
      <p className={styles.hint}>예비부부가 디렉토리에서 지역으로 찾을 때 쓰여요. 세부 지역을 고르지 않으면 시 · 도 전체로 보여요.</p>
    </div>
  );
}
