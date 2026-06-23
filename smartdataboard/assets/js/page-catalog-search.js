/* =====================================================================
   광명 스마트데이터보드 · 데이터 검색·조회
   ===================================================================== */
(function () {
  'use strict';

  var SUGGESTS = ['주민등록인구 통계', '태양광 발전량 및 탄소 배출량', '친환경DRT 운행 현황', '대기측정소 실시간 측정', '소방긴급구조정보'];

  var DATASETS = [
    { id:'ds1',  rank:1,  modified:'2026-06-18', downloads:3820,
      title:'태양광 발전량 및 탄소 배출량',
      tags:[{label:'환경',cls:'env'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 기후에너지과', type:'CSV / API', cycle:'일 1회', scope:'공개',
      simTotal:0.94, simGeo:0.96, simDesc:0.91, simTag:0.97, simMeta:0.93,
      desc:'광명시 관내 태양광 발전 설비의 시간대별 발전량(kWh) 및 탄소 배출 저감량을 집계한 데이터셋입니다. 설비별 누적 발전량, CO₂ 절감 환산값, 계통 연계 현황을 포함합니다.',
      keywords:['태양광','발전량','탄소중립','에너지','재생에너지','CO2'],
      subject:'에너지 · 환경', license:'CC BY 4.0',
      endpoint:'/api/v1/energy/solar', size:'2.4 MB', formats:['CSV','JSON','XLSX'] },
    { id:'ds2',  rank:2,  modified:'2026-06-19', downloads:2910,
      title:'대기측정소별 실시간 측정정보',
      tags:[{label:'환경',cls:'env'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 기후환경과', type:'API / JSON', cycle:'30분', scope:'공개',
      simTotal:0.81, simGeo:0.84, simDesc:0.78, simTag:0.86, simMeta:0.75,
      desc:'광명시 내 대기측정소에서 30분 단위로 수집되는 미세먼지(PM2.5·PM10), 오존, CO, NO₂ 등 대기오염 측정 데이터를 제공합니다.',
      keywords:['대기질','PM2.5','PM10','미세먼지','오존','환경'],
      subject:'환경 · 기후', license:'CC BY 4.0',
      endpoint:'/api/v1/environment/air', size:'1.8 MB', formats:['JSON','CSV'] },
    { id:'ds3',  rank:3,  modified:'2026-06-17', downloads:1540,
      title:'친환경DRT 운행 현황 데이터',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'5분', scope:'공개',
      simTotal:0.74, simGeo:0.77, simDesc:0.71, simTag:0.78, simMeta:0.68,
      desc:'수요응답형 친환경 대중교통(DRT) 차량의 실시간 위치, 노선, 탑승 현황을 포함하는 운행 데이터입니다. 차량 ID, 좌표(WGS84), 속도, 탑승인원을 제공합니다.',
      keywords:['DRT','친환경교통','대중교통','모빌리티','운행정보'],
      subject:'교통 · 모빌리티', license:'CC BY 4.0',
      endpoint:'/api/v1/mobility/drt', size:'3.1 MB', formats:['CSV','JSON'] },
    { id:'ds4',  rank:4,  modified:'2026-06-15', downloads:980,
      title:'주민등록인구 통계',
      tags:[{label:'인구',cls:'city'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 행정지원과', type:'API / JSON', cycle:'일 1회', scope:'공개',
      simTotal:0.68, simGeo:0.70, simDesc:0.65, simTag:0.72, simMeta:0.60,
      desc:'광명시 주민등록 기준 인구 현황 통계입니다. 동별·성별·연령대별 인구 수를 일별로 집계하며, 전입·전출·출생·사망 변동 내역을 포함합니다.',
      keywords:['인구','주민등록','통계','행정','인구변동'],
      subject:'행정 · 인구', license:'CC BY 4.0',
      endpoint:'/api/v1/admin/population', size:'0.8 MB', formats:['JSON','CSV','XLSX'] },
    { id:'ds5',  rank:5,  modified:'2026-06-10', downloads:760,
      title:'소방긴급구조정보 - 진행내역',
      tags:[{label:'안전',cls:'safety'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 안전총괄과', type:'API', cycle:'실시간', scope:'제한공개',
      simTotal:0.62, simGeo:0.65, simDesc:0.59, simTag:0.66, simMeta:0.57,
      desc:'광명시 소방서의 긴급출동 및 구조·구급 진행 내역 데이터입니다. 신고 접수, 출동, 현장 도착, 조치 완료 단계별 시간 정보를 포함합니다.',
      keywords:['소방','긴급구조','안전','출동','구급'],
      subject:'안전 · 재난', license:'공공누리 1유형',
      endpoint:'/api/v1/safety/fire', size:'1.2 MB', formats:['JSON'] },
    { id:'ds6',  rank:6,  modified:'2026-06-01', downloads:540,
      title:'전기차충전소 현황',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'월 1회', scope:'공개',
      simTotal:0.58, simGeo:0.60, simDesc:0.55, simTag:0.62, simMeta:0.52,
      desc:'광명시 내 전기차 충전소 위치, 충전기 수, 충전 방식(완속/급속), 운영 현황 등 기본 정보를 제공합니다.',
      keywords:['전기차','충전소','EV','충전인프라','모빌리티'],
      subject:'교통 · 인프라', license:'CC BY 4.0',
      endpoint:'/api/v1/mobility/ev-station', size:'0.5 MB', formats:['CSV','JSON','XLSX'] },
    { id:'ds7',  rank:7,  modified:'2026-05-20', downloads:420,
      title:'어린이집 기본정보',
      tags:[{label:'복지',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 아동청소년과', type:'API / JSON', cycle:'월간', scope:'공개',
      simTotal:0.51, simGeo:0.53, simDesc:0.49, simTag:0.55, simMeta:0.48,
      desc:'광명시 관내 어린이집의 명칭, 위치, 유형(국공립/민간/직장 등), 정원, 현원, 연락처 등 기본 현황 정보를 제공합니다.',
      keywords:['어린이집','보육','아동','복지','시설현황'],
      subject:'복지 · 교육', license:'공공누리 1유형',
      endpoint:'/api/v1/welfare/daycare', size:'0.3 MB', formats:['JSON','XLSX'] },
    { id:'ds8',  rank:8,  modified:'2026-05-15', downloads:310,
      title:'강우량계 시설 현황',
      tags:[{label:'스마트시티',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 스마트도시과', type:'API / JSON', cycle:'10분', scope:'공개',
      simTotal:0.47, simGeo:0.49, simDesc:0.44, simTag:0.51, simMeta:0.42,
      desc:'광명시 내 설치된 강우량계 센서의 실시간 강수량(mm/h) 측정 데이터입니다. 침수 예경보 시스템과 연동되며, 시설 위치 및 센서 상태 정보를 포함합니다.',
      keywords:['강우량','침수','기상','스마트시티','IoT','센서'],
      subject:'기상 · 재난', license:'CC BY 4.0',
      endpoint:'/api/v1/environment/rainfall', size:'0.9 MB', formats:['JSON','CSV'] }
  ];

  var AI_RESULT = {
    intent: '데이터셋 검색',
    confidence: '95%',
    keywords: ['탄소배출', '태양광', '대기오염', '친환경교통'],
    filter: '공개 데이터 우선',
    chips: [
      { icon:'map-pin', label:'광명시 제공' },
      { icon:'zap', label:'실시간 데이터' },
      { icon:'download', label:'CSV 다운로드 가능' },
      { icon:'code', label:'API 제공' }
    ],
    notice: 'AI 분석 결과는 검색어와 데이터셋 메타정보를 기반으로 생성되며, 높은 유사도의 데이터셋을 우선 제공합니다.'
  };

  var PER_PAGE = 5;
  var state = { searched: false, sort: 'rel', page: 1, query: '' };
  var recentSearches = (function () {
    try { return JSON.parse(localStorage.getItem('cs_recent') || '[]'); }
    catch (e) { return []; }
  }());

  function saveRecent() { localStorage.setItem('cs_recent', JSON.stringify(recentSearches)); }

  function addRecent(q) {
    recentSearches = recentSearches.filter(function (r) { return r !== q; });
    recentSearches.unshift(q);
    if (recentSearches.length > 6) recentSearches = recentSearches.slice(0, 6);
    saveRecent();
    renderRecent();
  }

  function removeRecent(q) {
    recentSearches = recentSearches.filter(function (r) { return r !== q; });
    saveRecent();
    renderRecent();
  }

  /* ── 부트 ── */
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
    renderSuggests();
    renderRecent();
    initSearch();
    initAutocomplete();
    initSort();
    initCardActions();
    initDrawers();
    initDownloadModal();
    if (window.lucide) lucide.createIcons();
  }

  /* ── 추천 검색어 ── */
  function renderSuggests() {
    var wrap = document.getElementById('suggestChips');
    if (!wrap) return;
    wrap.innerHTML = SUGGESTS.map(function (s) {
      return '<button class="cs-suggest__chip" type="button">' + s + '</button>';
    }).join('');
    wrap.querySelectorAll('.cs-suggest__chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('csInput');
        if (input) input.value = this.textContent;
        doSearch(this.textContent);
      });
    });
  }

  /* ── 최근 검색어 ── */
  function renderRecent() {
    var wrap    = document.getElementById('csRecent');
    var listEl  = document.getElementById('csRecentList');
    var clearBtn = document.getElementById('csRecentClear');
    if (!wrap || !listEl) return;

    if (!recentSearches.length) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';

    listEl.innerHTML = recentSearches.map(function (q) {
      return [
        '<button class="cs-recent__item" data-q="' + esc(q) + '" type="button">',
          '<i data-lucide="clock"></i>', esc(q),
          '<span class="cs-recent__del" data-del="' + esc(q) + '" title="삭제" role="button" aria-label="삭제"><i data-lucide="x"></i></span>',
        '</button>'
      ].join('');
    }).join('');

    listEl.querySelectorAll('.cs-recent__item').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var del = e.target.closest('[data-del]');
        if (del) { e.stopPropagation(); removeRecent(del.dataset.del); return; }
        var q = this.dataset.q;
        var input = document.getElementById('csInput');
        if (input) input.value = q;
        doSearch(q);
      });
    });

    if (clearBtn) clearBtn.onclick = function () {
      recentSearches = [];
      saveRecent();
      renderRecent();
    };

    if (window.lucide) lucide.createIcons();
  }

  /* ── 자동완성 ── */
  function initAutocomplete() {
    var input = document.getElementById('csInput');
    var dropdown = document.getElementById('csAutoList');
    if (!input || !dropdown) return;

    input.addEventListener('input', function () {
      var q = this.value.trim();
      if (!q) { dropdown.classList.remove('on'); return; }
      var matches = DATASETS.filter(function (ds) {
        return ds.title.toLowerCase().indexOf(q.toLowerCase()) >= 0;
      }).slice(0, 5);

      if (!matches.length) { dropdown.classList.remove('on'); return; }

      dropdown.innerHTML = '<div class="cs-autocomplete__hd">추천</div>' +
        matches.map(function (ds) {
          return '<button class="cs-autocomplete__item" data-title="' + esc(ds.title) + '" type="button">'
            + '<i data-lucide="search"></i>'
            + highlight(ds.title, q)
            + '</button>';
        }).join('');

      dropdown.querySelectorAll('.cs-autocomplete__item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          input.value = this.dataset.title;
          dropdown.classList.remove('on');
          doSearch(this.dataset.title);
        });
      });

      dropdown.classList.add('on');
      if (window.lucide) lucide.createIcons();
    });

    input.addEventListener('blur', function () {
      setTimeout(function () { dropdown.classList.remove('on'); }, 180);
    });

    input.addEventListener('focus', function () {
      if (this.value.trim()) this.dispatchEvent(new Event('input'));
    });
  }

  /* ── 검색 이벤트 ── */
  function initSearch() {
    var btn   = document.getElementById('csSearchBtn');
    var input = document.getElementById('csInput');
    var dropdown = document.getElementById('csAutoList');

    if (btn)   btn.addEventListener('click', function () {
      if (dropdown) dropdown.classList.remove('on');
      doSearch(input ? input.value.trim() : '');
    });
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (dropdown) dropdown.classList.remove('on');
        doSearch(this.value.trim());
      }
    });
  }

  /* ── 정렬 ── */
  function initSort() {
    document.querySelectorAll('.cs-sort-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.cs-sort-btn').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on');
        state.sort = this.dataset.sort;
        state.page = 1;
        if (state.searched) renderResults();
      });
    });
  }

  /* ── 검색 실행 ── */
  function doSearch(q) {
    if (!q) return;
    state.query = q;
    state.page  = 1;
    state.searched = true;
    addRecent(q);
    renderAIPanel();
    renderResults();
  }

  /* ── AI 패널 렌더링 ── */
  function renderAIPanel() {
    var body = document.getElementById('csAiBody');
    if (!body) return;
    var kws = AI_RESULT.keywords.map(function (k) {
      return '<span class="cs-ai-kw">' + esc(k) + '</span>';
    }).join('');
    var chips = AI_RESULT.chips.map(function (c) {
      return '<span class="cs-ai-chip"><i data-lucide="' + c.icon + '"></i>' + esc(c.label) + '</span>';
    }).join('');
    body.innerHTML = [
      '<dl>',
        row('search', '검색 의도', AI_RESULT.intent),
        '<div class="cs-ai-row"><dt><i data-lucide="shield-check"></i>신뢰도</dt>',
        '<dd><span class="cs-ai-score">' + AI_RESULT.confidence + '</span></dd></div>',
        '<div class="cs-ai-row"><dt><i data-lucide="tag"></i>추천 키워드</dt>',
        '<dd><div class="cs-ai-kw-group">' + kws + '</div></dd></div>',
        row('filter', '추천 필터', AI_RESULT.filter),
      '</dl>',
      '<div class="cs-ai-chips">' + chips + '</div>',
      '<div class="cs-ai-notice">' + esc(AI_RESULT.notice) + '</div>'
    ].join('');
    if (window.lucide) lucide.createIcons();
  }

  function row(icon, label, value) {
    return '<div class="cs-ai-row"><dt><i data-lucide="' + icon + '"></i>' + label + '</dt>'
      + '<dd>' + esc(value) + '</dd></div>';
  }

  /* ── 결과 렌더링 ── */
  function renderResults() {
    var list  = document.getElementById('csResultList');
    var hd    = document.getElementById('csResultHd');
    var meta  = document.getElementById('csResultMeta');
    var empty = document.getElementById('csEmptyState');
    if (!list) return;

    if (empty) empty.style.display = 'none';
    if (hd)   hd.style.display    = 'flex';

    var items = DATASETS.slice();
    if (state.sort === 'rel') {
      items.sort(function (a, b) { return b.simTotal - a.simTotal; });
    } else if (state.sort === 'new') {
      items.sort(function (a, b) { return b.modified.localeCompare(a.modified); });
    } else if (state.sort === 'pop') {
      items.sort(function (a, b) { return b.downloads - a.downloads; });
    }

    var total     = items.length;
    var totalPages = Math.ceil(total / PER_PAGE);
    var start     = (state.page - 1) * PER_PAGE;
    var pageItems = items.slice(start, start + PER_PAGE);

    if (meta) {
      meta.innerHTML = '총 <b>' + total + '개</b> 데이터셋 중 <b>' + (start + 1) + '–' + Math.min(start + PER_PAGE, total) + '</b>번째 표시';
    }

    var cards = pageItems.map(function (ds, i) { return buildCard(ds, start + i + 1); }).join('');
    list.innerHTML = cards;

    renderPagination(totalPages);

    if (window.lucide) lucide.createIcons();
  }

  function renderPagination(totalPages) {
    var el = document.getElementById('csPagination');
    if (!el) return;
    if (totalPages <= 1) { el.style.display = 'none'; return; }
    el.style.display = 'flex';

    var btns = [pgBtn('&laquo;', state.page > 1, state.page - 1, 'prev')];
    for (var p = 1; p <= totalPages; p++) {
      btns.push(pgBtn(String(p), false, p, String(p), state.page === p));
    }
    btns.push(pgBtn('&raquo;', state.page < totalPages, state.page + 1, 'next'));
    el.innerHTML = btns.join('');

    el.querySelectorAll('.cs-pg-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.page = parseInt(this.dataset.pg, 10);
        renderResults();
      });
    });
  }

  function pgBtn(label, enabled, pg, key, active) {
    var disabled = (!enabled && !active) ? '' : '';
    var cls = 'cs-pg-btn' + (active ? ' on' : '');
    if (!enabled && !active) {
      return '<button class="' + cls + '" type="button" disabled style="opacity:.35;cursor:default">' + label + '</button>';
    }
    return '<button class="' + cls + '" data-pg="' + pg + '" type="button">' + label + '</button>';
  }

  function buildCard(ds, num) {
    var tags = ds.tags.map(function (t) {
      return '<span class="cs-card__tag cs-card__tag--' + t.cls + '">' + esc(t.label) + '</span>';
    }).join('');

    return [
      '<div class="cs-card" data-ds-id="' + ds.id + '">',
        '<div class="cs-card__hd">',
          '<span class="cs-card__num">' + num + '</span>',
          '<div class="cs-card__title-wrap">',
            '<h3 class="cs-card__title">' + highlight(ds.title, state.query) + '</h3>',
            '<div class="cs-card__tags">' + tags + '</div>',
          '</div>',
          '<div class="cs-card__score">',
            '<span class="cs-card__score-val">' + ds.simTotal.toFixed(2) + '</span>',
            '<span class="cs-card__score-lbl">유사도</span>',
          '</div>',
        '</div>',

        '<div class="cs-card__meta">',
          metaItem('제공기관', ds.provider),
          metaItem('데이터 형태', ds.type),
          metaItem('업데이트 주기', ds.cycle),
          metaItem('공개 범위', ds.scope),
        '</div>',

        '<div class="cs-card__sim-row">',
          simItem('map-pin', '지역 유사도', ds.simGeo),
          simItem('file-text', '설명 유사도', ds.simDesc),
          simItem('tag', '태그 매칭', ds.simTag),
          simItem('database', '메타데이터 적합성', ds.simMeta),
          '<span class="cs-card__sim-item" style="margin-left:auto;color:var(--gp-point);font-weight:700">최종 유사도 <b style="font-size:15px;margin-left:4px">' + ds.simTotal.toFixed(2) + '</b></span>',
        '</div>',

        '<div class="cs-card__actions">',
          '<button class="cs-card__act-btn" type="button" data-action="detail"><i data-lucide="eye"></i>상세 보기</button>',
          '<button class="cs-card__act-btn" type="button" data-action="meta"><i data-lucide="file-text"></i>메타데이터 보기</button>',
          '<button class="cs-card__act-btn" type="button" data-action="download"><i data-lucide="download"></i>다운로드</button>',
          '<button class="cs-card__act-btn cs-card__act-btn--pri" type="button" data-action="api"><i data-lucide="cloud-upload"></i>API 신청</button>',
        '</div>',
      '</div>'
    ].join('');
  }

  function metaItem(lbl, val) {
    return '<div class="cs-card__meta-item"><span class="cs-card__meta-lbl">' + lbl + '</span><span class="cs-card__meta-val">' + esc(val) + '</span></div>';
  }
  function simItem(icon, lbl, val) {
    return '<span class="cs-card__sim-item"><i data-lucide="' + icon + '"></i>' + lbl + ' <b>' + val.toFixed(2) + '</b></span>';
  }

  /* ══════════════════════════════════════
     카드 액션 이벤트
  ══════════════════════════════════════ */
  function initCardActions() {
    var list = document.getElementById('csResultList');
    if (!list) return;
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var card = btn.closest('[data-ds-id]');
      if (!card) return;
      var ds = DATASETS.filter(function (d) { return d.id === card.dataset.dsId; })[0];
      if (!ds) return;
      var action = btn.dataset.action;
      if (action === 'detail')   openDetailDrawer(ds);
      if (action === 'meta')     openMetaDrawer(ds);
      if (action === 'download') openDownloadModal(ds);
      if (action === 'api')      location.href = 'catalog-access.html';
    });
  }

  /* ══════════════════════════════════════
     드로어 공통
  ══════════════════════════════════════ */
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
    document.getElementById('scrim').addEventListener('click', closeDrawer);

    /* 상세 드로어 */
    ['ddClose', 'ddCloseBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', closeDrawer);
    });
    document.getElementById('ddMetaBtn').addEventListener('click', function () {
      if (currentDs) { closeDrawer(); openMetaDrawer(currentDs); }
    });
    document.getElementById('ddDownloadBtn').addEventListener('click', function () {
      if (currentDs) { closeDrawer(); openDownloadModal(currentDs); }
    });
    document.getElementById('ddApiBtn').addEventListener('click', function () {
      location.href = 'catalog-access.html';
    });

    /* 메타데이터 드로어 */
    ['mdClose', 'mdCloseBtn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', closeDrawer);
    });
    document.getElementById('mdEditBtn').addEventListener('click', function () {
      location.href = 'catalog-ai-meta.html';
    });
  }

  /* ══════════════════════════════════════
     상세 드로어
  ══════════════════════════════════════ */
  function openDetailDrawer(ds) {
    currentDs = ds;

    document.getElementById('dd_rank').textContent = '#' + ds.rank + '  ' + ds.id.toUpperCase();
    document.getElementById('dd_title').textContent = ds.title;
    document.getElementById('dd_provider').textContent = ds.provider;
    document.getElementById('dd_type').textContent = ds.type;
    document.getElementById('dd_cycle').textContent = ds.cycle;
    document.getElementById('dd_scope').textContent = ds.scope;
    document.getElementById('dd_modified').textContent = ds.modified;
    document.getElementById('dd_downloads').textContent = ds.downloads.toLocaleString() + '건';
    document.getElementById('dd_desc').textContent = ds.desc || '—';

    /* 태그 */
    var tagEl = document.getElementById('dd_tags');
    tagEl.innerHTML = ds.tags.map(function (t) {
      return '<span class="cs-card__tag cs-card__tag--' + t.cls + '">' + esc(t.label) + '</span>';
    }).join('') + (ds.scope === '제한공개'
      ? '<span class="badge" style="background:var(--status-warning-soft);color:var(--status-warning);border-radius:var(--radius-pill);height:22px;padding:0 10px;font:600 12px/22px var(--font-sans);display:inline-flex;align-items:center">제한공개</span>'
      : '');

    /* 유사도 */
    var simItems = [
      { lbl: '지역 유사도', val: ds.simGeo },
      { lbl: '설명 유사도', val: ds.simDesc },
      { lbl: '태그 매칭', val: ds.simTag },
      { lbl: '메타데이터 적합성', val: ds.simMeta }
    ];
    document.getElementById('dd_sim').innerHTML = simItems.map(function (s) {
      var pct = Math.round(s.val * 100);
      var clr = pct >= 85 ? 'var(--status-success)' : pct >= 70 ? 'var(--status-info)' : 'var(--status-warning)';
      return '<div class="dl__r"><dt>' + s.lbl + '</dt><dd>'
        + '<div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">'
        + '<div style="width:80px;height:5px;background:var(--border-2);border-radius:3px"><div style="width:' + pct + '%;height:100%;border-radius:3px;background:' + clr + '"></div></div>'
        + '<span style="color:' + clr + ';font:700 13px/1 var(--font-sans)">' + s.val.toFixed(2) + '</span>'
        + '</div></dd></div>';
    }).join('');

    openDrawer('detailDrawer');
    if (window.lucide) lucide.createIcons();
  }

  /* ══════════════════════════════════════
     메타데이터 드로어
  ══════════════════════════════════════ */
  function openMetaDrawer(ds) {
    currentDs = ds;

    document.getElementById('md_title').textContent = ds.title;
    document.getElementById('md_title2').textContent = ds.title;
    document.getElementById('md_id').textContent = ds.id.toUpperCase() + '_GM_' + ds.modified.replace(/-/g, '');
    document.getElementById('md_publisher').textContent = ds.provider;
    document.getElementById('md_license').textContent = ds.license || 'CC BY 4.0';
    document.getElementById('md_subject').textContent = ds.subject || '—';
    document.getElementById('md_keywords').innerHTML = (ds.keywords || []).map(function (k) {
      return '<span style="display:inline-block;background:var(--gp-primary-soft);color:var(--gp-primary);border-radius:var(--radius-pill);padding:2px 9px;font:600 11px/1.5 var(--font-sans);margin-left:4px">' + esc(k) + '</span>';
    }).join('');
    document.getElementById('md_format').textContent = ds.type;
    document.getElementById('md_cycle').textContent = ds.cycle;
    document.getElementById('md_endpoint').textContent = ds.endpoint || '—';
    document.getElementById('md_size').textContent = ds.size || '—';
    document.getElementById('md_desc').textContent = ds.desc || '—';

    openDrawer('metaDrawer');
    if (window.lucide) lucide.createIcons();
  }

  /* ══════════════════════════════════════
     다운로드 모달
  ══════════════════════════════════════ */
  var selectedFmt = null;

  function openDownloadModal(ds) {
    currentDs = ds;
    var overlay = document.getElementById('downloadOverlay');
    if (!overlay) return;

    document.getElementById('dl_dsTitle').textContent = ds.title;
    document.getElementById('dl_dsMeta').textContent = ds.provider + '  ·  ' + ds.cycle + ' 갱신  ·  ' + ds.size;

    var fmts = ds.formats || ['CSV'];
    var iconMap = { CSV:'table', JSON:'braces', XLSX:'file-spreadsheet', API:'cloud' };
    selectedFmt = fmts[0];

    var group = document.getElementById('dl_fmtGroup');
    group.innerHTML = fmts.map(function (f) {
      return '<button class="dl-fmt-btn' + (f === selectedFmt ? ' on' : '') + '" data-fmt="' + f + '" type="button">'
        + '<i data-lucide="' + (iconMap[f] || 'file') + '" style="width:20px;height:20px"></i>'
        + '<span>' + f + '</span>'
        + '</button>';
    }).join('');

    group.querySelectorAll('.dl-fmt-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        group.querySelectorAll('.dl-fmt-btn').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on');
        selectedFmt = this.dataset.fmt;
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
    document.getElementById('downloadClose').addEventListener('click', closeDownloadModal);
    document.getElementById('downloadCancelBtn').addEventListener('click', closeDownloadModal);
    document.getElementById('downloadBg').addEventListener('click', closeDownloadModal);
    document.getElementById('downloadConfirmBtn').addEventListener('click', function () {
      if (!currentDs || !selectedFmt) return;
      showDownloadToast(currentDs.title, selectedFmt);
      closeDownloadModal();
    });
  }

  function showDownloadToast(title, fmt) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);'
      + 'background:var(--fg-1);color:#fff;padding:12px 22px;border-radius:10px;'
      + 'font:600 14px/1 var(--font-sans);z-index:9999;white-space:nowrap;'
      + 'box-shadow:0 4px 16px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px';
    t.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      + '<span>' + esc(title) + ' (' + esc(fmt) + ') 다운로드를 시작합니다.</span>';
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; }, 2000);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2500);
  }

  /* ── 유틸 ── */
  function highlight(text, q) {
    if (!q) return esc(text);
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return esc(text);
    return esc(text.slice(0, idx)) + '<mark>' + esc(text.slice(idx, idx + q.length)) + '</mark>' + esc(text.slice(idx + q.length));
  }

  function esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
