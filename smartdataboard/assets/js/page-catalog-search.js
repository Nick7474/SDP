/* =====================================================================
   광명 스마트데이터보드 · 데이터 검색·조회 (대화형 / Chat UI)
   - 자연어로 질의 → AI가 마크다운(md)으로 데이터 응답 → 렌더링
   - 추천 검색어 / 최근 검색어 유지
   ===================================================================== */
(function () {
  'use strict';

  var SUGGESTS = [
    'DRT 노선의 시간대별 운행 정보를 보여줘',
    '오류가 많이 발생한 데이터를 찾아줘',
    '특정 데이터 값을 찾아줘',
    '15시에 도착한 DRT 버스가 뭐야?',
    '전기차 충전소 데이터의 최근 갱신 상태를 알려줘',
    'API 제공 가능한 교통 데이터를 보여줘'
  ];

  var DATASETS = [
    { id:'ds1',  rank:1,  modified:'2026-06-18', downloads:3820,
      title:'태양광 발전량 및 탄소 배출량',
      tags:[{label:'환경',cls:'env'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 기후에너지과', type:'CSV / API', cycle:'일 1회', scope:'공개',
      simTotal:0.94, simGeo:0.96, simDesc:0.91, simTag:0.97, simMeta:0.93,
      desc:'광명시 관내 태양광 발전 설비의 시간대별 발전량(kWh) 및 탄소 배출 저감량을 집계한 데이터셋입니다. 설비별 누적 발전량, CO₂ 절감 환산값, 계통 연계 현황을 포함합니다.',
      keywords:['태양광','발전량','탄소중립','에너지','재생에너지','CO2','탄소배출'],
      subject:'에너지 · 환경', license:'CC BY 4.0',
      endpoint:'/api/v1/energy/solar', size:'2.4 MB', formats:['CSV','JSON','XLSX'] },
    { id:'ds2',  rank:2,  modified:'2026-06-19', downloads:2910,
      title:'대기측정소별 실시간 측정정보',
      tags:[{label:'환경',cls:'env'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 기후환경과', type:'API / JSON', cycle:'30분', scope:'공개',
      simTotal:0.81, simGeo:0.84, simDesc:0.78, simTag:0.86, simMeta:0.75,
      desc:'광명시 내 대기측정소에서 30분 단위로 수집되는 미세먼지(PM2.5·PM10), 오존, CO, NO₂ 등 대기오염 측정 데이터를 제공합니다.',
      keywords:['대기질','PM2.5','PM10','미세먼지','오존','환경','대기오염','측정'],
      subject:'환경 · 기후', license:'CC BY 4.0',
      endpoint:'/api/v1/environment/air', size:'1.8 MB', formats:['JSON','CSV'] },
    { id:'ds3',  rank:3,  modified:'2026-06-17', downloads:1540,
      title:'친환경DRT 운행 현황 데이터',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'5분', scope:'공개',
      simTotal:0.74, simGeo:0.77, simDesc:0.71, simTag:0.78, simMeta:0.68,
      desc:'수요응답형 친환경 대중교통(DRT) 차량의 실시간 위치, 노선, 탑승 현황을 포함하는 운행 데이터입니다. 차량 ID, 좌표(WGS84), 속도, 탑승인원을 제공합니다.',
      keywords:['DRT','친환경교통','대중교통','모빌리티','운행정보','교통','버스'],
      subject:'교통 · 모빌리티', license:'CC BY 4.0',
      endpoint:'/api/v1/mobility/drt', size:'3.1 MB', formats:['CSV','JSON'] },
    { id:'ds4',  rank:4,  modified:'2026-06-15', downloads:980,
      title:'주민등록인구 통계',
      tags:[{label:'인구',cls:'city'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 행정지원과', type:'API / JSON', cycle:'일 1회', scope:'공개',
      simTotal:0.68, simGeo:0.70, simDesc:0.65, simTag:0.72, simMeta:0.60,
      desc:'광명시 주민등록 기준 인구 현황 통계입니다. 동별·성별·연령대별 인구 수를 일별로 집계하며, 전입·전출·출생·사망 변동 내역을 포함합니다.',
      keywords:['인구','주민등록','통계','행정','인구변동','동별','연령'],
      subject:'행정 · 인구', license:'CC BY 4.0',
      endpoint:'/api/v1/admin/population', size:'0.8 MB', formats:['JSON','CSV','XLSX'] },
    { id:'ds5',  rank:5,  modified:'2026-06-10', downloads:760,
      title:'소방긴급구조정보 - 진행내역',
      tags:[{label:'안전',cls:'safety'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 안전총괄과', type:'API', cycle:'실시간', scope:'제한공개',
      simTotal:0.62, simGeo:0.65, simDesc:0.59, simTag:0.66, simMeta:0.57,
      desc:'광명시 소방서의 긴급출동 및 구조·구급 진행 내역 데이터입니다. 신고 접수, 출동, 현장 도착, 조치 완료 단계별 시간 정보를 포함합니다.',
      keywords:['소방','긴급구조','안전','출동','구급','재난'],
      subject:'안전 · 재난', license:'공공누리 1유형',
      endpoint:'/api/v1/safety/fire', size:'1.2 MB', formats:['JSON'] },
    { id:'ds6',  rank:6,  modified:'2026-06-01', downloads:540,
      title:'전기차충전소 현황',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'월 1회', scope:'공개',
      simTotal:0.58, simGeo:0.60, simDesc:0.55, simTag:0.62, simMeta:0.52,
      desc:'광명시 내 전기차 충전소 위치, 충전기 수, 충전 방식(완속/급속), 운영 현황 등 기본 정보를 제공합니다.',
      keywords:['전기차','충전소','EV','충전인프라','모빌리티','교통'],
      subject:'교통 · 인프라', license:'CC BY 4.0',
      endpoint:'/api/v1/mobility/ev-station', size:'0.5 MB', formats:['CSV','JSON','XLSX'] },
    { id:'ds7',  rank:7,  modified:'2026-05-20', downloads:420,
      title:'어린이집 기본정보',
      tags:[{label:'복지',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 아동청소년과', type:'API / JSON', cycle:'월간', scope:'공개',
      simTotal:0.51, simGeo:0.53, simDesc:0.49, simTag:0.55, simMeta:0.48,
      desc:'광명시 관내 어린이집의 명칭, 위치, 유형(국공립/민간/직장 등), 정원, 현원, 연락처 등 기본 현황 정보를 제공합니다.',
      keywords:['어린이집','보육','아동','복지','시설현황','교육'],
      subject:'복지 · 교육', license:'공공누리 1유형',
      endpoint:'/api/v1/welfare/daycare', size:'0.3 MB', formats:['JSON','XLSX'] },
    { id:'ds8',  rank:8,  modified:'2026-05-15', downloads:310,
      title:'강우량계 시설 현황',
      tags:[{label:'스마트시티',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 스마트도시과', type:'API / JSON', cycle:'10분', scope:'공개',
      simTotal:0.47, simGeo:0.49, simDesc:0.44, simTag:0.51, simMeta:0.42,
      desc:'광명시 내 설치된 강우량계 센서의 실시간 강수량(mm/h) 측정 데이터입니다. 침수 예경보 시스템과 연동되며, 시설 위치 및 센서 상태 정보를 포함합니다.',
      keywords:['강우량','침수','기상','스마트시티','IoT','센서','재난'],
      subject:'기상 · 재난', license:'CC BY 4.0',
      endpoint:'/api/v1/environment/rainfall', size:'0.9 MB', formats:['JSON','CSV'] }
  ];

  var state = { active: false, busy: false };

  var recentSearches = (function () {
    try { return JSON.parse(localStorage.getItem('cs_recent') || '[]'); }
    catch (e) { return []; }
  }());
  function saveRecent() { localStorage.setItem('cs_recent', JSON.stringify(recentSearches)); }
  function addRecent(q) {
    recentSearches = recentSearches.filter(function (r) { return r !== q; });
    recentSearches.unshift(q);
    if (recentSearches.length > 8) recentSearches = recentSearches.slice(0, 8);
    saveRecent(); renderChips();
  }
  function removeRecent(q) {
    recentSearches = recentSearches.filter(function (r) { return r !== q; });
    saveRecent(); renderChips();
  }

  /* ── 부트 ── */
  function init() {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
  function boot() {
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) document.addEventListener('gmsb:shell-ready', onReady, { once: true });
    else onReady();
  }
  function onReady() {
    renderChips();
    initComposer('csInputHero', 'csSendHero', 'csAutoHero');
    initComposer('csInput', 'csSend', 'csAuto');
    initThreadClicks();
    initDrawers();
    initDownloadModal();
    initNewChat();
    initGuideDrawer();
    if (new URLSearchParams(location.search).get('guide') === 'open') {
      setTimeout(function () { openDrawer('guideDrawer'); }, 80);
    }
    if (window.lucide) lucide.createIcons();
  }

  /* ════════════════════════════════════════
     추천 / 최근 검색어 렌더 (히어로 + 컴포저)
  ════════════════════════════════════════ */
  function renderChips() {
    /* 히어로 추천 */
    var sg = document.getElementById('suggestChipsHero');
    if (sg) {
      sg.innerHTML = SUGGESTS.map(function (s) {
        return '<button class="csx-chip" type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('');
    }
    /* 히어로 최근 */
    var rWrap = document.getElementById('recentHero');
    var rList = document.getElementById('recentChipsHero');
    if (rWrap && rList) {
      if (!recentSearches.length) { rWrap.style.display = 'none'; }
      else {
        rWrap.style.display = '';
        rList.innerHTML = recentSearches.map(function (q) {
          return '<span class="csx-chip csx-chip--recent" data-q="' + esc(q) + '"><i data-lucide="clock"></i>' + esc(q) +
            '<button class="csx-chip__del" type="button" data-del="' + esc(q) + '" aria-label="삭제"><i data-lucide="x"></i></button></span>';
        }).join('');
      }
    }
    /* 컴포저 빠른 칩 (추천 + 최근) */
    var quick = document.getElementById('csxQuick');
    if (quick) {
      var parts = ['<span class="csx-suggest__lbl" style="margin-bottom:0"><i data-lucide="sparkles"></i>추천</span>'];
      SUGGESTS.slice(0, 5).forEach(function (s) {
        parts.push('<button class="csx-composer__chip" type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>');
      });
      recentSearches.slice(0, 3).forEach(function (q) {
        parts.push('<button class="csx-composer__chip" type="button" data-q="' + esc(q) + '"><i data-lucide="clock"></i>' + esc(q) + '</button>');
      });
      quick.innerHTML = parts.join('');
    }
    if (window.lucide) lucide.createIcons();
  }

  /* 추천/최근 칩 클릭 (위임) */
  document.addEventListener('click', function (e) {
    var del = e.target.closest('[data-del]');
    if (del) { e.preventDefault(); e.stopPropagation(); removeRecent(del.dataset.del); return; }
    var clr = e.target.closest('#recentClearHero');
    if (clr) { recentSearches = []; saveRecent(); renderChips(); return; }
    var chip = e.target.closest('.csx-chip[data-q], .csx-composer__chip[data-q]');
    if (chip) { submit(chip.dataset.q); }
  });

  /* ════════════════════════════════════════
     입력창(컴포저) — 전송 / 자동높이 / 자동완성
  ════════════════════════════════════════ */
  function initComposer(inputId, sendId, dropId) {
    var input = document.getElementById(inputId);
    var send  = document.getElementById(sendId);
    var drop  = document.getElementById(dropId);
    if (!input) return;

    function fire() {
      if (drop) drop.classList.remove('on');
      submit(input.value);
    }
    if (send) send.addEventListener('click', fire);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fire(); }
    });
    /* 자동 높이 */
    input.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 168) + 'px';
    });
    /* 자동완성 */
    if (drop) initAutocomplete(input, drop);
  }

  function initAutocomplete(input, drop) {
    input.addEventListener('input', function () {
      var q = this.value.trim();
      if (!q) { drop.classList.remove('on'); return; }
      var matches = DATASETS.filter(function (ds) {
        return ds.title.toLowerCase().indexOf(q.toLowerCase()) >= 0 ||
               (ds.keywords || []).some(function (k) { return k.toLowerCase().indexOf(q.toLowerCase()) >= 0; });
      }).slice(0, 5);
      if (!matches.length) { drop.classList.remove('on'); return; }
      drop.innerHTML = '<div class="csx-autocomplete__hd">추천 데이터셋</div>' +
        matches.map(function (ds) {
          return '<button class="csx-autocomplete__item" type="button" data-title="' + esc(ds.title) + '">' +
            '<i data-lucide="search"></i>' + highlight(ds.title, q) + '</button>';
        }).join('');
      drop.querySelectorAll('.csx-autocomplete__item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          drop.classList.remove('on');
          submit(this.dataset.title);
        });
      });
      drop.classList.add('on');
      if (window.lucide) lucide.createIcons();
    });
    input.addEventListener('blur', function () { setTimeout(function () { drop.classList.remove('on'); }, 180); });
  }

  /* ════════════════════════════════════════
     질의 → 응답
  ════════════════════════════════════════ */
  function submit(q) {
    q = (q || '').trim();
    if (!q || state.busy) return;

    activate();
    addRecent(q);
    appendUser(q);

    /* 입력창 비우기 */
    ['csInput', 'csInputHero'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.style.height = 'auto'; }
    });

    state.busy = true;
    var aiBody = appendAiTyping();
    scrollToEnd();

    setTimeout(function () {
      var matched = matchDatasets(q);
      aiBody.innerHTML = '<div class="md">' + mdToHtml(buildAnswer(q, matched)) + '</div>' + buildActions(matched);
      bindActions(aiBody, matched);
      state.busy = false;
      if (window.lucide) lucide.createIcons();
      scrollToEnd();
    }, 680);
  }

  function activate() {
    var csx = document.getElementById('csx');
    if (csx && !state.active) { csx.classList.add('is-active'); state.active = true; }
    var input = document.getElementById('csInput');
    if (input) setTimeout(function () { input.focus(); }, 50);
  }

  function appendUser(q) {
    var thread = document.getElementById('csxThread');
    var el = document.createElement('div');
    el.className = 'csx-msg csx-msg--user';
    el.innerHTML =
      '<div class="csx-msg__avatar"><i data-lucide="user"></i></div>' +
      '<div class="csx-msg__body"><div class="csx-msg__name">검색 요청</div>' +
      '<div class="csx-msg__text">' + esc(q) + '</div></div>';
    thread.appendChild(el);
    if (window.lucide) lucide.createIcons();
  }

  function appendAiTyping() {
    var thread = document.getElementById('csxThread');
    var el = document.createElement('div');
    el.className = 'csx-msg csx-msg--ai';
    el.innerHTML =
      '<div class="csx-msg__avatar"><i data-lucide="sparkles"></i></div>' +
      '<div class="csx-msg__body"><div class="csx-msg__name">AI 데이터 도우미</div>' +
      '<div class="csx-msg__content"><div class="csx-typing"><span></span><span></span><span></span></div></div></div>';
    thread.appendChild(el);
    if (window.lucide) lucide.createIcons();
    return el.querySelector('.csx-msg__content');
  }

  /* ── 질의 매칭 ── */
  function matchDatasets(q) {
    var toks = q.toLowerCase().replace(/[^가-힣a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    var scored = DATASETS.map(function (ds) {
      var hay = (ds.title + ' ' + ds.subject + ' ' + (ds.keywords || []).join(' ') + ' ' +
                 ds.tags.map(function (t) { return t.label; }).join(' ') + ' ' + ds.desc).toLowerCase();
      var score = 0;
      toks.forEach(function (t) { if (t.length > 1 && hay.indexOf(t) >= 0) score += 1; });
      return { ds: ds, score: score };
    });
    var hits = scored.filter(function (s) { return s.score > 0; });
    hits.sort(function (a, b) { return (b.score - a.score) || (b.ds.simTotal - a.ds.simTotal); });
    var list = (hits.length ? hits : scored.slice().sort(function (a, b) { return b.ds.simTotal - a.ds.simTotal; }))
      .slice(0, 5).map(function (s) { return s.ds; });
    return list;
  }

  /* ── 응답 마크다운 생성 (AI 서버 md 응답 모사) ── */
  function buildAnswer(q, list) {
    var top = list[0];
    var scenario = detectScenario(q);
    var lines = [];
    lines.push('**‘' + q + '’** 검색 결과, 관련성이 높은 데이터셋 **' + list.length + '건**을 찾았습니다.');
    if (scenario) {
      lines.push('');
      lines.push('> ' + scenario.summary);
    }
    lines.push('');
    lines.push('| # | 데이터셋 | 제공기관 | 데이터 형태 | 갱신 주기 | 공개 범위 | 유사도 |');
    lines.push('| --- | --- | --- | --- | --- | --- | ---: |');
    list.forEach(function (ds, i) {
      lines.push('| ' + (i + 1) + ' | [' + ds.title + '](#' + ds.id + ') | ' + ds.provider + ' | ' +
        ds.type + ' | ' + ds.cycle + ' | ' + ds.scope + ' | ' + ds.simTotal.toFixed(2) + ' |');
    });
    lines.push('');
    lines.push('> **가장 적합한 데이터셋**은 *' + top.title + '* (유사도 ' + top.simTotal.toFixed(2) + ')입니다. ' + top.desc);
    if (scenario && scenario.rows) {
      lines.push('');
      lines.push('**업무 질의 결과 예시**');
      lines = lines.concat(scenario.rows);
    }
    lines.push('');
    lines.push('**바로 할 수 있는 작업**');
    lines.push('- 데이터셋 이름을 누르면 상세·유사도 분석을 확인할 수 있습니다.');
    lines.push('- 제공 형식: ' + (top.formats || []).map(function (f) { return '`' + f + '`'; }).join(', ') + ' — 메타데이터 확인 후 다운로드 또는 API 신청이 가능합니다.');
    lines.push('- 표, 차트, 지도, 상세 패널은 실제 운영 연계 범위에 따라 단계적으로 연결합니다.');
    return lines.join('\n');
  }

  function detectScenario(q) {
    var s = q.toLowerCase();
    if (/(drt|버스)/i.test(q) && /(시간대|운행)/.test(q)) {
      return {
        summary: 'DRT 운행 현황 데이터에서 시간대별 운행 건수와 차량 상태를 조회하는 업무 시나리오입니다.',
        rows: [
          '| 시간대 | 운행 건수 | 평균 탑승 | 주요 노선 |',
          '| --- | ---: | ---: | --- |',
          '| 07~09시 | 42건 | 8.4명 | 광명역 ↔ 소하권 |',
          '| 15~16시 | 18건 | 5.2명 | 철산권 ↔ 하안권 |',
          '| 18~20시 | 51건 | 9.1명 | 광명역 ↔ 일직권 |'
        ]
      };
    }
    if (/오류|장애|실패|품질/.test(q)) {
      return {
        summary: '품질 점수와 갱신 실패 이력을 기준으로 오류 가능성이 높은 데이터셋을 찾는 운영 점검 시나리오입니다.',
        rows: [
          '| 점검 항목 | 데이터셋 | 상태 | 조치 |',
          '| --- | --- | --- | --- |',
          '| 갱신 지연 | 전기차충전소 현황 | 주의 | 원천 API 상태 확인 |',
          '| 메타 누락 | 강우량계 시설 현황 | 검토 | 담당부서/갱신주기 보완 |',
          '| 제한공개 | 소방긴급구조정보 | 제한 | 접근 권한 승인 필요 |'
        ]
      };
    }
    if (/(15시|15:00)/.test(q) && /(drt|버스)/i.test(q)) {
      return {
        summary: '15시 조건으로 DRT 도착 이력과 차량 ID를 좁혀 보는 상세 조회 시나리오입니다.',
        rows: [
          '| 도착시각 | 차량 ID | 노선 | 도착 정류장 | 상태 |',
          '| --- | --- | --- | --- | --- |',
          '| 15:02 | DRT-014 | 광명역 순환 | 일직동 환승거점 | 도착 |',
          '| 15:11 | DRT-021 | 하안권 순환 | 하안사거리 | 운행중 |',
          '| 15:27 | DRT-008 | 철산권 순환 | 철산역 | 도착 |'
        ]
      };
    }
    if (/특정|값|찾아/.test(q)) {
      return {
        summary: '값 기반 검색은 데이터셋명뿐 아니라 설명, 키워드, 메타데이터 항목까지 함께 탐색합니다.',
        rows: [
          '| 검색 범위 | 확인 내용 | 연결 화면 |',
          '| --- | --- | --- |',
          '| 데이터셋 | 관련 데이터셋 후보 | 상세 패널 |',
          '| 메타데이터 | 키워드/주제/Endpoint | 메타데이터 드로어 |',
          '| 제공 데이터 | 값 조건 조회 | 표/다운로드/API |'
        ]
      };
    }
    return null;
  }

  /* ── 응답 하단 액션(최상위 데이터셋 기준) ── */
  function buildActions(list) {
    var top = list[0];
    if (!top) return '';
    return '<div class="csx-msg__actions" data-top="' + top.id + '">' +
      '<button class="csx-act" data-act="detail"><i data-lucide="eye"></i>상세 보기</button>' +
      '<button class="csx-act" data-act="meta"><i data-lucide="file-text"></i>메타데이터 보기</button>' +
      '<button class="csx-act" data-act="chart"><i data-lucide="bar-chart-2"></i>차트 보기</button>' +
      '<button class="csx-act" data-act="map"><i data-lucide="map"></i>지도 보기</button>' +
      '<button class="csx-act" data-act="download"><i data-lucide="download"></i>다운로드</button>' +
      '<button class="csx-act csx-act--pri" data-act="api"><i data-lucide="cloud-upload"></i>API 신청</button>' +
      '</div>';
  }

  function bindActions(scope, list) {
    var top = list[0];
    /* 표 안 데이터셋 링크 → 상세 드로어 */
    scope.querySelectorAll('.csx-dslink').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var ds = byId(this.dataset.ds);
        if (ds) openDetailDrawer(ds);
      });
    });
    /* 하단 액션 버튼 */
    scope.querySelectorAll('.csx-act').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = this.dataset.act;
        if (!top) return;
        if (act === 'detail')   openDetailDrawer(top);
        if (act === 'meta')     openMetaDrawer(top);
        if (act === 'download') openDownloadModal(top);
        if (act === 'chart')    location.href = 'analysis-compare.html';
        if (act === 'map')      location.href = 'mile-map.html';
        if (act === 'api')      location.href = 'catalog-access.html';
      });
    });
  }

  function initThreadClicks() { /* 위임은 bindActions에서 직접 바인딩 */ }

  function scrollToEnd() {
    requestAnimationFrame(function () {
      var thread = document.getElementById('csxThread');
      if (!thread || !thread.lastElementChild) return;
      thread.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function byId(id) { return DATASETS.filter(function (d) { return d.id === id; })[0]; }

  /* 새 대화 */
  function initNewChat() {
    var btn = document.getElementById('csNewChat');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var csx = document.getElementById('csx');
      var thread = document.getElementById('csxThread');
      if (thread) thread.innerHTML = '';
      if (csx) csx.classList.remove('is-active');
      state.active = false; state.busy = false;
      var hero = document.getElementById('csInputHero');
      if (hero) { hero.value = ''; hero.style.height = 'auto'; hero.focus(); }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ════════════════════════════════════════
     경량 마크다운 렌더러 (오프라인 file:// 동작)
     지원: 제목·굵게·기울임·인라인코드·코드블록·링크·목록·인용·구분선·표
  ════════════════════════════════════════ */
  function mdToHtml(md) {
    var lines = String(md).replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^\s*$/.test(line)) { i++; continue; }

      /* 코드블록 */
      if (/^```/.test(line)) {
        i++; var code = [];
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        continue;
      }
      /* 제목 */
      var h = /^(#{1,4})\s+(.*)$/.exec(line);
      if (h) { var lv = h[1].length; out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>'); i++; continue; }
      /* 구분선 */
      if (/^\s*([-*_])\1\1+\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      /* 표 */
      if (line.indexOf('|') >= 0 && i + 1 < lines.length && isSepRow(lines[i + 1])) {
        var head = splitRow(line);
        var aligns = splitRow(lines[i + 1]).map(function (c) {
          var t = c.trim(); var l = t.charAt(0) === ':'; var r = t.charAt(t.length - 1) === ':';
          return (l && r) ? 'center' : (r ? 'right' : (l ? 'left' : ''));
        });
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf('|') >= 0 && lines[i].trim() !== '') { rows.push(splitRow(lines[i])); i++; }
        out.push(buildTable(head, aligns, rows));
        continue;
      }
      /* 인용 */
      if (/^\s*>\s?/.test(line)) {
        var bq = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) { bq.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        out.push('<blockquote>' + mdToHtml(bq.join('\n')) + '</blockquote>');
        continue;
      }
      /* 순서 목록 */
      if (/^\s*\d+\.\s+/.test(line)) {
        var oi = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { oi.push('<li>' + inline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>'); i++; }
        out.push('<ol>' + oi.join('') + '</ol>');
        continue;
      }
      /* 비순서 목록 */
      if (/^\s*[-*]\s+/.test(line)) {
        var ui = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { ui.push('<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>'); i++; }
        out.push('<ul>' + ui.join('') + '</ul>');
        continue;
      }
      /* 문단 */
      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4})\s/.test(lines[i]) &&
             !/^\s*>/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) &&
             !/^```/.test(lines[i]) && !(lines[i].indexOf('|') >= 0 && i + 1 < lines.length && isSepRow(lines[i + 1]))) {
        para.push(lines[i]); i++;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function isSepRow(l) {
    return /\|/.test(l) && /-/.test(l) && /^[\s|:\-]+$/.test(l);
  }
  function splitRow(l) {
    return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
  }
  function buildTable(head, aligns, rows) {
    function cls(idx) { var a = aligns[idx]; return a === 'right' ? ' class="is-num"' : (a === 'center' ? ' style="text-align:center"' : ''); }
    var th = head.map(function (c, idx) { return '<th' + cls(idx) + '>' + inline(c) + '</th>'; }).join('');
    var body = rows.map(function (r) {
      return '<tr>' + head.map(function (_, idx) { return '<td' + cls(idx) + '>' + inline(r[idx] || '') + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="md__table-wrap"><table><thead><tr>' + th + '</tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  function inline(t) {
    t = esc(t);
    t = t.replace(/`([^`]+)`/g, function (_, c) { return '<code>' + c + '</code>'; });
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, txt, url) {
      if (/^#ds/.test(url)) return '<a class="csx-dslink" data-ds="' + esc(url.slice(1)) + '">' + txt + '</a>';
      return '<a href="' + esc(url) + '">' + txt + '</a>';
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    return t;
  }

  /* ════════════════════════════════════════
     드로어 (상세 / 메타) — 기존 유지
  ════════════════════════════════════════ */
  var currentDs = null;

  function openDrawer(id) {
    closeDrawer();
    var el = document.getElementById(id);
    var scrim = document.getElementById('scrim');
    if (el) el.classList.add('on');
    if (scrim) scrim.classList.add('on');
  }
  function closeDrawer() {
    document.querySelectorAll('.drawer.on').forEach(function (d) { d.classList.remove('on'); });
    var scrim = document.getElementById('scrim');
    if (scrim) scrim.classList.remove('on');
  }
  function initDrawers() {
    var scrim = document.getElementById('scrim');
    if (scrim) scrim.addEventListener('click', closeDrawer);
    ['ddClose', 'ddCloseBtn'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('click', closeDrawer); });
    var ddMeta = document.getElementById('ddMetaBtn');
    if (ddMeta) ddMeta.addEventListener('click', function () { if (currentDs) { closeDrawer(); openMetaDrawer(currentDs); } });
    var ddDl = document.getElementById('ddDownloadBtn');
    if (ddDl) ddDl.addEventListener('click', function () { if (currentDs) { closeDrawer(); openDownloadModal(currentDs); } });
    var ddApi = document.getElementById('ddApiBtn');
    if (ddApi) ddApi.addEventListener('click', function () { location.href = 'catalog-access.html'; });
    ['mdClose', 'mdCloseBtn'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('click', closeDrawer); });
    var mdEdit = document.getElementById('mdEditBtn');
    if (mdEdit) mdEdit.addEventListener('click', function () { location.href = 'catalog-ai-meta.html'; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeDownloadModal(); } });
  }

  function initGuideDrawer() {
    var openBtn = document.getElementById('csGuideBtn');
    if (openBtn) openBtn.addEventListener('click', function () { openDrawer('guideDrawer'); });
    ['guideClose', 'guideCloseBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', closeDrawer);
    });
    var startBtn = document.getElementById('guideStartBtn');
    if (startBtn) startBtn.addEventListener('click', function () { guideAction('focus-search'); });
    document.querySelectorAll('[data-guide-action]').forEach(function (btn) {
      btn.addEventListener('click', function () { guideAction(this.dataset.guideAction); });
    });
  }

  function guideAction(action) {
    if (action === 'focus-search') {
      closeDrawer();
      var input = document.getElementById(state.active ? 'csInput' : 'csInputHero');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (action === 'ask-drt') {
      closeDrawer();
      submit('DRT 노선의 시간대별 운행 정보를 보여줘');
      return;
    }
    if (action === 'ask-error') {
      closeDrawer();
      submit('오류가 많이 발생한 데이터를 찾아줘');
      return;
    }
    if (action === 'open-meta') {
      closeDrawer();
      openMetaDrawer(DATASETS[0]);
      return;
    }
    if (action === 'go-dataset') location.href = 'catalog-dataset.html';
    if (action === 'go-ai-meta') location.href = 'catalog-ai-meta.html';
    if (action === 'go-access') location.href = 'catalog-access.html';
  }

  function openDetailDrawer(ds) {
    currentDs = ds;
    setText('dd_rank', '#' + ds.rank + '  ' + ds.id.toUpperCase());
    setText('dd_title', ds.title);
    setText('dd_provider', ds.provider);
    setText('dd_type', ds.type);
    setText('dd_cycle', ds.cycle);
    setText('dd_scope', ds.scope);
    setText('dd_modified', ds.modified);
    setText('dd_downloads', ds.downloads.toLocaleString() + '건');
    setText('dd_desc', ds.desc || '—');
    document.getElementById('dd_tags').innerHTML = ds.tags.map(function (t) {
      return '<span class="cs-card__tag cs-card__tag--' + t.cls + '">' + esc(t.label) + '</span>';
    }).join('') + (ds.scope === '제한공개'
      ? '<span class="badge" style="background:var(--status-warning-soft);color:var(--status-warning);border-radius:var(--radius-pill);height:22px;padding:0 10px;font:600 12px/22px var(--font-sans);display:inline-flex;align-items:center">제한공개</span>'
      : '');
    var simItems = [
      { lbl: '지역 유사도', val: ds.simGeo }, { lbl: '설명 유사도', val: ds.simDesc },
      { lbl: '태그 매칭', val: ds.simTag }, { lbl: '메타데이터 적합성', val: ds.simMeta }
    ];
    document.getElementById('dd_sim').innerHTML = simItems.map(function (s) {
      var pct = Math.round(s.val * 100);
      var clr = pct >= 85 ? 'var(--status-success)' : pct >= 70 ? 'var(--status-info)' : 'var(--status-warning)';
      return '<div class="dl__r"><dt>' + s.lbl + '</dt><dd>' +
        '<div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">' +
        '<div style="width:80px;height:5px;background:var(--border-2);border-radius:3px"><div style="width:' + pct + '%;height:100%;border-radius:3px;background:' + clr + '"></div></div>' +
        '<span style="color:' + clr + ';font:700 13px/1 var(--font-sans)">' + s.val.toFixed(2) + '</span></div></dd></div>';
    }).join('');
    openDrawer('detailDrawer');
    if (window.lucide) lucide.createIcons();
  }

  function openMetaDrawer(ds) {
    currentDs = ds;
    setText('md_title', ds.title);
    setText('md_title2', ds.title);
    setText('md_id', ds.id.toUpperCase() + '_GM_' + ds.modified.replace(/-/g, ''));
    setText('md_publisher', ds.provider);
    setText('md_license', ds.license || 'CC BY 4.0');
    setText('md_subject', ds.subject || '—');
    document.getElementById('md_keywords').innerHTML = (ds.keywords || []).map(function (k) {
      return '<span style="display:inline-block;background:var(--gp-primary-soft);color:var(--gp-primary);border-radius:var(--radius-pill);padding:2px 9px;font:600 11px/1.5 var(--font-sans);margin-left:4px">' + esc(k) + '</span>';
    }).join('');
    setText('md_format', ds.type);
    setText('md_cycle', ds.cycle);
    setText('md_endpoint', ds.endpoint || '—');
    setText('md_size', ds.size || '—');
    setText('md_desc', ds.desc || '—');
    openDrawer('metaDrawer');
    if (window.lucide) lucide.createIcons();
  }

  /* ── 다운로드 모달 ── */
  var selectedFmt = null;
  function openDownloadModal(ds) {
    currentDs = ds;
    var overlay = document.getElementById('downloadOverlay');
    if (!overlay) return;
    setText('dl_dsTitle', ds.title);
    setText('dl_dsMeta', ds.provider + '  ·  ' + ds.cycle + ' 갱신  ·  ' + ds.size);
    var fmts = ds.formats || ['CSV'];
    var iconMap = { CSV: 'table', JSON: 'braces', XLSX: 'file-spreadsheet', API: 'cloud' };
    selectedFmt = fmts[0];
    var group = document.getElementById('dl_fmtGroup');
    group.innerHTML = fmts.map(function (f) {
      return '<button class="dl-fmt-btn' + (f === selectedFmt ? ' on' : '') + '" data-fmt="' + f + '" type="button">' +
        '<i data-lucide="' + (iconMap[f] || 'file') + '" style="width:20px;height:20px"></i><span>' + f + '</span></button>';
    }).join('');
    group.querySelectorAll('.dl-fmt-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        group.querySelectorAll('.dl-fmt-btn').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on'); selectedFmt = this.dataset.fmt;
      });
    });
    overlay.style.display = 'block';
    if (window.lucide) lucide.createIcons();
  }
  function closeDownloadModal() {
    var overlay = document.getElementById('downloadOverlay');
    if (overlay) overlay.style.display = 'none';
  }
  function initDownloadModal() {
    ['downloadClose', 'downloadCancelBtn', 'downloadBg'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.addEventListener('click', closeDownloadModal);
    });
    var conf = document.getElementById('downloadConfirmBtn');
    if (conf) conf.addEventListener('click', function () {
      if (!currentDs || !selectedFmt) return;
      showDownloadToast(currentDs.title, selectedFmt);
      closeDownloadModal();
    });
  }
  function showDownloadToast(title, fmt) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--fg-1);color:#fff;padding:12px 22px;border-radius:10px;font:600 14px/1 var(--font-sans);z-index:9999;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px';
    t.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>' + esc(title) + ' (' + esc(fmt) + ') 다운로드를 시작합니다.</span>';
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 2000);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2500);
  }

  /* ── 유틸 ── */
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function highlight(text, q) {
    if (!q) return esc(text);
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return esc(text);
    return esc(text.slice(0, idx)) + '<mark>' + esc(text.slice(idx, idx + q.length)) + '</mark>' + esc(text.slice(idx + q.length));
  }
  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  init();
})();
