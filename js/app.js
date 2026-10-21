/* =========================================================
   결심 프로토타입 — 화면 전환 & UI 인터랙션
   (서버/저장 기능 없음, 모든 데이터는 더미)
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- 더미 데이터 ---------- */
// icon: Lucide 아이콘 이름 (홈 카테고리 타일)
const CATEGORIES = [
  { name: '전체', ico: '✦', icon: 'layout-grid' },
  { name: '플래너', ico: '☰', icon: 'clipboard-list' },
  { name: '웨딩홀', ico: '⌂', icon: 'church' },
  { name: '스튜디오', ico: '◫', icon: 'aperture' },
  { name: '드레스', ico: '♢', icon: 'sparkles' },
  { name: '메이크업', ico: '✿', icon: 'brush' },
  { name: '헬퍼', ico: '♡', icon: 'hand-heart' },
  { name: '헤어변형', ico: '∿', icon: 'scissors' },
  { name: '아이폰스냅', ico: '▢', icon: 'smartphone' },
  { name: '본식스냅', ico: '◎', icon: 'camera' },
  { name: '식전영상', ico: '▶', icon: 'clapperboard' },
  { name: '웨딩플라워', ico: '❀', icon: 'flower-2' },
  { name: '웨딩소품', ico: '✧', icon: 'gift' },
  { name: '모바일청첩장', ico: '✉', icon: 'mail' },
  { name: '본식사회자', ico: '♪', icon: 'mic' },
  { name: '축의대', ico: '₩', icon: 'wallet' },
  { name: '예복·한복', ico: '◇', icon: 'shirt' },
];

// 업체 목업 사진 (images/biz_XX.jpg · 프로토타입용) — 사진 없는 업체는 그라데이션 플레이스홀더
const VENDOR_IMG = {
  2: 'biz_01', // 오월의 헤어 · 헤어변형
  4: 'biz_02', // 라메르 빈티지 · 드레스
  6: 'biz_14', // 모먼트 본식스냅 · 본식스냅
  8: 'biz_04', // 들꽃 아틀리에 · 웨딩플라워
  14: 'biz_05', // 소소한 소품 · 웨딩소품
  9: 'biz_06', // 스튜디오 무드 · 스튜디오
  1: 'biz_07', // 필름하루 스냅 · 아이폰스냅
  16: 'biz_08', // 제주 바람스냅 · 야외스냅
  5: 'biz_09', // 하우스 오브 린넨 · 웨딩홀
  15: 'biz_10', // 테일러 정 · 예복·한복
  10: 'biz_11', // 결 메이크업 · 메이크업
  7: 'biz_12', // 오늘의 청첩 · 모바일청첩장
  19: 'biz_13', // 블룸 플라워랩 · 웨딩플라워
  20: 'biz_15', // 화이트룸 스튜디오 · 스튜디오
  21: 'biz_16', // 단아 한복 · 예복·한복
  22: 'biz_17', // 플레이풀 스튜디오 · 스튜디오
  23: 'biz_18', // 메종 드 리본 · 드레스
};
const vendorImg = (id) => (VENDOR_IMG[id] ? `images/${VENDOR_IMG[id]}.jpg` : null);

// 홈 사진 피드: 사진이 있는 업체만
const FEED = [1, 4, 20, 8, 5, 21, 9, 14, 23, 10, 6, 2, 22, 19, 15, 16, 7];

// 카테고리별 시장 평균가 (프로토타입용 예시) — 가격 비공개 업체에 참고용으로 표시
const CATEGORY_AVG = {
  플래너: '동행 80~150만 원', 웨딩홀: '식대 5~8만 원', 스튜디오: '150~250만 원', 드레스: '200~350만 원',
  메이크업: '40~70만 원', 헬퍼: '15~30만 원', 헤어변형: '40~60만 원', 아이폰스냅: '40~55만 원',
  본식스냅: '80~150만 원', 식전영상: '20~40만 원', 웨딩플라워: '20~40만 원', 웨딩소품: '5~20만 원',
  모바일청첩장: '3~8만 원', 본식사회자: '30~50만 원', 축의대: '15~25만 원', '예복·한복': '80~150만 원',
};

// price: null → 가격 비공개('상담 후 안내'), schedule: false → 일정 미공개('일정 문의')
const VENDORS = [
  { id: 1, name: '필름하루 스냅', cat: '아이폰스냅', region: '서울 · 제주', type: '1인 작가', price: '35~75만 원', tier: '표준', insta: true, intro: true, moods: ['#야외스냅', '#필름감성', '#내추럴'], verified: 30, rating: 4.9, reviews: 38, ph: 1, h: 220 },
  { id: 2, name: '오월의 헤어', cat: '헤어변형', region: '서울 강남', type: '1인 숍', price: '40~60만 원', tier: '표준', insta: true, intro: false, moods: ['#유니크헤어', '#빈티지'], verified: 41, rating: 4.8, reviews: 52, ph: 5, h: 260 },
  { id: 3, name: '플랜비 웨딩', cat: '플래너', region: '서울 · 경기', type: '프리랜서 플래너', price: '상담 무료 · 동행 120만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식', '#미니멀'], verified: 15, rating: 4.7, reviews: 21, ph: 2, h: 180 },
  { id: 4, name: '라메르 빈티지', cat: '드레스', region: '서울 성수', type: '빈티지 숍', price: '180~320만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#클래식'], verified: 33, rating: 4.9, reviews: 44, ph: 3, h: 280 },
  { id: 5, name: '하우스 오브 린넨', cat: '웨딩홀', region: '경기 양평', type: '하우스 웨딩', price: null, tier: '표준', insta: true, intro: false, moods: ['#하우스웨딩', '#내추럴'], verified: 9, rating: 4.6, reviews: 17, ph: 4, h: 200 },
  { id: 6, name: '모먼트 본식스냅', cat: '본식스냅', region: '전국', type: '2인 팀', price: '90~150만 원', tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#필름감성'], verified: 50, rating: 4.8, reviews: 63, ph: 6, h: 240 },
  { id: 7, name: '오늘의 청첩', cat: '모바일청첩장', region: '온라인', type: '미니게임 청첩장', price: '3~8만 원', tier: '가성비', insta: false, intro: true, moods: ['#미니멀'], verified: 90, rating: 4.9, reviews: 120, ph: 2, h: 190 },
  { id: 8, name: '들꽃 아틀리에', cat: '웨딩플라워', region: '서울 연남', type: '1인 플로리스트', price: '부케 15~35만 원', tier: '표준', insta: true, intro: false, moods: ['#내추럴', '#빈티지', '#야외스냅'], verified: 18, rating: 4.7, reviews: 29, ph: 1, h: 250 },
  { id: 9, name: '스튜디오 무드', cat: '스튜디오', region: '서울 청담', type: '스튜디오', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 30, rating: 4.6, reviews: 48, ph: 6, h: 210 },
  { id: 10, name: '결 메이크업', cat: '메이크업', region: '서울 압구정', type: '원장 1:1', price: '40~70만 원', tier: '표준', insta: false, intro: false, moods: ['#클래식', '#내추럴'], verified: 22, rating: 4.8, reviews: 36, ph: 5, h: 230 },
  { id: 11, name: '프레임 필름', cat: '식전영상', region: '온라인', type: '1인 제작', price: '15~40만 원', tier: '가성비', insta: false, intro: false, moods: ['#필름감성'], verified: 20, rating: 4.7, reviews: 27, ph: 3, h: 180 },
  { id: 12, name: '목소리 좋은 MC 지훈', cat: '본식사회자', region: '서울 · 경기', type: '전문 사회자', price: '30~50만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식'], verified: 28, rating: 4.9, reviews: 41, ph: 4, h: 200 },
  { id: 13, name: '굿모먼트 축의대', cat: '축의대', region: '서울 · 경기', type: '대행 서비스', price: '15~25만 원', tier: '가성비', insta: false, intro: false, moods: ['#미니멀'], verified: 5, rating: 4.5, reviews: 12, ph: 2, h: 170 },
  { id: 14, name: '소소한 소품', cat: '웨딩소품', region: '온라인', type: '핸드메이드', price: '1~20만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#하우스웨딩'], verified: 60, rating: 4.8, reviews: 88, ph: 1, h: 210 },
  { id: 15, name: '테일러 정', cat: '예복·한복', region: '서울 종로', type: '맞춤 예복', price: null, schedule: false, tier: '표준', insta: false, intro: false, moods: ['#클래식'], verified: 10, rating: 4.7, reviews: 19, ph: 6, h: 240 },
  { id: 16, name: '제주 바람스냅', cat: '아이폰스냅', region: '제주', type: '1인 작가', price: '45~90만 원', tier: '표준', insta: true, intro: true, moods: ['#야외스냅', '#내추럴'], verified: 45, rating: 4.9, reviews: 57, ph: 4, h: 270 },
  { id: 17, name: '손길 웨딩헬퍼', cat: '헬퍼', region: '서울 · 경기', type: '1인 헬퍼', price: '본식 15~25만 원', tier: '가성비', insta: false, intro: true, moods: ['#클래식'], verified: 25, rating: 4.9, reviews: 34, ph: 5, h: 200 },
  { id: 18, name: '하루 헬퍼팀', cat: '헬퍼', region: '전국', type: '2인 팀', price: '본식+2부 20~35만 원', tier: '표준', insta: false, intro: false, moods: ['#내추럴'], verified: 8, rating: 4.7, reviews: 15, ph: 3, h: 230 },
  { id: 19, name: '블룸 플라워랩', cat: '웨딩플라워', region: '서울 한남', type: '플라워 스튜디오', price: '부케 20~45만 원', tier: '표준', insta: true, intro: true, moods: ['#클래식', '#하우스웨딩'], verified: 24, rating: 4.8, reviews: 31, ph: 5, h: 240 },
  { id: 20, name: '화이트룸 스튜디오', cat: '스튜디오', region: '서울 성수', type: '실내 스튜디오', price: '180~260만 원', tier: '표준', insta: true, intro: true, moods: ['#미니멀', '#클래식'], verified: 27, rating: 4.8, reviews: 39, ph: 2, h: 260 },
  { id: 21, name: '단아 한복', cat: '예복·한복', region: '서울 종로', type: '한복 대여 · 맞춤', price: '대여 25~45만 원', tier: '가성비', insta: true, intro: true, moods: ['#클래식', '#빈티지'], verified: 35, rating: 4.9, reviews: 46, ph: 6, h: 250 },
  { id: 22, name: '플레이풀 스튜디오', cat: '스튜디오', region: '서울 망원', type: '캐주얼 웨딩 스튜디오', price: '120~190만 원', tier: '가성비', insta: true, intro: false, moods: ['#내추럴', '#빈티지'], verified: 19, rating: 4.7, reviews: 26, ph: 4, h: 230 },
  { id: 23, name: '메종 드 리본', cat: '드레스', region: '서울 청담', type: '수입 드레스 숍', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 21, rating: 4.8, reviews: 30, ph: 1, h: 280 },
];

const REVIEWS = [
  { who: '민트초코', when: '2026.09 본식', vendor: '필름하루 스냅 · 아이폰스냅', stars: 5, verified: true, price: '48만 원', extra: '추가금 없음', photos: ['biz_07', 'biz_08', 'biz_03'], text: '원본을 정말 다 주셔서 놀랐어요. 보정본도 2주 안에 와서 모바일 청첩장에 바로 썼습니다. 제주 바람 많이 불었는데 오히려 그걸 살려서 찍어주셨어요.', imgs: 3 },
  { who: '봄날의곰', when: '2026.10 본식', vendor: '오월의 헤어 · 헤어변형', stars: 5, verified: true, price: '55만 원', extra: '추가금 없음', photos: ['biz_01', 'biz_11'], text: '스튜디오 일정 잡자마자 바로 예약했는데도 겨우 잡았어요. 컨셉별로 4번 변형해주셨고 사진 결과물에서 차이가 확실히 납니다.', imgs: 2 },
  { who: '두부', when: '2026.08 본식', vendor: '플랜비 웨딩 · 플래너', stars: 4, verified: true, price: '동행 120만 원', extra: '사전 안내된 추가금', text: '일부동행으로 진행했어요. 제휴 안 된 인디 드레스숍도 같이 봐주셔서 좋았고, 견적 비교표를 정리해주셔서 결정이 빨랐어요.', imgs: 0 },
  { who: '여름밤', when: '2026.07 본식', vendor: '라메르 빈티지 · 드레스', stars: 5, verified: false, price: '-', extra: '-', photos: ['biz_02'], text: '빈티지 베일이 정말 예뻐요. 피팅비 없이 투어 가능했어요.', imgs: 1 },
];

/* 추가 위시리스트 — 분류별 목록 (평균가는 프로토타입 예시, 만 원) */
const WISH_GROUPS = [
  { id: 'shoot', name: '촬영', icon: 'camera' },
  { id: 'beauty', name: '뷰티', icon: 'sparkles' },
  { id: 'stage', name: '본식 연출', icon: 'mic' },
  { id: 'deco', name: '꾸밈 · 기타', icon: 'flower-2' },
];
const WISHLIST = [
  { g: 'shoot', name: '아이폰스냅', cost: 30, d: '감성 아이폰 촬영 · 원본 제공' },
  { g: 'shoot', name: '본식스냅', cost: 100, d: '본식 당일 사진 작가' },
  { g: 'shoot', name: '본식 영상', cost: 80, d: '본식 DVD · 하이라이트 영상' },
  { g: 'shoot', name: '폐백 · 가족 촬영', cost: 20, d: '폐백 · 가족사진 추가 촬영' },
  { g: 'beauty', name: '헤어변형', cost: 40, d: '촬영 중 헤어 스타일 변경' },
  { g: 'beauty', name: '웨딩 네일', cost: 7, d: '본식 전 네일 케어' },
  { g: 'beauty', name: '피부 관리', cost: 20, d: '본식 전 피부 관리 코스' },
  { g: 'beauty', name: '혼주 메이크업', cost: 25, d: '양가 어머님 헤어 · 메이크업' },
  { g: 'stage', name: '식전영상', cost: 15, d: '입장 전 상영 영상' },
  { g: 'stage', name: '본식 사회자', cost: 30, d: '전문 사회자 섭외' },
  { g: 'stage', name: '축가', cost: 30, d: '전문 축가 가수' },
  { g: 'stage', name: '축의대 대행', cost: 20, d: '축의금 접수 대행' },
  { g: 'stage', name: '웨딩 헬퍼', cost: 20, d: '본식 당일 신부 도우미' },
  { g: 'stage', name: '2부 드레스', cost: 30, d: '피로연 · 2부 드레스 대여' },
  { g: 'deco', name: '본식 부케', cost: 30, d: '본식 부케 · 부토니에' },
  { g: 'deco', name: '촬영 부케', cost: 20, d: '스튜디오 · 야외 촬영용 부케' },
  { g: 'deco', name: '본식 꽃장식 업그레이드', cost: 50, d: '버진로드 · 단상 꽃장식' },
  { g: 'deco', name: '웨딩 소품', cost: 10, d: '포토테이블 · 소품' },
  { g: 'deco', name: '모바일 청첩장', cost: 3, d: '디자인 청첩장' },
  { g: 'deco', name: '종이 청첩장', cost: 20, d: '디자인 · 인쇄 · 봉투' },
  { g: 'deco', name: '답례품', cost: 40, d: '하객 답례품' },
];

/* 기본 항목 (본식 · 스 · 드 · 메) — 평균가는 AVG_COST 한곳에서 관리
   선택 상태는 ③ 예산 항목과 연결: 본식 = 예식장 · 식대, 촬영 · 드레스 · 메이크업 = 스드메 하위 */
const BASIC_ITEMS = [
  { id: 'hall', name: '본식 (예식장 · 식대)', d: '대관 · 식대 · 기본 연출' },
  { id: 'shoot', name: '촬영', options: [
    { id: 'studio', name: '스튜디오', d: '실내 스튜디오 촬영' },
    { id: 'outdoor', name: '야외스냅', d: '야외 · 제주 등 로케이션 촬영 (드레스 제외)' },
  ] },
  { id: 'dress', name: '드레스', d: '촬영 · 본식 드레스', dNoShoot: '본식 드레스' },
  { id: 'makeup', name: '메이크업', d: '촬영 · 본식 헤어 · 메이크업', dNoShoot: '본식 헤어 · 메이크업' },
];
const SHOOT_IDS = ['studio', 'outdoor']; // 둘 중 하나만

/* 예산 항목 — 기본 5개 (결심 기준표 항목). 모두 뺄 수 있음
   스드메는 묶음 항목: 하위(스튜디오 · 드레스 · 메이크업)를 각각 조절하고 뺄 수 있음 (share: 스드메 안 기본 비율)
   기타 준비 비용 = 위시리스트 예산 */
const BUDGET_CATALOG = [
  { id: 'hall', name: '예식장 · 식대', color: '#ff7aa2' },
  { id: 'sdm', name: '스드메', color: '#212224', subs: [
    { id: 'studio', name: '스튜디오', share: 0.40 },
    { id: 'outdoor', name: '야외스냅', share: 0.40, optional: true }, // 스튜디오 대신 고를 때만
    { id: 'dress', name: '드레스', share: 0.35 },
    { id: 'makeup', name: '메이크업', share: 0.25 },
  ] },
  { id: 'jewelry', name: '예물', color: '#6c8cff' },
  { id: 'suit', name: '예복', color: '#5fc4a0' },
  { id: 'honeymoon', name: '신혼여행', color: '#f5b83d' },
  { id: 'etc', name: '기타 준비 비용', color: '#c8cad2' },
];

/* 결심 기준표 (만 원) — 항목별 [가성비형, 표준형, 고급형] 의 [최소, 최대]
   가성비형 '기타 준비 비용'은 기준표에 없어서 임시값(100~200만 원) */
const REF_TABLE = {
  hall: [[1800, 2100], [1900, 2400], [2500, 4000]],
  sdm: [[350, 550], [500, 800], [800, 1500]],
  // 기준표의 '예물 · 예복' 구간을 예물 7 : 예복 3 비율로 나눔
  jewelry: [[105, 245], [280, 630], [700, 1750]],
  suit: [[45, 105], [120, 270], [300, 750]],
  honeymoon: [[200, 400], [400, 800], [800, 1500]],
  etc: [[100, 200], [300, 600], [500, 1000]],
};
/* 항목 평균가 (만 원) — 항목 금액 계산 기준. 기준표 표준형 중간값 기준 예시
   기타 준비 비용의 평균가 = 선택한 위시리스트 합계 */
const AVG_COST = { hall: 2000, studio: 150, outdoor: 140, dress: 130, makeup: 90, jewelry: 240, suit: 120, honeymoon: 800 };
const CUSTOM_MAX = 10000; // 직접 추가한 항목은 평균가 없이 0 ~ 1억 원(만 원 단위)을 직접 정함
// 촬영(스튜디오 · 야외스냅)을 안 하면 드레스 · 메이크업은 본식만 — 평균가가 낮아짐
const AVG_NO_SHOOT = { dress: 80, makeup: 60 };
const noShoot = () => !SHOOT_IDS.some(hasSub);
const avgOf = (id) => (noShoot() && AVG_NO_SHOOT[id] != null ? AVG_NO_SHOOT[id] : AVG_COST[id]);

/* 예식장 · 식대 추천 계산 (프로토타입 예시 단가, 만 원)
   예상 비용 = 1인 식대 × 지역 계수 × 하객 수 + 대관료(유형 · 지역별 대표값) */
const HALL_TYPES = [
  { id: 'hall', name: '웨딩홀', d: '가장 일반적인 예식장', meal: 6.5, base: { gangnam: 800, seoul: 700, metro: 400, city: 250, jeju: 200, local: 200 } },
  { id: 'hotel', name: '호텔', d: '호텔 연회장 · 고급 코스 식사', meal: 13, base: { gangnam: 1400, seoul: 1100, metro: 700, city: 500, jeju: 600, local: 400 } },
  { id: 'house', name: '하우스 · 스몰웨딩', d: '소규모 단독 공간', meal: 9, base: { gangnam: 1100, seoul: 800, metro: 600, city: 400, jeju: 500, local: 350 } },
  { id: 'outdoor', name: '야외', d: '가든 · 야외 정원 예식', meal: 8, base: { gangnam: 1400, seoul: 1100, metro: 800, city: 500, jeju: 800, local: 500 } },
  { id: 'chapel', name: '종교시설', d: '성당 · 교회 · 사찰', meal: 5, base: { gangnam: 250, seoul: 200, metro: 150, city: 100, jeju: 100, local: 100 } },
];
const HALL_REGIONS = [
  { id: 'gangnam', name: '서울 강남권', rate: 1.25 },
  { id: 'seoul', name: '서울 기타', rate: 1.1 },
  { id: 'metro', name: '경기 · 인천', rate: 1.0 },
  { id: 'city', name: '광역시', rate: 0.9 },
  { id: 'local', name: '그 외 지역', rate: 0.8 },
  { id: 'jeju', name: '제주', rate: 1.0 },
];
const GUEST_OPTIONS = [50, 100, 150, 200, 300];

function hallEstimate({ type, region, guests }) {
  const t = HALL_TYPES.find((x) => x.id === type);
  const r = HALL_REGIONS.find((x) => x.id === region);
  const meal = t.meal * r.rate;
  const base = t.base[r.id];
  return { meal, base, food: meal * guests, total: Math.round(meal * guests + base) };
}
const SDM_AVG = AVG_COST.studio + AVG_COST.dress + AVG_COST.makeup; // 스드메 기준표 구간을 하위 항목에 나눌 때 기준
const CUSTOM_COLORS = ['#9c8cf0', '#ffb38a', '#7fb8e6', '#d9a0e0', '#8fd18f'];
const makeBudgetCat = (c) => ({ ...c, w: 1, open: false, subs: c.subs ? c.subs.filter((s) => !s.optional).map((s) => ({ ...s, w: 1 })) : null });

/* 타임라인 단계 (기획서 표준 타임라인 기준) */
const TL_PHASES = [
  { title: '준비 시작 & 웨딩홀', from: 12, to: 10 },
  { title: '준비 방식 & 스드메', from: 10, to: 8 },
  { title: '주요 계약', from: 8, to: 6 },
  { title: '촬영 준비', from: 6, to: 4 },
  { title: '청첩장 & 본식 준비', from: 4, to: 2 },
  { title: '최종 점검', from: 1, to: 0 },
];

/* 기본 제안 항목 (세분화) — [단계, id, 제목, 설명, 관련 링크, 태그] */
const DIR = (cat) => ['업체 보기', `#directory?cat=${cat}`];
const TL_DEFAULT = [
  [0, 'greet', '양가 인사', '양가 부모님께 인사 드리고 결혼 허락 받기'],
  [0, 'budget', '예산 논의', '양가 지원금과 우리 예산을 맞춰 총예산 정하기', ['예산 진단', '#budget']],
  [0, 'hall-tour', '웨딩홀 투어', '인기 홀은 1년 전 예약 오픈 시점에 바로 투어', DIR('웨딩홀')],
  [0, 'hall-contract', '웨딩홀 계약', '날짜와 대략적인 하객 규모가 여기서 정해져요'],
  [1, 'method', '준비 방식 결정', '플래너(동행 · 비동행 · 일부동행) vs 워크인', ['새내기 가이드', '#guide']],
  [1, 'planner', '플래너 상담', '동행 범위와 스드메 조합 상담', DIR('플래너'), '플래너 이용 시'],
  [1, 'studio', '스튜디오 선정', '토탈 vs 비토탈 함께 결정', DIR('스튜디오')],
  [1, 'dress-shop', '드레스샵 선정', '촬영 · 본식 드레스샵 정하기', DIR('드레스')],
  [1, 'makeup', '메이크업 선정', '촬영 · 본식 메이크업 숍 정하기', DIR('메이크업')],
  [1, 'main-snap', '본식스냅 예약', '인기 작가는 일찍 마감돼요', DIR('본식스냅')],
  [1, 'iphone-snap', '아이폰/야외스냅 예약', '제주 · 야외 촬영은 날씨 좋은 날짜가 빨리 차요', DIR('아이폰스냅')],
  [2, 'meet', '상견례', '양가 부모님 일정 조율'],
  [2, 'honeymoon', '신혼여행 예약', '해외는 항공권 가격 변동을 고려해 미리 예약'],
  [2, 'suit', '예복 맞춤/대여', '제작 기간과 촬영일을 역산해서 계약', DIR('예복·한복')],
  [2, 'ring-tour', '웨딩밴드 투어', '제작에 2~3달 걸려요'],
  [2, 'ring-contract', '웨딩밴드 계약', '촬영 2~3달 전까지 계약'],
  [3, 'dress-tour', '드레스 투어', '2~3곳 방문, 본식 드레스 4벌 정도 피팅', DIR('드레스')],
  [3, 'hair', '헤어변형 예약', '1인 숍이 많아 스튜디오 일정 확정 직후 바로 예약', DIR('헤어변형')],
  [3, 'shoot-dress', '촬영 드레스 셀렉', '6벌 정도 피팅 후 촬영용 3~4벌 결정', null, '비토탈'],
  [3, 'shoot', '스튜디오 촬영', '야외/실내 스튜디오 촬영'],
  [4, 'photo-select', '사진 셀렉', '촬영 원본에서 보정할 사진 고르기'],
  [4, 'retouch', '보정', '스튜디오 보정은 약 3개월 — 사설 보정도 고려'],
  [4, 'm-invite', '모바일 청첩장', '보정본 일정에 맞춰 제작', DIR('모바일청첩장')],
  [4, 'p-invite', '종이 청첩장', '디자인 · 수량 정하고 주문'],
  [4, 'hanbok', '혼주 한복 피팅', '양가 어머니 동행, 대여 또는 맞춤', DIR('예복·한복')],
  [4, 'invite-meet', '청첩장 모임', '지인 · 동료들에게 소식 전하기'],
  [4, 'video', '식전영상 제작', '사진 · 영상 소스 미리 모아두기', DIR('식전영상')],
  [4, 'mc', '사회자 섭외', '지인 또는 전문 사회자', DIR('본식사회자')],
  [4, 'flower', '부케/플라워 예약', '드레스 · 홀 분위기에 맞춰서', DIR('웨딩플라워')],
  [5, 'main-dress', '본식 드레스 셀렉', '본식 때 입을 드레스 최종 결정'],
  [5, 'fitting', '가봉', '체형에 맞게 가봉'],
  [5, 'final-meet', '본식 최종 미팅', '식순 · 음악 · 연출 확정'],
  [5, 'tasting', '시식', '웨딩홀 시식이 가능하면 진행'],
  [5, 'helper', '헬퍼 확정', '드레스샵 포함 여부 확인', DIR('헬퍼')],
  [5, 'gift-desk', '축의대 확정', '지인 또는 대행 서비스', DIR('축의대')],
  [5, 'wedding', '본식 당일', '축하해요! 🎉'],
  [5, 'trip', '신혼여행 출발', '즐거운 여행 되세요'],
];

/* ---------- 공통 ---------- */
// Lucide 아이콘 그리기 (CDN을 못 불러와도 화면은 동작)
const drawIcons = () => { try { window.lucide?.createIcons(); } catch { /* 아이콘 없이 진행 */ } };
// 다시 그려지는 목록 안에 바로 넣는 인라인 SVG ('pin' → Lucide Pin)
const icon = (name, size = 16) => {
  try {
    const node = window.lucide.icons[name.replace(/(^|-)(\w)/g, (_, _d, c) => c.toUpperCase())];
    const el = window.lucide.createElement(node);
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    el.setAttribute('aria-hidden', 'true');
    return el.outerHTML;
  } catch { return ''; }
};

const won = (man) => {
  man = Math.round(man);
  return man >= 10000 ? `${(man / 10000).toFixed(1)}억 원` : `${man.toLocaleString()}만 원`;
};

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

function priceHTML(price, cat) {
  if (price) return `<div class="v-price">${price}</div>`;
  const avg = CATEGORY_AVG[cat];
  return `<div class="v-price muted-price">상담 후 안내</div>${avg ? `<div class="v-avg">${cat} 평균 ${avg}</div>` : ''}`;
}

// 추천 이유: 내 무드 태그 · 진단 가격대 · 인증 후기만으로 계산 (중립 기준)
const myMoods = () => $$('#screen-onboarding .mood.active').map((m) => m.textContent.trim());
const TIER_ORDER = ['가성비', '표준', '프리미엄'];
const myTier = () => calcBudget().tier.key; // 총예산(직접 추가 항목 제외)으로 판정된 가격대

function recoReasons(v) {
  const reasons = [];
  const mood = v.moods.find((m) => myMoods().includes(m));
  if (mood) reasons.push(`${mood} 일치`);
  if (TIER_ORDER.indexOf(v.tier) <= TIER_ORDER.indexOf(myTier())) reasons.push('예산 범위 안');
  if (v.verified >= 30) reasons.push('인증 후기 많음');
  return reasons;
}

const whyHTML = (reasons) => (reasons.length ? `<div class="why">${reasons.map((r) => `<span>${r}</span>`).join('')}</div>` : '');

const catIcon = (cat) => CATEGORIES.find((c) => c.name === cat)?.icon || 'image';

// 사진 없는 업체: 카테고리 아이콘을 얹은 회색 면
function vendorCard(v, { masonry = false, reasons = null } = {}) {
  const h = masonry ? v.h : 180;
  return `
    <a class="v-card" href="#vendor" data-vendor="${v.id}">
      <div class="v-thumb" style="height:${h}px">
        ${vendorImg(v.id)
          ? `<img src="${vendorImg(v.id)}" alt="${v.name} · ${v.cat}" loading="lazy" />`
          : `<span class="v-empty" aria-hidden="true"><i data-lucide="${catIcon(v.cat)}"></i></span>`}
        <span class="like" data-auth="user" role="button" aria-label="${v.name} 찜하기" aria-pressed="false"><i data-lucide="bookmark"></i></span>
      </div>
      <div class="v-body">
        <span class="v-tag">${v.cat}</span>
        <h4>${v.name}</h4>
        <div class="v-meta">${v.region} · ${v.type}</div>
        ${priceHTML(v.price, v.cat)}
        ${reasons ? whyHTML(reasons) : ''}
        <div class="v-foot">
          <span class="v-rating"><i data-lucide="star"></i>${v.rating}</span>
          <span>후기 ${v.reviews}</span>
          <span class="verified"><i data-lucide="badge-check"></i>인증 ${v.verified}</span>
        </div>
      </div>
    </a>`;
}

// 후기 사진: 프로토타입용 업체 목업 사진(images/biz_XX.jpg)
function reviewCard(r) {
  const badge = r.verified ? '<span class="badge-verified"><i data-lucide="badge-check"></i>계약 인증</span>' : '<span class="badge-normal">일반 후기</span>';
  const imgs = r.photos?.length ? `<div class="review-imgs">${r.photos.map((p) => `<img src="images/${p}.jpg" alt="${r.vendor} 후기 사진" loading="lazy" />`).join('')}</div>` : '';
  return `
    <div class="review">
      <div class="review-top">
        <span class="avatar">${r.who[0]}</span>
        <span class="who">${r.who}<small>${r.when} · ${r.vendor}</small></span>
        ${badge}
      </div>
      <span class="stars-s" aria-label="별점 ${r.stars}점">${Array.from({ length: 5 }, (_, i) => `<i data-lucide="star" class="${i < r.stars ? 'on' : ''}"></i>`).join('')}</span>
      <p>${r.text}</p>
      ${r.verified ? `<div class="review-facts"><span class="tag">계약금액 ${r.price}</span><span class="tag ${r.extra === '추가금 없음' ? 'tag-ok' : 'tag-warn'}">${r.extra}</span></div>` : ''}
      ${imgs}
    </div>`;
}

function renderCalendar(el, { year, month, status }) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  let html = `<div class="cal-title">${year}년 ${month + 1}월</div>`;
  html += ['일', '월', '화', '수', '목', '금', '토'].map((d) => `<div class="dow">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += '<div class="d empty"></div>';
  for (let d = 1; d <= days; d++) html += `<div class="d ${status(d, (first + d - 1) % 7)}">${d}</div>`;
  el.innerHTML = html;
}

/* ---------- 라우터 ---------- */
let currentVendor = VENDORS[0];
let dirCat = '전체';

// 스플래시는 첫 방문 시 1회만 (선택하면 기억)
const SPLASH_KEY = 'ww-splash-done';
const splashDone = () => { try { return localStorage.getItem(SPLASH_KEY) === '1'; } catch { return false; } };
const markSplashDone = () => { try { localStorage.setItem(SPLASH_KEY, '1'); } catch { /* 저장 불가 환경 무시 */ } };

/* ---------- 로그인 · 회원가입 (프로토타입: 이 브라우저에만 저장) ---------- */
// 계정 유형: user(예비부부, SNS 가입) · biz(업체, 이메일 가입)
const AUTH_KEY = 'ww-auth';
let authUser = null;
try { authUser = JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { authUser = null; }

// 예비부부 ↔ 업체 모드: 메뉴 구성을 정함 (업체 모드 = '내 웨딩' 대신 '내 업체')
// 로그인하면 계정 유형에 맞춰 바뀌고, 헤더의 '결심 Biz' 스위치로 언제든 전환
const MODE_KEY = 'ww-mode';
const MODE_TIP_KEY = 'ww-biz-tip-closed';
let bizMode = authUser?.type === 'biz';
try { const m = localStorage.getItem(MODE_KEY); if (m) bizMode = m === 'biz'; } catch { /* 저장 불가 환경 무시 */ }

function setMode(biz) {
  bizMode = biz;
  try { localStorage.setItem(MODE_KEY, biz ? 'biz' : 'user'); } catch { /* 저장 불가 환경 무시 */ }
  applyMode();
}

function applyMode() {
  document.body.classList.toggle('is-biz', bizMode);
  const sw = $('.mode-switch');
  sw.classList.toggle('on', bizMode);
  sw.setAttribute('aria-checked', bizMode);
  // '내 업체': 업체 로그인 상태면 대시보드, 아니면 우리 업체 알리기
  $$('[data-role="biz"]').forEach((a) => a.setAttribute('href', authUser?.type === 'biz' ? '#partner-dash' : '#partner'));
  let tipClosed = false;
  try { tipClosed = localStorage.getItem(MODE_TIP_KEY) === '1'; } catch { /* 저장 불가 환경 무시 */ }
  $('#modeTip').hidden = bizMode || tipClosed;
}

function closeModeTip() {
  try { localStorage.setItem(MODE_TIP_KEY, '1'); } catch { /* 저장 불가 환경 무시 */ }
  $('#modeTip').hidden = true;
}

// 화면별 필요한 계정 유형 (없으면 비회원도 이용 가능)
const SCREEN_AUTH = { mypage: 'user', 'review-write': 'user', 'partner-join': 'biz', 'partner-dash': 'biz' };
const AUTH_COPY = {
  user: { title: '로그인하고 나만의 웨딩 계획을 짜보세요!', desc: '타임라인 · 예산 · 찜한 업체를 내 웨딩에 모아둘 수 있어요.' },
  biz: { title: '업체회원으로 로그인하고 우리 업체를 알려보세요!', desc: '업체 소개를 만들고 문의 · 일정을 한곳에서 관리해요.' },
};
const SNS_NAMES = { kakao: '카카오', naver: '네이버', google: 'Google' };
// SNS가 동의 후 넘겨주는 정보 (실서비스 기준: 카카오는 이름 · 연락처에 비즈앱 검수, 구글은 이름 · 이메일만 기본 제공)
const SNS_PROFILE = {
  kakao: { nick: '민지' },
  naver: { name: '김민지', nick: '민지', gender: 'F', birth: '1996-03-14', phone: '010-1234-5678' },
  google: { name: '김민지' },
};
const SNS_FIELD_LABELS = { name: '이름', nick: '닉네임', gender: '성별', birth: '생일', phone: '연락처' };
const DEMO_USER = { type: 'user', provider: 'kakao', name: '김민지', nick: '민지', phone: '010-1234-5678' };
let authNext = null; // 로그인 후 돌아갈 화면
let snsProvider = 'kakao';
let sbProof = null; // 업체 가입 시 올린 증빙: null · 'biz'(사업자 등록증) · 'free'(프리랜서)

const authLabel = (u) => (u.type === 'biz' ? u.bizName : u.nick);
const proofLabel = (kind) => (kind === 'free' ? '신분증 + 포트폴리오' : '사업자 등록증');

function saveAuth(u) {
  authUser = u;
  if (u) setMode(u.type === 'biz'); // 로그인한 계정 유형에 맞는 메뉴로
  try { if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u)); else localStorage.removeItem(AUTH_KEY); } catch { /* 저장 불가 환경 무시 */ }
  applyAuthUI();
}

function applyAuthUI() {
  const type = authUser?.type;
  applyMode();
  $$('[data-guest]').forEach((el) => { el.hidden = !!authUser; });
  $$('[data-member]').forEach((el) => { el.hidden = !authUser; });
  $$('[data-not-biz]').forEach((el) => { el.hidden = type === 'biz'; }); // 업체 회원에게는 후기 쓰기 · 예산에 담기 숨김
  document.body.classList.toggle('is-biz-user', type === 'biz'); // 업체 회원: 찜 버튼 숨김 (CSS)
  $('#gnbName').textContent = authUser ? `${authLabel(authUser)} 님` : '';
  if (type === 'user') renderCouple();
  if (type === 'biz') {
    renderBizHead();
    $('#pjName').value = authUser.bizName;
    $('#dashProof').hidden = !!authUser.proof;
    if ($('#screen-partner-dash').classList.contains('active')) renderBiz();
    $('#pjDoneMsg').textContent = authUser.proof
      ? '검토 후 24시간 이내에 예비부부에게 소개돼요.'
      : '프로필이 저장됐어요. 증빙 서류를 올리면 검토 후 예비부부에게 소개돼요.';
  }
}

// 로그인이 필요한 곳 → 로그인 화면으로 (로그인 후 next로 복귀)
function requireLogin(type, next) {
  location.hash = `#login?type=${type}&next=${encodeURIComponent(next)}`;
}

function renderLogin(params) {
  const type = params.get('type') === 'biz' ? 'biz' : 'user';
  authNext = params.get('next');
  const copy = authNext ? AUTH_COPY[type] : { title: '결심에 오신 걸 환영해요', desc: '로그인하고 우리만의 웨딩 계획을 이어가세요.' };
  $('#loginTitle').textContent = copy.title;
  $('#loginDesc').textContent = copy.desc;
  // 다른 유형 계정으로 로그인한 채 들어온 경우 안내
  const cur = $('#loginCurrent');
  cur.hidden = !authUser;
  if (authUser) {
    const kind = authUser.type === 'biz' ? '업체 계정' : '예비부부 계정';
    const need = type === 'biz' ? '업체회원' : '예비부부 회원';
    cur.innerHTML = authNext && authUser.type !== type
      ? `지금은 ${kind}(<b>${esc(authLabel(authUser))}</b>)으로 로그인되어 있어요. 이 기능은 ${need}만 이용할 수 있어요.`
      : `지금 ${kind}(<b>${esc(authLabel(authUser))}</b>)으로 로그인되어 있어요. 다른 계정으로 로그인하면 전환돼요.`;
  }
  showAuthTab(type);
  $('#bizLoginError').classList.remove('show');
}

function showAuthTab(type) {
  $$('.auth-tab').forEach((b) => b.classList.toggle('active', b.dataset.authtab === type));
  $$('.auth-panel').forEach((p) => p.classList.toggle('active', p.dataset.authpanel === type));
}

function finishLogin(u, msg, fallback) {
  saveAuth(u);
  toast(msg);
  const next = authNext && SCREEN_AUTH[authNext.split('?')[0]] !== (u.type === 'biz' ? 'user' : 'biz') ? authNext : fallback;
  authNext = null;
  location.replace(`#${next}`);
}

/* ---------- 짝꿍 초대 · 내 웨딩 연동 (프로토타입: 서버 없이 이 브라우저에 저장) ---------- */
// 실서비스에서는 초대 코드를 서버에서 발급하고, 카카오 공유 SDK(Kakao.Share)로 링크를 보냄
const COUPLE_KEY = 'ww-couple';
const INVITE_CODE = 'A7K2P9';
const DEMO_PARTNER = '준혁'; // 같은 브라우저로 시연할 때 수락하는 예시 짝꿍
let couple = null; // { a: 초대한 사람, b: 수락한 사람, since: 'YYYY-MM-DD' }
try { couple = JSON.parse(localStorage.getItem(COUPLE_KEY)); } catch { couple = null; }

const myNick = () => authUser?.nick || '민지';
const inviteUrl = () => `${location.href.split('#')[0]}#invite?code=${INVITE_CODE}&from=${encodeURIComponent(myNick())}`;

function saveCouple(c) {
  couple = c;
  try { if (c) localStorage.setItem(COUPLE_KEY, JSON.stringify(c)); else localStorage.removeItem(COUPLE_KEY); } catch { /* 저장 불가 환경 무시 */ }
  renderCouple();
}

// 내 웨딩 배너: 제목(민지 ♥ 준혁 님의 웨딩)과 짝꿍 영역
function renderCouple() {
  const me = myNick();
  $('#myTitle').textContent = couple ? `${couple.a} ♥ ${couple.b} 님의 웨딩` : `${me} 님의 웨딩`;
  $('#myCouple').innerHTML = couple
    ? `<span class="mc-avatars"><i>${esc(couple.a[0])}</i><i class="b">${esc(couple.b[0])}</i></span>
       <span class="mc-text"><b>${esc(couple.a === me ? couple.b : couple.a)} 님과 함께 관리 중</b><small><i data-lucide="link"></i>타임라인 · 예산 · 찜한 업체가 연동돼요</small></span>
       <button class="mc-btn ghost" data-action="invite-open">연동 관리</button>`
    : `<span class="mc-avatars"><i>${esc(me[0])}</i><i class="add"><i data-lucide="plus"></i></i></span>
       <span class="mc-text"><b>짝꿍과 함께 준비해요</b><small>초대하면 계획을 함께 보고 고칠 수 있어요</small></span>
       <button class="mc-btn" data-action="invite-open"><i data-lucide="user-plus"></i>짝꿍 초대하기</button>`;
  drawIcons();
}

const INVITE_PERKS = `
  <ul class="iv-perks">
    <li><span><i data-lucide="list-checks"></i></span><b>타임라인 함께 체크</b><small>한 명이 완료하면 둘 다 반영돼요</small></li>
    <li><span><i data-lucide="wallet"></i></span><b>예산 함께 관리</b><small>항목별 금액을 같이 정해요</small></li>
    <li><span><i data-lucide="bookmark"></i></span><b>찜한 업체 공유</b><small>서로 찜한 업체를 한곳에서 봐요</small></li>
  </ul>`;

function openInvite() {
  $('#ivTitle').textContent = couple ? '짝꿍과 연동 중' : '짝꿍 초대하기';
  $('#inviteBody').innerHTML = couple
    ? `<div class="iv-linked">
         <span class="mc-avatars lg"><i>${esc(couple.a[0])}</i><i class="b">${esc(couple.b[0])}</i></span>
         <b>${esc(couple.a)} ♥ ${esc(couple.b)}</b>
         <small>${couple.since.replaceAll('-', '.')}부터 내 웨딩을 함께 관리하고 있어요</small>
       </div>
       ${INVITE_PERKS}
       <button class="iv-unlink" data-action="invite-unlink"><i data-lucide="unlink"></i>연동 해제</button>`
    : `<p class="iv-lead">초대 링크를 받은 짝꿍이 수락하면, 내 웨딩을 함께 보고 고칠 수 있어요.</p>
       ${INVITE_PERKS}
       <button class="iv-kakao" data-action="invite-kakao"><i data-lucide="message-circle"></i>카카오톡으로 초대하기</button>
       <div class="iv-link">
         <input type="text" id="inviteUrl" readonly value="${esc(inviteUrl())}" aria-label="초대 링크" />
         <button class="ds-btn ds-btn-sm iv-copy" data-action="invite-copy"><i data-lucide="copy"></i>복사</button>
       </div>
       <p class="iv-note">링크는 7일 동안 유효해요. 한 명만 연동할 수 있어요.</p>
       <a class="iv-demo" href="#invite?code=${INVITE_CODE}&from=${encodeURIComponent(myNick())}" data-action="invite-close">프로토타입: 짝꿍이 받는 초대 화면 보기 →</a>`;
  $('#inviteModal').hidden = false;
  $('#inviteModalBg').hidden = false;
  document.body.classList.add('modal-open');
  drawIcons();
}

function closeInvite() {
  $('#inviteModal').hidden = true;
  $('#inviteModalBg').hidden = true;
  document.body.classList.remove('modal-open');
}

// 초대 링크로 들어온 화면
let pendingInvite = null;
function renderInvite(params) {
  const from = (params.get('from') || '민지').slice(0, 12);
  pendingInvite = { from, code: params.get('code') || INVITE_CODE };
  $('#ivFrom').textContent = from;
  $('#ivFrom2').textContent = from;
  $('#ivFromInitial').textContent = from[0];
  const note = $('#ivNote');
  if (couple) note.textContent = `이미 ${couple.a} ♥ ${couple.b} 님으로 연동되어 있어요. 수락하면 새로 연동돼요.`;
  else if (authUser?.type !== 'user') note.textContent = '수락하려면 로그인이 필요해요. 카카오로 3초 만에 시작할 수 있어요.';
  else if (authUser.nick === from) note.textContent = `프로토타입: 같은 브라우저라 짝꿍(${DEMO_PARTNER}) 계정으로 수락한 것처럼 처리해요.`;
  else note.textContent = '';
}

function acceptInvite() {
  if (authUser?.type !== 'user') { requireLogin('user', location.hash.slice(1)); return; }
  const { from } = pendingInvite || { from: '민지' };
  const partner = authUser.nick === from ? DEMO_PARTNER : authUser.nick;
  saveCouple({ a: from, b: partner, since: ymd(new Date()) });
  location.hash = '#mypage';
  toast(`${from} 님과 내 웨딩이 연동됐어요. 이제 함께 관리해요`);
}

// ① 일반: SNS 버튼 → (신규) 추가 정보 입력. 받아온 정보는 미리 채워두고 수정 가능
function renderSignupUser(params) {
  snsProvider = SNS_PROFILE[params.get('provider')] ? params.get('provider') : snsProvider;
  const got = SNS_PROFILE[snsProvider];
  $('#suProvider').textContent = `${SNS_NAMES[snsProvider]}로 가입 중`;
  $('#suName').value = got.name || '';
  $('#suNick').value = got.nick || '';
  $('#suBirth').value = got.birth || '';
  $('#suPhone').value = got.phone || '';
  $$('#suGender .chip').forEach((c) => c.classList.toggle('active', c.dataset.gender === got.gender));
  const fetched = Object.keys(got).map((k) => SNS_FIELD_LABELS[k]);
  $('#suFetched').hidden = false;
  $('#suFetched').innerHTML = `${SNS_NAMES[snsProvider]}에서 <b>${fetched.join(' · ')}</b>을(를) 받아왔어요. 확인 후 수정할 수 있어요.`
    + (snsProvider === 'kakao' ? '<br/><small class="muted">카카오는 이름 · 연락처를 받으려면 비즈앱 검수가 필요해 직접 입력받아요.</small>' : '');
  $('#suError').classList.remove('show');
}

const PHONE_RE = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;
function termsOk(box) { return $$('[data-term="req"]', box).every((c) => c.checked); }
function formError(el, msg) { el.textContent = msg; el.classList.add('show'); }

function signupUser() {
  const name = $('#suName').value.trim();
  const nick = $('#suNick').value.trim();
  const phone = $('#suPhone').value.trim();
  const err = $('#suError');
  if (!name) return formError(err, '이름을 입력해 주세요.');
  if (nick.length < 2) return formError(err, '닉네임을 2자 이상 입력해 주세요.');
  if (!PHONE_RE.test(phone)) return formError(err, '연락처를 010-0000-0000 형식으로 입력해 주세요.');
  if (!termsOk($('#suTerms'))) return formError(err, '필수 약관에 동의해 주세요.');
  err.classList.remove('show');
  finishLogin({
    type: 'user', provider: snsProvider, name, nick, phone,
    gender: $('#suGender .chip.active')?.dataset.gender || null,
    birth: $('#suBirth').value || null,
  }, `가입을 환영해요, ${nick} 님!`, 'mypage');
}

// ② 업체: 이메일 가입. 증빙 서류는 선택(디렉토리 공개 전에만 필요)
function renderSignupBiz() {
  $('#sbError').classList.remove('show');
  updateProofUI();
}

function updateProofUI() {
  const kind = $('.proof-opts .option-card.active').dataset.proof;
  $('#sbPortfolio').hidden = kind !== 'free';
  const up = $('#sbUpload');
  up.classList.toggle('done', sbProof === kind);
  up.innerHTML = sbProof === kind
    ? `${icon('check')} ${proofLabel(kind)} 업로드됨 · 다시 올리기`
    : `${icon('upload')} ${kind === 'free' ? '신분증' : '사업자 등록증'} 업로드 (JPG, PNG, PDF)`;
}

function signupBiz() {
  const email = $('#sbEmail').value.trim();
  const pw = $('#sbPw').value;
  const bizName = $('#sbName').value.trim();
  const phone = $('#sbPhone').value.trim();
  const err = $('#sbError');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return formError(err, '이메일을 정확히 입력해 주세요.');
  if (pw.length < 8) return formError(err, '비밀번호를 8자 이상 입력해 주세요.');
  if (pw !== $('#sbPw2').value) return formError(err, '비밀번호가 서로 달라요.');
  if (!bizName) return formError(err, '업체명을 입력해 주세요.');
  if (!PHONE_RE.test(phone)) return formError(err, '연락처를 정확히 입력해 주세요.');
  if (!$('#sbAddr').value) return formError(err, '주소를 검색해 주세요.');
  if (!termsOk($('#sbTerms'))) return formError(err, '필수 약관에 동의해 주세요.');
  err.classList.remove('show');
  finishLogin({
    type: 'biz', email, bizName, phone,
    address: `${$('#sbAddr').value} ${$('#sbAddr2').value.trim()}`.trim(),
    proof: sbProof,
  }, sbProof ? '가입 완료! 업체 소개를 만들어 볼까요?' : '가입 완료! 증빙 서류는 대시보드에서 올릴 수 있어요', 'partner-join');
}

function bizLogin() {
  const email = $('#bizLoginEmail').value.trim();
  if (!email || !$('#bizLoginPw').value) { $('#bizLoginError').classList.add('show'); return; }
  // 프로토타입: 아무 계정이나 데모 업체로 로그인
  finishLogin({ type: 'biz', email, bizName: '필름하루 스냅', phone: '010-2345-6789', address: '서울 마포구', proof: 'biz' },
    '필름하루 스냅으로 로그인했어요', 'partner-dash');
}

function route() {
  const defaultScreen = splashDone() ? 'home' : 'splash';
  let [hashName, query] = (location.hash.slice(1) || defaultScreen).split('?');
  if (hashName === 'timeline') { hashName = 'mypage'; query = 'tab=timeline'; } // 타임라인은 내 웨딩 안으로 이동
  const name = $(`#screen-${hashName}`) ? hashName : 'home';
  const params = new URLSearchParams(query || '');

  // 회원 전용 화면: 계정 유형이 맞지 않으면 로그인으로 (뒤로 가기 시 반복되지 않게 replace)
  const need = SCREEN_AUTH[name];
  if (need && authUser?.type !== need) {
    location.replace(`#login?type=${need}&next=${encodeURIComponent(name + (query ? `?${query}` : ''))}`);
    return;
  }
  if (!['login', 'signup-user', 'signup-biz'].includes(name)) authNext = null; // 로그인 흐름을 벗어나면 복귀 화면 잊기

  document.body.classList.toggle('is-splash', name === 'splash');
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name.split('-')[0]));
  $('.gnb-menu').classList.remove('open');

  if (name === 'directory') {
    if (params.get('cat')) dirCat = params.get('cat');
    renderDirectory();
  }
  if (name === 'home') requestAnimationFrame(updateFeedNav); // 화면이 보인 뒤에 너비를 재야 함
  requestAnimationFrame(onPartnerScroll); // 업체 알리기 화면이 아니면 고정 버튼을 숨김
  if (name === 'guide') showGuide(1);
  if (name === 'partner-join') showPj(0);
  if (name === 'budget-result') renderReport();
  if (name === 'vendor') renderVendor();
  if (name === 'invite') renderInvite(params);
  if (name === 'partner-dash') renderBiz();
  if (name === 'mypage') showMyTab(params.get('tab') || 'timeline');
  if (name === 'login') renderLogin(params);
  if (name === 'signup-user') renderSignupUser(params);
  if (name === 'signup-biz') renderSignupBiz();
  if (drawerItem) closeDrawer();
  window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

/* ---------- 홈 ---------- */
function renderHome() {
  $('#homeCats').innerHTML = CATEGORIES.slice(1).map((c) =>
    `<a class="hm-cat" href="#directory?cat=${c.name}"><span class="hm-cat-ico"><i data-lucide="${c.icon}"></i></span>${c.name}</a>`).join('');
  $('#homeFeed').innerHTML = FEED.map((id) => {
    const v = VENDORS.find((x) => x.id === id);
    return `
      <div class="hm-photo" data-vendor="${v.id}">
        <a href="#vendor" class="hp-link">
          <img src="${vendorImg(v.id)}" alt="${v.name} · ${v.cat}" loading="lazy" />
          <span class="hp-meta"><span class="hp-avatar">${v.name[0]}</span><b>${v.name}</b><small>${v.cat}</small></span>
        </a>
        <button class="hp-save" data-auth="user" aria-label="${v.name} 찜하기"><i data-lucide="bookmark"></i></button>
      </div>`;
  }).join('');
  $('#myVendors').innerHTML = [1, 2, 4, 3].map((id) => vendorCard(VENDORS.find((v) => v.id === id))).join('');
  drawIcons();
  updateFeedNav();
}


// 프로모션 배너: 5초마다 다음 배너로, 마우스를 올리거나 초점이 있으면 멈춤 (동작 줄이기 설정이면 자동 넘김 없음)
const promo = { i: 0, timer: null };
function showPromo(i) {
  const slides = $$('#homePromo .hp-slide');
  promo.i = (i + slides.length) % slides.length;
  $('#homePromo .hp-track').style.transform = `translateX(${-promo.i * 100}%)`;
  slides.forEach((sl, k) => { sl.setAttribute('aria-hidden', k !== promo.i); sl.tabIndex = k === promo.i ? 0 : -1; });
  $('#promoNo').textContent = promo.i + 1;
}
function stopPromo() { clearInterval(promo.timer); promo.timer = null; }
function startPromo() {
  stopPromo();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  promo.timer = setInterval(() => showPromo(promo.i + 1), 5000);
}

// 사진 피드 슬라이드: 양끝에서는 이전 · 다음 버튼을 끔
function updateFeedNav() {
  const feed = $('#homeFeed');
  const max = feed.scrollWidth - feed.clientWidth;
  $('.hs-nav.prev').disabled = feed.scrollLeft <= 2;
  $('.hs-nav.next').disabled = feed.scrollLeft >= max - 2;
}
function slideFeed(dir) {
  const feed = $('#homeFeed');
  const gap = parseFloat(getComputedStyle(feed).columnGap) || 0;
  feed.scrollBy({ left: dir * (feed.clientWidth + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ---------- 홈 히어로: 진단 결과 예시 카드 (조건별로 금액 · 막대가 바뀜) ---------- */
// 금액 단위: 만 원. rows 순서는 카드의 항목 순서와 같음 (예식장 · 스드메 · 본식스냅 · 예복 · 기타)
const HERO_SCENARIOS = [
  { cond: '서울 웨딩홀 · 하객 150명', badge: '평균 범위 안', rows: [1350, 620, 120, 110, 740] },
  { cond: '경기 하우스웨딩 · 하객 80명', badge: '평균보다 낮은 편', rows: [900, 540, 150, 90, 520] },
  { cond: '서울 호텔 · 하객 250명', badge: '평균보다 높은 편', rows: [3100, 880, 180, 160, 980] },
  { cond: '제주 스몰웨딩 · 하객 40명', badge: '평균보다 낮은 편', rows: [380, 450, 90, 70, 410] },
];
const HERO_BAR_MAX = 3100; // 막대 길이 기준 (시나리오끼리 비교되게 고정)
let heroIdx = 0;
let heroShown = HERO_SCENARIOS[0].rows.slice(); // 지금 화면에 보이는 금액 (카운트 시작점)

function showHeroScenario(idx) {
  const sc = HERO_SCENARIOS[idx];
  const from = heroShown.slice();
  const fromTotal = from.reduce((a, b) => a + b, 0);
  const toTotal = sc.rows.reduce((a, b) => a + b, 0);
  const cells = $$('#hcRows li');
  $('#hcCond').textContent = sc.cond;
  $('#hcBadge').textContent = sc.badge;
  cells.forEach((li, i) => li.querySelector('i').style.setProperty('--w', `${(sc.rows[i] / HERO_BAR_MAX) * 100}%`));
  const start = performance.now();
  const DURATION = 700;
  const step = (now) => {
    const p = Math.min((now - start) / DURATION, 1);
    const e = 1 - (1 - p) ** 3; // ease-out
    cells.forEach((li, i) => { li.querySelector('b').textContent = `${Math.round(from[i] + (sc.rows[i] - from[i]) * e).toLocaleString()}만`; });
    $('#hcTotal').textContent = `${Math.round(fromTotal + (toTotal - fromTotal) * e).toLocaleString()}만 원`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  heroShown = sc.rows.slice();
}

function startHeroDemo() {
  showHeroScenario(0);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // 움직임 줄이기 설정이면 첫 예시만
  const card = $('.hm-hero-card');
  let paused = false;
  card.addEventListener('mouseenter', () => { paused = true; });
  card.addEventListener('mouseleave', () => { paused = false; });
  setInterval(() => {
    if (paused || document.hidden || !$('#screen-home').classList.contains('active')) return;
    heroIdx = (heroIdx + 1) % HERO_SCENARIOS.length;
    showHeroScenario(heroIdx);
  }, 3200);
}

/* ---------- 온보딩 스텝 ---------- */
function makeStepper(stepSel, progressSel, noSel, total, onDone) {
  let step = 1;
  const show = () => {
    $$(stepSel).forEach((s) => s.classList.toggle('active', +s.dataset.step === step));
    $(progressSel).style.width = `${(Math.min(step, total) / total) * 100}%`;
    $(noSel).textContent = Math.min(step, total);
  };
  show();
  return {
    next() { if (step < total) { step++; show(); } else onDone(() => { step++; show(); }); },
    prev() { if (step > 1) { step--; show(); } else history.back(); },
    reset() { step = 1; show(); },
  };
}

const obStepper = makeStepper('.ob-step', '#obProgress', '#obStepNo', 4, () => {
  toast('진단 완료! 맞춤 예산을 계산했어요');
  location.hash = '#budget';
  obStepper.reset();
});

/* ---------- 업체 프로필 만들기 (필수 → 골라서 추가) ---------- */
const PJ_OPTIONAL = ['insta', 'schedule', 'price', 'intro'];
const PJ_LABELS = { insta: '인스타 연동', schedule: '예약 일정', price: '가격', intro: '상세 소개' };
let pjIdx = 0;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pjPicked = () => $$('.pick-card.active').map((c) => c.dataset.opt);
const pjSequence = () => ['basic', 'mood', 'pick', ...PJ_OPTIONAL.filter((k) => pjPicked().includes(k)), 'done'];

function showPj(idx) {
  const seq = pjSequence();
  pjIdx = Math.min(Math.max(idx, 0), seq.length - 1);
  const key = seq[pjIdx];
  const total = seq.length - 1; // 완료 화면은 단계 수에서 제외
  const no = Math.min(pjIdx + 1, total);
  $$('.pj-step').forEach((s) => s.classList.toggle('active', s.dataset.key === key));
  $('#pjStepNo').textContent = no;
  $('#pjTotal').textContent = total;
  $('#pjProgress').style.width = `${(no / total) * 100}%`;
  $('#pjActions').style.display = key === 'done' ? 'none' : 'flex';
  $('[data-action="pj-next"]').textContent = seq[pjIdx + 1] === 'done' ? '완료' : '다음';
  if (key === 'done') renderPjPreview();
}

function pjNext() {
  if (pjSequence()[pjIdx] === 'mood' && !$$('#pjMoods .chip.active').length) {
    $('#pjMoodError').classList.add('show');
    return;
  }
  showPj(pjIdx + 1);
}

function renderPjPreview() {
  const picked = pjPicked();
  const cat = $('#pjCats .chip.active')?.textContent || '업종';
  const moods = $$('#pjMoods .chip.active').map((c) => c.textContent);
  const priceMode = $('#pjPriceMode .chip.active').dataset.price;
  const price = picked.includes('price') && priceMode !== 'none'
    ? `${$('#pjPriceMin').value} ~ ${$('#pjPriceMax').value}` : null;
  $('#pjPreview').innerHTML = `
    <div class="v-card">
      <div class="v-thumb" style="height:150px"><img src="images/biz_07.jpg" alt="" /></div>
      <div class="v-body">
        <span class="tag">${esc(cat)}</span>
        <h4>${esc($('#pjName').value || '업체명')}</h4>
        ${$('#pjRegion').value.trim() ? `<div class="v-meta">${esc($('#pjRegion').value.trim())}</div>` : ''}
        ${priceHTML(price && esc(price), cat)}
        <div class="tag-row">${moods.map((m) => `<span class="tag">${esc(m)}</span>`).join('')}</div>
      </div>
    </div>`;
  const later = PJ_OPTIONAL.filter((k) => !picked.includes(k)).map((k) => PJ_LABELS[k]);
  $('#pjLater').textContent = later.length ? `${later.join(' · ')}은(는) 대시보드에서 언제든 추가할 수 있어요.` : '';
}

/* ---------- 새내기 가이드 (카드 넘기기) ---------- */
const GUIDE_TOTAL = 4;
let guideStep = 1;

function showGuide(step) {
  guideStep = Math.min(Math.max(step, 1), GUIDE_TOTAL);
  $$('.guide-card').forEach((c) => c.classList.toggle('active', +c.dataset.gcard === guideStep));
  $$('#guideDots i').forEach((d, i) => d.classList.toggle('on', i === guideStep - 1));
  $('[data-action="guide-prev"]').style.visibility = guideStep === 1 ? 'hidden' : 'visible';
  $('#guideActions').style.display = guideStep === GUIDE_TOTAL ? 'none' : 'flex';
}

/* ---------- 예산 진단 ---------- */
const budget = {
  locks: new Set(), // 📌 고정한 항목 key ('hall', 'sdm.dress' …) — ④ 총예산을 바꿀 때 금액을 그대로 둠
  hallSetup: null, // 추천받기 결과 { type, region, guests, total } — 있으면 예식장 평균가 대신 사용
  wish: new Set(['아이폰스냅', '헤어변형']),
  cats: BUDGET_CATALOG.map(makeBudgetCat), // 기준표 5개 항목 모두 기본
};
const wishTotal = () => WISHLIST.filter((w) => budget.wish.has(w.name)).reduce((s, w) => s + w.cost, 0);
// 기타 준비 비용은 금액을 직접 정하는 항목 — 시작값은 위시리스트 합계
budget.cats.find((c) => c.id === 'etc').w = wishTotal();

/* 실제 금액이 나가는 단위(leaf): 일반 항목, 스드메는 하위 항목. est = 평균가, w = 중요도 */
function budgetLeaves() {
  const U = WISHLIST.filter((w) => budget.wish.has(w.name)).reduce((s, w) => s + w.cost, 0);
  const leaves = [];
  budget.cats.forEach((c) => {
    if (c.subs) c.subs.forEach((s) => leaves.push({ key: `${c.id}.${s.id}`, cat: c, sub: s, est: avgOf(s.id) ?? 0, w: c.w * s.w }));
    else leaves.push({ key: c.id, cat: c, est: c.id === 'etc' ? 1 : c.id === 'hall' && budget.hallSetup ? budget.hallSetup.total : c.custom ? 1 : AVG_COST[c.id], w: c.w }); // 기타 준비 비용 · 직접 추가 항목: 금액 = w
  });
  return { leaves, U };
}
/* 항목 금액 = 📌 직접 입력한 금액, 없으면 평균가 × 슬라이더 배수
   총예산 = 항목 금액의 합 → 한 항목을 바꾸면 다른 항목은 그대로, 그만큼 총예산만 늘거나 줄어듦 */
const leafAmount = (l) => l.est * l.w; // 항목 금액 = 평균가 × 배수 (금액을 직접 입력하면 배수가 그에 맞게 바뀜)
const currentTotal = () => Math.round(budgetLeaves().leaves.reduce((a, l) => a + leafAmount(l), 0));

/* ④ 총예산을 직접 바꾸면: 고정 안 한 항목의 슬라이더 배수를 모두 같은 비율로 조정해서 합계를 맞춤
   (이후 새로 추가하는 항목은 평균가 그대로 더해짐) */
function setTotalBudget(target) {
  const { leaves } = budgetLeaves();
  const pinnedSum = leaves.filter((l) => budget.locks.has(l.key)).reduce((a, l) => a + leafAmount(l), 0);
  const freeSum = leaves.filter((l) => !budget.locks.has(l.key)).reduce((a, l) => a + leafAmount(l), 0);
  if (freeSum <= 0) return false; // 조정할 항목이 없음 (전부 📌 고정)
  const f = Math.max(target - pinnedSum, 0) / freeSum;
  budget.cats.forEach((c) => {
    if (c.subs) c.subs.forEach((s) => { if (!budget.locks.has(`${c.id}.${s.id}`)) s.w *= f; });
    else if (!budget.locks.has(c.id)) c.w *= f;
  });
  return true;
}

// 항목 변경 공통 진입점 — 각 항목 금액이 서로 독립이라 바꾼 항목만 달라지고 총예산은 합계로 따라감
function changeKeepingOthers(_keys, apply) { apply(); }

/* 가격대 레이어는 고르는 게 아니라 총예산으로 판정되는 결과 (결심 기준표)
   가성비형 2,500만~3,500만 · 표준형 3,500만~5,500만 · 고급형 5,500만 원 이상 */
const TIER_MIN = 2500;  // 가성비형 기준 최저 — 이보다 낮으면 안내
const TIER_LOW = 3500;  // 이 금액 미만 → 가성비형
const TIER_HIGH = 5500; // 이 금액 이상 → 고급형
const TIERS = [
  { key: '가성비', name: '가성비형' },
  { key: '표준', name: '표준형' },
  { key: '프리미엄', name: '고급형' },
];
const tierOf = (amount) => TIERS[amount < TIER_LOW ? 0 : amount < TIER_HIGH ? 1 : 2];

// 눈금: 가성비 · 표준 · 프리미엄 구간을 같은 폭으로 놓고 위치 표시
// total: 수준 판정에 쓰는 금액(직접 추가 항목 제외), excluded: 판정에서 뺀 직접 추가 항목 합계
function tierScaleHTML(total, excluded = 0) {
  const t = tierOf(total);
  const pos = total < TIER_LOW ? (total / TIER_LOW) / 3
    : total < TIER_HIGH ? 1 / 3 + ((total - TIER_LOW) / (TIER_HIGH - TIER_LOW)) / 3
      : 2 / 3 + Math.min((total - TIER_HIGH) / TIER_HIGH, 1) / 3;
  return `
    <p class="tier-line">이 예산은 <b class="tier-name tier-${TIERS.indexOf(t)}">${t.name}</b> 수준이에요</p>
    <div class="tier-scale">
      ${TIERS.map((x) => `<span class="${x === t ? 'on' : ''}">${x.name.split(' · ')[0]}</span>`).join('')}
      <i class="tier-marker" style="left:${(pos * 100).toFixed(1)}%"></i>
    </div>
    <div class="tier-ticks"><span>${won(TIER_LOW)}</span><span>${won(TIER_HIGH)}</span></div>
    ${total < TIER_MIN ? `<p class="tier-low-note">가성비형 기준(${won(TIER_MIN)})보다 낮은 예산이에요. 항목을 줄이거나 우선순위를 정해 보세요.</p>` : ''}
    ${excluded > 0 ? '<p class="muted sm">직접 추가한 항목은 판정에서 제외</p>' : ''}`;
}

function renderBudgetInputs() {
  renderBasicItems();
  renderWishList();
  renderBudgetItems();
}

/* ① 기본 항목 — ③ 예산 항목(예식장 · 스드메 하위)과 같은 상태를 보여주고 바꿈 */
const sdmCat = () => budget.cats.find((c) => c.id === 'sdm');
const hasSub = (id) => !!sdmCat()?.subs.some((s) => s.id === id);

function renderBasicItems() {
  const hall = budget.cats.some((c) => c.id === 'hall');
  const shoot = SHOOT_IDS.find(hasSub) || 'none';
  const row = (key, item, on) => `
    <label class="bs-row ${on ? 'on' : ''}">
      <input type="checkbox" data-basic="${key}" ${on ? 'checked' : ''} />
      <span class="bs-main"><b>${item.name}</b><small>${noShoot() && item.dNoShoot ? item.dNoShoot : item.d}</small></span>
      <span class="bs-price">평균 ${won(avgOf(key))}</span>
    </label>`;
  $('#basicItems').innerHTML = BASIC_ITEMS.map((item) => {
    if (item.id === 'hall') {
      const s = budget.hallSetup;
      const info = s
        ? `${HALL_TYPES.find((x) => x.id === s.type).name} · ${HALL_REGIONS.find((x) => x.id === s.region).name} · ${s.guests}명 기준`
        : item.d;
      return `
        <label class="bs-row ${hall ? 'on' : ''}">
          <input type="checkbox" data-basic="hall" ${hall ? 'checked' : ''} />
          <span class="bs-main"><b>${item.name}</b><small>${info}</small>
            <span class="bs-reco">
              <button class="text-btn" data-action="hall-modal-open">${s ? '다시 계산하기' : '하객 수 · 예식 형태로 추천받기'} →</button>
              ${s ? '<button class="text-btn muted-btn" data-action="hall-reco-clear">평균가로 되돌리기</button>' : ''}
            </span>
          </span>
          <span class="bs-price">${s ? `추천 ${won(s.total)}` : `평균 ${won(AVG_COST.hall)}`}</span>
        </label>`;
    }
    if (!item.options) return row(item.id, item, hasSub(item.id));
    return `
      <div class="bs-row shoot ${shoot !== 'none' ? 'on' : ''}">
        <span class="bs-main"><b>${item.name}</b><small>하나만 선택</small></span>
        <div class="bs-options" role="radiogroup" aria-label="촬영 선택">
          ${item.options.map((o) => `<button class="bs-opt ${shoot === o.id ? 'active' : ''}" data-shoot="${o.id}" role="radio" aria-checked="${shoot === o.id}"><b>${o.name}</b><small>평균 ${won(AVG_COST[o.id])}</small></button>`).join('')}
          <button class="bs-opt ${shoot === 'none' ? 'active' : ''}" data-shoot="none" role="radio" aria-checked="${shoot === 'none'}"><b>안 함</b></button>
        </div>
      </div>`;
  }).join('');
}

// 스드메 하위 항목 켜기/끄기 (스드메 묶음이 없으면 새로 만듦)
function setSdmSub(id, on) {
  if (on === hasSub(id)) return;
  if (on) {
    if (!sdmCat()) budget.cats.push({ ...makeBudgetCat(BUDGET_CATALOG.find((c) => c.id === 'sdm')), subs: [] });
    addBudgetCat(`sdm.${id}`);
  } else {
    removeBudgetCat(`sdm.${id}`);
  }
}

function refreshBudgetForm() {
  renderBasicItems();
  renderBudgetItems();
  updatePreview();
}

/* 예식장 · 식대 추천받기 모달: 예식 종류 → 지역 → 하객 수 → 예상 비용 → 적용 */
const hm = { step: 1, type: null, region: null, guests: 200 };

function openHallModal() {
  Object.assign(hm, { step: 1, type: null, region: null, guests: 200 }, budget.hallSetup || {});
  renderHallModal();
  $('#hallModal').hidden = false;
  $('#hallModalBg').hidden = false;
  document.body.classList.add('modal-open');
}

function closeHallModal() {
  $('#hallModal').hidden = true;
  $('#hallModalBg').hidden = true;
  document.body.classList.remove('modal-open');
}

function renderHallModal() {
  const titles = { 1: '어떤 예식을 생각하세요?', 2: '어느 지역에서 하세요?', 3: '하객은 몇 명 정도 예상하세요?' };
  $('#hmTitle').textContent = titles[hm.step];
  $$('[data-hm]').forEach((el) => { el.hidden = +el.dataset.hm !== hm.step; });
  $$('[data-hmdot]').forEach((el) => {
    el.classList.toggle('on', +el.dataset.hmdot === hm.step);
    el.classList.toggle('done', +el.dataset.hmdot < hm.step);
  });
  $('#hmTypes').innerHTML = HALL_TYPES.map((t) => `
    <button class="hm-opt ${hm.type === t.id ? 'active' : ''}" data-hmtype="${t.id}"><b>${t.name}</b><small>${t.d}</small></button>`).join('');
  $('#hmRegions').innerHTML = HALL_REGIONS.map((r) => `
    <button class="hm-opt ${hm.region === r.id ? 'active' : ''}" data-hmregion="${r.id}"><b>${r.name}</b></button>`).join('');
  $('#hmGuests').innerHTML = GUEST_OPTIONS.map((g) => `
    <button class="chip ${hm.guests === g ? 'active' : ''}" data-hmguests="${g}">${g === 300 ? '300명 이상' : `${g}명`}</button>`).join('');
  if (document.activeElement !== $('#hmGuestInput')) $('#hmGuestInput').value = hm.guests;

  if (hm.step === 3 && hm.type && hm.region) {
    const e = hallEstimate(hm);
    $('#hmResult').innerHTML = `
      <small>예상 비용</small>
      <strong>약 ${won(e.total)}</strong>
      <ul>
        <li>식대 ${(Math.round(e.meal * 10) / 10).toLocaleString()}만 원 × ${hm.guests}명<span>${won(e.food)}</span></li>
        <li>대관료<span>${won(e.base)}</span></li>
      </ul>
      <p class="muted sm">예시 단가로 계산한 참고 금액이에요. 실제 견적은 예식장마다 달라요.</p>`;
  }
  const ready = (hm.step === 1 && hm.type) || (hm.step === 2 && hm.region) || (hm.step === 3 && hm.guests > 0);
  $('#hmNext').textContent = hm.step === 3 ? '이 금액 적용' : '다음';
  $('#hmNext').disabled = !ready;
  $('[data-action="hm-prev"]').style.visibility = hm.step === 1 ? 'hidden' : 'visible';
}

function applyHallEstimate() {
  const { total } = hallEstimate(hm);
  changeKeepingOthers(['hall'], () => {
    budget.hallSetup = { type: hm.type, region: hm.region, guests: hm.guests, total };
    if (!budget.cats.some((c) => c.id === 'hall')) addBudgetCat('hall'); // 빼 둔 상태면 다시 넣음
    budget.cats.find((c) => c.id === 'hall').w = 1;
  });
  closeHallModal();
  refreshBudgetForm();
  toast(`예식장 · 식대를 ${won(total)}으로 반영했어요`);
}

/* 위시리스트 선택 — 기타 준비 비용이 그 항목 가격만큼 정확히 늘거나 줄도록 */
function toggleWish(name, on) {
  const cost = WISHLIST.find((w) => w.name === name).cost;
  const etc = budget.cats.find((c) => c.id === 'etc');
  const before = etc ? leafAmount(budgetLeaves().leaves.find((l) => l.key === 'etc')) : 0;
  if (on) budget.wish.add(name); else budget.wish.delete(name);
  if (!etc) return;
  etc.w = Math.max(before + (on ? cost : -cost), 0); // 기타 준비 비용 금액 = w
}

/* ② 추가 위시리스트 — 분류별 체크 목록 */
const wishCollapsed = new Set();

function renderWishList() {
  $('#wishList').innerHTML = WISH_GROUPS.map((g) => {
    const items = WISHLIST.filter((w) => w.g === g.id);
    const picked = items.filter((w) => budget.wish.has(w.name));
    const count = picked.length ? `${picked.length}개 · ${won(picked.reduce((a, w) => a + w.cost, 0))}` : `${items.length}개 항목`;
    return `
      <div class="wl-group ${wishCollapsed.has(g.id) ? 'collapsed' : ''}">
        <button class="wl-head" data-wltoggle="${g.id}" aria-expanded="${!wishCollapsed.has(g.id)}">
          <b>${icon(g.icon)} ${g.name}</b><span class="wl-count ${picked.length ? 'on' : ''}">${count}</span><span class="wl-caret">${icon('chevron-down')}</span>
        </button>
        <div class="wl-items">
          ${items.map((w) => `
            <label class="wl-item ${budget.wish.has(w.name) ? 'on' : ''}">
              <input type="checkbox" data-wish="${w.name}" ${budget.wish.has(w.name) ? 'checked' : ''} />
              <span class="wl-name"><b>${w.name}</b><small>${w.d}</small></span>
              <span class="wl-price">평균 ${won(w.cost)}</span>
            </label>`).join('')}
        </div>
      </div>`;
  }).join('');
}

/* 예산 항목 · 중요도 목록 (key: 'hall' 또는 'sdm.studio') */
function budgetTarget(key) {
  const [catId, subId] = key.split('.');
  const cat = budget.cats.find((c) => c.id === catId);
  return subId ? cat?.subs.find((s) => s.id === subId) : cat;
}

// 슬라이더 최대 배수: 예식장은 편차가 커서 5배, 나머지는 3배
const isCustomKey = (key) => !!budget.cats.find((c) => c.id === key)?.custom;
// 금액을 직접 정하는 항목(기타 준비 비용 · 직접 추가 항목) — 슬라이더가 배수가 아닌 금액
const isFreeKey = (key) => key === 'etc' || isCustomKey(key);
const sliderMax = (key) => (isFreeKey(key) ? CUSTOM_MAX : key === 'hall' ? 5 : 3);
// 슬라이더 옆 표시: 직접 추가 항목은 금액, 나머지는 평균가 대비 배수
const fmtW = (key, w) => (isFreeKey(key) ? won(w) : `×${w.toFixed(1)}`);

function renderBudgetItems() {
  const row = (key, name, w, { sub = false, color = null, group = null } = {}) => `
    <div class="bi-row ${sub ? 'sub' : ''}">
      <span class="bi-name">${color ? `<i style="background:${color}"></i>` : ''}${sub ? 'ㄴ ' : ''}${esc(name)}${sub ? '' : `<small class="bi-note" data-bnote="${key}"></small>`}
        ${group ? `<button class="bi-toggle" data-btoggle="${group.id}">${group.open ? `접기 ${icon('chevron-up', 12)}` : `세부 ${icon('chevron-down', 12)}`}</button>` : ''}</span>
      ${isFreeKey(key)
    ? `<input type="range" min="0" max="${CUSTOM_MAX}" step="10" value="${w}" data-bw="${key}" aria-label="${esc(name)} 금액 (0~1억 원)" />`
    : `<input type="range" min="0.3" max="${sliderMax(key)}" step="0.1" value="${w}" data-bw="${key}" aria-label="${esc(name)} 중요도 (평균가의 0.3~${sliderMax(key)}배)" />`}
      <output data-bwout="${key}">${fmtW(key, w)}</output>
      ${group
    ? `<span class="bi-amount" data-bamt="${key}">-</span>`
    : `<span class="bi-amount-wrap">
          <button class="bi-pin" data-bpin="${key}" aria-pressed="false" title="고정하면 총예산을 바꿔도 이 금액은 그대로예요" aria-label="${esc(name)} 고정">${icon('pin', 14)}</button>
          <input type="number" class="bi-input" data-bamtin="${key}" min="0" ${isFreeKey(key) ? `max="${CUSTOM_MAX}"` : ''} step="10" aria-label="${esc(name)} 금액(만 원)" />
        </span>`}
      <button class="bi-del" data-bdel="${key}" aria-label="${esc(name)} 빼기" title="빼기">${icon('x', 14)}</button>
    </div>`;

  const rows = budget.cats.map((c) => {
    if (!c.subs) return row(c.id, c.name, c.w, { color: c.color });
    const catalogSubs = BUDGET_CATALOG.find((x) => x.id === c.id).subs;
    const hasShoot = c.subs.some((x) => SHOOT_IDS.includes(x.id)); // 스튜디오 · 야외스냅은 둘 중 하나
    const missing = catalogSubs.filter((s) => !c.subs.some((x) => x.id === s.id) && !(hasShoot && SHOOT_IDS.includes(s.id)));
    const subRows = c.open ? `
      <div class="bi-subs">
        ${c.subs.map((s) => row(`${c.id}.${s.id}`, s.name, s.w, { sub: true })).join('')}
        ${missing.length ? `<div class="bi-sub-add">${missing.map((s) => `<button class="chip" data-badd="${c.id}.${s.id}">+ ${s.name}</button>`).join('')}</div>` : ''}
      </div>` : '';
    return row(c.id, c.name, c.w, { color: c.color, group: c }) + subRows;
  }).join('');

  const addable = BUDGET_CATALOG.filter((c) => !budget.cats.some((x) => x.id === c.id));
  $('#budgetItems').innerHTML = `
    ${rows || '<p class="muted sm bi-empty">예산 항목이 없어요. 아래에서 추가해 주세요.</p>'}
    <div class="bi-add">
      <span class="bi-add-label">+ 항목 추가</span>
      ${addable.map((c) => `<button class="chip" data-badd="${c.id}">${c.name}</button>`).join('')}
      <button class="chip" data-action="b-custom-open">+ 직접 입력</button>
    </div>
    <div class="bi-custom" hidden>
      <input type="text" id="biCustomInput" maxlength="20" placeholder="예: 혼수, 신혼집 인테리어" />
      <button class="btn btn-primary btn-sm" data-action="b-custom-save">추가</button>
      <button class="btn btn-ghost btn-sm" data-action="b-custom-cancel">취소</button>
    </div>`;
}

function addBudgetCat(key) {
  const [catId, subId] = key.split('.');
  const def = BUDGET_CATALOG.find((c) => c.id === catId);
  if (subId) {
    const cat = budget.cats.find((c) => c.id === catId);
    cat.subs.push({ ...def.subs.find((s) => s.id === subId), w: 1 });
    cat.subs.sort((a, b) => def.subs.findIndex((s) => s.id === a.id) - def.subs.findIndex((s) => s.id === b.id));
  } else {
    const cat = makeBudgetCat(def);
    if (catId === 'etc') cat.w = wishTotal(); // 다시 넣으면 위시리스트 합계부터
    budget.cats.push(cat);
  }
}

function addCustomBudgetCat() {
  const input = $('#biCustomInput');
  const name = input.value.trim();
  if (!name) { toast('항목 이름을 입력해 주세요'); input.focus(); return; }
  const used = budget.cats.filter((c) => c.custom).length;
  const id = `custom${Date.now()}`;
  changeKeepingOthers([id], () => budget.cats.push({ ...makeBudgetCat({ id, name, color: CUSTOM_COLORS[used % CUSTOM_COLORS.length], custom: true }), w: 0 })); // 0원에서 시작
  renderBudgetItems();
  updatePreview();
  toast(`'${name}' 항목을 추가했어요`);
}

function removeBudgetCat(key) {
  [...budget.locks].forEach((k) => { if (k === key || k.startsWith(`${key}.`)) budget.locks.delete(k); });
  const [catId, subId] = key.split('.');
  const cat = budget.cats.find((c) => c.id === catId);
  if (subId) {
    cat.subs = cat.subs.filter((s) => s.id !== subId);
    if (!cat.subs.length) budget.cats = budget.cats.filter((c) => c !== cat); // 하위가 모두 빠지면 묶음도 뺌
  } else {
    budget.cats = budget.cats.filter((c) => c !== cat);
  }
}

/* 계산 로직
   1) 항목 금액 = 📌 직접 입력 금액 또는 평균가 × 슬라이더 배수 (기타 준비 비용의 평균가 = 위시리스트 합계)
   2) 총예산 T = 항목 금액의 합
   3) 항목 수준 = 금액을 기준표의 해당 항목 구간과 비교 (가성비형 최소보다 낮으면 '최저선 미만')
   4) 위시리스트가 기타 준비 비용보다 크면 부족분 표시 */
function calcBudget() {
  const { leaves, U } = budgetLeaves();
  leaves.forEach((l) => {
    l.pinned = budget.locks.has(l.key);
    l.amount = leafAmount(l);
  });
  const T = leaves.reduce((a, l) => a + l.amount, 0);
  const pinned = leaves.filter((l) => l.pinned);
  const P = pinned.reduce((a, l) => a + l.amount, 0);

  const judge = (amount, ranges) => (ranges
    ? { ranges, level: TIERS[amount < ranges[1][0] ? 0 : amount < ranges[2][0] ? 1 : 2], belowFloor: amount < ranges[0][0] }
    : { ranges: null, level: null, belowFloor: false });
  const scaled = (ranges, f) => ranges.map(([a, b]) => [a * f, b * f]);

  const base = budget.cats.map((c) => {
    const ls = leaves.filter((l) => l.cat === c);
    const amount = ls.reduce((a, l) => a + l.amount, 0);
    const est = ls.reduce((a, l) => a + l.est, 0);
    const subs = c.subs ? ls.map((l) => ({
      id: l.sub.id, key: l.key, name: l.sub.name, amount: l.amount, est: l.est, pinned: l.pinned,
      ...judge(l.amount, scaled(REF_TABLE.sdm, l.est / SDM_AVG)),
    })) : null;
    // 기타 준비 비용은 위시리스트 합계라 기준표 판정 대신 위시리스트 부족 여부로 봄
    const ranges = c.id === 'etc' ? null : REF_TABLE[c.id] || null;
    return { id: c.id, key: c.id, name: c.name, color: c.color, amount, est, subs, pinned: !c.subs && ls[0]?.pinned, ...judge(amount, ranges) };
  });

  // 위시리스트 = 기타 준비 비용 안에서 사용
  const etc = base.find((b) => b.id === 'etc');
  const etcAmt = etc ? etc.amount : 0;
  const overflow = Math.max(Math.round(U - etcAmt), 0); // 만 원 단위로 반올림해서 소수점 오차 무시
  if (etc) {
    etc.legend = [
      { name: `위시리스트 (${budget.wish.size}개)`, amount: Math.min(U, etcAmt) },
      { name: '예비 비용', amount: Math.max(etcAmt - U, 0) },
    ].filter((x) => Math.round(x.amount) > 0); // 0원인 줄은 숨김
  }

  const items = [...base];
  if (overflow > 0) items.push({ name: '위시리스트 부족분', color: '#c2453d', amount: overflow });
  const C = items.reduce((s, it) => s + it.amount, 0);
  // 최저선 판정은 실제로 돈이 나가는 단위(스드메는 하위 항목)로
  const below = base.flatMap((b) => (b.subs ? b.subs : [b])).filter((it) => it.belowFloor).map((it) => it.name);
  // 슬라이더나 직접 입력으로 평균가에서 달라진 항목이 있는지 (되돌리기 버튼 표시용)
  const adjusted = leaves.some((l) => (l.key === 'etc' ? Math.abs(l.w - U) > 0.5 : !l.cat.custom && Math.abs(l.w - 1) > 0.001));

  // 직접 추가한 항목은 기준이 없어 수준(가성비 · 표준 · 고급) 판정에서 제외
  const customSum = leaves.filter((l) => l.cat.custom).reduce((a, l) => a + l.amount, 0);
  const tierTotal = T - customSum;
  return { E: T, U, C, P, items, base, below, tier: tierOf(tierTotal), tierTotal, customSum, etcAmt, overflow, hasEtc: !!etc, adjusted, pinCount: pinned.length };
}

function pieGradient(items, total) {
  let acc = 0;
  return `conic-gradient(${items.map((it) => {
    const start = acc;
    acc += (it.amount / total) * 360;
    return `${it.color} ${start}deg ${acc}deg`;
  }).join(',')})`;
}

function legendHTML(items, total) {
  const pct = (a) => (total ? Math.round((a / total) * 100) : 0);
  return items.map((it) =>
    `<li><i style="background:${it.color}"></i>${esc(it.name)}<span>${pct(it.amount)}% · ${won(it.amount)}</span></li>${
      (it.legend || it.subs || []).map((s) => `<li class="legend-sub">ㄴ ${s.name}<span>${won(s.amount)}</span></li>`).join('')}`).join('');
}

function updatePreview() {
  const r = calcBudget();
  $('#pvTotal').textContent = won(r.E);
  $('#pvTier').innerHTML = `<span class="tier-name tier-${TIERS.indexOf(r.tier)}">${r.tier.name}</span> 수준${
    r.customSum > 0 ? '<small class="pv-tier-note">직접 추가한 항목 제외</small>' : ''}`;
  // 예산 항목 목록의 금액 (슬라이더 · 입력칸을 다시 그리지 않고 값만 갱신 — 입력 중인 칸은 건드리지 않음)
  const setAmt = (x) => {
    const title = x.belowFloor ? '가성비형 최소 금액보다 낮아요' : x.level ? `${x.level.name} 수준` : '';
    const span = $(`[data-bamt="${x.key}"]`);
    if (span) { span.textContent = won(x.amount); span.classList.toggle('low', x.belowFloor); span.title = title; }
    const input = $(`[data-bamtin="${x.key}"]`);
    if (input) {
      if (document.activeElement !== input) input.value = Math.round(x.amount);
      input.classList.toggle('low', x.belowFloor);
      input.classList.toggle('pinned', !!x.pinned);
      input.title = title;
    }
    const pin = $(`[data-bpin="${x.key}"]`);
    if (pin) { pin.classList.toggle('on', !!x.pinned); pin.setAttribute('aria-pressed', String(!!x.pinned)); }
  };
  // 슬라이더 위치도 배수에 맞춰 갱신 (직접 입력 · ④ 총예산 변경 시) — 조작 중인 슬라이더는 그대로
  const setSlider = (key, w) => {
    const sl = $(`[data-bw="${key}"]`);
    if (sl && document.activeElement !== sl) sl.value = w;
    const out = $(`[data-bwout="${key}"]`);
    if (out) out.textContent = fmtW(key, w);
  };
  budget.cats.forEach((c) => { setSlider(c.id, c.w); (c.subs || []).forEach((x) => setSlider(`${c.id}.${x.id}`, x.w)); });
  r.base.forEach((b) => {
    setAmt(b);
    (b.subs || []).forEach(setAmt);
    const note = $(`[data-bnote="${b.id}"]`);
    if (!note) return;
    note.classList.toggle('over', b.id === 'etc' && r.overflow > 0);
    note.textContent = b.id === 'etc' ? `위시리스트 ${won(r.U)}${r.overflow > 0 ? ` · ${won(r.overflow)} 부족` : ''}`
      : isCustomKey(b.id) ? '직접 입력' : `${b.id === 'hall' && budget.hallSetup ? '추천' : '평균'} ${won(b.est)}`;
  });
  $('#wishSummary').innerHTML = budget.wish.size
    ? `선택 <b>${budget.wish.size}개</b> · 합계 <b>${won(r.U)}</b>${r.hasEtc ? ` <span class="${r.overflow > 0 ? 'over' : 'muted'}">/ 기타 준비 비용 ${won(r.etcAmt)}${r.overflow > 0 ? ` (${won(r.overflow)} 부족)` : ''}</span>` : ''}`
    : '<span class="muted">필요한 항목만 골라 주세요.</span>';

  // ④ 총예산: 안내 · 고정 개수 · 되돌리기
  const totalInput = $('#bTotal');
  if (document.activeElement !== totalInput) totalInput.value = Math.round(r.E);
  $('#estLine').innerHTML = `<span class="muted">총예산을 바꾸면 고정(${icon('pin', 13)}) 외 항목이 같은 비율로 조정돼요.</span>`;
  $('#totalDiff').innerHTML = [
    r.pinCount ? `${icon('pin', 13)} 고정 ${r.pinCount}개 <button class="text-btn" data-action="b-unpin-all">고정 모두 풀기</button>` : '',
    r.adjusted ? '<button class="text-btn" data-action="b-total-reset">평균가로 되돌리기</button>' : '',
  ].filter(Boolean).join(' · ');
  $('#tierResult').innerHTML = tierScaleHTML(r.tierTotal, r.customSum);
  $('#pvPie').style.background = pieGradient(r.items, r.C);
  $('#pvLegend').innerHTML = legendHTML(r.items, r.C);
}

// 기본 항목 중 사용자가 뺀 것 (안 하는 항목) — 리포트에서 평균가만큼 아낀 것으로 봄
function removedBasics() {
  const has = (id) => budget.cats.some((c) => c.id === id);
  const out = [];
  if (!has('hall')) out.push({ name: '예식장 · 식대', avg: budget.hallSetup ? budget.hallSetup.total : AVG_COST.hall });
  if (!SHOOT_IDS.some(hasSub)) out.push({ name: '촬영', avg: AVG_COST.studio });
  ['dress', 'makeup'].forEach((id) => {
    if (!hasSub(id)) out.push({ name: BUDGET_CATALOG.find((c) => c.id === 'sdm').subs.find((x) => x.id === id).name, avg: avgOf(id) });
  });
  ['jewelry', 'suit', 'honeymoon'].forEach((id) => {
    if (!has(id)) out.push({ name: BUDGET_CATALOG.find((c) => c.id === id).name, avg: AVG_COST[id] });
  });
  if (!has('etc') && wishTotal() > 0) out.push({ name: '기타 준비 비용', avg: wishTotal() });
  return out;
}

function compareToAvg(amount, avg) {
  if (!avg) return null;
  const ratio = amount / avg;
  const pct = Math.round((ratio - 1) * 100);
  const pctText = pct === 0 ? '' : ` ${pct > 0 ? '+' : ''}${pct}%`;
  if (ratio >= 2) return { ratio, pctText, label: '많이 높은 편', cls: 'cmp-up2' };
  if (ratio >= 1.5) return { ratio, pctText, label: '높은 편', cls: 'cmp-up' };
  if (ratio <= 0.5) return { ratio, pctText, label: '많이 낮은 편', cls: 'cmp-down2' };
  if (ratio <= 2 / 3) return { ratio, pctText, label: '낮은 편', cls: 'cmp-down' };
  return { ratio, pctText: '', label: '평균 수준', cls: 'cmp-avg' };
}

function renderReport() {
  const r = calcBudget();
  const wishNames = [...budget.wish];
  // 내가 정한 금액을 평균가와 비교해서 분석 (직접 추가 항목은 평균가가 없어 제외)
  const headline = `총예산 ${won(r.E)} · ${r.tier.name}`;
  const avgOf = (it) => (it.id === 'etc' ? r.U : isCustomKey(it.id) ? 0 : it.est);
  const rows = [];
  const compared = []; // 요약에 쓸 비교 결과 (실제 금액 단위: 일반 항목 · 스드메 하위)
  const tr = (it, avg, sub = false) => {
    const c = compareToAvg(it.amount, avg);
    if (c && (sub || !it.subs)) compared.push({ name: it.name, ...c });
    const tags = (c ? `<span class="tag ${c.cls}">${c.label}${c.pctText}</span>` : `<span class="tag">${isCustomKey(it.id) ? '직접 입력' : '-'}</span>`)
      + (it.belowFloor ? ' <span class="tag tag-danger">최저선 미만</span>' : '');
    return `<tr class="${sub ? 'sub-row' : ''}"><td>${sub ? 'ㄴ ' : ''}${esc(it.name)}</td><td><b>${won(it.amount)}</b></td><td class="muted">${avg ? won(avg) : '-'}</td><td>${tags}</td></tr>`;
  };
  const wishRows = (sub) => WISHLIST.filter((w) => budget.wish.has(w.name)).map((w) =>
    `<tr class="sub-row"><td>${sub ? 'ㄴ ' : ''}${w.name}</td><td>${won(w.cost)}</td><td class="muted">${won(w.cost)}</td><td><span class="tag">위시리스트</span></td></tr>`).join('');
  r.base.forEach((it) => {
    rows.push(tr(it, avgOf(it)) + (it.subs || []).map((x) => tr(x, x.est, true)).join('') + (it.id === 'etc' ? wishRows(true) : ''));
  });
  if (!r.hasEtc) rows.push(wishRows(false));
  const removed = removedBasics();
  if (removed.length) {
    rows.push('<tr class="off-head"><td colspan="4">안 하는 항목</td></tr>');
    removed.forEach((x) => rows.push(`<tr class="off-row"><td>${esc(x.name)}</td><td>0원</td><td class="muted">${won(x.avg)}</td><td><span class="tag cmp-off">안 함</span></td></tr>`));
  }

  const up = compared.filter((c) => c.ratio >= 1.5).sort((a, b) => b.ratio - a.ratio);
  const down = compared.filter((c) => c.ratio <= 2 / 3).sort((a, b) => a.ratio - b.ratio);
  const fmt = (list) => list.map((c) => `${c.name} ${c.pctText.trim()}`).join(', ');
  const downText = [fmt(down), ...removed.map((x) => `${x.name}(안 함)`)].filter(Boolean).join(', ');
  const notes = [];
  if (up.length) notes.push(`평균보다 많이 쓴 항목: ${fmt(up)}`);
  if (downText) notes.push(`아낀 항목: ${downText}`);
  if (!up.length && !downText && compared.length) notes.push('모든 항목이 평균 수준이에요.');
  if (r.below.length) notes.push(`최저선 미만: ${r.below.join(', ')}`);
  if (r.overflow > 0) notes.push(r.hasEtc ? `위시리스트가 기타 준비 비용보다 ${won(r.overflow)} 많아요.` : '위시리스트는 예산에 포함되지 않았어요.');

  $('#rpHeadline').textContent = headline;
  $('#rpDesc').innerHTML = notes.map((n) => `<span class="rp-note">${esc(n)}</span>`).join('');
  $('#rpTier').innerHTML = tierScaleHTML(r.tierTotal, r.customSum);

  $('#rpPie').style.background = pieGradient(r.items, r.C);
  $('#rpLegend').innerHTML = legendHTML(r.items, r.C);

  $('#rpTable tbody').innerHTML = rows.join('');

  const moods = myMoods();
  const matched = VENDORS
    .filter((v) => recoReasons(v).includes('예산 범위 안') || wishNames.some((w) => w.includes(v.cat)))
    .sort((a, b) => vendorScore(b, moods) - vendorScore(a, moods))
    .slice(0, 4);
  $('#rpVendors').innerHTML = matched.map((v) => vendorCard(v, { reasons: recoReasons(v) })).join('');
  drawIcons();
}

/* ---------- 내 타임라인 ---------- */
// 항목 상태: 순서 = 배열 순서, phase로 단계 구분. hidden(뺀 항목) · custom(직접 추가) · date · memo는 다음 단계에서 사용
const defaultItems = () => TL_DEFAULT.map(([phase, id, t, d, link, tag]) => ({
  id, phase, t, d, link: link || null, tag: tag || null, done: false, hidden: false, custom: false, date: null, memo: '',
}));
let tlItems = defaultItems();

function weddingInfo() {
  const value = $('#weddingDate').value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((new Date(value) - today) / 86400000);
  let nowIdx = TL_PHASES.findIndex((p) => days / 30.4 >= p.to);
  if (nowIdx === -1) nowIdx = TL_PHASES.length - 1;
  return { value, days, nowIdx };
}

// 처음 열었을 때 이미 지난 단계의 항목은 완료로 표시
const markPastDone = () => { const { nowIdx } = weddingInfo(); tlItems.forEach((it) => { it.done = it.phase < nowIdx; }); };

/* ---------- 저장 (이 브라우저에만, localStorage) ---------- */
const TL_KEY = 'ww-timeline-v1';
const DEFAULT_WEDDING = '2027-06-12';

function saveTimeline() {
  try {
    localStorage.setItem(TL_KEY, JSON.stringify({ wedding: $('#weddingDate').value, items: tlItems }));
  } catch { /* 저장할 수 없는 환경(시크릿 창 등)은 무시 */ }
}

// 저장된 순서 · 사용자 입력은 유지하고, 기본 항목의 문구는 최신으로 갱신. 새로 생긴 기본 항목은 해당 단계 끝에 추가
function loadTimeline() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(TL_KEY)); } catch { saved = null; }
  if (!saved || !Array.isArray(saved.items)) { markPastDone(); return; }
  if (saved.wedding) $('#weddingDate').value = saved.wedding;
  const defaults = new Map(defaultItems().map((it) => [it.id, it]));
  const restored = saved.items
    .filter((it) => it.custom || defaults.has(it.id))
    .map((it) => (it.custom ? it : { ...it, t: defaults.get(it.id).t, d: defaults.get(it.id).d, link: defaults.get(it.id).link, tag: defaults.get(it.id).tag }));
  tlItems = restored;
  defaults.forEach((it, id) => {
    if (!restored.some((r) => r.id === id)) { tlItems.push(it); moveItem(id, it.phase); }
  });
}

function resetTimeline() {
  if (!confirm('타임라인을 처음 상태로 되돌릴까요?\n순서 · 숨긴 항목 · 직접 추가한 항목 · 날짜 · 메모가 모두 초기화돼요.')) return;
  try { localStorage.removeItem(TL_KEY); } catch { /* 무시 */ }
  $('#weddingDate').value = DEFAULT_WEDDING;
  tlItems = defaultItems();
  markPastDone();
  $('#tlHiddenList').hidden = true;
  renderTimeline();
  toast('기본 타임라인으로 되돌렸어요');
}

const WEDDING_ITEM = 'wedding'; // '본식 당일' 항목 — 날짜는 항상 예식일과 같음

function renderTimeline() {
  const { value, days, nowIdx } = weddingInfo();
  const weddingItem = tlItems.find((it) => it.id === WEDDING_ITEM);
  if (weddingItem) weddingItem.date = value;
  $('#ddayText').textContent = days > 0 ? `D-${days}` : days === 0 ? 'D-Day' : `D+${-days}`;
  $('#ddayDate').textContent = `${value.replaceAll('-', '.')} (${'일월화수목금토'[new Date(value).getDay()]})`;
  $('#myPhase').textContent = TL_PHASES[nowIdx].title;
  $('#myPhaseNote').textContent = `Phase ${nowIdx + 1} / ${TL_PHASES.length}`;

  const openPhases = new Set($$('#timelineList .phase:not(.collapsed)').map((p) => +p.dataset.phase));
  const firstRender = !$('#timelineList .phase');

  $('#timelineList').innerHTML = TL_PHASES.map((p, i) => {
    const items = tlItems.filter((it) => it.phase === i && !it.hidden);
    const doneCount = items.filter((it) => it.done).length;
    const open = firstRender ? i === nowIdx : openPhases.has(i);
    const state = `${i < nowIdx ? 'past' : i === nowIdx ? 'now' : ''} ${open ? '' : 'collapsed'}`;
    const badge = i === nowIdx ? '<span class="tag tag-new">지금 할 일</span>' : '';
    const rows = items.map((it, idx) => `
      <div class="tl-item ${it.done ? 'done' : ''}" data-item="${it.id}">
        <span class="tl-handle" title="끌어서 순서 · 단계 변경"><i data-lucide="grip-vertical"></i></span>
        <input type="checkbox" class="tl-check" ${it.done ? 'checked' : ''} aria-label="${esc(it.t)} 완료" />
        <div class="tl-main">
          <b>${esc(it.t)}</b>${it.tag ? `<span class="tag mode-tag">${it.tag}</span>` : ''}
          ${it.d ? `<p>${esc(it.d)}</p>` : ''}
          ${it.date || it.memo ? `<div class="tl-meta">${it.date ? `<span><i data-lucide="calendar"></i>${fmtMD(it.date)}</span>` : ''}${it.memo ? '<span><i data-lucide="notebook-pen"></i>메모</span>' : ''}</div>` : ''}
        </div>
        <div class="tl-side">
          ${it.link ? `<a class="link-more" href="${it.link[1]}">${it.link[0]} <i data-lucide="arrow-right"></i></a>` : ''}
          <span class="tl-arrows">
            <button data-move="up" aria-label="위로" ${idx === 0 ? 'disabled' : ''}><i data-lucide="chevron-up"></i></button>
            <button data-move="down" aria-label="아래로" ${idx === items.length - 1 ? 'disabled' : ''}><i data-lucide="chevron-down"></i></button>
          </span>
        </div>
      </div>`).join('');
    return `
      <div class="phase ${state}" data-phase="${i}">
        <div class="card">
          <div class="phase-head">
            <h3>Phase ${i + 1}. ${p.title} ${badge}</h3>
            <span class="when">D-${p.from}~${p.to}개월 · ${doneCount}/${items.length}</span>
          </div>
          <div class="phase-body">
            ${rows || '<p class="muted sm tl-empty">항목이 없어요. 여기로 끌어다 놓을 수 있어요.</p>'}
            <div class="tl-add" data-phase="${i}">
              <button class="text-btn" data-action="tl-add-open"><i data-lucide="plus"></i>항목 추가</button>
              <div class="tl-add-form" hidden>
                <input type="text" class="tl-add-input" placeholder="예: 브라이덜 샤워, 웨딩 네일" maxlength="40" />
                <button class="btn btn-primary btn-sm" data-action="tl-add-save">추가</button>
                <button class="btn btn-ghost btn-sm" data-action="tl-add-cancel">취소</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  const hidden = tlItems.filter((it) => it.hidden);
  $('#tlHiddenBtn').hidden = !hidden.length;
  $('#tlHiddenBtn').textContent = `숨긴 항목 ${hidden.length}개 ${$('#tlHiddenList').hidden ? '▾' : '▴'}`;
  if (!hidden.length) $('#tlHiddenList').hidden = true;
  $('#tlHiddenList').innerHTML = hidden.map((it) => `
    <div class="tl-hidden-row">
      <span><b>${esc(it.t)}</b> <small class="muted">Phase ${it.phase + 1}</small></span>
      <button class="btn btn-ghost btn-sm" data-restore="${it.id}">되살리기</button>
    </div>`).join('');

  updateTimelineProgress();
  renderMyCalendar();
  saveTimeline(); // 모든 변경은 renderTimeline을 거치므로 여기서 한 번에 저장
}

/* 순서 · 단계 변경: 배열에서 빼서 목표 단계의 beforeId 앞(없으면 단계 맨 끝)에 넣음 */
function moveItem(id, toPhase, beforeId = null) {
  const from = tlItems.findIndex((it) => it.id === id);
  if (from < 0 || id === beforeId) return;
  const [item] = tlItems.splice(from, 1);
  item.phase = toPhase;
  let at = beforeId ? tlItems.findIndex((it) => it.id === beforeId) : -1;
  if (at < 0) {
    const lastInPhase = tlItems.map((it) => it.phase).lastIndexOf(toPhase);
    at = lastInPhase >= 0 ? lastInPhase + 1 : tlItems.length;
  }
  tlItems.splice(at, 0, item);
}

function nudgeItem(id, dir) {
  const item = tlItems.find((it) => it.id === id);
  const siblings = tlItems.filter((it) => it.phase === item.phase && !it.hidden);
  const idx = siblings.indexOf(item);
  const target = siblings[idx + (dir === 'up' ? -1 : 1)];
  if (!target) return;
  if (dir === 'up') moveItem(id, item.phase, target.id);
  else moveItem(target.id, item.phase, id);
  renderTimeline();
}

/* 드래그 앤 드롭 (손잡이를 잡았을 때만 끌 수 있음) */
let dragId = null;
let dropMark = null; // { el, cls } — 놓일 위치 표시. 위치가 바뀔 때만 갱신해서 깜빡임 방지

function setDropMark(el, cls) {
  if (dropMark && dropMark.el === el && dropMark.cls === cls) return;
  if (dropMark) dropMark.el.classList.remove(dropMark.cls);
  dropMark = el ? { el, cls } : null;
  if (el) el.classList.add(cls);
}

document.addEventListener('mousedown', (e) => {
  const handle = e.target.closest('.tl-handle');
  if (handle) handle.closest('.tl-item').draggable = true;
});
document.addEventListener('dragstart', (e) => {
  const row = e.target.closest?.('.tl-item');
  if (!row) return;
  dragId = row.dataset.item;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
  row.classList.add('dragging');
});
document.addEventListener('dragover', (e) => {
  if (!dragId) return;
  const row = e.target.closest('.tl-item');
  const phase = e.target.closest('.phase');
  if (!phase) return;
  e.preventDefault();
  if (row) {
    if (row.dataset.item === dragId) { setDropMark(null); return; } // 제자리
    const r = row.getBoundingClientRect();
    setDropMark(row, e.clientY < r.top + r.height / 2 ? 'drop-before' : 'drop-after');
  } else if (phase.classList.contains('collapsed') || e.target.closest('.phase-head') || !phase.querySelector('.tl-item')) {
    setDropMark(phase, 'drop-into'); // 접힌 단계 · 단계 제목 · 빈 단계 위
  }
  // 열린 단계의 항목 사이 빈 공간에서는 직전 표시를 그대로 유지
});
document.addEventListener('drop', (e) => {
  if (!dragId || !e.target.closest('.phase')) return;
  e.preventDefault();
  if (!dropMark) return; // 제자리에 놓으면 그대로
  const { el, cls } = dropMark;
  const phaseEl = cls === 'drop-into' ? el : el.closest('.phase');
  const toPhase = +phaseEl.dataset.phase;
  let beforeId = null;
  if (cls === 'drop-before') beforeId = el.dataset.item;
  if (cls === 'drop-after') {
    const visible = tlItems.filter((it) => it.phase === toPhase && !it.hidden && it.id !== dragId);
    const next = visible[visible.findIndex((it) => it.id === el.dataset.item) + 1];
    beforeId = next ? next.id : null;
  }
  const prevPhase = tlItems.find((it) => it.id === dragId).phase;
  moveItem(dragId, toPhase, beforeId);
  setDropMark(null);
  phaseEl.classList.remove('collapsed');
  renderTimeline();
  if (prevPhase !== toPhase) toast(`Phase ${toPhase + 1}(으)로 옮겼어요`);
});
document.addEventListener('dragend', () => {
  $$('.tl-item[draggable="true"]').forEach((r) => { r.draggable = false; r.classList.remove('dragging'); });
  setDropMark(null);
  dragId = null;
});

function updateTimelineProgress() {
  const visible = tlItems.filter((it) => !it.hidden);
  const done = visible.filter((it) => it.done).length;
  const pct = visible.length ? Math.round((done / visible.length) * 100) : 0;
  $('#tlBar').style.width = `${pct}%`;
  $('#tlPct').textContent = `${pct}% 완료 (${done}/${visible.length})`;
  $('#myProgPct').textContent = `${pct}%`;
  $('#myProgBar').style.width = `${pct}%`;
}

function showMyTab(tab) {
  $$('.my-tab').forEach((b) => b.classList.toggle('active', b.dataset.mytab === tab));
  $$('.my-panel').forEach((p) => p.classList.toggle('active', p.dataset.mypanel === tab));
}

/* ---------- 내 캘린더 ---------- */
const pad2 = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fmtMD = (s) => { const [, m, d] = s.split('-'); return `${+m}/${+d}`; };
const calView = { y: new Date().getFullYear(), m: new Date().getMonth() };

function renderMyCalendar() {
  const { y, m } = calView;
  $('#mcTitle').textContent = `${y}년 ${m + 1}월`;
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const today = ymd(new Date());
  const wedding = $('#weddingDate').value;
  const byDate = {};
  // 본식 당일은 칩 대신 '본식' 표시로만 보여줌 (중복 방지)
  tlItems.filter((it) => it.date && !it.hidden && it.id !== WEDDING_ITEM).forEach((it) => { (byDate[it.date] = byDate[it.date] || []).push(it); });
  const weddingVisible = tlItems.some((it) => it.id === WEDDING_ITEM && !it.hidden);

  let html = ['일', '월', '화', '수', '목', '금', '토'].map((d) => `<div class="mc-dow">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += '<div class="mc-cell empty"></div>';
  for (let d = 1; d <= days; d++) {
    const key = `${y}-${pad2(m + 1)}-${pad2(d)}`;
    const items = byDate[key] || [];
    const chips = items.slice(0, 2).map((it) =>
      `<button class="mc-chip ${it.done ? 'done' : ''}" data-open="${it.id}">${esc(it.t)}</button>`).join('');
    const more = items.length > 2 ? `<span class="mc-more">+${items.length - 2}</span>` : '';
    const cls = [key === today ? 'today' : '', key === wedding ? 'wedding' : '', (first + d - 1) % 7 === 0 ? 'sun' : ''].join(' ');
    const weddingMark = key !== wedding ? ''
      : weddingVisible ? `<button class="mc-wedding" data-open="${WEDDING_ITEM}"><i data-lucide="gem"></i>본식</button>` : '<span class="mc-wedding"><i data-lucide="gem"></i>본식</span>';
    html += `<div class="mc-cell ${cls}"><span class="mc-day">${d}</span>${weddingMark}${chips}${more}</div>`;
  }
  $('#mcGrid').innerHTML = html;
  drawIcons();
}

/* ---------- 항목 상세 패널 ---------- */
let drawerItem = null;

// 단계 시기에 맞춘 추천 날짜 (본식일에서 단계 중간 개월 수만큼 앞)
function suggestDate(phase) {
  const p = TL_PHASES[phase];
  const d = new Date($('#weddingDate').value);
  d.setMonth(d.getMonth() - Math.round((p.from + p.to) / 2));
  return ymd(d);
}

function openDrawer(id) {
  drawerItem = tlItems.find((it) => it.id === id);
  if (!drawerItem) return;
  const it = drawerItem;
  const p = TL_PHASES[it.phase];
  $('#dwPhase').textContent = `Phase ${it.phase + 1}. ${p.title} · D-${p.from}~${p.to}개월`;
  $('#dwTitle').textContent = it.t;
  $('#dwDesc').textContent = it.d;
  $('#dwDesc').hidden = it.custom || !it.d;
  $('#dwEdit').hidden = !it.custom; // 직접 추가한 항목만 이름 · 설명 수정
  $('#dwTitleInput').value = it.t;
  $('#dwDescInput').value = it.d;
  $('#dwPhaseSel').innerHTML = TL_PHASES.map((ph, i) =>
    `<option value="${i}" ${i === it.phase ? 'selected' : ''}>Phase ${i + 1}. ${ph.title} (D-${ph.from}~${ph.to}개월)</option>`).join('');
  $('#dwDone').checked = it.done;
  $('#dwMemo').value = it.memo;
  $('#dwMemoSaved').textContent = '';
  $('#dwLink').hidden = !it.link;
  if (it.link) { $('#dwLink').href = it.link[1]; $('#dwLink').textContent = `${it.link[0]} →`; }
  updateDrawerDate();
  $('#tlDrawer').classList.add('open');
  $('#tlDrawer').setAttribute('aria-hidden', 'false');
  $('#drawerBackdrop').hidden = false;
}

function updateDrawerDate() {
  const it = drawerItem;
  const isWedding = it.id === WEDDING_ITEM;
  $('#dwDate').disabled = isWedding;
  $('#dwAddBtn').hidden = isWedding;
  if (isWedding) {
    $('#dwDate').value = it.date;
    $('#dwRemoveCal').hidden = true;
    $('#dwDateInfo').textContent = `본식 당일은 예식일(${fmtMD(it.date)})로 자동 설정돼요. 예식일은 화면 위에서 바꿀 수 있어요.`;
    return;
  }
  $('#dwDate').value = it.date || suggestDate(it.phase);
  $('#dwAddBtn').textContent = it.date ? '날짜 변경' : '캘린더에 추가';
  $('#dwRemoveCal').hidden = !it.date;
  $('#dwDateInfo').textContent = it.date
    ? `캘린더에 ${fmtMD(it.date)}로 추가돼 있어요.`
    : '추천 시기에 맞춰 날짜를 미리 채워 뒀어요. 바꿔도 돼요.';
}

function closeDrawer() {
  $('#tlDrawer').classList.remove('open');
  $('#tlDrawer').setAttribute('aria-hidden', 'true');
  $('#drawerBackdrop').hidden = true;
  drawerItem = null;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawerItem) closeDrawer();
  if (e.key === 'Escape' && !$('#hallModal').hidden) closeHallModal();
  if (e.key === 'Escape' && !$('#inviteModal').hidden) closeInvite();
  if (e.target.id === 'biCustomInput' && e.key === 'Enter') { e.preventDefault(); addCustomBudgetCat(); }
  if (e.target.matches?.('.tl-add-input')) {
    if (e.key === 'Enter') { e.preventDefault(); addCustomItem(e.target.closest('.tl-add')); }
    if (e.key === 'Escape') e.target.closest('.tl-add').querySelector('[data-action="tl-add-cancel"]').click();
  }
});

/* 직접 항목 추가 */
function addCustomItem(box) {
  const input = box.querySelector('.tl-add-input');
  const title = input.value.trim();
  if (!title) { toast('항목 이름을 입력해 주세요'); input.focus(); return; }
  const phase = +box.dataset.phase;
  const id = `c${Date.now()}`;
  tlItems.push({ id, phase, t: title, d: '', link: null, tag: '직접 추가', done: false, hidden: false, custom: true, date: null, memo: '' });
  moveItem(id, phase); // 해당 단계 맨 끝으로
  renderTimeline();
  toast(`Phase ${phase + 1}에 '${title}'을(를) 추가했어요`);
}

/* ---------- 디렉토리 ---------- */
/* 취향 맞춤순: 정보 충실도 + 후기(인증 가중) + 취향 일치. 구독 · 결제 여부는 반영하지 않음 */
function vendorScore(v, myMoods) {
  const info = [v.insta, v.schedule !== false, !!v.price, v.intro].filter(Boolean).length; // 0~4
  const review = Math.log2(1 + v.reviews) * 2 + Math.log2(1 + v.verified) * 4;
  const moodMatch = v.moods.filter((m) => myMoods.includes(m)).length;
  return info * 6 + review + moodMatch * 8;
}

// 핀터레스트형 배치를 가로 순서로: 순위대로 가장 짧은 기둥에 차례로 넣음
function masonryColumns() {
  const w = $('#dirGrid').clientWidth || window.innerWidth;
  return w >= 1000 ? 4 : w >= 700 ? 3 : 2;
}

function renderDirectory() {
  $('#catTabs').innerHTML = CATEGORIES.map((c) =>
    `<button class="dr-cat ${c.name === dirCat ? 'active' : ''}" data-cat="${c.name}" role="tab" aria-selected="${c.name === dirCat}"><i data-lucide="${c.icon}"></i>${c.name}</button>`).join('');
  const moods = myMoods();
  const list = (dirCat === '전체' ? VENDORS : VENDORS.filter((v) => v.cat === dirCat))
    .slice().sort((a, b) => vendorScore(b, moods) - vendorScore(a, moods));
  $('#dirCount').textContent = list.length;
  if (!list.length) {
    $('#dirGrid').innerHTML = '<p class="dr-empty">아직 소개된 업체가 없어요. 곧 만나요!</p>';
    drawIcons();
    return;
  }
  const cols = Array.from({ length: masonryColumns() }, () => ({ h: 0, html: '' }));
  list.forEach((v) => {
    const col = cols.reduce((min, c) => (c.h < min.h ? c : min));
    col.html += vendorCard(v, { masonry: true });
    col.h += v.h + 170; // 사진 높이 + 카드 본문 대략치
  });
  $('#dirGrid').innerHTML = cols.map((c) => `<div class="masonry-col">${c.html}</div>`).join('');
  renderDirectory.cols = cols.length;
  drawIcons();
}

window.addEventListener('resize', () => {
  if ($('#screen-directory').classList.contains('active') && masonryColumns() !== renderDirectory.cols) renderDirectory();
});

/* ---------- 업체 상세 ---------- */
function renderVendor() {
  const v = currentVendor;
  $('#vdName').textContent = v.name;
  $('#vdCat').textContent = v.cat;
  $('#vdMeta').textContent = `${v.region} · ${v.type}`;
  $('#vdRating').textContent = v.rating;
  $('#vdReviews2').textContent = v.reviews;
  $('#vdVerified').textContent = v.verified;
  $('#vdReviewCount').textContent = v.verified;
  // 갤러리: 큰 칸은 이 업체 사진, 작은 칸은 다른 목업 사진을 이어서 (프로토타입용)
  const pool = Object.values(VENDOR_IMG);
  const mainSrc = v.photo ? `images/${v.photo}.jpg` : vendorImg(v.id); // 내 업체 미리보기는 저장한 대표 사진
  const start = Math.max(0, pool.indexOf(v.photo || VENDOR_IMG[v.id]));
  const shots = Array.from({ length: 4 }, (_, i) => pool[(start + 1 + i) % pool.length]);
  const main = mainSrc
    ? `<img class="big" src="${mainSrc}" alt="${v.name} 대표 사진" />`
    : `<span class="big v-empty" aria-hidden="true"><i data-lucide="${catIcon(v.cat)}"></i></span>`;
  $('#vdGallery').innerHTML = main + shots.map((p, i) =>
    `<span class="vg-shot${i === 3 ? ' more' : ''}"><img src="images/${p}.jpg" alt="" loading="lazy" />${i === 3 ? '<b>+24</b>' : ''}</span>`).join('');
  const avg = CATEGORY_AVG[v.cat] || '';
  $('#vdPriceLabel').textContent = v.price ? '평균 견적' : '가격';
  $('#vdPrice').textContent = v.price || '상담 후 안내';
  $('#vdPriceAvg').hidden = !!v.price || !avg;
  $('#vdPriceAvg').textContent = `${v.cat} 시장 평균 ${avg}`;
  $('#vdPriceOpen').hidden = !v.price;
  $('#vdPriceClosed').hidden = !!v.price;
  $('#vdAvgCat').textContent = v.cat;
  $('#vdAvgRange').textContent = avg || '-';
  $('#vdSchedOpen').hidden = v.schedule === false;
  $('#vdSchedClosed').hidden = v.schedule !== false;
  const reasons = recoReasons(v);
  $('#vdWhy').hidden = !reasons.length;
  $('#vdWhyChips').innerHTML = reasons.map((r) => `<span>${r}</span>`).join('');
  $('#vdReviews').innerHTML = REVIEWS.slice(0, 2).map(reviewCard).join('');
  drawIcons();
  renderCalendar($('#vdCal'), {
    year: 2027, month: 5,
    status: (d, dow) => (dow === 6 || dow === 0 ? (d % 3 === 0 ? 'no' : 'few') : d % 5 === 0 ? 'no' : 'ok'),
  });
}

/* ---------- 내 업체 (업체 회원 페이지, 프로토타입: 이 브라우저에 저장) ---------- */
const BIZ_KEY = 'ww-biz-profile';
const BIZ_DEFAULT = {
  photos: ['biz_07', 'biz_03'], cat: '아이폰스냅', region: '서울 · 제주', type: '1인 작가',
  priceMode: 'range', priceMin: '35만 원', priceMax: '75만 원', moods: ['#야외스냅', '#필름감성', '#내추럴'],
  intro: '자연광과 필름 감성을 담는 1인 아이폰스냅 작가입니다. 제주 · 서울 야외 촬영 위주로 진행해요.', insta: '',
};
const BIZ_MOODS = ['#야외스냅', '#클래식', '#빈티지', '#미니멀', '#내추럴', '#하우스웨딩', '#필름감성', '#유니크헤어'];
let bizProfile = { ...BIZ_DEFAULT };
try { bizProfile = { ...BIZ_DEFAULT, ...JSON.parse(localStorage.getItem(BIZ_KEY) || '{}') }; } catch { /* 저장 불가 환경 무시 */ }
let bzDraftPhotos = [...bizProfile.photos];
const bizNameNow = () => authUser?.bizName || '필름하루 스냅';

const INQUIRIES = [
  { id: 1, who: '예비부부 K', when: '10.18', tags: ['2027.06.12', '예산 50만 원'], text: '6/12 제주 스냅 가능할까요? 오후 시간대로 생각하고 있어요.', status: 'new' },
  { id: 2, who: '예비부부 L', when: '10.17', tags: ['스탠다드 패키지'], text: '스탠다드 패키지로 주말에 촬영하면 추가금이 있나요?', status: 'new' },
  { id: 3, who: '예비부부 P', when: '10.15', tags: ['2027.04 셋째 주'], text: '4월 셋째 주 서울 일정 문의드려요.', status: 'done', reply: '4월 19일 오전이 가능해요! 원하시는 장소를 알려주세요.' },
];
let inqFilter = 'all';
let inqOpen = null;

// 일정: 날짜별 상태 ok(예약 가능) · no(마감) · booked(예약 확정). 바꾼 날짜만 marks에 저장
const bizCal = { y: new Date().getFullYear(), m: new Date().getMonth(), marks: {} };
function bizDayStatus(y, m, d) {
  const key = `${y}-${pad2(m + 1)}-${pad2(d)}`;
  if (bizCal.marks[key]) return bizCal.marks[key];
  const dow = new Date(y, m, d).getDay();
  if ([3, 10, 17, 18, 25].includes(d)) return 'booked';
  return dow === 0 || dow === 6 || d % 4 === 0 ? 'ok' : 'no';
}

// 프로필 완성도: 필수 4개 15%씩 + 선택 4개 10%씩
function bizChecks(p) {
  return [
    { label: '대표 사진', ok: p.photos.length > 0, w: 15 },
    { label: '업종', ok: !!p.cat, w: 15 },
    { label: '업체명', ok: !!bizNameNow(), w: 15 },
    { label: '무드 태그', ok: p.moods.length > 0, w: 15 },
    { label: '가격 공개', ok: p.priceMode === 'range' && !!p.priceMin && !!p.priceMax, w: 10, tab: 'profile' },
    { label: '소개글', ok: p.intro.trim().length >= 10, w: 10, tab: 'profile' },
    { label: '인스타 연동', ok: !!p.insta.trim(), w: 10, tab: 'profile' },
    { label: '예약 일정', ok: true, w: 10, tab: 'schedule' },
  ];
}

function renderBizHead() {
  const p = bizProfile;
  $('#dashTitle').textContent = bizNameNow();
  $('#bzCatChip').textContent = p.cat;
  $('#bzRegionChip').textContent = p.region || '지역 미입력';
  const open = !!authUser?.proof;
  $('#bzStatus').classList.toggle('off', !open);
  $('#bzStatus span').textContent = open ? '디렉토리 공개 중' : '비공개 · 증빙 필요';
  const checks = bizChecks(p);
  const pct = checks.reduce((sum, c) => sum + (c.ok ? c.w : 0), 0);
  $('#bzCompletePct').textContent = `${pct}%`;
  $('#bzCompleteBar').style.width = `${pct}%`;
  const todo = checks.filter((c) => !c.ok);
  $('#bzTodo').innerHTML = todo.length
    ? todo.map((c) => `<li><button data-goto-bztab="${c.tab || 'profile'}"><i data-lucide="plus"></i>${c.label}<em>+${c.w}%</em></button></li>`).join('')
    : '<li class="done"><i data-lucide="check"></i>모든 항목을 채웠어요</li>';
  const newCount = INQUIRIES.filter((q) => q.status === 'new').length;
  $('#bzNewCount').textContent = newCount;
  $('#bzInqBadge').textContent = newCount;
  $('#bzInqBadge').hidden = !newCount;
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  $('#bzBookedCount').textContent = Array.from({ length: days }, (_, i) => bizDayStatus(now.getFullYear(), now.getMonth(), i + 1)).filter((x) => x === 'booked').length;
  drawIcons();
}

function renderBiz() {
  renderBizHead();
  $('#bzInqPreview').innerHTML = INQUIRIES.map((q) => `
    <li data-open-inq="${q.id}"><b>${esc(q.who)}</b><span>${esc(q.text)}</span><em class="tag ${q.status === 'new' ? 'tag-new' : ''}">${q.status === 'new' ? 'NEW' : '답변 완료'}</em></li>`).join('');
  const now = new Date();
  renderCalendar($('#dashCal'), { year: now.getFullYear(), month: now.getMonth(), status: (d) => bizDayStatus(now.getFullYear(), now.getMonth(), d) });
  showBzTab($('.bz-tab.active')?.dataset.bztab || 'home');
}

function showBzTab(tab) {
  $$('.bz-tab').forEach((b) => { b.classList.toggle('active', b.dataset.bztab === tab); b.setAttribute('aria-selected', b.dataset.bztab === tab); });
  $$('.bz-panel').forEach((p) => p.classList.toggle('active', p.dataset.bzpanel === tab));
  if (tab === 'profile') fillBizForm();
  if (tab === 'inquiry') renderInquiries();
  if (tab === 'schedule') renderBizCal();
  if (tab === 'account') renderBizAccount();
  drawIcons();
}

// 업체 정보: 저장된 값으로 폼을 채우고, 입력하는 대로 미리보기를 갱신 (저장하기 전까지는 반영 안 됨)
function fillBizForm() {
  const p = bizProfile;
  bzDraftPhotos = [...p.photos];
  renderBizPhotos();
  $('#bzCats').innerHTML = CATEGORIES.slice(1).map((c) => `<button class="chip ${c.name === p.cat ? 'active' : ''}">${c.name}</button>`).join('');
  $('#bzName').value = bizNameNow();
  $('#bzRegion').value = p.region;
  $('#bzType').value = p.type;
  $$('#bzPriceMode .chip').forEach((b) => b.classList.toggle('active', b.dataset.price === p.priceMode));
  $('#bzPriceMin').value = p.priceMin;
  $('#bzPriceMax').value = p.priceMax;
  $('#bzMoods').innerHTML = BIZ_MOODS.map((m) => `<button class="chip ${p.moods.includes(m) ? 'active' : ''}">${m}</button>`).join('');
  $('#bzIntro').value = p.intro;
  $('#bzInsta').value = p.insta;
  $('#bzError').classList.remove('show');
  updateBizPreview();
}

function renderBizPhotos() {
  $('#bzPhotos').innerHTML = bzDraftPhotos.map((ph, i) => `
    <span class="bz-thumb"><img class="thumb" src="images/${ph}.jpg" alt="대표 사진 ${i + 1}" /><button class="bz-thumb-del" data-del-photo="${i}" aria-label="사진 ${i + 1} 삭제"><i data-lucide="x"></i></button></span>`).join('')
    + (bzDraftPhotos.length < 5 ? '<button class="upload-add" data-action="bz-photo-add"><i data-lucide="plus"></i><small>사진 추가</small></button>' : '');
  drawIcons();
}

function readBizForm() {
  return {
    photos: [...bzDraftPhotos],
    cat: $('#bzCats .chip.active')?.textContent || '',
    region: $('#bzRegion').value.trim(),
    type: $('#bzType').value.trim(),
    priceMode: $('#bzPriceMode .chip.active')?.dataset.price || 'none',
    priceMin: $('#bzPriceMin').value.trim(),
    priceMax: $('#bzPriceMax').value.trim(),
    moods: $$('#bzMoods .chip.active').map((b) => b.textContent),
    intro: $('#bzIntro').value,
    insta: $('#bzInsta').value.trim().replace(/^@/, ''),
  };
}

const bizPriceText = (p) => (p.priceMode === 'range' && p.priceMin && p.priceMax ? `${p.priceMin.replace(/\s*원$/, '')}~${p.priceMax}` : null);

function updateBizPreview() {
  const p = readBizForm();
  const name = $('#bzName').value.trim() || '업체명';
  const price = bizPriceText(p);
  $('#bzPriceRange').hidden = p.priceMode !== 'range';
  $('#bzPreviewCard').innerHTML = `
    <div class="v-card bz-vcard">
      <div class="v-thumb" style="height:200px">${p.photos[0]
        ? `<img src="images/${p.photos[0]}.jpg" alt="" />`
        : `<span class="v-empty" aria-hidden="true"><i data-lucide="${catIcon(p.cat)}"></i></span>`}</div>
      <div class="v-body">
        <span class="v-tag">${esc(p.cat || '업종')}</span>
        <h4>${esc(name)}</h4>
        <div class="v-meta">${esc([p.region, p.type].filter(Boolean).join(' · ') || '지역 · 유형')}</div>
        ${priceHTML(price && esc(price), p.cat)}
        <div class="tag-row">${p.moods.map((m) => `<span class="tag">${esc(m)}</span>`).join('')}</div>
        ${p.insta ? `<div class="bz-vinsta"><i data-lucide="at-sign"></i>${esc(p.insta)}</div>` : ''}
      </div>
    </div>`;
  drawIcons();
}

function saveBizProfile() {
  const p = readBizForm();
  const name = $('#bzName').value.trim();
  const err = $('#bzError');
  const miss = [!p.photos.length && '대표 사진', !p.cat && '업종', !name && '업체명', !p.moods.length && '무드 태그'].filter(Boolean);
  if (miss.length) { err.textContent = `필수 항목을 채워주세요: ${miss.join(', ')}`; err.classList.add('show'); return; }
  err.classList.remove('show');
  bizProfile = p;
  try { localStorage.setItem(BIZ_KEY, JSON.stringify(p)); } catch { /* 저장 불가 환경 무시 */ }
  if (authUser?.type === 'biz' && authUser.bizName !== name) saveAuth({ ...authUser, bizName: name });
  renderBizHead();
  toast('업체 정보를 저장했어요');
}

// 예비부부에게 보이는 업체 상세로 (저장된 정보 기준)
function previewBizVendor() {
  const p = bizProfile;
  currentVendor = {
    ...VENDORS[0], id: 0, photo: p.photos[0], name: bizNameNow(), cat: p.cat,
    region: p.region || '지역 미입력', type: p.type || '유형 미입력', price: bizPriceText(p), moods: p.moods,
  };
  location.hash = '#vendor';
}

function renderInquiries() {
  const list = INQUIRIES.filter((q) => inqFilter === 'all' || q.status === inqFilter);
  $('#bzInqList').innerHTML = list.length ? list.map((q) => `
    <article class="bz-inq ${q.status}">
      <div class="bz-inq-top">
        <span class="avatar">${esc(q.who.slice(-1))}</span>
        <b>${esc(q.who)}</b><small>${q.when}</small>
        <span class="tag ${q.status === 'new' ? 'tag-new' : ''}">${q.status === 'new' ? '새 문의' : '답변 완료'}</span>
      </div>
      <p>${esc(q.text)}</p>
      <div class="bz-inq-tags">${q.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      ${q.status === 'done'
        ? `<div class="bz-reply"><small><i data-lucide="corner-down-right"></i>내 답장</small><p>${esc(q.reply)}</p></div>`
        : inqOpen === q.id
          ? `<div class="bz-reply-form"><textarea id="bzReply" rows="3" placeholder="답장을 입력하세요" aria-label="답장"></textarea>
              <div><button class="ds-btn ds-btn-sm ds-btn-line" data-action="bz-reply-cancel">취소</button><button class="ds-btn ds-btn-sm ds-btn-ink" data-action="bz-reply-send" data-id="${q.id}">보내기</button></div></div>`
          : `<button class="ds-btn ds-btn-sm bz-reply-btn" data-action="bz-reply-open" data-id="${q.id}"><i data-lucide="reply"></i>답장하기</button>`}
    </article>`).join('') : '<p class="bz-empty">해당하는 문의가 없어요.</p>';
  drawIcons();
  if (inqOpen) $('#bzReply')?.focus();
}

function renderBizCal() {
  const { y, m } = bizCal;
  $('#bzCalTitle').textContent = `${y}년 ${m + 1}월`;
  renderCalendar($('#bzCal'), { year: y, month: m, status: (d) => bizDayStatus(y, m, d) });
  $('#bzCal .cal-title').remove(); // 제목은 위쪽 이동 버튼 사이에 따로 표시
}

function renderBizAccount() {
  const u = authUser || {};
  $('#bzAccount').innerHTML = `
    <dl class="bz-acc">
      <div><dt>로그인 이메일</dt><dd>${esc(u.email || '-')}</dd></div>
      <div><dt>업체명</dt><dd>${esc(bizNameNow())}</dd></div>
      <div><dt>연락처</dt><dd>${esc(u.phone || '-')}</dd></div>
      <div><dt>주소</dt><dd>${esc(u.address || '-')}</dd></div>
      <div><dt>증빙 서류</dt><dd>${u.proof
        ? `<span class="tag tag-ok">${proofLabel(u.proof)} 확인됨</span>`
        : '<span class="tag tag-warn">미제출</span> <button class="ds-btn ds-btn-sm ds-btn-ink" data-action="dash-proof">올리기</button>'}</dd></div>
      <div><dt>요금제</dt><dd>업체 등록 · 지금은 무료</dd></div>
    </dl>
    <div class="bz-acc-actions">
      <button class="ds-btn ds-btn-sm ds-btn-line" data-toast="비밀번호 변경 메일을 보냈어요 (프로토타입)">비밀번호 변경</button>
      <button class="ds-btn ds-btn-sm ds-btn-line" data-action="logout">로그아웃</button>
    </div>`;
}

/* ---------- 이벤트 위임 ---------- */
document.addEventListener('click', (e) => {
  const t = e.target;

  if (t.closest('[data-splash-done]')) markSplashDone();
  const setM = t.closest('[data-set-mode]');
  if (setM) setMode(setM.dataset.setMode === 'biz');

  // 같은 화면 안 이동 (#pt-price 등) — 라우터가 화면 이름으로 읽지 않게
  const jump = t.closest('[data-scroll]');
  if (jump) { e.preventDefault(); $(jump.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }

  // 회원 전용 동작(찜 · 문의 · 저장): 계정 유형이 맞지 않으면 로그인으로
  const gated = t.closest('[data-auth]');
  if (gated && authUser?.type !== gated.dataset.auth) {
    e.preventDefault();
    if (authUser?.type === 'biz') { toast('예비부부 회원만 이용할 수 있어요'); return; }
    requireLogin(gated.dataset.auth, location.hash.slice(1) || 'home');
    return;
  }
  const sns = t.closest('[data-sns]');
  if (sns) { location.hash = `#signup-user?provider=${sns.dataset.sns}`; return; }

  // 후기 작성 별점: 누른 별까지 채움
  const star = t.closest('.rw-stars [data-star]');
  if (star) {
    const n = +star.dataset.star;
    $$('.rw-stars [data-star]').forEach((b) => {
      b.classList.toggle('on', +b.dataset.star <= n);
      b.setAttribute('aria-checked', +b.dataset.star === n);
    });
    return;
  }

  // 타임라인 순서 ↑↓ · 되살리기
  const mover = t.closest('[data-move]');
  if (mover) { nudgeItem(mover.closest('[data-item]').dataset.item, mover.dataset.move); return; }
  const restore = t.closest('[data-restore]');
  if (restore) {
    tlItems.find((it) => it.id === restore.dataset.restore).hidden = false;
    renderTimeline();
    toast('타임라인에 되살렸어요');
    return;
  }

  // 타임라인 항목 · 캘린더 칩 → 상세 패널
  const openBtn = t.closest('[data-open]');
  if (openBtn) { openDrawer(openBtn.dataset.open); return; }
  const row = t.closest('.tl-item');
  if (row && !t.closest('.tl-check, .tl-handle, a, button')) { openDrawer(row.dataset.item); return; }

  // 업체 카드 클릭 → 상세
  const card = t.closest('[data-vendor]');
  if (card) {
    currentVendor = VENDORS.find((v) => v.id === +card.dataset.vendor);
    const save = t.closest('.hp-save');
    if (save) {
      e.preventDefault();
      save.classList.toggle('on');
      toast(save.classList.contains('on') ? '찜 목록에 담았어요' : '찜을 해제했어요');
      return;
    }
    const like = t.closest('.like');
    if (like) {
      e.preventDefault();
      const on = like.classList.toggle('on');
      like.setAttribute('aria-pressed', on);
      toast(on ? '찜 목록에 담았어요' : '찜을 해제했어요');
      return;
    }
    if (location.hash === '#vendor') renderVendor();
    return;
  }

  // 단일 / 복수 선택 그룹
  const single = t.closest('[data-single] > button');
  if (single) {
    $$(':scope > button', single.parentElement).forEach((b) => b.classList.remove('active'));
    single.classList.add('active');
    if (single.classList.contains('vd-tab')) {
      $$('.vd-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === single.dataset.tab));
    }
    if (single.dataset.mytab) showMyTab(single.dataset.mytab);
    if (single.dataset.authtab) showAuthTab(single.dataset.authtab);
    if (single.dataset.proof) updateProofUI();
    if (single.dataset.bztab) showBzTab(single.dataset.bztab);
    if (single.dataset.inq) { inqFilter = single.dataset.inq; renderInquiries(); }
    if (single.dataset.price) {
      $$('[data-price-panel]').forEach((p) => { p.hidden = !p.dataset.pricePanel.split(' ').includes(single.dataset.price); });
    }
  }
  const multi = t.closest('[data-multi] > button, .mood, .import-grid .ph, .pick-card');
  if (multi) multi.classList.toggle(multi.classList.contains('ph') ? 'sel' : 'active');
  if (multi?.closest('#pjMoods')) $('#pjMoodError').classList.remove('show');
  if (multi?.classList.contains('pick-card')) showPj(pjIdx); // 고른 항목 수에 맞춰 단계 수 갱신

  // 📌 고정 풀기
  const pinBtn = t.closest('[data-bpin]');
  if (pinBtn) { const k = pinBtn.dataset.bpin; if (budget.locks.has(k)) budget.locks.delete(k); else budget.locks.add(k); updatePreview(); }

  // 예산 항목: 빼기 · 추가 · 스드메 세부 펼치기 · 직접 입력
  const bDel = t.closest('[data-bdel]');
  if (bDel) { const k = bDel.dataset.bdel; changeKeepingOthers([k], () => removeBudgetCat(k)); refreshBudgetForm(); }
  const bAdd = t.closest('[data-badd]');
  if (bAdd) { const k = bAdd.dataset.badd; changeKeepingOthers([k], () => addBudgetCat(k)); refreshBudgetForm(); }
  const bToggle = t.closest('[data-btoggle]');
  if (bToggle) { const c = budget.cats.find((x) => x.id === bToggle.dataset.btoggle); c.open = !c.open; renderBudgetItems(); updatePreview(); }

  // ① 기본 항목: 촬영 선택 (스튜디오 · 야외스냅 · 안 함)
  const shootBtn = t.closest('[data-shoot]');
  if (shootBtn) {
    changeKeepingOthers(SHOOT_IDS.map((id) => `sdm.${id}`), () => SHOOT_IDS.forEach((id) => setSdmSub(id, id === shootBtn.dataset.shoot)));
    refreshBudgetForm();
  }
  // ② 위시리스트 분류 접기/펼치기
  const wlToggle = t.closest('[data-wltoggle]');
  if (wlToggle) {
    const id = wlToggle.dataset.wltoggle;
    wishCollapsed.has(id) ? wishCollapsed.delete(id) : wishCollapsed.add(id);
    renderWishList();
  }

  // 디렉토리 카테고리 탭
  const cat = t.closest('[data-cat]');
  if (cat) { dirCat = cat.dataset.cat; renderDirectory(); }

  // 타임라인 Phase 접기/펼치기
  const ph = t.closest('.phase-head');
  if (ph) ph.closest('.phase').classList.toggle('collapsed');

  // 내 업체: 탭 이동 링크 · 문의 미리보기 · 사진 삭제 · 일정 날짜 순환
  const goto = t.closest('[data-goto-bztab]');
  if (goto) showBzTab(goto.dataset.gotoBztab);
  const openInq = t.closest('[data-open-inq]');
  if (openInq) {
    const q = INQUIRIES.find((x) => x.id === +openInq.dataset.openInq);
    inqOpen = q.status === 'new' ? q.id : null;
    showBzTab('inquiry');
  }
  const delPhoto = t.closest('[data-del-photo]');
  if (delPhoto) { bzDraftPhotos.splice(+delPhoto.dataset.delPhoto, 1); renderBizPhotos(); updateBizPreview(); }
  const bzDay = t.closest('#bzCal .d:not(.empty)');
  if (bzDay) {
    const d = +bzDay.textContent;
    const next = { ok: 'no', no: 'booked', booked: 'ok' }[bizDayStatus(bizCal.y, bizCal.m, d)];
    bizCal.marks[`${bizCal.y}-${pad2(bizCal.m + 1)}-${pad2(d)}`] = next;
    renderBiz();
  }
  if (t.closest('#bzForm .chip')) requestAnimationFrame(updateBizPreview);

  // 업체 프로필 만들기 · 일정 캘린더 토글
  const day = t.closest('#pjCal .d:not(.empty)');
  if (day) { day.classList.toggle('ok'); day.classList.toggle('no'); }

  // 기타 액션
  const action = t.closest('[data-action]')?.dataset.action;
  if (action === 'b-custom-open' || action === 'b-custom-cancel') {
    $('.bi-custom').hidden = action === 'b-custom-cancel';
    if (action === 'b-custom-open') $('#biCustomInput').focus();
  }
  if (action === 'b-custom-save') addCustomBudgetCat();
  if (action === 'b-total-reset') {
    budget.cats.forEach((c) => {
      if (c.id === 'etc') c.w = wishTotal(); // 기타 준비 비용은 위시리스트 합계로
      else if (!c.custom) c.w = 1; // 직접 추가 항목은 평균가가 없어 그대로
      (c.subs || []).forEach((x) => { x.w = 1; });
    });
    refreshBudgetForm();
    toast('모든 항목을 평균가로 되돌렸어요');
  }
  if (action === 'b-unpin-all') { budget.locks.clear(); updatePreview(); toast('고정을 모두 풀었어요'); }
  // 예식장 · 식대 추천받기 모달
  if (action === 'invite-open') openInvite();
  if (action === 'invite-close') closeInvite();
  if (action === 'invite-accept') acceptInvite();
  if (action === 'invite-kakao') toast('카카오톡 공유 창이 열려요. 짝꿍을 골라 초대 링크를 보내세요 (프로토타입)');
  if (action === 'invite-copy') {
    const url = $('#inviteUrl').value;
    const done = () => toast('초대 링크를 복사했어요');
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => { $('#inviteUrl').select(); toast('링크를 길게 눌러 복사해 주세요'); });
    else { $('#inviteUrl').select(); document.execCommand('copy'); done(); }
  }
  if (action === 'invite-unlink') { const was = couple; saveCouple(null); closeInvite(); toast(`${was.b === myNick() ? was.a : was.b} 님과의 연동을 해제했어요`); }
  if (action === 'hall-modal-open') { e.preventDefault(); openHallModal(); }
  if (action === 'hall-modal-close') closeHallModal();
  if (action === 'hall-reco-clear') { e.preventDefault(); changeKeepingOthers(['hall'], () => { budget.hallSetup = null; const h = budget.cats.find((c) => c.id === 'hall'); if (h) h.w = 1; }); refreshBudgetForm(); toast('예식장 · 식대를 평균가로 되돌렸어요'); }
  if (action === 'hm-prev' && hm.step > 1) { hm.step--; renderHallModal(); }
  if (action === 'hm-next') { if (hm.step < 3) { hm.step++; renderHallModal(); } else applyHallEstimate(); }
  const hmPick = t.closest('[data-hmtype], [data-hmregion], [data-hmguests]');
  if (hmPick) {
    if (hmPick.dataset.hmtype) hm.type = hmPick.dataset.hmtype;
    if (hmPick.dataset.hmregion) hm.region = hmPick.dataset.hmregion;
    if (hmPick.dataset.hmguests) hm.guests = +hmPick.dataset.hmguests;
    renderHallModal();
  }
  if (action === 'toggle-menu') $('.gnb-menu').classList.toggle('open');
  if (action === 'promo-prev' || action === 'promo-next') { showPromo(promo.i + (action === 'promo-next' ? 1 : -1)); startPromo(); }
  if (action === 'feed-prev') slideFeed(-1);
  if (action === 'feed-next') slideFeed(1);
  // 로그인 · 회원가입
  if (action === 'demo-login-user') finishLogin(DEMO_USER, '민지 님, 다시 만나 반가워요', 'mypage');
  if (action === 'biz-login') bizLogin();
  if (action === 'signup-user') signupUser();
  if (action === 'signup-biz') signupBiz();
  if (action === 'bz-save') saveBizProfile();
  if (action === 'bz-preview') previewBizVendor();
  if (action === 'bz-photo-add') {
    const pool = Object.values(VENDOR_IMG).filter((p) => !bzDraftPhotos.includes(p));
    if (pool.length) { bzDraftPhotos.push(pool[0]); renderBizPhotos(); updateBizPreview(); toast('사진을 추가했어요 (프로토타입: 예시 사진)'); }
  }
  if (action === 'bz-reply-open') { inqOpen = +t.closest('[data-id]').dataset.id; renderInquiries(); }
  if (action === 'bz-reply-cancel') { inqOpen = null; renderInquiries(); }
  if (action === 'bz-reply-send') {
    const text = $('#bzReply').value.trim();
    if (!text) { toast('답장 내용을 입력해 주세요'); return; }
    const q = INQUIRIES.find((x) => x.id === +t.closest('[data-id]').dataset.id);
    Object.assign(q, { status: 'done', reply: text });
    inqOpen = null;
    renderBiz();
    toast(`${q.who} 님에게 답장을 보냈어요`);
  }
  if (action === 'bz-cal-prev' || action === 'bz-cal-next') {
    const d = new Date(bizCal.y, bizCal.m + (action === 'bz-cal-next' ? 1 : -1), 1);
    bizCal.y = d.getFullYear(); bizCal.m = d.getMonth();
    renderBizCal();
  }
  if (action === 'toggle-mode') {
    closeModeTip();
    const on = !bizMode;
    setMode(on);
    if (on) location.hash = authUser?.type === 'biz' ? '#partner-dash' : '#partner';
    else if (/^#(partner|signup-biz)/.test(location.hash)) location.hash = '#home';
    toast(on ? '업체 모드로 전환했어요' : '예비부부 모드로 전환했어요');
  }
  if (action === 'close-mode-tip') closeModeTip();
  if (action === 'logout') { saveAuth(null); toast('로그아웃했어요'); location.hash = '#home'; }
  if (action === 'addr-search') { $('#sbAddr').value = '서울 마포구 양화로 45'; toast('주소 검색 창이 열려요 (프로토타입) · 예시 주소를 넣었어요'); }
  if (action === 'proof-upload') {
    sbProof = $('.proof-opts .option-card.active').dataset.proof;
    updateProofUI();
    toast(`${proofLabel(sbProof)}을(를) 올렸어요 (프로토타입)`);
  }
  if (action === 'dash-proof') { saveAuth({ ...authUser, proof: 'biz' }); toast('증빙 서류를 올렸어요 · 검토 후 디렉토리에 소개돼요'); }
  if (action === 'cal-prev' || action === 'cal-next') {
    const d = new Date(calView.y, calView.m + (action === 'cal-next' ? 1 : -1), 1);
    calView.y = d.getFullYear(); calView.m = d.getMonth();
    renderMyCalendar();
  }
  if (action === 'cal-today') { calView.y = new Date().getFullYear(); calView.m = new Date().getMonth(); renderMyCalendar(); }
  if (action === 'drawer-close') closeDrawer();
  if (action === 'dw-hide' && drawerItem) {
    drawerItem.hidden = true;
    closeDrawer();
    renderTimeline();
    toast('타임라인에서 뺐어요 · 숨긴 항목에서 되살릴 수 있어요');
  }
  if (action === 'tl-hidden-toggle') {
    $('#tlHiddenList').hidden = !$('#tlHiddenList').hidden;
    renderTimeline();
  }
  if (action === 'tl-add-open' || action === 'tl-add-cancel') {
    const box = t.closest('.tl-add');
    const opening = action === 'tl-add-open';
    box.querySelector('.tl-add-form').hidden = !opening;
    box.querySelector('[data-action="tl-add-open"]').hidden = opening;
    if (opening) box.querySelector('.tl-add-input').focus();
  }
  if (action === 'tl-add-save') addCustomItem(t.closest('.tl-add'));
  if (action === 'tl-reset') resetTimeline();
  if (action === 'dw-add-cal' && drawerItem) {
    const value = $('#dwDate').value;
    if (!value) { toast('날짜를 골라주세요'); return; }
    const isNew = !drawerItem.date;
    drawerItem.date = value;
    const d = new Date(value);
    calView.y = d.getFullYear(); calView.m = d.getMonth(); // 추가한 달로 캘린더 이동
    renderTimeline();
    updateDrawerDate();
    toast(isNew ? `캘린더 ${fmtMD(value)}에 추가했어요` : `${fmtMD(value)}로 날짜를 바꿨어요`);
  }
  if (action === 'dw-remove-cal' && drawerItem) {
    drawerItem.date = null;
    renderTimeline();
    updateDrawerDate();
    toast('캘린더에서 뺐어요');
  }
  if (action === 'guide-next') showGuide(guideStep + 1);
  if (action === 'guide-prev') showGuide(guideStep - 1);
  if (action === 'ob-next') obStepper.next();
  if (action === 'ob-prev') obStepper.prev();
  if (action === 'pj-next') pjNext();
  if (action === 'pj-prev') { if (pjIdx === 0) history.back(); else showPj(pjIdx - 1); }
  if (action === 'like') {
    const b = t.closest('[data-action]');
    const on = b.classList.toggle('liked');
    b.setAttribute('aria-pressed', on);
    b.querySelector('span').textContent = on ? '찜함' : '찜하기';
    toast(on ? '찜 목록에 담았어요' : '찜을 해제했어요');
  }

  const msg = t.closest('[data-toast]')?.dataset.toast;
  if (msg) toast(msg);
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if ((t.id === 'dwTitleInput' || t.id === 'dwDescInput') && drawerItem) {
    if (t.id === 'dwTitleInput' && t.value.trim()) drawerItem.t = t.value.trim();
    if (t.id === 'dwDescInput') drawerItem.d = t.value.trim();
    $('#dwTitle').textContent = drawerItem.t;
    renderTimeline();
  }
  if (t.id === 'dwMemo' && drawerItem) {
    drawerItem.memo = t.value;
    $('#dwMemoSaved').textContent = '· 저장됨';
    renderTimeline();
  }
  if (t.matches('[data-bw]')) {
    changeKeepingOthers([t.dataset.bw], () => { budgetTarget(t.dataset.bw).w = +t.value; });
    $(`[data-bwout="${t.dataset.bw}"]`).textContent = fmtW(t.dataset.bw, +t.value);
    updatePreview();
  }
  if (t.matches('[data-bamtin]')) {
    const k = t.dataset.bamtin;
    // 금액 직접 입력 → 그 금액이 되도록 이 항목의 배수만 바꿈 (다른 항목은 그대로, 총예산은 합계로 따라감)
    const leaf = budgetLeaves().leaves.find((l) => l.key === k);
    const v = Math.min(Math.max(Math.round(+t.value || 0), 0), isFreeKey(k) ? CUSTOM_MAX : Infinity);
    const groupW = leaf.sub ? leaf.cat.w : 1;
    if (leaf.est > 0 && groupW > 0) budgetTarget(k).w = v / (leaf.est * groupW);
    updatePreview();
  }
  if (t.id === 'hmGuestInput') { hm.guests = Math.max(Math.round(+t.value || 0), 0); renderHallModal(); }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.target.id === 'bizLoginEmail' || e.target.id === 'bizLoginPw')) bizLogin();
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'bTotal') {
    const target = Math.max(Math.round(+e.target.value || 0), 0);
    if (!setTotalBudget(target)) toast('모든 항목이 고정된 금액이라 조정할 항목이 없어요');
    refreshBudgetForm();
  }
  // ① 기본 항목 체크 (본식 · 드레스 · 메이크업)
  if (e.target.matches('[data-basic]')) {
    const key = e.target.dataset.basic;
    const on = e.target.checked;
    if (key === 'hall') changeKeepingOthers(['hall'], () => { if (on) addBudgetCat('hall'); else removeBudgetCat('hall'); });
    else changeKeepingOthers([`sdm.${key}`], () => setSdmSub(key, on));
    refreshBudgetForm();
  }
  // ② 위시리스트 체크
  if (e.target.matches('[data-wish]')) {
    const n = e.target.dataset.wish;
    const on = e.target.checked;
    changeKeepingOthers(['etc'], () => toggleWish(n, on));
    renderWishList();
    updatePreview();
  }
  if (e.target.id === 'weddingDate') renderTimeline();
  // 약관: 전체 동의 ↔ 개별 항목
  if (e.target.matches('[data-term-all]')) $$('[data-term]', e.target.closest('.terms')).forEach((c) => { c.checked = e.target.checked; });
  if (e.target.matches('[data-term]')) {
    const box = e.target.closest('.terms');
    $('[data-term-all]', box).checked = $$('[data-term]', box).every((c) => c.checked);
  }
  if (e.target.id === 'dwPhaseSel' && drawerItem) {
    const to = +e.target.value;
    moveItem(drawerItem.id, to);
    const p = TL_PHASES[to];
    $('#dwPhase').textContent = `Phase ${to + 1}. ${p.title} · D-${p.from}~${p.to}개월`;
    $(`#timelineList .phase[data-phase="${to}"]`)?.classList.remove('collapsed');
    renderTimeline();
    updateDrawerDate();
    toast(`Phase ${to + 1}(으)로 옮겼어요`);
  }
  if (e.target.id === 'dwDone' && drawerItem) {
    drawerItem.done = e.target.checked;
    renderTimeline();
  }
  if (e.target.matches('.tl-check')) {
    const item = tlItems.find((it) => it.id === e.target.closest('[data-item]').dataset.item);
    item.done = e.target.checked;
    renderTimeline();
  }
});

/* ---------- 우리 업체 알리기: 진행 단계 가로 넘김 · 고정 버튼 ---------- */
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// 섹션이 화면에 고정된 동안의 세로 스크롤 진행률(0~1)을 목표값으로 두고,
// 매 프레임 조금씩 따라가며(관성) 카드 줄을 밀고 카드 크기를 거리에 따라 연속으로 바꿈
const ptFlow = { cur: 0, target: 0, maxShift: 0, raf: 0 };

function updatePtFlow() {
  const flow = $('#ptFlow');
  const track = $('#ptFlowTrack');
  const cards = $$('.pt-step', track);
  if (reduceMotion()) {
    track.style.transform = '';
    cards.forEach((c) => { c.style.transform = ''; c.classList.add('is-active'); });
    $$('[data-seq]', track).forEach((e) => e.classList.add('on'));
    return;
  }
  const sticky = flow.firstElementChild;
  const top = parseFloat(getComputedStyle(sticky).top) || 0;
  const range = flow.offsetHeight - sticky.offsetHeight;
  ptFlow.target = range > 0 ? Math.min(1, Math.max(0, (top - flow.getBoundingClientRect().top) / range)) : 0;
  ptFlow.maxShift = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
  if (!ptFlow.raf) ptFlow.raf = requestAnimationFrame(stepPtFlow);
}

function stepPtFlow() {
  ptFlow.raf = 0;
  ptFlow.cur += (ptFlow.target - ptFlow.cur) * 0.12;
  if (Math.abs(ptFlow.target - ptFlow.cur) < 0.0004) ptFlow.cur = ptFlow.target;
  renderPtFlow(ptFlow.cur);
  if (ptFlow.cur !== ptFlow.target) ptFlow.raf = requestAnimationFrame(stepPtFlow);
}

function renderPtFlow(p) {
  const track = $('#ptFlowTrack');
  const cards = $$('.pt-step', track);
  const pos = p * (cards.length - 1);
  track.style.transform = `translate3d(${(-p * ptFlow.maxShift).toFixed(1)}px, 0, 0)`;
  cards.forEach((c, i) => {
    const d = Math.min(1, Math.abs(i - pos));
    const eased = d * d * (3 - 2 * d); // smoothstep: 가까울수록 1에 붙고 멀어질수록 부드럽게 작아짐
    c.style.transform = `scale(${(1 - 0.1 * eased).toFixed(4)})`;
  });
  const active = Math.round(pos);
  cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
  $$('.pt-flow-dots i').forEach((d, i) => d.classList.toggle('on', i === active));
  runPtSeq(cards[active]);
}

// 카드 설명 애니메이션: 강조된 카드 안의 [data-seq] 요소에 순서대로 on을 붙이고,
// 다 보여준 뒤 함께 사라졌다가 처음부터 반복.
// 다른 카드로 넘어가면 그 순간 모습 그대로 정지(진행 중이던 전환 · 애니메이션까지),
// 다시 돌아오면 멈춘 지점부터 이어서 재생 (초기화하지 않음)
const ptSeqState = new Map();
let ptSeqCard = null;

function ptSeqSchedule(st, fn, ms) {
  st.fn = fn;
  st.due = performance.now() + ms;
  st.timer = setTimeout(() => { st.timer = null; fn(); }, ms);
}

// 카드 그림 속 CSS 전환 · 애니메이션(가상 요소 포함)을 그 자리에서 멈추거나 이어서 재생
// (카드 자체의 테두리 · 그림자 강조 전환은 제외해야 강조가 바로 옮겨감)
const ptCardAnims = (card, action) => $('.pt-step-art', card).getAnimations({ subtree: true }).forEach((a) => a[action]());

function ptSeqPause(card) {
  ptCardAnims(card, 'pause');
  const st = ptSeqState.get(card);
  if (!st || !st.timer) return;
  clearTimeout(st.timer);
  st.timer = null;
  st.remaining = Math.max(0, st.due - performance.now());
}

function ptSeqStart(card) {
  // 타이핑 폭을 실제 글자 폭에 맞춤 (잘려 있어도 Range는 글자 자체의 폭을 돌려줌)
  $$('.a1-name span', card).forEach((t) => {
    const r = document.createRange();
    r.selectNodeContents(t);
    t.style.setProperty('--w', `${Math.ceil(r.getBoundingClientRect().width)}px`);
  });
  const items = $$('[data-seq]', card);
  const last = Math.max(...items.map((e) => +e.dataset.seq));
  const st = { n: 0, fn: null, due: 0, timer: null, remaining: 0 };
  const tick = () => {
    st.n += 1;
    items.forEach((e) => e.classList.toggle('on', +e.dataset.seq <= st.n));
    if (st.n < last) ptSeqSchedule(st, tick, 800);
    else ptSeqSchedule(st, fadeOut, 3000);
  };
  const fadeOut = () => {
    items.forEach((e) => e.classList.remove('on'));
    st.n = 0;
    ptSeqSchedule(st, tick, 1100);
  };
  ptSeqState.set(card, st);
  ptSeqSchedule(st, tick, 500);
}

function runPtSeq(card) {
  if (card === ptSeqCard) return;
  if (ptSeqCard) ptSeqPause(ptSeqCard);
  else if (card) $$('.pt-step').forEach((c) => { if (c !== card) ptCardAnims(c, 'pause'); }); // 처음엔 강조된 카드만 움직임
  ptSeqCard = card;
  if (!card) return;
  ptCardAnims(card, 'play');
  const st = ptSeqState.get(card);
  if (st && st.fn) ptSeqSchedule(st, st.fn, st.remaining); // 멈췄던 곳부터 이어서
  else ptSeqStart(card);
}

// 고정 버튼: 히어로의 '우리 업체 알리기'가 화면 위로 지나가면 보이고, 맨 아래 배너가 보이면 숨김
function updatePtFab() {
  const fab = $('#ptFab');
  const on = $('#screen-partner').classList.contains('active');
  const gnb = $('.gnb').offsetHeight;
  const show = on && $('.pt-hero .hm-cta').getBoundingClientRect().bottom < gnb
    && $('.pt-cta').getBoundingClientRect().top > innerHeight;
  fab.classList.toggle('show', show);
  fab.tabIndex = show ? 0 : -1;
  fab.setAttribute('aria-hidden', !show);
}

let ptTicking = false;
function onPartnerScroll() {
  if (ptTicking) return;
  ptTicking = true;
  requestAnimationFrame(() => {
    ptTicking = false;
    updatePtFab();
    if ($('#screen-partner').classList.contains('active')) updatePtFlow();
    else runPtSeq(null);
  });
}
window.addEventListener('scroll', onPartnerScroll, { passive: true });
window.addEventListener('resize', onPartnerScroll);

/* ---------- 초기화 ---------- */
renderHome();
renderBudgetInputs();
updatePreview();
loadTimeline();
renderTimeline();
renderDirectory();
$('#reviewFeed').innerHTML = REVIEWS.map(reviewCard).join('');
$('#bizCats').innerHTML = CATEGORIES.slice(1).map((c) => `<span><i data-lucide="${c.icon}"></i>${c.name}</span>`).join('');
$('#pjCats').innerHTML =CATEGORIES.slice(1).map((c) =>
  `<button class="chip ${c.name === '아이폰스냅' ? 'active' : ''}">${c.name}</button>`).join('');
renderCalendar($('#pjCal'), { year: 2027, month: 4, status: (d, dow) => (dow === 0 || dow === 6 ? 'ok' : 'no') });
applyAuthUI();
drawIcons();
startHeroDemo();
$('#homeFeed').addEventListener('scroll', updateFeedNav, { passive: true });
showPromo(0);
startPromo();
['mouseenter', 'focusin'].forEach((ev) => $('#homePromo').addEventListener(ev, stopPromo));
['mouseleave', 'focusout'].forEach((ev) => $('#homePromo').addEventListener(ev, startPromo));
$('#bzForm').addEventListener('input', updateBizPreview); // 업체 정보 입력 → 미리보기 바로 갱신
window.addEventListener('resize', updateFeedNav);
route();
