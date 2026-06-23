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
      simTotal:0.94, simGeo:0.96, simDesc:0.91, simTag:0.97, simMeta:0.93 },
    { id:'ds2',  rank:2,  modified:'2026-06-19', downloads:2910,
      title:'대기측정소별 실시간 측정정보',
      tags:[{label:'환경',cls:'env'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 기후환경과', type:'API / JSON', cycle:'30분', scope:'공개',
      simTotal:0.81, simGeo:0.84, simDesc:0.78, simTag:0.86, simMeta:0.75 },
    { id:'ds3',  rank:3,  modified:'2026-06-17', downloads:1540,
      title:'친환경DRT 운행 현황 데이터',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'5분', scope:'공개',
      simTotal:0.74, simGeo:0.77, simDesc:0.71, simTag:0.78, simMeta:0.68 },
    { id:'ds4',  rank:4,  modified:'2026-06-15', downloads:980,
      title:'주민등록인구 통계',
      tags:[{label:'인구',cls:'city'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 행정지원과', type:'API / JSON', cycle:'일 1회', scope:'공개',
      simTotal:0.68, simGeo:0.70, simDesc:0.65, simTag:0.72, simMeta:0.60 },
    { id:'ds5',  rank:5,  modified:'2026-06-10', downloads:760,
      title:'소방긴급구조정보 - 진행내역',
      tags:[{label:'안전',cls:'safety'},{label:'광명시',cls:'city'},{label:'API',cls:'fmt'}],
      provider:'광명시 안전총괄과', type:'API', cycle:'실시간', scope:'제한공개',
      simTotal:0.62, simGeo:0.65, simDesc:0.59, simTag:0.66, simMeta:0.57 },
    { id:'ds6',  rank:6,  modified:'2026-06-01', downloads:540,
      title:'전기차충전소 현황',
      tags:[{label:'교통',cls:'mobility'},{label:'광명시',cls:'city'},{label:'CSV',cls:'fmt'},{label:'API',cls:'fmt'}],
      provider:'광명시 교통정책과', type:'CSV / API', cycle:'월 1회', scope:'공개',
      simTotal:0.58, simGeo:0.60, simDesc:0.55, simTag:0.62, simMeta:0.52 },
    { id:'ds7',  rank:7,  modified:'2026-05-20', downloads:420,
      title:'어린이집 기본정보',
      tags:[{label:'복지',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 아동청소년과', type:'API / JSON', cycle:'월간', scope:'공개',
      simTotal:0.51, simGeo:0.53, simDesc:0.49, simTag:0.55, simMeta:0.48 },
    { id:'ds8',  rank:8,  modified:'2026-05-15', downloads:310,
      title:'강우량계 시설 현황',
      tags:[{label:'스마트시티',cls:'data'},{label:'광명시',cls:'city'},{label:'JSON',cls:'fmt'}],
      provider:'광명시 스마트도시과', type:'API / JSON', cycle:'10분', scope:'공개',
      simTotal:0.47, simGeo:0.49, simDesc:0.44, simTag:0.51, simMeta:0.42 }
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
      '<div class="cs-card">',
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
          '<button class="cs-card__act-btn" type="button" onclick="location.href=\'catalog-dataset.html\'"><i data-lucide="eye"></i>상세 보기</button>',
          '<button class="cs-card__act-btn" type="button"><i data-lucide="file-text"></i>메타데이터 보기</button>',
          '<button class="cs-card__act-btn cs-card__act-btn--pri" type="button" onclick="location.href=\'catalog-access.html\'"><i data-lucide="cloud-upload"></i>API 신청</button>',
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
