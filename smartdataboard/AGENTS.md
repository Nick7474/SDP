# 광명 스마트데이터보드 — Codex 작업 지침

## 프로젝트 개요

**클라이언트:** 광명시  
**프로젝트명:** 광명 스마트데이터보드 (행정용 대시보드)  
**위치:** `d:/00_Aimwid Design/13_광명 스마트데이터플랫폼/05_html/광명 스마트데이터보드/`  
**디자인 시스템 원본:** `d:/00_Aimwid Design/13_광명 스마트데이터플랫폼/05_html/스마트데이터포털 디자인 시스템 (오프라인).html`

---

## 작업 규칙

- **홈화면(index.html)은 완성 상태**이므로 디자인 시스템 변경 작업 대상에서 제외
- 추가되는 모든 신규 페이지는 이 문서의 디자인 시스템을 따름
- 중간에 확인 없이 작업을 완료한 뒤 사용자 검토를 받는 흐름으로 진행
- 작업 중 별도 문서(MD) 생성 금지 — 사용자가 명시적으로 요청한 경우만 생성

---

## 파일 구조

```
광명 스마트데이터보드/
├── index.html                  ← 홈 대시보드 (완성)
├── AGENTS.md                   ← 이 파일
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← 디자인 토큰 (CSS 변수) — 모든 페이지 필수 로드
│   │   ├── base.css            ← 리셋 + 기본 타이포그래피
│   │   ├── shell.css           ← 탑바 + 사이드바 + 공통 버튼 (shell.js가 렌더링)
│   │   ├── page-shared.css     ← 서브페이지 공통 컴포넌트 (KPI·패널·테이블·필·드로어·범례)
│   │   └── page-{name}.css     ← 페이지별 전용 스타일 (예: page-home.css)
│   ├── js/
│   │   ├── nav.config.js       ← 네비게이션 메뉴 + 브랜드 설정 (단일 소스)
│   │   ├── shell.js            ← 탑바/사이드바/페이지헤더 자동 렌더링
│   │   └── page-{name}.js      ← 페이지별 인터랙션
│   └── img/                    ← 이미지/아이콘 에셋
└── pages/
    └── {page-name}.html        ← 서브 페이지 (GMSB_BASE='../' 설정 필요)
```

### 신규 페이지 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>페이지명 · 광명 스마트데이터보드</title>
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/shell.css">
<link rel="stylesheet" href="../assets/css/page-shared.css">
<link rel="stylesheet" href="../assets/css/page-{name}.css">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
<div id="gmsb-topbar"></div>
<div class="shell">
  <div id="gmsb-sidebar"></div>
  <main class="page">
    <div id="gmsb-header"></div>
    <!-- 페이지 콘텐츠 -->
  </main>
</div>
<script>
  window.GMSB_BASE = '../';
  window.GMSB_PAGE = {
    active: 'section-id.sub-id',   // nav.config.js의 id 참조
    header: {
      title: '페이지 제목',
      desc:  '페이지 설명',
    }
  };
</script>
<script src="../assets/js/nav.config.js"></script>
<script src="../assets/js/shell.js"></script>
<script src="../assets/js/page-{name}.js"></script>
</body>
</html>
```

---

## 디자인 시스템 토큰

> 원본: `assets/css/tokens.css`  
> 모든 값은 CSS 변수로 사용 — 하드코딩 금지

### 1. 브랜드 컬러

| 변수 | 값 | 용도 |
|------|-----|------|
| `--gp-primary` | `#044E9E` | 포털 주컬러 · 딥블루 (액션·헤더·선택) |
| `--gp-primary-strong` | `#033B79` | hover / pressed |
| `--gp-primary-darker` | `#022B57` | CTA 배너 그라데이션 |
| `--gp-primary-soft` | `#E5EDF8` | 연한 배경 칩/탭 |
| `--gp-primary-tint` | `#F1F6FC` | 가장 연한 면 |
| `--gp-point` | `#0C8AE5` | **보드 주컬러** — 주 액션·칩 활성·인터랙션 |
| `--gp-point-strong` | `#0A74C2` | point hover |
| `--gp-point-soft` | `#E3F2FD` | point 연한 배경 |

> **컬러 체계:** 보드 주컬러 = `#0C8AE5` (`--gp-point`) / 강조컬러 = `#044E9E` (`--gp-primary`)  
> `--gp-primary2` (#006FEF)는 삭제됨 — 사용 금지

> **탑바 타이틀 컬러 규칙:** "스마트" = `#0C8AE5` / "데이터보드" = `#044E9E`

### 2. 4대 마일 컬러

| 변수 | 값 | 마일 |
|------|-----|------|
| `--mile-energy` | `#0C8AE5` | 에너지 |
| `--mile-energy-soft` | `#E3F2FD` | |
| `--mile-mobility` | `#1AAA5E` | 모빌리티 |
| `--mile-mobility-soft` | `#E4F6EC` | |
| `--mile-safety` | `#ED8B16` | 세이프티 |
| `--mile-safety-soft` | `#FDF1DF` | |
| `--mile-data` | `#6E74D6` | 데이터 |
| `--mile-data-soft` | `#ECEDFB` | |

### 3. 상태(Status) 컬러

| 변수 | 값 | 상태 |
|------|-----|------|
| `--status-success` | `#1AAA5E` | 정상·공개·완료 |
| `--status-success-soft` | `#E4F6EC` | |
| `--status-info` | `#0C8AE5` | 정보·진행 |
| `--status-info-soft` | `#E3F2FD` | |
| `--status-warning` | `#ED8B16` | 관심·주의·요청가능 |
| `--status-warning-soft` | `#FDF1DF` | |
| `--status-danger` | `#E0483D` | 위험·경보·마감 |
| `--status-danger-soft` | `#FCEAE8` | |
| `--status-pending` | `#6E74D6` | 검토중·제한 |
| `--status-pending-soft` | `#ECEDFB` | |
| `--status-neutral` | `#5E6B7D` | 비활성·기타 |
| `--status-neutral-soft` | `#EEF1F5` | |

### 4. 텍스트(Foreground)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--fg-1` | `#16243B` | 제목·핵심 수치 (대비 14.8:1) |
| `--fg-2` | `#36445A` | 본문 (9.2:1) |
| `--fg-3` | `#5A6878` | 보조·캡션 (5.6:1) |
| `--fg-4` | `#7C8896` | 라벨·플레이스홀더 (4.0:1) |
| `--fg-disabled` | `#AEB7C2` | 비활성 |
| `--fg-on-dark` | `#FFFFFF` | 어두운 배경 위 |

### 5. 배경(Surface)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--bg-page` | `#FFFFFF` | 페이지 배경 |
| `--bg-subtle` | `#F5F8FC` | 섹션 교차 배경 |
| `--bg-sunken` | `#EEF3FA` | 더 가라앉은 면 |
| `--surface-card` | `#FFFFFF` | 카드 배경 |
| `--surface-inset` | `#F4F7FB` | 입력 well·표 헤더 |
| `--surface-hover` | `#F5F8FC` | 행 호버 |
| `--surface-selected` | `#E7EFF9` | 선택 행/항목 |

### 6. 경계선(Border)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--border-1` | `#E4E9F1` | 기본 카드/구분선 |
| `--border-2` | `#EDF1F6` | 약한 구분선 |
| `--border-strong` | `#D2DAE6` | 입력 테두리 |
| `--border-primary` | `#9FC0E6` | primary 강조 테두리 |

### 7. 타이포그래피

**폰트:** `Pretendard GOV` → `Pretendard` → 시스템 폰트  
변수: `--font-sans`

| 변수 | 값 | 용도 |
|------|-----|------|
| `--type-hero-l` | `800 52px/1.18` | 홈 히어로 타이틀 |
| `--type-hero-m` | `800 40px/1.2` | |
| `--type-display` | `800 34px/1.25` | 서브페이지 타이틀 |
| `--type-h1` | `700 30px/1.32` | 섹션 대제목 |
| `--type-h2` | `700 24px/1.38` | 카드/블록 제목 |
| `--type-h3` | `700 20px/1.45` | |
| `--type-h4` | `600 18px/1.5` | |
| `--type-body-l` | `400 18px/1.65` | |
| `--type-body-m` | `400 16px/1.65` | 기본 본문 |
| `--type-body-s` | `400 14px/1.6` | |
| `--type-label-l` | `600 16px/1.4` | |
| `--type-label-m` | `600 14px/1.4` | 버튼·칩 |
| `--type-label-s` | `600 13px/1.35` | 배지·태그 |
| `--type-num-l` | `800 40px/1.1` | KPI 큰 수치 |
| `--type-num-m` | `700 28px/1.15` | |

**사용법:** `font: var(--type-body-m); font-family: var(--font-sans);`

### 8. 간격(Spacing) — 4px 기반

```
--sp-1:4px   --sp-2:8px   --sp-3:12px  --sp-4:16px  --sp-5:20px
--sp-6:24px  --sp-8:32px  --sp-10:40px --sp-12:48px --sp-16:64px
--sp-20:80px --sp-24:96px
```

### 9. 모서리(Border Radius)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--radius-xs` | `6px` | |
| `--radius-sm` | `8px` | 입력·버튼 |
| `--radius-md` | `12px` | 작은 카드/칩 |
| `--radius-lg` | `16px` | 카드 |
| `--radius-xl` | `20px` | 히어로/큰 패널 |
| `--radius-pill` | `999px` | 알약형 |

### 10. 그림자(Elevation)

| 변수 | 용도 |
|------|------|
| `--elev-1` | `0 1px 2px rgba(20,40,80,.06)` — 기본 카드 |
| `--elev-2` | `0 2px 10px rgba(20,40,80,.07)` — 떠있는 카드 |
| `--elev-3` | `0 10px 28px rgba(20,40,80,.10)` — 모달/드롭다운 |
| `--elev-hover` | `0 8px 24px rgba(11,80,160,.12)` — 카드 호버 |

### 11. 모션(Motion)

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)
--dur-fast: 130ms   --dur-base: 220ms   --dur-slow: 340ms
```

### 12. 그리드

```
--grid-cols: 12
--grid-gutter: 24px
--content-max: 1480px   (중앙 정렬 콘텐츠 최대 폭)
--content-pad: 40px     (좌우 여백)
```

---

## 쉘(Shell) 구조

### 탑바 (`.tb`) — 60px 고정 높이

- 브랜드: 좌측 248px 고정 (로고 + "Smart Data Board")
- 센터: "광명시 **스마트**(#0C8AE5)**데이터보드**(#044E9E)" — S-Core Dream 600 24px
- 우측: 사용자 아이콘 + 알림 벨

### 사이드바 (`.snb`) — 호버 확장

- 접힘: `80px` / 펼침(hover): `220px`
- 배경: `#003481` (deep navy)
- 활성 항목: `--snb-active` = `#0C8AE5`
- 활성 서브: `--snb-active-sub` = `#40DDEE`
- 아이콘: `assets/img/Property 1=0N_LM_IC.png` (N=00~06)

### 네비게이션 메뉴 (`nav.config.js`)

| id | 메뉴명 | 아이콘파일 |
|----|--------|-----------|
| `home` | 홈 | `00_LM_IC.png` |
| `op` | 운영 모니터링 | `01_LM_IC.png` |
| `gis` | GIS 기반 도시 데이터 조회 | `02_LM_IC.png` |
| `carbon` | 지표 기반 탄소중립 도시 현황 | `03_LM_IC.png` |
| `catalog` | AI 데이터 카탈로그 | `04_LM_IC.png` |
| `analysis` | 데이터 분석·시각화 | `05_LM_IC.png` |
| `system` | 시스템관리 | `06_LM_IC.png` |

---

## 컴포넌트 패턴

### 카드

```html
<section class="card">
  <div class="card__hd">
    <h3>카드 제목</h3>
    <button class="card__more" aria-label="더보기">⋯</button>
  </div>
  <!-- 카드 콘텐츠 -->
</section>
```

```css
.card {
  background: var(--surface-card);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-lg);   /* 16px */
  box-shadow: var(--elev-2);
  padding: 22px;
}
```

### 배지(Badge)

```html
<span class="badge badge--ok">정상</span>
<span class="badge badge--warn">주의</span>
<span class="badge badge--danger">위험</span>
```

- `badge--ok`: `#1AAA5E` / `#E4F6EC`
- `badge--warn`: `#B86A05` / `#FDF1DF`
- `badge--danger`: `#DE3412` / `#FCEAE8`
- 앞에 dot(`::before`) 포함 — 4px 원형

### 버튼

```html
<button class="btn btn--pri">주요 액션</button>
<button class="btn btn--line">보조 액션</button>
<button class="btn btn--ghost">배경 없는 액션</button>
```

높이: 42px / 패딩: 0 18px / 반경: 10px / 폰트: 700 14px

### 상태 표시

```html
<!-- 인라인 dot + 레이블 -->
<span style="color:var(--status-success)">● 정상</span>
<span style="color:var(--status-danger)">● 위험</span>
```

### 칩 필터 (연계 모니터링 등 다중 필터 페이지)

```html
<div class="filter-area">
  <div class="filter-row">
    <span class="filter-label">필터명</span>
    <div class="chip-group" data-field="fieldKey">
      <button class="chip on" data-val="" type="button">전체</button>
      <button class="chip" data-val="ok" type="button">정상</button>
    </div>
  </div>
  <div class="filter-row filter-row--search">
    <div class="search-box">
      <i data-lucide="search"></i>
      <input type="search" id="searchInput" placeholder="검색어" aria-label="검색">
    </div>
    <button class="btn btn--pri" id="searchBtn" type="button">조회</button>
    <button class="btn btn--line" id="resetBtn" type="button">초기화</button>
  </div>
</div>
```

- `.filter-area`: 필터 전체 래퍼 (`border-bottom` 구분선 + `margin-bottom`)
- `.chip.on`: 활성 = `background:var(--gp-primary); color:#fff`
- `data-field`: JS에서 `filters[field]`로 참조
- `data-val=""`: 전체(초기화) 칩

### 드로어 — 정보 배너 (상태 무관 고정형)

```html
<div class="dw__info-banner">
  <i data-lucide="info" class="gp-ico"></i>
  <p>설명 텍스트</p>
</div>
```

- 상태에 따라 색이 바뀌는 `.dw__banner--*`와 달리, 항상 파란색 고정
- 드로어 내용이 항목 설명 중심일 때 사용 (연계 모니터링, 카탈로그 등)
- 상태는 별도 `.dl__r`의 `<dd>` 안에 `.pill` 배지로 표시

### 드로어 푸터 — 다중 행 버튼 (3행 레이아웃)

```html
<div class="dw__ft">
  <div class="dw__ft-row">              <!-- 2열 -->
    <button class="btn btn--line">...</button>
    <button class="btn btn--line">...</button>
  </div>
  <div class="dw__ft-row dw__ft-row--full">  <!-- 1열 전체 폭 -->
    <button class="btn btn--line">...</button>
  </div>
  <div class="dw__ft-row">              <!-- 2열 -->
    <button class="btn btn--ghost">...</button>
    <button class="btn btn--pri">...</button>
  </div>
</div>
```

### 빈 상태 (Empty State) — page-shared.css 포함

```html
<tr class="tbl__empty">
  <td colspan="N"><i data-lucide="inbox"></i>조건에 맞는 데이터가 없습니다.</td>
</tr>
```

---

## 홈 대시보드 레이아웃 (참고용)

```
┌─────────────────────────────────────────────────────────────────┐
│  TOPBAR (60px, sticky)                                          │
├──────────┬──────────────────────────────────────────────────────┤
│ SNB      │  CONTENT (.content — CSS Grid)                       │
│ 80→220px │  col-left(430px) | map(1fr) | col-right(430px)       │
│ hover    │  ─────────────────────────────────────               │
│ expand   │  SNB hover: 410px | 800px(1fr) | 410px              │
│          │  ─────────────────────────────────────               │
│          │  mile-row (grid-col: 1/span2, row:2)                  │
└──────────┴──────────────────────────────────────────────────────┘
```

- `transition: grid-template-columns .26s cubic-bezier(.16,1,.3,1)`
- 지도: `assets/img/img_HMap.jpg` — 980px 고정 스테이지 + overflow:hidden 마스크
- 지도 radius: `16px` (`.map-wrap`)

---

## 지도 핀 좌표 기준 (img_HMap.jpg)

핀 위치는 `.map__stage` 기준 % — 실제 데이터 연동 시 `data-id` 속성 추가 예정

| 권역 | left | top |
|------|------|-----|
| 광명권역 중심 | 38–42% | 26–29% |
| 철산역권 중심 | 61–62% | 20–22% |
| 하안권역 중심 | 57% | 36–40% |
| 학온권역 중심 | 37% | 54% |
| 소하·일직권역 중심 | 54–57% | 54–62% |
| 광명역 KTX | 49% | 77–78% |
