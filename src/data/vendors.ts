// 업체 더미 데이터 (프로토타입)
// price: null → 가격 비공개('상담 후 안내'), schedule: false → 일정 미공개('일정 문의')

import { MAP_CATEGORIES } from './categories';
import type { ServiceArea } from './regions';

export type Tier = '가성비' | '표준' | '프리미엄';
export const TIER_ORDER: Tier[] = ['가성비', '표준', '프리미엄'];

export interface Vendor {
  id: number;
  name: string;
  cat: string;
  area: ServiceArea; // 활동 지역 (시 · 도별 세부 지역 · 전국 출장 · 온라인)
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
  photo?: string; // 목업 사진 파일 이름 (public/images/*.jpg)
}

// 활동 지역 줄여 쓰기: 시 · 도별 세부 지역(빈 배열 = 전체) + 전국 출장 · 온라인
const at = (areas: ServiceArea['areas'], extra: Partial<Omit<ServiceArea, 'areas'>> = {}): ServiceArea => ({ areas, nationwide: false, online: false, ...extra });

export const VENDORS: Vendor[] = [
  { id: 1, name: '필름하루 스냅', cat: '아이폰스냅', area: at({ 서울: [], 제주: [] }), type: '1인 작가', price: '35~75만 원', tier: '표준', insta: true, intro: true, moods: ['#클래식', '#전통적', '#내추럴'], verified: 30, rating: 4.9, reviews: 38, handle: 'filmharu.snap', photo: 'biz_07' },
  { id: 2, name: '오월의 헤어', cat: '헤어변형', area: at({ 서울: ['강남구'] }), type: '1인 숍', price: '40~60만 원', tier: '표준', insta: true, intro: false, moods: ['#유니크', '#빈티지'], verified: 41, rating: 4.8, reviews: 52, handle: 'mayhair.studio', photo: 'biz_01' },
  { id: 3, name: '플랜비 웨딩', cat: '플래너', area: at({ 서울: [], 경기: [] }), type: '프리랜서 플래너', price: '상담 무료 · 동행 120만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식', '#미니멀'], verified: 15, rating: 4.7, reviews: 21 },
  { id: 4, name: '라메르 빈티지', cat: '드레스', area: at({ 서울: ['성동구'] }), type: '빈티지 숍', price: '180~320만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#클래식'], verified: 33, rating: 4.8, reviews: 44, handle: 'lamer.vintage', photo: 'biz_02' },
  { id: 7, name: '오늘의 청첩', cat: '모바일청첩장', area: at({}, { online: true }), type: '미니게임 청첩장', price: '3~8만 원', tier: '가성비', insta: false, intro: true, moods: ['#미니멀'], verified: 90, rating: 4.9, reviews: 120, photo: 'biz_12' },
  { id: 8, name: '들꽃 아틀리에', cat: '웨딩플라워', area: at({ 서울: ['마포구'] }), type: '1인 플로리스트', price: '부케 15~35만 원', tier: '표준', insta: true, intro: false, moods: ['#내추럴', '#빈티지', '#감성적'], verified: 18, rating: 4.7, reviews: 29, handle: 'deulkkot.atelier', photo: 'biz_04' },
  { id: 9, name: '스튜디오 무드', cat: '스튜디오', area: at({ 서울: ['강남구'] }), type: '스튜디오', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 30, rating: 4.6, reviews: 48, handle: 'studio.mood', photo: 'biz_06' },
  { id: 10, name: '결 메이크업', cat: '메이크업', area: at({ 서울: ['강남구'] }), type: '원장 1:1', price: '40~70만 원', tier: '표준', insta: false, intro: false, moods: ['#클래식', '#내추럴'], verified: 22, rating: 4.8, reviews: 36, photo: 'biz_11' },
  { id: 11, name: '프레임 필름', cat: '식전영상', area: at({}, { online: true }), type: '1인 제작', price: '15~40만 원', tier: '가성비', insta: false, intro: false, moods: ['#로맨틱'], verified: 20, rating: 4.7, reviews: 27 },
  { id: 12, name: '목소리 좋은 MC 지훈', cat: '본식사회자', area: at({ 서울: [], 경기: [] }), type: '전문 사회자', price: '30~50만 원', tier: '표준', schedule: false, insta: false, intro: true, moods: ['#클래식'], verified: 28, rating: 4.9, reviews: 41 },
  { id: 13, name: '굿모먼트 축의대', cat: '축의대', area: at({ 서울: [], 경기: [] }), type: '대행 서비스', price: '15~25만 원', tier: '가성비', insta: false, intro: false, moods: ['#미니멀'], verified: 0, rating: 0, reviews: 0 },
  { id: 14, name: '소소한 소품', cat: '웨딩소품', area: at({}, { online: true }), type: '핸드메이드', price: '1~20만 원', tier: '가성비', insta: true, intro: true, moods: ['#빈티지', '#감성적'], verified: 60, rating: 4.8, reviews: 88, handle: 'soso.props', photo: 'biz_05' },
  { id: 15, name: '테일러 정', cat: '예복·한복', area: at({ 서울: ['종로구'] }), type: '맞춤 예복', price: null, schedule: false, tier: '표준', insta: false, intro: false, moods: ['#클래식'], verified: 10, rating: 4.7, reviews: 19, photo: 'biz_10' },
  { id: 16, name: '제주 바람스냅', cat: '아이폰스냅', area: at({ 제주: [] }), type: '1인 작가', price: '45~90만 원', tier: '표준', insta: true, intro: true, moods: ['#클래식', '#내추럴'], verified: 45, rating: 4.9, reviews: 57, handle: 'jeju.baramsnap', photo: 'biz_08' },
  { id: 17, name: '손길 웨딩헬퍼', cat: '헬퍼', area: at({ 서울: [], 경기: [] }), type: '1인 헬퍼', price: '본식 15~25만 원', tier: '가성비', insta: false, intro: true, moods: ['#클래식'], verified: 25, rating: 4.9, reviews: 34 },
  { id: 18, name: '하루 헬퍼팀', cat: '헬퍼', area: at({}, { nationwide: true }), type: '2인 팀', price: '본식+2부 20~35만 원', tier: '표준', insta: false, intro: false, moods: ['#내추럴'], verified: 8, rating: 4.7, reviews: 15 },
  { id: 19, name: '블룸 플라워랩', cat: '웨딩플라워', area: at({ 서울: ['용산구'] }), type: '플라워 스튜디오', price: '부케 20~45만 원', tier: '표준', insta: true, intro: true, moods: ['#클래식', '#고급스러움'], verified: 24, rating: 4.8, reviews: 31, handle: 'bloom.flowerlab', photo: 'biz_13' },
  { id: 20, name: '화이트룸 스튜디오', cat: '스튜디오', area: at({ 서울: ['성동구'] }), type: '실내 스튜디오', price: '180~260만 원', tier: '표준', insta: true, intro: true, moods: ['#미니멀', '#클래식'], verified: 27, rating: 4.8, reviews: 39, handle: 'whiteroom.studio', photo: 'biz_15' },
  { id: 21, name: '단아 한복', cat: '예복·한복', area: at({ 서울: ['종로구'] }), type: '한복 대여 · 맞춤', price: '대여 25~45만 원', tier: '가성비', insta: true, intro: true, moods: ['#클래식', '#빈티지'], verified: 35, rating: 4.9, reviews: 46, handle: 'dana.hanbok', photo: 'biz_16' },
  { id: 22, name: '플레이풀 스튜디오', cat: '스튜디오', area: at({ 서울: ['마포구'] }), type: '캐주얼 웨딩 스튜디오', price: '120~190만 원', tier: '가성비', insta: true, intro: false, moods: ['#내추럴', '#빈티지'], verified: 19, rating: 4.7, reviews: 26, handle: 'playful.studio', photo: 'biz_17' },
  { id: 23, name: '메종 드 리본', cat: '드레스', area: at({ 서울: ['강남구'] }), type: '수입 드레스 숍', price: null, tier: '프리미엄', insta: true, intro: true, moods: ['#클래식', '#미니멀'], verified: 21, rating: 4.8, reviews: 30, handle: 'maison.de.ruban', photo: 'biz_18' },
  // 서울 밖 지역 예시 (지역 필터 확인용)
  { id: 24, name: '라온 가든홀', cat: '웨딩홀', area: at({ 경기: ['성남시'] }), type: '가든 웨딩홀', price: '식대 6~7만 원', tier: '표준', insta: true, intro: true, moods: ['#내추럴', '#로맨틱'], verified: 16, rating: 4.7, reviews: 23, handle: 'raon.gardenhall' },
  { id: 25, name: '해온 드레스', cat: '드레스', area: at({ 경상: ['부산'] }), type: '드레스 숍', price: '150~280만 원', tier: '가성비', insta: true, intro: false, moods: ['#클래식', '#고급스러움'], verified: 12, rating: 4.6, reviews: 18, handle: 'haeon.dress' },
  { id: 26, name: '빛고을 메이크업', cat: '메이크업', area: at({ 전라: ['광주'] }), type: '원장 1:1', price: '35~55만 원', tier: '가성비', insta: false, intro: true, moods: ['#내추럴', '#러블리'], verified: 9, rating: 4.8, reviews: 14 },
  { id: 27, name: '한밭 스튜디오', cat: '스튜디오', area: at({ 충청: ['대전'] }), type: '실내 스튜디오', price: '130~200만 원', tier: '가성비', insta: true, intro: false, moods: ['#모던', '#미니멀'], verified: 11, rating: 4.7, reviews: 17, handle: 'hanbat.studio' },
  { id: 28, name: '바다결 스냅', cat: '아이폰스냅', area: at({ 강원: ['강릉시', '속초시', '양양군'] }), type: '1인 작가', price: '40~70만 원', tier: '가성비', insta: true, intro: true, moods: ['#내추럴', '#감성적'], verified: 14, rating: 4.8, reviews: 20, handle: 'badagyeol.snap' },
];

/** 홈 사진 피드: 사진이 있는 업체만, 이 순서로 */
export const FEED_IDS = [1, 4, 20, 8, 5, 21, 9, 14, 23, 10, 6, 2, 22, 19, 15, 16, 7];

/** 목업 사진 주소 (없으면 null) */
/** public/images 안 파일 주소 (배포 경로 기준) */
export const publicImage = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;
export const imageUrl = (photo?: string | null) => (photo ? publicImage(`${photo}.jpg`) : null);

/* ---------- 위치 (지도) ---------- */
export interface VendorPlace { area: string; lat: number; lng: number }
// 가상 업체라 실제 가게 주소 대신 동네 단위의 대략적인 위치 (예시 좌표)
const PLACES: Record<number, VendorPlace> = {
  2: { area: '서울 강남구 신사동', lat: 37.5207, lng: 127.0230 },
  4: { area: '서울 성동구 성수동', lat: 37.5446, lng: 127.0557 },
  8: { area: '서울 마포구 연남동', lat: 37.5627, lng: 126.9255 },
  9: { area: '서울 강남구 청담동', lat: 37.5250, lng: 127.0470 },
  10: { area: '서울 강남구 압구정동', lat: 37.5271, lng: 127.0285 },
  15: { area: '서울 종로구 종로3가', lat: 37.5714, lng: 126.9918 },
  19: { area: '서울 용산구 한남동', lat: 37.5345, lng: 127.0010 },
  20: { area: '서울 성동구 성수동', lat: 37.5425, lng: 127.0505 },
  21: { area: '서울 종로구 인사동', lat: 37.5740, lng: 126.9850 },
  22: { area: '서울 마포구 망원동', lat: 37.5560, lng: 126.9019 },
  23: { area: '서울 강남구 청담동', lat: 37.5232, lng: 127.0435 },
  24: { area: '경기 성남시 분당구 정자동', lat: 37.3670, lng: 127.1080 },
  25: { area: '부산 해운대구 우동', lat: 35.1631, lng: 129.1636 },
  26: { area: '광주 동구 충장로', lat: 35.1480, lng: 126.9180 },
  27: { area: '대전 서구 둔산동', lat: 36.3518, lng: 127.3785 },
};
/** 업체 위치: 찾아가는 업종(MAP_CATEGORIES)이고 위치가 있을 때만 */
export const vendorPlace = (v: Vendor): VendorPlace | undefined => (MAP_CATEGORIES.includes(v.cat) ? PLACES[v.id] : undefined);
