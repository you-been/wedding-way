# 결심 Design System

<!-- design-md:section experience -->
## 1. Experience

<!-- design-md:claim scope kind=product-surface lang=en -->
### Scope

결심은 '결혼을 결심하다'에서 이름을 딴 결혼 준비 플랫폼이다. 예비부부가 예산을 진단하고, 제휴 수수료와 무관한 같은 기준으로 웨딩 업체를 비교하고, 준비 일정을 관리한다. 업체는 정보를 직접 등록해 알린다.
<!-- design-md:claim-end -->

<!-- design-md:claim primary-tasks kind=user-outcomes count=4 lang=en -->
### Primary tasks

- 예산 진단: 항목별 평균가와 우리 금액을 비교해 총예산과 가격대(가성비 · 표준 · 프리미엄)를 판단한다

- 업체 디렉토리: 카테고리 · 가격대 · 지역 필터로 업체를 같은 기준에서 비교하고 찜한다

- 내 웨딩: 준비 타임라인과 캘린더, 찜한 업체를 관리한다

- 업체 계정: 업체 정보를 등록하고 문의와 노출 현황을 본다
<!-- design-md:claim-end -->

### Design direction

- 뼈대(버튼 높이 · 여백 · 둥글기 · 간격 · 글자 크기 · 회색 계열 색)는 크몽(Kmong) 마켓플레이스 디자인 시스템 값을 가져오고, 포인트 색 · 선택 상태 · 강조 표현 같은 색과 디테일은 결심 것으로 입힌다

- 흰 캔버스 위 잉크(#212224) 텍스트와 핑크(#ffa3bf) 포인트 한 가지로 구성한 마켓플레이스형 화면

- 카드는 테두리 · 그림자 대신 여백과 사진으로 구분하고, 패널이 필요할 때만 얇은 테두리(#e4e5ed)를 쓴다

- 아이콘은 Lucide 선 아이콘으로 통일하고 이모지를 UI 아이콘으로 쓰지 않는다

### Principles

- 중립 비교: 광고나 유료 우선 노출 없이 정보 충실도 · 인증 후기 · 취향 일치 기준으로 정렬하고, 그 기준을 화면에 밝힌다

- 가격을 숨기지 않는다: 가격 비공개 업체는 '상담 후 안내'와 함께 카테고리 시장 평균을 보여준다

- 포인트 색은 한 화면에서 한 역할(히어로 면, 번호 배지, 강조 태그)에만 쓴다

### Avoid

- 핑크를 본문 텍스트나 작은 글자 색으로 쓰는 것 (흰 바탕 대비 부족)

- 카드마다 그림자와 떠오르는 hover 효과를 주는 것

- 파스텔 그라데이션 플레이스홀더 (사진 없음은 회색 면 + 카테고리 아이콘)

<!-- design-md:section foundations -->
## 2. Foundations

<!-- design-md:claim foundations kind=rules-or-constraints lang=en -->
### Semantic tokens

- **color.brand**: `#ffa3bf` — 결심 디테일 (크몽 초록 #92fa72 대체) — 포인트 핑크: 히어로 면 · 번호 배지 · 강조 태그
- **color.brand-hover**: `#ff8fb1` — 결심 디테일 — 핑크 버튼 hover
- **color.brand-soft**: `#fff1f5` — 결심 디테일 — 옅은 핑크 면: 마지막 CTA 띠 · 추천 이유 칩
- **color.canvas**: `#ffffff` — 크몽 값 — 페이지 · 카드 배경
- **color.control-border**: `#c8cad2` — 크몽 값 — 입력칸 · 선택 컨트롤 테두리
- **color.hairline**: `#f2f3f7` — 크몽 값 — 구분선 · 회색 칩 배경 · 태그 배경
- **color.ink**: `#212224` — 크몽 값 — 제목 · 본문 · 주요 버튼 배경 · 선택 상태
- **color.muted**: `#555969` — 크몽 값 — 보조 설명 텍스트
- **color.on-brand**: `#212224` — 크몽 값 — 핑크 위 텍스트
- **color.on-ink**: `#ffffff` — 크몽 값 — 잉크 위 텍스트
- **color.panel**: `#fafafc` — 크몽 값 — 카테고리 아이콘 타일 · 푸터 · 읽기 전용 입력 배경
- **color.panel-border**: `#e4e5ed` — 크몽 값 — 패널 · 카드 · 헤더 테두리
- **color.subtle**: `#6b6e7d` — 결심 디테일 (크몽 푸터 링크 #727585와 다른 값) — 푸터 링크 · 보조 아이콘
- **radius.chip**: `9999px` — 크몽 값 — 칩 · 원형 버튼
- **radius.control**: `8px` — 크몽 값 — 입력칸 · 36px 버튼 · 사진 썸네일
- **radius.cta**: `4px` — 크몽 값 — 52px 주요 버튼 · 태그
- **radius.panel**: `12px` — 크몽 값 — 패널 · 카드 · 모달
- **radius.search**: `24px` — 크몽 값 — 검색창 셸
- **shadow.accent**: `6px 6px 0 #ffa3bf` — 결심 디테일 — 강조 카드 · 미리보기 카드의 핑크 단색 오프셋 그림자
- **shadow.search**: `rgba(0,0,0,0.06) 0px 0px 8px 0px` — 크몽 값 — 검색창 셸 그림자 (이 외에는 그림자를 쓰지 않음)
- **size.button-primary**: `52px` — 크몽 값 — 주요 버튼 · 검색 입력 높이
- **size.button-small**: `36px` — 크몽 값 — 헤더 버튼 · 정렬 셀렉트 높이
- **size.chip**: `{"category":"36px","filter":"36px"}` — 크몽 값 — 칩 높이 (카테고리 필터 칩 · 키워드 칩)
- **size.search**: `{"height":"50px","max-width":"500px"}` — 크몽 값 — 검색창 셸 크기
- **size.wrap**: `1168px` — 크몽 값 — 콘텐츠 최대 폭 (좌우 여백 데스크톱 24px · 모바일 16px 별도)
- **space.base**: `16px` — 크몽 값
- **space.lg**: `20px` — 크몽 값
- **space.md**: `12px` — 크몽 값
- **space.section**: `{"desktop":"80px","mobile":"48px"}` — 결심 디테일 — 섹션 사이 간격
- **space.sm**: `8px` — 크몽 값
- **space.xl**: `24px` — 크몽 값
- **space.xxl**: `32px` — 크몽 값

### Contrast pairs

- color.ink on color.canvas: minimum 4.5:1
- color.muted on color.canvas: minimum 4.5:1
- color.subtle on color.canvas: minimum 4.5:1
- color.on-brand on color.brand: minimum 4.5:1
- color.on-ink on color.ink: minimum 4.5:1
- color.ink on color.hairline: minimum 4.5:1

### Reduced motion

Required.

### Foundation rules

- 새 컴포넌트는 먼저 크몽 레퍼런스(.claude/data/references/kmong/DESIGN.md)에서 같은 역할의 크기 · 여백 · 둥글기를 찾아 쓰고, 색과 선택 · 강조 표현만 결심 토큰으로 바꾼다. 크몽에 없는 요소만 결심 디테일로 새로 정한다

- 새 화면과 전환하는 화면은 --ds-* CSS 변수만 쓴다. 예전 --primary(#b5546a) 계열 변수는 아직 전환하지 않은 화면에만 남아 있다

- 주요 행동 버튼은 잉크 배경(color.ink)에 흰 글자, 핑크 배경 버튼은 히어로 같은 핑크 면이 아닌 곳에서 한 화면에 하나까지만 쓴다

- 선택 상태(칩 · 탭 · 카테고리)는 잉크로 채우고, 미선택 칩은 color.hairline 면 또는 color.panel-border 테두리로 표시한다

- 카드에는 그림자를 쓰지 않는다. 예외는 검색창(shadow.search)과 강조 카드의 핑크 오프셋 그림자(shadow.accent) 두 가지다

- 숫자(금액 · 개수 · 평점)는 font-variant-numeric: tabular-nums로 정렬한다
<!-- design-md:claim-end -->

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Type roles

| Role | Usage | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| display | 홈 · 업체 알리기 히어로 제목 · 출처: 결심 디테일 — 사용자 요청으로 크몽 홈 제목(40px/1.3)보다 키움 | Pretendard | 56px (모바일 36px) | 700 | 1.22 | -0.03em |
| page-title | 각 화면 제목 (ds-page-head h1) · 출처: 크몽 값 (category heading 36px/700) | Pretendard | 36px (모바일 28px) | 700 | 1.22 | -0.02em |
| section-title | 섹션 제목 (hm-head h2) · 출처: 결심 디테일 | Pretendard | 22px (모바일 20px) | 700 | 1.4 | -0.01em |
| card-title | 카드 · 패널 제목 · 출처: 결심 디테일 | Pretendard | 16~20px | 700 | 1.4 |  |
| body | 본문 · 입력값 · 주요 버튼 · 출처: 크몽 값 (16px/400, 버튼 16px/500) | Pretendard | 16px | 400 (버튼 500) | 1.5 |  |
| body-small | 보조 설명 · 메뉴 · 칩 · 출처: 크몽 값 (header action · chip 14px) | Pretendard | 14px | 400~500 | 1.5 |  |
| caption | 메타 정보 · 태그 · 각주 · 출처: 결심 디테일 | Pretendard | 12~13px | 400~500 | 1.5 |  |

### Assets

| Asset | Kind | Source status | License status | Source | Notes |
|---|---|---|---|---|---|
| pretendard | font | licensed-sourced | verified | jsDelivr orioncactus/pretendard@v1.3.9 (SIL Open Font License 1.1) |  |
| lucide | icon | licensed-sourced | verified | unpkg lucide@0.468.0 (ISC License) | data-lucide 속성으로 렌더하고, 동적으로 그린 뒤에는 drawIcons()를 호출한다 |

### Rules

- 서체는 Pretendard 하나만 쓰고, 대체 서체는 -apple-system, Apple SD Gothic Neo, Malgun Gothic 순서다

- 굵기는 400 · 500 · 700 세 단계만 쓴다

- 큰 제목일수록 자간을 좁힌다 (56px −0.03em, 36px −0.02em, 22px −0.01em)

- images/biz_*.jpg · images/icon_*.webp는 사용자가 넣은 프로토타입용 이미지다. 실서비스에 쓰기 전 사용 권리를 확인한다

<!-- design-md:section components-states -->
## 4. Components & States

### Component: button

**Semantics:** button 또는 a 요소. 52px 높이 · 4px 둥글기 · 16px/500, 작은 버튼은 36px · 8px 둥글기 · 14px

- Anatomy: 배경 면, 레이블, 선택적 Lucide 아이콘(18px)
- Variants: ink 52px (크몽 primary CTA 크기 · 결심 잉크 색), brand 핑크 52px (크몽 primary CTA 크기 · 결심 핑크), outline 40px (크몽 outline-link-button: 둥글기 8px · 테두리 #c8cad2 · 14px/700), line 52px 잉크 테두리 (결심 디테일: 핑크 히어로 위에서만, 회색 테두리는 핑크 위 대비 부족), small 36px (크몽 header action)
- States: default, hover, focus-visible, disabled
- Token references: color.ink, color.on-ink, color.brand, color.brand-hover, color.on-brand, radius.cta, radius.control, size.button-primary, size.button-small

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | applicable |  |
| loading | not-applicable | 서버 없는 프로토타입이라 비동기 처리 중 상태가 없다 |
| error | not-applicable | 버튼 자체는 오류 상태를 갖지 않고 폼 필드가 오류를 표시한다 |
| success | not-applicable | 완료 피드백은 토스트로 보여준다 |

### Component: text-field

**Semantics:** label과 연결된 input. 52px 높이, 포커스 시 2px 잉크 외곽선

- Anatomy: 레이블(14px/700), 입력칸, 선택적 앞 아이콘, 오류 메시지
- States: default, focus-visible, disabled, error, readonly
- Token references: color.control-border, color.ink, color.panel, radius.control, size.button-primary

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | 입력칸은 hover로 모양이 바뀌지 않는다 |
| focus-visible | applicable |  |
| disabled | applicable |  |
| loading | not-applicable | 비동기 검증이 없다 |
| error | applicable |  |
| success | not-applicable | 성공은 별도 표시 없이 다음 단계로 넘어간다 |

### Component: search-field

**Semantics:** role=search 폼. 크몽 category-search 셸(500×50 · 둥글기 24px · 옅은 그림자)에 결심 잉크 버튼을 안에 넣는다. 포커스 시 셸 테두리를 잉크로

- Anatomy: 셸(테두리 · 그림자), 앞 돋보기 아이콘, 입력칸, 안쪽 36px 잉크 검색 버튼
- States: default, focus-visible
- Token references: radius.search, size.search, shadow.search, color.control-border, color.ink

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | not-applicable | 셸은 hover로 바뀌지 않고 안쪽 버튼만 버튼 상태를 따른다 |
| focus-visible | applicable |  |
| disabled | not-applicable | 검색은 항상 쓸 수 있다 |
| loading | not-applicable | 검색 결과를 즉시 보여준다 |
| error | not-applicable | 빈 결과는 목록의 빈 상태 문구로 보여준다 |
| success | not-applicable | 결과 목록이 곧 성공 상태다 |

### Component: chip

**Semantics:** button 요소. 단일 선택은 role=tab · aria-selected, 복수 선택은 active 클래스로 표시

- Anatomy: 알약 모양 면, 레이블, 선택적 아이콘(16px)
- Variants: category 36px · 둥글기 8px · 테두리 #e4e5ed · 14px/400 (크몽 category-filter-control) + Lucide 아이콘(결심), filter 36px · 알약 · #f2f3f7 · 좌우 16px · 14px/400 (크몽 keyword-chip), 선택 상태 잉크 채움 (결심 디테일)
- States: default, hover, focus-visible, selected
- Token references: color.hairline, color.panel-border, color.ink, color.on-ink, radius.chip, size.chip

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | not-applicable | 선택할 수 없는 칩은 보여주지 않는다 |
| loading | not-applicable | 필터는 즉시 반영된다 |
| error | not-applicable | 칩 선택에는 오류가 없다 |
| success | not-applicable | 선택 상태가 곧 결과다 |

### Component: vendor-card

**Semantics:** 업체 상세로 가는 링크. 테두리 · 그림자 없음, hover 시 사진 3% 확대와 업체명 밑줄

- Anatomy: 사진 썸네일(8px 둥글기) 또는 회색 면 + 카테고리 아이콘, 찜 버튼(36px 흰 원 · 북마크), 카테고리 태그, 업체명(16px/700), 지역 · 유형, 가격 또는 '상담 후 안내' + 시장 평균, 평점 · 후기 수 · 인증 수
- States: default, hover, focus-visible, saved
- Token references: color.panel, color.panel-border, color.hairline, color.ink, color.muted, radius.control, radius.cta

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | not-applicable | 목록에 노출된 업체는 모두 열람할 수 있다 |
| loading | not-applicable | 더미 데이터를 즉시 렌더한다 |
| error | not-applicable | 카드 단위 오류가 없다 |
| success | not-applicable | 찜한 상태는 saved 상태(채워진 북마크)로 표시한다 |

### Component: panel

**Semantics:** 섹션을 묶는 컨테이너. 크몽 category-link-card와 같은 흰 면 · 1px #e4e5ed · 12px 둥글기, 안쪽 여백 24px · 그림자 없음

- Anatomy: 흰 면, 1px panel-border 테두리, 제목, 본문
- States: default
- Token references: color.canvas, color.panel-border, radius.panel, space.xl

- Interaction kind: non-interactive
- Interaction reason: 내용을 묶기만 하고 자체 동작이 없다

### Component: photo-feed

**Semantics:** scroll-snap 가로 목록. 데스크톱 4장, 모바일 2장 + 다음 장 일부 노출. 양끝에서는 해당 방향 버튼을 숨긴다

- Anatomy: 가로 스크롤 트랙, 3:4 사진 카드, 하단 그라데이션 위 업체명, 찜 버튼, 이전 · 다음 원형 버튼(44px)
- States: default, hover, focus-visible, disabled
- Token references: color.panel-border, color.canvas, color.ink, radius.control, radius.chip

- Interaction kind: interactive

#### State applicability

| State | Applicability | Reason |
|---|---|---|
| default | applicable |  |
| hover | applicable |  |
| focus-visible | applicable |  |
| disabled | applicable |  |
| loading | not-applicable | 로컬 이미지라 별도 로딩 표시가 없다 |
| error | not-applicable | 이미지 실패 시 회색 면이 그대로 보인다 |
| success | not-applicable | 결과 상태가 없다 |

### Rules

- 모든 인터랙티브 요소는 focus-visible에 2px 잉크 외곽선(offset 2px)을 보인다

- 아이콘만 있는 버튼에는 aria-label을 단다

- 찜 · 문의 같은 회원 전용 동작에는 data-auth를 달아 로그인 화면으로 보낸다

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Responsive constraints

- Minimum supported width: 320px
- Reflow target: 200% zoom

### Layout rules

- 콘텐츠 폭은 최대 1168px, 좌우 여백은 데스크톱 24px · 760px 이하 16px

- 중단점은 960px(2단 레이아웃을 1단으로)과 760px(모바일)

- 모바일에서 칩 · 카테고리 목록은 줄바꿈 대신 한 줄 가로 스크롤로 바꾸고 좌우 여백까지 확장한다

- 모바일에서는 하단 탭바가 생기므로 화면 하단 여백을 확보한다

- 업체 디렉토리는 폭에 따라 4 · 3 · 2열 메이슨리로 배치한다

### Platform: web

- 정적 HTML · CSS · JS 프로토타입이며 빌드 단계가 없다
- 해시 라우팅(#home, #directory 등)으로 화면을 전환한다

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice

- 해요체로 짧게 쓴다 (예: '같은 기준으로 비교해요', '아직 소개된 업체가 없어요. 곧 만나요!')

- 광고 · 과장 표현 대신 기준과 숫자를 밝힌다 (예: '광고나 유료 우선 노출은 없어요')

- 버튼은 동사로 끝낸다 (예: '업체 디렉토리 보러가기', '검색')

### Terminology

| Term | Preferred form |
|---|---|
| 가격대 | 가성비 · 표준 · 프리미엄 세 단계 |
| 결심 | 서비스 이름 (예전 이름 웨딩웨이는 쓰지 않는다) |
| 업체 | 웨딩 서비스 제공자 회원 |
| 예비부부 | 일반 회원 |
| 인증 후기 | 계약 증빙이 확인된 후기 |
| 찜 | 업체 저장 동작 |

### Locale: ko (supported)

- 모든 UI 문구는 한국어
- 금액은 '만 원' 단위로 띄어 쓴다 (예: 35~75만 원)

<!-- design-md:section governance -->
## 7. Governance

<!-- design-md:claim authority kind=project-system lang=en -->
### Authority

This document is the project design contract for the declared scope.
<!-- design-md:claim-end -->

<!-- design-md:claim application-priority order=prompt-fact,repository-fact,system-contract,reference-inspiration lang=en -->
### Application priority

1. Direct user instructions for the requested scope.
2. Repository facts.
3. This system contract.
4. Reference inspiration.
<!-- design-md:claim-end -->

<!-- design-md:claim unknowns policy=absent-at-smallest-unresolved-boundary lang=en -->
### Unknowns

Omit only the smallest unresolved value or group. Do not replace it with a plausible default.
<!-- design-md:claim-end -->

<!-- design-md:claim changes policy=review-record-validate-before-adoption lang=en -->
### Changes

Record, review, and validate changes before adoption.
<!-- design-md:claim-end -->

### Project priority details

1. 이 DESIGN.md의 --ds-* 토큰과 규칙

2. css/style.css의 '디자인 시스템' 블록에 이미 구현된 화면(홈 · 예산 진단 · 로그인 · 업체 알리기 · 업체 디렉토리)

3. 아직 전환하지 않은 화면의 예전 스타일

### Additional change rules

- 크몽 값과 다르게 쓰려면 이 문서의 해당 값 설명에 '결심 디테일'과 이유를 함께 적는다

- 토큰 값을 바꾸면 css/style.css의 :root --ds-* 변수와 이 문서를 함께 바꾼다

- 예전 스타일 화면(새내기 가이드 · 온보딩 · 진단 리포트 · 업체 상세 · 실후기 · 내 웨딩 · 업체 가입 · 업체 대시보드)은 순차적으로 --ds-* 토큰으로 전환한다

### Decision provenance

- foundations.tokens.color.brand — repository-fact; value: {"$description":"결심 디테일 (크몽 초록 #92fa72 대체) — 포인트 핑크: 히어로 면 · 번호 배지 · 강조 태그","$type":"color","$value":"#ffa3bf"}; evidence: css/style.css
- /typography_assets/roles/0/size — prompt-fact; value: "56px (모바일 36px)"; evidence: css/style.css
- /typography_assets/assets/2 — unresolved; evidence: images/biz_01.jpg
