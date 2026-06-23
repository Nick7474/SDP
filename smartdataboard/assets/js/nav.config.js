/* =====================================================================
   광명 스마트데이터보드 · 내비게이션 설정 (홈 + 카탈로그 전용)
   ===================================================================== */
window.GMSB_NAV = [
  { id: 'home', label: '홈', icon: 'home', img: '00_LM_IC.png', href: 'index.html' },

  /* AI 데이터 카탈로그 */
  { id: 'catalog', label: 'AI 데이터 카탈로그', icon: 'database', img: '04_LM_IC.png', children: [
    { id: 'data-search',  label: '데이터 검색/조회',   href: 'pages/catalog-search.html' },
    { id: 'dataset',      label: '데이터셋 관리',      href: 'pages/catalog-dataset.html' },
    { id: 'ai-meta',      label: 'AI 메타데이터 추천', href: 'pages/catalog-ai-meta.html' },
    { id: 'data-access',  label: '데이터 접근 관리',   href: 'pages/catalog-access.html' }
  ]}
];

window.GMSB_BRAND = {
  logo: 'assets/img/bi-board.svg',
  name: 'Smart Data Board',
  cityLogo: 'assets/img/bi-gwangmyeong.png',
  cityTitle: '광명시 <span class="ct-smart">스마트</span><span class="ct-board">데이터보드</span>',
  user: '홍길동',
  alerts: 1
};
