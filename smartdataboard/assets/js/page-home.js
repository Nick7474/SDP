/* =====================================================================
   광명 스마트데이터보드 · HOME 인터랙션
   - 4대 마일 지도 전환 + 핀/버블 순차 등장 애니메이션
   - 10초 간격 자동 순환
   - 지도 마우스 진입 시 hover-pause / 이탈 시 재개
   - 재생 컨트롤 (이전·일시정지/재생·다음) 연동
   ===================================================================== */
(function () {
  var MILES = ['energy', 'mobility', 'safety', 'data'];
  var AUTO_INTERVAL = 10000;
  var STAGGER_MS = 80;
  var autoTimer = null;
  var currentIdx = 0;
  var hoverPaused  = false;   /* 지도 마우스 hover 로 인한 정지 */
  var manualPaused = false;   /* 사용자 버튼 클릭으로 인한 정지 */

  function isPlaying() { return !hoverPaused && !manualPaused; }

  /* ── 핀·버블 순차 등장 ── */
  function animatePins(layer) {
    var els = layer.querySelectorAll('.mk, .numdot');
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

  /* ── 초기화 ── */
  function init() {
    var layers = document.querySelectorAll('.map .layer');
    if (!layers.length) return;

    /* 다이얼 버튼 */
    document.querySelectorAll('.dial__it').forEach(function (b) {
      b.addEventListener('click', function () { setMile(b.getAttribute('data-target'), true); });
    });

    /* 하단 마일 카드 */
    document.querySelectorAll('.mcard[data-mile]').forEach(function (c) {
      c.addEventListener('click', function () { setMile(c.getAttribute('data-mile'), true); });
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

    /* 초기 에너지 마일 핀 순차 등장 */
    var energyLayer = document.querySelector('.map .layer[data-mile="energy"]');
    if (energyLayer) animatePins(energyLayer);

    startTimer();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
