// 후기 더미 데이터 (프로토타입) — 사진은 업체 목업 사진

export interface Review {
  id: number;
  who: string;
  when: string;
  vendor: string; // '업체명 · 업종'
  stars: number;
  verified: boolean;
  price: string;
  extra: string; // 추가금 안내
  photos: string[];
  text: string;
}

export const REVIEWS: Review[] = [
  { id: 1, who: '민트초코', when: '2026.09 본식', vendor: '필름하루 스냅 · 아이폰스냅', stars: 5, verified: true, price: '48만 원', extra: '추가금 없음', photos: ['biz_07', 'biz_08', 'biz_03'], text: '원본을 정말 다 주셔서 놀랐어요. 보정본도 2주 안에 와서 모바일 청첩장에 바로 썼습니다. 제주 바람 많이 불었는데 오히려 그걸 살려서 찍어주셨어요.' },
  { id: 2, who: '봄날의곰', when: '2026.10 본식', vendor: '오월의 헤어 · 헤어변형', stars: 5, verified: true, price: '55만 원', extra: '추가금 없음', photos: ['biz_01', 'biz_11'], text: '스튜디오 일정 잡자마자 바로 예약했는데도 겨우 잡았어요. 컨셉별로 4번 변형해주셨고 사진 결과물에서 차이가 확실히 납니다.' },
  { id: 3, who: '두부', when: '2026.08 본식', vendor: '플랜비 웨딩 · 플래너', stars: 4, verified: true, price: '동행 120만 원', extra: '사전 안내된 추가금', photos: [], text: '일부동행으로 진행했어요. 제휴 안 된 인디 드레스숍도 같이 봐주셔서 좋았고, 견적 비교표를 정리해주셔서 결정이 빨랐어요.' },
  { id: 4, who: '여름밤', when: '2026.07 본식', vendor: '라메르 빈티지 · 드레스', stars: 5, verified: false, price: '-', extra: '-', photos: ['biz_02'], text: '빈티지 베일이 정말 예뻐요. 피팅비 없이 투어 가능했어요.' },
];
