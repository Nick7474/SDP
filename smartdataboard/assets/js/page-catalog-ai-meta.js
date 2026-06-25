/* =====================================================================
   광명 스마트데이터보드 · AI 메타데이터 추천
   ===================================================================== */
(function () {
  'use strict';

  /* ── 탭 2 데이터 ── */
  var SPEC_ITEMS = [
    { no:1,  name:'발전소ID',        eng:'plant_id',           dtype:'VARCHAR(20)', req:true,  sample:'GM-SOLAR-001',  desc:'발전소 고유 식별자',          mapped:'매핑완료', rec:'발전소 식별코드' },
    { no:2,  name:'발전일시',        eng:'gen_datetime',       dtype:'DATETIME',    req:true,  sample:'2026-06-01 00:00', desc:'발전량 집계 기준 일시',    mapped:'매핑완료', rec:'발전 일시' },
    { no:3,  name:'발전량_MWh',      eng:'generation_mwh',     dtype:'DECIMAL(10,3)',req:true, sample:'12.450',        desc:'시간대별 발전량(MWh)',         mapped:'매핑완료', rec:'발전량(MWh)' },
    { no:4,  name:'설비용량_kW',     eng:'capacity_kw',        dtype:'DECIMAL(10,2)',req:true, sample:'500.00',        desc:'설비 최대 발전 용량',          mapped:'매핑완료', rec:'설비용량(kW)' },
    { no:5,  name:'이용률_pct',      eng:'utilization_rate',   dtype:'DECIMAL(5,2)', req:false, sample:'82.50',       desc:'설비 이용률(%)',               mapped:'확인필요', rec:'이용률(%)' },
    { no:6,  name:'일사량_Wm2',      eng:'irradiance_wm2',     dtype:'DECIMAL(8,2)', req:false, sample:'945.20',      desc:'수평면 일사량(W/m²)',          mapped:'매핑완료', rec:'수평면 일사량' },
    { no:7,  name:'패널온도_C',      eng:'panel_temp_c',       dtype:'DECIMAL(5,2)', req:false, sample:'52.30',       desc:'태양광 패널 표면 온도(℃)',     mapped:'매핑완료', rec:'패널 표면온도' },
    { no:8,  name:'인버터ID',        eng:'inverter_id',        dtype:'VARCHAR(20)', req:true,  sample:'INV-001',       desc:'인버터 장비 식별자',          mapped:'매핑완료', rec:'인버터 식별코드' },
    { no:9,  name:'인버터상태',      eng:'inverter_status',    dtype:'VARCHAR(10)', req:true,  sample:'정상',          desc:'인버터 동작 상태',            mapped:'매핑완료', rec:'인버터 동작상태' },
    { no:10, name:'계통연계전압_V',  eng:'grid_voltage_v',     dtype:'DECIMAL(7,2)', req:false, sample:'380.50',      desc:'계통 연계 전압(V)',            mapped:'확인필요', rec:'계통 연계전압' },
    { no:11, name:'출력전류_A',      eng:'output_current_a',   dtype:'DECIMAL(7,3)', req:false, sample:'19.250',      desc:'출력 전류(A)',                 mapped:'매핑완료', rec:'출력 전류' },
    { no:12, name:'탄소감축량_tCO2', eng:'carbon_reduction',   dtype:'DECIMAL(10,4)',req:false, sample:'5.8620',      desc:'발전으로 상쇄된 탄소 환산량', mapped:'매핑완료', rec:'탄소 감축량' },
    { no:13, name:'누적발전량_MWh',  eng:'cumul_gen_mwh',      dtype:'DECIMAL(12,3)',req:false, sample:'1250.830',    desc:'누적 발전 총량(MWh)',          mapped:'매핑완료', rec:'누적 발전량' },
    { no:14, name:'일평균발전량',    eng:'daily_avg_gen',      dtype:'DECIMAL(10,3)',req:false, sample:'8.760',       desc:'일 평균 발전량(MWh)',          mapped:'확인필요', rec:'일평균 발전량' },
    { no:15, name:'권역명',          eng:'zone_name',          dtype:'VARCHAR(50)', req:true,  sample:'철산역권',      desc:'행정 권역 구분명',            mapped:'매핑완료', rec:'행정권역명' },
    { no:16, name:'위도',            eng:'latitude',           dtype:'DECIMAL(10,6)',req:true,  sample:'37.476123',   desc:'발전소 위치 위도 좌표',        mapped:'매핑완료', rec:'위도 좌표' },
    { no:17, name:'경도',            eng:'longitude',          dtype:'DECIMAL(10,6)',req:true,  sample:'126.863452',  desc:'발전소 위치 경도 좌표',        mapped:'매핑완료', rec:'경도 좌표' },
    { no:18, name:'비고',            eng:'remark',             dtype:'VARCHAR(200)', req:false, sample:'정기 점검',   desc:'기타 비고 사항',               mapped:'미매핑',   rec:'비고' }
  ];

  var AI_REC_ITEMS = [
    { field:'데이터셋명',   current:'광명시 태양광 발전 집계',                 rec:'광명시 태양광 발전 집계 데이터',               apply:true  },
    { field:'주제 영역',    current:'에너지',                                   rec:'에너지 > 신재생에너지',                        apply:true  },
    { field:'데이터 설명',  current:'광명시 태양광 발전 현황을 집계한 데이터.', rec:'광명시 관내 태양광 발전 설비의 시간대별 발전량, 이용률, 탄소 감축량을 집계한 운영 데이터입니다.', apply:false },
    { field:'키워드',       current:'태양광, 발전량',                           rec:'태양광, 발전량, 신재생에너지, 탄소중립, MWh',   apply:true  },
    { field:'갱신 주기',    current:'일별',                                     rec:'시간별',                                        apply:false },
    { field:'제공 형식',    current:'CSV',                                      rec:'CSV, API',                                      apply:true  },
    { field:'공개 범위',    current:'내부',                                     rec:'제한공개',                                      apply:false },
    { field:'담당 부서',    current:'기후환경과',                               rec:'기후환경과 신재생에너지팀',                     apply:true  }
  ];

  /* ── 탭 2: 정의서 분석 ── */
  var specPage = 1;
  var SPEC_PER = 10;

  function renderSpecTable(data) {
    var tbody = document.getElementById('specTbody');
    if (!tbody) return;
    var start = (specPage - 1) * SPEC_PER;
    var slice = data.slice(start, start + SPEC_PER);
    var mappedCls = { '매핑완료':'am-step__status--done', '확인필요':'am-step__status--warn', '미매핑':'' };
    tbody.innerHTML = slice.map(function (r) {
      var cls = mappedCls[r.mapped] || '';
      return [
        '<tr data-spec-no="' + r.no + '" style="cursor:pointer">',
          '<td style="color:var(--fg-4);font-size:12px">' + r.no + '</td>',
          '<td class="l" style="font-weight:700;color:var(--fg-1)">' + r.name + '</td>',
          '<td class="l" style="font-size:12px;color:var(--fg-3);font-family:monospace">' + r.eng + '</td>',
          '<td style="font-size:12px;font-family:monospace">' + r.dtype + '</td>',
          '<td>' + (r.req ? '<span style="color:var(--status-danger);font-weight:700">필수</span>' : '<span style="color:var(--fg-4)">선택</span>') + '</td>',
          '<td class="l" style="font-size:12px;color:var(--fg-3);font-family:monospace">' + r.sample + '</td>',
          '<td class="l" style="font-size:12px;color:var(--fg-2)">' + r.desc + '</td>',
          '<td><span class="am-step__status ' + cls + '">' + r.mapped + '</span></td>',
          '<td class="l" style="font-size:12px;color:var(--gp-point)">' + r.rec + '</td>',
          '<td style="white-space:nowrap">',
            '<button class="tbtn tbtn--sm spec-row-detail" data-spec-no="' + r.no + '" type="button">상세</button>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');
    if (!slice.length) tbody.innerHTML = '<tr class="tbl__empty"><td colspan="9"><i data-lucide="inbox"></i>항목이 없습니다.</td></tr>';
    tbody.querySelectorAll('tr[data-spec-no]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest('.spec-row-detail')) return;
        openSpecDrawer(parseInt(tr.dataset.specNo, 10));
      });
      var btn = tr.querySelector('.spec-row-detail');
      if (btn) btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openSpecDrawer(parseInt(tr.dataset.specNo, 10));
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  function renderSpecPagination(total) {
    var el = document.getElementById('specPagination');
    if (!el) return;
    var pages = Math.max(1, Math.ceil(total / SPEC_PER));
    el.innerHTML = [
      '<span class="ds-pg-info">전체 ' + total + '건</span>',
      '<div class="ds-pg-btns">',
        pgBtn('&laquo;'), pgBtn('&lsaquo;'),
        pgBtn('1', true), (pages > 1 ? pgBtn('2') : ''),
        pgBtn('&rsaquo;'), pgBtn('&raquo;'),
      '</div>',
      '<div></div>'
    ].join('');
  }

  function initSpecStartBtn() {
    var btn = document.getElementById('specStartBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      showToast('정의서 분석을 시작합니다…');
    });
  }

  function initSpecActions() {
    var saveBtn = document.getElementById('specSaveBtn');
    var gotoBtn = document.getElementById('specGotoAiBtn');
    if (saveBtn) saveBtn.addEventListener('click', function () {
      var steps = document.querySelectorAll('#tabSpec .am-step');
      if (steps.length >= 5) {
        var lastStep = steps[4];
        var dot = lastStep.querySelector('.am-step__dot');
        var status = lastStep.querySelector('.am-step__status');
        if (dot) { dot.className = 'am-step__dot'; dot.innerHTML = '<i data-lucide="check" style="width:14px;height:14px"></i>'; }
        if (status) { status.className = 'am-step__status am-step__status--done'; status.textContent = '완료'; }
        if (window.lucide) lucide.createIcons();
      }
      showToast('분석 결과가 저장되었습니다. AI 메타데이터 추천을 진행하세요.');
    });
    if (gotoBtn) gotoBtn.addEventListener('click', function () {
      document.querySelectorAll('.page-tab').forEach(function (b) { b.classList.remove('on'); });
      var tab3Btn = document.querySelector('.page-tab[data-tab="airec"]');
      if (tab3Btn) tab3Btn.classList.add('on');
      var keys = Object.keys(TAB_MAP);
      for (var k = 0; k < keys.length; k++) {
        var el = document.getElementById(TAB_MAP[keys[k]]);
        if (el) el.style.display = 'none';
      }
      var tab3 = document.getElementById(TAB_MAP.airec);
      if (tab3) tab3.style.display = '';
      if (window.lucide) lucide.createIcons();
      window.scrollTo(0, 0);
    });
  }

  /* ── 탭 3: AI 메타데이터 추천 ── */
  var REQUIRED_AI_FIELDS = ['데이터셋명', '주제 영역', '데이터 설명', '키워드'];

  function renderAiRecTable(data) {
    var tbody = document.getElementById('aiRecTbody');
    if (!tbody) return;
    tbody.innerHTML = data.map(function (r, i) {
      var isReq = REQUIRED_AI_FIELDS.indexOf(r.field) >= 0;
      var appliedStyle = r.apply
        ? 'background:var(--status-success-soft);border-color:var(--status-success);color:var(--status-success)'
        : '';
      return [
        '<tr data-ai-idx="' + i + '">',
          '<td class="l" style="font-weight:600;color:var(--fg-2);font-size:13px">',
            (isReq ? '<span style="color:var(--status-danger);margin-right:2px" title="필수">*</span>' : ''),
            r.field,
          '</td>',
          '<td class="l" style="padding:6px 8px">',
            '<input type="text" class="am-ai-input" data-ai-curr="' + i + '"',
            ' value="' + r.current.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') + '"',
            ' style="width:100%;border:1px solid var(--border-strong);border-radius:var(--radius-sm);',
            'padding:6px 8px;font:400 13px/1.4 var(--font-sans);color:var(--fg-2);outline:none;',
            'background:var(--surface-inset);transition:background .2s;box-sizing:border-box">',
          '</td>',
          '<td class="l" style="padding:8px 14px">',
            '<div class="am-ai-rec-val">', r.rec, '</div>',
          '</td>',
          '<td style="text-align:center;min-width:70px">',
            '<button class="tbtn tbtn--sm am-ai-apply-btn" type="button" data-ai-idx="' + i + '"',
            (appliedStyle ? ' style="' + appliedStyle + '"' : ''),
            '>',
              (r.apply ? '적용됨' : '적용'),
            '</button>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');
    if (window.lucide) lucide.createIcons();
    initAiApplyBtns();
    checkSaveValidity();
  }

  function initAiApplyBtns() {
    document.querySelectorAll('.am-ai-apply-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.dataset.aiIdx, 10);
        var r = AI_REC_ITEMS[idx];
        if (!r) return;
        var input = document.querySelector('.am-ai-input[data-ai-curr="' + idx + '"]');
        if (input) {
          input.value = r.rec;
          input.style.background = 'var(--gp-point-soft)';
          var inp = input;
          setTimeout(function () { inp.style.background = 'var(--surface-inset)'; }, 600);
        }
        r.apply = true;
        this.textContent = '적용됨';
        this.style.cssText = 'background:var(--status-success-soft);border-color:var(--status-success);color:var(--status-success)';
        checkSaveValidity();
      });
    });
  }

  function checkSaveValidity() {
    var btn = document.getElementById('aiSaveBtn');
    if (!btn) return;
    var valid = true;
    for (var i = 0; i < REQUIRED_AI_FIELDS.length; i++) {
      var fidx = -1;
      for (var j = 0; j < AI_REC_ITEMS.length; j++) {
        if (AI_REC_ITEMS[j].field === REQUIRED_AI_FIELDS[i]) { fidx = j; break; }
      }
      if (fidx < 0) continue;
      var input = document.querySelector('.am-ai-input[data-ai-curr="' + fidx + '"]');
      if (!input || !input.value.trim()) { valid = false; break; }
    }
    btn.disabled = !valid;
    btn.style.opacity = valid ? '1' : '0.5';
    btn.title = valid ? '' : '필수 항목(*)을 모두 입력 또는 적용해야 저장할 수 있습니다.';
  }

  function initAiReason() {
    var toggle = document.getElementById('aiReasonToggle');
    var body   = document.getElementById('aiReasonBody');
    if (!toggle || !body) return;
    toggle.addEventListener('click', function () {
      var open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      var ico = toggle.querySelector('i[data-lucide]');
      if (ico) {
        ico.setAttribute('data-lucide', open ? 'chevron-down' : 'chevron-up');
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  function initAiSave() {
    var btn = document.getElementById('aiSaveBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (this.disabled) return;
      var applied = 0;
      for (var i = 0; i < AI_REC_ITEMS.length; i++) {
        if (AI_REC_ITEMS[i].apply) applied++;
      }
      showToast('AI 추천 메타데이터가 저장되었습니다. (' + applied + '건 적용)');
    });
    var reBtn = document.getElementById('aiReAnalyzeBtn');
    if (reBtn) reBtn.addEventListener('click', function () {
      AI_REC_ITEMS.forEach(function (r) { r.apply = false; });
      renderAiRecTable(AI_REC_ITEMS);
      showToast('메타데이터 재분석을 요청했습니다.');
    });
  }

  /* ── 표준어 목록 ── */
  var TERMS = [
    { id:1, term:'태양광 발전량',  eng:'Solar Power Generation',          field:'에너지',   syn:'태양광발전, 솔라발전',      datasets:18, linked:'태양광발전량 및 탄소 배출량, 신재생에너지 현황 외 17개', status:'active', regDate:'2026.01.14', lastUsed:'2026.06.18', aiConf:0.97, desc:'태양광 발전 설비에서 생산한 전력의 총량.' },
    { id:2, term:'친환경DRT 운행', eng:'Eco DRT Operation',               field:'모빌리티', syn:'수요응답버스, 친환경버스',   datasets:9,  linked:'친환경DRT 운행 현황 데이터 외 8개',                   status:'active', regDate:'2026.01.22', lastUsed:'2026.06.16', aiConf:0.91, desc:'수요응답형 친환경 대중교통 운행 정보.' },
    { id:3, term:'침수 예측',      eng:'Flood Risk Prediction',           field:'세이프티', syn:'AIoT침수, 침수홍수예측',    datasets:6,  linked:'재난 위험 정보, 수방 현황 외 5개',                    status:'review', regDate:'2026.02.10', lastUsed:'2026.06.14', aiConf:0.74, desc:'AI 기반 침수 발생 위험도 예측 결과.' },
    { id:4, term:'미세먼지 농도',  eng:'PM2.5 Concentration',             field:'환경',     syn:'초미세먼지, PM2.5',         datasets:14, linked:'대기측정소별 실시간 측정정보, 미세먼지 예보 외 13개', status:'active', regDate:'2026.01.03', lastUsed:'2026.06.17', aiConf:0.95, desc:'단위 부피당 PM2.5 입자 질량 농도(μg/m³).' },
    { id:5, term:'에너지 사용량',  eng:'Energy Usage',                    field:'에너지',   syn:'에너지사용량, 에너지소비량', datasets:21, linked:'에너지 사용 현황, 건물 에너지 외 20개',              status:'active', regDate:'2026.01.15', lastUsed:'2026.06.17', aiConf:0.98, desc:'건물·시설에서 일정 기간 동안 소비한 에너지 합계.' },
    { id:6, term:'가로등 점멸',    eng:'Streetlight Flickering',          field:'세이프티', syn:'가로등점멸, 가로등데이터',  datasets:5,  linked:'광명시 가로등 점멸 데이터, 시설 이력 외 4개',         status:'active', regDate:'2026.02.28', lastUsed:'2026.06.12', aiConf:0.83, desc:'가로등 점등/소등 이벤트 및 점멸 상태 정보.' },
    { id:7, term:'전기차 충전량',  eng:'EV Charging Amount',              field:'모빌리티', syn:'전기차충전전량, 충전량',    datasets:7,  linked:'전기차충전소 현황, 충전소 운영 외 6개',               status:'active', regDate:'2026.01.28', lastUsed:'2026.06.15', aiConf:0.88, desc:'충전기에서 공급된 전력량(kWh) 합계.' },
    { id:8, term:'온실가스 배출량',eng:'GHG Emission',                    field:'환경',     syn:'온실가스배출량, 탄소배출량', datasets:11, linked:'온실가스 모니터링, 탄소중립 지표 외 10개',            status:'active', regDate:'2026.02.05', lastUsed:'2026.06.13', aiConf:0.96, desc:'CO₂ 환산 온실가스 총 배출량(tCO₂e).' },
    { id:9, term:'주민등록인구',   eng:'Resident Registration Population',field:'데이터',   syn:'주민등록인구, 읍면동인구',  datasets:8,  linked:'주민등록인구 통계, 세대통계 외 7개',                  status:'active', regDate:'2026.01.30', lastUsed:'2026.06.18', aiConf:0.99, desc:'주민등록 기준 인구 수.' },
    { id:10,term:'스마트정류장',   eng:'Smart Bus Stop',                  field:'세이프티', syn:'스마트버스정류장',          datasets:4,  linked:'스마트정류장 현황, 대중교통 외 3개',                  status:'review', regDate:'2026.03.22', lastUsed:'2026.05.24', aiConf:0.68, desc:'디지털 기기 탑재 스마트 버스 정류장.' }
  ];

  var HIST_DB = {
    1: [
      { date:'2026-06-18', user:'김담당', action:'edit',   body:'동의어 "솔라발전" 추가' },
      { date:'2026-04-10', user:'이관리', action:'approve',body:'검토중 → 사용중 승인' },
      { date:'2026-01-14', user:'이관리', action:'create', body:'표준어 최초 등록' }
    ],
    3: [
      { date:'2026-06-14', user:'김담당', action:'edit', body:'설명 문구 수정' },
      { date:'2026-02-10', user:'박AI',   action:'create',body:'AI 추천 기반 등록 — 검토중 상태' }
    ],
    10:[
      { date:'2026-05-24', user:'박AI',   action:'create',body:'AI 추천 기반 등록 — 검토중 상태' }
    ]
  };

  var selectedTerm = null;

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
  }

  function boot() {
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) {
      document.addEventListener('gmsb:shell-ready', onReady, { once: true });
    } else { onReady(); }
  }

  function onReady() {
    initTabs();
    renderTermTable(TERMS);
    renderTermPagination(TERMS.length);
    initTermDrawer();
    initFilterBtns();
    initChkAll();
    initBatchActions();
    initHistModal();
    initAddModal();
    initReg();
    if (window.lucide) lucide.createIcons();
  }

  var TAB_MAP = { reg: 'tabReg', term: 'tabTerm' };
  var TAB_META = {
    reg:  { label: 'AI 카탈로그 등록', desc: '데이터 허브에 수집됐지만 카탈로그에 미등록된 데이터를 AI와 함께 메타데이터를 정리해 등록합니다.' },
    term: { label: '표준용어 관리',    desc: 'AI 데이터 카탈로그의 표준어를 관리하고 동의어·금칙어를 설정합니다.' }
  };

  /* ── 탭 ── */
  function initTabs() {
    if (window.gmsbSetTab) gmsbSetTab(TAB_META.reg.label, TAB_META.reg.desc);
    document.querySelectorAll('.page-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.page-tab').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on');
        var key = this.dataset.tab;
        Object.values(TAB_MAP).forEach(function (panelId) {
          var el = document.getElementById(panelId);
          if (el) el.style.display = 'none';
        });
        var active = document.getElementById(TAB_MAP[key]);
        if (active) active.style.display = '';
        if (TAB_META[key] && window.gmsbSetTab) gmsbSetTab(TAB_META[key].label, TAB_META[key].desc);
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  /* ── 전체 선택 ── */
  function initChkAll() {
    var chkAll = document.getElementById('termChkAll');
    if (!chkAll) return;
    chkAll.addEventListener('change', function () {
      document.querySelectorAll('.term-row-chk').forEach(function (c) { c.checked = chkAll.checked; });
      updateBatchBar();
    });
    document.addEventListener('change', function (e) {
      if (e.target && e.target.classList.contains('term-row-chk')) updateBatchBar();
    });
  }

  function updateBatchBar() {
    var checked = document.querySelectorAll('.term-row-chk:checked');
    var bar     = document.getElementById('termBatchBar');
    var cnt     = document.getElementById('termBatchCount');
    if (bar)    bar.classList.toggle('on', checked.length > 0);
    if (cnt)    cnt.textContent = checked.length;
  }

  function getCheckedIds() {
    var ids = [];
    document.querySelectorAll('.term-row-chk:checked').forEach(function (c) {
      ids.push(parseInt(c.dataset.id, 10));
    });
    return ids;
  }

  /* ── 일괄처리 ── */
  function initBatchActions() {
    var btnApprove = document.getElementById('btnBatchApprove');
    var btnReject  = document.getElementById('btnBatchReject');
    var btnCancel  = document.getElementById('btnBatchCancel');

    if (btnApprove) btnApprove.addEventListener('click', function () {
      var ids = getCheckedIds();
      ids.forEach(function (id) { var t = TERMS.find(function (x) { return x.id === id; }); if (t) t.status = 'active'; });
      clearChecks();
      renderTermTable(TERMS);
      showToast(ids.length + '건이 승인되었습니다.');
    });

    if (btnReject) btnReject.addEventListener('click', function () {
      var ids = getCheckedIds();
      ids.forEach(function (id) { var t = TERMS.find(function (x) { return x.id === id; }); if (t) t.status = 'inactive'; });
      clearChecks();
      renderTermTable(TERMS);
      showToast(ids.length + '건이 반려되었습니다.');
    });

    if (btnCancel) btnCancel.addEventListener('click', clearChecks);
  }

  function clearChecks() {
    document.querySelectorAll('.term-row-chk,.term-chk-all').forEach(function (c) { c.checked = false; });
    var chkAll = document.getElementById('termChkAll');
    if (chkAll) chkAll.checked = false;
    updateBatchBar();
  }

  /* ── 필터 칩 토글 + 검색 ── */
  function initFilterBtns() {
    ['termTypeGroup','termFieldGroup','termStatusGroup'].forEach(function (groupId) {
      var grp = document.getElementById(groupId);
      if (!grp) return;
      grp.querySelectorAll('.term-chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
          grp.querySelectorAll('.term-chip').forEach(function (b) { b.classList.remove('on'); });
          this.classList.add('on');
          applyTermFilter();
        });
      });
    });

    var termSearch = document.getElementById('termSearch');
    if (termSearch) termSearch.addEventListener('input', applyTermFilter);

    var searchBtn = document.getElementById('btnTermSearch');
    if (searchBtn) searchBtn.addEventListener('click', applyTermFilter);

    var resetBtn = document.getElementById('btnTermReset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      document.querySelectorAll('.term-chip-group .term-chip').forEach(function (c) { c.classList.remove('on'); });
      document.querySelectorAll('.term-chip-group .term-chip[data-val=""]').forEach(function (c) { c.classList.add('on'); });
      var inp = document.getElementById('termSearch');
      if (inp) inp.value = '';
      renderTermTable(TERMS);
      renderTermPagination(TERMS.length);
    });

    var addBtn = document.getElementById('btnTermAdd');
    if (addBtn) addBtn.addEventListener('click', function () { openAddModal(); });
  }

  function getTermChipVal(groupId) {
    var grp = document.getElementById(groupId);
    if (!grp) return '';
    var on = grp.querySelector('.term-chip.on');
    return on ? (on.dataset.val || '') : '';
  }

  var FIELD_MAP = { energy:'에너지', mobility:'모빌리티', safety:'세이프티', data:'데이터', env:'환경' };

  function applyTermFilter() {
    var type   = getTermChipVal('termTypeGroup');
    var field  = getTermChipVal('termFieldGroup');
    var status = getTermChipVal('termStatusGroup');
    var q = ((document.getElementById('termSearch') || {}).value || '').trim().toLowerCase();

    var filtered = TERMS.filter(function (t) {
      if (field  && t.field    !== (FIELD_MAP[field] || field)) return false;
      if (status && t.status   !== status) return false;
      if (q && t.term.indexOf(q) < 0 && t.eng.toLowerCase().indexOf(q) < 0 && t.syn.indexOf(q) < 0) return false;
      return true;
    });
    renderTermTable(filtered);
    renderTermPagination(filtered.length);
    if (window.lucide) lucide.createIcons();
  }

  /* ── 표준어 테이블 ── */
  function renderTermTable(data) {
    var tbody   = document.getElementById('termTbody');
    var countEl = document.getElementById('termCount');
    if (!tbody) return;
    if (countEl) countEl.textContent = '전체 ' + data.length + '건';

    tbody.innerHTML = data.map(function (t) {
      var stCls = { active:'active', review:'review', inactive:'inactive' }[t.status] || 'inactive';
      var stLbl = { active:'사용중', review:'검토중', inactive:'미사용' }[t.status] || t.status;
      return [
        '<tr data-id="' + t.id + '">',
          '<td><input type="checkbox" class="term-row-chk" data-id="' + t.id + '" aria-label="선택"></td>',
          '<td class="l" style="font-weight:700;color:var(--fg-1)">' + t.term + '</td>',
          '<td class="l" style="color:var(--fg-3);font-size:12px">' + t.eng + '</td>',
          '<td>' + t.field + '</td>',
          '<td class="l" style="font-size:12px;color:var(--fg-2)">' + t.syn + '</td>',
          '<td><span class="am-status am-status--' + stCls + '">' + stLbl + '</span></td>',
          '<td style="font-size:12px;white-space:nowrap">' + t.regDate + '</td>',
          '<td style="font-size:12px;white-space:nowrap">' + t.lastUsed + '</td>',
          '<td style="text-align:center">',
            '<button class="tbtn tbtn--sm am-term-detail" data-id="' + t.id + '" type="button">보기</button>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function (e) {
        if (e.target.closest('input[type="checkbox"]')) return;
        openTermDrawer(parseInt(tr.dataset.id, 10));
      });
      var detailBtn = tr.querySelector('.am-term-detail');
      if (detailBtn) detailBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openTermDrawer(parseInt(tr.dataset.id, 10));
      });
      var chk = tr.querySelector('.term-row-chk');
      if (chk) chk.addEventListener('click', function (e) { e.stopPropagation(); });
    });
    if (window.lucide) lucide.createIcons();
  }

  function renderTermPagination(total) {
    var el = document.getElementById('termPagination');
    if (!el) return;
    el.innerHTML = [
      '<span class="ds-pg-info">전체 ' + (total || 0) + '건</span>',
      '<div class="ds-pg-btns">',
        pgBtn('&laquo;'), pgBtn('&lsaquo;'),
        pgBtn('1', true), pgBtn('2'),
        pgBtn('&rsaquo;'), pgBtn('&raquo;'),
      '</div>',
      '<div></div>'
    ].join('');
  }

  function pgBtn(label, active) {
    return '<button class="ds-pg-btn' + (active ? ' on' : '') + '" type="button">' + label + '</button>';
  }

  /* ── 표준어 드로어 ── */
  function initTermDrawer() {
    var drawer  = document.getElementById('termDrawer');
    var scrim   = document.getElementById('scrim');
    var closeX  = document.getElementById('tdClose');
    var cancelBtn = document.getElementById('tdCancelBtn');
    var saveBtn   = document.getElementById('tdSaveBtn');
    var histBtn   = document.getElementById('tdHistBtn');

    if (closeX)   closeX.addEventListener('click', function () { closeDrawer(drawer); });
    if (cancelBtn) cancelBtn.addEventListener('click', function () { closeDrawer(drawer); });
    if (scrim)    scrim.addEventListener('click', function () { closeDrawer(drawer); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer(drawer);
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (!selectedTerm) return;
      var termInput = document.getElementById('td_term');
      var engInput  = document.getElementById('td_eng');
      var fieldSel  = document.getElementById('td_field');
      var statusSel = document.getElementById('td_status');
      var descTA    = document.getElementById('td_desc');
      var memo      = document.getElementById('td_memo');

      if (termInput) selectedTerm.term = termInput.value.trim() || selectedTerm.term;
      if (engInput)  selectedTerm.eng  = engInput.value.trim()  || selectedTerm.eng;
      if (fieldSel)  selectedTerm.field = fieldSel.value;
      var statusMap = { '사용중':'active', '검토중':'review', '미사용':'inactive' };
      if (statusSel) selectedTerm.status = statusMap[statusSel.value] || 'active';
      if (descTA)    selectedTerm.desc = descTA.value;

      var hist = HIST_DB[selectedTerm.id] || (HIST_DB[selectedTerm.id] = []);
      var memoVal = (memo && memo.value.trim()) || '정보 수정';
      hist.unshift({ date: new Date().toISOString().slice(0,10), user:'관리자', action:'edit', body: memoVal });

      renderTermTable(TERMS);
      closeDrawer(drawer);
      showToast('표준어 정보가 저장되었습니다.');
    });

    if (histBtn) histBtn.addEventListener('click', function () {
      if (selectedTerm) openHistModal(selectedTerm);
    });

    document.querySelectorAll('.am-syn-del').forEach(function (btn) {
      btn.addEventListener('click', function () { this.closest('.am-syn-chip').remove(); });
    });
    var synAdd = document.getElementById('td_synAdd');
    if (synAdd) synAdd.addEventListener('click', function () {
      var v = prompt('동의어를 입력하세요:');
      if (v && v.trim()) {
        var span = document.createElement('span');
        span.className = 'am-syn-chip';
        span.innerHTML = v.trim() + ' <button class="am-syn-del" type="button">×</button>';
        span.querySelector('.am-syn-del').addEventListener('click', function () { span.remove(); });
        document.getElementById('td_synGroup').insertBefore(span, synAdd);
      }
    });

    var descTA = document.getElementById('td_desc');
    var hint   = document.getElementById('td_descHint');
    if (descTA && hint) descTA.addEventListener('input', function () { hint.textContent = this.value.length + '/500'; });

    var memoTA   = document.getElementById('td_memo');
    var memoHint = document.getElementById('td_memoHint');
    if (memoTA && memoHint) memoTA.addEventListener('input', function () { memoHint.textContent = this.value.length + '/300'; });
  }

  function openTermDrawer(id) {
    var t = TERMS.find(function (x) { return x.id === id; });
    if (!t) return;
    selectedTerm = t;

    set('tdTitle', t.term);

    setInput('td_term',    t.term);
    setInput('td_eng',     t.eng);
    setSelect('td_field',  t.field);
    var statusLbl = { active:'사용중', review:'검토중', inactive:'미사용' };
    setSelect('td_status', statusLbl[t.status] || t.status);

    var descTA = document.getElementById('td_desc');
    if (descTA) { descTA.value = t.desc || ''; }
    var hint = document.getElementById('td_descHint');
    if (hint) hint.textContent = (t.desc || '').length + '/500';

    var memoTA = document.getElementById('td_memo');
    if (memoTA) memoTA.value = '';
    var memoHint = document.getElementById('td_memoHint');
    if (memoHint) memoHint.textContent = '0/300';

    var lastInput = document.getElementById('td_lastUsed');
    if (lastInput) lastInput.value = t.lastUsed.replace(/\./g, '-');

    var synGroup = document.getElementById('td_synGroup');
    var addBtn   = document.getElementById('td_synAdd');
    if (synGroup && addBtn) {
      synGroup.querySelectorAll('.am-syn-chip').forEach(function (c) { c.remove(); });
      t.syn.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
        var span = document.createElement('span');
        span.className = 'am-syn-chip';
        span.innerHTML = s + ' <button class="am-syn-del" type="button">×</button>';
        span.querySelector('.am-syn-del').addEventListener('click', function () { span.remove(); });
        synGroup.insertBefore(span, addBtn);
      });
    }


    var drawer = document.getElementById('termDrawer');
    var scrim  = document.getElementById('scrim');
    if (drawer) drawer.classList.add('on');
    if (scrim)  scrim.classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeDrawer(drawer) {
    if (drawer) drawer.classList.remove('on');
    var scrim   = document.getElementById('scrim');
    var histOv  = document.getElementById('histOverlay');
    var termD   = document.getElementById('termDrawer');
    var specD   = document.getElementById('specDrawer');
    if (scrim) {
      var anyOpen = (histOv && histOv.classList.contains('on'))
                 || (termD  && termD  !== drawer && termD.classList.contains('on'))
                 || (specD  && specD  !== drawer && specD.classList.contains('on'));
      if (!anyOpen) scrim.classList.remove('on');
    }
  }

  /* ── 변경이력 모달 ── */
  function initHistModal() {
    var closeBtn = document.getElementById('histCloseBtn');
    var bg       = document.getElementById('histBg');
    if (closeBtn) closeBtn.addEventListener('click', closeHistModal);
    if (bg)       bg.addEventListener('click', closeHistModal);
  }

  function openHistModal(term) {
    set('histTermTitle', term.term);
    var list = document.getElementById('histList');
    if (!list) return;
    var items = HIST_DB[term.id] || [];
    if (!items.length) {
      list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--fg-4)">변경 이력이 없습니다.</div>';
    } else {
      list.innerHTML = items.map(function (h) {
        return [
          '<div class="am-hist-item">',
            '<div class="am-hist-item__meta">',
              '<strong>' + h.date + '</strong>' + h.user,
            '</div>',
            '<div class="am-hist-item__body">',
              '<span class="am-hist-item__action am-hist-item__action--' + h.action + '">' + { create:'등록', edit:'수정', approve:'승인', reject:'반려' }[h.action] + '</span>',
              '<div>' + h.body + '</div>',
            '</div>',
          '</div>'
        ].join('');
      }).join('');
    }
    document.getElementById('histOverlay').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeHistModal() {
    document.getElementById('histOverlay').classList.remove('on');
  }

  /* ── 용어 등록 모달 ── */
  function initAddModal() {
    var closeBtn  = document.getElementById('addCloseBtn');
    var cancelBtn = document.getElementById('addCancelBtn');
    var saveBtn   = document.getElementById('addSaveBtn');
    var bg        = document.getElementById('addBg');

    if (closeBtn)  closeBtn.addEventListener('click', closeAddModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAddModal);
    if (bg)        bg.addEventListener('click', closeAddModal);

    if (saveBtn) saveBtn.addEventListener('click', function () {
      var termV = (document.getElementById('add_term') || {}).value || '';
      var engV  = (document.getElementById('add_eng')  || {}).value || '';
      var fldV  = (document.getElementById('add_field')|| {}).value || '';
      if (!termV.trim()) { showToast('표준어를 입력해 주세요.'); return; }
      if (!engV.trim())  { showToast('영문명을 입력해 주세요.'); return; }
      if (!fldV)         { showToast('분야를 선택해 주세요.'); return; }

      var newId = Math.max.apply(null, TERMS.map(function (t) { return t.id; })) + 1;
      TERMS.push({
        id: newId, term: termV, eng: engV, field: fldV,
        syn: '', datasets: 0, linked: '—',
        status: 'review', regDate: new Date().toISOString().slice(0,10).replace(/-/g,'.'),
        lastUsed: '—', aiConf: 0, desc: (document.getElementById('add_desc') || {}).value || ''
      });
      renderTermTable(TERMS);
      renderTermPagination(TERMS.length);
      closeAddModal();
      showToast('표준어가 등록되었습니다. (검토중 상태)');
    });
  }

  function openAddModal() {
    ['add_term','add_eng','add_desc'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var fld = document.getElementById('add_field');
    if (fld) fld.value = '';
    document.getElementById('addOverlay').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeAddModal() {
    document.getElementById('addOverlay').classList.remove('on');
  }

  /* ── 탭 2: 정의서 항목 드로어 ── */
  var SPEC_CANDS = {
    5:  [{ name:'이용률(%)',            conf:72 }, { name:'설비 이용률',        conf:61 }, { name:'발전 이용률',       conf:48 }],
    10: [{ name:'계통 연계전압',         conf:71 }, { name:'연계 전압(V)',       conf:59 }, { name:'계통전압',          conf:44 }],
    14: [{ name:'일평균 발전량',         conf:69 }, { name:'일 평균 발전량(MWh)',conf:65 }, { name:'발전량 일평균',     conf:41 }],
    18: []
  };

  var selectedSpecItem = null;

  function getSpecCandidates(item) {
    if (SPEC_CANDS[item.no] !== undefined) return SPEC_CANDS[item.no];
    return [
      { name: item.rec,                conf: 95 },
      { name: item.rec + ' (유사어)',  conf: 82 },
      { name: item.name + ' 표준어',  conf: 67 }
    ];
  }

  function openSpecDrawer(no) {
    var item = null;
    for (var i = 0; i < SPEC_ITEMS.length; i++) {
      if (SPEC_ITEMS[i].no === no) { item = SPEC_ITEMS[i]; break; }
    }
    if (!item) return;
    selectedSpecItem = item;

    set('sd_no', '#' + item.no + ' 항목');
    set('sd_name', item.name);
    set('sd_eng', item.eng);
    set('sd_dtype', item.dtype);
    set('sd_sample', item.sample);
    set('sd_desc', item.desc);

    var reqEl = document.getElementById('sd_req');
    if (reqEl) reqEl.innerHTML = item.req
      ? '<span style="color:var(--status-danger);font-weight:700">필수</span>'
      : '<span style="color:var(--fg-4)">선택</span>';

    var badgeEl = document.getElementById('sd_mappedBadge');
    if (badgeEl) {
      var bCls = { '매핑완료':'badge--ok', '확인필요':'badge--warn', '미매핑':'badge--danger' }[item.mapped] || '';
      badgeEl.innerHTML = '<span class="badge ' + bCls + '">' + item.mapped + '</span>';
    }

    var candsEl = document.getElementById('sd_candidates');
    if (candsEl) {
      var cands = getSpecCandidates(item);
      if (!cands.length) {
        candsEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--fg-4);font-size:13px">추천 표준용어가 없습니다. 아래 직접 입력하세요.</div>';
      } else {
        candsEl.innerHTML = cands.map(function (c, idx) {
          var confColor = c.conf >= 85 ? 'var(--status-success)' : c.conf >= 65 ? 'var(--status-warning)' : 'var(--status-danger)';
          var isFirst   = (idx === 0 && item.mapped === '매핑완료');
          return [
            '<label class="sd-candidate' + (isFirst ? ' on' : '') + '">',
              '<input type="radio" name="sdCand" value="' + c.name + '"' + (isFirst ? ' checked' : '') + '>',
              '<span class="sd-candidate__name">' + c.name + '</span>',
              '<span class="sd-candidate__conf">',
                '<span class="sd-candidate__conf-bar">',
                  '<span class="sd-candidate__conf-fill" style="width:' + c.conf + '%;background:' + confColor + '"></span>',
                '</span>',
                '<span class="sd-candidate__conf-val" style="color:' + confColor + '">' + c.conf + '%</span>',
              '</span>',
            '</label>'
          ].join('');
        }).join('');
        candsEl.querySelectorAll('.sd-candidate').forEach(function (label) {
          label.addEventListener('click', function () {
            candsEl.querySelectorAll('.sd-candidate').forEach(function (l) { l.classList.remove('on'); });
            this.classList.add('on');
            var manualInput = document.getElementById('sd_manualInput');
            if (manualInput) manualInput.value = '';
          });
        });
      }
    }

    var manualInput = document.getElementById('sd_manualInput');
    if (manualInput) manualInput.value = '';

    var drawer = document.getElementById('specDrawer');
    var scrim  = document.getElementById('scrim');
    if (drawer) { drawer.classList.add('on'); drawer.removeAttribute('aria-hidden'); }
    if (scrim)  scrim.classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function initSpecDrawer() {
    var closeX    = document.getElementById('sdClose');
    var cancelBtn = document.getElementById('sdCancelBtn');
    var confirmBtn= document.getElementById('sdConfirmBtn');

    function closeSpecDrawer() {
      closeDrawer(document.getElementById('specDrawer'));
    }

    if (closeX)    closeX.addEventListener('click', closeSpecDrawer);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSpecDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var d = document.getElementById('specDrawer');
        if (d && d.classList.contains('on')) closeSpecDrawer();
      }
    });

    if (confirmBtn) confirmBtn.addEventListener('click', function () {
      if (!selectedSpecItem) return;
      var selected = '';
      var checked  = document.querySelector('input[name="sdCand"]:checked');
      if (checked) selected = checked.value;
      var manualInput = document.getElementById('sd_manualInput');
      if (manualInput && manualInput.value.trim()) selected = manualInput.value.trim();
      if (!selected) { showToast('표준용어를 선택하거나 직접 입력하세요.'); return; }

      selectedSpecItem.rec    = selected;
      selectedSpecItem.mapped = '매핑완료';
      renderSpecTable(SPEC_ITEMS);
      renderSpecPagination(SPEC_ITEMS.length);
      closeSpecDrawer();
      showToast('"' + selectedSpecItem.name + '" 항목의 표준용어 매핑이 확정되었습니다.');
    });
  }

  /* ── 유틸 ── */
  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setInput(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  function setSelect(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    Array.from(el.options).forEach(function (o) { o.selected = (o.text === text || o.value === text); });
  }

  var _toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('amToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'amToast';
      el.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(10px);background:var(--fg-1);color:#fff;padding:10px 22px;border-radius:var(--radius-pill);font:600 13px/1 var(--font-sans);z-index:9999;opacity:0;transition:opacity .22s,transform .22s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
      el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2800);
  }


  /* ═══════════════════════════════════════════
     AI 카탈로그 등록 (통합 워크플로우)
  ═══════════════════════════════════════════ */
  var REG_DATA = [
    { id:'HUB-TRF-014', cat:'교통', name:'교통량 상시조사 자료', en:'Traffic Volume Survey', ifId:'IF-TRF-014', dept:'교통정책과', cycle:'일 1회', format:'CSV / API', last:'2026-06-23',
      theme:'교통·모빌리티', keywords:['교통량','상시조사','지점'], descSeed:'광명시 주요 지점의 교통량 상시조사 결과입니다. 지점·차종·시간대별 통행량을 일 단위로 집계합니다.',
      fields:[ {name:'지점코드',type:'String',std:'지점코드'}, {name:'조사일자',type:'Date',std:'조사일자'}, {name:'차종',type:'String',std:'차종'},
               {name:'시간대',type:'String',std:'시간대'}, {name:'통행량',type:'Number',std:'통행량'}, {name:'방향',type:'String',std:'방향구분'},
               {name:'혼잡도지수',type:'Number',std:null}, {name:'평균속도',type:'Number',std:'평균속도'} ] },
    { id:'HUB-MOB-022', cat:'교통', name:'공공자전거 대여이력', en:'Public Bike Rental History', ifId:'IF-MOB-022', dept:'교통정책과', cycle:'5분', format:'API / JSON', last:'2026-06-23',
      theme:'교통·모빌리티', keywords:['공공자전거','대여','반납'], descSeed:'공공자전거 대여소별 대여·반납 이력입니다. 대여소, 이용시간, 이동거리 정보를 포함합니다.',
      fields:[ {name:'대여소ID',type:'String',std:'대여소식별자'}, {name:'대여일시',type:'DateTime',std:'대여일시'}, {name:'반납일시',type:'DateTime',std:'반납일시'},
               {name:'이용시간',type:'Number',std:'이용시간'}, {name:'이동거리',type:'Number',std:'이동거리'}, {name:'자전거번호',type:'String',std:null},
               {name:'회원구분',type:'String',std:'회원구분'} ] },
    { id:'HUB-ENV-031', cat:'환경', name:'하천 수위 센서', en:'River Water Level Sensor', ifId:'IF-ENV-031', dept:'안전총괄과', cycle:'10분', format:'API / JSON', last:'2026-06-23',
      theme:'환경·안전', keywords:['하천','수위','센서','침수'], descSeed:'광명시 하천 수위 센서의 10분 단위 실시간 수위 측정값입니다. 침수 예경보 시스템과 연계됩니다.',
      fields:[ {name:'센서ID',type:'String',std:'센서식별자'}, {name:'측정일시',type:'DateTime',std:'측정일시'}, {name:'수위',type:'Number',std:'수위'},
               {name:'경보단계',type:'String',std:null}, {name:'하천명',type:'String',std:'하천명'}, {name:'설치위치',type:'String',std:'설치위치'} ] },
    { id:'HUB-ENG-009', cat:'에너지', name:'공공건물 에너지 사용량', en:'Public Building Energy Usage', ifId:'IF-ENG-009', dept:'기후에너지과', cycle:'일 1회', format:'CSV / API', last:'2026-06-22',
      theme:'에너지·환경', keywords:['공공건물','에너지','전력','가스'], descSeed:'광명시 공공건물별 일일 에너지(전력·가스) 사용량 집계 데이터입니다.',
      fields:[ {name:'건물코드',type:'String',std:'건물코드'}, {name:'사용일자',type:'Date',std:'사용일자'}, {name:'전력사용량',type:'Number',std:'전력사용량'},
               {name:'가스사용량',type:'Number',std:'가스사용량'}, {name:'난방도일',type:'Number',std:null}, {name:'연면적',type:'Number',std:'연면적'} ] }
  ];

  var regSel = null, regMeta = null, regBusy = false;
  var regFilter = { q:'', cat:'', dept:'', fmt:'' };

  function regEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function byReg(id){ return REG_DATA.filter(function(x){ return x.id===id; })[0]; }
  function curQ(){ var s=document.getElementById('regSearch'); return s ? s.value.trim() : ''; }

  function initReg(){
    renderRegList();
    initRegFilters();
    var input = document.getElementById('regInput'), send = document.getElementById('regSend');
    if (send) send.addEventListener('click', regFire);
    if (input){
      input.addEventListener('keydown', function(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); regFire(); } });
      input.addEventListener('input', function(){ this.style.height='auto'; this.style.height=Math.min(this.scrollHeight,120)+'px'; });
    }
    var meta = document.getElementById('regMeta');
    if (meta){ meta.addEventListener('input', regOnEdit); meta.addEventListener('change', regOnEdit); }
    var submit = document.getElementById('regSubmit');
    if (submit) submit.addEventListener('click', regSubmitFn);
    var reset = document.getElementById('regReset');
    if (reset) reset.addEventListener('click', function(){ if (regSel && !confirm('진행 중인 내용을 초기화할까요?')) return; resetReg(); });
  }

  function renderRegList(){
    var box = document.getElementById('regList'); if(!box) return;
    var data = REG_DATA.filter(function(d){
      if (regFilter.q && (d.name+' '+d.ifId).toLowerCase().indexOf(regFilter.q.toLowerCase())<0) return false;
      if (regFilter.cat && d.cat !== regFilter.cat) return false;
      if (regFilter.dept && d.dept !== regFilter.dept) return false;
      if (regFilter.fmt && d.format.indexOf(regFilter.fmt) < 0) return false;
      return true;
    });
    if(!data.length){ box.innerHTML = '<div class="reg-list__empty">미등록 데이터가 없습니다.</div>'; return; }
    box.innerHTML = data.map(function(d){
      return '<button class="reg-item'+(regSel===d.id?' is-active':'')+'" type="button" data-id="'+d.id+'">'
        + '<div class="reg-item__name">'+regEsc(d.name)+'</div>'
        + '<div class="reg-item__meta">'+regEsc(d.ifId)+' · '+regEsc(d.dept)+' <span class="reg-item__tag">수집중</span></div>'
        + '</button>';
    }).join('');
    box.querySelectorAll('.reg-item').forEach(function(b){ b.addEventListener('click', function(){ selectReg(this.dataset.id); }); });
    if (window.lucide) lucide.createIcons();
  }

  function resetReg(){
    regSel = null; regMeta = null; regBusy = false;
    renderRegList();
    var thread = document.getElementById('regThread');
    if (thread) thread.innerHTML = '<div class="reg-chat__empty"><i data-lucide="messages-square"></i><p>왼쪽에서 카탈로그 미등록 데이터를 선택하면<br>AI가 정의서·구조를 분석해 메타데이터를 제안합니다.</p></div>';
    var comp = document.getElementById('regComposer'); if (comp) comp.style.display = 'none';
    var meta = document.getElementById('regMeta'); if (meta) meta.innerHTML = '<div class="reg-meta__empty"><i data-lucide="file-cog"></i><p>데이터를 선택하면<br>AI가 메타데이터를 채웁니다.</p></div>';
    var ft = document.getElementById('regMetaFt'); if (ft) ft.style.display = 'none';
    var rb = document.getElementById('regReset'); if (rb) rb.style.display = 'none';
    var input = document.getElementById('regInput'); if (input){ input.value = ''; input.style.height = 'auto'; }
    setStep(1);
    if (window.lucide) lucide.createIcons();
  }

  function initRegFilters(){
    var search = document.getElementById('regSearch');
    if (search) search.addEventListener('input', function(){ regFilter.q = this.value.trim(); renderRegList(); });
    var cats = []; REG_DATA.forEach(function(d){ if(cats.indexOf(d.cat)<0) cats.push(d.cat); });
    var chipBox = document.getElementById('regCatChips');
    if (chipBox){
      chipBox.innerHTML = '<button class="reg-chip-f on" type="button" data-cat="">전체</button>'
        + cats.map(function(c){ return '<button class="reg-chip-f" type="button" data-cat="'+regEsc(c)+'">'+regEsc(c)+'</button>'; }).join('');
      chipBox.querySelectorAll('.reg-chip-f').forEach(function(b){
        b.addEventListener('click', function(){
          chipBox.querySelectorAll('.reg-chip-f').forEach(function(x){ x.classList.remove('on'); });
          this.classList.add('on'); regFilter.cat = this.dataset.cat; renderRegList();
        });
      });
    }
    var depts = []; REG_DATA.forEach(function(d){ if(depts.indexOf(d.dept)<0) depts.push(d.dept); });
    var dsel = document.getElementById('regDept');
    if (dsel){
      dsel.innerHTML = '<option value="">전체 부서</option>' + depts.map(function(d){ return '<option value="'+regEsc(d)+'">'+regEsc(d)+'</option>'; }).join('');
      dsel.addEventListener('change', function(){ regFilter.dept = this.value; renderRegList(); });
    }
    var fmts = []; REG_DATA.forEach(function(d){ d.format.split('/').forEach(function(p){ p=p.trim(); if(p && fmts.indexOf(p)<0) fmts.push(p); }); });
    var fsel = document.getElementById('regFmt');
    if (fsel){
      fsel.innerHTML = '<option value="">전체 형식</option>' + fmts.map(function(f){ return '<option value="'+regEsc(f)+'">'+regEsc(f)+'</option>'; }).join('');
      fsel.addEventListener('change', function(){ regFilter.fmt = this.value; renderRegList(); });
    }
  }

  function buildMeta(d){
    return { title:d.name, titleEn:d.en||'', desc:d.descSeed, theme:d.theme, keywords:d.keywords.slice(),
      provider:d.dept, cycle:d.cycle, format:d.format, access:'공개', license:'CC BY 4.0',
      terms: d.fields.map(function(f){ return { field:f.name, type:f.type, std:f.std, isNew:!f.std, name:(f.std||f.name) }; }) };
  }

  function selectReg(id){
    if (regBusy) return;
    var d = byReg(id); if(!d) return;
    regSel = id; regMeta = buildMeta(d);
    renderRegList();
    var thread = document.getElementById('regThread');
    thread.innerHTML = '';
    document.getElementById('regComposer').style.display = 'block';
    var rb0 = document.getElementById('regReset'); if (rb0) rb0.style.display = 'inline-flex';
    renderMeta();
    setStep(2);
    regBusy = true;
    var body = regTyping();
    setTimeout(function(){
      body.innerHTML = aiIntroHtml(d, regMeta);
      regBusy = false; setStep(3); validateReg();
      if (window.lucide) lucide.createIcons(); regScroll();
    }, 600);
  }

  function aiIntroHtml(d, m){
    var exist = m.terms.filter(function(t){ return !t.isNew; }).length;
    var news  = m.terms.filter(function(t){ return t.isNew; });
    var nl = news.map(function(t){ return '<span class="new">'+regEsc(t.field)+'</span>'; }).join(', ');
    return '<b>'+regEsc(d.name)+'</b>의 인터페이스 정의서(<b>'+regEsc(d.ifId)+'</b>)와 데이터 구조를 확인했습니다.'
      + '<ul>'
      + '<li>항목 <b>'+m.terms.length+'개</b> 인식 · '+regEsc(d.format)+' · 수집주기 '+regEsc(d.cycle)+'</li>'
      + '<li>표준용어 <span class="ok">기존 매핑 '+exist+'건</span> / <span class="new">신규 등록 제안 '+news.length+'건</span>'+(news.length?' — '+nl:'')+'</li>'
      + '</ul>'
      + '오른쪽 패널에 메타데이터 초안을 채웠습니다. 공개범위·주제 등을 자연어로 조정하거나 바로 <b>카탈로그 등록</b>하세요.'
      + (news.length ? '<br><br>신규 표준용어 '+news.length+'건은 <b>등록하는 순간 표준용어 사전에 자동 등재</b>됩니다.' : '');
  }

  function regFld(label, ctrl, req, ai, who){
    var tags = (req?'<span class="req">*</span>':'')
      + (ai?' <span class="ai"><i data-lucide="sparkles"></i>AI</span>':'')
      + (who?' <span class="ai" style="background:var(--gp-primary-soft);color:var(--gp-primary)">'+who+'</span>':'');
    return '<div class="reg-fld"><div class="reg-fld__lb">'+regEsc(label)+tags+'</div>'+ctrl+'</div>';
  }
  function regOpt(arr, sel){ return arr.map(function(o){ return '<option'+(o===sel?' selected':'')+'>'+o+'</option>'; }).join(''); }

  function renderMeta(){
    var box = document.getElementById('regMeta'); if(!box || !regMeta) return;
    var m = regMeta;
    var exist = m.terms.filter(function(t){ return !t.isNew; }).length, news = m.terms.length - exist;
    var rows = m.terms.map(function(t){
      return '<div class="reg-term"><div class="reg-term__field">'+regEsc(t.field)+'<small>'+regEsc(t.type)+'</small></div>'
        + (t.isNew
            ? '<span class="reg-term__std newterm"><i data-lucide="plus-circle"></i>신규: '+regEsc(t.name)+'</span>'
            : '<span class="reg-term__std exist"><i data-lucide="check-circle"></i>'+regEsc(t.name)+'</span>')
        + '</div>';
    }).join('');
    box.innerHTML =
        regFld('데이터셋명', '<input type="text" data-fld="title" value="'+regEsc(m.title)+'">', true, false)
      + regFld('영문명', '<input type="text" data-fld="titleEn" value="'+regEsc(m.titleEn)+'" placeholder="영문명">', false, false)
      + regFld('설명', '<textarea data-fld="desc">'+regEsc(m.desc)+'</textarea>', true, false)
      + regFld('주제영역', '<input type="text" data-fld="theme" value="'+regEsc(m.theme)+'">', false, false)
      + regFld('키워드', '<input type="text" data-fld="keywords" value="'+regEsc(m.keywords.join(', '))+'" placeholder="쉼표로 구분">', false, false)
      + regFld('공개범위', '<select data-fld="access">'+regOpt(['공개','제한공개','비공개'], m.access)+'</select>', true, false, '사람')
      + regFld('제공기관', '<input type="text" data-fld="provider" value="'+regEsc(m.provider)+'">', false, false, '자동')
      + regFld('갱신주기', '<input type="text" data-fld="cycle" value="'+regEsc(m.cycle)+'">', false, false, '자동')
      + regFld('데이터 형식', '<input type="text" data-fld="format" value="'+regEsc(m.format)+'">', false, false, '자동')
      + regFld('라이선스', '<input type="text" data-fld="license" value="'+regEsc(m.license)+'">', false, false)
      + '<div class="reg-fld"><div class="reg-fld__lb"><i data-lucide="link"></i>표준용어 매핑 <span class="ai">자동</span></div>'
        + '<div class="reg-terms">'+rows+'</div>'
        + '<div class="reg-term-sum"><span class="exist"><i data-lucide="check"></i>기존 '+exist+'</span><span class="newterm"><i data-lucide="plus"></i>신규 '+news+'</span></div>'
      + '</div>';
    document.getElementById('regMetaFt').style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }

  function regOnEdit(e){
    var el = e.target.closest('[data-fld]'); if(!el || !regMeta) return;
    var f = el.dataset.fld;
    if (f==='title') regMeta.title = el.value;
    else if (f==='titleEn') regMeta.titleEn = el.value;
    else if (f==='desc') regMeta.desc = el.value;
    else if (f==='theme') regMeta.theme = el.value;
    else if (f==='access') regMeta.access = el.value;
    else if (f==='provider') regMeta.provider = el.value;
    else if (f==='cycle') regMeta.cycle = el.value;
    else if (f==='format') regMeta.format = el.value;
    else if (f==='license') regMeta.license = el.value;
    else if (f==='keywords') regMeta.keywords = el.value.split(',').map(function(x){ return x.trim(); }).filter(Boolean);
    validateReg();
  }

  function validateReg(){
    var v = document.getElementById('regValid'), btn = document.getElementById('regSubmit');
    if(!v || !btn) return;
    var ok = regMeta && regMeta.title.trim() && regMeta.desc.trim() && regMeta.access;
    if (ok){ v.className='reg-valid ok'; v.innerHTML='<i data-lucide="check-circle"></i>DCAT-AP 표준 검증 통과 · 등록 가능'; btn.disabled=false; }
    else { v.className='reg-valid warn'; v.innerHTML='<i data-lucide="alert-circle"></i>데이터셋명·설명을 확인하세요'; btn.disabled=true; }
    if (window.lucide) lucide.createIcons();
  }

  function regFire(){
    var input = document.getElementById('regInput'); var t = (input.value||'').trim();
    if(!t || regBusy || !regMeta) return;
    regUser(t); input.value=''; input.style.height='auto';
    regBusy = true; var body = regTyping();
    setTimeout(function(){ body.innerHTML = applyCommand(t); regBusy=false; renderMeta(); validateReg(); if(window.lucide) lucide.createIcons(); regScroll(); }, 480);
  }

  function applyCommand(t){
    var ch = [];
    if(/비공개/.test(t)){ regMeta.access='비공개'; ch.push('공개범위 → <b>비공개</b>'); }
    else if(/제한\s*공개/.test(t)){ regMeta.access='제한공개'; ch.push('공개범위 → <b>제한공개</b>'); }
    else if(/공개/.test(t)){ regMeta.access='공개'; ch.push('공개범위 → <b>공개</b>'); }
    var mt = t.match(/주제[^가-힣]*['"]?([가-힣·\w ]{2,15})['"]?\s*(?:으로|로)/);
    if(mt){ regMeta.theme = mt[1].trim(); ch.push('주제영역 → <b>'+regEsc(regMeta.theme)+'</b>'); }
    var kw = t.match(/키워드\s*['"]?([가-힣\w]{1,12})['"]?\s*추가/);
    if(kw){ regMeta.keywords.push(kw[1]); ch.push('키워드 <b>'+regEsc(kw[1])+'</b> 추가'); }
    if(ch.length) return '반영했습니다. '+ch.join(', ')+'. 오른쪽 패널을 확인하세요.';
    return '메타데이터 항목을 자연어로 조정할 수 있어요. 예: "공개범위 제한공개로", "주제 교통으로", "키워드 OOO 추가". 준비되면 <b>카탈로그 등록</b>을 눌러 주세요.';
  }

  function regSubmitFn(){
    var btn = document.getElementById('regSubmit');
    if(!regMeta || (btn && btn.disabled)) return;
    var news = regMeta.terms.filter(function(t){ return t.isNew; });
    var exist = regMeta.terms.length - news.length;
    var name = regMeta.title, access = regMeta.access;
    setStep(4);
    regUser('카탈로그에 등록해줘.');
    regBusy = true; var body = regTyping();
    setTimeout(function(){
      body.innerHTML = '<b>'+regEsc(name)+'</b> 카탈로그(CKAN) 등록을 완료했습니다.'
        + '<ul><li>DCAT-AP 메타데이터 등록 · 공개범위 <b>'+regEsc(access)+'</b></li>'
        + '<li>표준용어 <span class="ok">기존 매핑 '+exist+'건</span>'
        + (news.length ? ' · <span class="new">신규 '+news.length+'건 표준용어 사전 자동 등재</span>' : '') + '</li></ul>';
      regBusy = false;
      if (typeof showToast === 'function') showToast('카탈로그 등록 완료 · 표준용어 '+news.length+'건 신규 등재');
      REG_DATA = REG_DATA.filter(function(x){ return x.id !== regSel; });
      regSel = null; regMeta = null;
      renderRegList();
      document.getElementById('regMeta').innerHTML = '<div class="reg-meta__empty"><i data-lucide="file-cog"></i><p>데이터를 선택하면<br>AI가 메타데이터를 채웁니다.</p></div>';
      document.getElementById('regMetaFt').style.display = 'none';
      document.getElementById('regComposer').style.display = 'none';
      var rb1 = document.getElementById('regReset'); if (rb1) rb1.style.display = 'none';
      setStep(1);
      if (window.lucide) lucide.createIcons(); regScroll();
    }, 700);
  }

  function regMsg(role, html){
    var thread = document.getElementById('regThread');
    var el = document.createElement('div'); el.className = 'reg-msg reg-msg--'+role;
    el.innerHTML = '<div class="reg-msg__av"><i data-lucide="'+(role==='ai'?'sparkles':'user')+'"></i></div><div class="reg-msg__bubble">'+html+'</div>';
    thread.appendChild(el); if (window.lucide) lucide.createIcons(); regScroll();
    return el.querySelector('.reg-msg__bubble');
  }
  function regUser(t){ return regMsg('user', regEsc(t)); }
  function regTyping(){ return regMsg('ai', '<div class="reg-typing"><span></span><span></span><span></span></div>'); }
  function regScroll(){ var th = document.getElementById('regThread'); if(th) th.scrollTop = th.scrollHeight; }

  function setStep(n){
    var steps = document.querySelectorAll('#regSteps .reg-step');
    steps.forEach(function(s){ var v=parseInt(s.dataset.step,10); s.classList.toggle('is-on', v===n); s.classList.toggle('is-done', v<n); });
  }


  init();
})();
