// 업체 더미 데이터 (프로토타입)
// price: null → 가격 비공개('상담 후 안내'), schedule: false → 일정 미공개('일정 문의')

export type Tier = '가성비' | '표준' | '프리미엄';
export const TIER_ORDER: Tier[] = ['가성비', '표준', '프리미엄'];

export interface Vendor {
  id: number;
  name: string;
  cat: string;
  region: string;
  type: string;
  price: string | null;
  tier: Tier;
  schedule?: boolean;
  insta: boolean;
  handle?: string; // 인스타그램 계정 (insta가 true일 때)
  intro: boolean;
  moods: string[];
  verified: number; // 인증 후기 수
  rating: number;
  reviews: number;
  h: number; // 디렉토리 메이슨리 사진 높이(px)
  photo?: string; // 목업 사진 파일 이름 (public/images/*.jpg)
}

export const VENDORS: Vendor[] = [
  { id: 1, name: '필름하루 스냅', cat: '아이폰스냅', region: '서울 · 제주', type: '1인 작가', price: '35~75만 원', tier: '표준', insta: true, intro: true, moods: ['#야외스냅', '#필름감성', '#내추럴'], verified: 30, rating: 4.9, reviews: 38, h: 220, handle: 'filmharu.snap', photo: 'biz_07' },
  { id: 2, name: '오월의 헤어', cat: '헤어변형', region: '서울 강남', type: '1인 숍', price: '40~60만 원', tier: '표준', insta: true, intro: false, moods: ['#유니크헤어', '#빈티지'], verified: 41, rating: 4.8, reviews: 52, h: 260, handle: 'mayhair.studio', photo: 'biz_01' },
  { id: 3, name: '플랜비 웨딩', cat: '플래너', region: '서울 · 경기', type: '프리랜서 플래너', price: '상담 무료 · 동행 120만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식', '#미니멀'], verified: 15, rating: 4.7, reviews: 21, h: 180 },
  { id: 4, name: '라메르 빈티지', cat: '드레스', region: '서울 성수', type: '빈티지 숍', price: '180~320만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#클래식'], verified: 33, rating: 4.9, reviews: 44, h: 280, handle: 'lamer.vintage', photo: 'biz_02' },
  { id: 5, name: '하우스 오브 린넨', cat: '웨딩홀', region: '경기 양평', type: '하우스 웨딩', price: null, tier: '표준', insta: true, intro: false, moods: ['#하우스웨딩', '#내추럴'], verified: 9, rating: 4.6, reviews: 17, h: 200, handle: 'houseoflinen', photo: 'biz_09' },
  { id: 6, name: '모먼트 본식스냅', cat: '본식스냅', region: '전국', type: '2인 팀', price: '90~150만 원', tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#필름감성'], verified: 50, rating: 4.8, reviews: 63, h: 240, handle: 'moment.mainsnap', photo: 'biz_14' },
  { id: 7, name: '오늘의 청첩', cat: '모바일청첩장', region: '온라인', type: '미니게임 청첩장', price: '3~8만 원', tier: '가성비', insta: false, intro: true, moods: ['#미니멀'], verified: 90, rating: 4.9, reviews: 120, h: 190, photo: 'biz_12' },
  { id: 8, name: '들꽃 아틀리에', cat: '웨딩플라워', region: '서울 연남', type: '1인 플로리스트', price: '부케 15~35만 원', tier: '표준', insta: true, intro: false, moods: ['#내추럴', '#빈티지', '#야외스냅'], verified: 18, rating: 4.7, reviews: 29, h: 250, handle: 'deulkkot.atelier', photo: 'biz_04' },
  { id: 9, name: '스튜디오 무드', cat: '스튜디오', region: '서울 청담', type: '스튜디오', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 30, rating: 4.6, reviews: 48, h: 210, handle: 'studio.mood', photo: 'biz_06' },
  { id: 10, name: '결 메이크업', cat: '메이크업', region: '서울 압구정', type: '원장 1:1', price: '40~70만 원', tier: '표준', insta: false, intro: false, moods: ['#클래식', '#내추럴'], verified: 22, rating: 4.8, reviews: 36, h: 230, photo: 'biz_11' },
  { id: 11, name: '프레임 필름', cat: '식전영상', region: '온라인', type: '1인 제작', price: '15~40만 원', tier: '가성비', insta: false, intro: false, moods: ['#필름감성'], verified: 20, rating: 4.7, reviews: 27, h: 180 },
  { id: 12, name: '목소리 좋은 MC 지훈', cat: '본식사회자', region: '서울 · 경기', type: '전문 사회자', price: '30~50만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식'], verified: 28, rating: 4.9, reviews: 41, h: 200 },
  { id: 13, name: '굿모먼트 축의대', cat: '축의대', region: '서울 · 경기', type: '대행 서비스', price: '15~25만 원', tier: '가성비', insta: false, intro: false, moods: ['#미니멀'], verified: 5, rating: 4.5, reviews: 12, h: 170 },
  { id: 14, name: '소소한 소품', cat: '웨딩소품', region: '온라인', type: '핸드메이드', price: '1~20만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#하우스웨딩'], verified: 60, rating: 4.8, reviews: 88, h: 210, handle: 'soso.props', photo: 'biz_05' },
  { id: 15, name: '테일러 정', cat: '예복·한복', region: '서울 종로', type: '맞춤 예복', price: null, schedule: false, tier: '표준', insta: false, intro: false, moods: ['#클래식'], verified: 10, rating: 4.7, reviews: 19, h: 240, photo: 'biz_10' },
  { id: 16, name: '제주 바람스냅', cat: '아이폰스냅', region: '제주', type: '1인 작가', price: '45~90만 원', tier: '표준', insta: true, intro: true, moods: ['#야외스냅', '#내추럴'], verified: 45, rating: 4.9, reviews: 57, h: 270, handle: 'jeju.baramsnap', photo: 'biz_08' },
  { id: 17, name: '손길 웨딩헬퍼', cat: '헬퍼', region: '서울 · 경기', type: '1인 헬퍼', price: '본식 15~25만 원', tier: '가성비', insta: false, intro: true, moods: ['#클래식'], verified: 25, rating: 4.9, reviews: 34, h: 200 },
  { id: 18, name: '하루 헬퍼팀', cat: '헬퍼', region: '전국', type: '2인 팀', price: '본식+2부 20~35만 원', tier: '표준', insta: false, intro: false, moods: ['#내추럴'], verified: 8, rating: 4.7, reviews: 15, h: 230 },
  { id: 19, name: '블룸 플라워랩', cat: '웨딩플라워', region: '서울 한남', type: '플라워 스튜디오', price: '부케 20~45만 원', tier: '표준', insta: true, intro: true, moods: ['#클래식', '#하우스웨딩'], verified: 24, rating: 4.8, reviews: 31, h: 240, handle: 'bloom.flowerlab', photo: 'biz_13' },
  { id: 20, name: '화이트룸 스튜디오', cat: '스튜디오', region: '서울 성수', type: '실내 스튜디오', price: '180~260만 원', tier: '표준', insta: true, intro: true, moods: ['#미니멀', '#클래식'], verified: 27, rating: 4.8, reviews: 39, h: 260, handle: 'whiteroom.studio', photo: 'biz_15' },
  { id: 21, name: '단아 한복', cat: '예복·한복', region: '서울 종로', type: '한복 대여 · 맞춤', price: '대여 25~45만 원', tier: '가성비', insta: true, intro: true, moods: ['#클래식', '#빈티지'], verified: 35, rating: 4.9, reviews: 46, h: 250, handle: 'dana.hanbok', photo: 'biz_16' },
  { id: 22, name: '플레이풀 스튜디오', cat: '스튜디오', region: '서울 망원', type: '캐주얼 웨딩 스튜디오', price: '120~190만 원', tier: '가성비', insta: true, intro: false, moods: ['#내추럴', '#빈티지'], verified: 19, rating: 4.7, reviews: 26, h: 230, handle: 'playful.studio', photo: 'biz_17' },
  { id: 23, name: '메종 드 리본', cat: '드레스', region: '서울 청담', type: '수입 드레스 숍', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 21, rating: 4.8, reviews: 30, h: 280, handle: 'maison.de.ruban', photo: 'biz_18' },
];

/** 홈 사진 피드: 사진이 있는 업체만, 이 순서로 */
export const FEED_IDS = [1, 4, 20, 8, 5, 21, 9, 14, 23, 10, 6, 2, 22, 19, 15, 16, 7];

/** 목업 사진 주소 (없으면 null) */
export const imageUrl = (photo?: string | null) => (photo ? `/images/${photo}.jpg` : null);
