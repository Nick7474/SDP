/* =====================================================================
   광명 스마트데이터보드 · 마일 지표 분석 (page-mile-analysis.js)
   ===================================================================== */

/* ── 마일 메타 ── */
const MILES = {
  energy:   { name: '에너지 마일',   color: '#0C8AE5', soft: '#E3F2FD', icon: 'zap',      score: 78 },
  mobility: { name: '모빌리티 마일', color: '#1AAA5E', soft: '#E4F6EC', icon: 'car',      score: 69 },
  safety:   { name: '세이프티 마일', color: '#ED8B16', soft: '#FDF1DF', icon: 'shield',   score: 72 },
  data:     { name: '데이터 마일',   color: '#6E74D6', soft: '#ECEDFB', icon: 'database', score: 62 },
};

const SUMMARY_TABLE = [
  { mile: 'energy',   kpi: '누적 발전량',   val: '543.4 MWh', mom: '+12.3%', pct: 65, status: 'ok' },
  { mile: 'mobility', kpi: '친환경 이동거리', val: '4.3K km',  mom: '+8.1%',  pct: 69, status: 'ok' },
  { mile: 'safety',   kpi: '미세먼지 지수',  val: '56',        mom: '-2.4%',  pct: 72, status: 'warn' },
  { mile: 'data',     kpi: '연계 데이터',    val: '72건',      mom: '+5',     pct: 62, status: 'err' },
];

const PERF_TABLE = [
  { mile: 'energy',   kpi: '누적 발전량',   val: '543.4 MWh', goal: '835.0 MWh', pct: 65, mom: '+12.3%↑', status: 'ok',   upd: '2026.05.26 15:00' },
  { mile: 'mobility', kpi: '친환경 이동거리', val: '323.8 MWh', goal: '470.0 MWh', pct: 69, mom: '+8.1%↑',  status: 'ok',   upd: '2026.05.26 15:00' },
  { mile: 'safety',   kpi: '미세먼지 지수',  val: '94.1%',     goal: '130.0%',    pct: 72, mom: '-2.4%↓',  status: 'warn', upd: '2026.05.26 15:00' },
  { mile: 'data',     kpi: '연계 데이터',    val: '72건',      goal: '120건',     pct: 60, mom: '+5↑',     status: 'err',  upd: '2026.05.26 15:00' },
];

const TREND_LABELS_MONTH = ['2025.06','2025.07','2025.08','2025.09','2025.10','2025.11','2025.12','2026.01','2026.02','2026.03','2026.04','2026.05'];
const TREND_DATA = {
  energy:   [68, 70, 71, 73, 74, 74, 75, 76, 76, 77, 78, 78],
  mobility: [63, 64, 65, 65, 66, 67, 67, 68, 68, 69, 69, 69],
  safety:   [55, 56, 57, 58, 59, 59, 60, 60, 61, 62, 72, 72],
  data:     [50, 52, 53, 55, 57, 58, 59, 59, 60, 61, 62, 62],
};

const TREND_LABELS_QUARTER = ['2024 Q3','2024 Q4','2025 Q1','2025 Q2','2025 Q3','2025 Q4','2026 Q1','2026 Q2'];
const TREND_DATA_Q = {
  energy:   [65, 68, 70, 72, 73, 75, 76, 78],
  mobility: [58, 61, 63, 65, 66, 67, 68, 69],
  safety:   [50, 53, 56, 58, 59, 60, 61, 72],
  data:     [45, 48, 51, 54, 57, 59, 60, 62],
};

const CHANGE_LIST = [
  { dir: 'up',   name: '누적 발전량',    val: '543.4 MWh',  pct: '+12.3%' },
  { dir: 'up',   name: '친환경 이동거리', val: '4.3K km',    pct: '+8.1%' },
  { dir: 'down', name: '미세먼지 지수',   val: '56 (주의)',  pct: '-2.4%' },
  { dir: 'up',   name: '연계 데이터',    val: '72건',       pct: '+5' },
];

const MILE_DB = {
  energy: {
    desc: '에너지 마일은 광명시 신재생에너지 발전·거래·사용 효율을 종합 평가합니다. 현재 목표 대비 65% 달성으로 순조롭게 운영 중입니다.',
    base: [['평가 영역','신재생에너지 생산·소비'],['책임 부서','기후에너지과'],['데이터 출처','한전·광명시 태양광 관제'],['업데이트 주기','일별']],
    perf: [['이번 달 실적','543.4 MWh'],['연간 목표','835.0 MWh'],['목표 달성률','65%'],['전월 대비','+12.3%'],['연간 누적','2,450 MWh']],
    history: [68, 70, 73, 74, 75, 78],
  },
  mobility: {
    desc: '모빌리티 마일은 DRT 운행, 전기차 전환, 친환경 이동거리 등 교통 분야 탄소중립 지표를 측정합니다.',
    base: [['평가 영역','친환경 교통·이동'],['책임 부서','교통행정과'],['데이터 출처','스마트 모빌리티 플랫폼'],['업데이트 주기','일별']],
    perf: [['친환경 이동거리','4.3K km'],['연간 목표','470.0 MWh'],['목표 달성률','69%'],['전월 대비','+8.1%'],['DRT 운행','15대']],
    history: [63, 64, 65, 66, 68, 69],
  },
  safety: {
    desc: '세이프티 마일은 대기질, 수위 센서, 위험 예측 등 환경·안전 지표를 통합 관리합니다. 현재 미세먼지 지수 주의 수준입니다.',
    base: [['평가 영역','환경·안전 모니터링'],['책임 부서','안전총괄과'],['데이터 출처','IoT 센서망 (271개소)'],['업데이트 주기','시간별']],
    perf: [['미세먼지 지수','56 (보통)'],['수위 센서 정상률','94.1%'],['위험 예측 건수','22건'],['센서 이상','3개소'],['전월 대비','-2.4%']],
    history: [55, 57, 58, 59, 60, 72],
  },
  data: {
    desc: '데이터 마일은 연계 데이터 수집, API 장상률, MRV 검증 데이터 품질을 관리합니다. 현재 일부 API 오류로 검증이 필요합니다.',
    base: [['평가 영역','데이터 수집·품질'],['책임 부서','스마트도시과'],['데이터 출처','스마트데이터플랫폼'],['업데이트 주기','15분']],
    perf: [['연계 데이터','72건'],['API 정상률','91.7%'],['MRV 데이터','28건'],['오류 항목','6건'],['전월 대비','+5건']],
    history: [50, 52, 55, 57, 59, 62],
  },
};

const DONG_DB = {
  energy:   [{ dong:'광명동',score:82,trend:'+4%'},{dong:'철산1동',score:79,trend:'+2%'},{dong:'하안1동',score:75,trend:'+1%'},{dong:'소하1동',score:68,trend:'-1%'},{dong:'학온동',score:55,trend:'-3%'}],
  mobility: [{ dong:'광명동',score:75,trend:'+5%'},{dong:'철산2동',score:72,trend:'+3%'},{dong:'하안3동',score:65,trend:'+1%'},{dong:'소하2동',score:60,trend:'-2%'},{dong:'일직동',score:52,trend:'-4%'}],
  safety:   [{ dong:'광명동',score:80,trend:'+3%'},{dong:'하안1동',score:76,trend:'+1%'},{dong:'철산4동',score:70,trend:'-1%'},{dong:'하안3동',score:58,trend:'-6%'},{dong:'소하1동',score:55,trend:'-3%'}],
  data:     [{ dong:'철산1동',score:72,trend:'+6%'},{dong:'광명동',score:68,trend:'+2%'},{dong:'하안2동',score:62,trend:'+1%'},{dong:'소하1동',score:54,trend:'-2%'},{dong:'학온동',score:48,trend:'-5%'}],
};

let activeMile = 'energy';
let dwChart = null;
let perfTrendChart = null;
let trendChart = null;

/* ── 부트 ── */
function boot() {
  initTabs();
  initRadarChart();
  initTrendChart();
  renderSummaryTable();
  renderPerfList();
  renderSelMile('energy');
  renderChangeList();
  renderPerfTable();
  initPerfTrendChart();
  bindEvents();
  lucide.createIcons();
}
document.addEventListener('gmsb:shell-ready', boot, { once: true });

/* 탭 전환 */
const MA_TAB_META = {
  summary: { label: '마일별 종합 분석', desc: '4대 마일(에너지·모빌리티·세이프티·데이터) 성과를 한눈에 비교하고 변화 추이를 확인합니다.' },
  perf:    { label: '마일별 운영실적',  desc: '각 마일의 세부 운영 실적을 확인합니다.' }
};

function initTabs() {
  if (window.gmsbSetTab) gmsbSetTab(MA_TAB_META.summary.label, MA_TAB_META.summary.desc);
  document.querySelectorAll('.page-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-tab').forEach(b => b.classList.remove('on'));
      document.querySelectorAll('.ma-pane').forEach(p => p.classList.remove('on'));
      btn.classList.add('on');
      document.getElementById('pane-' + btn.dataset.tab).classList.add('on');
      const m = MA_TAB_META[btn.dataset.tab];
      if (m && window.gmsbSetTab) gmsbSetTab(m.label, m.desc);
      lucide.createIcons();
    });
  });
}

/* 레이더 차트 */
function initRadarChart() {
  const ctx = document.getElementById('chartRadar').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['에너지\n마일', '모빌리티\n마일', '세이프티\n마일', '데이터\n마일'],
      datasets: [{
        label: '현재 점수',
        data: [78, 69, 72, 62],
        backgroundColor: 'rgba(12,138,229,.15)',
        borderColor: '#0C8AE5',
        borderWidth: 2,
        pointBackgroundColor: '#0C8AE5',
        pointRadius: 5,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 25, font: { size: 11 }, color: '#7A8699', backdropColor: 'transparent' },
          grid: { color: '#E4E9F1' },
          angleLines: { color: '#E4E9F1' },
          pointLabels: { font: { size: 12, weight: '600' }, color: '#36445A' },
        },
      },
    },
  });
}

/* 종합 분석 추이 차트 */
function initTrendChart() {
  const ctx = document.getElementById('chartTrend').getContext('2d');
  const miles = ['energy', 'mobility', 'safety', 'data'];
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: TREND_LABELS_MONTH,
      datasets: miles.map(id => ({
        label: MILES[id].name,
        data: TREND_DATA[id],
        borderColor: MILES[id].color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: MILES[id].color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}점` } },
      },
      onClick: (event, elements, chart) => {
        if (!elements.length) return;
        const i = elements[0].index;
        const label = chart.data.labels[i];
        const vals = chart.data.datasets.map(ds => `${ds.label}: ${ds.data[i]}점`).join('\n');
        showChartPopup(label, vals, event.native);
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', maxRotation: 0 } },
        y: {
          grid: { color: '#F1F4F8' },
          ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '점' },
          min: 40, max: 100,
        },
      },
    },
  });
}

/* 핵심 지표 테이블 */
function renderSummaryTable() {
  const tbody = document.getElementById('summaryTableBody');
  const stCls = { ok: 'pill--ok', warn: 'pill--warn', err: 'pill--err' };
  const stLbl = { ok: '정상', warn: '주의', err: '검증필요' };
  const barColor = p => p >= 80 ? '#1AAA5E' : p >= 60 ? '#0C8AE5' : '#ED8B16';
  const isUp = s => s.includes('+') && !s.includes('미세');
  tbody.innerHTML = SUMMARY_TABLE.map(d => {
    const m = MILES[d.mile];
    return `<tr class="mile-row" data-mile="${d.mile}">
      <td class="l">
        <div style="display:flex;align-items:center;gap:7px">
          <img src="${(window.GMSB_BASE||'../')}assets/img/mile-${d.mile}.svg" style="width:24px;height:24px;display:block;border-radius:50%;" alt="">
          ${m.name}
        </div>
      </td>
      <td class="l">${d.kpi}</td>
      <td class="num">${d.val}</td>
      <td class="${isUp(d.mom) ? 'tbl-up' : 'tbl-down'}">${d.mom}</td>
      <td>
        <div class="prog">
          <div class="prog__track"><div class="prog__fill" style="width:${d.pct}%;background:${barColor(d.pct)}"></div></div>
          <span class="prog__pct">${d.pct}%</span>
        </div>
      </td>
      <td><span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span></td>
      <td><button class="row-go" data-mile="${d.mile}" type="button"><i data-lucide="chevron-right"></i></button></td>
    </tr>`;
  }).join('');
}

/* 운영실적 퍼프 목록 */
function renderPerfList() {
  const el = document.getElementById('perfList');
  const stCls = { ok: 'pill--ok', warn: 'pill--warn', err: 'pill--err' };
  const stLbl = { ok: '정상', warn: '주의', err: '검증필요' };
  const barColor = p => p >= 80 ? '#1AAA5E' : p >= 60 ? '#0C8AE5' : '#ED8B16';
  el.innerHTML = PERF_TABLE.map(d => {
    const m = MILES[d.mile];
    return `<div class="perf-item${d.mile === activeMile ? ' active' : ''}" data-mile="${d.mile}">
      <img src="${(window.GMSB_BASE||'../')}assets/img/mile-${d.mile}.svg" style="width:36px;height:36px;display:block;border-radius:50%;flex:none;" alt="">
      <div class="perf-item__body">
        <div class="perf-item__name">${m.name}</div>
        <div class="perf-item__val">${d.val} / 목표 ${d.goal}</div>
        <div class="prog">
          <div class="prog__track"><div class="prog__fill" style="width:${d.pct}%;background:${barColor(d.pct)}"></div></div>
          <span class="prog__pct">${d.pct}%</span>
        </div>
      </div>
      <span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span>
    </div>`;
  }).join('');
  // 클릭 이벤트
  el.querySelectorAll('.perf-item').forEach(item => {
    item.addEventListener('click', () => {
      activeMile = item.dataset.mile;
      el.querySelectorAll('.perf-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderSelMile(activeMile);
    });
  });
}

/* 선택 마일 상세 */
function renderSelMile(mileId) {
  const m = MILES[mileId];
  const d = PERF_TABLE.find(p => p.mile === mileId);
  const db = MILE_DB[mileId];
  const el = document.getElementById('selMileDetail');
  const vals = db.perf.slice(0, 6);
  el.innerHTML = `
    <div class="sel-hd">
      <div class="sel-hd__ico"><img src="${(window.GMSB_BASE||'../')}assets/img/mile-${mileId}.svg" style="width:42px;height:42px;display:block;" alt=""></div>
      <div>
        <div class="sel-hd__name">${m.name}</div>
        <div class="sel-hd__status"><span class="pill ${d.status === 'ok' ? 'pill--ok' : d.status === 'warn' ? 'pill--warn' : 'pill--err'}" style="font-size:11px;height:22px">${d.status === 'ok' ? '정상' : d.status === 'warn' ? '주의' : '검증필요'}</span></div>
      </div>
    </div>
    <div class="sel-vals">
      ${vals.map(([lb, vl]) => `<div class="sel-val"><div class="lb">${lb}</div><div class="vl">${vl}</div></div>`).join('')}
    </div>`;
}

/* 주요 변화 */
function renderChangeList() {
  document.getElementById('changeList').innerHTML = CHANGE_LIST.map(c =>
    `<div class="change-item">
      <div class="change-ico ${c.dir}">${c.dir === 'up' ? '↑' : '↓'}</div>
      <div class="change-body">
        <div class="change-name">${c.name}</div>
        <div class="change-val">${c.val}</div>
      </div>
      <span class="change-pct ${c.dir}">${c.pct}</span>
    </div>`).join('');
}

/* 운영실적 테이블 */
function renderPerfTable() {
  const tbody = document.getElementById('perfTableBody');
  const stCls = { ok: 'pill--ok', warn: 'pill--warn', err: 'pill--err' };
  const stLbl = { ok: '정상', warn: '주의', err: '검증필요' };
  const barColor = p => p >= 80 ? '#1AAA5E' : p >= 60 ? '#0C8AE5' : '#ED8B16';
  const isUp = s => s.includes('↑');
  tbody.innerHTML = PERF_TABLE.map(d => {
    const m = MILES[d.mile];
    return `<tr class="perf-row" data-mile="${d.mile}">
      <td class="l">
        <div style="display:flex;align-items:center;gap:7px">
          <img src="${(window.GMSB_BASE||'../')}assets/img/mile-${d.mile}.svg" style="width:24px;height:24px;display:block;border-radius:50%;" alt="">
          ${m.name}
        </div>
      </td>
      <td class="l">${d.kpi}</td>
      <td class="num">${d.val}</td>
      <td class="num">${d.goal}</td>
      <td>
        <div class="prog">
          <div class="prog__track"><div class="prog__fill" style="width:${d.pct}%;background:${barColor(d.pct)}"></div></div>
          <span class="prog__pct">${d.pct}%</span>
        </div>
      </td>
      <td class="${isUp(d.mom) ? 'tbl-up' : 'tbl-down'}">${d.mom.replace(/[↑↓]/g, m => m === '↑' ? '▲' : '▼')}</td>
      <td><span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span></td>
      <td style="font:400 13px/1 var(--font-sans);color:var(--fg-3)">${d.upd}</td>
      <td><button class="row-go" data-mile="${d.mile}" type="button"><i data-lucide="chevron-right"></i></button></td>
    </tr>`;
  }).join('');
}

/* 운영 실적 추이 차트 */
function initPerfTrendChart() {
  const ctx = document.getElementById('chartPerfTrend').getContext('2d');
  const miles = ['energy', 'mobility', 'safety', 'data'];
  perfTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: TREND_LABELS_MONTH,
      datasets: miles.map(id => ({
        label: MILES[id].name,
        data: TREND_DATA[id],
        borderColor: MILES[id].color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: MILES[id].color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}점` } },
      },
      onClick: (event, elements, chart) => {
        if (!elements.length) return;
        const i = elements[0].index;
        const label = chart.data.labels[i];
        const vals = chart.data.datasets.map(ds => `${ds.label}: ${ds.data[i]}점`).join('\n');
        showChartPopup(label, vals, event.native);
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', maxRotation: 0 } },
        y: {
          grid: { color: '#F1F4F8' },
          ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '점' },
          min: 40, max: 100,
        },
      },
    },
  });
}

/* 이벤트 바인딩 */
function bindEvents() {
  // 스크림/닫기
  document.getElementById('scrim').addEventListener('click', closeDrawer);
  document.getElementById('dwClose').addEventListener('click', closeDrawer);

  // 마일 핵심 지표 클릭
  document.getElementById('mileKpiList').addEventListener('click', e => {
    const item = e.target.closest('[data-mile]');
    if (item) openDrawer(item.dataset.mile);
  });

  // 테이블 드로어
  document.getElementById('summaryTableBody').addEventListener('click', e => {
    const btn = e.target.closest('.row-go');
    const row = e.target.closest('.mile-row');
    if (btn) openDrawer(btn.dataset.mile);
    else if (row) openDrawer(row.dataset.mile);
  });
  document.getElementById('perfTableBody').addEventListener('click', e => {
    const btn = e.target.closest('.row-go');
    const row = e.target.closest('.perf-row');
    if (btn) openDrawer(btn.dataset.mile);
    else if (row) openDrawer(row.dataset.mile);
  });

  // 기간 단위 전환
  document.getElementById('periodUnit').addEventListener('change', e => {
    const isMonth = e.target.value === 'month';
    const labels = isMonth ? TREND_LABELS_MONTH : TREND_LABELS_QUARTER;
    const dataMap = isMonth ? TREND_DATA : TREND_DATA_Q;
    perfTrendChart.data.labels = labels;
    ['energy','mobility','safety','data'].forEach((id, i) => {
      perfTrendChart.data.datasets[i].data = dataMap[id];
    });
    perfTrendChart.update();
  });

  // 조회 / 초기화
  document.getElementById('btnPerfSearch').addEventListener('click', () => {
    renderPerfList();
    renderPerfTable();
    lucide.createIcons();
  });
  document.getElementById('btnPerfReset').addEventListener('click', () => {
    ['perfPeriod','perfMile','perfRegion','perfIndex'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
  });

  // CSV 내보내기
  document.getElementById('btnExportSummary').addEventListener('click', () => exportCSV(SUMMARY_TABLE));
  document.getElementById('btnExportPerf').addEventListener('click', () => exportCSV(PERF_TABLE, true));
  document.getElementById('btnPerfExport').addEventListener('click', () => exportCSV(PERF_TABLE, true));

  // 선택 마일 상세
  document.getElementById('btnSelDetail').addEventListener('click', () => openDrawer(activeMile));

  // 드로어 푸터
  document.getElementById('dwBtnExport').addEventListener('click', () => {
    exportCSV(PERF_TABLE.filter(d => activeMile === 'energy' ? d : true), true);
  });
  document.getElementById('dwBtnDrilldown').addEventListener('click', () => {
    showToast(`${MILES[activeMile].name} 상세 분석 페이지로 이동합니다.`);
  });
}

/* 드로어 열기 */
function openDrawer(mileId) {
  const m = MILES[mileId];
  const db = MILE_DB[mileId];
  if (!db) return;
  document.getElementById('dwTitle').textContent = m.name;
  var icoEl = document.getElementById('dwKindIco');
  if (icoEl) icoEl.src = (window.GMSB_BASE||'../') + 'assets/img/mile-' + mileId + '.svg';
  document.getElementById('dwDesc').textContent = db.desc;
  document.getElementById('dwBaseDl').innerHTML = db.base.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  document.getElementById('dwPerfDl').innerHTML = db.perf.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  if (dwChart) { dwChart.destroy(); dwChart = null; }
  const ctx = document.getElementById('dwChart').getContext('2d');
  dwChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1개월전','5개월전','4개월전','3개월전','2개월전','이번달'],
      datasets: [{ data: db.history, borderColor: m.color, backgroundColor: m.soft + '33',
        borderWidth: 2, pointRadius: 4, pointBackgroundColor: m.color, tension: 0.3, fill: true }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '점' } },
      },
    },
  });
  // 행정동별 현황
  const dongData = DONG_DB[mileId];
  const dongSec = document.getElementById('dwDongSec');
  const dongList = document.getElementById('dwDongList');
  if (dongData && dongSec && dongList) {
    dongSec.style.display = '';
    const maxScore = Math.max(...dongData.map(d => d.score));
    dongList.innerHTML = dongData.map(d =>
      `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font:500 13px/1 var(--font-sans);color:var(--fg-2);width:60px;flex:none;text-align:right">${d.dong}</span>
        <div style="flex:1;height:8px;background:var(--bg-sunken);border-radius:99px;overflow:hidden">
          <div style="width:${(d.score/maxScore*100).toFixed(0)}%;height:100%;background:${m.color};border-radius:99px"></div>
        </div>
        <span style="font:700 12px/1 var(--font-sans);color:var(--fg-1);width:30px;flex:none">${d.score}점</span>
        <span style="font:600 12px/1 var(--font-sans);width:36px;flex:none;color:${d.trend.startsWith('+') ? 'var(--status-success)' : 'var(--status-danger)'}">${d.trend}</span>
      </div>`).join('');
  }

  document.getElementById('scrim').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  lucide.createIcons();
}

function closeDrawer() {
  document.getElementById('scrim').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
}

function exportCSV(data, isPerf = false) {
  const header = isPerf
    ? ['마일','핵심지표','운영실적','목표','목표대비(%)','전월대비','상태','최근업데이트']
    : ['마일','핵심지표','현재값','전월대비','목표대비(%)','상태'];
  const rows = data.map(d => isPerf
    ? [MILES[d.mile].name, d.kpi, d.val, d.goal, d.pct, d.mom.replace(/[↑↓]/g, ''), d.status === 'ok' ? '정상' : '주의', d.upd]
    : [MILES[d.mile].name, d.kpi, d.val, d.mom, d.pct, d.status === 'ok' ? '정상' : '주의']);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `마일${isPerf ? '운영실적' : '종합분석'}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

/* ── 차트 클릭 팝업 ── */
function showChartPopup(label, content, event) {
  let panel = document.getElementById('maChartPopup');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'maChartPopup';
    Object.assign(panel.style, {
      position: 'fixed', background: 'var(--surface-card)', border: '1px solid var(--border-1)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--elev-3)', padding: '12px 16px',
      zIndex: '300', maxWidth: '260px', pointerEvents: 'auto', display: 'none',
    });
    document.body.appendChild(panel);
    document.addEventListener('click', e => {
      if (!e.target.closest('#maChartPopup') && !e.target.closest('canvas')) {
        panel.style.display = 'none';
      }
    }, { passive: true });
  }
  panel.innerHTML = `<div style="font:700 13px/1 var(--font-sans);color:var(--fg-1);margin-bottom:8px">${label}</div>
    <div style="font:400 12px/1.6 var(--font-sans);color:var(--fg-2);white-space:pre-line">${content}</div>`;
  panel.style.display = 'block';
  const x = Math.min(event.clientX + 12, window.innerWidth - 280);
  const y = Math.max(event.clientY - 40, 10);
  panel.style.left = x + 'px';
  panel.style.top = y + 'px';
}

/* ── 토스트 ── */
function showToast(msg) {
  let t = document.getElementById('maToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'maToast';
    Object.assign(t.style, { position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', background:'var(--fg-1)', color:'#fff', padding:'10px 20px', borderRadius:'var(--radius-pill)', font:'500 14px/1 var(--font-sans)', zIndex:'600', pointerEvents:'none', transition:'opacity .2s', opacity:'0' });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}
