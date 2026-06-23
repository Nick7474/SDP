/* page-catalog-access.js — 데이터 접근 관리 */
(function () {
  'use strict';

  /* ════════════════════════════════════
     Mock Data
  ════════════════════════════════════ */
  const APIS = [
    {
      id: 'API_001',
      name: '친환경DRT 실시간 운행 현황',
      dataset: '친환경DRT 운행 현황 데이터',
      endpoint: '/api/v1/drt/realtime',
      method: 'GET',
      provide: 'OpenAPI',
      auth: '인증키 발급',
      fmt: 'JSON',
      cycle: '실시간(1분)',
      calls: 3820,
      resp: '142ms',
      status: 'ok',
      lastCall: '10:14:52',
      lastErr: '없음',
      dept: '교통정책과',
      field: 'mobility',
      spec: 'openapi',
      authType: 'key',
      sample: `{
  "status": "success",
  "timestamp": "2026-06-19T10:14:52+09:00",
  "data": [
    {
      "vehicleId": "DRT-001",
      "routeId": "R201",
      "lat": 37.4784,
      "lng": 126.8636,
      "speed": 38,
      "occupancy": 3
    }
  ]
}`,
      guide: [
        '인증키는 API 포털에서 발급받아 Authorization 헤더로 전달하세요.',
        'lat/lng는 WGS84 좌표계 기준입니다.',
        '응답 데이터는 최대 1분 단위로 갱신됩니다.',
        'pageSize 파라미터로 최대 100건까지 조회 가능합니다.'
      ]
    },
    {
      id: 'API_002',
      name: '태양광 발전량 및 탄소 배출량',
      dataset: '태양광 발전량 및 탄소 배출량',
      endpoint: '/api/v1/energy/solar/summary',
      method: 'GET',
      provide: 'REST API',
      auth: '인증키 발급',
      fmt: 'JSON',
      cycle: '일 1회',
      calls: 2140,
      resp: '88ms',
      status: 'ok',
      lastCall: '10:00:00',
      lastErr: '없음',
      dept: '기후에너지과',
      field: 'energy',
      spec: 'rest',
      authType: 'key',
      sample: `{
  "status": "success",
  "date": "2026-06-19",
  "totalGeneration": 48230,
  "unit": "kWh",
  "byFacility": [
    { "id": "SOL-001", "name": "광명시청 태양광", "gen": 1250 },
    { "id": "SOL-002", "name": "광명시체육관",   "gen": 980 }
  ]
}`,
      guide: [
        'date 파라미터(YYYY-MM-DD)로 조회 날짜를 지정하세요.',
        '시간 범위는 startHour / endHour 파라미터로 필터링할 수 있습니다.',
        '집계 단위는 hourly / daily / monthly를 선택할 수 있습니다.'
      ]
    },
    {
      id: 'API_003',
      name: '대기측정소별 실시간 측정정보',
      dataset: '대기측정소별 실시간 측정정보',
      endpoint: '/api/v1/env/airquality',
      method: 'GET',
      provide: 'OpenAPI',
      auth: '공개 API',
      fmt: 'JSON / XML',
      cycle: '30분',
      calls: 5670,
      resp: '63ms',
      status: 'ok',
      lastCall: '10:13:00',
      lastErr: '없음',
      dept: '기후환경과',
      field: 'env',
      spec: 'openapi',
      authType: 'open',
      sample: `{
  "status": "success",
  "updatedAt": "2026-06-19T10:13:00+09:00",
  "sensors": [
    { "id": "DUST-001", "area": "광명권역", "pm10": 32, "pm25": 18, "grade": "좋음" },
    { "id": "DUST-002", "area": "철산권역", "pm10": 41, "pm25": 22, "grade": "보통" }
  ]
}`,
      guide: [
        '공개 API이므로 별도 인증키 없이 호출할 수 있습니다.',
        'format=xml 파라미터로 XML 포맷 응답을 받을 수 있습니다.',
        'grade 필드: 좋음/보통/나쁨/매우나쁨 4단계로 분류됩니다.'
      ]
    },
    {
      id: 'API_004',
      name: 'AIoT 침수홍수 예측 경보',
      dataset: 'AIoT 침수홍수 예측 데이터',
      endpoint: '/api/v1/safety/flood/alert',
      method: 'GET',
      provide: 'REST API',
      auth: '인증키 발급',
      fmt: 'JSON',
      cycle: '5분',
      calls: 890,
      resp: '107ms',
      status: 'err',
      lastCall: '09:55:10',
      lastErr: '09:55:10 Timeout(5s)',
      dept: '안전총괄과',
      field: 'safety',
      spec: 'rest',
      authType: 'key',
      sample: `{
  "status": "error",
  "code": 504,
  "message": "Gateway Timeout",
  "timestamp": "2026-06-19T09:55:10+09:00"
}`,
      guide: [
        '경보 레벨: 관심/주의/경계/위험 4단계입니다.',
        '응답 지연 시 재시도 로직(exponential backoff)을 적용하세요.',
        '현재 서버 점검 중으로 일시적인 오류가 발생하고 있습니다.'
      ]
    },
    {
      id: 'API_005',
      name: '데이터 카탈로그 메타 조회',
      dataset: '데이터셋 메타 카탈로그',
      endpoint: '/api/v1/catalog/meta',
      method: 'GET',
      provide: 'OpenAPI',
      auth: '내부 전용',
      fmt: 'JSON',
      cycle: '즉시',
      calls: 1240,
      resp: '55ms',
      status: 'ok',
      lastCall: '10:14:05',
      lastErr: '없음',
      dept: '스마트도시과',
      field: 'data',
      spec: 'openapi',
      authType: 'internal',
      sample: `{
  "status": "success",
  "total": 72,
  "page": 1,
  "pageSize": 20,
  "items": [
    { "id": "GM-ENV-002", "name": "태양광 발전량 및 탄소 배출량", "category": "환경", "format": "CSV" },
    { "id": "GM-TRF-001", "name": "교통돌발상황 (UTIC)",          "category": "교통", "format": "JSON" }
  ]
}`,
      guide: [
        '내부 전용 API입니다. VPN 접속 또는 내부망에서만 호출 가능합니다.',
        'q 파라미터로 키워드 검색이 가능합니다.',
        'category / format / status 파라미터로 필터링할 수 있습니다.'
      ]
    },
    {
      id: 'API_006',
      name: '행정 구역 정보 조회',
      dataset: '광명시 행정 구역 데이터',
      endpoint: '/api/v1/admin/district',
      method: 'GET',
      provide: 'REST API',
      auth: '공개 API',
      fmt: 'JSON / GeoJSON',
      cycle: '월간',
      calls: 324,
      resp: '201ms',
      status: 'stop',
      lastCall: '2026-06-10 09:00:00',
      lastErr: '없음 (서비스 중지)',
      dept: '기획조정실',
      field: 'admin',
      spec: 'rest',
      authType: 'open',
      sample: `{
  "status": "stopped",
  "message": "서비스가 임시 중지되었습니다. 2026-07-01 재개 예정입니다.",
  "timestamp": "2026-06-19T10:00:00+09:00"
}`,
      guide: [
        '2026-07-01 서비스 재개 예정입니다.',
        'GeoJSON 포맷은 format=geojson 파라미터로 요청하세요.',
        '행정동 코드는 법정동 코드와 다릅니다(legalCode 파라미터 구분).'
      ]
    }
  ];

  const API_LOGS = [
    { ts: '10:14:52', name: '친환경DRT 실시간 운행 현황', ep: '/api/v1/drt/realtime', method: 'GET', calls: 1, resp: '142ms', status: 'ok', rc: 200, auth: '인증키', ip: '10.0.1.42' },
    { ts: '10:14:30', name: '대기측정소별 실시간 측정정보', ep: '/api/v1/env/airquality', method: 'GET', calls: 3, resp: '63ms', status: 'ok', rc: 200, auth: '공개', ip: '203.247.21.5' },
    { ts: '10:13:55', name: '태양광 발전량 및 탄소 배출량', ep: '/api/v1/energy/solar/summary', method: 'GET', calls: 2, resp: '91ms', status: 'ok', rc: 200, auth: '인증키', ip: '10.0.2.11' },
    { ts: '10:12:17', name: '데이터 카탈로그 메타 조회', ep: '/api/v1/catalog/meta', method: 'GET', calls: 5, resp: '55ms', status: 'ok', rc: 200, auth: '내부', ip: '192.168.1.3' },
    { ts: '09:55:10', name: 'AIoT 침수홍수 예측 경보', ep: '/api/v1/safety/flood/alert', method: 'GET', calls: 1, resp: '5002ms', status: 'err', rc: 504, auth: '인증키', ip: '10.0.1.99' },
    { ts: '09:51:44', name: '친환경DRT 실시간 운행 현황', ep: '/api/v1/drt/realtime', method: 'GET', calls: 1, resp: '138ms', status: 'ok', rc: 200, auth: '인증키', ip: '10.0.1.42' },
    { ts: '09:48:00', name: '대기측정소별 실시간 측정정보', ep: '/api/v1/env/airquality', method: 'GET', calls: 2, resp: '67ms', status: 'ok', rc: 200, auth: '공개', ip: '122.35.47.9' },
    { ts: '09:45:30', name: '태양광 발전량 및 탄소 배출량', ep: '/api/v1/energy/solar/summary', method: 'GET', calls: 1, resp: '88ms', status: 'ok', rc: 200, auth: '인증키', ip: '10.0.2.11' }
  ];

  const KEYS = [
    {
      id: 'KEY_001', user: '이OO', dept: '기후환경과',
      dataset: '친환경DRT 운행 현황 데이터', perm: 'both',
      start: '2026-01-01', end: '2026-12-31',
      granted: '2025-12-28', grantedBy: '관리자',
      status: 'active',
      apiKey: 'GM-API-A1B2-F8E3',
      rejectReason: null,
      purpose: '친환경DRT 노선 최적화 연구를 위한 데이터 분석',
      reason: '환경부 과제 수행을 위한 운행 패턴 분석',
      scope: 'API + 다운로드', fmt: 'JSON',
      log: [
        { ts: '2025-12-28 09:00', msg: '권한 요청 접수', who: '이OO', type: 'req' },
        { ts: '2025-12-29 14:00', msg: '승인 처리 완료', who: '관리자', type: 'ok' }
      ]
    },
    {
      id: 'KEY_002', user: '박OO', dept: '기획예산과',
      dataset: '태양광 발전량 및 탄소 배출량', perm: 'read',
      start: '2026-03-01', end: '2026-08-31',
      granted: '2026-02-25', grantedBy: '관리자',
      status: 'active',
      apiKey: 'GM-API-C3D4-A2B1',
      rejectReason: null,
      purpose: '탄소중립 이행 현황 보고서 작성',
      reason: '시의회 업무보고 자료 준비',
      scope: 'API 열람', fmt: 'JSON',
      log: [
        { ts: '2026-02-20 10:00', msg: '권한 요청 접수', who: '박OO', type: 'req' },
        { ts: '2026-02-25 11:30', msg: '승인 처리 완료', who: '관리자', type: 'ok' }
      ]
    },
    {
      id: 'KEY_003', user: '김OO', dept: '안전총괄과',
      dataset: 'AIoT 침수홍수 예측 데이터', perm: 'both',
      start: '2026-04-01', end: '2026-06-30',
      granted: '2026-03-28', grantedBy: '관리자',
      status: 'expiring',
      apiKey: 'GM-API-E5F6-C4D2',
      rejectReason: null,
      purpose: '우기 대비 침수 위험 모니터링',
      reason: '재난 안전 시스템 연계 목적',
      scope: 'API + 다운로드', fmt: 'JSON',
      log: [
        { ts: '2026-03-20 09:00', msg: '권한 요청 접수', who: '김OO', type: 'req' },
        { ts: '2026-03-28 16:00', msg: '승인 처리 완료', who: '관리자', type: 'ok' }
      ]
    },
    {
      id: 'KEY_004', user: '정OO', dept: '교통정책과',
      dataset: '친환경DRT 운행 현황 데이터', perm: 'download',
      start: '2025-06-01', end: '2025-12-31',
      granted: '2025-05-30', grantedBy: '관리자',
      status: 'expired',
      apiKey: 'GM-API-G7H8-E5F3',
      rejectReason: '유효기간 초과 — 재신청 바랍니다.',
      purpose: '교통 불편 민원 분석',
      reason: '노선 효율화 정책 수립',
      scope: '다운로드', fmt: 'CSV',
      log: [
        { ts: '2025-05-25 10:00', msg: '권한 요청 접수', who: '정OO', type: 'req' },
        { ts: '2025-05-30 11:00', msg: '승인 처리 완료', who: '관리자', type: 'ok' },
        { ts: '2026-01-01 00:00', msg: '유효기간 만료', who: '시스템', type: 'warn' }
      ]
    },
    {
      id: 'KEY_005', user: '최OO', dept: '스마트도시과',
      dataset: '대기측정소별 실시간 측정정보', perm: 'both',
      start: '2026-05-01', end: '2026-10-31',
      granted: '2026-04-28', grantedBy: '관리자',
      status: 'active',
      apiKey: 'GM-API-I9J0-G6H4',
      rejectReason: null,
      purpose: '스마트시티 대기질 통합 모니터링',
      reason: '환경부 사업 연계 목적',
      scope: 'API + 다운로드', fmt: 'JSON',
      log: [
        { ts: '2026-04-22 09:00', msg: '권한 요청 접수', who: '최OO', type: 'req' },
        { ts: '2026-04-28 14:00', msg: '승인 처리 완료', who: '관리자', type: 'ok' }
      ]
    }
  ];

  /* ════════════════════════════════════
     유틸
  ════════════════════════════════════ */
  function methodBadge(m) {
    const cls = { GET:'get', POST:'post', PUT:'put', DELETE:'del' }[m] || 'get';
    return `<span class="method-badge method-badge--${cls}">${m}</span>`;
  }

  function statusBadge(s) {
    const map = { ok: ['ac-status--ok','정상'], err: ['ac-status--err','오류'], stop: ['ac-status--stop','중지'] };
    const [cls, lbl] = map[s] || map.ok;
    return `<span class="ac-status ${cls}">${lbl}</span>`;
  }

  function permBadge(p) {
    const map = { both: ['perm-badge--both','열람+다운로드'], read: ['perm-badge--read','열람'], download: ['perm-badge--download','다운로드'] };
    const [cls, lbl] = map[p] || map.read;
    return `<span class="perm-badge ${cls}">${lbl}</span>`;
  }

  function keyStatusBadge(s) {
    const map = { active: ['key-status--active','활성'], expiring: ['key-status--expiring','만료임박'], expired: ['key-status--expired','만료'] };
    const [cls, lbl] = map[s] || map.active;
    return `<span class="key-status ${cls}">${lbl}</span>`;
  }

  function rcBadge(code) {
    const cls = code >= 500 ? '5' : code >= 400 ? '4' : '2';
    return `<span class="rc-badge rc-badge--${cls}">${code}</span>`;
  }

  /* D-Day 계산 */
  function calcDDay(endDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);
    return Math.round((end - today) / (1000 * 60 * 60 * 24));
  }

  function ddayBadge(d) {
    if (d < 0)   return `<span class="dday-badge dday-badge--expired">만료</span>`;
    if (d <= 7)  return `<span class="dday-badge dday-badge--danger">D-${d}</span>`;
    if (d <= 30) return `<span class="dday-badge dday-badge--warn">D-${d}</span>`;
    return `<span class="dday-badge dday-badge--ok">D-${d}</span>`;
  }

  /* 처리 단계 트래커 */
  function renderTracker(k) {
    const el = document.getElementById('kd_tracker');
    if (!el) return;
    const isRej = k.rejectReason && k.status === 'expired';
    const finalLabel = isRej ? '반려' : (k.status === 'active' || k.status === 'expiring') ? '승인' : '완료';
    const finalCls   = isRej ? 'done rej' : 'done';
    const finalIcon  = isRej ? '✕' : '✓';
    const steps = [
      { label: '신청접수', cls: 'done', icon: '✓' },
      { label: '검토',     cls: 'done', icon: '✓' },
      { label: finalLabel, cls: finalCls, icon: finalIcon }
    ];
    el.innerHTML = steps.map((s, i) => `
      ${i > 0 ? `<div class="kd-tracker__conn active"></div>` : ''}
      <div class="kd-tracker__step ${s.cls}">
        <div class="kd-tracker__dot">${s.icon}</div>
        <div class="kd-tracker__lbl">${s.label}</div>
      </div>`).join('');
  }

  /* ════════════════════════════════════
     탭 전환
  ════════════════════════════════════ */
  const TAB_META = {
    api: { label: '데이터 현황',  desc: '제공 API와 데이터 접근 상태, 호출 현황, 오류 여부를 목록에서 확인합니다.' },
    key: { label: '인증키 관리', desc: '데이터 접근에 사용되는 인증키를 발급·회수·관리합니다.' }
  };

  function initTabs() {
    if (window.gmsbSetTab) gmsbSetTab(TAB_META.api.label, TAB_META.api.desc);
    const tabs = document.querySelectorAll('.page-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        const active = tab.dataset.tab;
        document.getElementById('tabApi').style.display = active === 'api' ? '' : 'none';
        document.getElementById('tabKey').style.display = active === 'key' ? '' : 'none';
        if (TAB_META[active] && window.gmsbSetTab) gmsbSetTab(TAB_META[active].label, TAB_META[active].desc);
      });
    });
  }

  /* ════════════════════════════════════
     탭 1: API 현황
  ════════════════════════════════════ */
  let apiFilters = { status: 'all', field: '', spec: '', auth: '', q: '' };
  const API_PAGE_SIZE = 5;
  let apiPage = 1;

  function filteredApis() {
    return APIS.filter(a => {
      if (apiFilters.status !== 'all' && a.status !== apiFilters.status) return false;
      if (apiFilters.field && a.field !== apiFilters.field) return false;
      if (apiFilters.spec  && a.spec  !== apiFilters.spec)  return false;
      if (apiFilters.auth  && a.authType !== apiFilters.auth) return false;
      if (apiFilters.q) {
        const q = apiFilters.q.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.dataset.toLowerCase().includes(q) && !a.endpoint.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  function renderApiTable() {
    const data = filteredApis();
    const tbody = document.getElementById('apiTbody');
    if (!data.length) {
      tbody.innerHTML = `<tr class="tbl__empty"><td colspan="11"><i data-lucide="inbox"></i>조건에 맞는 API가 없습니다.</td></tr>`;
      lucide.createIcons();
      return;
    }
    const start = (apiPage - 1) * API_PAGE_SIZE;
    const slice = data.slice(start, start + API_PAGE_SIZE);
    tbody.innerHTML = slice.map(a => `
      <tr data-id="${a.id}">
        <td class="name l"><a href="#" class="ac-detail-btn" data-id="${a.id}" style="color:var(--gp-primary);text-decoration:none;font-weight:600">${a.name}</a></td>
        <td class="ds-name l">${a.dataset}</td>
        <td class="ep l"><code>${a.endpoint}</code></td>
        <td>${methodBadge(a.method)}</td>
        <td><span style="font-size:12px;color:var(--fg-3)">${a.provide}</span></td>
        <td><span style="font-size:12px;color:var(--fg-3)">${a.auth}</span></td>
        <td class="ac-calls">${a.calls.toLocaleString()}</td>
        <td style="font-size:12px;color:var(--fg-3)">${a.resp}</td>
        <td>${statusBadge(a.status)}</td>
        <td style="font-size:12px;color:var(--fg-4);white-space:nowrap">${a.lastCall}</td>
        <td style="text-align:center">
          <button class="tbtn tbtn--sm ac-api-btn" data-id="${a.id}" type="button">보기</button>
        </td>
      </tr>`).join('');
    lucide.createIcons();
    renderApiPagination(data.length);

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => openApiDrawer(tr.dataset.id));
      tr.querySelector('.ac-api-btn').addEventListener('click', e => {
        e.stopPropagation();
        openApiDrawer(tr.dataset.id);
      });
    });
    tbody.querySelectorAll('.ac-detail-btn').forEach(a => {
      a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openApiDrawer(a.dataset.id); });
    });
  }

  function buildPgBtns(page, pages, prefix) {
    const MAX = 5;
    let s = Math.max(1, page - Math.floor(MAX / 2));
    let e = Math.min(pages, s + MAX - 1);
    if (e - s < MAX - 1) s = Math.max(1, e - MAX + 1);
    let b = `<button class="ds-pg-btn" id="${prefix}First" ${page===1?'disabled':''}>&laquo;</button>`;
    b += `<button class="ds-pg-btn" id="${prefix}Prev" ${page===1?'disabled':''}>&lsaquo;</button>`;
    if (s > 1) { b += `<button class="ds-pg-btn" data-pg="1">1</button>`; if (s > 2) b += `<span class="ds-pg-sep">…</span>`; }
    for (let i = s; i <= e; i++) b += `<button class="ds-pg-btn ${i===page?'on':''}" data-pg="${i}">${i}</button>`;
    if (e < pages) { if (e < pages-1) b += `<span class="ds-pg-sep">…</span>`; b += `<button class="ds-pg-btn" data-pg="${pages}">${pages}</button>`; }
    b += `<button class="ds-pg-btn" id="${prefix}Next" ${page===pages?'disabled':''}>&rsaquo;</button>`;
    b += `<button class="ds-pg-btn" id="${prefix}Last" ${page===pages?'disabled':''}>&raquo;</button>`;
    return b;
  }

  function bindPgBtns(pag, pages, getPage, setPage) {
    pag.querySelectorAll('[data-pg]').forEach(btn => {
      btn.addEventListener('click', () => { setPage(+btn.dataset.pg); });
    });
    pag.querySelector('[id$="First"]')?.addEventListener('click', () => { if (getPage() > 1) setPage(1); });
    pag.querySelector('[id$="Prev"]')?.addEventListener('click',  () => { if (getPage() > 1) setPage(getPage() - 1); });
    pag.querySelector('[id$="Next"]')?.addEventListener('click',  () => { if (getPage() < pages) setPage(getPage() + 1); });
    pag.querySelector('[id$="Last"]')?.addEventListener('click',  () => { if (getPage() < pages) setPage(pages); });
  }

  function renderApiPagination(total) {
    const pages = Math.ceil(total / API_PAGE_SIZE) || 1;
    const pag = document.getElementById('apiPagination');
    if (pages <= 1) {
      pag.innerHTML = `<span class="ds-pg-info">전체 ${total}건</span><div></div><div></div>`;
      return;
    }
    pag.innerHTML = `<span class="ds-pg-info">전체 ${total}건</span><div class="ds-pg-btns">${buildPgBtns(apiPage, pages, 'api')}</div><div></div>`;
    bindPgBtns(pag, pages, () => apiPage, p => { apiPage = p; renderApiTable(); });
  }

  function renderApiLog() {
    const tbody = document.getElementById('apiLogTbody');
    tbody.innerHTML = API_LOGS.map(l => `
      <tr>
        <td class="ts">${l.ts}</td>
        <td class="l" style="font-weight:600;font-size:13px">${l.name}</td>
        <td class="ep l"><code style="font-size:11px">${l.ep}</code></td>
        <td>${methodBadge(l.method)}</td>
        <td style="font-weight:700;font-size:13px">${l.calls}</td>
        <td style="font-size:12px;color:${l.status==='err'?'var(--status-danger)':'var(--fg-3)'}">${l.resp}</td>
        <td>${statusBadge(l.status)}</td>
        <td>${rcBadge(l.rc)}</td>
        <td><span style="font-size:12px;color:var(--fg-3)">${l.auth}</span></td>
        <td style="font-size:12px;font-family:monospace;color:var(--fg-4)">${l.ip}</td>
      </tr>`).join('');
  }

  function initApiFilters() {
    const statusGrp = document.getElementById('apiStatusGroup');
    if (statusGrp) {
      statusGrp.querySelectorAll('.api-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          statusGrp.querySelectorAll('.api-chip').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
          apiFilters.status = btn.dataset.val || 'all';
          apiPage = 1; renderApiTable();
        });
      });
    }

    const fieldGrp = document.getElementById('apiFieldGroup');
    if (fieldGrp) {
      fieldGrp.querySelectorAll('.api-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          fieldGrp.querySelectorAll('.api-chip').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
          apiFilters.field = btn.dataset.val || '';
          apiPage = 1; renderApiTable();
        });
      });
    }

    const specSel = document.getElementById('apiSpec');
    if (specSel) specSel.addEventListener('change', () => {
      apiFilters.spec = specSel.value;
      apiPage = 1; renderApiTable();
    });

    const authSel = document.getElementById('apiAuth');
    if (authSel) authSel.addEventListener('change', () => {
      apiFilters.auth = authSel.value;
      apiPage = 1; renderApiTable();
    });

    const searchInput = document.getElementById('apiSearch');
    if (searchInput) searchInput.addEventListener('input', e => {
      apiFilters.q = e.target.value.trim();
      apiPage = 1; renderApiTable();
    });

    const searchBtn = document.getElementById('btnApiSearch');
    if (searchBtn) searchBtn.addEventListener('click', () => {
      apiFilters.q = (document.getElementById('apiSearch') || {}).value || '';
      apiPage = 1; renderApiTable();
    });

    const resetBtn = document.getElementById('btnApiReset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.api-chip-group .api-chip').forEach(c => c.classList.remove('on'));
      document.querySelectorAll('.api-chip-group .api-chip[data-val=""]').forEach(c => c.classList.add('on'));
      const sp = document.getElementById('apiSpec');
      const au = document.getElementById('apiAuth');
      const si = document.getElementById('apiSearch');
      if (sp) sp.value = '';
      if (au) au.value = '';
      if (si) si.value = '';
      apiFilters = { status: 'all', field: '', spec: '', auth: '', q: '' };
      apiPage = 1; renderApiTable();
    });
  }

  /* ════════════════════════════════════
     API 드로어
  ════════════════════════════════════ */
  function openApiDrawer(id) {
    const a = APIS.find(x => x.id === id);
    if (!a) return;

    document.getElementById('ad_title').textContent = a.id;
    document.getElementById('ad_statusBadge').innerHTML = statusBadge(a.status);
    document.getElementById('ad_desc').textContent = a.name;
    document.getElementById('ad_dataset').textContent = a.dataset;
    document.getElementById('ad_endpoint').textContent = a.endpoint;
    document.getElementById('ad_method').innerHTML = methodBadge(a.method);
    document.getElementById('ad_provide').textContent = a.provide;
    document.getElementById('ad_auth').textContent = a.auth;
    document.getElementById('ad_fmt').textContent = a.fmt;
    document.getElementById('ad_cycle').textContent = a.cycle;
    document.getElementById('ad_resp').textContent = a.resp;
    document.getElementById('ad_calls').textContent = a.calls.toLocaleString() + '건';
    document.getElementById('ad_lasterr').innerHTML = a.status === 'err'
      ? `<span style="color:var(--status-danger)">${a.lastErr}</span>`
      : `<span style="color:var(--status-success)">${a.lastErr}</span>`;
    document.getElementById('ad_dept').textContent = a.dept;
    document.getElementById('ad_status').innerHTML = statusBadge(a.status);
    document.getElementById('ad_code').textContent = a.sample;
    document.getElementById('ad_guide').innerHTML = a.guide.map(g => `<li>${g}</li>`).join('');

    openDrawer('apiDrawer');
  }

  document.getElementById('adCopyBtn').addEventListener('click', () => {
    const code = document.getElementById('ad_code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.getElementById('adCopyBtn');
      btn.style.background = 'rgba(34,197,94,.3)';
      setTimeout(() => { btn.style.background = ''; }, 1200);
    });
  });

  /* ════════════════════════════════════
     탭 2: 인증키 관리
  ════════════════════════════════════ */
  const KEY_PAGE_SIZE = 5;
  let keyPage = 1;
  let currentKeyId = null;

  function filteredKeys() {
    const ds = document.getElementById('keyDataset')?.value || '';
    const q = (document.getElementById('keySearch')?.value || '').toLowerCase().trim();
    return KEYS.filter(k => {
      if (keyFilters.status && k.status !== keyFilters.status) return false;
      if (keyFilters.perm && k.perm !== keyFilters.perm) return false;
      if (ds && k.dataset !== ds) return false;
      if (q && !k.user.toLowerCase().includes(q) && !k.dept.toLowerCase().includes(q) && !k.dataset.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderKeyTable() {
    const data = filteredKeys();
    const tbody = document.getElementById('keyTbody');
    const countEl = document.getElementById('keyCount');
    if (countEl) countEl.textContent = `전체 ${data.length}건`;
    if (!data.length) {
      tbody.innerHTML = `<tr class="tbl__empty"><td colspan="12"><i data-lucide="inbox"></i>조건에 맞는 권한이 없습니다.</td></tr>`;
      lucide.createIcons();
      document.getElementById('keyPagination').innerHTML = '<span class="ds-pg-info">전체 0건</span><div></div><div></div>';
      return;
    }
    const start = (keyPage - 1) * KEY_PAGE_SIZE;
    const slice = data.slice(start, start + KEY_PAGE_SIZE);
    tbody.innerHTML = slice.map(k => {
      const dday = calcDDay(k.end);
      const maskedKey = k.apiKey
        ? k.apiKey.replace(/([A-Z0-9]{4})-([A-Z0-9]{4})$/, '••••-$2')
        : '—';
      return `
        <tr data-kid="${k.id}">
          <td class="user-cell"><div class="ac-key-cell-name">${k.user}</div></td>
          <td style="font-size:12px;color:var(--fg-3)">${k.dept}</td>
          <td style="text-align:left;font-size:13px;font-weight:500;color:var(--fg-2)">${k.dataset}</td>
          <td>${permBadge(k.perm)}</td>
          <td>
            ${k.apiKey
              ? `<span class="ac-key-val"><span>${maskedKey}</span><button class="ac-key-copy" data-key="${k.apiKey}" type="button" title="API 키 복사"><i data-lucide="copy"></i></button></span>`
              : '<span style="color:var(--fg-disabled)">—</span>'}
          </td>
          <td style="text-align:center">${ddayBadge(dday)}</td>
          <td class="ac-key-period">${k.start} ~ ${k.end}</td>
          <td style="font-size:12px;color:var(--fg-4);white-space:nowrap">${k.granted}</td>
          <td style="font-size:12px;color:var(--fg-3)">${k.grantedBy}</td>
          <td>${keyStatusBadge(k.status)}</td>
          <td class="ac-reject-cell">${k.rejectReason || '<span style="color:var(--fg-disabled)">—</span>'}</td>
          <td style="text-align:center;white-space:nowrap">
            <button class="tbtn tbtn--sm ac-key-btn" data-kid="${k.id}" type="button">보기</button>
            <button class="tbtn tbtn--sm ac-key-extend-btn" data-kid="${k.id}" type="button" style="margin-left:4px;color:var(--gp-primary)">기간연장</button>
            <button class="tbtn tbtn--sm ac-key-revoke-btn" data-kid="${k.id}" type="button" style="margin-left:4px;color:var(--status-danger)"${k.status === 'expired' ? ' disabled' : ''}>회수</button>
          </td>
        </tr>`;
    }).join('');
    lucide.createIcons();
    renderKeyPagination(data.length);

    tbody.querySelectorAll('tr[data-kid]').forEach(tr => {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => openKeyDrawer(tr.dataset.kid));
      tr.querySelector('.ac-key-btn').addEventListener('click', e => {
        e.stopPropagation();
        openKeyDrawer(tr.dataset.kid);
      });
    });
    tbody.querySelectorAll('.ac-key-extend-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openExtendModal(btn.dataset.kid);
      });
    });
    tbody.querySelectorAll('.ac-key-revoke-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        openRevokeModal(btn.dataset.kid);
      });
    });
    tbody.querySelectorAll('.ac-key-copy').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(btn.dataset.key).then(() => showToast('API 키가 복사되었습니다.'));
        }
      });
    });
  }

  function renderKeyPagination(total) {
    const pages = Math.ceil(total / KEY_PAGE_SIZE) || 1;
    const pag = document.getElementById('keyPagination');
    if (pages <= 1) {
      pag.innerHTML = `<span class="ds-pg-info">전체 ${total}건</span><div></div><div></div>`;
      return;
    }
    pag.innerHTML = `<span class="ds-pg-info">전체 ${total}건</span><div class="ds-pg-btns">${buildPgBtns(keyPage, pages, 'key')}</div><div></div>`;
    bindPgBtns(pag, pages, () => keyPage, p => { keyPage = p; renderKeyTable(); });
  }

  /* ════════════════════════════════════
     권한 드로어
  ════════════════════════════════════ */
  function openKeyDrawer(id) {
    currentKeyId = id;
    const k = KEYS.find(x => x.id === id);
    if (!k) return;

    document.getElementById('kd_statusBadge').innerHTML = keyStatusBadge(k.status);
    const permLabel = { both:'열람+다운로드 권한', read:'열람 권한', download:'다운로드 권한' }[k.perm] || '권한';
    document.getElementById('kd_typeLabel').textContent = permLabel + ' 상세';

    document.getElementById('kd_reqDate').textContent = k.granted;
    document.getElementById('kd_reqUser').textContent = k.user;
    document.getElementById('kd_reqDept').textContent = k.dept;
    document.getElementById('kd_dataset').textContent = k.dataset;
    document.getElementById('kd_dsDesc').textContent = '광명시 ' + k.dataset + '의 공식 제공 데이터입니다.';
    document.getElementById('kd_type').innerHTML = permBadge(k.perm);
    document.getElementById('kd_scope').textContent = k.scope;
    document.getElementById('kd_fmt').textContent = k.fmt;
    document.getElementById('kd_period').textContent = k.start + ' ~ ' + k.end;
    document.getElementById('kd_status').innerHTML = keyStatusBadge(k.status);
    document.getElementById('kd_purpose').textContent = k.purpose;
    document.getElementById('kd_reason').textContent = k.reason;

    const memoEl = document.getElementById('kdReviewMemo');
    if (memoEl) memoEl.value = '';

    const dotMap = { req:'log-dot--req', ok:'log-dot--ok', warn:'log-dot--warn', rej:'log-dot--rej', hold:'log-dot--hold' };
    document.getElementById('kd_log').innerHTML = k.log.map(l => `
      <div class="log-item">
        <div class="log-dot ${dotMap[l.type] || 'log-dot--req'}"></div>
        <div class="log-body">
          <div class="log-ts">${l.ts}</div>
          <div class="log-msg">${l.msg}</div>
          <div class="log-who">${l.who}</div>
        </div>
      </div>`).join('');

    renderTracker(k);
    openDrawer('keyDrawer');
  }

  /* ════════════════════════════════════
     드로어 공통
  ════════════════════════════════════ */
  function openDrawer(drawerId) {
    document.getElementById(drawerId).classList.add('on');
    document.getElementById(drawerId).setAttribute('aria-hidden', 'false');
    document.getElementById('scrim').classList.add('on');
    lucide.createIcons();
  }

  function closeDrawer() {
    document.querySelectorAll('.drawer.on').forEach(d => {
      d.classList.remove('on');
      d.setAttribute('aria-hidden', 'true');
    });
    document.getElementById('scrim').classList.remove('on');
  }

  function nowStr() {
    return new Date().toLocaleString('ko-KR', { hour12: false }).replace(/\. /g, '-').replace('.', '').slice(0, 16);
  }

  function initDrawers() {
    ['adClose', 'adCloseBtn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', closeDrawer);
    });
    ['kdClose', 'kdCloseBtn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', closeDrawer);
    });
    document.getElementById('kdApproveBtn')?.addEventListener('click', () => {
      const k = KEYS.find(x => x.id === currentKeyId);
      if (k) {
        const memo = document.getElementById('kdReviewMemo')?.value?.trim();
        k.status = 'active';
        k.log.push({ ts: nowStr(), msg: '승인 처리' + (memo ? ': ' + memo : ''), who: '관리자', type: 'ok' });
        renderKeyTable();
        showToast('승인되었습니다.');
      }
      closeDrawer();
    });
    document.getElementById('kdRejectBtn')?.addEventListener('click', () => {
      const k = KEYS.find(x => x.id === currentKeyId);
      if (k) {
        const memo = document.getElementById('kdReviewMemo')?.value?.trim();
        k.status = 'expired';
        k.rejectReason = memo || '반려 처리됨';
        k.log.push({ ts: nowStr(), msg: '반려 처리: ' + (memo || '사유 없음'), who: '관리자', type: 'rej' });
        renderKeyTable();
        showToast('반려되었습니다.');
      }
      closeDrawer();
    });
    document.getElementById('kdHoldBtn')?.addEventListener('click', () => {
      const k = KEYS.find(x => x.id === currentKeyId);
      if (k) {
        const memo = document.getElementById('kdReviewMemo')?.value?.trim();
        k.status = 'expiring';
        k.log.push({ ts: nowStr(), msg: '보류 처리' + (memo ? ': ' + memo : ''), who: '관리자', type: 'hold' });
        renderKeyTable();
        showToast('보류 처리되었습니다.');
      }
      closeDrawer();
    });
    document.getElementById('kdExtendBtn')?.addEventListener('click', () => {
      if (currentKeyId) openExtendModal(currentKeyId);
    });
    document.getElementById('kdRevokeBtn')?.addEventListener('click', () => {
      if (currentKeyId) openRevokeModal(currentKeyId);
    });
    document.getElementById('adDocBtn')?.addEventListener('click', () => {
      showToast('API 명세 문서를 새 창에서 엽니다.');
      window.open('about:blank', '_blank');
    });
    document.getElementById('adKeyBtn')?.addEventListener('click', () => {
      closeDrawer();
      const tabs = document.querySelectorAll('.page-tab');
      tabs.forEach(t => t.classList.remove('on'));
      const keyTab = document.querySelector('.page-tab[data-tab="key"]');
      if (keyTab) keyTab.classList.add('on');
      document.getElementById('tabApi').style.display = 'none';
      document.getElementById('tabKey').style.display = '';
      window.scrollTo(0, 0);
      showToast('인증키 관리 탭으로 이동했습니다.');
    });
    document.getElementById('adLogBtn')?.addEventListener('click', () => {
      showToast('호출 로그 상세 조회 기능이 준비 중입니다.');
    });
    document.getElementById('scrim').addEventListener('click', closeDrawer);
  }

  /* ════════════════════════════════════
     인증키 관리 수평 필터
  ════════════════════════════════════ */
  let keyFilters = { status: '', perm: '' };

  function initKeyFilter() {
    /* 칩 그룹 토글 */
    ['keyStatusGroup', 'keyPermGroup'].forEach(groupId => {
      const group = document.getElementById(groupId);
      if (!group) return;
      const field = groupId === 'keyStatusGroup' ? 'status' : 'perm';
      group.querySelectorAll('.key-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          group.querySelectorAll('.key-chip').forEach(c => c.classList.remove('on'));
          chip.classList.add('on');
          keyFilters[field] = chip.dataset.val;
        });
      });
    });

    /* 실시간 검색 */
    document.getElementById('keySearch')?.addEventListener('input', () => { keyPage = 1; renderKeyTable(); });
    document.getElementById('keyDataset')?.addEventListener('change', () => { keyPage = 1; renderKeyTable(); });

    /* 조회 / 초기화 */
    document.getElementById('btnKeySearch')?.addEventListener('click', () => {
      keyPage = 1; renderKeyTable();
    });
    document.getElementById('btnKeyReset')?.addEventListener('click', () => {
      keyFilters = { status: '', perm: '' };
      document.querySelectorAll('#keyStatusGroup .key-chip, #keyPermGroup .key-chip').forEach(c => c.classList.remove('on'));
      document.querySelector('#keyStatusGroup .key-chip[data-val=""]')?.classList.add('on');
      document.querySelector('#keyPermGroup .key-chip[data-val=""]')?.classList.add('on');
      const ds = document.getElementById('keyDataset');
      if (ds) ds.value = '';
      const ks = document.getElementById('keySearch');
      if (ks) ks.value = '';
      keyPage = 1; renderKeyTable();
    });
  }

  /* ════════════════════════════════════
     권한 부여 드로어
  ════════════════════════════════════ */
  function initGrantDrawer() {
    const GRANT_USERS = [
      { name: '이OO', dept: '기후환경과' },
      { name: '박OO', dept: '교통정책과' },
      { name: '김OO', dept: '안전총괄과' },
      { name: '최OO', dept: '스마트도시과' },
      { name: '정OO', dept: '환경정책과' },
      { name: '강OO', dept: '기후에너지과' },
      { name: '조OO', dept: '보건행정과' },
      { name: '한OO', dept: '복지정책과' },
      { name: '임OO', dept: '세정과' },
      { name: '유OO', dept: '상수도과' }
    ];
    let selectedGrantUser = null;

    function renderGrantUserChip(u) {
      const wrap = document.getElementById('grantUserChip');
      if (!wrap) return;
      selectedGrantUser = u;
      wrap.innerHTML = `<div class="ac-user-chip">
        <span class="ac-user-chip__avatar">${u.name[0]}</span>
        <span class="ac-user-chip__name">${u.name}</span>
        <span class="ac-user-chip__dept">${u.dept}</span>
        <button class="ac-user-chip__del" type="button">×</button>
      </div>`;
      wrap.querySelector('.ac-user-chip__del')?.addEventListener('click', () => {
        wrap.innerHTML = '';
        selectedGrantUser = null;
      });
    }

    /* 사용자 검색 */
    const userSearchInput = document.getElementById('grantUserSearch');
    if (userSearchInput) {
      userSearchInput.addEventListener('input', () => {
        const q = userSearchInput.value.toLowerCase().trim();
        if (!q) return;
        const found = GRANT_USERS.find(u =>
          u.name.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q)
        );
        if (found) renderGrantUserChip(found);
      });
    }

    document.getElementById('btnGrantOpen')?.addEventListener('click', () => openDrawer('grantDrawer'));
    document.getElementById('grantDrawerClose')?.addEventListener('click', closeDrawer);

    /* 권한 부여 실행 */
    document.getElementById('grantBtn')?.addEventListener('click', () => {
      const dataset = document.getElementById('grantDataset')?.value || '';
      const perm    = document.querySelector('input[name="grantType"]:checked')?.value || 'read';
      const dateInputs = document.querySelectorAll('.ac-date-input');
      const startDate  = dateInputs[0]?.value || new Date().toISOString().slice(0, 10);
      const endDate    = dateInputs[1]?.value || '';
      const memo       = document.getElementById('grantMemo')?.value?.trim() || '';
      const u          = selectedGrantUser || GRANT_USERS[0];
      const permScopeMap = { both: 'API + 다운로드', read: 'API 열람', download: '다운로드' };
      const newId = 'KEY_N' + String(Date.now()).slice(-4);

      KEYS.unshift({
        id: newId, user: u.name, dept: u.dept,
        dataset, perm,
        start: startDate, end: endDate,
        granted: new Date().toISOString().slice(0, 10),
        grantedBy: '관리자',
        status: 'active',
        apiKey: 'GM-API-' + Math.random().toString(36).slice(2,6).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase(),
        rejectReason: null,
        purpose: memo || '데이터 접근 권한 부여',
        reason: memo,
        scope: permScopeMap[perm] || 'API 열람', fmt: 'JSON',
        log: [{ ts: nowStr(), msg: '권한 부여 처리', who: '관리자', type: 'ok' }]
      });

      keyPage = 1;
      renderKeyTable();
      showToast(`${u.name}님에게 권한이 부여되었습니다.`);
      closeDrawer();

      /* 초기화 */
      if (userSearchInput) userSearchInput.value = '';
      const chipWrap = document.getElementById('grantUserChip');
      if (chipWrap) chipWrap.innerHTML = '';
      selectedGrantUser = null;
      const memoEl = document.getElementById('grantMemo');
      if (memoEl) memoEl.value = '';
    });

    /* 메모 템플릿 칩 */
    const memo = document.getElementById('grantMemo');
    document.querySelectorAll('.ac-tpl-chip').forEach(btn => {
      btn.addEventListener('click', () => { if (memo) memo.value = btn.dataset.tpl; });
    });
  }

  function initTplChips() { /* initGrantDrawer 내부로 통합 — 호환 유지용 noop */ }

  /* ════════════════════════════════════
     기간 연장 모달
  ════════════════════════════════════ */
  let extendKeyId = null;

  function openExtendModal(id) {
    const k = KEYS.find(x => x.id === id);
    if (!k) return;
    extendKeyId = id;
    const endEl = document.getElementById('extendCurrentEnd');
    const newEl = document.getElementById('extendNewEnd');
    if (endEl) endEl.value = k.end;
    if (newEl) { newEl.value = ''; newEl.min = k.end; }
    const overlay = document.getElementById('extendOverlay');
    if (overlay) { overlay.style.display = 'flex'; lucide.createIcons(); }
  }

  function closeExtendModal() {
    const overlay = document.getElementById('extendOverlay');
    if (overlay) overlay.style.display = 'none';
    extendKeyId = null;
  }

  function initExtendModal() {
    document.getElementById('extendCloseBtn')?.addEventListener('click', closeExtendModal);
    document.getElementById('extendCancelBtn')?.addEventListener('click', closeExtendModal);
    document.getElementById('extendBg')?.addEventListener('click', closeExtendModal);
    document.getElementById('extendSaveBtn')?.addEventListener('click', () => {
      const newEnd = document.getElementById('extendNewEnd')?.value;
      if (!newEnd) { showToast('새 종료일을 선택해 주세요.'); return; }
      const k = KEYS.find(x => x.id === extendKeyId);
      if (!k) return;
      if (newEnd <= k.end) { showToast('새 종료일은 현재 종료일 이후여야 합니다.'); return; }
      k.end = newEnd;
      k.log.push({ ts: nowStr(), msg: `기간 연장: ${newEnd}까지`, who: '관리자', type: 'ok' });
      renderKeyTable();
      closeExtendModal();
      showToast(`유효 기간이 ${newEnd}까지 연장되었습니다.`);
    });
  }

  /* ════════════════════════════════════
     권한 회수 모달
  ════════════════════════════════════ */
  let revokeKeyId = null;

  function openRevokeModal(id) {
    const k = KEYS.find(x => x.id === id);
    if (!k) return;
    revokeKeyId = id;
    const msg = document.getElementById('revokeMsg');
    if (msg) msg.innerHTML = `<strong>${k.user}</strong>(${k.dept})님의 <strong>${k.dataset}</strong> 접근 권한을 즉시 회수합니다.<br>이 작업은 되돌릴 수 없습니다.`;
    const overlay = document.getElementById('revokeOverlay');
    if (overlay) { overlay.style.display = 'flex'; lucide.createIcons(); }
  }

  function closeRevokeModal() {
    const overlay = document.getElementById('revokeOverlay');
    if (overlay) overlay.style.display = 'none';
    revokeKeyId = null;
  }

  function initRevokeModal() {
    document.getElementById('revokeCancelBtn')?.addEventListener('click', closeRevokeModal);
    document.getElementById('revokeBg')?.addEventListener('click', closeRevokeModal);
    document.getElementById('revokeConfirmBtn')?.addEventListener('click', () => {
      const k = KEYS.find(x => x.id === revokeKeyId);
      if (!k) return;
      k.status = 'expired';
      k.rejectReason = '관리자 권한 회수';
      k.log.push({ ts: nowStr(), msg: '권한 회수 처리', who: '관리자', type: 'rej' });
      renderKeyTable();
      closeRevokeModal();
      closeDrawer();
      showToast('권한이 즉시 회수되었습니다.');
    });
  }

  /* ════════════════════════════════════
     새로고침 버튼
  ════════════════════════════════════ */
  function initRefreshBtn() {
    document.addEventListener('click', e => {
      if (e.target.closest('#refreshBtn')) {
        renderApiTable();
        renderApiLog();
        renderKeyTable();
      }
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1A2942;color:#fff;padding:12px 24px;border-radius:10px;font:500 14px/1 var(--font-sans);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  /* ════════════════════════════════════
     부트
  ════════════════════════════════════ */
  function boot() {
    initTabs();
    initApiFilters();
    renderApiTable();
    renderApiLog();
    renderKeyTable();
    initKeyFilter();
    initDrawers();
    initGrantDrawer();
    initTplChips();
    initExtendModal();
    initRevokeModal();
    initRefreshBtn();
  }

  document.addEventListener('gmsb:shell-ready', boot, { once: true });

})();
