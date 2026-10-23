// 활동 지역: 시 · 도(디렉토리 필터 단위)와 세부 지역. 업체 등록 · 디렉토리 필터 · 업체 카드 표시가 같이 씀

export interface RegionGroup { name: string; subs: string[] }

/** 시 · 도와 세부 지역 (서울은 구, 경기는 시 · 군과 인천, 나머지는 광역시 · 도) */
export const REGION_GROUPS: RegionGroup[] = [
  { name: '서울', subs: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'] },
  { name: '경기', subs: ['인천', '수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '김포시', '광명시', '광주시', '하남시', '군포시', '오산시', '이천시', '양주시', '구리시', '안성시', '포천시', '의왕시', '여주시', '동두천시', '과천시', '가평군', '양평군', '연천군'] },
  { name: '경상', subs: ['부산', '대구', '울산', '경남', '경북'] },
  { name: '전라', subs: ['광주', '전북', '전남'] },
  { name: '충청', subs: ['대전', '세종', '충북', '충남'] },
  { name: '제주', subs: ['제주시', '서귀포시'] },
];

/** 업체 활동 지역: 시 · 도별 세부 지역(빈 배열 = 시 · 도 전체) + 전국 출장 · 온라인 진행 */
export interface ServiceArea {
  areas: Record<string, string[]>;
  nationwide: boolean;
  online: boolean;
}
export const EMPTY_AREA: ServiceArea = { areas: {}, nationwide: false, online: false };

/** 세부 지역 이름: 서울 · 경기 시군구는 앞에 시 · 도를 붙이고, 광역시 · 도(부산 · 인천 등)는 그대로 */
export const subLabel = (sido: string, sub: string) => ((sido === '서울' || sido === '경기') && sub !== '인천' ? `${sido} ${sub}` : sub);

/** 화면 표시용 한 줄: '서울 강남구', '서울 · 경기', '서울 성동구 외 1 · 전국 출장', '온라인' */
export function areaLabel(a: ServiceArea) {
  const parts = Object.entries(a.areas).map(([sido, subs]) => {
    if (!subs.length) return sido;
    return subs.length === 1 ? subLabel(sido, subs[0]) : `${subLabel(sido, subs[0])} 외 ${subs.length - 1}`;
  });
  if (a.nationwide) parts.push('전국 출장');
  if (a.online) parts.push('온라인');
  return parts.join(' · ');
}

/** 고른 시 · 도(세부 지역은 여러 개, 비우면 전체)에서 활동하는지 */
export function inArea(a: ServiceArea, sido: string, subs: string[]) {
  const mine = a.areas[sido];
  if (!mine) return false;
  return !subs.length || !mine.length || mine.some((s) => subs.includes(s));
}

/** 검색용: 시 · 도 · 세부 지역 이름 모두 */
export const areaWords = (a: ServiceArea) => [
  ...Object.entries(a.areas).flatMap(([sido, subs]) => [sido, ...subs]),
  ...(a.nationwide ? ['전국'] : []),
  ...(a.online ? ['온라인'] : []),
];
