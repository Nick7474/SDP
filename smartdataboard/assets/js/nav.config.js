/* =====================================================================
   광명 스마트데이터보드 · 내비게이션 설정 (단일 소스 of truth)
   ---------------------------------------------------------------------
   메뉴를 추가/수정하려면 이 파일만 고치면 모든 페이지에 반영됩니다.
   - icon : lucide 아이콘 이름 (https://lucide.dev)
   - href : 사이트 루트 기준 경로. shell.js 가 GMSB_BASE 를 자동으로 붙입니다.
            (아직 미구현 페이지는 '#')
   ===================================================================== */
window.GMSB_NAV = [
  { id: 'home', label: '홈', icon: 'home', img: '00_LM_IC.png', href: 'index.html' },

  /* 1. 운영 모니터링 */
  { id: 'op', label: '운영 모니터링', icon: 'monitor-dot', img: '01_LM_IC.png', children: [
    { id: 'data-monitoring',   label: '데이터 모니터링', href: 'pages/operation-monitoring.html' },
    { id: 'link-monitoring',   label: '연계 모니터링',   href: 'pages/linkage-monitoring.html' },
    { id: 'status-monitoring', label: '상태 모니터링',   href: 'pages/status-monitoring.html' }
  ]},

  /* 2. GIS 기반 도시 데이터 조회 */
  { id: 'gis', label: 'GIS 기반 도시<br>데이터 조회', icon: 'map', img: '02_LM_IC.png', children: [
    { id: 'mile-map',      label: '4종 마일별 데이터 지도',  href: 'pages/mile-map.html' },
    { id: 'carbon-energy', label: '탄소·에너지 공간 데이터', href: 'pages/carbon-energy.html' },
    { id: 'theme-map',     label: '도시 데이터 주제도',      href: 'pages/theme-map.html' },
    { id: 'gis-manage',    label: 'GIS 데이터 관리',         href: 'pages/gis-manage.html' }
  ]},

  /* 3. 지표 기반 탄소중립 도시 현황 */
  { id: 'carbon', label: '지표 기반 탄소중립<br>도시 현황', icon: 'leaf', img: '03_LM_IC.png', children: [
    { id: 'carbon-dash',    label: '탄소중립 종합 현황', href: 'pages/carbon-summary.html' },
    { id: 'mile-analysis',  label: '마일 지표 분석',     href: 'pages/mile-analysis.html' },
    { id: 'carbon-kpi',     label: '탄소·에너지 지표',   href: 'pages/carbon-kpi.html' }
  ]},

  /* 4. AI 데이터 카탈로그 */
  { id: 'catalog', label: 'AI 데이터 카탈로그', icon: 'database', img: '04_LM_IC.png', children: [
    { id: 'data-search',  label: '데이터 검색/조회',   href: 'pages/catalog-search.html' },
    { id: 'dataset',      label: '데이터 카탈로그 관리',      href: 'pages/catalog-dataset.html' },
    { id: 'ai-meta',      label: 'AI 메타데이터 추천', href: 'pages/catalog-ai-meta.html' },
    { id: 'data-access',  label: '데이터 접근 관리',   href: 'pages/catalog-access.html' }
  ]},

  /* 5. 데이터 분석·시각화 */
  { id: 'analysis', label: '데이터 분석·시각화', icon: 'chart-column', img: '05_LM_IC.png', children: [
    { id: 'analysis-dash',  label: '분석 대시보드',    href: 'pages/analysis-dash.html' },
    { id: 'data-compare',   label: '데이터 비교 분석', href: 'pages/analysis-compare.html' },
    { id: 'result-manage',  label: '분석 결과 관리',   href: 'pages/analysis-result.html' }
  ]},

  /* 6. 시스템관리 */
  { id: 'system', label: '시스템관리', icon: 'settings', img: '06_LM_IC.png', children: [
    { id: 'users', label: '사용자 관리',     href: 'pages/system-users.html' },
    { id: 'prefs', label: '시스템 설정 관리', href: 'pages/system-prefs.html' }
  ]}
];

/* 상단바 브랜드/타이틀 (공통) */
window.GMSB_BRAND = {
  logo: 'assets/img/bi-board.svg',
  name: 'Smart Data Board',
  cityLogo: 'assets/img/bi-gwangmyeong.png',
  cityTitle: '광명 <span class="ct-smart">스마트</span><span class="ct-board">데이터보드</span>',
  user: '홍길동',
  alerts: 1
};
