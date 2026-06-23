/* =====================================================================
   광명 스마트데이터보드 · 분석 대시보드
   ===================================================================== */

/* ── 데이터 ── */
const PERF_MONTHLY = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  data: [1020, 1180, 1320, 1610, 1540, 1780, 1920, 2110, 1980, 1760, 1580, 1452],
};
const PERF_QUARTERLY = {
  labels: ['1분기','2분기','3분기','4분기'],
  data: [3520, 4930, 5810, 4792],
};

const MILE_DATA = {
  labels: ['에너지', '모빌리티', '세이프티', '데이터'],
  direct: [6120, 4250, 2980, 1884],
  indirect: [3800, 2600, 2100, 1500],
  colors: ['#0C8AE5','#1AAA5E','#ED8B16','#6E74D6'],
};

const SECTOR_DONUT = [
  { name: '탄소중립', pct: 35.4, color: '#0C8AE5' },
  { name: '에너지',   pct: 28.7, color: '#1AAA5E' },
  { name: '모빌리티', pct: 19.6, color: '#ED8B16' },
  { name: '세이프티', pct: 9.8,  color: '#6E74D6' },
  { name: '데이터',   pct: 6.5,  color: '#AEB7C2' },
];

const REGION_DATA = {
  labels: ['광명동','철산동','하안동','소하동','일직동'],
  direct:   [2650, 1850, 2450, 1680, 1420],
  indirect: [1850, 1520, 1350, 980, 830],
};

const DATA_TREND = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  count:  [1820, 1950, 2100, 2340, 2180, 2580, 2720, 2900, 2760, 2540, 2320, 2120],
  rate:   [null, 7.1, 7.7, 11.4, -6.8, 18.3, 5.4, 6.6, -4.8, -8.0, -8.7, -8.6],
};

const VIZ_TYPES = [
  { name: 'Line',    count: 2854, color: '#0C8AE5' },
  { name: 'Bar',     count: 2312, color: '#1AAA5E' },
  { name: 'Map',     count: 1856, color: '#ED8B16' },
  { name: 'Heatmap', count: 1132, color: '#6E74D6' },
  { name: 'Donut',   count: 942,  color: '#AEB7C2' },
  { name: 'Report',  count: 681,  color: '#7C8896' },
];

const GOAL_DATA = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  actual: [1020, 1180, 1320, 1610, 1540, 1780, null, null, null, null, null, null],
  goal:   [1100, 1200, 1350, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2500],
  rate:   [92.7, 98.3, 97.8, 107.3, 96.3, 104.7, null, null, null, null, null, null],
};

const SECTOR_TREND = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  energy:   [400, 430, 480, 550, 520, 600, 640, 700, 660, 610, 580, 540],
  mobility: [280, 310, 340, 400, 380, 450, 480, 510, 490, 460, 430, 410],
  safety:   [180, 200, 220, 260, 240, 290, 310, 330, 315, 295, 278, 260],
  data:     [100, 115, 130, 160, 145, 175, 190, 210, 200, 188, 175, 163],
  etc:      [60, 125, 150, 240, 255, 265, 300, 360, 315, 207, 117, 79],
};

const REFRESH_DATA = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  ok:    [5960, 5340, 5490, 5880, 5740, 5910, 5900, 5760, 5800, 5660, 5550, 5480],
  delay: [320,  480,  390,  280,  350,  300,  260,  380,  290,  340,  410,  360],
  err:   [120,  80,   60,   40,   110,  90,   40,   60,   110,  100,  90,   60],
};

/* 차트 인스턴스 */
let chartPerf = null;

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ad-card__chart, .ad-mile-chart, .ad-donut-box').forEach(el => {
    const skel = document.createElement('div');
    skel.className = 'ad-skel-overlay';
    el.appendChild(skel);
  });

  setTimeout(() => {
    document.querySelectorAll('.ad-skel-overlay').forEach(el => el.remove());
    initPerfChart('month');
    initMileChart();
    initSectorDonut();
    initRegionChart();
    initDataTrendChart();
    renderVizTypes();
    initGoalChart();
    initSectorTrendChart();
    initRefreshChart();
    bindEvents();
    lucide.createIcons();
  }, 350);
});

/* ── 성과 분석 차트 (기간 전환 가능) ── */
function initPerfChart(unit) {
  const src = unit === 'quarter' ? PERF_QUARTERLY : PERF_MONTHLY;
  const ctx = document.getElementById('chartPerf').getContext('2d');
  if (chartPerf) { chartPerf.destroy(); chartPerf = null; }
  chartPerf = new Chart(ctx, {
    type: 'line',
    data: {
      labels: src.labels,
      datasets: [{
        label: '탄소저감량',
        data: src.data,
        borderColor: '#0C8AE5',
        backgroundColor: 'rgba(12,138,229,.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#0C8AE5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.3,
      }],
    },
    options: chartOpts({ suffix: ' tCO₂', yLabel: 'tCO₂' }),
  });
}

/* ── 마일별 기여도 (그룹 막대) ── */
function initMileChart() {
  const ctx = document.getElementById('chartMile').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MILE_DATA.labels,
      datasets: [
        { label: '직접 감축', data: MILE_DATA.direct,   backgroundColor: MILE_DATA.colors, borderRadius: 4 },
        { label: '간접 감축', data: MILE_DATA.indirect, backgroundColor: MILE_DATA.colors.map(c => c + '80'), borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y.toLocaleString()} tCO₂` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
      },
    },
  });
}

/* ── 분야별 데이터 비중 도넛 ── */
function initSectorDonut() {
  const ctx = document.getElementById('chartSectorDonut').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: SECTOR_DONUT.map(d => d.name),
      datasets: [{ data: SECTOR_DONUT.map(d => d.pct), backgroundColor: SECTOR_DONUT.map(d => d.color), borderWidth: 0, hoverOffset: 4 }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false } } },
  });
  document.getElementById('sectorLegend').innerHTML = SECTOR_DONUT.map(d =>
    `<div class="ad-legend-item">
      <span class="ad-legend-dot" style="background:${d.color}"></span>
      <span class="ad-legend-name">${d.name}</span>
      <span class="ad-legend-pct">${d.pct}%</span>
    </div>`).join('');
}

/* ── 지역별 탄소저감 현황 (그룹 막대) ── */
function initRegionChart() {
  const ctx = document.getElementById('chartRegion').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: REGION_DATA.labels,
      datasets: [
        { label: '직접 감축', data: REGION_DATA.direct,   backgroundColor: '#0C8AE5', borderRadius: 4 },
        { label: '간접 감축', data: REGION_DATA.indirect, backgroundColor: '#A0D5F8', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y.toLocaleString()} tCO₂` } } },
      scales: {
        x: { stacked: false, grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
      },
    },
  });
}

/* ── 월별 분석 데이터 추이 (이중축) ── */
function initDataTrendChart() {
  const ctx = document.getElementById('chartDataTrend').getContext('2d');
  new Chart(ctx, {
    data: {
      labels: DATA_TREND.labels,
      datasets: [
        { type: 'bar',  label: '데이터 수', data: DATA_TREND.count, backgroundColor: '#0C8AE5', borderRadius: 4, yAxisID: 'y', order: 2 },
        { type: 'line', label: '증가율(%)', data: DATA_TREND.rate,  borderColor: '#1AAA5E', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#1AAA5E', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.3, yAxisID: 'y1', order: 1, spanGaps: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y:  { position: 'left',  grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { size: 11 }, color: '#1AAA5E', callback: v => v + '%' } },
      },
    },
  });
}

/* ── 시각화 유형별 수평 막대 ── */
function renderVizTypes() {
  const max = VIZ_TYPES[0].count;
  document.getElementById('vizTypeList').innerHTML = VIZ_TYPES.map(d =>
    `<div class="ad-hbar-item">
      <span class="ad-hbar-name">${d.name}</span>
      <div class="ad-hbar-track">
        <div class="ad-hbar-fill" style="width:${(d.count/max*100).toFixed(1)}%;background:${d.color}"></div>
      </div>
      <span class="ad-hbar-val">${d.count.toLocaleString()}</span>
    </div>`).join('');
}

/* ── 탄소저감량 vs 목표 ── */
function initGoalChart() {
  const ctx = document.getElementById('chartGoal').getContext('2d');
  new Chart(ctx, {
    data: {
      labels: GOAL_DATA.labels,
      datasets: [
        { type: 'bar',  label: '실적',        data: GOAL_DATA.actual, backgroundColor: '#0C8AE5', borderRadius: 4, yAxisID: 'y', order: 3 },
        { type: 'line', label: '목표',         data: GOAL_DATA.goal,   borderColor: '#6E74D6', borderDash: [6,4], borderWidth: 2, pointRadius: 0, yAxisID: 'y', order: 2, fill: false },
        { type: 'line', label: '목표 대비(%)', data: GOAL_DATA.rate,   borderColor: '#1AAA5E', borderDash: [4,3], borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#1AAA5E', yAxisID: 'y1', order: 1, fill: false, spanGaps: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y:  { position: 'left',  grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { size: 11 }, color: '#1AAA5E', callback: v => v + '%' } },
      },
    },
  });
}

/* ── 분야별 월별 추이 (멀티라인) ── */
function initSectorTrendChart() {
  const ctx = document.getElementById('chartSectorTrend').getContext('2d');
  const datasets = [
    { label: '에너지',   data: SECTOR_TREND.energy,   borderColor: '#0C8AE5', backgroundColor: 'transparent' },
    { label: '모빌리티', data: SECTOR_TREND.mobility,  borderColor: '#1AAA5E', backgroundColor: 'transparent' },
    { label: '세이프티', data: SECTOR_TREND.safety,    borderColor: '#ED8B16', backgroundColor: 'transparent' },
    { label: '데이터',   data: SECTOR_TREND.data,      borderColor: '#6E74D6', backgroundColor: 'transparent' },
    { label: '기타',     data: SECTOR_TREND.etc,       borderColor: '#AEB7C2', backgroundColor: 'transparent' },
  ].map(d => ({ ...d, borderWidth: 2, pointRadius: 3, tension: 0.3, fill: false }));

  new Chart(ctx, {
    type: 'line',
    data: { labels: SECTOR_TREND.labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
      },
    },
  });
}

/* ── 데이터 갱신 현황 (누적 막대) ── */
function initRefreshChart() {
  const ctx = document.getElementById('chartRefresh').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: REFRESH_DATA.labels,
      datasets: [
        { label: '정상',     data: REFRESH_DATA.ok,    backgroundColor: '#1AAA5E', borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 } },
        { label: '갱신 지연', data: REFRESH_DATA.delay, backgroundColor: '#ED8B16' },
        { label: '연결 오류', data: REFRESH_DATA.err,   backgroundColor: '#E0483D', borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 } },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y.toLocaleString()}건` } } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { stacked: true, grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() } },
      },
    },
  });
}

/* ── 공통 차트 옵션 ── */
function chartOpts({ suffix = '', yLabel = '' } = {}) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y != null ? c.parsed.y.toLocaleString() : '-'}${suffix}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
      y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() }, beginAtZero: true },
    },
  };
}

/* ── 이벤트 바인딩 ── */
function bindEvents() {
  /* 기간 토글 */
  document.getElementById('periodToggle').addEventListener('click', e => {
    const btn = e.target.closest('.period-btn');
    if (!btn) return;
    document.querySelectorAll('#periodToggle .period-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
  });

  /* 성과 분석 월별/분기별 드롭다운 */
  document.getElementById('perfPeriod').addEventListener('change', e => {
    initPerfChart(e.target.value);
  });

  /* 조회 버튼 */
  document.getElementById('btnSearch').addEventListener('click', () => {
    showToast('조회 조건이 적용되었습니다.');
  });

  /* 초기화 버튼 */
  document.getElementById('btnReset').addEventListener('click', () => {
    document.querySelectorAll('.cb-group input[type=checkbox]').forEach(cb => { cb.checked = true; });
    document.querySelectorAll('#periodToggle .period-btn').forEach(b => b.classList.toggle('on', b.dataset.period === '1m'));
    showToast('필터가 초기화되었습니다.');
  });

  /* PDF 내보내기 */
  document.getElementById('btnPrintPdf')?.addEventListener('click', () => window.print());

  /* 새로고침 */
  document.getElementById('btnRefresh').addEventListener('click', () => {
    const now = new Date();
    const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const el = document.getElementById('lastUpdated');
    if (el) el.textContent = hm;
    showToast('데이터가 갱신되었습니다.');
  });

  /* 차트별 CSV 버튼 동적 삽입 */
  [
    { key: 'perf',    label: '탄소저감 성과 분석' },
    { key: 'mile',    label: '마일별 저감 기여도' },
    { key: 'donut',   label: '분야별 데이터 비중' },
    { key: 'region',  label: '지역별 탄소저감 현황' },
    { key: 'trend',   label: '월별 분석 데이터 추이' },
    { key: 'viz',     label: '시각화 유형별 사용 현황' },
    { key: 'goal',    label: '탄소저감량 vs 목표' },
    { key: 'sector',  label: '분야별 월별 추이' },
    { key: 'refresh', label: '데이터 갱신 현황' },
  ].forEach(({ key, label }) => {
    const hd = [...document.querySelectorAll('.ad-card__t')]
      .find(el => el.textContent.trim() === label)
      ?.closest('.ad-card__hd');
    if (!hd) return;
    const btn = document.createElement('button');
    btn.className = 'ad-csv-btn';
    btn.dataset.csv = key;
    btn.type = 'button';
    btn.title = 'CSV 다운로드';
    btn.innerHTML = '<i data-lucide="download"></i>';
    hd.appendChild(btn);
  });
  lucide.createIcons();

  document.querySelectorAll('.ad-csv-btn').forEach(btn => {
    btn.addEventListener('click', () => exportChartCsv(btn.dataset.csv));
  });
}

/* ── 차트 CSV 내보내기 ── */
function exportChartCsv(key) {
  const map = {
    perf:    { h: ['월','탄소저감량(tCO2)'],                           r: PERF_MONTHLY.labels.map((l,i) => [l, PERF_MONTHLY.data[i]]) },
    mile:    { h: ['마일','직접감축(tCO2)','간접감축(tCO2)'],           r: MILE_DATA.labels.map((l,i) => [l, MILE_DATA.direct[i], MILE_DATA.indirect[i]]) },
    donut:   { h: ['분야','비중(%)'],                                   r: SECTOR_DONUT.map(d => [d.name, d.pct]) },
    region:  { h: ['지역','직접감축(tCO2)','간접감축(tCO2)'],           r: REGION_DATA.labels.map((l,i) => [l, REGION_DATA.direct[i], REGION_DATA.indirect[i]]) },
    trend:   { h: ['월','데이터수','증가율(%)'],                         r: DATA_TREND.labels.map((l,i) => [l, DATA_TREND.count[i], DATA_TREND.rate[i] ?? '']) },
    viz:     { h: ['유형','사용수'],                                     r: VIZ_TYPES.map(d => [d.name, d.count]) },
    goal:    { h: ['월','실적(tCO2)','목표(tCO2)','달성률(%)'],          r: GOAL_DATA.labels.map((l,i) => [l, GOAL_DATA.actual[i] ?? '', GOAL_DATA.goal[i], GOAL_DATA.rate[i] ?? '']) },
    sector:  { h: ['월','에너지','모빌리티','세이프티','데이터','기타'],   r: SECTOR_TREND.labels.map((l,i) => [l, SECTOR_TREND.energy[i], SECTOR_TREND.mobility[i], SECTOR_TREND.safety[i], SECTOR_TREND.data[i], SECTOR_TREND.etc[i]]) },
    refresh: { h: ['월','정상','갱신지연','연결오류'],                    r: REFRESH_DATA.labels.map((l,i) => [l, REFRESH_DATA.ok[i], REFRESH_DATA.delay[i], REFRESH_DATA.err[i]]) },
  };
  const d = map[key];
  if (!d) return;
  const csv = [d.h, ...d.r].map(row => row.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `광명_분석대시보드_${key}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('CSV 파일이 다운로드됩니다.');
}

/* 간단한 토스트 피드백 */
function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1A2942;color:#fff;padding:12px 24px;border-radius:10px;font:500 14px/1 var(--font-sans);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
