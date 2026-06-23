/* =====================================================================
   광명 스마트데이터보드 · 데이터셋 관리
   ===================================================================== */
(function () {
  'use strict';

  var DATASETS = [
    { id:'GM-POP-001',  name:'주민등록인구 통계',              dtype:'인구',      ftype:'API', fmt:'API', pub:'open',    meta:'ok',     quality:96, mapping:'ok',      dept:'행정지원과',   src:'새올행정시스템 (V_JUMIN_SMT_02)', cycle:'일 1회',   modified:'2026-06-18 20:00', reg:'auto',     provide:'API / JSON',  records:'2,847건',       size:'12 MB',   scope:'광명시 전체', aiRec:true,  histCount:3, desc:'새올행정시스템 주민요약 기반 광명시 읍면동별 주민등록인구 통계. 연령·성별·세대 유형별 집계 데이터를 일 1회 갱신.' },
    { id:'GM-TRF-001',  name:'교통돌발상황 (UTIC)',            dtype:'교통',      ftype:'API', fmt:'API', pub:'open',    meta:'ok',     quality:91, mapping:'ok',      dept:'교통정책과',   src:'UTIC 도시교통정보센터',           cycle:'5분',      modified:'2026-06-19 10:10', reg:'api',      provide:'API / JSON',  records:'45,820건',      size:'580 MB',  scope:'광명시 전체', aiRec:false, histCount:1, desc:'UTIC 도시교통정보센터 제공 광명시 교통돌발상황 정보. 교통사고·공사·행사 등 실시간 돌발정보를 5분 단위 수집.' },
    { id:'GM-TRF-002',  name:'전기차충전소 현황',              dtype:'교통',      ftype:'API', fmt:'API', pub:'open',    meta:'review', quality:79, mapping:'partial', dept:'교통정책과',   src:'공공데이터포털 (한국전력공사)',   cycle:'월 1회',   modified:'2026-06-01 01:00', reg:'api',      provide:'CSV / API',   records:'284건',         size:'2 MB',    scope:'광명시 전체', aiRec:true,  histCount:2, desc:'광명시 내 전기차충전소 위치·충전기 수·충전 방식·운영기관 정보. 공공데이터포털 API를 통해 월 1회 갱신.' },
    { id:'GM-WEL-001',  name:'어린이집 기본정보',              dtype:'복지',      ftype:'API', fmt:'JSON',pub:'open',    meta:'ok',     quality:94, mapping:'ok',      dept:'아동청소년과', src:'어린이집정보공개포털',           cycle:'월간',     modified:'2026-06-01 20:32', reg:'api',      provide:'API / JSON',  records:'210건',         size:'1 MB',    scope:'광명시 전체', aiRec:false, histCount:0, desc:'어린이집정보공개포털 기반 광명시 어린이집 기본정보. 시설명·위치·정원·운영현황·인가일을 월간 갱신.' },
    { id:'GM-WEL-002',  name:'노인복지시설 현황',              dtype:'복지',      ftype:'CSV', fmt:'CSV', pub:'open',    meta:'ok',     quality:88, mapping:'ok',      dept:'복지정책과',   src:'복지로 시스템',                  cycle:'월간',     modified:'2026-06-02 09:00', reg:'api',      provide:'CSV',         records:'142건',         size:'0.8 MB',  scope:'광명시 전체', aiRec:false, histCount:0, desc:'광명시 내 노인복지시설(경로당·노인복지관·주간보호센터) 현황 및 이용자 정보. 복지로 시스템 연계.' },
    { id:'GM-ENV-001',  name:'대기측정소별 실시간 측정정보',   dtype:'환경',      ftype:'API', fmt:'API', pub:'open',    meta:'ok',     quality:93, mapping:'ok',      dept:'기후환경과',   src:'공공데이터포털 (에어코리아)',    cycle:'30분',     modified:'2026-06-19 09:30', reg:'api',      provide:'API / JSON',  records:'184,200건',     size:'820 MB',  scope:'광명시 전체', aiRec:true,  histCount:0, desc:'광명시 내 대기오염 측정소별 PM10·PM2.5·CO·NO2·O3 등 실시간 측정 데이터. 에어코리아 API 연계.' },
    { id:'GM-ENV-002',  name:'태양광 발전량 및 탄소 배출량',  dtype:'환경',      ftype:'API', fmt:'JSON',pub:'open',    meta:'ok',     quality:92, mapping:'ok',      dept:'기후에너지과', src:'건축물에너지정보플랫폼',         cycle:'일 1회',   modified:'2026-06-18 22:00', reg:'auto',     provide:'CSV / API',   records:'125,678건',     size:'2.5 GB',  scope:'광명시 전체', aiRec:false, histCount:5, desc:'광명시 공공건물 태양광 발전 설비별 일별 발전량 및 탄소 배출 환산량 데이터. 건축물에너지정보플랫폼 연계.' },
    { id:'GM-SAF-001',  name:'소방긴급구조정보 - 진행내역',   dtype:'안전·재난', ftype:'API', fmt:'API', pub:'limited', meta:'ok',     quality:87, mapping:'ok',      dept:'안전총괄과',   src:'소방청 119종합상황시스템',       cycle:'실시간',   modified:'2026-06-19 10:15', reg:'external', provide:'API',         records:'1,240,500건',   size:'380 MB',  scope:'제한 공개',   aiRec:false, histCount:0, desc:'소방청 119종합상황시스템 기반 광명시 소방긴급구조 출동·진행·완료 이력 데이터. 보안 등급 제한 공개.' },
    { id:'GM-SAF-002',  name:'어린이보호구역 현황',            dtype:'안전·재난', ftype:'CSV', fmt:'CSV', pub:'open',    meta:'review', quality:76, mapping:'partial', dept:'안전총괄과',   src:'경찰청 어린이보호구역 DB',       cycle:'반기',     modified:'2026-04-01 09:00', reg:'manual',   provide:'CSV',         records:'127건',         size:'1 MB',    scope:'광명시 전체', aiRec:false, histCount:1, desc:'광명시 내 어린이보호구역(스쿨존) 지정 현황. 경찰청 DB 기반 반기 갱신. 일부 좌표 표준어 매핑 검토 중.' },
    { id:'GM-SCT-001',  name:'통합관제 CCTV 목록',            dtype:'스마트시티', ftype:'DB', fmt:'API', pub:'limited', meta:'review', quality:73, mapping:'partial', dept:'스마트도시과', src:'광명시 스마트통합플랫폼 (danusysNG)', cycle:'분기 1회', modified:'2026-04-01 04:26', reg:'external', provide:'API',         records:'892건',         size:'45 MB',   scope:'제한 공개',   aiRec:false, histCount:0, desc:'광명시 스마트통합플랫폼 danusysNG.NTbl_Node 기반 통합관제 CCTV 설치 목록. 위치·제조사·해상도 포함.' },
    { id:'GM-SCT-002',  name:'강우량계 시설 현황',            dtype:'스마트시티', ftype:'API', fmt:'JSON',pub:'open',    meta:'ok',     quality:89, mapping:'ok',      dept:'스마트도시과', src:'광명시 스마트통합플랫폼',        cycle:'10분',     modified:'2026-06-19 10:00', reg:'external', provide:'API / JSON',  records:'48,400건',      size:'28 MB',   scope:'광명시 전체', aiRec:false, histCount:2, desc:'광명시 내 강우량계 설치 현황 및 10분 단위 실시간 강우량 측정 데이터. 침수예방시스템과 연계.' },
    { id:'GM-ECO-001',  name:'광명사랑화폐 발행량 및 이용실적', dtype:'경제',    ftype:'JSON',fmt:'JSON',pub:'open',    meta:'ok',     quality:85, mapping:'ok',      dept:'기업지원과',   src:'부서자료 (기업지원과)',           cycle:'주간',     modified:'2026-06-16 09:00', reg:'manual',   provide:'JSON',        records:'4,820건',       size:'8 MB',    scope:'광명시 전체', aiRec:true,  histCount:0, desc:'광명시 광명사랑화폐(지역화폐) 월별 발행량·이용실적·가맹점 현황 집계 데이터. 기업지원과 부서자료 주간 갱신.' }
  ];

  var PUB_LABEL  = { open:'공개', limited:'제한공개', pending:'승인대기', closed:'비공개' };
  var META_LABEL = { ok:'정상', review:'검토 필요', err:'오류' };
  var REG_LABEL  = { manual:'수동 등록', auto:'자동 생성', external:'외부 연계', api:'API 연계' };

  var selectedDs = null;
  var currentView = localStorage.getItem('cd_view_mode') || 'list';
  var favorites   = (function () {
    try { return new Set(JSON.parse(localStorage.getItem('cd_favorites') || '[]')); }
    catch (e) { return new Set(); }
  }());

  function saveFavorites() {
    localStorage.setItem('cd_favorites', JSON.stringify(Array.from(favorites)));
  }

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
    applyViewMode(currentView, false);
    renderTable(DATASETS);
    renderCards(DATASETS);
    renderPagination(DATASETS.length);
    renderAiStrip();
    initDrawer();
    initFilters();
    initSearch();
    initChkAll();
    initButtons();
    initViewToggle();
    initApplyModal();
    if (window.lucide) lucide.createIcons();
  }

  /* ── 뷰 전환 ── */
  function initViewToggle() {
    var btnList = document.getElementById('dsViewList');
    var btnCard = document.getElementById('dsViewCard');
    if (btnList) btnList.addEventListener('click', function () { applyViewMode('list', true); });
    if (btnCard) btnCard.addEventListener('click', function () { applyViewMode('card', true); });
  }

  function applyViewMode(mode, save) {
    currentView = mode;
    if (save) localStorage.setItem('cd_view_mode', mode);
    var tableWrap = document.getElementById('dsTableWrap');
    var cardWrap  = document.getElementById('dsCardWrap');
    var btnList   = document.getElementById('dsViewList');
    var btnCard   = document.getElementById('dsViewCard');
    if (mode === 'card') {
      if (tableWrap) tableWrap.style.display = 'none';
      if (cardWrap)  cardWrap.style.display = '';
      if (btnList)   btnList.classList.remove('on');
      if (btnCard)   btnCard.classList.add('on');
    } else {
      if (tableWrap) tableWrap.style.display = '';
      if (cardWrap)  cardWrap.style.display = 'none';
      if (btnList)   btnList.classList.add('on');
      if (btnCard)   btnCard.classList.remove('on');
    }
    if (window.lucide) lucide.createIcons();
  }

  /* ── AI 추천 스트립 ── */
  function renderAiStrip() {
    var strip = document.getElementById('cdAiStrip');
    var list  = document.getElementById('cdAiList');
    if (!strip || !list) return;
    var recs = DATASETS.filter(function (d) { return d.aiRec; });
    if (!recs.length) return;
    list.innerHTML = recs.map(function (ds) {
      return [
        '<button class="cd-ai-item" data-id="' + ds.id + '" type="button">',
          '<div class="cd-ai-item__body">',
            '<div class="cd-ai-item__name">' + ds.name + '</div>',
            '<div class="cd-ai-item__id">' + ds.id + ' · ' + ds.dtype + '</div>',
          '</div>',
          '<div class="cd-ai-item__arr"><i data-lucide="chevron-right"></i></div>',
        '</button>'
      ].join('');
    }).join('');
    strip.classList.add('on');
    list.querySelectorAll('.cd-ai-item').forEach(function (btn) {
      btn.addEventListener('click', function () { openDrawer(this.dataset.id); });
    });
    var closeBtn = document.getElementById('btnAiStripClose');
    if (closeBtn) closeBtn.addEventListener('click', function () { strip.classList.remove('on'); });
    if (window.lucide) lucide.createIcons();
  }

  /* ── 테이블 렌더링 ── */
  function renderTable(data) {
    var tbody   = document.getElementById('dsTbody');
    var countEl = document.getElementById('dsCount');
    if (!tbody) return;
    if (countEl) countEl.textContent = '전체 ' + data.length + '건';
    if (!data.length) {
      tbody.innerHTML = '<tr class="tbl__empty"><td colspan="13"><i data-lucide="inbox"></i>조건에 맞는 데이터가 없습니다.</td></tr>';
      if (window.lucide) lucide.createIcons();
      return;
    }
    tbody.innerHTML = data.map(function (ds) {
      var isFav    = favorites.has(ds.id);
      var pubPill  = pubBadge(ds.pub);
      var metaPill = metaBadge(ds.meta);
      var qCls     = ds.quality >= 85 ? 'high' : ds.quality >= 65 ? 'mid' : 'low';
      var mapBadge = mappingBadge(ds.mapping);
      var aiBadge  = ds.aiRec ? '<span class="ds-ai-badge"><i data-lucide="sparkles"></i>AI</span>' : '';
      var histBadge= ds.histCount > 0 ? '<span class="ds-hist-badge">' + ds.histCount + '건 변경</span>' : '';
      return [
        '<tr data-id="' + ds.id + '">',
          '<td><button class="ds-fav-btn' + (isFav ? ' on' : '') + '" data-id="' + ds.id + '" type="button" title="즐겨찾기" aria-label="즐겨찾기 토글"><i data-lucide="star"></i></button></td>',
          '<td><input type="checkbox" class="ds-row-chk" aria-label="선택"></td>',
          '<td class="l"><span class="ds-id-link" data-id="' + ds.id + '">' + ds.id + '</span></td>',
          '<td class="l" style="font-weight:600;color:var(--fg-1)">' + ds.name + aiBadge + histBadge + '</td>',
          '<td>' + ds.dtype + '</td>',
          '<td>' + ds.ftype + '</td>',
          '<td>' + pubPill + '</td>',
          '<td>' + metaPill + '</td>',
          '<td>',
            '<div class="ds-qbar-wrap">',
              '<div class="ds-qbar"><div class="ds-qbar-fill ' + qCls + '" style="width:' + ds.quality + '%"></div></div>',
              '<span class="ds-qbar-val ' + qCls + '">' + ds.quality + '점</span>',
            '</div>',
          '</td>',
          '<td>' + mapBadge + '</td>',
          '<td style="font-size:12px;white-space:nowrap">' + ds.modified.replace(' ', '<br>') + '</td>',
          '<td style="font-size:12px">' + ds.dept + '</td>',
          '<td style="text-align:center">',
            '<button class="tbtn tbtn--sm ds-detail-btn" data-id="' + ds.id + '" type="button">보기</button>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function () { openDrawer(tr.dataset.id); });
      tr.querySelector('.ds-detail-btn').addEventListener('click', function (e) {
        e.stopPropagation(); openDrawer(tr.dataset.id);
      });
      var chk = tr.querySelector('.ds-row-chk');
      if (chk) chk.addEventListener('click', function (e) { e.stopPropagation(); });
      var favBtn = tr.querySelector('.ds-fav-btn');
      if (favBtn) favBtn.addEventListener('click', function (e) {
        e.stopPropagation(); toggleFav(this.dataset.id, this);
      });
    });
    tbody.querySelectorAll('.ds-id-link').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); openDrawer(this.dataset.id); });
    });
    if (window.lucide) lucide.createIcons();
  }

  /* ── 카드 뷰 렌더링 ── */
  function renderCards(data) {
    var grid    = document.getElementById('dsCardGrid');
    var countEl = document.getElementById('dsCount');
    if (!grid) return;
    if (countEl) countEl.textContent = '전체 ' + data.length + '건';
    if (!data.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--fg-3)">조건에 맞는 데이터가 없습니다.</div>';
      return;
    }
    grid.innerHTML = data.map(function (ds) {
      var isFav   = favorites.has(ds.id);
      var aiBadge = ds.aiRec ? '<span class="ds-ai-badge"><i data-lucide="sparkles"></i>AI 추천</span>' : '';
      return [
        '<div class="ds-card-item" data-id="' + ds.id + '">',
          '<div class="ds-card-item__hd">',
            '<span class="ds-card-item__id">' + ds.id + '</span>',
            '<button class="ds-fav-btn' + (isFav ? ' on' : '') + '" data-id="' + ds.id + '" type="button" aria-label="즐겨찾기"><i data-lucide="star"></i></button>',
          '</div>',
          '<div class="ds-card-item__name">' + ds.name + '</div>',
          '<div class="ds-card-item__badges">',
            pubBadge(ds.pub), metaBadge(ds.meta), aiBadge,
          '</div>',
          '<div class="ds-card-item__ft">',
            '<span>' + ds.dept + '</span>',
            '<span style="font:700 12px/1 var(--font-sans);color:' + (ds.quality >= 85 ? 'var(--status-success)' : ds.quality >= 65 ? 'var(--status-warning)' : 'var(--status-danger)') + '">' + ds.quality + '점</span>',
          '</div>',
        '</div>'
      ].join('');
    }).join('');

    grid.querySelectorAll('.ds-card-item').forEach(function (card) {
      card.addEventListener('click', function () { openDrawer(card.dataset.id); });
      var favBtn = card.querySelector('.ds-fav-btn');
      if (favBtn) favBtn.addEventListener('click', function (e) {
        e.stopPropagation(); toggleFav(this.dataset.id, this);
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  /* ── 즐겨찾기 토글 ── */
  function toggleFav(id, btn) {
    if (favorites.has(id)) {
      favorites.delete(id);
      document.querySelectorAll('.ds-fav-btn[data-id="' + id + '"]').forEach(function (b) { b.classList.remove('on'); });
      showToast('즐겨찾기에서 제거되었습니다.');
    } else {
      favorites.add(id);
      document.querySelectorAll('.ds-fav-btn[data-id="' + id + '"]').forEach(function (b) { b.classList.add('on'); });
      showToast('즐겨찾기에 추가되었습니다.');
    }
    saveFavorites();
    updateDrawerFavBtn();
    if (window.lucide) lucide.createIcons();
  }

  function updateDrawerFavBtn() {
    var btn = document.getElementById('dwBtnFav');
    if (!btn || !selectedDs) return;
    var isFav = favorites.has(selectedDs.id);
    btn.innerHTML = (isFav ? '<i data-lucide="star-off" class="gp-ico"></i>즐겨찾기 해제' : '<i data-lucide="star" class="gp-ico"></i>즐겨찾기');
    if (window.lucide) lucide.createIcons();
  }

  function pubBadge(pub) {
    var map = {
      open:    { cls:'ok',   label:'● 공개' },
      limited: { cls:'warn', label:'● 제한공개' },
      pending: { cls:'stop', label:'● 승인대기' },
      closed:  { cls:'stop', label:'● 비공개' }
    };
    var v = map[pub] || { cls:'stop', label:pub };
    return '<span class="pill pill--' + v.cls + '" style="font-size:12px">' + v.label + '</span>';
  }

  function metaBadge(meta) {
    var map = {
      ok:     { cls:'ok',   label:'정상' },
      review: { cls:'warn', label:'검토 필요' },
      err:    { cls:'err',  label:'오류' }
    };
    var v = map[meta] || { cls:'stop', label:meta };
    return '<span class="pill pill--' + v.cls + '" style="font-size:12px">' + v.label + '</span>';
  }

  function mappingBadge(mapping) {
    var map = {
      ok:      { cls:'ok',      label:'매핑' },
      partial: { cls:'partial', label:'일부 미매핑' },
      none:    { cls:'none',    label:'미매핑' }
    };
    var v = map[mapping] || { cls:'none', label:mapping };
    return '<span class="ds-map-badge ds-map-badge--' + v.cls + '">' + v.label + '</span>';
  }

  /* ── 페이지네이션 ── */
  function renderPagination(total) {
    var el = document.getElementById('dsPagination');
    if (!el) return;
    el.innerHTML = [
      '<span class="ds-pg-info">전체 ' + (total || 0) + '건</span>',
      '<div class="ds-pg-btns">',
        pgBtn('&laquo;', false), pgBtn('&lsaquo;', false),
        pgBtn('1', true), pgBtn('2'),
        pgBtn('&rsaquo;'), pgBtn('&raquo;'),
      '</div>',
      '<div></div>'
    ].join('');
  }

  function pgBtn(label, active) {
    return '<button class="ds-pg-btn' + (active ? ' on' : '') + '" type="button">' + label + '</button>';
  }

  /* ── 드로어 ── */
  function initDrawer() {
    var close    = document.getElementById('dwClose');
    var closeBtn = document.getElementById('dwCloseBtn');
    var scrim    = document.getElementById('scrim');
    if (close)    close.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (scrim)    scrim.addEventListener('click', function (e) {
      if (!document.getElementById('applyOverlay').classList.contains('on')) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (document.getElementById('applyOverlay').classList.contains('on')) { closeApplyModal(); return; }
        closeDrawer();
      }
    });

    var favBtn = document.getElementById('dwBtnFav');
    if (favBtn) favBtn.addEventListener('click', function () {
      if (selectedDs) toggleFav(selectedDs.id, this);
    });

    var applyBtn = document.getElementById('dwBtnApply');
    if (applyBtn) applyBtn.addEventListener('click', function () {
      if (selectedDs) openApplyModal(selectedDs);
    });

    var editBtn = document.getElementById('dwBtnEdit');
    if (editBtn) editBtn.addEventListener('click', function () {
      showToast('수정 기능은 준비 중입니다.');
    });

    var histLink = document.getElementById('dwLinkHistory');
    if (histLink) histLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (selectedDs && selectedDs.histCount > 0) showToast('변경이력: ' + selectedDs.histCount + '건 (상세 화면 준비 중)');
      else showToast('변경 이력이 없습니다.');
    });
  }

  function openDrawer(id) {
    var ds = DATASETS.find(function (d) { return d.id === id; });
    if (!ds) return;
    selectedDs = ds;

    set('dwId', ds.id);
    set('dwTitle', ds.name);

    var pubMap = { open:'pub', limited:'warn', pending:'warn', closed:'err' };
    var metaMap = { ok:'ok', review:'warn', err:'err' };
    var mapMap  = { ok:'mapped', partial:'warn', none:'unmapped' };
    var badgeRow = document.getElementById('dwBadgeRow');
    if (badgeRow) {
      var aiMark = ds.aiRec ? '<span class="dw__badge" style="background:var(--status-pending-soft);color:var(--status-pending)"><i data-lucide="sparkles" style="width:12px;height:12px;margin-right:3px;vertical-align:-1px"></i>AI 추천</span>' : '';
      badgeRow.innerHTML = [
        badge(pubMap[ds.pub]    || 'warn',    PUB_LABEL[ds.pub]  || ds.pub),
        badge(metaMap[ds.meta]  || 'warn',    META_LABEL[ds.meta]|| ds.meta),
        badge(mapMap[ds.mapping]|| 'unmapped', ds.mapping === 'ok' ? '매핑' : ds.mapping === 'partial' ? '일부 미매핑' : '미매핑'),
        aiMark
      ].join('');
    }

    set('f_name',    ds.name);
    set('f_id',      ds.id);
    set('f_dtype',   ds.dtype);
    set('f_ftype',   ds.ftype);
    set('f_fmt',     ds.fmt);
    set('f_pub',     PUB_LABEL[ds.pub]  || ds.pub);
    set('f_reg',     REG_LABEL[ds.reg]  || ds.reg);
    set('f_dept',    ds.dept);
    set('f_src',     ds.src);
    set('f_cycle',   ds.cycle);
    set('f_modified',ds.modified);
    set('f_meta',    META_LABEL[ds.meta] || ds.meta);

    var qbar = document.getElementById('f_qbar');
    if (qbar) {
      qbar.style.width = ds.quality + '%';
      qbar.style.background = ds.quality >= 85 ? 'var(--status-success)' : ds.quality >= 65 ? 'var(--status-warning)' : 'var(--status-danger)';
    }
    set('f_qscore',  ds.quality + '점');
    set('f_mapping', { ok:'매핑', partial:'일부 미매핑', none:'미매핑' }[ds.mapping] || ds.mapping);
    set('f_tags',    ds.dtype + ', 광명시');
    set('f_desc',    ds.desc);
    set('f_provide', ds.provide);
    set('f_records', ds.records);
    set('f_size',    ds.size);
    set('f_scope',   ds.scope);

    updateDrawerFavBtn();

    document.getElementById('drawer').classList.add('on');
    document.getElementById('scrim').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeDrawer() {
    var drawer = document.getElementById('drawer');
    var scrim  = document.getElementById('scrim');
    if (drawer) drawer.classList.remove('on');
    if (scrim)  scrim.classList.remove('on');
  }

  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function badge(cls, label) {
    return '<span class="dw__badge dw__badge--' + cls + '">' + label + '</span>';
  }

  /* ── 활용신청 모달 ── */
  function initApplyModal() {
    var closeBtn  = document.getElementById('applyCloseBtn');
    var cancelBtn = document.getElementById('applyCancelBtn');
    var submitBtn = document.getElementById('applySubmitBtn');
    var bg        = document.getElementById('applyBg');

    if (closeBtn)  closeBtn.addEventListener('click', closeApplyModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeApplyModal);
    if (bg)        bg.addEventListener('click', closeApplyModal);

    if (submitBtn) submitBtn.addEventListener('click', function () {
      var purpose = document.getElementById('applyPurpose');
      var org     = document.getElementById('applyOrg');
      if (!purpose || !purpose.value) { showToast('활용 목적을 선택해 주세요.'); return; }
      if (!org || !org.value.trim()) { showToast('소속 기관/부서를 입력해 주세요.'); return; }
      closeApplyModal();
      showToast('활용신청이 접수되었습니다. 검토 후 이메일로 안내드립니다.');
    });

    document.querySelectorAll('.cd-apply-tpl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var purpSel = document.getElementById('applyPurpose');
        if (!purpSel) return;
        var tpl = this.dataset.tpl;
        var map = { '정책 수립 및 기획':'policy', '학술 연구':'research', '공공 서비스 개발':'service', '통계 분석':'stats' };
        purpSel.value = map[tpl] || 'etc';
      });
    });
  }

  function openApplyModal(ds) {
    set('applyDsId', ds.id);
    set('applyDsNm', ds.name);
    var purpose = document.getElementById('applyPurpose');
    var org     = document.getElementById('applyOrg');
    var note    = document.getElementById('applyNote');
    if (purpose) purpose.value = '';
    if (org)     org.value = '';
    if (note)    note.value = '';
    document.getElementById('applyOverlay').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeApplyModal() {
    document.getElementById('applyOverlay').classList.remove('on');
  }

  /* ── 필터: 칩 그룹 + 셀렉트 ── */
  function initFilters() {
    document.querySelectorAll('.cd-chip-group .cd-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = this.closest('.cd-chip-group');
        group.querySelectorAll('.cd-chip').forEach(function (c) { c.classList.remove('on'); });
        this.classList.add('on');
        applyFilter();
      });
    });

    ['fFmt', 'fReg', 'fMeta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', applyFilter);
    });
  }

  function applyFilter() {
    var dtype = getChipVal('cgDtype');
    var pub   = getChipVal('cgPub');
    var fmt   = val('fFmt');
    var reg   = val('fReg');
    var meta  = val('fMeta');
    var q     = (val('dsSearchInput')).trim().toLowerCase();

    var filtered = DATASETS.filter(function (ds) {
      if (dtype && ds.dtype !== dtype) return false;
      if (pub   && ds.pub   !== pub)   return false;
      if (fmt   && ds.fmt.toLowerCase() !== fmt.toLowerCase()) return false;
      if (reg   && ds.reg   !== reg)   return false;
      if (meta  && ds.meta  !== meta)  return false;
      if (q && ds.name.toLowerCase().indexOf(q) < 0 &&
               ds.id.toLowerCase().indexOf(q) < 0 &&
               ds.dept.indexOf(q) < 0) return false;
      return true;
    });
    renderTable(filtered);
    renderCards(filtered);
    renderPagination(filtered.length);
  }

  function getChipVal(groupId) {
    var group = document.getElementById(groupId);
    if (!group) return '';
    var on = group.querySelector('.cd-chip.on');
    return on ? (on.dataset.val || '') : '';
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  /* ── 검색 + 조회/초기화 ── */
  function initSearch() {
    var input = document.getElementById('dsSearchInput');
    if (input) input.addEventListener('input', applyFilter);

    var searchBtn = document.getElementById('btnDsSearch');
    if (searchBtn) searchBtn.addEventListener('click', applyFilter);

    var resetBtn = document.getElementById('btnDsReset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      document.querySelectorAll('.cd-chip-group .cd-chip').forEach(function (c) { c.classList.remove('on'); });
      document.querySelectorAll('.cd-chip-group .cd-chip[data-val=""]').forEach(function (c) { c.classList.add('on'); });
      ['fFmt', 'fReg', 'fMeta'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
      var inp = document.getElementById('dsSearchInput');
      if (inp) inp.value = '';
      renderTable(DATASETS);
      renderCards(DATASETS);
      renderPagination(DATASETS.length);
    });
  }

  /* ── 전체 선택 ── */
  function initChkAll() {
    var chkAll = document.getElementById('dsChkAll');
    if (!chkAll) return;
    chkAll.addEventListener('change', function () {
      document.querySelectorAll('.ds-row-chk').forEach(function (chk) {
        chk.checked = chkAll.checked;
      });
    });
  }

  /* ── 버튼 ── */
  function initButtons() {
    var addBtn = document.getElementById('dsBtnAdd');
    var rvwBtn = document.getElementById('dsBtnReview');
    var dlBtn  = document.getElementById('dsBtnDl');
    if (addBtn) addBtn.addEventListener('click', function () { showToast('데이터셋 등록 기능은 준비 중입니다.'); });
    if (rvwBtn) rvwBtn.addEventListener('click', function () {
      var checked = document.querySelectorAll('.ds-row-chk:checked');
      if (!checked.length) { showToast('검토할 데이터셋을 선택해 주세요.'); return; }
      showToast(checked.length + '건 일괄 검토 요청이 접수되었습니다.');
    });
    if (dlBtn) dlBtn.addEventListener('click', function () {
      exportCsv(DATASETS);
    });
  }

  function exportCsv(data) {
    var cols = ['ID','데이터셋명','분류','유형','공개상태','메타데이터','품질점수','담당부서','수정일'];
    var rows = data.map(function (ds) {
      return [ds.id, ds.name, ds.dtype, ds.ftype, PUB_LABEL[ds.pub]||ds.pub, META_LABEL[ds.meta]||ds.meta, ds.quality, ds.dept, ds.modified].map(function (v) {
        return '"' + String(v).replace(/"/g, '""') + '"';
      }).join(',');
    });
    var csv = '﻿' + cols.join(',') + '\n' + rows.join('\n');
    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'datasets_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
  }

  /* ── 토스트 ── */
  var _toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('cdToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cdToast';
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

  init();
})();
