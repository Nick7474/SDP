/* =====================================================================
   광명 스마트데이터보드 · GIS 범례 표시/숨김 공통
   ===================================================================== */
(function () {
  'use strict';

  function initLegend(legend) {
    if (!legend || legend.dataset.legendReady === '1') return;
    var key = legend.getAttribute('data-legend-key') || 'default';
    var storageKey = 'gmsb:gis-legend:' + key + ':collapsed';
    var btn = legend.querySelector('.ce-legend-toggle');
    if (!btn) return;

    function readState() {
      try { return localStorage.getItem(storageKey) === '1'; }
      catch (e) { return false; }
    }

    function saveState(collapsed) {
      try { localStorage.setItem(storageKey, collapsed ? '1' : '0'); }
      catch (e) {}
    }

    function applyState(collapsed) {
      legend.classList.toggle('map-legend--collapsed', collapsed);
      btn.setAttribute('aria-label', collapsed ? '범례 펼치기' : '범례 접기');
      btn.setAttribute('title', collapsed ? '범례 펼치기' : '범례 접기');
    }

    applyState(readState());
    btn.addEventListener('click', function () {
      var collapsed = !legend.classList.contains('map-legend--collapsed');
      applyState(collapsed);
      saveState(collapsed);
    });
    legend.dataset.legendReady = '1';
  }

  function initAll(root) {
    (root || document).querySelectorAll('.js-gis-legend').forEach(initLegend);
  }

  window.gmsbInitGisLegendToggles = initAll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(document); });
  } else {
    initAll(document);
  }
})();
