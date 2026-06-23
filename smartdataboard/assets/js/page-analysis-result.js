/* =====================================================================
   광명 스마트데이터보드 · 분석 결과 관리
   ===================================================================== */

const RESULT_DB = [
  { id:1,  name:'탄소저감 성과 분석',      type:'dashboard', screen:'analysis-dash',   period:'최근 1개월',        tool:'tableau', status:'active',   dept:'기후환경과', updated:'2026.06.04', field:'탄소저감량',        param:'param_co2_reduction', order:1, desc:'탄소저감 성과를 월 단위로 분석하여 프로젝트별 성과와 감축 추이를 시각화하는 대시보드입니다.' },
  { id:2,  name:'지역별 에너지 비교 분석',  type:'compare',   screen:'data-compare',    period:'2026.01~2026.05', tool:'tableau', status:'active',   dept:'기후에너지과',   updated:'2026.06.04', field:'에너지사용량',      param:'param_energy_compare', order:2, desc:'광명시 5개 지역의 에너지 사용 현황을 비교하는 분석입니다.' },
  { id:3,  name:'DRT 운영 효율 분석',       type:'compare',   screen:'data-compare',    period:'최근 3개월',        tool:'tableau', status:'review',   dept:'교통정책과',     updated:'2026.06.03', field:'DRT운영건수',       param:'param_drt_efficiency',  order:3, desc:'DRT 운영 효율성 및 이용 패턴을 분석합니다.' },
  { id:4,  name:'미세먼지 센서 추이 분석',  type:'trend',     screen:'analysis-dash',   period:'최근 1주',          tool:'none',    status:'active',   dept:'기후환경과', updated:'2026.06.03', field:'PM2.5',            param:'', order:4, desc:'광명시 미세먼지 센서 데이터 시계열 추이 분석입니다.' },
  { id:5,  name:'침수 위험 예측 분석',      type:'spatial',   screen:'external',        period:'최근 1개월',        tool:'none',    status:'inactive', dept:'도시계획과', updated:'2026.06.01', field:'침수위험도',        param:'', order:5, desc:'GIS 기반 침수 위험 지역 예측 분석입니다.' },
  { id:6,  name:'교통량 패턴 분석',         type:'trend',     screen:'analysis-dash',   period:'2026.01~2026.05', tool:'tableau', status:'active',   dept:'교통정책과',     updated:'2026.05.31', field:'교통량',           param:'param_traffic', order:6, desc:'광명시 주요 도로별 교통량 패턴 분석입니다.' },
  { id:7,  name:'공공시설 이용 현황 분석',  type:'compare',   screen:'data-compare',    period:'최근 6개월',        tool:'tableau', status:'review',   dept:'스마트도시과',updated:'2026.05.30', field:'시설이용률',        param:'param_facility', order:7, desc:'공공시설 이용 현황 비교 분석입니다.' },
  { id:8,  name:'신재생에너지 발전 현황',   type:'dashboard', screen:'analysis-dash',   period:'최근 1개월',        tool:'tableau', status:'active',   dept:'기후에너지과',   updated:'2026.05.30', field:'발전량',           param:'param_renewable', order:8, desc:'태양광·풍력 등 신재생에너지 발전 현황 대시보드입니다.' },
  { id:9,  name:'탄소중립 목표 달성도',     type:'dashboard', screen:'analysis-dash',   period:'연간',              tool:'tableau', status:'active',   dept:'기후환경과', updated:'2026.05.28', field:'감축목표달성률',    param:'param_carbon_goal', order:9, desc:'2026 탄소중립 목표 달성도 분석입니다.' },
  { id:10, name:'마일 지표 종합 분석',      type:'trend',     screen:'analysis-dash',   period:'분기',              tool:'tableau', status:'active',   dept:'스마트도시과',updated:'2026.05.27', field:'마일점수',          param:'param_mile_score', order:10, desc:'4대 마일 지표 종합 현황 및 추이 분석입니다.' },
  { id:11, name:'전기차 보급 효과 분석',    type:'trend',     screen:'data-compare',    period:'최근 6개월',        tool:'tableau', status:'active',   dept:'교통정책과',     updated:'2026.05.26', field:'전기차보급대수',    param:'param_ev', order:11, desc:'전기차 보급 증가에 따른 탄소저감 효과 분석입니다.' },
  { id:12, name:'지역별 탄소배출 현황',     type:'spatial',   screen:'analysis-dash',   period:'최근 1개월',        tool:'tableau', status:'review',   dept:'기후환경과', updated:'2026.05.25', field:'탄소배출량',        param:'param_emission', order:12, desc:'지역별 탄소배출 현황 공간 분석입니다.' },
  { id:13, name:'에너지 절감 효과 측정',    type:'trend',     screen:'data-compare',    period:'연간',              tool:'tableau', status:'active',   dept:'기후에너지과',   updated:'2026.05.24', field:'절감에너지량',      param:'param_saving', order:13, desc:'에너지 절감 정책 효과 측정 분석입니다.' },
  { id:14, name:'스마트 가로등 운영 분석',  type:'dashboard', screen:'analysis-dash',   period:'최근 3개월',        tool:'none',    status:'inactive', dept:'스마트도시과',updated:'2026.05.23', field:'가로등운영율',      param:'', order:14, desc:'스마트 가로등 운영 효율 분석입니다.' },
  { id:15, name:'공원 이용률 계절 분석',    type:'trend',     screen:'analysis-dash',   period:'연간',              tool:'tableau', status:'active',   dept:'도시계획과', updated:'2026.05.22', field:'이용률',           param:'param_park', order:15, desc:'계절별 공원 이용률 추이 분석입니다.' },
  { id:16, name:'분야별 데이터 연계 현황',  type:'dashboard', screen:'analysis-dash',   period:'최근 1개월',        tool:'tableau', status:'active',   dept:'스마트도시과',updated:'2026.05.21', field:'연계건수',          param:'param_linkage', order:16, desc:'분야별 데이터 연계 현황 대시보드입니다.' },
  { id:17, name:'수질 모니터링 분석',       type:'trend',     screen:'external',        period:'최근 3개월',        tool:'none',    status:'inactive', dept:'기후환경과', updated:'2026.05.20', field:'수질지수',          param:'', order:17, desc:'광명시 수질 모니터링 데이터 추이 분석입니다.' },
  { id:18, name:'폐기물 처리 현황 분석',    type:'dashboard', screen:'data-compare',    period:'최근 6개월',        tool:'tableau', status:'review',   dept:'기후환경과', updated:'2026.05.19', field:'폐기물처리량',      param:'param_waste', order:18, desc:'폐기물 수거·처리 현황 비교 분석입니다.' },
  { id:19, name:'탄소 흡수원 현황',         type:'trend',     screen:'analysis-dash',   period:'연간',              tool:'tableau', status:'active',   dept:'기후환경과', updated:'2026.05.18', field:'탄소흡수량',        param:'param_sink', order:19, desc:'도시 내 탄소흡수원(공원·숲 등) 현황 분석입니다.' },
  { id:20, name:'건물 에너지 사용 분석',    type:'compare',   screen:'data-compare',    period:'최근 6개월',        tool:'tableau', status:'active',   dept:'기후에너지과',   updated:'2026.05.17', field:'건물에너지',        param:'param_building', order:20, desc:'건물 유형별 에너지 사용 현황 비교 분석입니다.' },
  { id:21, name:'통합 모빌리티 분석',       type:'dashboard', screen:'analysis-dash',   period:'최근 3개월',        tool:'tableau', status:'active',   dept:'교통정책과',     updated:'2026.05.16', field:'모빌리티지수',      param:'param_mobility', order:21, desc:'대중교통·DRT·전기차 통합 모빌리티 현황 분석입니다.' },
  { id:22, name:'스마트시티 지표 현황',     type:'dashboard', screen:'analysis-dash',   period:'분기',              tool:'tableau', status:'active',   dept:'스마트도시과',updated:'2026.05.15', field:'스마트지수',        param:'param_smart', order:22, desc:'광명 스마트시티 종합 지표 현황 대시보드입니다.' },
  { id:23, name:'전력 피크 분석',           type:'trend',     screen:'data-compare',    period:'최근 1개월',        tool:'none',    status:'inactive', dept:'기후에너지과',   updated:'2026.05.14', field:'전력피크',          param:'', order:23, desc:'전력 피크 시간대 및 절감 가능성 분석입니다.' },
  { id:24, name:'탄소 크레딧 현황 분석',    type:'dashboard', screen:'analysis-dash',   period:'연간',              tool:'tableau', status:'active',   dept:'기후환경과', updated:'2026.05.13', field:'크레딧량',          param:'param_credit', order:24, desc:'탄소 크레딧 획득 및 활용 현황 분석입니다.' },
];

const TYPE_LABEL  = { dashboard: '대시보드', compare: '비교 분석', trend: '추이 분석', spatial: '공간 분석', report: '외부 리포트' };
const SCREEN_LABEL= { 'analysis-dash': '분석 대시보드', 'data-compare': '데이터 비교 분석', 'analysis-result': '분석 결과 관리', external: '외부 리포트' };
const STATUS_CFG  = { active: ['pill--ok','사용 중'], review: ['pill--warn','검토 필요'], inactive: ['pill--stop','미사용'] };

let filtered = [...RESULT_DB];
let currentPage = 1;
let perPage = 10;
let editId = null;
const favSet = new Set();
let showFavOnly = false;

/* ── 스켈레톤 ── */
function showSkeleton() {
  const widths = ['36px','160px','70px','100px','80px','50px','60px','50px','40px'];
  document.getElementById('resultTableBody').innerHTML = Array.from({ length: 5 }, () =>
    `<tr class="ar-skeleton-row">${widths.map(w => `<td><div class="skeleton-bar" style="width:${w}"></div></td>`).join('')}</tr>`
  ).join('');
}

/* ── 부트 ── */
function boot() {
  showSkeleton();
  bindEvents();
  setTimeout(() => {
    renderTable();
    lucide.createIcons();
  }, 380);
}
document.addEventListener('gmsb:shell-ready', boot, { once: true });

/* ── 테이블 렌더링 ── */
function renderTable() {
  const start = (currentPage - 1) * perPage;
  const slice = filtered.slice(start, start + perPage);

  document.getElementById('totalCount').textContent = filtered.length;

  document.getElementById('resultTableBody').innerHTML = slice.length === 0
    ? `<tr class="tbl__empty"><td colspan="9"><i data-lucide="inbox"></i>조건에 맞는 데이터가 없습니다.</td></tr>`
    : slice.map(r => {
        const [cls, lbl] = STATUS_CFG[r.status];
        const tool = r.tool === 'tableau'
          ? `<span class="tool-badge"><img class="tool-badge__ico" src="../assets/img/tableau_icon.png" onerror="this.style.display='none'"><span>Tableau</span></span>`
          : `<span class="tool-none">없음</span>`;
        const isFav = favSet.has(r.id);
        return `<tr data-id="${r.id}" class="result-row">
          <td style="padding-left:8px"><button class="ar-fav-btn${isFav?' on':''}" data-fav="${r.id}" type="button"><i data-lucide="star"></i></button></td>
          <td class="l">${r.name}</td>
          <td>${TYPE_LABEL[r.type]||r.type}</td>
          <td>${SCREEN_LABEL[r.screen]||r.screen}</td>
          <td>${r.period}</td>
          <td>${tool}</td>
          <td><span class="pill ${cls}">${lbl}</span></td>
          <td>${r.updated}</td>
          <td><button class="tbtn tbtn--sm" data-id="${r.id}">보기</button></td>
        </tr>`;
      }).join('');

  renderPagination();
  lucide.createIcons();
}

function renderPagination() {
  const total = Math.ceil(filtered.length / perPage);
  const pg = document.getElementById('pagination');
  if (total <= 1) { pg.innerHTML = ''; return; }

  const mkBtn = (label, page, disabled = false, active = false) => {
    const cls = ['pg-btn', active ? 'on' : '', disabled ? '' : ''].filter(Boolean).join(' ');
    return `<button class="${cls}" data-page="${page}" ${disabled ? 'disabled' : ''}>${label}</button>`;
  };

  let html = '';
  html += mkBtn('«', 1, currentPage === 1);
  html += mkBtn('‹', currentPage - 1, currentPage === 1);

  const win = 2;
  const start = Math.max(1, currentPage - win);
  const end   = Math.min(total, currentPage + win);
  for (let i = start; i <= end; i++) html += mkBtn(i, i, false, i === currentPage);

  html += mkBtn('›', currentPage + 1, currentPage === total);
  html += mkBtn('»', total, currentPage === total);

  pg.innerHTML = html;
}

/* ── 필터 적용 ── */
function applyFilter() {
  const type   = document.getElementById('fType').value;
  const field  = document.getElementById('fField').value;
  const tool   = document.getElementById('fTool').value;
  const status = document.getElementById('fStatus').value;
  const dept   = document.getElementById('fDept').value;
  const region = document.getElementById('fRegion').value;
  const keyword= document.getElementById('searchInput').value.trim().toLowerCase();
  const from   = document.getElementById('dateFrom').value;
  const to     = document.getElementById('dateTo').value;

  filtered = RESULT_DB.filter(r => {
    if (type   && r.type   !== type)   return false;
    if (status && r.status !== status) return false;
    if (tool   && r.tool   !== tool)   return false;
    if (keyword && !r.name.toLowerCase().includes(keyword) && !r.dept.toLowerCase().includes(keyword)) return false;
    if (showFavOnly && !favSet.has(r.id)) return false;
    return true;
  });
  currentPage = 1;
  renderTable();
  document.getElementById('totalCount').textContent = filtered.length;
}

/* ── 드로어: 편집 ── */
function openEditDrawer(id) {
  const r = RESULT_DB.find(x => x.id === id);
  if (!r) return;
  editId = id;

  document.getElementById('dwMode').textContent = '조건 상세 편집';
  document.getElementById('dwTitle').textContent = r.name;
  document.getElementById('dwBannerMsg').textContent = '선택한 분석 결과의 조건 정보를 확인하고 수정할 수 있습니다.';
  document.getElementById('fldName').value = r.name;
  document.getElementById('fldType').value = r.type;
  document.getElementById('fldScreen').value = r.screen;
  document.getElementById('fldPeriod').value = r.period.includes('1개월') ? '1m' : r.period.includes('3개월') ? '3m' : r.period.includes('분기') ? 'q' : r.period.includes('연간') ? 'y' : 'custom';
  document.getElementById('fldLinkField').value = r.field;
  document.getElementById('fldTableauParam').value = r.param;
  document.getElementById('fldOrder').value = r.order;
  const isActive = r.status === 'active';
  document.getElementById('fldActive').checked = isActive;
  document.getElementById('toggleLabel').textContent = isActive ? '사용 중' : '비활성';
  document.getElementById('toggleLabel').className = 'toggle-label' + (isActive ? ' active' : '');
  document.getElementById('fldDesc').value = r.desc;

  document.getElementById('deactivateRow').style.display = r.status === 'active' ? '' : 'none';
  openDrawer();
}

function openRegisterDrawer() {
  editId = null;
  document.getElementById('dwMode').textContent = '결과 등록';
  document.getElementById('dwTitle').textContent = '새 분석 결과';
  document.getElementById('dwBannerMsg').textContent = '새로운 분석 결과를 등록합니다. 필수 항목(*)을 입력하세요.';
  document.getElementById('fldName').value = '';
  document.getElementById('fldType').selectedIndex = 0;
  document.getElementById('fldScreen').selectedIndex = 0;
  document.getElementById('fldPeriod').selectedIndex = 0;
  document.getElementById('fldLinkField').value = '';
  document.getElementById('fldTableauParam').value = '';
  document.getElementById('fldOrder').value = RESULT_DB.length + 1;
  document.getElementById('fldActive').checked = true;
  document.getElementById('toggleLabel').textContent = '사용 중';
  document.getElementById('toggleLabel').className = 'toggle-label active';
  document.getElementById('fldDesc').value = '';
  document.getElementById('deactivateRow').style.display = 'none';
  openDrawer();
}

function openDrawer() {
  document.getElementById('scrim').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  lucide.createIcons();
}

function closeDrawer() {
  document.getElementById('scrim').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
  editId = null;
}

function saveDrawer() {
  const name = document.getElementById('fldName').value.trim();
  if (!name) { showToast('결과명을 입력하세요.'); document.getElementById('fldName').focus(); return; }

  if (editId) {
    const r = RESULT_DB.find(x => x.id === editId);
    if (r) {
      r.name   = name;
      r.type   = document.getElementById('fldType').value;
      r.screen = document.getElementById('fldScreen').value;
      r.field  = document.getElementById('fldLinkField').value;
      r.param  = document.getElementById('fldTableauParam').value;
      r.order  = parseInt(document.getElementById('fldOrder').value) || r.order;
      r.status = document.getElementById('fldActive').checked ? 'active' : 'inactive';
      r.desc   = document.getElementById('fldDesc').value;
      const now = new Date();
      r.updated = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
    }
    showToast('분석 결과가 저장되었습니다.');
  } else {
    showToast('분석 결과가 등록되었습니다.');
  }

  closeDrawer();
  filtered = [...RESULT_DB];
  renderTable();
}

/* ── 이벤트 바인딩 ── */
function bindEvents() {
  /* 테이블 클릭 — 보기 버튼 (즐겨찾기는 아래에서 별도 처리) */

  /* 결과 등록 버튼 */
  document.getElementById('btnRegister').addEventListener('click', openRegisterDrawer);

  /* 드로어 닫기 */
  document.getElementById('scrim').addEventListener('click', closeDrawer);
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  document.getElementById('btnCancel').addEventListener('click', closeDrawer);

  /* 저장 */
  document.getElementById('btnSave').addEventListener('click', saveDrawer);

  /* 비활성화 */
  document.getElementById('btnDeactivate').addEventListener('click', () => {
    if (!editId) return;
    const r = RESULT_DB.find(x => x.id === editId);
    if (r) { r.status = 'inactive'; }
    closeDrawer();
    filtered = [...RESULT_DB];
    renderTable();
    showToast('비활성화되었습니다.');
  });

  /* 미리보기 / 이력 */
  document.getElementById('btnPreview').addEventListener('click', () => showToast('미리보기 기능은 연계 시스템 연동 후 제공됩니다.'));
  document.getElementById('btnHistory').addEventListener('click', () => showToast('변경 이력 조회 기능은 연계 시스템 연동 후 제공됩니다.'));

  /* 즐겨찾기 (드로어 버튼) */
  document.getElementById('btnFavToggle').addEventListener('click', () => {
    if (!editId) return;
    if (favSet.has(editId)) favSet.delete(editId); else favSet.add(editId);
    const on = favSet.has(editId);
    const btn = document.getElementById('btnFavToggle');
    btn.style.color = on ? 'var(--status-warning)' : '';
    btn.style.borderColor = on ? 'var(--status-warning)' : '';
    renderTable();
    showToast(on ? '즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 제거되었습니다.');
  });

  /* 즐겨찾기만 보기 (테이블 토글) */
  document.getElementById('btnFavOnly').addEventListener('click', () => {
    showFavOnly = !showFavOnly;
    document.getElementById('btnFavOnly').classList.toggle('on', showFavOnly);
    applyFilter();
  });

  /* 즐겨찾기 행 별 버튼 이벤트 위임 */
  document.getElementById('resultTableBody').addEventListener('click', e => {
    const favBtn = e.target.closest('.ar-fav-btn');
    if (favBtn) {
      e.stopPropagation();
      const id = parseInt(favBtn.dataset.fav);
      if (favSet.has(id)) favSet.delete(id); else favSet.add(id);
      favBtn.classList.toggle('on', favSet.has(id));
      if (showFavOnly) applyFilter();
      return;
    }
    const btn = e.target.closest('[data-id]');
    if (btn) openEditDrawer(parseInt(btn.dataset.id));
  });

  /* 공유 URL 복사 */
  document.getElementById('btnShareUrl').addEventListener('click', () => {
    if (!editId) return;
    const url = location.href.split('#')[0] + '#result-' + editId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('공유 URL이 복사되었습니다.'));
    }
  });

  /* 토글 스위치 레이블 */
  document.getElementById('fldActive').addEventListener('change', e => {
    const lbl = document.getElementById('toggleLabel');
    lbl.textContent = e.target.checked ? '사용 중' : '비활성';
    lbl.className = 'toggle-label' + (e.target.checked ? ' active' : '');
  });

  /* 스핀박스 */
  document.getElementById('spinUp').addEventListener('click', () => {
    const el = document.getElementById('fldOrder');
    el.value = Math.min(99, parseInt(el.value || 1) + 1);
  });
  document.getElementById('spinDown').addEventListener('click', () => {
    const el = document.getElementById('fldOrder');
    el.value = Math.max(1, parseInt(el.value || 1) - 1);
  });

  /* 조회 */
  document.getElementById('btnSearch').addEventListener('click', applyFilter);
  document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') applyFilter(); });

  /* 테이블 내 검색 */
  document.getElementById('btnTblSearch').addEventListener('click', () => {
    const kw = document.getElementById('tblSearch').value.trim().toLowerCase();
    filtered = RESULT_DB.filter(r => !kw || r.name.toLowerCase().includes(kw));
    currentPage = 1;
    renderTable();
  });
  document.getElementById('tblSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btnTblSearch').click();
  });

  /* 초기화 */
  document.getElementById('btnReset').addEventListener('click', () => {
    ['fType','fField','fTool','fStatus','fDept','fRegion'].forEach(id => document.getElementById(id).selectedIndex = 0);
    document.getElementById('searchInput').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    filtered = [...RESULT_DB];
    currentPage = 1;
    renderTable();
    showToast('필터가 초기화되었습니다.');
  });

  /* 페이지당 건수 */
  document.getElementById('perPage').addEventListener('change', e => {
    perPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
  });

  /* 페이지네이션 */
  document.getElementById('pagination').addEventListener('click', e => {
    const btn = e.target.closest('[data-page]');
    if (!btn || btn.disabled) return;
    currentPage = parseInt(btn.dataset.page);
    renderTable();
  });

  /* 전체 CSV */
  document.getElementById('btnExportAll').addEventListener('click', exportCSV);

  /* 새로고침 */
  document.getElementById('btnRefresh').addEventListener('click', () => {
    const now = new Date();
    const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const el = document.getElementById('statUpdated');
    if (el) el.textContent = hm;
    showToast('데이터가 갱신되었습니다.');
  });
}

function exportCSV() {
  const header = ['결과명','분석 유형','적용 화면','기준 기간','연계 도구','상태','수정일','담당 부서'];
  const rows = filtered.map(r => [r.name, TYPE_LABEL[r.type]||r.type, SCREEN_LABEL[r.screen]||r.screen, r.period, r.tool === 'tableau' ? 'Tableau' : '없음', STATUS_CFG[r.status][1], r.updated, r.dept]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '분석결과목록_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1A2942;color:#fff;padding:12px 24px;border-radius:10px;font:500 14px/1 var(--font-sans);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
