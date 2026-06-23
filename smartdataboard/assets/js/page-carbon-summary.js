/* =====================================================================
   광명 스마트데이터보드 · 탄소중립 종합 현황 (page-carbon-summary.js)
   ===================================================================== */

/* ── 상수 / 데이터 ── */
const RING_R = 60;
const RING_C = 2 * Math.PI * RING_R; // ≈ 376.99

const KPI_TABLE = [
  { name: '온실가스 감축량',      unit: 'tCO₂eq', v25: '1,245.8', v26: '1,820.0', pct: 68.5, trend: '+8.3%↑',  status: 'ok' },
  { name: '신재생에너지 비중',    unit: '%',      v25: '18.6',    v26: '25.0',    pct: 74.4, trend: '+2.8p↑',  status: 'ok' },
  { name: '전기차 보급 대수',     unit: '대',     v25: '2,350',   v26: '3,000',   pct: 78.3, trend: '+420↑',   status: 'ok' },
  { name: '공공시설 에너지 절감률', unit: '%',   v25: '16.2',    v26: '18.0',    pct: 90.0, trend: '+1.8p↑',  status: 'ok' },
];

const YEARLY = {
  labels: ['2021', '2022', '2023', '2024', '2025', '2026(목표)'],
  actual: [620.3, 782.6, 912.4, 1151.2, 1245.8, null],
  goalLine:[620.3, 760, 900, 1100, 1400, 1820.0],
  bau:     [900, 980, 1080, 1180, 1280, 1380],
  prev2024:[500, 650, 780, 1000, null, null],
};

const PROJECTS = [
  { name: '태양광 발전 확대 사업', sector: '신재생에너지', status: 'ok', pct: 82, reduction: 4200, dept: '기후에너지과' },
  { name: '전기버스 도입', sector: '수송', status: 'ok', pct: 70, reduction: 3100, dept: '교통정책과' },
  { name: '건물 에너지 효율화', sector: '건물', status: 'warn', pct: 55, reduction: 2600, dept: '시설관리과' },
  { name: '폐열 회수 설비 구축', sector: '산업', status: 'ok', pct: 90, reduction: 1800, dept: '산업진흥과' },
  { name: '도시숲 조성 사업', sector: '흡수원', status: 'ok', pct: 65, reduction: 1200, dept: '공원녹지과' },
  { name: '공공시설 LED 전환', sector: '전력', status: 'warn', pct: 40, reduction: 900, dept: '시설관리과' },
];

const MONTHLY = {
  labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  actual: [82, 85, 88, 90, 91, null, null, null, null, null, null, null],
  target: [80, 80, 85, 88, 90, 92, 92, 94, 96, 97, 98, 100],
};

const DONUT = [
  { name: '전력',   pct: 41.2, color: '#0C8AE5' },
  { name: '수송',   pct: 25.3, color: '#1AAA5E' },
  { name: '건물',   pct: 16.4, color: '#ED8B16' },
  { name: '폐기물', pct: 8.7,  color: '#6E74D6' },
  { name: '산업',   pct: 8.4,  color: '#AEB7C2' },
];

const ISSUE_DB = {
  '배출 증가 지역': {
    desc: '소하동·일직동에서 전월 대비 탄소 배출량이 증가하였습니다. 산업시설 가동률 증가가 주요 원인으로 분석됩니다.',
    base: [['구분','주의 지표'],['대상 지역','소하동, 일직동'],['담당 부서','기후환경과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['전월 배출량','46,720 tCO₂eq'],['금월 배출량','48,910 tCO₂eq'],['증가율','+4.7%'],['연간 목표 대비','초과']],
    history: [38.2, 39.1, 40.5, 43.2, 45.0, 46.7, 48.9],
  },
  '태양광 발전량': {
    desc: '연간 목표 대비 84% 수준입니다. 일조량 감소 및 일부 설비 효율 저하가 원인으로 파악됩니다.',
    base: [['구분','주의 지표'],['대상 시설','시내 태양광 발전소 38소'],['담당 부서','기후에너지과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['현재 발전량','543.4 MWh'],['연간 목표','648.0 MWh'],['달성률','84%'],['부족량','-104 MWh']],
    history: [480, 495, 510, 520, 530, 540, 543],
  },
  '공공시설 에너지 사용': {
    desc: '공공시설 에너지 사용량이 전년 대비 2.1% 증가하였습니다. 냉난방 사용 증가가 주된 원인입니다.',
    base: [['구분','관심 지표'],['대상 시설','시청·구청·복지관 등 23개소'],['담당 부서','시설관리과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['전년 사용량','26,800 MWh'],['금년 사용량','27,363 MWh'],['증감','+2.1%'],['절감 목표','-5.0%']],
    history: [25200, 25600, 26100, 26400, 26800, 27100, 27363],
  },
  '온실가스 감축량': {
    desc: '2026년 온실가스 감축 목표 대비 현재 68.5% 달성 중입니다. 전년 동기 대비 8.3% 증가하였습니다.',
    base: [['구분','핵심 지표'],['단위','tCO₂eq'],['담당 부서','기후에너지과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['2025년 실적','1,245.8 tCO₂eq'],['2026년 목표','1,820.0 tCO₂eq'],['달성률','68.5%'],['추세','+8.3%↑']],
    history: [620, 783, 912, 1151, 1246, 1440, 1820],
  },
  '신재생에너지 비중': {
    desc: '신재생에너지 비중이 전년 18.6%에서 2026년 목표 25.0%를 향해 꾸준히 증가하고 있습니다.',
    base: [['구분','핵심 지표'],['단위','%'],['담당 부서','기후에너지과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['2025년 비중','18.6%'],['2026년 목표','25.0%'],['달성률','74.4%'],['전년 대비','+2.8p↑']],
    history: [12.1, 13.5, 14.8, 16.2, 18.6, 21.2, 25.0],
  },
  '전기차 보급 대수': {
    desc: '전기차 보급이 2025년 2,350대에서 2026년 목표 3,000대를 향해 순조롭게 진행 중입니다.',
    base: [['구분','핵심 지표'],['단위','대'],['담당 부서','교통정책과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['2025년 보급','2,350대'],['2026년 목표','3,000대'],['달성률','78.3%'],['전년 대비','+420대↑']],
    history: [820, 1050, 1340, 1720, 2350, 2770, 3000],
  },
  '공공시설 에너지 절감률': {
    desc: '공공시설 에너지 절감률이 목표 18.0% 대비 90.0% 달성 중입니다. 냉난방 효율화 사업이 성과를 내고 있습니다.',
    base: [['구분','핵심 지표'],['단위','%'],['담당 부서','시설관리과'],['최근 업데이트','2026-06-19 10:15']],
    progress: [['2025년 절감률','16.2%'],['2026년 목표','18.0%'],['달성률','90.0%'],['전년 대비','+1.8p↑']],
    history: [10.2, 11.5, 12.8, 14.3, 16.2, 17.1, 18.0],
  },
};

let dwChart = null;
let yearlyChart = null;

/* ── 부트 ── */
function boot() {
  animateRing(68.5);
  renderKpiTable();
  renderProjectTable();
  initYearlyChart();
  initMonthlyChart();
  initDonutChart();
  bindEvents();
  lucide.createIcons();
}
document.addEventListener('gmsb:shell-ready', boot, { once: true });

/* 링 차트 애니메이션 */
function animateRing(pct) {
  const arc = document.getElementById('ringArc');
  const lbl = document.getElementById('ringPct');
  const filled = (pct / 100) * RING_C;
  setTimeout(() => {
    arc.setAttribute('stroke-dasharray', `${filled} ${RING_C - filled}`);
    lbl.textContent = pct + '%';
  }, 100);
}

/* 핵심 관리 지표 테이블 */
function renderKpiTable() {
  const tbody = document.getElementById('kpiTableBody');
  const statusCls = { ok: 'pill--ok', warn: 'pill--warn', err: 'pill--err' };
  const statusLbl = { ok: '정상', warn: '주의', err: '위험' };
  const barColor = (p) => p >= 90 ? '#1AAA5E' : p >= 70 ? '#0C8AE5' : '#ED8B16';
  const isUp = (t) => t.includes('↑');
  tbody.innerHTML = KPI_TABLE.map(d => `
    <tr class="kpi-row" data-name="${d.name}">
      <td class="l">${d.name}</td>
      <td>${d.unit}</td>
      <td class="num">${d.v25}</td>
      <td class="num">${d.v26}</td>
      <td>
        <div class="prog">
          <div class="prog__track">
            <div class="prog__fill" style="width:${d.pct}%;background:${barColor(d.pct)}"></div>
          </div>
          <span class="prog__pct">${d.pct}%</span>
        </div>
      </td>
      <td class="${isUp(d.trend) ? 'tbl-up' : 'tbl-down'}">${d.trend.replace('↑','▲').replace('↓','▼')}</td>
      <td><span class="pill ${statusCls[d.status]}">${statusLbl[d.status]}</span></td>
    </tr>`).join('');
}

/* 연도별 막대 + 목표선 */
function initYearlyChart() {
  const ctx = document.getElementById('chartYearly').getContext('2d');
  yearlyChart = new Chart(ctx, {
    data: {
      labels: YEARLY.labels,
      datasets: [
        {
          type: 'bar',
          label: '감축 실적',
          data: YEARLY.actual,
          backgroundColor: YEARLY.actual.map((v, i) =>
            v === null ? 'transparent' : (i === 4 ? '#0C8AE5' : '#93C8EC')),
          borderRadius: 5,
          borderSkipped: false,
          order: 2,
          barPercentage: 0.6,
        },
        {
          type: 'line',
          label: '연간 목표',
          data: YEARLY.goalLine,
          borderColor: '#6E74D6',
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: false,
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => `${c.dataset.label}: ${c.parsed.y != null ? c.parsed.y.toLocaleString() : '-'} tCO₂eq`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y: {
          grid: { color: '#F1F4F8' },
          ticks: { font: { size: 12 }, color: '#7A8699', callback: v => v.toLocaleString() },
          beginAtZero: true,
        },
      },
    },
  });
}

/* 월별 달성률 선 차트 */
function initMonthlyChart() {
  const ctx = document.getElementById('chartMonthly').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHLY.labels,
      datasets: [
        {
          label: '2026 달성률',
          data: MONTHLY.actual,
          borderColor: '#0C8AE5',
          backgroundColor: 'rgba(12,138,229,.08)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: '#0C8AE5',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: false,
          tension: 0.3,
          spanGaps: false,
        },
        {
          label: '목표 달성률',
          data: MONTHLY.target,
          borderColor: '#AEB7C2',
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#AEB7C2',
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y ?? '-'}%` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#7A8699' } },
        y: {
          grid: { color: '#F1F4F8' },
          ticks: { font: { size: 12 }, color: '#7A8699', callback: v => v + '%' },
          min: 50, max: 160,
        },
      },
    },
  });
}

/* 도넛 차트 */
function initDonutChart() {
  const ctx = document.getElementById('chartDonut').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: DONUT.map(d => d.name),
      datasets: [{ data: DONUT.map(d => d.pct), backgroundColor: DONUT.map(d => d.color), borderWidth: 0, hoverOffset: 5 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${c.label}: ${c.parsed}%` } },
      },
    },
  });
  document.getElementById('donutLegend').innerHTML = DONUT.map(d =>
    `<div class="cs-legend-item">
      <span class="cs-legend-dot" style="background:${d.color}"></span>
      <span class="cs-legend-name">${d.name}</span>
      <span class="cs-legend-pct">${d.pct}%</span>
    </div>`).join('');
}

/* ── 이벤트 바인딩 ── */
function bindEvents() {
  // 이슈 항목 클릭 → 드로어
  document.querySelectorAll('[data-issue]').forEach(el => {
    el.addEventListener('click', () => openDrawer(el.dataset.issue));
  });
  // 테이블 행 클릭 → 드로어 (일치하는 항목만)
  document.getElementById('kpiTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('.kpi-row');
    if (!row) return;
    const name = row.dataset.name;
    if (ISSUE_DB[name]) openDrawer(name);
  });
  // 감축 프로젝트 테이블 클릭
  document.getElementById('projectTableBody').addEventListener('click', (e) => {
    const btn = e.target.closest('.tbtn');
    if (!btn) return;
    const name = btn.dataset.project;
    openProjectDrawer(name);
  });
  // 드로어 닫기
  document.getElementById('scrim').addEventListener('click', closeDrawer);
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  // 드로어 푸터 버튼
  document.getElementById('dwBtnReport').addEventListener('click', () => showToast('보고서 생성 기능은 준비 중입니다.'));
  document.getElementById('dwBtnShare').addEventListener('click', () => {
    navigator.clipboard?.writeText(location.href).then(() => showToast('현재 페이지 URL이 복사되었습니다.')).catch(() => showToast('URL 복사에 실패했습니다.'));
  });
  // 새로고침
  document.getElementById('btnRefresh').addEventListener('click', () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    document.getElementById('lastUpdate').textContent = ts;
    document.getElementById('goalCardUpdate').textContent = ts.slice(0, 10);
  });
  // CSV 내보내기
  document.getElementById('btnExport').addEventListener('click', exportCSV);
  document.getElementById('btnProjectExport').addEventListener('click', exportProjectCSV);
  // 배출권 모달
  const creditOpen = document.getElementById('btnCreditOpen');
  creditOpen.addEventListener('click', openCreditModal);
  creditOpen.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCreditModal(); } });
  document.getElementById('creditOverlayBg').addEventListener('click', closeCreditModal);
  document.getElementById('creditModalClose').addEventListener('click', closeCreditModal);
  document.getElementById('creditModalExport').addEventListener('click', exportCreditCSV);
  // 연도비교 선택
  document.getElementById('yearlyCompare').addEventListener('change', updateYearlyCompare);
  // 프로젝트 연도 필터
  document.getElementById('projectYear').addEventListener('change', renderProjectTable);
}

/* 드로어 열기 */
function openDrawer(name) {
  const info = ISSUE_DB[name];
  if (!info) return;
  document.getElementById('dwTitle').textContent = name;
  document.getElementById('dwDesc').textContent = info.desc;
  document.getElementById('dwBaseDl').innerHTML = info.base.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  document.getElementById('dwProgressDl').innerHTML = info.progress.map(([dt, dd]) =>
    `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  // 미니 차트
  if (dwChart) { dwChart.destroy(); dwChart = null; }
  const ctx = document.getElementById('dwChart').getContext('2d');
  const len = info.history.length;
  const yLabels = Array.from({ length: len }, (_, i) => `${2025 - len + i + 1}년`).slice(-len);
  dwChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: yLabels,
      datasets: [{ data: info.history, backgroundColor: '#0C8AE5', borderRadius: 4 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } },
        y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699' } },
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

/* CSV 내보내기 */
function exportCSV() {
  const header = ['지표명','단위','2025 실적','2026 목표','목표 대비(%)','전년 대비','상태'];
  const rows = KPI_TABLE.map(d => [d.name, d.unit, d.v25, d.v26, d.pct, d.trend.replace(/[↑↓]/g, ''), d.status === 'ok' ? '정상' : '주의']);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '핵심관리지표_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

/* ── 감축 프로젝트 ── */
function renderProjectTable() {
  const tbody = document.getElementById('projectTableBody');
  const barColor = (p) => p >= 80 ? '#1AAA5E' : p >= 60 ? '#0C8AE5' : '#ED8B16';
  const stCls = { ok: 'pill--ok', warn: 'pill--warn' };
  const stLbl = { ok: '진행중', warn: '지연' };
  tbody.innerHTML = PROJECTS.map(d => `
    <tr>
      <td class="l">${d.name}</td>
      <td>${d.sector}</td>
      <td><span class="pill ${stCls[d.status]}">${stLbl[d.status]}</span></td>
      <td>
        <div class="prog">
          <div class="prog__track"><div class="prog__fill" style="width:${d.pct}%;background:${barColor(d.pct)}"></div></div>
          <span class="prog__pct">${d.pct}%</span>
        </div>
      </td>
      <td class="num">${d.reduction.toLocaleString()}</td>
      <td>${d.dept}</td>
      <td><button class="tbtn tbtn--sm" data-project="${d.name}" type="button">보기</button></td>
    </tr>`).join('');
}

function openProjectDrawer(name) {
  const proj = PROJECTS.find(p => p.name === name);
  if (!proj) return;
  const key = name in ISSUE_DB ? name : null;
  if (key) { openDrawer(key); return; }
  document.getElementById('dwTitle').textContent = proj.name;
  document.getElementById('dwDesc').textContent = `${proj.sector} 분야 감축 프로젝트로, 현재 ${proj.pct}% 진행 중입니다. 예상 감축량은 ${proj.reduction.toLocaleString()} tCO₂e입니다.`;
  document.getElementById('dwBaseDl').innerHTML = [
    ['분야', proj.sector],['상태', proj.status === 'ok' ? '진행중' : '지연'],
    ['담당부서', proj.dept],['예상 감축량', proj.reduction.toLocaleString() + ' tCO₂e'],
  ].map(([dt, dd]) => `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  document.getElementById('dwProgressDl').innerHTML = [
    ['진행률', proj.pct + '%'],['목표 감축량', proj.reduction.toLocaleString() + ' tCO₂e'],
    ['현재 감축량', Math.round(proj.reduction * proj.pct / 100).toLocaleString() + ' tCO₂e'],
    ['잔여량', Math.round(proj.reduction * (100 - proj.pct) / 100).toLocaleString() + ' tCO₂e'],
  ].map(([dt, dd]) => `<div class="dl__r"><dt>${dt}</dt><dd>${dd}</dd></div>`).join('');
  if (dwChart) { dwChart.destroy(); dwChart = null; }
  const ctx = document.getElementById('dwChart').getContext('2d');
  const quarterly = [0.1, 0.25, 0.45, proj.pct / 100].map(f => Math.round(proj.reduction * f));
  dwChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: ['1Q', '2Q', '3Q', '현재'], datasets: [{ data: quarterly, backgroundColor: '#0C8AE5', borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#7A8699' } }, y: { grid: { color: '#F1F4F8' }, ticks: { font: { size: 11 }, color: '#7A8699' } } } },
  });
  document.getElementById('scrim').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  lucide.createIcons();
}

function exportProjectCSV() {
  const header = ['프로젝트명','분야','상태','진행률(%)','예상 감축량(tCO₂e)','담당부서'];
  const rows = PROJECTS.map(d => [d.name, d.sector, d.status === 'ok' ? '진행중' : '지연', d.pct, d.reduction, d.dept]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '감축프로젝트현황_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

/* ── 배출권 모달 ── */
function openCreditModal() {
  document.getElementById('creditOverlay').classList.add('on');
  lucide.createIcons();
}

function closeCreditModal() {
  document.getElementById('creditOverlay').classList.remove('on');
}

function exportCreditCSV() {
  const header = ['거래일자','거래유형','수량(tCO₂e)','단가(원)','거래금액(원)','거래상대'];
  const rows = [
    ['2026-06-10','매도',5000,8420,42100000,'한국환경공단'],
    ['2026-05-22','매도',8000,8380,67040000,'에너지공사'],
    ['2026-04-15','구매',2000,8250,16500000,'환경부'],
    ['2026-03-08','매도',10000,8150,81500000,'한국환경공단'],
  ];
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = '배출권거래이력_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
}

/* ── 연도 비교 차트 업데이트 ── */
function updateYearlyCompare(e) {
  if (!yearlyChart) return;
  const val = e.target.value;
  const ds = yearlyChart.data.datasets;
  const legend = document.getElementById('yearlyLegend');

  // 기존 비교 데이터셋 제거
  yearlyChart.data.datasets = ds.filter(d => !d._compare);

  if (val === 'bau') {
    yearlyChart.data.datasets.push({
      type: 'line', label: 'BAU 기준선', data: YEARLY.bau,
      borderColor: '#E0483D', borderDash: [6, 4], borderWidth: 2,
      pointRadius: 0, tension: 0.3, fill: false, order: 0, _compare: true,
    });
    legend.innerHTML = '<span><i style="background:#0C8AE5"></i>감축 실적</span><span><i class="dashed" style="color:#6E74D6"></i>연간 목표</span><span><i class="dashed" style="color:#E0483D"></i>BAU 기준선</span>';
  } else if (val === '2024') {
    yearlyChart.data.datasets.push({
      type: 'bar', label: '2024년 비교', data: YEARLY.prev2024,
      backgroundColor: 'rgba(174,183,194,.4)', borderRadius: 5, order: 3, barPercentage: 0.6, _compare: true,
    });
    legend.innerHTML = '<span><i style="background:#0C8AE5"></i>감축 실적</span><span><i class="dashed" style="color:#6E74D6"></i>연간 목표</span><span><i style="background:rgba(174,183,194,.6)"></i>2024년 비교</span>';
  } else {
    legend.innerHTML = '<span><i style="background:#0C8AE5"></i>감축 실적</span><span><i class="dashed" style="color:#6E74D6"></i>연간 목표</span>';
  }
  yearlyChart.update();
}

/* ── 토스트 ── */
function showToast(msg) {
  let t = document.getElementById('csToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'csToast';
    Object.assign(t.style, { position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', background:'var(--fg-1)', color:'#fff', padding:'10px 20px', borderRadius:'var(--radius-pill)', font:'500 14px/1 var(--font-sans)', zIndex:'600', pointerEvents:'none', transition:'opacity .2s', opacity:'0' });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}
