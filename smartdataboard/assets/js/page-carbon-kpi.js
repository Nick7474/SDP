/* =====================================================================
   광명 스마트데이터보드 · 탄소·에너지 지표 (page-carbon-kpi.js)
   ===================================================================== */

/* ── 데이터 ── */
const MONTHS_12 = ['2025.01','2025.02','2025.03','2025.04','2025.05','2025.06','2025.07','2025.08','2025.09','2025.10','2025.11','2025.12'];
const MONTHS_6 = ['12월','1월','2월','3월','4월','5월'];

/* 탭1: 탄소배출·저감 현황 데이터 */
const EM = {
  timeSeries: {
    usage:    [270120,240530,265980,281430,290210,305760,298450,286900,292310,301220,292620,312450],
    momRate:  [-10.9,-2.1, +5.8, +3.1, +5.4, -2.4, -3.9, -1.9, +3.0, -2.9, +0.0, +6.8],
    prevYear: [255000,228000,249000,263000,272000,285000,279000,268000,274000,282000,276000,294000],
  },
  renew: {
    pct: [16.8,17.2,18.1,18.9,19.6,20.3,21.0,21.7,22.1,22.8,23.4,24.2],
  },
  donut: [
    { name: '전력',    pct: 60.2, val: 187980, color: '#0C8AE5' },
    { name: '도시가스', pct: 23.5, val: 73340,  color: '#1AAA5E' },
    { name: '열에너지', pct: 8.6,  val: 26800,  color: '#ED8B16' },
    { name: '유류',    pct: 5.1,  val: 15980,  color: '#6E74D6' },
    { name: '기타',    pct: 2.6,  val: 8350,   color: '#AEB7C2' },
  ],
  regionBars: [
    { name: '광명동',   val: 68450, max: 70000 },
    { name: '철산1동',  val: 54320, max: 70000 },
    { name: '철산2동',  val: 46870, max: 70000 },
    { name: '하안1동',  val: 41966, max: 70000 },
    { name: '하안2동',  val: 33210, max: 70000 },
    { name: '소하1동',  val: 28450, max: 70000 },
    { name: '소하2동',  val: 23190, max: 70000 },
    { name: '학온동',   val: 16000, max: 70000 },
  ],
  factors: [
    { ico: 'trending-up',  icoColor: '#ED8B16', icoSoft: '#FDF1DF', t: '반품 수요 증가', d: '산업 부문 사용량 증가', pct: '+6.8%', dir: 'down' },
    { ico: 'sun',          icoColor: '#1AAA5E', icoSoft: '#E4F6EC', t: '신재생에너지 확대', d: '태양광 설비 증가 기여', pct: '+2.8%', dir: 'up' },
    { ico: 'flame',        icoColor: '#0C8AE5', icoSoft: '#E3F2FD', t: '전력 사용 비중 60%', d: '전력 효율 개선 필요', pct: '-1.2%', dir: 'down' },
    { ico: 'triangle-alert', icoColor: '#E0483D', icoSoft: '#FCEAE8', t: '2개 지역 배출 증가', d: '소하동·일직동 대책 필요', pct: '+4.7%', dir: 'down' },
  ],
  table: [
    { region: '광명동',   usage: 68450, solar: 4520, renewPct: 24.8, mom: '+7.5%↑', status: 'ok' },
    { region: '철산1동',  usage: 54320, solar: 3860, renewPct: 23.1, mom: '+6.2%↑', status: 'ok' },
    { region: '철산2동',  usage: 46870, solar: 3210, renewPct: 22.0, mom: '+4.8%↑', status: 'ok' },
    { region: '하안1동',  usage: 41966, solar: 2980, renewPct: 23.4, mom: '+5.3%↑', status: 'ok' },
    { region: '하안2동',  usage: 33210, solar: 2150, renewPct: 21.2, mom: '+2.1%↑', status: 'ok' },
    { region: '광명시 전체', usage: 312450, solar: 21540, renewPct: 24.2, mom: '+6.8%↑', status: 'ok' },
  ],
};

/* 탭2: 에너지 현황 데이터 */
const EN = {
  emission: {
    curr:     [139200,134800,132700,130900,129900,128450],
    prevYear: [145000,140200,137000,135600,134100,141000],
    momRate:  [-0.1,-7.3,-3.5,-9.0,-6.7,-8.8],
  },
  reduction: {
    monthly:    [2120, 2280, 2450, 2620, 2990, 3200],
    prevYear:   [1850, 1900, 2000, 2100, 2200, 2500],
    goalCumul:  [6200,12400,18600,24800,37500,50000],
    cumul:      [6200,15400,19800,25700,31200,null],
  },
  donut: [
    { name: '산업',   pct: 35.9, val: 46120, color: '#0C8AE5' },
    { name: '수송',   pct: 22.1, val: 28340, color: '#1AAA5E' },
    { name: '건물',   pct: 19.1, val: 24580, color: '#ED8B16' },
    { name: '폐기물', pct: 9.9,  val: 12680, color: '#6E74D6' },
    { name: '기타',   pct: 13.0, val: 16730, color: '#AEB7C2' },
  ],
  regionBars: [
    { name: '철산4동', val: 18920, max: 50000, warn: false },
    { name: '하안3동', val: 17280, max: 50000, warn: true  },
    { name: '소하1동', val: 16450, max: 50000, warn: false },
    { name: '광명3동', val: 15860, max: 50000, warn: false },
    { name: '철산2동', val: 13220, max: 50000, warn: false },
    { name: '기타',    val: 46720, max: 50000, warn: false },
  ],
  factors: [
    { ico: 'factory',    icoColor: '#1AAA5E', icoSoft: '#E4F6EC', t: '산업 부문 생산량 감소', d: '제조업체 생산량 감소로 배출량 6.2% 감소', pct: '-6.2%', dir: 'up' },
    { ico: 'car',        icoColor: '#1AAA5E', icoSoft: '#E4F6EC', t: '수송 부문 전기차 보급', d: '전기차 보급 확대 및 운행 거리 감소 영향', pct: '-4.1%', dir: 'up' },
    { ico: 'building-2', icoColor: '#1AAA5E', icoSoft: '#E4F6EC', t: '건물 부문 효율 개선', d: '공공건물 에너지 효율 개선으로 배출량 감소', pct: '-3.5%', dir: 'up' },
    { ico: 'trash-2',    icoColor: '#E0483D', icoSoft: '#FCEAE8', t: '폐기물 처리량 증가', d: '생활폐기물 처리량 증가로 배출량이 증가', pct: '+8.7%', dir: 'down' },
  ],
  table: [
    { region: '광명시 전체', emission: 128450, mom: '-4.6%↓', yoy: '-8.8%↓', reduction: 28760, reductionRate: 22.4, status: 'ok' },
    { region: '철산4동',    emission: 18920,  mom: '-5.1%↓', yoy: '-9.2%↓', reduction: 4620,  reductionRate: 24.4, status: 'ok' },
    { region: '하안3동',    emission: 17280,  mom: '+6.8%↑', yoy: '+3.2%↑', reduction: 3150,  reductionRate: 18.2, status: 'warn' },
    { region: '소하1동',    emission: 16450,  mom: '-3.3%↓', yoy: '-7.6%↓', reduction: 3820,  reductionRate: 23.2, status: 'ok' },
    { region: '광명3동',    emission: 15860,  mom: '-2.7%↓', yoy: '-6.5%↓', reduction: 3410,  reductionRate: 21.5, status: 'ok' },
    { region: '하안1동',    emission: 14620,  mom: '-1.8%↓', yoy: '-5.0%↓', reduction: 2980,  reductionRate: 20.4, status: 'ok' },
  ],
};

const REGION_DB = {
  '광명동':    { desc: '광명동은 에너지 사용량이 가장 많은 지역으로, 태양광 발전 비중이 24.8%로 광명시 평균을 상회합니다.', base: [['행정구분','광명동'],['면적','3.2km²'],['세대수','22,100세대'],['담당부서','광명동 주민센터']], stat: [['에너지 사용량','68,450 MWh'],['태양광 발전','4,520 MWh'],['신재생 비중','24.8%'],['전월 대비','+7.5%']], hist: [59000, 61200, 63500, 65100, 66200, 68450] },
  '철산1동':   { desc: '철산1동은 주거 밀도가 높은 지역으로 전력 사용 비중이 높습니다.', base: [['행정구분','철산1동'],['면적','1.8km²'],['세대수','18,400세대'],['담당부서','철산동 주민센터']], stat: [['에너지 사용량','54,320 MWh'],['태양광 발전','3,860 MWh'],['신재생 비중','23.1%'],['전월 대비','+6.2%']], hist: [48000, 49500, 51200, 52100, 53400, 54320] },
  '철산2동':   { desc: '철산2동은 주거 중심 지역으로 건물 에너지 효율 개선이 지속적으로 진행 중입니다.', base: [['행정구분','철산2동'],['면적','1.6km²'],['세대수','15,800세대'],['담당부서','철산동 주민센터']], stat: [['에너지 사용량','46,870 MWh'],['태양광 발전','3,210 MWh'],['신재생 비중','22.0%'],['전월 대비','+4.8%']], hist: [41000, 42500, 43800, 44200, 45600, 46870] },
  '철산4동':   { desc: '철산4동은 탄소배출량이 전월 대비 5.1% 감소하며 저감 효과가 나타나고 있습니다.', base: [['행정구분','철산4동'],['면적','1.4km²'],['세대수','12,800세대'],['담당부서','철산동 주민센터']], stat: [['탄소배출량','18,920 tCO₂e'],['탄소저감량','4,620 tCO₂e'],['저감률','24.4%'],['전월 대비','-5.1%']], hist: [22000, 21500, 21000, 20500, 19900, 18920] },
  '하안1동':   { desc: '하안1동은 주거 밀집 지역으로 에너지 사용량 절감과 신재생에너지 보급이 추진 중입니다.', base: [['행정구분','하안1동'],['면적','1.9km²'],['세대수','14,600세대'],['담당부서','하안동 주민센터']], stat: [['에너지 사용량','41,966 MWh'],['탄소배출량','14,620 tCO₂e'],['저감률','20.4%'],['전월 대비','-1.8%']], hist: [36200, 37500, 38900, 39800, 40900, 41966] },
  '하안2동':   { desc: '하안2동은 신재생에너지 비중이 증가하며 안정적인 에너지 사용 패턴을 보이고 있습니다.', base: [['행정구분','하안2동'],['면적','2.0km²'],['세대수','13,200세대'],['담당부서','하안동 주민센터']], stat: [['에너지 사용량','33,210 MWh'],['태양광 발전','2,150 MWh'],['신재생 비중','21.2%'],['전월 대비','+2.1%']], hist: [28500, 29800, 30600, 31200, 32400, 33210] },
  '하안3동':   { desc: '하안3동은 전월 대비 탄소 배출량이 6.8% 증가하여 저감 조치가 필요합니다.', base: [['행정구분','하안3동'],['면적','2.1km²'],['세대수','15,200세대'],['담당부서','하안동 주민센터']], stat: [['탄소배출량','17,280 tCO₂e'],['탄소저감량','3,150 tCO₂e'],['저감률','18.2%'],['전월 대비','+6.8%']], hist: [13200, 14100, 14800, 15200, 16000, 17280] },
  '소하1동':   { desc: '소하1동은 산업시설 밀집 지역으로 효율 개선을 통해 탄소배출량을 꾸준히 줄이고 있습니다.', base: [['행정구분','소하1동'],['면적','2.8km²'],['세대수','9,400세대'],['담당부서','소하동 주민센터']], stat: [['탄소배출량','16,450 tCO₂e'],['탄소저감량','3,820 tCO₂e'],['저감률','23.2%'],['전월 대비','-3.3%']], hist: [19800, 19200, 18500, 17900, 17200, 16450] },
  '광명3동':   { desc: '광명3동은 전년 대비 6.5% 탄소배출량이 감소하며 저탄소 도시 전환에 기여하고 있습니다.', base: [['행정구분','광명3동'],['면적','1.7km²'],['세대수','11,600세대'],['담당부서','광명동 주민센터']], stat: [['탄소배출량','15,860 tCO₂e'],['탄소저감량','3,410 tCO₂e'],['저감률','21.5%'],['전월 대비','-2.7%']], hist: [18500, 18000, 17500, 17000, 16500, 15860] },
  '광명시 전체': { desc: '광명시 전체 에너지 사용 및 탄소배출 통합 현황입니다. 신재생에너지 비중이 24.2%로 목표에 근접하고 있습니다.', base: [['행정구분','광명시 전체'],['면적','38.5km²'],['세대수','144,000세대'],['담당부서','기후에너지과']], stat: [['에너지 사용량','312,450 MWh'],['탄소배출량','128,450 tCO₂e'],['신재생 비중','24.2%'],['저감률','22.4%']], hist: [265000, 270000, 280000, 290000, 300000, 312450] },
};

let dwChart = null;
let emTimeSeriesChart = null;
let enEmissionChart = null;
let emGoal = parseInt(localStorage.getItem('ck_em_goal') || '30000', 10);

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  animateGauges();
  // 탭1
  initEmTimeSeries();
  initEmRenew();
  initEmDonut();
  renderEmRegionBars();
  renderEmFactors();
  renderEmTable();
  // 탭2
  initEnEmission();
  initEnReduction();
  initEnDonut();
  renderEnRegionBars();
  renderEnFactors();
  renderEnTable();
  bindEvents();
  initYearFilter();
  initKpiDrilldown();
  initGoalModal();
  updateGoalDisplay();
  lucide.createIcons();
});

/* 탭 전환 */
const CK_TAB_META = {
  emission: { label: '탄소배출·저감 현황', desc: '기간·지역별 탄소배출량과 저감 성과를 비교 분석합니다.' },
  energy:   { label: '에너지 현황',       desc: '에너지 유형별 사용량과 절감 현황을 확인합니다.' }
};

function initTabs() {
  if (window.gmsbSetTab) gmsbSetTab(CK_TAB_META.emission.label, CK_TAB_META.emission.desc);
  document.querySelectorAll('.page-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page-tab').forEach(b => b.classList.remove('on'));
      document.querySelectorAll('.ck-pane').forEach(p => p.classList.remove('on'));
      btn.classList.add('on');
      document.getElementById('pane-' + btn.dataset.tab).classList.add('on');
      const m = CK_TAB_META[btn.dataset.tab];
      if (m && window.gmsbSetTab) gmsbSetTab(m.label, m.desc);
      lucide.createIcons();
    });
  });
  // 기간 토글 버튼
  document.querySelectorAll('.period-toggle').forEach(grp => {
    grp.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        grp.querySelectorAll('.period-btn').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
      });
    });
  });
}

/* 게이지 애니메이션 */
function animateGauges() {
  const C = 2 * Math.PI * 20; // r=20 → ≈ 125.66
  const anim = (arcId, pctElId, pct, color) => {
    const arc = document.getElementById(arcId);
    const lbl = document.getElementById(pctElId);
    if (!arc || !lbl) return;
    arc.style.stroke = color;
    const filled = (pct / 100) * C;
    setTimeout(() => {
      arc.setAttribute('stroke-dasharray', `${filled} ${C - filled}`);
      lbl.textContent = pct + '%';
    }, 200);
  };
  anim('emGaugeArc', 'emGaugePct', 72.4, '#0C8AE5');
  anim('enGaugeArc', 'enGaugePct', 77, '#1AAA5E');
}

/* ── 탭1 차트 ── */
function initEmTimeSeries() {
  const ctx = document.getElementById('chartEmTimeSeries').getContext('2d');
  emTimeSeriesChart = new Chart(ctx, {
    data: {
      labels: MONTHS_12,
      datasets: [
        { type: 'bar',  label: '에너지 사용량', data: EM.timeSeries.usage, backgroundColor: '#93C8EC', borderRadius: 3, order: 2, yAxisID: 'y' },
        { type: 'line', label: '전월 대비(%)',   data: EM.timeSeries.momRate, borderColor: '#ED8B16', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#ED8B16', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.3, fill: false, order: 1, yAxisID: 'y2' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', maxRotation: 0 } },
        y:  { position: 'left',  grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => (v/1000).toFixed(0) + 'k' }, beginAtZero: false },
        y2: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '%' } },
      },
    },
  });
}

function initEmRenew() {
  const ctx = document.getElementById('chartEmRenew').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS_12,
      datasets: [{
        label: '신재생 비중',
        data: EM.renew.pct,
        borderColor: '#1AAA5E',
        backgroundColor: 'rgba(26,170,94,.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#1AAA5E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `신재생 비중: ${c.parsed.y}%` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', maxRotation: 0 } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '%' }, min: 14, max: 28 },
      },
    },
  });
}

function initEmDonut() {
  const ctx = document.getElementById('chartEmDonut').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: EM.donut.map(d => d.name),
      datasets: [{ data: EM.donut.map(d => d.pct), backgroundColor: EM.donut.map(d => d.color), borderWidth: 0, hoverOffset: 4 }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } },
  });
  document.getElementById('emDonutLegend').innerHTML = EM.donut.map(d =>
    `<div class="ck-legend-item">
      <span class="ck-legend-dot" style="background:${d.color}"></span>
      <span class="ck-legend-name">${d.name}</span>
      <span class="ck-legend-pct">${d.pct}%</span>
    </div>`).join('');
}

function renderEmRegionBars() {
  const el = document.getElementById('emRegionBars');
  const maxVal = Math.max(...EM.regionBars.map(d => d.val));
  el.innerHTML = EM.regionBars.map(d =>
    `<div class="hbar-item">
      <span class="hbar-name">${d.name}</span>
      <div class="hbar-track"><div class="hbar-fill" style="width:${(d.val/maxVal*100).toFixed(1)}%;background:#0C8AE5"></div></div>
      <span class="hbar-val">${(d.val/1000).toFixed(1)}k</span>
    </div>`).join('');
}

function renderEmFactors() {
  document.getElementById('emFactorList').innerHTML = EM.factors.map(f =>
    `<div class="factor-item">
      <div class="factor-item__ico" style="background:${f.icoSoft};color:${f.icoColor}"><i data-lucide="${f.ico}"></i></div>
      <div class="factor-item__body">
        <div class="factor-item__t">${f.t}</div>
        <div class="factor-item__d">${f.d}</div>
      </div>
      <span class="factor-item__pct ${f.dir}">${f.pct}</span>
    </div>`).join('');
}

function renderEmTable() {
  const stCls = { ok: 'pill--ok', warn: 'pill--warn' };
  const stLbl = { ok: '정상', warn: '증가' };
  const isUp = s => s.includes('↑');
  document.getElementById('emTableBody').innerHTML = EM.table.map(d => `
    <tr class="em-row" data-region="${d.region}">
      <td class="l">${d.region}</td>
      <td class="num">${d.usage.toLocaleString()}</td>
      <td class="num">${d.solar.toLocaleString()}</td>
      <td class="num">${d.renewPct}%</td>
      <td class="${isUp(d.mom) ? 'tbl-up' : 'tbl-down'}">${d.mom.replace(/[↑↓]/g, m => m === '↑' ? '▲' : '▼')}</td>
      <td><span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span></td>
      <td><button class="tbtn tbtn--sm" data-region="${d.region}" type="button">보기</button></td>
    </tr>`).join('');
}

/* ── 탭2 차트 ── */
function initEnEmission() {
  const ctx = document.getElementById('chartEnEmission').getContext('2d');
  enEmissionChart = new Chart(ctx, {
    data: {
      labels: MONTHS_6,
      datasets: [
        { type: 'bar',  label: '금년 배출량', data: EN.emission.curr,     backgroundColor: '#0C8AE5', borderRadius: 4, order: 2, barPercentage: 0.5 },
        { type: 'bar',  label: '전년 배출량', data: EN.emission.prevYear, backgroundColor: '#D0E8F7', borderRadius: 4, order: 3, barPercentage: 0.5 },
        { type: 'line', label: '증감률(%)',   data: EN.emission.momRate,  borderColor: '#ED8B16', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#ED8B16', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.3, fill: false, order: 1, yAxisID: 'y2' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y:  { position: 'left',  grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => (v/1000).toFixed(0) + 'k' } },
        y2: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v + '%' } },
      },
    },
  });
}

function initEnReduction() {
  const ctx = document.getElementById('chartEnReduction').getContext('2d');
  new Chart(ctx, {
    data: {
      labels: MONTHS_6,
      datasets: [
        { type: 'bar',  label: '월별 저감량', data: EN.reduction.monthly,  backgroundColor: '#1AAA5E', borderRadius: 4, order: 3, barPercentage: 0.5 },
        { type: 'bar',  label: '전년 저감량', data: EN.reduction.prevYear, backgroundColor: '#B2DEC9', borderRadius: 4, order: 4, barPercentage: 0.5 },
        { type: 'line', label: '누적 저감량', data: EN.reduction.cumul,    borderColor: '#044E9E', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#044E9E', pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.3, fill: false, order: 2, yAxisID: 'y2' },
        { type: 'line', label: '누적 목표',   data: EN.reduction.goalCumul, borderColor: '#AEB7C2', borderDash: [5,4], borderWidth: 2, pointRadius: 0, tension: 0.3, fill: false, order: 1, yAxisID: 'y2' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y:  { position: 'left',  grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => v.toLocaleString() } },
        y2: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => (v/1000).toFixed(0) + 'k' } },
      },
    },
  });
}

function initEnDonut() {
  const ctx = document.getElementById('chartEnDonut').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: EN.donut.map(d => d.name),
      datasets: [{ data: EN.donut.map(d => d.pct), backgroundColor: EN.donut.map(d => d.color), borderWidth: 0, hoverOffset: 4 }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } },
  });
  document.getElementById('enDonutLegend').innerHTML = EN.donut.map(d =>
    `<div class="ck-legend-item">
      <span class="ck-legend-dot" style="background:${d.color}"></span>
      <span class="ck-legend-name">${d.name}</span>
      <span class="ck-legend-pct">${d.pct}%</span>
    </div>`).join('');
}

function renderEnRegionBars() {
  const el = document.getElementById('enRegionBars');
  const maxVal = Math.max(...EN.regionBars.map(d => d.val));
  el.innerHTML = EN.regionBars.map(d =>
    `<div class="hbar-item">
      <span class="hbar-name">${d.name}</span>
      <div class="hbar-track"><div class="hbar-fill" style="width:${(d.val/maxVal*100).toFixed(1)}%;background:${d.warn ? 'var(--status-danger)' : '#0C8AE5'}"></div></div>
      <span class="hbar-val" style="${d.warn ? 'color:var(--status-danger)' : ''}">${(d.val/1000).toFixed(1)}k</span>
    </div>`).join('');
}

function renderEnFactors() {
  document.getElementById('enFactorList').innerHTML = EN.factors.map(f =>
    `<div class="factor-item">
      <div class="factor-item__ico" style="background:${f.icoSoft};color:${f.icoColor}"><i data-lucide="${f.ico}"></i></div>
      <div class="factor-item__body">
        <div class="factor-item__t">${f.t}</div>
        <div class="factor-item__d">${f.d}</div>
      </div>
      <span class="factor-item__pct ${f.dir}">${f.pct}</span>
    </div>`).join('');
}

function renderEnTable() {
  const stCls = { ok: 'pill--ok', warn: 'pill--warn' };
  const stLbl = { ok: '정상', warn: '주의' };
  const isUp = s => !s.includes('↓');
  document.getElementById('enTableBody').innerHTML = EN.table.map(d => `
    <tr class="en-row" data-region="${d.region}">
      <td class="l">${d.region}</td>
      <td class="num">${d.emission.toLocaleString()}</td>
      <td class="${isUp(d.mom) ? 'tbl-up' : 'tbl-down'}">${d.mom.replace(/[↑↓]/g, m => m === '↑' ? '▲' : '▼')}</td>
      <td class="${isUp(d.yoy) ? 'tbl-up' : 'tbl-down'}">${d.yoy.replace(/[↑↓]/g, m => m === '↑' ? '▲' : '▼')}</td>
      <td class="num">${d.reduction.toLocaleString()}</td>
      <td class="num">${d.reductionRate}%</td>
      <td><span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span></td>
      <td><button class="tbtn tbtn--sm" data-region="${d.region}" data-tab="en" type="button">보기</button></td>
    </tr>`).join('');
}

/* ── 이벤트 ── */
function bindEvents() {
  document.getElementById('scrim').addEventListener('click', closeDrawer);
  document.getElementById('dwClose').addEventListener('click', closeDrawer);

  // 탭1 테이블 클릭
  document.getElementById('emTableBody').addEventListener('click', e => {
    const btn = e.target.closest('.tbtn');
    const row = e.target.closest('.em-row');
    const region = (btn || row)?.dataset.region;
    if (region) openDrawer(region, 'em');
  });

  // 탭2 테이블 클릭
  document.getElementById('enTableBody').addEventListener('click', e => {
    const btn = e.target.closest('.tbtn');
    const row = e.target.closest('.en-row');
    const region = (btn || row)?.dataset.region;
    if (region) openDrawer(region, 'en');
  });

  // 조회 버튼
  document.getElementById('btnEmSearch').addEventListener('click', () => {
    const compareMode = document.getElementById('emCompare').value;
    updateEmCompare(compareMode);
    renderEmTable(); renderEmRegionBars(); lucide.createIcons();
  });
  document.getElementById('btnEnSearch').addEventListener('click', () => {
    const compareMode = document.getElementById('enCompare').value;
    updateEnCompare(compareMode);
    renderEnTable(); renderEnRegionBars(); lucide.createIcons();
  });

  // 초기화
  document.getElementById('btnEmReset').addEventListener('click', () => {
    ['emRegion','emEnergyType','emCompare'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    document.getElementById('emPeriodToggle').querySelectorAll('.period-btn').forEach((b,i) => b.classList.toggle('on', i === 0));
  });
  document.getElementById('btnEnReset').addEventListener('click', () => {
    ['enRegion','enSector','enCompare'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    document.getElementById('enPeriodToggle').querySelectorAll('.period-btn').forEach((b,i) => b.classList.toggle('on', i === 0));
  });

  // CSV 내보내기
  document.getElementById('btnEmTableExport').addEventListener('click', () => exportEmCSV());
  document.getElementById('btnEmExport').addEventListener('click', () => exportEmCSV());
  document.getElementById('btnEnTableExport').addEventListener('click', () => exportEnCSV());
  document.getElementById('btnEnExport').addEventListener('click', () => exportEnCSV());
}

/* 드로어 열기 */
function openDrawer(region, tab) {
  const db = REGION_DB[region];
  if (!db) return;
  document.getElementById('dwTitle').textContent = region;
  document.getElementById('dwDesc').textContent = db.desc;
  document.getElementById('dwBaseDl').innerHTML = db.base.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  document.getElementById('dwStatDl').innerHTML = db.stat.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  if (dwChart) { dwChart.destroy(); dwChart = null; }
  const ctx = document.getElementById('dwChart').getContext('2d');
  dwChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS_6,
      datasets: [{ data: db.hist, backgroundColor: tab === 'en' ? '#0C8AE5' : '#1AAA5E', borderRadius: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699', callback: v => (v/1000).toFixed(0) + 'k' } },
      },
    },
  });
  document.getElementById('scrim').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  lucide.createIcons();
}

function closeDrawer() {
  document.getElementById('scrim').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
}

function exportEmCSV() {
  const header = ['지역','총 에너지 사용량(MWh)','태양광 발전량(MWh)','신재생 비중(%)','전월 대비','상태'];
  const rows = EM.table.map(d => [d.region, d.usage, d.solar, d.renewPct, d.mom.replace(/[↑↓]/g,''), d.status === 'ok' ? '정상' : '증가']);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '에너지사용지표_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
}

function exportEnCSV() {
  const header = ['지역','탄소배출량(tCO₂e)','전월대비','전년동월대비','탄소저감량(tCO₂e)','저감률(%)','상태'];
  const rows = EN.table.map(d => [d.region, d.emission, d.mom.replace(/[↑↓]/g,''), d.yoy.replace(/[↑↓]/g,''), d.reduction, d.reductionRate, d.status === 'ok' ? '정상' : '주의']);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '탄소배출저감지표_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
}

/* ── 연도 필터 ── */
function initYearFilter() {
  function bindPeriodToggle(toggleId, monthPickerId, yearSelectId) {
    const toggle = document.getElementById(toggleId);
    const monthPicker = document.getElementById(monthPickerId);
    const yearSelect = document.getElementById(yearSelectId);
    if (!toggle || !yearSelect) return;
    toggle.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isYear = btn.dataset.period === 'year';
        if (monthPicker) monthPicker.style.display = isYear ? 'none' : '';
        yearSelect.style.display = isYear ? '' : 'none';
      });
    });
  }
  bindPeriodToggle('emPeriodToggle', 'emMonthPicker', 'emYearSelect');
  bindPeriodToggle('enPeriodToggle', 'enMonthPicker', 'enYearSelect');
}

/* ── KPI 드릴다운 ── */
function initKpiDrilldown() {
  document.querySelectorAll('.ck-kpi--link').forEach(card => {
    const handler = e => {
      if (e.target.closest('.ck-kpi__edit-btn')) return;
      const region = card.dataset.kpi;
      const tab = card.dataset.tab;
      if (region) openDrawer(region, tab);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); } });
  });
}

/* ── 목표치 수정 모달 ── */
function initGoalModal() {
  const overlay = document.getElementById('emGoalOverlay');
  if (!overlay) return;
  document.getElementById('btnEmGoalEdit').addEventListener('click', e => { e.stopPropagation(); openGoalModal(); });
  document.getElementById('emGoalBg').addEventListener('click', closeGoalModal);
  document.getElementById('emGoalCloseBtn').addEventListener('click', closeGoalModal);
  document.getElementById('emGoalCancelBtn').addEventListener('click', closeGoalModal);
  document.getElementById('emGoalSaveBtn').addEventListener('click', saveGoal);
}

function openGoalModal() {
  document.getElementById('emGoalInput').value = emGoal;
  document.getElementById('emGoalOverlay').classList.add('on');
  lucide.createIcons();
}

function closeGoalModal() {
  document.getElementById('emGoalOverlay').classList.remove('on');
}

function saveGoal() {
  const val = parseInt(document.getElementById('emGoalInput').value, 10);
  if (isNaN(val) || val <= 0) { showToast('올바른 목표값을 입력하세요.'); return; }
  emGoal = val;
  localStorage.setItem('ck_em_goal', String(emGoal));
  updateGoalDisplay();
  closeGoalModal();
  showToast('탄소저감 목표치가 저장되었습니다.');
}

function updateGoalDisplay() {
  const lbl = document.getElementById('emGoalTargetLbl');
  if (lbl) lbl.textContent = emGoal.toLocaleString();
  const C = 2 * Math.PI * 20;
  const currentReduction = 21756;
  const pct = Math.min(100, Math.round(currentReduction / emGoal * 100 * 10) / 10);
  const arc = document.getElementById('emGaugeArc');
  const pctEl = document.getElementById('emGaugePct');
  const vlEl = document.getElementById('emGoalPctVl');
  if (arc) arc.setAttribute('stroke-dasharray', `${(pct / 100) * C} ${C - (pct / 100) * C}`);
  if (pctEl) pctEl.textContent = pct + '%';
  if (vlEl) vlEl.innerHTML = pct + '<span class="u">%</span>';
}

/* ── 전년도 비교 차트 업데이트 ── */
function updateEmCompare(mode) {
  if (!emTimeSeriesChart) return;
  const ds = emTimeSeriesChart.data.datasets;
  const existingPrev = ds.find(d => d.label === '전년도 사용량');
  if (mode === 'last_year') {
    if (!existingPrev) {
      ds.push({
        type: 'bar', label: '전년도 사용량', data: EM.timeSeries.prevYear,
        backgroundColor: 'rgba(174,183,194,.35)', borderRadius: 3, order: 3, yAxisID: 'y',
      });
    }
  } else {
    if (existingPrev) ds.splice(ds.indexOf(existingPrev), 1);
  }
  emTimeSeriesChart.update();
}

function updateEnCompare(mode) {
  if (!enEmissionChart) return;
  const ds = enEmissionChart.data.datasets;
  const prevDs = ds.find(d => d.label === '전년 배출량');
  if (prevDs) {
    prevDs.hidden = (mode !== 'last_year');
    enEmissionChart.update();
  }
}

/* ── 토스트 ── */
function showToast(msg) {
  let t = document.getElementById('ckToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'ckToast';
    Object.assign(t.style, { position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', background:'var(--fg-1)', color:'#fff', padding:'10px 20px', borderRadius:'var(--radius-pill)', font:'500 14px/1 var(--font-sans)', zIndex:'600', pointerEvents:'none', transition:'opacity .2s', opacity:'0' });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}
