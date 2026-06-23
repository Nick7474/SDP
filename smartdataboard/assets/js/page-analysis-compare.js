/* =====================================================================
   광명 스마트데이터보드 · 데이터 비교 분석
   ===================================================================== */

const REGIONS = ['광명동','철산동','하안동','소하동','일직동'];

const REGION_TABLE = [
  { region: '일직동', carbon: 1210, reduction: 960,  energy: 2450, drt: 1320, air: 28, status: 'ok' },
  { region: '소하동', carbon: 1540, reduction: 1180, energy: 2980, drt: 1860, air: 32, status: 'ok' },
  { region: '하안동', carbon: 2450, reduction: 1350, energy: 4320, drt: 1640, air: 58, status: 'review' },
  { region: '철산동', carbon: 1880, reduction: 1120, energy: 3610, drt: 1580, air: 36, status: 'ok' },
  { region: '광명동', carbon: 1670, reduction: 1050, energy: 2950, drt: 1470, air: 31, status: 'ok' },
];

const DRT_RANK = [
  { rank: 1, name: '하안동', count: 1640, max: 1860 },
  { rank: 2, name: '소하동', count: 1860, max: 1860 },
  { rank: 3, name: '일직동', count: 1320, max: 1860 },
  { rank: 4, name: '광명동', count: 1470, max: 1860 },
  { rank: 5, name: '철산동', count: 1580, max: 1860 },
];

const PERIOD_TABLE = [
  { period: '2026.01', a: 1820, aRate: null,   b: 2340, bRate: null,   c: 980,  cRate: null,   d: 420, dRate: null },
  { period: '2026.02', a: 1950, aRate: '+7.1%', b: 2180, bRate: '-6.8%', c: 1020, cRate: '+4.1%', d: 440, dRate: '+4.8%' },
  { period: '2026.03', a: 2100, aRate: '+7.7%', b: 2520, bRate: '+15.6%', c: 1150, cRate: '+12.7%', d: 398, dRate: '-9.5%' },
  { period: '2026.04', a: 2340, aRate: '+11.4%', b: 2680, bRate: '+6.3%', c: 1080, cRate: '-6.1%', d: 465, dRate: '+16.8%' },
  { period: '2026.05', a: 2180, aRate: '-6.8%', b: 2450, bRate: '-8.6%', c: 1240, cRate: '+14.8%', d: 512, dRate: '+10.1%' },
];

const MILE_TABLE = [
  { mile: '에너지 마일',   a: 82, b: 75, c: 68, d: 71, best: 'A', diff: 14 },
  { mile: '모빌리티 마일', a: 74, b: 78, c: 82, d: 69, best: 'C', diff: 13 },
  { mile: '세이프티 마일', a: 69, b: 71, c: 74, d: 80, best: 'D', diff: 11 },
  { mile: '데이터 마일',   a: 63, b: 67, c: 58, d: 72, best: 'D', diff: 14 },
];

const DS_COLORS = ['#0C8AE5','#1AAA5E','#ED8B16','#6E74D6'];

let dwChart = null;
const condHistory = [];

/* ── 부트 ── */
function boot() {
  initTabRegion();
  initTabPeriod();
  initTabMile();
  initTabCorr();
  bindTabs();
  bindEvents();
  lucide.createIcons();
}
document.addEventListener('gmsb:shell-ready', boot, { once: true });

/* ── Tab1: 지역별 비교 ── */
function initTabRegion() {
  initRegionCompare();
  initMonthlyTrend();
  initScatter();
  initRatioBar();
  renderDrtRank();
  renderRegionTable();
}

function initRegionCompare() {
  const ctx = document.getElementById('chartRegionCompare').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: REGIONS,
      datasets: [
        { label: '탄소배출(tCO₂)',  data: [1210,1540,2450,1880,1670], backgroundColor: DS_COLORS[0], borderRadius: 3 },
        { label: '탄소저감(tCO₂)',  data: [960, 1180,1350,1120,1050], backgroundColor: DS_COLORS[1], borderRadius: 3 },
        { label: '에너지(MWh/10)',  data: [245, 298, 432, 361, 295],  backgroundColor: DS_COLORS[2], borderRadius: 3 },
        { label: 'DRT 운영(건/10)', data: [132, 186, 164, 158, 147],  backgroundColor: DS_COLORS[3], borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
      },
    },
  });
}

function initMonthlyTrend() {
  const ctx = document.getElementById('chartMonthlyTrend').getContext('2d');
  const labels = ['2026.01','2026.02','2026.03','2026.04','2026.05'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '탄소배출(tCO₂)', data: [1480,1510,1620,1700,1680], borderColor: DS_COLORS[0], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: '탄소저감(tCO₂)', data: [1050,1080,1140,1200,1132], borderColor: DS_COLORS[1], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: '에너지(MWh/10)', data: [295, 310, 340, 368, 355],  borderColor: DS_COLORS[2], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: 'DRT 운영(건/10)',data: [148, 155, 162, 172, 166],  borderColor: DS_COLORS[3], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
      },
    },
  });
}

function initScatter() {
  const ctx = document.getElementById('chartScatter').getContext('2d');
  const pts = REGION_TABLE.map((r, i) => ({ x: r.energy / 10, y: r.carbon, label: r.region }));
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: '지역별',
          data: pts.map(p => ({ x: p.x, y: p.y })),
          backgroundColor: DS_COLORS,
          pointRadius: 8,
          pointHoverRadius: 10,
        },
        {
          label: '추세선',
          data: [{ x: 240, y: 1150 }, { x: 440, y: 2550 }],
          type: 'line',
          borderColor: '#AEB7C2',
          borderDash: [6, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => {
              if (c.datasetIndex === 1) return null;
              const r = REGION_TABLE[c.dataIndex];
              return `${r.region}: 에너지 ${r.energy} MWh / 탄소 ${r.carbon} tCO₂`;
            },
          },
        },
      },
      scales: {
        x: { title: { display: true, text: '에너지 사용량 (MWh/10)', font: { size: 11 }, color: '#7A8699' }, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { title: { display: true, text: '탄소배출량 (tCO₂)', font: { size: 11 }, color: '#7A8699' }, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() } },
      },
    },
  });
}

function initRatioBar() {
  const ctx = document.getElementById('chartRatioBar').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: REGIONS,
      datasets: [
        { label: '탄소배출', data: [32,30,29,31,31], backgroundColor: DS_COLORS[0] },
        { label: '탄소저감', data: [24,23,22,21,23], backgroundColor: DS_COLORS[1] },
        { label: '에너지',   data: [30,31,33,32,31], backgroundColor: DS_COLORS[2] },
        { label: 'DRT',      data: [14,16,16,16,15], backgroundColor: DS_COLORS[3] },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { stacked: true, max: 100, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '%' } },
      },
    },
  });
}

function renderDrtRank() {
  const max = 1860;
  document.getElementById('drtRankList').innerHTML = DRT_RANK.map(d =>
    `<div class="ac-rank-item">
      <span class="ac-rank-no">${d.rank}</span>
      <span class="ac-rank-name">${d.name}</span>
      <div class="ac-rank-track"><div class="ac-rank-fill" style="width:${(d.count/max*100).toFixed(1)}%"></div></div>
      <span class="ac-rank-val">${d.count.toLocaleString()}</span>
    </div>`).join('');
}

function renderRegionTable() {
  const statusMap = { ok: ['pill--ok','정상'], review: ['pill--warn','개선 필요'] };
  document.getElementById('regionTableBody').innerHTML = REGION_TABLE.map(r =>
    `<tr data-region="${r.region}" class="region-row">
      <td class="l">${r.region}</td>
      <td class="num">${r.carbon.toLocaleString()}</td>
      <td class="num">${r.reduction.toLocaleString()}</td>
      <td class="num">${r.energy.toLocaleString()}</td>
      <td class="num">${r.drt.toLocaleString()}</td>
      <td class="num">${r.air}</td>
      <td><span class="pill ${statusMap[r.status][0]}">${statusMap[r.status][1]}</span></td>
      <td><button class="tbtn" data-region="${r.region}">보기</button></td>
    </tr>`).join('');
}

/* ── Tab2: 기간별 비교 ── */
function initTabPeriod() {
  const labels = PERIOD_TABLE.map(r => r.period);
  const ctx1 = document.getElementById('chartPeriodTrend').getContext('2d');
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '데이터셋 A', data: PERIOD_TABLE.map(r => r.a), borderColor: DS_COLORS[0], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: '데이터셋 B', data: PERIOD_TABLE.map(r => r.b), borderColor: DS_COLORS[1], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: '데이터셋 C', data: PERIOD_TABLE.map(r => r.c), borderColor: DS_COLORS[2], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
        { label: '데이터셋 D', data: PERIOD_TABLE.map(r => r.d), borderColor: DS_COLORS[3], borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false },
      ],
    },
    options: lineOpts(),
  });

  const ctx2 = document.getElementById('chartPeriodRate').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: '데이터셋 A', data: [null, 7.1, 7.7, 11.4, -6.8], backgroundColor: DS_COLORS[0], borderRadius: 4 },
        { label: '데이터셋 B', data: [null, -6.8, 15.6, 6.3, -8.6], backgroundColor: DS_COLORS[1], borderRadius: 4 },
        { label: '데이터셋 C', data: [null, 4.1, 12.7, -6.1, 14.8], backgroundColor: DS_COLORS[2], borderRadius: 4 },
        { label: '데이터셋 D', data: [null, 4.8, -9.5, 16.8, 10.1], backgroundColor: DS_COLORS[3], borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '%' } },
      },
    },
  });

  const rateClass = v => !v ? '' : (v.startsWith('+') ? 'tbl-up' : 'tbl-down');
  document.getElementById('periodTableBody').innerHTML = PERIOD_TABLE.map(r =>
    `<tr>
      <td>${r.period}</td>
      <td class="num">${r.a.toLocaleString()}</td><td class="${rateClass(r.aRate)}">${r.aRate||'—'}</td>
      <td class="num">${r.b.toLocaleString()}</td><td class="${rateClass(r.bRate)}">${r.bRate||'—'}</td>
      <td class="num">${r.c.toLocaleString()}</td><td class="${rateClass(r.cRate)}">${r.cRate||'—'}</td>
      <td class="num">${r.d.toLocaleString()}</td><td class="${rateClass(r.dRate)}">${r.dRate||'—'}</td>
    </tr>`).join('');
}

/* ── Tab3: 마일별 비교 ── */
function initTabMile() {
  const mileLabels = ['에너지 마일','모빌리티 마일','세이프티 마일','데이터 마일'];

  const ctx1 = document.getElementById('chartMileRadar').getContext('2d');
  new Chart(ctx1, {
    type: 'radar',
    data: {
      labels: mileLabels,
      datasets: [
        { label: '데이터셋 A', data: [82,74,69,63], borderColor: DS_COLORS[0], backgroundColor: DS_COLORS[0]+'30', borderWidth: 2, pointRadius: 4 },
        { label: '데이터셋 B', data: [75,78,71,67], borderColor: DS_COLORS[1], backgroundColor: DS_COLORS[1]+'20', borderWidth: 2, pointRadius: 4 },
        { label: '데이터셋 C', data: [68,82,74,58], borderColor: DS_COLORS[2], backgroundColor: DS_COLORS[2]+'20', borderWidth: 2, pointRadius: 4 },
        { label: '데이터셋 D', data: [71,69,80,72], borderColor: DS_COLORS[3], backgroundColor: DS_COLORS[3]+'20', borderWidth: 2, pointRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
      scales: { r: { min: 40, max: 100, ticks: { font: { size: 10 }, color: '#7A8699', stepSize: 20 }, grid: { color: '#E4E9F1' }, pointLabels: { font: { size: 12 }, color: '#36445A' } } },
    },
  });

  const ctx2 = document.getElementById('chartMileBar').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: mileLabels,
      datasets: [
        { label: '데이터셋 A', data: [82,74,69,63], backgroundColor: DS_COLORS[0], borderRadius: 4 },
        { label: '데이터셋 B', data: [75,78,71,67], backgroundColor: DS_COLORS[1], borderRadius: 4 },
        { label: '데이터셋 C', data: [68,82,74,58], backgroundColor: DS_COLORS[2], borderRadius: 4 },
        { label: '데이터셋 D', data: [71,69,80,72], backgroundColor: DS_COLORS[3], borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, min: 0, max: 100, ticks: { font: { size: 11 }, color: '#7A8699' } },
      },
    },
  });

  const bestCls = (b, ds) => b === ds ? 'tbl-up' : '';
  document.getElementById('mileTableBody').innerHTML = MILE_TABLE.map(r =>
    `<tr>
      <td class="l">${r.mile}</td>
      <td class="num ${bestCls(r.best,'A')}">${r.a}</td>
      <td class="num ${bestCls(r.best,'B')}">${r.b}</td>
      <td class="num ${bestCls(r.best,'C')}">${r.c}</td>
      <td class="num ${bestCls(r.best,'D')}">${r.d}</td>
      <td><span style="color:var(--gp-point);font-weight:700">데이터셋 ${r.best}</span></td>
      <td class="num">${r.diff}</td>
      <td>—</td>
    </tr>`).join('');
}

/* ── Tab4: 상관 분석 ── */
function initTabCorr() {
  const corrPts = [
    { x: 245, y: 1210, label: '일직동' },
    { x: 298, y: 1540, label: '소하동' },
    { x: 432, y: 2450, label: '하안동' },
    { x: 361, y: 1880, label: '철산동' },
    { x: 295, y: 1670, label: '광명동' },
  ];

  const ctx1 = document.getElementById('chartCorrScatter').getContext('2d');
  new Chart(ctx1, {
    type: 'scatter',
    data: {
      datasets: [
        { label: '지역', data: corrPts.map(p => ({ x: p.x, y: p.y })), backgroundColor: DS_COLORS, pointRadius: 9, pointHoverRadius: 11 },
        { label: '추세선', type: 'line', data: [{ x: 220, y: 1100 }, { x: 450, y: 2600 }], borderColor: '#AEB7C2', borderDash: [6,4], borderWidth: 1.5, pointRadius: 0, fill: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => { if (c.datasetIndex === 1) return null; const p = corrPts[c.dataIndex]; return `${p.label}: (${p.x}, ${p.y})`; } } },
      },
      scales: {
        x: { title: { display: true, text: '에너지 사용량 (MWh/10)', font: { size: 11 }, color: '#7A8699' }, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { title: { display: true, text: '탄소배출량 (tCO₂)', font: { size: 11 }, color: '#7A8699' }, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() } },
      },
    },
  });

  /* 상관계수 매트릭스 */
  const dsNames = ['탄소배출', '탄소저감', '에너지', 'DRT'];
  const corrVals = [
    [1.00, 0.82, 0.87, 0.54],
    [0.82, 1.00, 0.76, 0.61],
    [0.87, 0.76, 1.00, 0.48],
    [0.54, 0.61, 0.48, 1.00],
  ];
  const colorScale = v => {
    if (v >= 0.8) return '#0A3D7A';
    if (v >= 0.6) return '#1D6BB5';
    if (v >= 0.4) return '#5BAAE0';
    return '#C3DFF5';
  };
  let table = '<table style="border-collapse:collapse;width:100%;font:600 12px/1 var(--font-sans);">';
  table += '<tr><th style="padding:8px;color:var(--fg-4);"></th>';
  dsNames.forEach(n => { table += `<th style="padding:8px;text-align:center;color:var(--fg-3)">${n}</th>`; });
  table += '</tr>';
  corrVals.forEach((row, i) => {
    table += `<tr><th style="padding:8px;text-align:right;color:var(--fg-3)">${dsNames[i]}</th>`;
    row.forEach(v => {
      const bg = colorScale(Math.abs(v));
      table += `<td style="padding:8px;text-align:center;background:${bg};color:#fff;border-radius:4px;">${v.toFixed(2)}</td>`;
    });
    table += '</tr>';
  });
  table += '</table>';
  document.getElementById('corrMatrix').innerHTML = table;
  renderCorrLegend();
}

/* ── 공통 라인 옵션 ── */
function lineOpts() {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, color: '#7A8699', boxWidth: 10, boxHeight: 10, padding: 10 } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
      y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: false },
    },
  };
}

/* ── 탭 전환 ── */
const TAB_META = {
  region: { label: '지역별 비교', desc: '광명시 권역별 주요 지표를 비교 분석합니다.' },
  period: { label: '기간별 비교', desc: '선택한 기간 동안의 지표 변화를 비교합니다.' },
  mile:   { label: '마일별 비교', desc: '4대 마일(에너지·모빌리티·세이프티·데이터) 지표를 비교합니다.' },
  corr:   { label: '상관 분석',   desc: '주요 지표 간 상관관계를 분석합니다.' }
};

function bindTabs() {
  document.querySelectorAll('.page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('on'));
      document.querySelectorAll('.ac-pane').forEach(p => p.classList.remove('on'));
      tab.classList.add('on');
      document.getElementById('pane-' + tab.dataset.tab).classList.add('on');
    });
  });
}

/* ── 이벤트 ── */
function bindEvents() {
  /* 지역 테이블 보기 버튼 */
  document.getElementById('regionTableBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-region]');
    if (btn) openDrawer(btn.dataset.region);
  });

  /* 스크림 / 닫기 */
  document.getElementById('scrim').addEventListener('click', closeDrawer);
  document.getElementById('dwClose').addEventListener('click', closeDrawer);

  /* 분석 실행 */
  document.getElementById('btnAnalyze').addEventListener('click', () => showToast('분석이 실행되었습니다.'));

  /* 초기화 */
  document.getElementById('btnAcReset').addEventListener('click', () => {
    document.getElementById('dsA').selectedIndex = 0;
    document.getElementById('dsB').selectedIndex = 0;
    document.getElementById('dsC').selectedIndex = 0;
    document.getElementById('dsD').selectedIndex = 0;
    document.getElementById('acRegion').selectedIndex = 0;
    document.getElementById('acBasis').selectedIndex = 0;
    showToast('필터가 초기화되었습니다.');
  });

  /* CSV 내보내기 */
  document.getElementById('btnAcExport').addEventListener('click', () => exportRegionCSV());
  document.getElementById('btnRegionExport').addEventListener('click', () => exportRegionCSV());

  /* 기간별 CSV */
  document.getElementById('btnPeriodExport').addEventListener('click', () => showToast('기간별 비교 결과를 CSV로 내보냈습니다.'));
  document.getElementById('btnMileExport').addEventListener('click', () => showToast('마일별 비교 결과를 CSV로 내보냈습니다.'));

  /* 상관 분석 X/Y 변경 */
  document.getElementById('corrX').addEventListener('change', updateCorrCoef);
  document.getElementById('corrY').addEventListener('change', updateCorrCoef);

  /* 조건 저장 */
  document.getElementById('btnSaveCond').addEventListener('click', saveCondition);

  /* 이력 패널 토글 */
  document.getElementById('btnCondHistory').addEventListener('click', e => {
    e.stopPropagation();
    const panel = document.getElementById('histPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', () => {
    const panel = document.getElementById('histPanel');
    if (panel) panel.style.display = 'none';
  });

  /* 보고서 생성 */
  document.getElementById('btnReport').addEventListener('click', () => {
    showToast('보고서를 생성 중입니다...');
    setTimeout(() => window.print(), 500);
  });

  /* 데이터 공유 */
  document.getElementById('btnShare').addEventListener('click', () => {
    const region = document.getElementById('dwTitle').textContent;
    const url = `${location.href.split('#')[0]}#region-${encodeURIComponent(region)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('공유 링크가 복사되었습니다.'));
    } else {
      showToast('공유 링크가 생성되었습니다.');
    }
  });

  /* 새로고침 */
  document.getElementById('btnRefresh').addEventListener('click', () => showToast('데이터가 갱신되었습니다.'));
}

/* ── 조건 저장 / 이력 ── */
function saveCondition() {
  const getLabel = id => {
    const el = document.getElementById(id);
    return el ? el.options[el.selectedIndex].text : '';
  };
  const entry = {
    ts: new Date().toLocaleString('ko-KR', { hour12: false }),
    dsA: getLabel('dsA').replace(' 데이터', ''),
    dsB: getLabel('dsB').replace(' 데이터', ''),
    region: getLabel('acRegion'),
    from: document.getElementById('dateFrom').value,
    to: document.getElementById('dateTo').value,
  };
  condHistory.unshift(entry);
  if (condHistory.length > 5) condHistory.pop();
  updateHistoryPanel();
  showToast('분석 조건이 저장되었습니다.');
}

function updateHistoryPanel() {
  const list = document.getElementById('histList');
  const badge = document.getElementById('histBadge');
  if (!list) return;
  if (badge) {
    badge.textContent = condHistory.length;
    badge.style.display = condHistory.length ? 'inline-flex' : 'none';
  }
  if (!condHistory.length) {
    list.innerHTML = '<p style="font:400 13px/1 var(--font-sans);color:var(--fg-4);padding:16px;text-align:center">저장된 이력이 없습니다.</p>';
    return;
  }
  list.innerHTML = condHistory.map((e, i) =>
    `<div class="ac-hist-item" data-hist="${i}">
      <span class="ac-hist-item__ts">${e.ts}</span>
      <span class="ac-hist-item__desc">${e.region} · ${e.dsA} vs ${e.dsB} (${e.from} ~ ${e.to})</span>
    </div>`).join('');
  list.querySelectorAll('.ac-hist-item').forEach(item => {
    item.addEventListener('click', () => {
      const e = condHistory[+item.dataset.hist];
      showToast(`조건 복원: ${e.region} · ${e.dsA} vs ${e.dsB}`);
      document.getElementById('histPanel').style.display = 'none';
    });
  });
}

/* ── 상관계수 범례 ── */
function renderCorrLegend() {
  const el = document.getElementById('corrMatrixLegend');
  if (!el) return;
  el.innerHTML = `
    <span class="ac-corr-legend__title">상관 강도</span>
    <div class="ac-corr-legend__items">
      <div class="ac-corr-legend__item"><span class="ac-corr-legend__dot" style="background:#0A3D7A"></span>매우 강함 (r ≥ 0.8)</div>
      <div class="ac-corr-legend__item"><span class="ac-corr-legend__dot" style="background:#1D6BB5"></span>강함 (0.6 ≤ r &lt; 0.8)</div>
      <div class="ac-corr-legend__item"><span class="ac-corr-legend__dot" style="background:#5BAAE0"></span>보통 (0.4 ≤ r &lt; 0.6)</div>
      <div class="ac-corr-legend__item"><span class="ac-corr-legend__dot" style="background:#C3DFF5;outline:1px solid var(--border-1)"></span>약함 (r &lt; 0.4)</div>
    </div>
  `;
}

function updateCorrCoef() {
  const vals = { energy: 0, carbon: 1, drt: 2, air: 3 };
  const corrTable = [[1.00,0.87,0.54,0.42],[0.87,1.00,0.61,0.55],[0.54,0.61,1.00,0.38],[0.42,0.55,0.38,1.00]];
  const xi = vals[document.getElementById('corrX').value];
  const yi = vals[document.getElementById('corrY').value];
  document.getElementById('corrCoef').textContent = `r = ${corrTable[xi][yi].toFixed(2)}`;
}

function exportRegionCSV() {
  const header = ['지역','탄소배출량(tCO₂)','탄소저감량(tCO₂)','에너지사용량(MWh)','DRT운영(건)','미세먼지지수','분석결과'];
  const rows = REGION_TABLE.map(r => [r.region, r.carbon, r.reduction, r.energy, r.drt, r.air, r.status === 'ok' ? '정상' : '개선 필요']);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '비교분석결과_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

/* ── 드로어 ── */
function openDrawer(regionName) {
  const r = REGION_TABLE.find(x => x.region === regionName);
  if (!r) return;
  document.getElementById('dwTitle').textContent = regionName;
  document.getElementById('dwDesc').textContent = `${regionName}의 데이터셋 비교 분석 결과입니다.`;
  document.getElementById('dwStatDl').innerHTML = [
    ['탄소배출량', r.carbon.toLocaleString() + ' tCO₂'],
    ['탄소저감량', r.reduction.toLocaleString() + ' tCO₂'],
    ['에너지 사용량', r.energy.toLocaleString() + ' MWh'],
    ['DRT 운영', r.drt.toLocaleString() + '건'],
    ['미세먼지 지수', r.air + ' PM2.5'],
    ['분석 결과', r.status === 'ok' ? '정상' : '개선 필요'],
  ].map(([dt, dd]) => `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');

  if (dwChart) { dwChart.destroy(); dwChart = null; }
  const ctx = document.getElementById('dwChart').getContext('2d');
  dwChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['탄소배출', '탄소저감', '에너지/10', 'DRT/10'],
      datasets: [{ data: [r.carbon, r.reduction, Math.round(r.energy/10), Math.round(r.drt/10)], backgroundColor: DS_COLORS, borderRadius: 4 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } }, y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699' }, beginAtZero: true } } },
  });

  document.getElementById('scrim').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  lucide.createIcons();
}

function closeDrawer() {
  document.getElementById('scrim').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1A2942;color:#fff;padding:12px 24px;border-radius:10px;font:500 14px/1 var(--font-sans);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
