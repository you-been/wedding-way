/* =========================================================
   웨딩웨이 프로토타입 — 화면 전환 & UI 인터랙션
   (서버/저장 기능 없음, 모든 데이터는 더미)
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- 더미 데이터 ---------- */
const CATEGORIES = [
  { name: '전체', ico: '✦' },
  { name: '플래너', ico: '☰' },
  { name: '웨딩홀', ico: '⌂' },
  { name: '스튜디오', ico: '◫' },
  { name: '드레스', ico: '♢' },
  { name: '메이크업', ico: '✿' },
  { name: '헬퍼', ico: '♡' },
  { name: '헤어변형', ico: '∿' },
  { name: '아이폰스냅', ico: '▢' },
  { name: '본식스냅', ico: '◎' },
  { name: '식전영상', ico: '▶' },
  { name: '웨딩플라워', ico: '❀' },
  { name: '웨딩소품', ico: '✧' },
  { name: '모바일청첩장', ico: '✉' },
  { name: '본식사회자', ico: '♪' },
  { name: '축의대', ico: '₩' },
  { name: '예복·한복', ico: '◇' },
];

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
];

const REVIEWS = [
  { who: '민트초코', when: '2026.09 본식', vendor: '필름하루 스냅 · 아이폰스냅', stars: 5, verified: true, price: '48만 원', extra: '추가금 없음', text: '원본을 정말 다 주셔서 놀랐어요. 보정본도 2주 안에 와서 모바일 청첩장에 바로 썼습니다. 제주 바람 많이 불었는데 오히려 그걸 살려서 찍어주셨어요.', imgs: 3 },
  { who: '봄날의곰', when: '2026.10 본식', vendor: '오월의 헤어 · 헤어변형', stars: 5, verified: true, price: '55만 원', extra: '추가금 없음', text: '스튜디오 일정 잡자마자 바로 예약했는데도 겨우 잡았어요. 컨셉별로 4번 변형해주셨고 사진 결과물에서 차이가 확실히 납니다.', imgs: 2 },
  { who: '두부', when: '2026.08 본식', vendor: '플랜비 웨딩 · 플래너', stars: 4, verified: true, price: '동행 120만 원', extra: '사전 안내된 추가금', text: '일부동행으로 진행했어요. 제휴 안 된 인디 드레스숍도 같이 봐주셔서 좋았고, 견적 비교표를 정리해주셔서 결정이 빨랐어요.', imgs: 0 },
  { who: '여름밤', when: '2026.07 본식', vendor: '라메르 빈티지 · 드레스', stars: 5, verified: false, price: '-', extra: '-', text: '빈티지 베일이 정말 예뻐요. 피팅비 없이 투어 가능했어요.', imgs: 1 },
];

const WISHLIST = [
  { name: '아이폰스냅', cost: 45 },
  { name: '헤어변형', cost: 50 },
  { name: '본식스냅', cost: 120 },
  { name: '식전영상', cost: 30 },
  { name: '웨딩 플라워/부케', cost: 40 },
  { name: '웨딩 소품', cost: 20 },
  { name: '본식 사회자', cost: 40 },
  { name: '축의대 대행', cost: 20 },
  { name: '웨딩 헬퍼', cost: 20 },
];

const BASE_CATS = [
  { name: '예식장', ratio: 0.30, color: '#b5546a' },
  { name: '스드메', ratio: 0.40, color: '#6b5b95' },
  { name: '기본 스냅', ratio: 0.15, color: '#d29b2a' },
  { name: '기타', ratio: 0.15, color: '#8fb8a5' },
];
const WISH_COLOR = '#e6a5b4';

const PHASES = [
  { title: 'Phase 1. 준비 시작 & 웨딩홀 계약', from: 12, to: 10, tasks: [
    { t: '결혼 결심 및 양가 첫 인사', d: '양가 부모님께 인사 드리고 결혼 허락 받기' },
    { t: '결혼식 예산 논의', d: '양가 지원금 및 자체 예산 조율, 총예산 설정', link: ['예산 진단', '#budget'] },
    { t: '웨딩홀 계약 (최우선)', d: '인기 홀은 1년 전 예약 오픈 시점에 바로 투어', link: ['웨딩홀 보기', '#directory?cat=웨딩홀'] },
  ]},
  { title: 'Phase 2. 준비 방식 결정 & 스드메 베이스캠프', from: 10, to: 8, tasks: [
    { t: '준비 방식 결정', d: '플래너(동행/비동행) vs 워크인 셀프', link: ['플래너 비교', '#directory?cat=플래너'] },
    { t: '스드메 업체 선정 및 조합 확정', d: '워크인: 스튜디오·드레스·메이크업 개별 서칭 및 예약', link: ['스튜디오 보기', '#directory?cat=스튜디오'] },
    { t: '커스텀 조합 및 제휴 범위 확정', d: '토탈 vs 비토탈, 헤어변형·예복·한복 제휴/개별 분류', mode: 'planner' },
  ]},
  { title: 'Phase 3. 주요 품목 계약 & 일정 확정', from: 8, to: 6, tasks: [
    { t: '신혼여행 예약', d: '해외는 항공권 가격 변동 고려해 미리 예약' },
    { t: '상견례', d: '양가 부모님 일정 조율' },
    { t: '신랑 예복 & 웨딩밴드 계약', d: '제작 기간 2~3달, 스튜디오 촬영일 역산', link: ['예복 보기', '#directory?cat=예복·한복'] },
  ]},
  { title: 'Phase 4. 스튜디오 촬영 준비 & 드레스 투어', from: 6, to: 4, tasks: [
    { t: '드레스 투어', d: '2~3곳 방문, 본식 드레스 4벌 정도 피팅', link: ['드레스 보기', '#directory?cat=드레스'] },
    { t: '헤어변형 예약', d: '1인 숍이 많아 스튜디오 일정 확정 직후 바로 예약', link: ['헤어변형 보기', '#directory?cat=헤어변형'] },
    { t: '스튜디오 촬영', d: '야외/실내 스튜디오 촬영 진행' },
  ]},
  { title: 'Phase 5. 촬영 후속 조치 & 청첩장 준비', from: 4, to: 2, tasks: [
    { t: '사진 보정 및 모바일 청첩장 제작', d: '스튜디오 보정본은 약 3개월 소요 — 사설 보정 업체 고려', link: ['청첩장 보기', '#directory?cat=모바일청첩장'] },
    { t: '혼주 한복 대여/맞춤 피팅', d: '본식 2~4개월 전 양가 어머니 동행', link: ['한복 보기', '#directory?cat=예복·한복'] },
    { t: '청첩장 모임 시작', d: '지인·동료들에게 소식 전하기' },
  ]},
  { title: 'Phase 6. 본식 최종 점검 & 마무리', from: 1, to: 0, tasks: [
    { t: '촬영 드레스 셀렉 (비토탈)', d: '6벌 피팅 후 촬영용 3~4벌 결정' },
    { t: '본식 드레스 셀렉 및 가봉', d: '체형에 맞게 가봉' },
    { t: '본식 최종 미팅', d: '식순·음악·연출 확정, 시식', link: ['사회자 보기', '#directory?cat=본식사회자'] },
    { t: '본식 당일 & 신혼여행 출발', d: '축하해요! 🎉' },
  ]},
];

/* ---------- 공통 ---------- */
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
const myTier = () => (budget.tier < 1 ? '가성비' : budget.tier > 1 ? '프리미엄' : '표준');

function recoReasons(v) {
  const reasons = [];
  const mood = v.moods.find((m) => myMoods().includes(m));
  if (mood) reasons.push(`${mood} 일치`);
  if (TIER_ORDER.indexOf(v.tier) <= TIER_ORDER.indexOf(myTier())) reasons.push('예산 범위 안');
  if (v.verified >= 30) reasons.push('인증 후기 많음');
  return reasons;
}

const whyHTML = (reasons) => (reasons.length ? `<div class="why">${reasons.map((r) => `<span>${r}</span>`).join('')}</div>` : '');

function vendorCard(v, { masonry = false, reasons = null } = {}) {
  const verified = `<span>후기 ${v.reviews} · <span class="verified">✔ 인증 ${v.verified}</span></span>`;
  return `
    <a class="v-card" href="#vendor" data-vendor="${v.id}">
      <div style="position:relative">
        <span class="ph ph-${v.ph}" style="height:${masonry ? v.h : 180}px"></span>
        <span class="like">♡</span>
      </div>
      <div class="v-body">
        <span class="tag">${v.cat}</span>
        <h4>${v.name}</h4>
        <div class="v-meta">${v.region} · ${v.type}</div>
        ${priceHTML(v.price, v.cat)}
        ${reasons ? whyHTML(reasons) : ''}
        <div class="v-foot"><span>★ ${v.rating}</span>${verified}</div>
      </div>
    </a>`;
}

function reviewCard(r) {
  const badge = r.verified ? '<span class="badge-verified">✔ 계약 인증</span>' : '<span class="badge-normal">일반 후기</span>';
  const imgs = r.imgs ? `<div class="review-imgs">${Array.from({ length: r.imgs }, (_, i) => `<span class="ph ph-${(i % 6) + 1}"></span>`).join('')}</div>` : '';
  return `
    <div class="review">
      <div class="review-top">
        <span class="avatar">${r.who[0]}</span>
        <span class="who">${r.who}<small>${r.when} · ${r.vendor}</small></span>
        ${badge}
      </div>
      <span class="stars-s">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
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

function route() {
  const defaultScreen = splashDone() ? 'home' : 'splash';
  const [hashName, query] = (location.hash.slice(1) || defaultScreen).split('?');
  const name = $(`#screen-${hashName}`) ? hashName : 'home';
  const params = new URLSearchParams(query || '');

  document.body.classList.toggle('is-splash', name === 'splash');
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `screen-${name}`));
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name.split('-')[0]));
  $('.gnb-menu').classList.remove('open');

  if (name === 'directory') {
    if (params.get('cat')) dirCat = params.get('cat');
    renderDirectory();
  }
  if (name === 'guide') showGuide(1);
  if (name === 'partner-join') showPj(0);
  if (name === 'budget-result') renderReport();
  if (name === 'vendor') renderVendor();
  window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

/* ---------- 홈 ---------- */
function renderHome() {
  $('#homeCats').innerHTML = CATEGORIES.slice(1).map((c) =>
    `<a class="cat-item" href="#directory?cat=${c.name}"><span>${c.ico}</span>${c.name}</a>`).join('');
  $('#homeVendors').innerHTML = [1, 2, 7, 16].map((id) => vendorCard(VENDORS.find((v) => v.id === id))).join('');
  $('#myVendors').innerHTML = [1, 2, 4, 3].map((id) => vendorCard(VENDORS.find((v) => v.id === id))).join('');
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
      <span class="ph ph-1" style="height:150px"></span>
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
  total: 3000,
  tier: 1.0,
  wish: new Set(['아이폰스냅', '헤어변형']),
  weights: BASE_CATS.map(() => 1.0),
};

function renderBudgetInputs() {
  $('#wishList').innerHTML = WISHLIST.map((w) =>
    `<button class="wish ${budget.wish.has(w.name) ? 'active' : ''}" data-wish="${w.name}"><b>${w.name}</b><small>평균 ${won(w.cost)}</small></button>`).join('');

  $('#weightList').innerHTML = BASE_CATS.map((c, i) => `
    <div class="weight-row">
      <label>${c.name}</label>
      <input type="range" min="0.5" max="1.5" step="0.1" value="${budget.weights[i]}" data-weight="${i}" />
      <output id="wOut${i}">×${budget.weights[i].toFixed(1)}</output>
    </div>`).join('');
}

/* 기획서 디벨롭 1차 계산 로직
   RawWeight_i = R_base,i × W_i  →  정규화
   B_i = (E_total − U_extra) × Ratio_i × L_tier
   C_est = Σ B_i + U_extra */
function calcBudget() {
  const E = budget.total;
  const U = WISHLIST.filter((w) => budget.wish.has(w.name)).reduce((s, w) => s + w.cost, 0);
  const raw = BASE_CATS.map((c, i) => c.ratio * budget.weights[i]);
  const sum = raw.reduce((a, b) => a + b, 0);
  const items = BASE_CATS.map((c, i) => ({ ...c, amount: (E - U) * (raw[i] / sum) * budget.tier }));
  if (U > 0) items.push({ name: '추가 위시리스트', color: WISH_COLOR, amount: U });
  const C = items.reduce((s, it) => s + it.amount, 0);
  const rate = C / E;

  let status;
  if (U / E > 0.3 || rate > 1.1) status = { key: 'danger', label: '예산 초과 위험', cls: 'tag-danger' };
  else if (rate > 1 || U / E > 0.15) status = { key: 'warn', label: '예산 빠듯', cls: 'tag-warn' };
  else status = { key: 'ok', label: '적정 예산', cls: 'tag-ok' };

  return { E, U, C, rate, items, status };
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
  return items.map((it) =>
    `<li><i style="background:${it.color}"></i>${it.name}<span>${Math.round((it.amount / total) * 100)}% · ${won(it.amount)}</span></li>`).join('');
}

function updatePreview() {
  const r = calcBudget();
  $('#pvTotal').textContent = won(r.C);
  const tag = $('#pvTag');
  tag.className = `tag ${r.status.cls}`;
  tag.textContent = r.status.label;
  $('#pvPie').style.background = pieGradient(r.items, r.C);
  $('#pvLegend').innerHTML = legendHTML(r.items, r.C);
}

function renderReport() {
  const r = calcBudget();
  const wishNames = [...budget.wish];
  const wishText = wishNames.length ? `선택하신 위시리스트(${wishNames.join(', ')})` : '기본 항목';
  const headline = {
    ok: '적정 예산이에요 👍',
    warn: '예산이 다소 빠듯해요',
    danger: '예산 초과 위험이 있어요',
  }[r.status.key];
  const desc = {
    ok: `입력하신 총예산 ${won(r.E)} 내에서 ${wishText}를 소화하기에 적정합니다.`,
    warn: `총예산 ${won(r.E)} 기준 ${wishText}를 포함하면 여유가 적어요. 일부 항목의 중요도를 낮춰 보세요.`,
    danger: `예상 총비용이 ${won(r.C)}로 부담이 커요. '가성비 · 인디 중심' 레이어로 조정하면 약 ${won(r.C - (r.E - r.U) * (budget.tier - 0.9))} 수준까지 낮출 수 있어요.`,
  }[r.status.key];

  $('#rpHeadline').textContent = headline;
  $('#rpDesc').textContent = desc;
  const g = $('#rpGauge');
  g.style.width = `${Math.min(r.rate / 1.1, 1) * 100}%`;
  g.style.background = { ok: 'var(--ok)', warn: 'var(--warn)', danger: 'var(--danger)' }[r.status.key];

  $('#rpPie').style.background = pieGradient(r.items, r.C);
  $('#rpLegend').innerHTML = legendHTML(r.items, r.C);

  const rows = r.items.filter((it) => it.name !== '추가 위시리스트').map((it) =>
    `<tr><td>${it.name}</td><td>${won(it.amount * 0.8)}</td><td>${won(it.amount)}</td><td>${won(it.amount * 1.25)}</td></tr>`);
  WISHLIST.filter((w) => budget.wish.has(w.name)).forEach((w) =>
    rows.push(`<tr><td>${w.name}</td><td>${won(w.cost * 0.7)}</td><td>${won(w.cost)}</td><td>${won(w.cost * 1.5)}</td></tr>`));
  $('#rpTable tbody').innerHTML = rows.join('');

  const moods = myMoods();
  const matched = VENDORS
    .filter((v) => recoReasons(v).includes('예산 범위 안') || wishNames.some((w) => w.includes(v.cat)))
    .sort((a, b) => vendorScore(b, moods) - vendorScore(a, moods))
    .slice(0, 4);
  $('#rpVendors').innerHTML = matched.map((v) => vendorCard(v, { reasons: recoReasons(v) })).join('');
}

/* ---------- 타임라인 ---------- */
function renderTimeline() {
  const input = $('#weddingDate');
  const date = new Date(input.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((date - today) / 86400000);
  const months = days / 30.4;

  $('#ddayText').textContent = days > 0 ? `D-${days}` : days === 0 ? 'D-Day' : `D+${-days}`;
  $('#ddayDate').textContent = input.value.replaceAll('-', '.');

  let nowIdx = PHASES.findIndex((p) => months >= p.to);
  if (nowIdx === -1) nowIdx = PHASES.length - 1;
  const planner = $('#screen-timeline .seg-btn.active').textContent.includes('플래너');

  $('#timelineList').innerHTML = PHASES.map((p, i) => {
    const state = i < nowIdx ? 'past collapsed' : i === nowIdx ? 'now' : 'collapsed';
    const tasks = p.tasks.map((t) => {
      if (t.mode === 'planner' && !planner) return '';
      const done = i < nowIdx;
      const link = t.link ? `<a class="link-more" href="${t.link[1]}">${t.link[0]} →</a>` : '<span></span>';
      const mode = t.mode === 'planner' ? '<span class="tag mode-tag">플래너</span>' : '';
      return `<label class="task ${done ? 'done' : ''}"><input type="checkbox" ${done ? 'checked' : ''} /><div><b>${t.t}</b>${mode}<p>${t.d}</p></div>${link}</label>`;
    }).join('');
    const badge = i === nowIdx ? '<span class="tag tag-new">지금 할 일</span>' : i < nowIdx ? '<span class="tag tag-ok">완료</span>' : '';
    return `
      <div class="phase ${state}">
        <div class="card">
          <div class="phase-head"><h3>${p.title} ${badge}</h3><span class="when">D-${p.from}~${p.to}개월</span></div>
          <div class="phase-body">${tasks}</div>
        </div>
      </div>`;
  }).join('');
  updateTimelineProgress();
}

function updateTimelineProgress() {
  const all = $$('#timelineList .task input');
  const done = all.filter((c) => c.checked).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  $('#tlBar').style.width = `${pct}%`;
  $('#tlPct').textContent = `${pct}% 완료 (${done}/${all.length})`;
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
    `<button class="cat-tab ${c.name === dirCat ? 'active' : ''}" data-cat="${c.name}">${c.name}</button>`).join('');
  const moods = myMoods();
  const list = (dirCat === '전체' ? VENDORS : VENDORS.filter((v) => v.cat === dirCat))
    .slice().sort((a, b) => vendorScore(b, moods) - vendorScore(a, moods));
  $('#dirCount').textContent = list.length;
  if (!list.length) {
    $('#dirGrid').innerHTML = '<p class="muted">아직 소개된 업체가 없어요. 곧 만나요!</p>';
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
}

window.addEventListener('resize', () => {
  if ($('#screen-directory').classList.contains('active') && masonryColumns() !== renderDirectory.cols) renderDirectory();
});

/* ---------- 업체 상세 ---------- */
function renderVendor() {
  const v = currentVendor;
  $('#vdName').textContent = v.name;
  $('#vdCat').textContent = v.cat;
  $('#vdMeta').textContent = `${v.region} | ${v.type}`;
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
  $('.tier-badge').textContent = v.tier;
  const reasons = recoReasons(v);
  $('#vdWhy').hidden = !reasons.length;
  $('#vdWhyChips').innerHTML = reasons.map((r) => `<span>${r}</span>`).join('');
  $('#vdReviews').innerHTML = REVIEWS.slice(0, 2).map(reviewCard).join('');
  renderCalendar($('#vdCal'), {
    year: 2027, month: 5,
    status: (d, dow) => (dow === 6 || dow === 0 ? (d % 3 === 0 ? 'no' : 'few') : d % 5 === 0 ? 'no' : 'ok'),
  });
}

/* ---------- 이벤트 위임 ---------- */
document.addEventListener('click', (e) => {
  const t = e.target;

  if (t.closest('[data-splash-done]')) markSplashDone();

  // 업체 카드 클릭 → 상세
  const card = t.closest('[data-vendor]');
  if (card) {
    currentVendor = VENDORS.find((v) => v.id === +card.dataset.vendor);
    if (t.closest('.like')) {
      e.preventDefault();
      const like = t.closest('.like');
      like.textContent = like.textContent === '♡' ? '♥' : '♡';
      toast(like.textContent === '♥' ? '찜 목록에 담았어요' : '찜을 해제했어요');
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
    if (single.classList.contains('seg-btn')) renderTimeline();
    if (single.dataset.price) {
      $$('[data-price-panel]').forEach((p) => { p.hidden = !p.dataset.pricePanel.split(' ').includes(single.dataset.price); });
    }
  }
  const multi = t.closest('[data-multi] > button, .mood, .import-grid .ph, .pick-card');
  if (multi) multi.classList.toggle(multi.classList.contains('ph') ? 'sel' : 'active');
  if (multi?.closest('#pjMoods')) $('#pjMoodError').classList.remove('show');
  if (multi?.classList.contains('pick-card')) showPj(pjIdx); // 고른 항목 수에 맞춰 단계 수 갱신

  // 예산 프리셋
  const preset = t.closest('[data-preset] > .chip');
  if (preset) {
    $$('[data-preset] > .chip').forEach((b) => b.classList.toggle('active', b === preset));
    budget.total = +preset.dataset.v;
    $('#bTotal').value = budget.total;
    updatePreview();
  }

  // 가격대 레이어
  const tier = t.closest('[data-tier]');
  if (tier) {
    $$('#tierList .tier').forEach((b) => b.classList.toggle('active', b === tier));
    budget.tier = +tier.dataset.tier;
    updatePreview();
  }

  // 위시리스트
  const wish = t.closest('[data-wish]');
  if (wish) {
    const n = wish.dataset.wish;
    budget.wish.has(n) ? budget.wish.delete(n) : budget.wish.add(n);
    wish.classList.toggle('active');
    updatePreview();
  }

  // 디렉토리 카테고리 탭
  const cat = t.closest('[data-cat]');
  if (cat) { dirCat = cat.dataset.cat; renderDirectory(); }

  // 타임라인 Phase 접기/펼치기
  const ph = t.closest('.phase-head');
  if (ph) ph.closest('.phase').classList.toggle('collapsed');

  // 업체 프로필 만들기 · 일정 캘린더 토글
  const day = t.closest('#pjCal .d:not(.empty)');
  if (day) { day.classList.toggle('ok'); day.classList.toggle('no'); }

  // 기타 액션
  const action = t.closest('[data-action]')?.dataset.action;
  if (action === 'toggle-menu') $('.gnb-menu').classList.toggle('open');
  if (action === 'guide-next') showGuide(guideStep + 1);
  if (action === 'guide-prev') showGuide(guideStep - 1);
  if (action === 'ob-next') obStepper.next();
  if (action === 'ob-prev') obStepper.prev();
  if (action === 'pj-next') pjNext();
  if (action === 'pj-prev') { if (pjIdx === 0) history.back(); else showPj(pjIdx - 1); }
  if (action === 'like') {
    const b = t.closest('[data-action]');
    b.classList.toggle('liked');
    b.textContent = b.classList.contains('liked') ? '♥ 찜함' : '♡ 찜하기';
  }

  const msg = t.closest('[data-toast]')?.dataset.toast;
  if (msg) toast(msg);
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.matches('[data-weight]')) {
    const i = +t.dataset.weight;
    budget.weights[i] = +t.value;
    $(`#wOut${i}`).textContent = `×${(+t.value).toFixed(1)}`;
    updatePreview();
  }
  if (t.id === 'bTotal') {
    budget.total = Math.max(+t.value || 0, 100);
    $$('[data-preset] > .chip').forEach((b) => b.classList.remove('active'));
    updatePreview();
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'weddingDate') renderTimeline();
  if (e.target.matches('#timelineList .task input')) {
    e.target.closest('.task').classList.toggle('done', e.target.checked);
    updateTimelineProgress();
  }
});

/* ---------- 초기화 ---------- */
renderHome();
renderBudgetInputs();
updatePreview();
renderTimeline();
renderDirectory();
$('#reviewFeed').innerHTML = REVIEWS.map(reviewCard).join('');
$('#bizCats').innerHTML = CATEGORIES.slice(1).map((c) => `<span>${c.ico} ${c.name}</span>`).join('');
$('#pjCats').innerHTML =CATEGORIES.slice(1).map((c) =>
  `<button class="chip ${c.name === '아이폰스냅' ? 'active' : ''}">${c.name}</button>`).join('');
renderCalendar($('#pjCal'), { year: 2027, month: 4, status: (d, dow) => (dow === 0 || dow === 6 ? 'ok' : 'no') });
renderCalendar($('#dashCal'), { year: 2026, month: 9, status: (d) => ([3, 10, 17, 18, 25].includes(d) ? 'booked' : d < 12 ? 'no' : 'ok') });
route();
