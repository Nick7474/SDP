/* =====================================================================
   광명 스마트데이터보드 · 연계 모니터링
   내부·외부 연계 시스템 12개 API 상태 모니터링 (2026-06-16)
   ===================================================================== */
(function () {
  function __run() {

  var STLABEL  = { ok: '정상', delay: '지연', err: '오류', stop: '중지' };
  var PILL_CLS = { ok: 'pill--ok', delay: 'pill--delay', err: 'pill--err', stop: 'pill--stop' };
  var DIV_TAG  = { '내부': 'div-tag--in', '외부': 'div-tag--out', '공공': 'div-tag--pub', '민간': 'div-tag--pri' };
  var FIX_LABEL = { none: '미조치', in_progress: '조치중', done: '완료', na: '-' };
  var FIX_CLS   = { none: 'fix-badge--none', in_progress: 'fix-badge--prog', done: 'fix-badge--done', na: 'fix-badge--na' };

  /* ── 12개 연계 시스템 ── */
  var DATA = [
    { name:'Energy Solar API',    desc:'태양광 집계·AI예측 발전 데이터', type:'API', endpoint:'/res/v1/aggregate',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'1시간',
      resTime:'0.218', resTimeDisp:'0.218초', throughput:'0.12MB', lastCheck:'2026-06-17 09:00',
      calls:'24건', errors:'0건', dept:'에너지과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'DRT Operation API',   desc:'DRT 운행·탑승 데이터',   type:'API',    endpoint:'(정의 중)',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'일배치',
      resTime:'1.238', resTimeDisp:'1.238초', throughput:'0.78MB', lastCheck:'2026-06-17 09:00',
      calls:'247건', errors:'12건', dept:'교통과', lastError:'2026-06-17 09:00', status:'delay', fixStatus:'in_progress' },

    { name:'Parking Info API',    desc:'공영주차장 현황 (정책플랫폼 YDNS)', type:'API', endpoint:'/parking/info/status',
      method:'GET',   proto:'REST API',       auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'내부', cycle:'5분',
      resTime:'0.343', resTimeDisp:'0.343초', throughput:'1.12MB', lastCheck:'2026-06-16 15:07',
      calls:'5,840건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'Flood Sensor API',    desc:'맨홀·지표면 수위 LoRa 수신', type:'Sensor', endpoint:'/iot/v1/deviceData',
      method:'POST',  proto:'LoRa Gateway',   auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'10분',
      resTime:'0.422', resTimeDisp:'0.422초', throughput:'1.31MB', lastCheck:'2026-06-17 09:20',
      calls:'8,640건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'Carbon Credit API',   desc:'탄소포인트 발행 데이터', type:'Batch',  endpoint:'/carbon/credit/issue',
      method:'GET',   proto:'Batch',          auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'민간', cycle:'일배치',
      resTime:'2.841', resTimeDisp:'2.841초', throughput:'3.65MB', lastCheck:'2026-06-16 15:05',
      calls:'38건', errors:'5건', dept:'환경과', lastError:'2026-06-16 15:05', status:'delay', fixStatus:'none' },

    { name:'광명시 예산데이터',    desc:'세입·세출 통합 데이터',  type:'System', endpoint:'/internal/budget/data',
      method:'GET',   proto:'OpenAPI',        auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'내부', cycle:'일배치',
      resTime:'3.108', resTimeDisp:'3.108초', throughput:'1.95MB', lastCheck:'2026-06-16 15:04',
      calls:'1,200건', errors:'28건', dept:'예산과', lastError:'2026-06-16 15:04', status:'err', fixStatus:'none' },

    { name:'재난문자 알림 API',   desc:'재난 알림 발송 (아웃바운드)',  type:'API',  endpoint:'/alert/disaster/send',
      method:'POST',  proto:'REST API',       auth:'내부',    fmt:'JSON',
      category:'알림/메시지', division:'내부', cycle:'수시',
      resTime:'—', resTimeDisp:'—', throughput:'0MB', lastCheck:'2026-06-16 14:50',
      calls:'0건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'stop', fixStatus:'na' },

    { name:'대기질 측정 API',     desc:'미세먼지·기상·토양 MQTT 수신', type:'Sensor', endpoint:'publish/from/{id}/sensing',
      method:'PUSH',  proto:'MQTT',           auth:'내부',    fmt:'JSON',
      category:'API/데이터', division:'외부', cycle:'실시간',
      resTime:'0.312', resTimeDisp:'0.312초', throughput:'0.95MB', lastCheck:'2026-06-17 09:30',
      calls:'17,280건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'카셰어링 현황 API',   desc:'전기차 카셰어링 조회',   type:'API',    endpoint:'/mobility/carshare/status',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'API/데이터', division:'민간', cycle:'주배치',
      resTime:'0.187', resTimeDisp:'0.187초', throughput:'0.52MB', lastCheck:'2026-06-16 15:06',
      calls:'247건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'친환경 배달 API',     desc:'라이더 배달 현황',       type:'API',    endpoint:'/mobility/delivery/eco',
      method:'GET',   proto:'REST API',       auth:'API Key', fmt:'JSON',
      category:'API/데이터', division:'민간', cycle:'일배치',
      resTime:'0.421', resTimeDisp:'0.421초', throughput:'1.23MB', lastCheck:'2026-06-16 14:51',
      calls:'1,284건', errors:'0건', dept:'교통과', lastError:'없음', status:'ok', fixStatus:'na' },

    { name:'탄소중립 지표 API',   desc:'탄소 감축 실적 데이터',  type:'Batch',  endpoint:'/carbon/neutral/kpi',
      method:'GET',   proto:'Batch',          auth:'내부',    fmt:'JSON',
      category:'데이터',   division:'내부', cycle:'월배치',
      resTime:'1.234', resTimeDisp:'1.234초', throughput:'2.87MB', lastCheck:'2026-06-16 14:20',
      calls:'1,523건', errors:'0건', dept:'환경과', lastError:'없음', status:'ok', fixStatus:'done' },

    { name:'수위 모니터링 API',   desc:'맨홀·침수 수위 조회',    type:'Sensor', endpoint:'/flood/city/mesure-data',
      method:'GET',   proto:'REST API',        auth:'API Key', fmt:'JSON',
      category:'데이터',   division:'외부', cycle:'10분',
      resTime:'0.298', resTimeDisp:'0.298초', throughput:'0.85MB', lastCheck:'2026-06-17 09:20',
      calls:'8,640건', errors:'0건', dept:'안전총괄과', lastError:'없음', status:'ok', fixStatus:'na' }
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
  var threshold = 1.0;

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

  /* ── 칩 필터 ── */
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

  /* ── 검색 ── */
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

  /* ── 응답 임계값 ── */
  var thresholdInput = document.getElementById('thresholdInput');
  if (thresholdInput) {
    thresholdInput.addEventListener('change', function () {
      var v = parseFloat(this.value);
      if (!isNaN(v) && v > 0) { threshold = v; renderTable(filterData()); }
    });
  }

  /* ── 새로고침 ── */
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
        '<tr class="tbl__empty"><td colspan="13"><span class="link-empty__content"><i data-lucide="inbox"></i><span>조건에 맞는 연계 시스템이 없습니다.</span></span></td></tr>';
      lucide.createIcons();
      return;
    }
    linkBody.innerHTML = '';
    rows.forEach(function (d) {
      var divCls   = DIV_TAG[d.division] || '';
      var rt       = parseFloat(d.resTime);
      var rtWarn   = !isNaN(rt) && rt > threshold;
      var rtDisp   = d.resTimeDisp || d.resTime;
      var fixCls   = FIX_CLS[d.fixStatus] || 'fix-badge--na';
      var fixLbl   = FIX_LABEL[d.fixStatus] || '-';
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
        '<td class="num' + (rtWarn ? ' restime-warn' : '') + '" style="font-size:13px">' + rtDisp + (rtWarn ? ' ⚠' : '') + '</td>' +
        '<td class="num" style="font-size:13px">' + d.throughput + '</td>' +
        '<td class="num" style="font-size:13px">' + d.lastCheck.slice(-5) + '</td>' +
        '<td style="text-align:center"><span class="fix-badge ' + fixCls + '">' + fixLbl + '</span></td>' +
        '<td style="text-align:center"><button class="tbtn tbtn--sm link-view-btn" type="button">상세</button></td>';
      tr.querySelector('.link-view-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        openDrawer(d);
      });
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function () { openDrawer(d); });
      linkBody.appendChild(tr);
    });
    lucide.createIcons();
  }

  /* ── 이력 테이블 ── */
  var histBody = document.getElementById('histBody');
  var dataByName = {};
  DATA.forEach(function (d) { dataByName[d.name] = d; });

  HIST.forEach(function (h) {
    var drawData = dataByName[h.name] || {
      name:h.name, type:h.type, desc:'—', endpoint:'—',
      method:'—', proto:'—', auth:'—', fmt:'—', cycle:'—',
      resTimeDisp:'—', resTime:'—', calls:'—', errors:'—',
      throughput:'—', dept:h.dept,
      lastCheck:'2026-06-16 ' + h.tm + ':00',
      lastError:'—', status:h.status, fixStatus:'na'
    };
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="num">' + h.tm + '</td>' +
      '<td style="font:600 12px/1 var(--font-sans);color:#5A6878">' + h.type + '</td>' +
      '<td class="l" style="font-weight:600">' + h.name + '</td>' +
      '<td>' + h.event + '</td>' +
      '<td class="num">' + h.code + '</td>' +
      '<td><span class="pill ' + (PILL_CLS[h.status]||'pill--stop') + '">' + STLABEL[h.status] + '</span></td>' +
      '<td>' + h.dept + '</td>' +
      '<td><button class="tbtn tbtn--sm" type="button">상세</button></td>';
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', function () { openDrawer(drawData); });
    histBody.appendChild(tr);
  });

  /* ── 드로어 ── */
  var drawer = document.getElementById('drawer');
  var scrim  = document.getElementById('scrim');
  var currentData = null;

  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  function openDrawer(d) {
    currentData = d;
    setText('f_name',       d.name);
    setText('f_type',       d.type);
    setText('f_desc',       d.desc);
    setText('f_endpoint',   d.endpoint);
    setText('f_method',     d.method);
    setText('f_proto',      d.proto);
    setText('f_auth',       d.auth);
    setText('f_fmt',        d.fmt);
    setText('f_cycle',      d.cycle);
    setText('f_restime',    d.resTimeDisp || d.resTime);
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
    currentData = null;
  }
  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', function (e) {
    var fm = document.getElementById('faultModal');
    if (!fm || fm.style.display === 'none') closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); closeFaultModal(); }
  });

  /* ── 재연결 confirm ── */
  var reconnectBtn = document.getElementById('dwReconnectBtn');
  if (reconnectBtn) {
    reconnectBtn.addEventListener('click', function () {
      var name = currentData ? currentData.name : '선택된 시스템';
      if (!confirm('"' + name + '" 연계 시스템에 재연결을 요청합니다. 계속하시겠습니까?')) return;
      reconnectBtn.disabled = true;
      reconnectBtn.textContent = '재연결 중…';
      setTimeout(function () {
        reconnectBtn.disabled = false;
        reconnectBtn.innerHTML = '<i data-lucide="refresh-cw" class="gp-ico"></i>재연결 실행';
        lucide.createIcons();
        showToast('재연결 요청이 완료되었습니다.');
      }, 1400);
    });
  }

  /* ── 알림 설정 저장 ── */
  var alertSaveBtn = document.getElementById('dwAlertSaveBtn');
  if (alertSaveBtn) {
    alertSaveBtn.addEventListener('click', function () {
      showToast('알림 설정이 저장되었습니다.');
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     장애 상세 모달
     ═══════════════════════════════════════════════════════════════ */
  var faultModalScrim = document.getElementById('faultModalScrim');
  var faultModal      = document.getElementById('faultModal');

  function openFaultModal(h) {
    var pc = PILL_CLS[h.status] || 'pill--stop';
    var pill = document.getElementById('fmPill');
    if (pill) { pill.textContent = STLABEL[h.status]; pill.className = 'pill ' + pc; }
    setText('fmTitle',  h.name + ' — 장애 상세');
    setText('fmMeta',   h.type + ' · ' + h.tm);
    setText('fm_event', h.event);
    setText('fm_code',  h.code);
    setText('fm_time',  '2026-06-16 ' + h.tm + ':00');
    setText('fm_dept',  h.dept);
    setText('fm_type',  h.type);

    var log = document.getElementById('fmLog');
    if (log) {
      var logRows = [
        { t: '2026-06-16 ' + h.tm + ':00', s: h.status, d: h.event + ' (코드: ' + h.code + ')' },
        { t: '이전 주기 (정상)',              s: 'ok',     d: '정상 응답 — 200 OK' },
        { t: '2주기 전 (정상)',               s: 'ok',     d: '정상 응답 — 200 OK' }
      ];
      log.innerHTML = logRows.map(function (r) {
        var cls = r.s === 'err' ? 'err' : r.s === 'delay' ? 'delay' : '';
        return '<div class="log__it ' + cls + '"><div class="log__tm">' + r.t + '</div><div class="log__ds">' + r.d + '</div></div>';
      }).join('');
    }

    lucide.createIcons();
    faultModalScrim.style.display = '';
    faultModal.style.display = '';
    document.getElementById('faultModalClose').focus();
  }

  function closeFaultModal() {
    if (faultModalScrim) faultModalScrim.style.display = 'none';
    if (faultModal)      faultModal.style.display = 'none';
  }

  if (document.getElementById('faultModalClose'))
    document.getElementById('faultModalClose').addEventListener('click', closeFaultModal);
  if (document.getElementById('faultModalCloseBtn'))
    document.getElementById('faultModalCloseBtn').addEventListener('click', closeFaultModal);
  if (faultModalScrim) faultModalScrim.addEventListener('click', closeFaultModal);
  if (document.getElementById('faultMarkDone')) {
    document.getElementById('faultMarkDone').addEventListener('click', function () {
      showToast('조치 완료로 처리되었습니다.');
      closeFaultModal();
    });
  }

  /* ── 새로고침 (페이지 헤더) ── */
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

  /* ── 토스트 ── */
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--fg-1);color:#fff;padding:11px 22px;border-radius:var(--radius-pill);font:500 14px/1 var(--font-sans);box-shadow:var(--elev-3);z-index:400;white-space:nowrap;';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  renderTable(DATA);

  } /* __run */

  if (window.GMSB_SHELL_READY) __run();
  else document.addEventListener('gmsb:shell-ready', __run, { once: true });
})();
