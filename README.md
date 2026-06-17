# 광명 스마트데이터보드 (Smart Data Board)

광명 스마트데이터플랫폼의 행정 내부 화면(스마트데이터보드) 프론트엔드입니다.
약 50여 개 페이지로 확장될 서비스로, **반복되는 상단바·좌측 메뉴·페이지 헤더(브레드크럼/타이틀/설명)는
HTML 에 다시 쓰지 않고 공통 모듈에서 자동 생성**하도록 구성했습니다.

## 폴더 구조

```
smartdata-board/
├─ index.html                     # 홈 (대시보드)
├─ pages/
│   └─ operation-monitoring.html  # 운영 모니터링 › 데이터 모니터링
├─ assets/
│   ├─ css/
│   │   ├─ tokens.css             # 디자인 시스템 토큰(색·타입·간격) — 수정 지양
│   │   ├─ base.css               # 디자인 시스템 공통 컴포넌트 — 수정 지양
│   │   ├─ shell.css              # ★ 공통 골격: 상단바·사이드바·페이지헤더·버튼
│   │   ├─ page-home.css          # 홈 전용
│   │   └─ page-monitoring.css    # 데이터 모니터링 전용
│   ├─ js/
│   │   ├─ nav.config.js          # ★ 메뉴 정의 (단일 소스) — 메뉴 추가/수정은 여기만
│   │   ├─ shell.js               # ★ 상단바·사이드바·페이지헤더 자동 렌더 + 사이드바 동작
│   │   ├─ page-home.js           # 홈 지도 인터랙션
│   │   └─ page-monitoring.js     # 히트맵·테이블·상세 드로어
│   └─ img/                       # 로고·4대 마일 아이콘·지도 핀·다이얼·클러스터 SVG
└─ README.md
```

`★` 표시가 공통 모듈입니다. 새 페이지는 이 3개(`nav.config.js`, `shell.js`, `shell.css`)를 그대로 재사용합니다.

---

## 새 페이지 만드는 법 (복사 → 3곳만 수정)

`pages/` 안에 새 HTML 을 만들고 아래 골격만 채우면 상단바·사이드바·헤더가 자동 생성됩니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>광명시 스마트데이터보드 · (페이지명)</title>
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/shell.css">
  <link rel="stylesheet" href="../assets/css/page-(이름).css">   <!-- 페이지 전용 CSS -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
  <!-- ① 마운트 지점 3개 (shell.js 가 채움) -->
  <div id="gmsb-topbar"></div>
  <div class="shell">
    <div id="gmsb-sidebar"></div>
    <main class="page">
      <div id="gmsb-header"></div>

      <!-- ② 이 아래에 페이지 본문만 작성 -->
      ...

    </main>
  </div>

  <!-- ③ 페이지 설정 + 공통 스크립트 (순서 고정) -->
  <script>
    window.GMSB_BASE = '../';                 // 루트(index.html)면 '', /pages/ 안이면 '../'
    window.GMSB_PAGE = {
      active: 'op.data-monitoring',           // 활성 메뉴: '섹션id.하위id' (nav.config.js 참고)
      header: {                               // 헤더 불필요(홈 등)하면 header 생략
        title: '데이터 모니터링',
        desc:  '페이지 설명 문구',
        actions: '<button class="btn btn--pri">동작</button>'   // (선택) 우측 액션 영역
      }
    };
  </script>
  <script src="../assets/js/nav.config.js"></script>
  <script src="../assets/js/shell.js"></script>
  <script src="../assets/js/page-(이름).js"></script>  <!-- (선택) 페이지 전용 JS -->
</body>
</html>
```

- **브레드크럼**은 `active` 값으로 `nav.config.js` 에서 자동 계산됩니다(홈 › 섹션 › 현재).
- **홈**처럼 헤더가 없으면 `header` 를 생략하고, 본문에 `#gmsb-header` 마운트도 빼면 됩니다.
- 페이지 전용 JS 가 헤더(액션 버튼 등)에 접근한다면, `gmsb:shell-ready` 이벤트 이후에 실행하세요
  (`page-monitoring.js` 참고). `window.GMSB_SHELL_READY` 플래그도 제공됩니다.

## 메뉴 추가/수정

`assets/js/nav.config.js` 의 `GMSB_NAV` 배열만 고치면 **모든 페이지**에 반영됩니다.
- `icon` 은 [lucide](https://lucide.dev) 아이콘 이름
- `href` 는 **사이트 루트 기준** 경로 (shell.js 가 `GMSB_BASE` 를 자동으로 붙임). 미구현은 `'#'`

## 디자인 시스템 / 토큰

- 색·타이포·간격은 `tokens.css` / `base.css`(광명 스마트데이터포털 디자인 시스템)을 따릅니다.
- 보드 주컬러는 **`#0C8AE5`** (`--gp-point`), 강조컬러 **`#044E9E`** (`--gp-primary`), 좌측 메뉴 네이비 **`#003481`**, 콘텐츠 배경 **`#F6F9FE`**.
- 4대 마일 색·아이콘은 토큰과 `img/mile-*.svg`·`img/pin-*.svg`·`img/dial-*.svg` 를 사용합니다.
- 상단 타이틀 서체는 **S-Core Dream**, 브랜드명은 **Pretendard GOV** 입니다.
- 웹 접근성 2.2 / KRDS 기준을 유지합니다(포커스 표시, 키보드 조작, 색 대비, 최소 터치 영역).

## 페이지 현황

| 경로 | 화면 | 비고 |
|---|---|---|
| `index.html` | 홈 대시보드 | 좌측 브리핑 3종 · 중앙 GIS 지도(4대 마일 전환) · 우측 통합 인사이트 패널 · 하단 마일 카드 |
| `pages/operation-monitoring.html` | 운영 모니터링 › 데이터 모니터링 | KPI · 수집 히트맵(클릭→우측 상세 드로어) · 최근 수집 이력 |

> 나머지 메뉴(GIS·탄소중립·카탈로그·분석·시스템관리)는 `nav.config.js` 에 등록되어 있으며
> 위 "새 페이지 만드는 법" 골격으로 순차 추가하면 됩니다.
