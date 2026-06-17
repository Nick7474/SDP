/* =====================================================================
   광명 스마트데이터보드 · 연계 모니터링
   내부·외부 연계 시스템 12개 API 상태 모니터링 (2026-06-16)
   ===================================================================== */
(function () {
  function __run() {

  var STLABEL = { ok: '정상', delay: '지연', err: '오류', stop: '중지' };
  var PILL_CLS = { ok: 'pill--ok', delay: 'pill--delay', err: 'pill--err', stop: 'pill--stop' };
  var DIV_TAG  = { '내부': 'div-tag--in', '외부': 'div-tag--out', '공공': 'div-tag--pub', '민간': 'div-tag--pri' };

  /* ── 12개 연계 시스템 ── */
  var DATA = [
    { name:'Energy Solar API',    desc:'태양광 집계·AI예측 발전 데이터', type:'API', endpoint:'/res/v1/aggregate',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'1시간',
      resTime:'0.218초', throughput:'0.12MB', lastCheck:'2026-06-17 09:00',
      calls:'24건', errors:'0건', dept:'에너지과', lastError:'없음', status:'ok' },

    { name:'DRT Operation API',   desc:'DRT 운행·탑승 데이터',   type:'API',    endpoint:'(정의 중)',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'일배치',
      resTime:'1.238초', throughput:'0.78MB', lastCheck:'2026-06-17 09:00',
      calls:'247건', errors:'12건', dept:'교통과', lastError:'2026-06-17 09:00', status:'delay' },

    { name:'Parking Info API',    desc:'주차장 정보 조회',       type:'API',    endpoint:'/parking/info/status',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'시스템',   division:'공공', cycle:'5분',
      resTime:'0.343초', throughput:'1.12MB', lastCheck:'2026-06-16 15:07',
      calls:'5,840건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok' },

    { name:'Flood Sensor API',    desc:'맨홀·지표면 수위 LoRa 수신', type:'Sensor', endpoint:'/iot/v1/deviceData',
      method:'POST',  proto:'LoRa Gateway',   auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'10분',
      resTime:'0.422초', throughput:'1.31MB', lastCheck:'2026-06-17 09:20',
      calls:'8,640건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok' },

    { name:'Carbon Credit API',   desc:'탄소포인트 발행 데이터', type:'Batch',  endpoint:'/carbon/credit/issue',
      method:'GET',   proto:'Batch',          auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'민간', cycle:'일배치',
      resTime:'2.841초', throughput:'3.65MB', lastCheck:'2026-06-16 15:05',
      calls:'38건', errors:'5건', dept:'환경과', lastError:'2026-06-16 15:05', status:'delay' },

    { name:'광명시 예산데이터',    desc:'세입·세출 통합 데이터',  type:'System', endpoint:'/internal/budget/data',
      method:'GET',   proto:'OpenAPI',        auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'내부', cycle:'일배치',
      resTime:'3.108초', throughput:'1.95MB', lastCheck:'2026-06-16 15:04',
      calls:'1,200건', errors:'28건', dept:'예산과', lastError:'2026-06-16 15:04', status:'err' },

    { name:'재난문자 알림 API',   desc:'재난 알림 발송',         type:'API',    endpoint:'/alert/disaster/send',
      method:'POST',  proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'알림/메시지', division:'내부', cycle:'수시',
      resTime:'—',    throughput:'0MB',       lastCheck:'2026-06-16 14:50',
      calls:'0건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'stop' },

    { name:'대기질 측정 API',     desc:'미세먼지·기상·토양 MQTT 수신', type:'Sensor', endpoint:'publish/from/{id}/sensing',
      method:'PUSH',  proto:'MQTT',           auth:'내부',    fmt:'JSON',
      category:'API/데이터', division:'외부', cycle:'실시간',
      resTime:'0.312초', throughput:'0.95MB', lastCheck:'2026-06-17 09:30',
      calls:'17,280건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok' },

    { name:'카셰어링 현황 API',   desc:'전기차 카셰어링 조회',   type:'API',    endpoint:'/mobility/carshare/status',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'API/데이터', division:'민간', cycle:'주배치',
      resTime:'0.187초', throughput:'0.52MB', lastCheck:'2026-06-16 15:06',
      calls:'247건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok' },

    { name:'친환경 배달 API',     desc:'라이더 배달 현황',       type:'API',    endpoint:'/mobility/delivery/eco',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'API/데이터', division:'민간', cycle:'일배치',
      resTime:'0.421초', throughput:'1.23MB', lastCheck:'2026-06-16 14:51',
      calls:'1,284건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok' },

    { name:'탄소중립 지표 API',   desc:'탄소 감축 실적 데이터',  type:'Batch',  endpoint:'/carbon/neutral/kpi',
      method:'GET',   proto:'Batch',          auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'내부', cycle:'월배치',
      resTime:'1.234초', throughput:'2.87MB', lastCheck:'2026-06-16 14:20',
      calls:'1,523건', errors:'0건', dept:'환경과', lastError:'없음', status:'ok' },

    { name:'수위 모니터링 API',   desc:'맨홀·침수 수위 조회',    type:'Sensor', endpoint:'/flood/city/mesure-data',
      method:'GET',   proto:'REST API',        auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'10분',
      resTime:'0.298초', throughput:'0.85MB', lastCheck:'2026-06-17 09:20',
      calls:'8,640건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok' }
  ];

  /* ── 최근 장애/호출 이력 ── */
  var HIST = [
    { tm:'09:00', type:'API',    name:'Energy Solar API',  event:'정상 호출', code:'200', status:'ok',    dept:'에너지과' },
    { tm:'09:00', type:'API',    name:'DRT Operation API', event:'응답 지연', code:'200', status:'delay', dept:'교통과' },
    { tm:'08:54', type:'System', name:'광명시 예산데이터',  event:'응답 오류', code:'500', status:'err',   dept:'예산과' },
    { tm:'08:00', type:'Batch',  name:'Carbon Credit API', event:'정상 호출', code:'200', status:'ok',    dept:'환경과' },
    { tm:'07:30', type:'API',    name:'재난문자 알림 API', event:'연계 중지', code:'—',   status:'stop',  dept:'안전총괄과' }
  ];

  /* ── 필터 상태 ── */
  var filters = { status: '', division: '', category: '', proto: '', search: '' };

  function filterData() {
    var q = filters.search;
    return DATA.filter(function (d) {
      return (!filters.status   || d.status   === filters.status)
          && (!filters.division || d.division === filters.division)
          && (!filters.category || d.category === filters.category)
          && (!filters.proto    || d.proto    === filters.proto)
          && (!q || d.name.toLowerCase().includes(q)
                 || d.desc.toLowerCase().includes(q)
                 || d.endpoint.toLowerCase().includes(q));
    });
  }

  /* ── 칩 필터 바인딩 ── */
  document.querySelectorAll('.chip-group').forEach(function (grp) {
    var field = grp.getAttribute('data-field');
    grp.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        grp.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        filters[field] = chip.dataset.val;
        renderTable(filterData());
      });
    });
  });

  /* 검색 (아이콘 버튼 + 조회 버튼 공통 동작) */
  function doSearch() {
    filters.search = document.getElementById('searchInput').value.trim().toLowerCase();
    renderTable(filterData());
  }
  document.getElementById('searchBtn').addEventListener('click', doSearch);
  var searchBtnAlt = document.getElementById('searchBtnAlt');
  if (searchBtnAlt) searchBtnAlt.addEventListener('click', doSearch);
  document.getElementById('searchInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doSearch();
  });

  /* 새로고침 — 타임스탬프 갱신 */
  var refreshDataBtn = document.getElementById('refreshDataBtn');
  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', function () {
      var now = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      var ts = now.getFullYear() + '-' + p(now.getMonth()+1) + '-' + p(now.getDate()) +
               ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds());
      var updEl = document.getElementById('updTime');
      if (updEl) updEl.textContent = ts;
      var ico = this.querySelector('svg');
      if (ico) {
        ico.style.transition = 'transform .6s';
        ico.style.transform  = 'rotate(360deg)';
        setTimeout(function () { ico.style.transition='none'; ico.style.transform='rotate(0)'; }, 650);
      }
    });
  }

  /* ── 메인 테이블 렌더링 ── */
  var linkBody = document.getElementById('linkBody');

  function renderTable(rows) {
    if (!rows.length) {
      linkBody.innerHTML =
        '<tr class="tbl__empty"><td colspan="12"><i data-lucide="inbox"></i>조건에 맞는 연계 시스템이 없습니다.</td></tr>';
      lucide.createIcons();
      return;
    }
    linkBody.innerHTML = '';
    rows.forEach(function (d) {
      var divCls = DIV_TAG[d.division] || '';
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span style="font:600 12px/1 var(--font-sans);color:#5A6878;">' + d.type + '</span></td>' +
        '<td class="l" style="font-weight:700">' + d.name + '</td>' +
        '<td class="l" style="color:#5A6878;font-size:13px">' + d.desc + '</td>' +
        '<td class="l"><span class="ep-path">' + d.endpoint + '</span></td>' +
        '<td style="font-size:13px">' + d.proto + '</td>' +
        '<td><span class="div-tag ' + divCls + '">' + d.auth + '</span></td>' +
        '<td style="font-size:13px">' + d.category + '</td>' +
        '<td><span class="pill ' + (PILL_CLS[d.status]||'pill--stop') + '">' + STLABEL[d.status] + '</span></td>' +
        '<td class="num" style="font-size:13px">' + d.resTime + '</td>' +
        '<td class="num" style="font-size:13px">' + d.throughput + '</td>' +
        '<td class="num" style="font-size:13px">' + d.lastCheck.slice(-5) + '</td>' +
        '<td style="text-align:center"><button class="manage-btn" type="button" aria-label="' + d.name + ' 관리"><i data-lucide="settings"></i></button></td>';
      tr.querySelector('.manage-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        openDrawer(d);
      });
      tr.addEventListener('click', function () { openDrawer(d); });
      linkBody.appendChild(tr);
    });
    lucide.createIcons();
  }

  /* ── 이력 테이블 ── */
  var histBody = document.getElementById('histBody');
  HIST.forEach(function (h) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="num">' + h.tm + '</td>' +
      '<td style="font:600 12px/1 var(--font-sans);color:#5A6878">' + h.type + '</td>' +
      '<td class="l" style="font-weight:600">' + h.name + '</td>' +
      '<td>' + h.event + '</td>' +
      '<td class="num">' + h.code + '</td>' +
      '<td><span class="pill ' + (PILL_CLS[h.status]||'pill--stop') + '">' + STLABEL[h.status] + '</span></td>' +
      '<td>' + h.dept + '</td>' +
      '<td><button class="tbtn" type="button">보기</button></td>';
    tr.querySelector('.tbtn').addEventListener('click', function () {
      var found = DATA.find(function (d) { return d.name === h.name; });
      if (found) openDrawer(found);
    });
    histBody.appendChild(tr);
  });

  /* ── 드로어 ── */
  var drawer = document.getElementById('drawer');
  var scrim  = document.getElementById('scrim');

  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  function openDrawer(d) {
    setText('f_name',       d.name);
    setText('f_type',       d.type);
    setText('f_desc',       d.desc);
    setText('f_endpoint',   d.endpoint);
    setText('f_method',     d.method);
    setText('f_proto',      d.proto);
    setText('f_auth',       d.auth);
    setText('f_fmt',        d.fmt);
    setText('f_cycle',      d.cycle);
    setText('f_restime',    d.resTime);
    setText('f_calls',      d.calls);
    setText('f_errors',     d.errors);
    setText('f_throughput', d.throughput);
    setText('f_dept',       d.dept);
    setText('f_last',       d.lastCheck);
    setText('f_lasterr',    d.lastError);

    var fs = document.getElementById('f_status');
    if (fs) {
      fs.innerHTML = '<span class="pill ' + (PILL_CLS[d.status]||'pill--stop') + '">' + STLABEL[d.status] + '</span>';
    }

    lucide.createIcons();
    drawer.classList.add('on'); scrim.classList.add('on');
    drawer.setAttribute('aria-hidden', 'false');
    var closeBtn = document.getElementById('dwClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('on'); scrim.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
  }
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ── 새로고침 ── */
  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      var now = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      setText('updTime',
        now.getFullYear() + '-' + p(now.getMonth()+1) + '-' + p(now.getDate()) +
        ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds()));
      var ico = this.querySelector('[data-lucide]');
      if (ico) {
        ico.style.transition = 'transform .6s';
        ico.style.transform  = 'rotate(360deg)';
        setTimeout(function () { ico.style.transition='none'; ico.style.transform='rotate(0)'; }, 650);
      }
    });
  }

  renderTable(DATA);

  } /* __run */

  if (window.GMSB_SHELL_READY) __run();
  else document.addEventListener('gmsb:shell-ready', __run, { once: true });
})();
