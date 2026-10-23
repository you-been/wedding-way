import { REGION_GROUPS, type ServiceArea } from '../../data/regions';
import Chip, { ChipGroup } from '../ui/Chip';
import styles from './AreaPicker.module.css';

const toggle = (list: string[], x: string) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

/** 업체 활동 지역 고르기: 시 · 도(여러 개) → 시 · 도마다 세부 지역(비우면 전체) + 전국 출장 · 온라인 진행 */
export default function AreaPicker({ value, onChange }: { value: ServiceArea; onChange: (next: ServiceArea) => void }) {
  const { areas } = value;
  const setAreas = (next: ServiceArea['areas']) => onChange({ ...value, areas: next });
  const toggleSido = (sido: string) => {
    const next = { ...areas };
    if (sido in next) delete next[sido]; else next[sido] = [];
    // 시 · 도 순서를 목록 순서대로 유지
    setAreas(Object.fromEntries(REGION_GROUPS.filter((g) => g.name in next).map((g) => [g.name, next[g.name]])));
  };

  return (
    <div className={styles.picker}>
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
      <div className={styles.reach}>
        <small>지역과 상관없이</small>
        <ChipGroup label="출장 · 온라인">
          <Chip active={value.nationwide} onClick={() => onChange({ ...value, nationwide: !value.nationwide })}>전국 출장 가능</Chip>
          <Chip active={value.online} onClick={() => onChange({ ...value, online: !value.online })}>온라인 진행</Chip>
        </ChipGroup>
      </div>
      <p className={styles.hint}>예비부부가 디렉토리에서 지역으로 찾을 때 쓰여요. 세부 지역을 고르지 않으면 시 · 도 전체로 보여요.</p>
    </div>
  );
}
