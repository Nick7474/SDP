/* =====================================================================
   광명 스마트데이터보드 · HOME 인터랙션
   - 4대 마일 지도 전환 + 핀/버블 순차 등장 애니메이션
   - 10초 간격 자동 순환
   - 지도 마우스 진입 시 hover-pause / 이탈 시 재개
   - 재생 컨트롤 (이전·일시정지/재생·다음) 연동
   - 브리핑/운영현황 클릭 → 상세 페이지 이동
   - 하단 마일 카드 클릭 → mile-map 페이지 이동
   - card__more (···) 드롭다운 메뉴
   ===================================================================== */
(function () {
  var MILES = ['energy', 'mobility', 'safety', 'data'];
  var AUTO_INTERVAL = 10000;
  var STAGGER_MS = 80;

  /* ── 마일별 KPI 데이터 ── */
  var MILE_KPI = {
    energy:   [
      { lbl: '오늘 발전량',  val: '52,480', unit: 'kWh'    },
      { lbl: '설비 가동률',  val: '92.4',   unit: '%'      },
      { lbl: '전월 대비',   val: '+8.2',   unit: '%'      },
      { lbl: '신재생 비중', val: '24.2',   unit: '%'      },
    ],
    mobility: [
      { lbl: 'DRT 탑승',    val: '284',    unit: '건'     },
      { lbl: '운행 차량',   val: '132',    unit: '대'     },
      { lbl: '이용 증감',   val: '+6.7',   unit: '%'      },
      { lbl: '노선 장애',   val: '1',      unit: '건'     },
    ],
    safety:   [
      { lbl: 'PM10 최고',   val: '42',     unit: '㎍/m³'  },
      { lbl: '경보 건수',   val: '1',      unit: '건'     },
      { lbl: '침수 위험',   val: '1',      unit: '건'     },
      { lbl: '센서 정상률', val: '97.8',   unit: '%'      },
    ],
    data:     [
      { lbl: '수집 건수',   val: '24,547', unit: '건'     },
      { lbl: 'API 호출',   val: '4,872',  unit: '회'     },
      { lbl: '연계 정상률', val: '98.5',  unit: '%'      },
      { lbl: 'MRV 완료',  val: '9',      unit: '건'      },
    ],
  };
  var MILE_TAG = { energy: '에너지 마일', mobility: '모빌리티 마일', safety: '세이프티 마일', data: '데이터 마일' };
  var autoTimer = null;
  var currentIdx = 0;
  var hoverPaused  = false;   /* 지도 마우스 hover 로 인한 정지 */
  var manualPaused = false;   /* 사용자 버튼 클릭으로 인한 정지 */

  function isPlaying() { return !hoverPaused && !manualPaused; }

  /* ── 인사이트 KPI 갱신 ── */
  function updateInsightKPIs(mile) {
    var kpis = MILE_KPI[mile];
    if (!kpis) return;
    document.querySelectorAll('.ins-cell').forEach(function (cell, i) {
      if (!kpis[i]) return;
      cell.classList.remove('kpi-update');
      void cell.offsetWidth;
      cell.classList.add('kpi-update');
      var il = cell.querySelector('.il');
      var iv = cell.querySelector('.iv');
      if (il) il.textContent = kpis[i].lbl;
      if (iv) iv.innerHTML = kpis[i].val + '<span class="u">' + kpis[i].unit + '</span>';
    });
    var tag = document.getElementById('insightMileTag');
    if (tag) tag.textContent = MILE_TAG[mile] || '';
  }

  /* ── 마일 카드·브리핑 항목 하이라이트 ── */
  function updateMileHighlight(mile) {
    document.querySelectorAll('.mcard[data-mile]').forEach(function (c) {
      c.classList.toggle('mcard--active', c.getAttribute('data-mile') === mile);
    });
    document.querySelectorAll('.brief__it[data-brief-mile]').forEach(function (el) {
      el.classList.toggle('brief__it--active', el.getAttribute('data-brief-mile') === mile);
    });
  }

  /* ── 핀·버블 순차 등장 ── */
  function animatePins(layer) {
    var els = layer.querySelectorAll('.mk');
    els.forEach(function (el) {
      el.classList.remove('pin-anim');
      el.style.animationDelay = '';
    });
    void layer.offsetWidth;
    els.forEach(function (el, i) {
      el.style.animationDelay = (i * STAGGER_MS) + 'ms';
      el.classList.add('pin-anim');
    });
  }

  /* ── 마일 전환 ── */
  function setMile(mile, resetTimer) {
    document.querySelectorAll('.map .layer').forEach(function (l) {
      var isTarget = l.getAttribute('data-mile') === mile;
      l.classList.toggle('on', isTarget);
      if (isTarget) animatePins(l);
    });
    document.querySelectorAll('.dial__it').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-target') === mile ? 'true' : 'false');
    });
    var idx = MILES.indexOf(mile);
    if (idx !== -1) currentIdx = idx;
    updateInsightKPIs(mile);
    updateMileHighlight(mile);
    if (resetTimer && isPlaying()) startTimer();
  }

  /* ── 타이머 ── */
  function autoNext() {
    currentIdx = (currentIdx + 1) % MILES.length;
    setMile(MILES[currentIdx], false);
  }

  function startTimer() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(autoNext, AUTO_INTERVAL);
  }

  function stopTimer() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* ── 재생 버튼 이미지 동기화 ── */
  function updatePlayBtn() {
    var img = document.getElementById('ctrl-play-img');
    if (!img) return;
    var base = window.GMSB_BASE || '';
    img.src = base + 'assets/img/' +
      (manualPaused ? 'Property 1=Btn_Play.svg' : 'Property 1=Btn_Purse.svg');
    var btn = document.getElementById('ctrl-play');
    if (btn) btn.setAttribute('aria-label', manualPaused ? '재생' : '일시정지');
  }

  /* ── 컨트롤 버튼 핸들러 ── */
  function ctrlPrev() {
    currentIdx = (currentIdx - 1 + MILES.length) % MILES.length;
    setMile(MILES[currentIdx], false);
    if (isPlaying()) startTimer(); /* 사이클 리셋 */
  }

  function ctrlNext() {
    currentIdx = (currentIdx + 1) % MILES.length;
    setMile(MILES[currentIdx], false);
    if (isPlaying()) startTimer();
  }

  function togglePlayPause() {
    manualPaused = !manualPaused;
    if (manualPaused) {
      stopTimer();
    } else {
      if (!hoverPaused) startTimer();
    }
    updatePlayBtn();
  }

  /* ── card__more 드롭다운 ── */
  var CARD_MENUS = {
    '4대 마일 브리핑': [
      { label: '에너지 마일 상세', href: 'pages/mile-map.html?mile=energy' },
      { label: '모빌리티 마일 상세', href: 'pages/mile-map.html?mile=mobility' },
      { label: '세이프티 마일 상세', href: 'pages/mile-map.html?mile=safety' },
      { label: '데이터 마일 상세', href: 'pages/mile-map.html?mile=data' },
    ],
    '탄소데이터 브리핑': [
      { label: '탄소중립 현황', href: 'pages/carbon-summary.html' },
      { label: 'KPI 지표 확인', href: 'pages/carbon-kpi.html' },
    ],
    '도시 운영 현황': [
      { label: '운영 모니터링', href: 'pages/operation-monitoring.html' },
      { label: '연계 모니터링', href: 'pages/linkage-monitoring.html' },
      { label: '상태 모니터링', href: 'pages/status-monitoring.html' },
    ],
  };

  var _activeDropEl  = null;
  var _activeMoreBtn = null;

  function closeCardMore() {
    if (_activeDropEl) { _activeDropEl.remove(); _activeDropEl = null; }
    _activeMoreBtn = null;
  }

  function openCardMore(btn, items) {
    var drop = document.createElement('div');
    drop.className = 'home-dropdown';
    items.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'home-dropdown__item';
      a.href = item.href;
      a.textContent = item.label;
      drop.appendChild(a);
    });
    var rect = btn.getBoundingClientRect();
    drop.style.top  = (rect.bottom + 4) + 'px';
    drop.style.right = (window.innerWidth - rect.right) + 'px';
    document.body.appendChild(drop);
    _activeDropEl  = drop;
    _activeMoreBtn = btn;
  }

  function initCardMore() {
    document.querySelectorAll('.card__more').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (_activeMoreBtn === btn) { closeCardMore(); return; }
        closeCardMore();
        var card  = btn.closest('.card');
        var h3    = card && card.querySelector('h3');
        var title = h3 ? h3.textContent.trim() : '';
        var items = CARD_MENUS[title];
        if (items && items.length) openCardMore(btn, items);
      });
    });
    document.addEventListener('click', closeCardMore);
  }

  /* ── 초기화 ── */
  function init() {
    var layers = document.querySelectorAll('.map .layer');
    if (!layers.length) return;

    /* 다이얼 버튼 */
    document.querySelectorAll('.dial__it').forEach(function (b) {
      b.addEventListener('click', function () { setMile(b.getAttribute('data-target'), true); });
    });

    /* 하단 마일 카드 → mile-map 페이지 이동 */
    document.querySelectorAll('.mcard[data-mile]').forEach(function (c) {
      c.addEventListener('click', function () {
        location.href = 'pages/mile-map.html?mile=' + c.getAttribute('data-mile');
      });
    });

    /* 지도 영역 hover → hover-pause / 이탈 → hover-resume */
    var mapEl = document.getElementById('map');
    if (mapEl) {
      mapEl.addEventListener('mouseenter', function () {
        hoverPaused = true;
        stopTimer();
      });
      mapEl.addEventListener('mouseleave', function () {
        hoverPaused = false;
        if (isPlaying()) startTimer();
      });
    }

    /* 재생 컨트롤 버튼 */
    var btnPrev = document.getElementById('ctrl-prev');
    var btnPlay = document.getElementById('ctrl-play');
    var btnNext = document.getElementById('ctrl-next');
    if (btnPrev) btnPrev.addEventListener('click', ctrlPrev);
    if (btnPlay) btnPlay.addEventListener('click', togglePlayPause);
    if (btnNext) btnNext.addEventListener('click', ctrlNext);

    /* 초기 에너지 마일 핀 순차 등장 + 하이라이트 */
    var energyLayer = document.querySelector('.map .layer[data-mile="energy"]');
    if (energyLayer) animatePins(energyLayer);
    updateInsightKPIs('energy');
    updateMileHighlight('energy');

    startTimer();

    /* ── 브리핑 / 운영현황 클릭 → 페이지 이동 ── */
    document.querySelectorAll('.brief__it[data-href]').forEach(function (el) {
      el.addEventListener('click', function () { location.href = el.getAttribute('data-href'); });
    });
    document.querySelectorAll('.oprow[data-href]').forEach(function (el) {
      el.addEventListener('click', function () { location.href = el.getAttribute('data-href'); });
    });

    /* card__more 드롭다운 */
    initCardMore();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
