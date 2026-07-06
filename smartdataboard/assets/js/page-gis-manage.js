/* =====================================================================
   광명 스마트데이터보드 · GIS 데이터 관리 (Kakao Maps v3)
   ===================================================================== */
(function () {
  'use strict';

  var GM_BOUNDS = {
    north: 37.4968, south: 37.3922, west: 126.8172, east: 126.9108,
    svgW: 391, svgH: 561
  };

  /* ── CRUD 데이터 ── */
  var GM_DATA = [
    { id:'d1', name:'태양광 발전 지점',    dtype:'point',   file:'shapefile', spatial:'지점', epsg:'EPSG-5186', source:'에너지 지원 API',   freq:'1일',   pub:true,  dept:'기후에너지과', modifier:'김민준·기후에너지과', tags:['태양광','에너지'], field:'energy',  status:'pub',    lat:37.4545, lng:126.8732, color:'#0C8AE5', created:'2026-04-18 09:30', modified:'2026-05-20 10:15', desc:'광명시 내 태양광 발전 설비 설치 지점 데이터' },
    { id:'d2', name:'버스 노선 경로',       dtype:'line',    file:'geojson',   spatial:'경로', epsg:'EPSG-4326', source:'교통 API',          freq:'주간',  pub:true,  dept:'교통정책과',   modifier:'이수진·교통정책과',   tags:['버스','교통'],    field:'mobility',status:'pub',    lat:37.4742, lng:126.8822, color:'#1AAA5E', created:'2026-03-10 14:00', modified:'2026-05-15 11:00', desc:'광명시 시내버스 전체 노선 경로 데이터' },
    { id:'d3', name:'침수 위험 구역',       dtype:'polygon', file:'shapefile', spatial:'구역', epsg:'EPSG-5186', source:'재난관리 API',      freq:'월간',  pub:true,  dept:'안전관리과',   modifier:'박성호·안전관리과',   tags:['침수','재난'],    field:'safety',  status:'review', lat:37.4408, lng:126.8798, color:'#6E74D6', created:'2026-02-22 09:00', modified:'2026-04-30 15:30', desc:'광명시 내 침수 위험 지역 경계 폴리곤' },
    { id:'d4', name:'공공 CCTV 위치',      dtype:'point',   file:'geojson',   spatial:'지점', epsg:'EPSG-4326', source:'안전관리 통합 DB', freq:'실시간',pub:false, dept:'안전관리과',   modifier:'최지현·안전관리과',   tags:['CCTV','안전'],   field:'safety',  status:'priv',   lat:37.4618, lng:126.8632, color:'#ED8B16', created:'2026-01-05 10:00', modified:'2026-05-01 09:00', desc:'광명시 공공 CCTV 설치 위치 (비공개)' },
    { id:'d5', name:'행정동 경계',          dtype:'polygon', file:'shapefile', spatial:'구역', epsg:'EPSG-5186', source:'광명시 GIS 통합',  freq:'연간',  pub:true,  dept:'도시계획과',   modifier:'정다은·도시계획과',   tags:['행정동','경계'],  field:'data',    status:'pub',    lat:37.4480, lng:126.8710, color:'#044E9E', created:'2025-11-01 09:00', modified:'2026-01-10 14:00', desc:'광명시 행정동 경계 폴리곤' },
    { id:'d6', name:'도시열섬 지수 래스터', dtype:'raster',  file:'raster',    spatial:'구역', epsg:'EPSG-5186', source:'환경부 기후 API', freq:'월간',  pub:true,  dept:'기후환경과',   modifier:'한승우·기후환경과',   tags:['열섬','기후'],    field:'env',     status:'pub',    lat:37.4265, lng:126.8598, color:'#E0483D', created:'2026-03-01 11:00', modified:'2026-05-18 12:00', desc:'광명시 도시열섬 지수 래스터 데이터' }
  ];

  /* ── 레이어 데이터 ── */
  var GM_LAYERS = [
    { id:'l1', name:'태양광 발전 시설',  connData:'태양광 발전 시설 현황', dtype:'point',   icon:'energy',   order:1, active:true,  pub:true,  opacity:80, labelOn:true,  minZoom:10, maxZoom:18, color:'#0C8AE5', field:'energy',  lat:37.4545, lng:126.8732 },
    { id:'l2', name:'모빌리티 거점',     connData:'대중교통 현황',          dtype:'point',   icon:'mobility', order:2, active:true,  pub:true,  opacity:90, labelOn:true,  minZoom:9,  maxZoom:18, color:'#1AAA5E', field:'mobility',lat:37.4742, lng:126.8822 },
    { id:'l3', name:'안전 시설',         connData:'안전시설 위치 현황',     dtype:'point',   icon:'safety',   order:3, active:true,  pub:true,  opacity:85, labelOn:false, minZoom:10, maxZoom:18, color:'#ED8B16', field:'safety',  lat:37.4408, lng:126.8798 },
    { id:'l4', name:'데이터 거점',       connData:'스마트 센서 현황',       dtype:'point',   icon:'data',     order:4, active:true,  pub:true,  opacity:80, labelOn:false, minZoom:10, maxZoom:18, color:'#6E74D6', field:'data',    lat:37.4618, lng:126.8632 },
    { id:'l5', name:'환경 시설',         connData:'환경모니터링 현황',      dtype:'point',   icon:'env',      order:5, active:true,  pub:true,  opacity:80, labelOn:false, minZoom:10, maxZoom:18, color:'#1AAA5E', field:'env',     lat:37.4265, lng:126.8598 },
    { id:'l6', name:'관리구역',          connData:'행정동 경계',            dtype:'polygon', icon:'polygon',  order:6, active:true,  pub:true,  opacity:40, labelOn:true,  minZoom:7,  maxZoom:18, color:'#044E9E', field:'data',    lat:37.4480, lng:126.8710 },
    { id:'l7', name:'도로 네트워크',     connData:'도로 중심선',            dtype:'line',    icon:'line',     order:7, active:true,  pub:true,  opacity:60, labelOn:false, minZoom:9,  maxZoom:18, color:'#5E6B7D', field:'mobility',lat:37.4550, lng:126.8750 },
    { id:'l8', name:'발전량 히트맵',     connData:'에너지 발전 현황',       dtype:'heatmap', icon:'heatmap',  order:8, active:true,  pub:false, opacity:70, labelOn:false, minZoom:8,  maxZoom:18, color:'#FFB114', field:'energy',  lat:37.4380, lng:126.8680 }
  ];

  /* ── 폴리곤·라인 데모 좌표 ── */
  var DEMO_GEO = {
    /* l6 관리구역 — 광명시 외곽 간략 폴리곤 */
    l6_polygon: [
      [37.4968,126.8172],[37.4900,126.8520],[37.4820,126.8680],
      [37.4700,126.8900],[37.4550,126.9000],[37.4400,126.9108],
      [37.4200,126.9050],[37.3922,126.8900],[37.4000,126.8500],
      [37.4100,126.8300],[37.4200,126.8172],[37.4500,126.8200],
      [37.4700,126.8172],[37.4968,126.8172]
    ],
    /* l7 도로 네트워크 — 광명 주요 도로 3개 선 */
    l7_lines: [
      [ [37.4750,126.8400],[37.4650,126.8600],[37.4500,126.8750],[37.4350,126.8850],[37.4200,126.9000] ],
      [ [37.4800,126.8600],[37.4700,126.8700],[37.4600,126.8800],[37.4480,126.8920],[37.4350,126.9050] ],
      [ [37.4600,126.8300],[37.4500,126.8400],[37.4400,126.8600],[37.4300,126.8750] ]
    ],
    /* l8 히트맵 — 발열 포인트 (중심+반경) */
    l8_heat: [
      { lat:37.4545, lng:126.8732, r:0.010, op:0.55 },
      { lat:37.4380, lng:126.8680, r:0.008, op:0.45 },
      { lat:37.4265, lng:126.8598, r:0.009, op:0.50 },
      { lat:37.4618, lng:126.8822, r:0.007, op:0.40 },
      { lat:37.4742, lng:126.8900, r:0.006, op:0.35 }
    ]
  };

  /* ── 아이콘 SVG ── */
  var ICON_SVG = {
    energy:   '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    mobility: '<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    safety:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    data:     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
    env:      '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    polygon:  '<polygon points="3 12 12 3 21 12 12 21"/>',
    line:     '<line x1="3" y1="12" x2="21" y2="12"/>',
    heatmap:  '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'
  };

  var FIELD_COLORS = { energy:'#0C8AE5', mobility:'#1AAA5E', safety:'#ED8B16', data:'#6E74D6', env:'#1AAA5E', pub:'#044E9E' };
  var FIELD_LABELS = { energy:'에너지', mobility:'모빌리티', safety:'안전', data:'데이터', env:'환경' };
  var DTYPE_LABELS = { point:'포인트', line:'라인', polygon:'폴리곤', heatmap:'히트맵', bubble:'버블', grid:'격자' };
  var PIN_FILES  = { energy:'pin-energy.svg',  mobility:'pin-mobility.svg',  safety:'pin-safety.svg',  data:'pin-data.svg'  };
  var MILE_FILES = { energy:'mile-energy.svg', mobility:'mile-mobility.svg', safety:'mile-safety.svg', data:'mile-data.svg' };

  /* ── 상태 ── */
  var gmMap         = null;
  var crudMarkers   = [];
  var boundaryPolygons = [];
  var activeTab     = 'crud';
  var selectedData  = null;
  var selectedLayer = null;

  /* 레이어별 렌더 오브젝트 저장 { id → { overlays:[], polylines:[], polygons:[], heatCircles:[], labels:[] } } */
  var layerRenders  = {};
  /* 레이어별 가시성 (개별 눈 토글) { id → bool } */
  var layerVis      = {};

  var _filterCrud = { mgmt:[], dtype:[], status:[], field:[], freq:'all' };
  var _filterLayer = { lstate:'all', ltype:[], lfield:[], _query:'' };

  /* ════════════════════════════════════════════════════════
     부트
  ════════════════════════════════════════════════════════ */
  function init() {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryBoot);
    else tryBoot();
  }

  function tryBoot() {
    if (typeof kakao === 'undefined' || !kakao.maps) { setTimeout(tryBoot, 100); return; }
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) document.addEventListener('gmsb:shell-ready', boot, { once: true });
    else boot();
  }

  function boot() {
    GM_LAYERS.forEach(function(l){ layerVis[l.id] = true; });
    initMap();
    initMapBoundsLock();
    initTabs();
    initSections();
    initFilters();
    initSearch();
    initLayerSearch();
    initMapControls();
    initInfoPopup();
    initLayerPopup();
    initEditDrawer();
    initLayerSettingDrawer();
    initHistoryModal();
    initUploadModal();
    applyCrudMarkers();
    if (window.lucide) lucide.createIcons();
  }

  /* ════════════════════════════════════════════════════════
     지도
  ════════════════════════════════════════════════════════ */
  function initMap() {
    var container = document.getElementById('gmMap');
    gmMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.444, 126.865),
      level: 7
    });
    gmMap.setMinLevel(1);
    gmMap.setMaxLevel(7);
    loadBoundary();
  }

  function initMapBoundsLock() {
    var PAD = 0.03;
    var LAT_MIN = GM_BOUNDS.south - PAD, LAT_MAX = GM_BOUNDS.north + PAD;
    var LNG_MIN = GM_BOUNDS.west  - PAD, LNG_MAX = GM_BOUNDS.east  + PAD;
    var _guard = false;
    kakao.maps.event.addListener(gmMap, 'idle', function () {
      if (_guard) return;
      var c = gmMap.getCenter();
      var lat = Math.max(LAT_MIN, Math.min(LAT_MAX, c.getLat()));
      var lng = Math.max(LNG_MIN, Math.min(LNG_MAX, c.getLng()));
      if (Math.abs(lat - c.getLat()) > 0.0001 || Math.abs(lng - c.getLng()) > 0.0001) {
        _guard = true;
        gmMap.setCenter(new kakao.maps.LatLng(lat, lng));
        setTimeout(function () { _guard = false; }, 300);
      }
    });
  }

  function loadBoundary() {
    var base = window.GMSB_BASE || '../';
    fetch(base + 'assets/img/GM_Map_outerline.svg')
      .then(function(r){ return r.text(); })
      .then(function(svgText) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgText, 'image/svg+xml');
        var srcPath = doc.querySelector('path');
        if (!srcPath) return;
        var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('viewBox', '0 0 ' + GM_BOUNDS.svgW + ' ' + GM_BOUNDS.svgH);
        svgEl.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:' + GM_BOUNDS.svgW + 'px;height:' + GM_BOUNDS.svgH + 'px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(svgEl);
        var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', srcPath.getAttribute('d'));
        svgEl.appendChild(pathEl);
        var totalLen = pathEl.getTotalLength();
        var N = 600, coords = [];
        for (var i = 0; i <= N; i++) {
          var pt = pathEl.getPointAtLength((i / N) * totalLen);
          var lat = GM_BOUNDS.north - (pt.y / GM_BOUNDS.svgH) * (GM_BOUNDS.north - GM_BOUNDS.south);
          var lng = GM_BOUNDS.west  + (pt.x / GM_BOUNDS.svgW) * (GM_BOUNDS.east  - GM_BOUNDS.west);
          coords.push(new kakao.maps.LatLng(lat, lng));
        }
        document.body.removeChild(svgEl);
        var polygon = new kakao.maps.Polygon({
          map: gmMap, path: coords,
          strokeWeight:2, strokeColor:'#0C8AE5', strokeOpacity:0.8,
          fillColor:'#0C8AE5', fillOpacity:0.04
        });
        boundaryPolygons.push(polygon);
      }).catch(function(){});
  }

  /* ════════════════════════════════════════════════════════
     CRUD 마커
  ════════════════════════════════════════════════════════ */
  function addMarkerHover(el) {
    el.style.transition = 'transform .15s';
    el.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.15) translateY(-3px)'; });
    el.addEventListener('mouseleave', function () { this.style.transform = ''; });
  }

  function buildCrudMarkerEl(d) {
    var base = window.GMSB_BASE || '../';
    var pinFile = PIN_FILES[d.field] || PIN_FILES.data;
    var statusColor = { pub:'#1AAA5E', priv:'#ED8B16', review:'#6E74D6', error:'#E0483D' }[d.status] || '#1AAA5E';
    var el = document.createElement('div');
    el.style.cssText = 'position:relative;width:50px;height:60px;cursor:pointer;transition:transform .15s;';
    var img = document.createElement('img');
    img.src = base + 'assets/img/' + pinFile;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 10px rgba(0,0,0,.25));pointer-events:none;';
    el.appendChild(img);
    var dot = document.createElement('span');
    dot.style.cssText = 'position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:' + statusColor + ';border:2px solid #fff;pointer-events:none;';
    el.appendChild(dot);
    addMarkerHover(el);
    return el;
  }

  function applyCrudMarkers() {
    crudMarkers.forEach(function(ref){ ref.overlay.setMap(null); });
    crudMarkers = [];
    getFilteredCrud().forEach(function(d) {
      var el = buildCrudMarkerEl(d);
      el.addEventListener('click', function(){ openInfoPopup(d); });
      var overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(d.lat, d.lng),
        content: el, map: gmMap,
        xAnchor: 0.5, yAnchor: 0.83, zIndex: 5
      });
      crudMarkers.push({ data: d, overlay: overlay });
    });
  }

  /* ════════════════════════════════════════════════════════
     레이어 GIS 렌더링
  ════════════════════════════════════════════════════════ */
  function renderAllLayers() {
    GM_LAYERS.forEach(function(l) { renderLayer(l); });
  }

  function renderLayer(l) {
    /* 기존 렌더 제거 */
    removeLayerRender(l.id);
    var ref = { overlays:[], polylines:[], polygons:[], labels:[] };
    layerRenders[l.id] = ref;

    var visible = layerVis[l.id] && isLayerPassFilter(l);
    var mapTarget = visible ? gmMap : null;

    if (l.dtype === 'point') {
      renderPointLayer(l, ref, mapTarget);
    } else if (l.dtype === 'line') {
      renderLineLayer(l, ref, mapTarget);
    } else if (l.dtype === 'polygon') {
      renderPolygonLayer(l, ref, mapTarget);
    } else if (l.dtype === 'heatmap') {
      renderHeatmapLayer(l, ref, mapTarget);
    }
  }

  function renderPointLayer(l, ref, mapTarget) {
    var base = window.GMSB_BASE || '../';
    var hasMilePin = !!PIN_FILES[l.icon];
    var el = document.createElement('div');
    if (hasMilePin) {
      el.style.cssText = 'position:relative;width:44px;height:53px;cursor:pointer;transition:transform .15s;';
      var img = document.createElement('img');
      img.src = base + 'assets/img/' + PIN_FILES[l.icon];
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.22));opacity:' + (l.opacity/100) + ';pointer-events:none;';
      el.appendChild(img);
    } else {
      var iconPath = ICON_SVG[l.icon] || ICON_SVG.data;
      el.style.cssText = 'width:34px;height:34px;border-radius:50%;background:' + l.color + ';border:2.5px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.28);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:' + (l.opacity/100) + ';transition:transform .15s;';
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>';
    }
    addMarkerHover(el);
    el.addEventListener('click', function(){ openLayerPopup(l); });
    var overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(l.lat, l.lng),
      content: el, map: mapTarget,
      xAnchor: 0.5, yAnchor: hasMilePin ? 0.83 : 0.5,
      zIndex: 10 - l.order
    });
    ref.overlays.push(overlay);

    if (l.labelOn) {
      var labelEl = document.createElement('div');
      labelEl.style.cssText = 'background:rgba(22,36,59,.82);color:#fff;font:600 11px/1.2 var(--font-sans),sans-serif;padding:3px 7px;border-radius:4px;white-space:nowrap;pointer-events:none;margin-top:2px;';
      labelEl.textContent = l.name;
      var labelOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(l.lat - 0.003, l.lng),
        content: labelEl, map: mapTarget,
        xAnchor: 0.5, yAnchor: 0.0, zIndex: 5
      });
      ref.labels.push(labelOverlay);
    }
  }

  function renderLineLayer(l, ref, mapTarget) {
    var lines = DEMO_GEO.l7_lines;
    lines.forEach(function(coords) {
      var path = coords.map(function(c){ return new kakao.maps.LatLng(c[0], c[1]); });
      var polyline = new kakao.maps.Polyline({
        path: path, map: mapTarget,
        strokeWeight: 3,
        strokeColor: l.color,
        strokeOpacity: l.opacity / 100,
        strokeStyle: 'solid'
      });
      /* 클릭 이벤트 */
      kakao.maps.event.addListener(polyline, 'click', function(){ openLayerPopup(l); });
      ref.polylines.push(polyline);
    });
  }

  function renderPolygonLayer(l, ref, mapTarget) {
    var coords = DEMO_GEO.l6_polygon;
    var path = coords.map(function(c){ return new kakao.maps.LatLng(c[0], c[1]); });
    var fillOpacity = Math.max(0.02, (l.opacity / 100) * 0.25);
    var polygon = new kakao.maps.Polygon({
      path: path, map: mapTarget,
      strokeWeight: 2,
      strokeColor: l.color,
      strokeOpacity: Math.min(1, (l.opacity / 100) * 1.4),
      fillColor: l.color,
      fillOpacity: fillOpacity,
      zIndex: 1
    });
    kakao.maps.event.addListener(polygon, 'click', function(){ openLayerPopup(l); });
    ref.polygons.push(polygon);

    if (l.labelOn) {
      var labelEl = document.createElement('div');
      labelEl.style.cssText = 'background:' + l.color + ';color:#fff;font:700 12px/1 var(--font-sans),sans-serif;padding:4px 9px;border-radius:4px;white-space:nowrap;pointer-events:none;';
      labelEl.textContent = l.name;
      var labelOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(37.445, 126.865),
        content: labelEl, map: mapTarget,
        xAnchor: 0.5, yAnchor: 0.5, zIndex: 3
      });
      ref.labels.push(labelOverlay);
    }
  }

  function renderHeatmapLayer(l, ref, mapTarget) {
    var spots = DEMO_GEO.l8_heat;
    spots.forEach(function(spot) {
      var latD = spot.r * 1.0;
      var lngD = spot.r * 1.4;
      /* 여러 동심원으로 히트맵 효과 */
      [1.0, 0.65, 0.35].forEach(function(scale, idx) {
        var el = document.createElement('div');
        var size = Math.round(120 * scale);
        var opacity = spot.op * (idx === 0 ? 0.25 : idx === 1 ? 0.35 : 0.50);
        var rgb = hexToRgb(l.color);
        el.style.cssText = 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;'
          + 'background:radial-gradient(circle, rgba(' + rgb + ',' + (opacity * 1.6).toFixed(2) + ') 0%, rgba(' + rgb + ',0) 70%);'
          + 'pointer-events:none;';
        var overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(spot.lat, spot.lng),
          content: el, map: mapTarget,
          xAnchor: 0.5, yAnchor: 0.5,
          zIndex: 2
        });
        ref.overlays.push(overlay);
      });
    });

    /* 히트맵 중심 클릭용 투명 마커 */
    var clickEl = document.createElement('div');
    clickEl.style.cssText = 'width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0);cursor:pointer;';
    clickEl.addEventListener('click', function(){ openLayerPopup(l); });
    var clickOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(l.lat, l.lng),
      content: clickEl, map: mapTarget,
      xAnchor: 0.5, yAnchor: 0.5, zIndex: 10
    });
    ref.overlays.push(clickOverlay);
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    return r + ',' + g + ',' + b;
  }

  function removeLayerRender(id) {
    var ref = layerRenders[id];
    if (!ref) return;
    ref.overlays.forEach(function(o){ o.setMap(null); });
    ref.polylines.forEach(function(p){ p.setMap(null); });
    ref.polygons.forEach(function(p){ p.setMap(null); });
    ref.labels.forEach(function(l){ l.setMap(null); });
    delete layerRenders[id];
  }

  /* 레이어 가시성 업데이트 (렌더 오브젝트를 지도에 붙이거나 떼기) */
  function updateLayerMapVis(l) {
    var ref = layerRenders[l.id];
    if (!ref) return;
    var visible = layerVis[l.id] && isLayerPassFilter(l);
    var mapTarget = visible ? gmMap : null;
    ref.overlays.forEach(function(o){ o.setMap(mapTarget); });
    ref.polylines.forEach(function(p){ p.setMap(mapTarget); });
    ref.polygons.forEach(function(p){ p.setMap(mapTarget); });
    ref.labels.forEach(function(label){ label.setMap(mapTarget); });
  }

  function isLayerPassFilter(l) {
    if (_filterLayer.lstate === 'inactive' && l.active)  return false;
    if (_filterLayer.lstate === 'review'   && l.active)  return false;
    if (_filterLayer.lstate === 'error'    && l.active)  return false;
    if (_filterLayer.lstate !== 'all' && _filterLayer.lstate !== 'inactive' && _filterLayer.lstate !== 'review' && _filterLayer.lstate !== 'error') {
      /* 'all' = 활성만 표시 */
    }
    if (_filterLayer.ltype.length > 0  && _filterLayer.ltype.indexOf(l.dtype) < 0)  return false;
    if (_filterLayer.lfield.length > 0 && _filterLayer.lfield.indexOf(l.field) < 0) return false;
    var q = _filterLayer._query;
    if (q && l.name.toLowerCase().indexOf(q) < 0 && l.connData.toLowerCase().indexOf(q) < 0) return false;
    return true;
  }

  function applyAllLayerVis() {
    GM_LAYERS.forEach(function(l){ updateLayerMapVis(l); });
  }

  /* ════════════════════════════════════════════════════════
     탭 전환
  ════════════════════════════════════════════════════════ */
  var GM_TAB_META = {
    crud:  { label: 'GIS 데이터 관리(CRUD)', desc: '광명시 GIS 데이터를 지도에서 선택하고 데이터 유형·공개여부·공간 속성을 확인하여 등록 및 수정 관리할 수 있습니다.' },
    layer: { label: '레이어 관리',           desc: 'GIS 지도에 표시되는 레이어를 관리합니다.' }
  };

  function initTabs() {
    if (window.gmsbSetTab) gmsbSetTab(GM_TAB_META.crud.label, GM_TAB_META.crud.desc);
    document.querySelectorAll('.page-tab').forEach(function(btn) {
      btn.addEventListener('click', function() { setActiveTab(this.dataset.tab); });
    });
  }

  function setActiveTab(tab) {
    if (GM_TAB_META[tab] && window.gmsbSetTab) gmsbSetTab(GM_TAB_META[tab].label, GM_TAB_META[tab].desc);
    activeTab = tab;
    document.querySelectorAll('.page-tab').forEach(function(btn) {
      btn.classList.toggle('on', btn.dataset.tab === tab);
    });
    document.getElementById('gmFilterCrud').style.display    = tab === 'crud'  ? 'block' : 'none';
    document.getElementById('gmFilterLayer').style.display   = tab === 'layer' ? 'block' : 'none';
    document.getElementById('gmLayerListWrap').style.display = tab === 'layer' ? 'flex'  : 'none';
    document.getElementById('gmToolbarCrud').style.display   = tab === 'crud'  ? 'flex'  : 'none';
    document.getElementById('gmToolbarLayer').style.display  = tab === 'layer' ? 'flex'  : 'none';

    if (tab === 'crud') {
      /* CRUD 탭: 레이어 렌더 전부 숨기고 마커만 */
      removeAllLayerRenders();
      applyCrudMarkers();
      updateLegend('crud');
    } else {
      /* 레이어 탭: CRUD 마커 숨기고 레이어 렌더링 */
      crudMarkers.forEach(function(ref){ ref.overlay.setMap(null); });
      renderAllLayers();
      renderLayerList();
      updateLegend('layer');
    }
  }

  function removeAllLayerRenders() {
    GM_LAYERS.forEach(function(l){ removeLayerRender(l.id); });
  }

  function updateLegend(tab) {
    var el = document.getElementById('gmLegendList');
    if (!el) return;
    if (tab === 'crud') {
      el.innerHTML = '<div class="gm-legend-item"><span class="gm-legend-dot" style="background:var(--status-success)"></span>공개 데이터</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-dot" style="background:var(--status-warning)"></span>비공개 데이터</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-dot" style="background:var(--status-pending)"></span>검토중 데이터</div>'
        + '<div class="legend-divider" style="height:1px;background:var(--border-2);margin:5px 0;"></div>'
        + '<div class="gm-legend-item"><span class="gm-legend-rect" style="background:rgba(12,138,229,.15);border:1.5px solid var(--gp-point)"></span>공개 범위</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-dashed"></span>비공개 범위</div>';
    } else {
      el.innerHTML = '<div class="gm-legend-item"><span class="gm-legend-dot" style="background:#0C8AE5"></span>포인트 레이어</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-dashed"></span>라인 레이어</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-rect" style="background:rgba(4,78,158,.12);border:1.5px solid #044E9E"></span>폴리곤 레이어</div>'
        + '<div class="gm-legend-item"><span class="gm-legend-dot" style="background:radial-gradient(circle,#FFB114 0%,transparent 70%)"></span>히트맵 레이어</div>';
    }
  }

  /* ════════════════════════════════════════════════════════
     레이어 목록 카드 렌더링
  ════════════════════════════════════════════════════════ */
  function renderLayerList() {
    var filtered = getFilteredLayers();
    var listEl = document.getElementById('gmLayerList');
    var cntEl  = document.getElementById('gmLayerListCnt');
    if (!listEl) return;
    cntEl.textContent = filtered.length;
    listEl.innerHTML = '';

    filtered.forEach(function(l, idx) {
      var card = buildLayerCard(l, idx + 1);
      listEl.appendChild(card);
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:20px 10px;text-align:center;font:400 13px/1.5 var(--font-sans);color:var(--fg-4);">조건에 맞는 레이어가 없습니다.</div>';
    }
  }

  function buildLayerCard(l, orderNum) {
    var isVisible = layerVis[l.id];
    var iconPath  = ICON_SVG[l.icon] || ICON_SVG.data;
    var typeLabel = DTYPE_LABELS[l.dtype] || l.dtype;
    var fieldLabel= FIELD_LABELS[l.field] || l.field;

    var card = document.createElement('div');
    card.className = 'gm-lc' + (isVisible ? '' : ' map-off');
    card.dataset.lid = l.id;

    /* 드래그 핸들 */
    var drag = document.createElement('div');
    drag.className = 'gm-lc__drag';
    drag.title = '드래그하여 순서 변경';
    drag.innerHTML = '<span></span><span></span><span></span>';
    drag.addEventListener('mousedown', function(e){ startDrag(e, card, l); });

    /* 아이콘 */
    var icon = document.createElement('div');
    icon.className = 'gm-lc__icon';
    if (MILE_FILES[l.icon]) {
      icon.innerHTML = '<img src="' + (window.GMSB_BASE||'../') + 'assets/img/' + MILE_FILES[l.icon] + '" style="width:28px;height:28px;object-fit:contain;display:block;" alt="">';
    } else {
      icon.style.background = l.color;
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>';
    }

    /* 순서 번호 */
    var orderEl = document.createElement('span');
    orderEl.className = 'gm-lc__order';
    orderEl.textContent = orderNum;

    /* 정보 */
    var info = document.createElement('div');
    info.className = 'gm-lc__info';
    info.innerHTML = '<div class="gm-lc__name">' + l.name + '</div>'
      + '<div class="gm-lc__meta">'
      + '<span class="gm-lc__type gm-lc__type--' + l.dtype + '">' + typeLabel + '</span>'
      + '<span class="gm-lc__field">' + fieldLabel + '</span>'
      + '</div>';

    /* 눈 토글 버튼 */
    var visBtn = document.createElement('button');
    visBtn.className = 'gm-lc__vis' + (isVisible ? '' : ' off');
    visBtn.type = 'button';
    visBtn.title = isVisible ? '지도에서 숨기기' : '지도에서 표시';
    visBtn.innerHTML = isVisible
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

    visBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      layerVis[l.id] = !layerVis[l.id];
      updateLayerMapVis(l);
      renderLayerList();
    });

    /* 카드 클릭 → 스타일 드로어 */
    card.addEventListener('click', function() {
      document.querySelectorAll('.gm-lc').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      openLayerSettingDrawer(l);
    });

    card.appendChild(drag);
    card.appendChild(icon);
    card.appendChild(orderEl);
    card.appendChild(info);
    card.appendChild(visBtn);
    return card;
  }

  /* ════════════════════════════════════════════════════════
     드래그 순서 변경
  ════════════════════════════════════════════════════════ */
  var _drag = { active: false, card: null, layer: null, startY: 0 };

  function startDrag(e, card, l) {
    e.preventDefault();
    _drag.active = true;
    _drag.card   = card;
    _drag.layer  = l;
    _drag.startY = e.clientY;
    card.classList.add('dragging');

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup',   onDragEnd, { once: true });
  }

  function onDragMove(e) {
    if (!_drag.active) return;
    var list  = document.getElementById('gmLayerList');
    var cards = Array.from(list.querySelectorAll('.gm-lc:not(.dragging)'));
    var overCard = null;
    cards.forEach(function(c) {
      var rect = c.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) overCard = c;
    });
    list.querySelectorAll('.gm-lc').forEach(function(c){ c.classList.remove('drag-over'); });
    if (overCard) overCard.classList.add('drag-over');
  }

  function onDragEnd(e) {
    if (!_drag.active) return;
    document.removeEventListener('mousemove', onDragMove);
    var list     = document.getElementById('gmLayerList');
    var overCard = list.querySelector('.gm-lc.drag-over');
    if (overCard && overCard !== _drag.card) {
      var dragId = _drag.layer.id;
      var overId = overCard.dataset.lid;
      var dragLayer = GM_LAYERS.find(function(l){ return l.id === dragId; });
      var overLayer = GM_LAYERS.find(function(l){ return l.id === overId; });
      if (dragLayer && overLayer) {
        var tmp = dragLayer.order;
        dragLayer.order = overLayer.order;
        overLayer.order = tmp;
      }
      GM_LAYERS.sort(function(a,b){ return a.order - b.order; });
    }
    list.querySelectorAll('.gm-lc').forEach(function(c){ c.classList.remove('dragging','drag-over'); });
    _drag.active = false;
    renderAllLayers();
    renderLayerList();
  }

  /* ════════════════════════════════════════════════════════
     아코디언 섹션
  ════════════════════════════════════════════════════════ */
  function initSections() {
    document.querySelectorAll('.gm-section__hd').forEach(function(hd) {
      hd.addEventListener('click', function() {
        this.closest('.gm-section').classList.toggle('open');
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     필터
  ════════════════════════════════════════════════════════ */
  function getCheckedVals(attr) {
    var vals = [];
    document.querySelectorAll('[' + attr + ']:checked').forEach(function(cb) {
      vals.push(cb.getAttribute(attr));
    });
    return vals;
  }

  function getFilteredCrud() {
    var freqMap = { realtime:'실시간', daily:'1일', weekly:'주간', monthly:'월간' };
    return GM_DATA.filter(function(d) {
      if (_filterCrud.mgmt.length > 0 && _filterCrud.mgmt.indexOf('all') < 0) {
        var ok = false;
        if (_filterCrud.mgmt.indexOf('pub')  >= 0 && d.pub === true)        ok = true;
        if (_filterCrud.mgmt.indexOf('priv') >= 0 && d.pub === false)       ok = true;
        if (_filterCrud.mgmt.indexOf('del')  >= 0 && d.status === 'review') ok = true;
        if (_filterCrud.mgmt.indexOf('mod')  >= 0 && d.status === 'review') ok = true;
        if (!ok) return false;
      }
      if (_filterCrud.dtype.length > 0) {
        if (_filterCrud.dtype.indexOf(d.dtype) < 0 && _filterCrud.dtype.indexOf(d.file) < 0) return false;
      }
      if (_filterCrud.status.length > 0 && _filterCrud.status.indexOf(d.status) < 0) return false;
      if (_filterCrud.field.length > 0  && _filterCrud.field.indexOf(d.field) < 0)   return false;
      if (_filterCrud.freq !== 'all' && d.freq !== freqMap[_filterCrud.freq]) return false;
      return true;
    });
  }

  function getFilteredLayers() {
    var q = _filterLayer._query;
    return GM_LAYERS.filter(function(l) {
      if (_filterLayer.lstate === 'inactive' && l.active)  return false;
      if (_filterLayer.lstate !== 'all' && _filterLayer.lstate !== 'inactive' && !l.active) return false;
      if (_filterLayer.ltype.length > 0  && _filterLayer.ltype.indexOf(l.dtype) < 0)  return false;
      if (_filterLayer.lfield.length > 0 && _filterLayer.lfield.indexOf(l.field) < 0) return false;
      if (q && l.name.toLowerCase().indexOf(q) < 0 && l.connData.toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }

  function initFilters() {
    /* CRUD 필터 */
    document.querySelectorAll('[data-mgmt]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        if (this.getAttribute('data-mgmt') === 'all' && this.checked) {
          document.querySelectorAll('[data-mgmt]:not([data-mgmt="all"])').forEach(function(c){ c.checked = false; });
        } else {
          document.querySelector('[data-mgmt="all"]').checked = false;
        }
        _filterCrud.mgmt = getCheckedVals('data-mgmt');
        applyCrudMarkers();
      });
    });
    document.querySelectorAll('[data-dtype]').forEach(function(cb) {
      cb.addEventListener('change', function() { _filterCrud.dtype = getCheckedVals('data-dtype'); applyCrudMarkers(); });
    });
    document.querySelectorAll('[data-status]').forEach(function(cb) {
      cb.addEventListener('change', function() { _filterCrud.status = getCheckedVals('data-status'); applyCrudMarkers(); });
    });
    document.querySelectorAll('[data-field]').forEach(function(cb) {
      cb.addEventListener('change', function() { _filterCrud.field = getCheckedVals('data-field'); applyCrudMarkers(); });
    });
    document.querySelectorAll('[name="gmFreq"]').forEach(function(rb) {
      rb.addEventListener('change', function() { if (this.checked) { _filterCrud.freq = this.value; applyCrudMarkers(); } });
    });

    /* 레이어 필터 */
    document.querySelectorAll('[name="gmLState"]').forEach(function(rb) {
      rb.addEventListener('change', function() {
        if (this.checked) {
          _filterLayer.lstate = this.value;
          applyAllLayerVis();
          renderLayerList();
        }
      });
    });
    document.querySelectorAll('[data-ltype]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        _filterLayer.ltype = getCheckedVals('data-ltype');
        applyAllLayerVis();
        renderLayerList();
      });
    });
    document.querySelectorAll('[data-lfield]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        _filterLayer.lfield = getCheckedVals('data-lfield');
        applyAllLayerVis();
        renderLayerList();
      });
    });
  }

  function initLayerSearch() {
    var input = document.getElementById('gmLayerSearchInput');
    if (!input) return;
    input.addEventListener('input', function() {
      _filterLayer._query = this.value.trim().toLowerCase();
      applyAllLayerVis();
      renderLayerList();
    });
  }

  /* ════════════════════════════════════════════════════════
     CRUD 검색
  ════════════════════════════════════════════════════════ */
  function initSearch() {
    var input    = document.getElementById('gmSearchInput');
    var dropdown = document.getElementById('gmSearchDropdown');
    if (!input) return;
    input.addEventListener('input', function() {
      var q = this.value.trim();
      if (q.length < 2) { dropdown.classList.remove('open'); return; }
      var results = GM_DATA.filter(function(d){ return d.name.indexOf(q) > -1 || d.field.indexOf(q) > -1; });
      if (!results.length) { dropdown.classList.remove('open'); return; }
      dropdown.innerHTML = results.slice(0, 8).map(function(d) {
        return '<div class="search-item" data-id="' + d.id + '">'
          + '<span class="search-item__dot" style="background:' + (FIELD_COLORS[d.field]||'#044E9E') + '"></span>'
          + d.name + '</div>';
      }).join('');
      dropdown.classList.add('open');
      dropdown.querySelectorAll('.search-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var found = GM_DATA.find(function(d){ return d.id === item.dataset.id; });
          if (!found) return;
          input.value = found.name;
          dropdown.classList.remove('open');
          gmMap.setCenter(new kakao.maps.LatLng(found.lat, found.lng));
          gmMap.setLevel(5);
          setTimeout(function(){ openInfoPopup(found); }, 200);
        });
      });
    });
    document.addEventListener('click', function(e) {
      if (!input.closest('.gis-search').contains(e.target)) dropdown.classList.remove('open');
    });
  }

  /* ════════════════════════════════════════════════════════
     지도 컨트롤
  ════════════════════════════════════════════════════════ */
  function initMapControls() {
    document.getElementById('gmBtnZoomIn').addEventListener('click',  function(){ gmMap.setLevel(gmMap.getLevel()-1); });
    document.getElementById('gmBtnZoomOut').addEventListener('click', function(){ gmMap.setLevel(gmMap.getLevel()+1); });
    document.getElementById('gmBtnCenter').addEventListener('click',  function(){
      gmMap.setCenter(new kakao.maps.LatLng(37.444, 126.865)); gmMap.setLevel(7);
    });
    ['gmBtnFitCrud','gmBtnFitLayer'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function(){
        gmMap.setBounds(new kakao.maps.LatLngBounds(
          new kakao.maps.LatLng(GM_BOUNDS.south, GM_BOUNDS.west),
          new kakao.maps.LatLng(GM_BOUNDS.north, GM_BOUNDS.east)
        ), 20, 20, 20, 20);
      });
    });
    document.getElementById('gmBtnNew').addEventListener('click', function(){ openUploadModal(); });
    document.getElementById('gmBtnHistory').addEventListener('click', function(){
      if (selectedData) openHistoryModal(selectedData);
      else showToast('지도에서 데이터를 선택한 후 이용하세요.');
    });
    document.getElementById('gmBtnLayerOrder').addEventListener('click', function(){ alert('레이어 목록에서 드래그 핸들로 순서를 변경하세요.'); });
    document.getElementById('gmBtnStylePreview').addEventListener('click', function(){ alert('레이어 목록에서 카드를 클릭하면 스타일 편집 패널이 열립니다.'); });
    document.getElementById('gmBtnLayerSave').addEventListener('click', function(){ showToast('레이어 설정이 저장되었습니다.'); });
    document.getElementById('gmBtnLayerToggle').addEventListener('click', function(){
      var allVisible = GM_LAYERS.every(function(l){ return layerVis[l.id]; });
      GM_LAYERS.forEach(function(l){ layerVis[l.id] = !allVisible; });
      applyAllLayerVis();
      renderLayerList();
    });
    document.getElementById('gmBtnExport').addEventListener('click', function(){
      var filtered = getFilteredCrud();
      if (!filtered.length) { showToast('내보낼 데이터가 없습니다.'); return; }
      var header = ['id','name','dtype','file','spatial','epsg','source','freq','pub','dept','modifier','status','created','modified'].join(',');
      var rows = filtered.map(function(d) {
        return [d.id,'"'+d.name+'"',d.dtype,d.file,d.spatial,d.epsg,'"'+d.source+'"',d.freq,d.pub,d.dept,d.modifier||'',d.status,d.created,d.modified].join(',');
      });
      var csv = '﻿' + header + '\n' + rows.join('\n');
      var blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '광명_GIS데이터목록_' + new Date().toISOString().slice(0,10) + '.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    });
    document.getElementById('gmBtnEdit').addEventListener('click', function(){
      if (selectedData) openEditDrawer(selectedData);
    });
  }

  /* ════════════════════════════════════════════════════════
     토스트
  ════════════════════════════════════════════════════════ */
  function showToast(msg) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(22,36,59,.9);color:#fff;font:600 13px/1 var(--font-sans);padding:12px 22px;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.2);transition:opacity .3s;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity = '0'; setTimeout(function(){ t.remove(); }, 320); }, 2000);
  }

  /* ════════════════════════════════════════════════════════
     CRUD 정보 팝업
  ════════════════════════════════════════════════════════ */
  function initInfoPopup() {
    document.getElementById('gmInfoClose').addEventListener('click',  closeInfoPopup);
    document.getElementById('gmInfoScrim').addEventListener('click',  closeInfoPopup);
    document.getElementById('gmInfoEditBtn').addEventListener('click', function(){
      closeInfoPopup(); openEditDrawer(selectedData);
    });
    document.getElementById('gmInfoPreviewBtn').addEventListener('click', function(){
      if (selectedData) {
        closeInfoPopup();
        gmMap.setCenter(new kakao.maps.LatLng(selectedData.lat, selectedData.lng));
        gmMap.setLevel(5);
      }
    });
    document.getElementById('gmInfoDeleteBtn').addEventListener('click',   function(){ if (confirm('정말 삭제하시겠습니까?')) { showToast('삭제되었습니다.'); closeInfoPopup(); } });
    document.getElementById('gmInfoPubBtn').addEventListener('click',      function(){ showToast('공개 상태가 전환되었습니다.'); closeInfoPopup(); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ closeInfoPopup(); closeLayerPopup(); closeEditDrawer(); closeLayerSettingDrawer(); }
    });
  }

  function openInfoPopup(d) {
    selectedData = d;
    var base = window.GMSB_BASE || '../';
    var mileFile = MILE_FILES[d.field] || MILE_FILES.data;
    document.getElementById('gmInfoBadge').innerHTML = '<img src="' + base + 'assets/img/' + mileFile + '" style="width:40px;height:40px;display:block;" alt="">';
    document.getElementById('gmInfoTitle').textContent = d.name;
    var typeMap = { point:'포인트', line:'라인', polygon:'폴리곤', raster:'래스터' };
    document.getElementById('gmInfoType').innerHTML = '<span class="gm-type-badge gm-type-badge--' + d.dtype + '">' + (typeMap[d.dtype]||d.dtype) + '</span>';
    var pubPill = d.pub ? '<span class="gm-pill gm-pill--pub">공개</span>' : '<span class="gm-pill gm-pill--private">비공개</span>';
    var fileMap = { shapefile:'벡터 데이터 (Shapefile)', geojson:'GeoJSON', api:'API 연계', raster:'래스터 데이터' };
    document.getElementById('gmInfoDl').innerHTML =
      '<div class="gm-info-row"><span class="gm-info-dt">데이터명</span><span class="gm-info-dd">' + d.name + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">데이터 유형</span><span class="gm-info-dd">' + (typeMap[d.dtype]||d.dtype) + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">파일 구분</span><span class="gm-info-dd">' + (fileMap[d.file]||d.file) + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">공간 유형</span><span class="gm-info-dd">' + d.spatial + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">좌표계</span><span class="gm-info-dd">' + d.epsg + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">원천 시스템</span><span class="gm-info-dd">' + d.source + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">갱신 주기</span><span class="gm-info-dd">' + d.freq + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">공개 여부</span><span class="gm-info-dd">' + pubPill + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">담당 부서</span><span class="gm-info-dd">' + d.dept + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">수정자</span><span class="gm-info-dd">' + (d.modifier || '-') + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">최근 수정</span><span class="gm-info-dd">' + d.modified + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">설명</span><span class="gm-info-dd" style="text-align:left;font-weight:400;font-size:12px;max-width:200px;">' + d.desc + '</span></div>';
    document.getElementById('gmInfoPubBtn').textContent = d.pub ? '비공개 전환' : '공개 전환';
    document.getElementById('gmInfoPopup').classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  function closeInfoPopup() { document.getElementById('gmInfoPopup').classList.remove('open'); }

  /* ════════════════════════════════════════════════════════
     레이어 팝업
  ════════════════════════════════════════════════════════ */
  function initLayerPopup() {
    document.getElementById('gmLayerClose').addEventListener('click',  closeLayerPopup);
    document.getElementById('gmLayerScrim').addEventListener('click',  closeLayerPopup);
    document.getElementById('gmLayerStyleBtn').addEventListener('click', function(){
      closeLayerPopup(); openLayerSettingDrawer(selectedLayer);
    });
    document.getElementById('gmLayerOrderBtn').addEventListener('click', function(){
      showToast('레이어 목록에서 드래그 핸들로 순서를 변경하세요.'); closeLayerPopup();
    });
    document.getElementById('gmLayerDeactivateBtn').addEventListener('click', function(){
      if (selectedLayer) {
        selectedLayer.active = false;
        layerVis[selectedLayer.id] = false;
        applyAllLayerVis();
        renderLayerList();
        showToast('레이어가 비활성 처리되었습니다.');
      }
      closeLayerPopup();
    });
    document.getElementById('gmLayerPreviewBtn').addEventListener('click', function(){
      closeLayerPopup(); openLayerSettingDrawer(selectedLayer);
    });
  }

  function openLayerPopup(l) {
    selectedLayer = l;
    var base = window.GMSB_BASE || '../';
    var mileFile = MILE_FILES[l.icon] || MILE_FILES.data;
    document.getElementById('gmLayerBadge').innerHTML = '<img src="' + base + 'assets/img/' + mileFile + '" style="width:40px;height:40px;display:block;" alt="">';
    document.getElementById('gmLayerTitle').textContent = l.name + ' 레이어';
    document.getElementById('gmLayerType').innerHTML = '<span class="gm-type-badge gm-type-badge--' + l.dtype + '">' + (DTYPE_LABELS[l.dtype]||l.dtype) + '</span>';
    var activePill = l.active ? '<span class="gm-pill gm-pill--active">활성</span>' : '<span class="gm-pill gm-pill--pending">비활성</span>';
    var pubPill    = l.pub    ? '<span class="gm-pill gm-pill--pub">공개</span>'    : '<span class="gm-pill gm-pill--private">비공개</span>';
    var displayMap = { point:'아이콘', heatmap:'히트맵', polygon:'폴리곤', line:'라인' };
    document.getElementById('gmLayerDl').innerHTML =
      '<div class="gm-info-row"><span class="gm-info-dt">레이어명</span><span class="gm-info-dd">' + l.name + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">연결 데이터</span><span class="gm-info-dd">' + l.connData + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">유형</span><span class="gm-info-dd"><span class="gm-type-badge gm-type-badge--' + l.dtype + '">' + (DTYPE_LABELS[l.dtype]||l.dtype) + '</span></span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">표시 방식</span><span class="gm-info-dd">' + (displayMap[l.dtype]||'아이콘') + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">순서</span><span class="gm-info-dd">' + l.order + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">활성 여부</span><span class="gm-info-dd">' + activePill + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">공개 여부</span><span class="gm-info-dd">' + pubPill + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">투명도</span><span class="gm-info-dd">' + l.opacity + '%</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">라벨 표시</span><span class="gm-info-dd">' + (l.labelOn ? '표시' : '숨김') + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">최소 줌</span><span class="gm-info-dd">' + l.minZoom + '</span></div>'
      + '<div class="gm-info-row"><span class="gm-info-dt">최대 줌</span><span class="gm-info-dd">' + l.maxZoom + '</span></div>';
    document.getElementById('gmLayerPopup').classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  function closeLayerPopup() { document.getElementById('gmLayerPopup').classList.remove('open'); }

  /* ════════════════════════════════════════════════════════
     CRUD 편집 드로어
  ════════════════════════════════════════════════════════ */
  function initEditDrawer() {
    document.getElementById('gmEditClose').addEventListener('click',     closeEditDrawer);
    document.getElementById('gmEditCancelBtn').addEventListener('click', closeEditDrawer);
    document.getElementById('gmEditDraftBtn').addEventListener('click',  function(){ showToast('임시저장되었습니다. 게시 전까지 반영되지 않습니다.'); });
    document.getElementById('gmEditSaveBtn').addEventListener('click',   function(){ showToast('게시 완료되었습니다.'); closeEditDrawer(); });
    document.getElementById('gmEditHistoryBtn').addEventListener('click', function(){
      closeEditDrawer();
      if (selectedData) openHistoryModal(selectedData);
    });
    var pubToggle = document.getElementById('gmEditPub');
    var pubLabel  = document.getElementById('gmEditPubLabel');
    pubToggle.addEventListener('change', function(){ pubLabel.textContent = this.checked ? '공개' : '비공개'; });
    var textarea = document.getElementById('gmEditDesc');
    var hintEl   = document.getElementById('gmEditDescHint');
    textarea.addEventListener('input', function(){ hintEl.textContent = this.value.length + '/500'; });
    document.querySelectorAll('.gm-tag__del').forEach(function(btn) {
      btn.addEventListener('click', function(){ this.closest('.gm-tag').remove(); });
    });
    document.getElementById('gmTagAddBtn').addEventListener('click', function(){
      var tag = prompt('태그를 입력하세요:');
      if (tag && tag.trim()) {
        var span = document.createElement('span');
        span.className = 'gm-tag';
        span.innerHTML = tag.trim() + ' <button class="gm-tag__del" type="button">×</button>';
        span.querySelector('.gm-tag__del').addEventListener('click', function(){ span.remove(); });
        document.getElementById('gmEditTags').insertBefore(span, document.getElementById('gmTagAddBtn'));
      }
    });
  }

  function openEditDrawer(d) {
    if (d) {
      document.getElementById('gmEditName').value = d.name;
      document.getElementById('gmEditDept').value = d.dept;
      document.getElementById('gmEditDesc').value = d.desc;
      document.getElementById('gmEditDescHint').textContent = d.desc.length + '/500';
      document.getElementById('gmEditFormTitle').textContent = d.name + ' 레이어';
      document.getElementById('gmEditPub').checked = d.pub;
      document.getElementById('gmEditPubLabel').textContent = d.pub ? '공개' : '비공개';
      var metaEl = document.getElementById('gmEditMeta');
      if (metaEl) {
        metaEl.innerHTML = '최근 수정: ' + d.modified + '<br>수정자: ' + (d.modifier || 'Admin') + '<br>생성일: ' + d.created;
      }
    }
    document.getElementById('gmEditDrawer').classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  function closeEditDrawer() { document.getElementById('gmEditDrawer').classList.remove('open'); }

  /* ════════════════════════════════════════════════════════
     레이어 설정 드로어 (스타일 실시간 반영)
  ════════════════════════════════════════════════════════ */
  function initLayerSettingDrawer() {
    document.getElementById('gmLayerSettingClose').addEventListener('click',     closeLayerSettingDrawer);
    document.getElementById('gmLayerSettingCancelBtn').addEventListener('click', closeLayerSettingDrawer);
    document.getElementById('gmLayerSettingSaveBtn').addEventListener('click',   function(){
      showToast('레이어 설정이 저장되었습니다.');
      closeLayerSettingDrawer();
    });

    var opacitySlider = document.getElementById('gmLayerSettingOpacity');
    var opacityVal    = document.getElementById('gmLayerSettingOpacityVal');
    opacitySlider.addEventListener('input', function() {
      var val = parseInt(this.value);
      opacityVal.textContent = val + '%';
      opacitySlider.style.background = 'linear-gradient(to right, var(--gp-primary) ' + val + '%, var(--border-1) ' + val + '%)';
      if (selectedLayer) {
        selectedLayer.opacity = val;
        renderLayer(selectedLayer);
      }
    });

    var colorSel    = document.getElementById('gmLayerSettingColorSel');
    var colorSwatch = document.getElementById('gmLayerSettingColor');
    colorSel.addEventListener('change', function() {
      colorSwatch.style.background = this.value;
      if (selectedLayer) {
        selectedLayer.color = this.value;
        renderLayer(selectedLayer);
        renderLayerList();
      }
    });

    var labelToggle = document.getElementById('gmLayerSettingLabel');
    labelToggle.addEventListener('change', function() {
      if (selectedLayer) {
        selectedLayer.labelOn = this.checked;
        renderLayer(selectedLayer);
      }
    });

    var pubToggle = document.getElementById('gmLayerSettingPub');
    pubToggle.addEventListener('change', function() {
      if (selectedLayer) selectedLayer.pub = this.checked;
    });
  }

  function openLayerSettingDrawer(l) {
    selectedLayer = l;
    if (l) {
      document.getElementById('gmLayerSettingName').value    = l.name;
      document.getElementById('gmLayerSettingOpacity').value = l.opacity;
      document.getElementById('gmLayerSettingOpacityVal').textContent = l.opacity + '%';
      document.getElementById('gmLayerSettingOpacity').style.background = 'linear-gradient(to right, var(--gp-primary) ' + l.opacity + '%, var(--border-1) ' + l.opacity + '%)';
      document.getElementById('gmLayerSettingLabel').checked = l.labelOn;
      document.getElementById('gmLayerSettingPub').checked   = l.pub;

      /* 색상 셀렉트 동기화 */
      var colorSel = document.getElementById('gmLayerSettingColorSel');
      var matched  = Array.from(colorSel.options).some(function(opt){
        if (opt.value.toLowerCase() === l.color.toLowerCase()) { opt.selected = true; return true; }
        return false;
      });
      if (!matched) colorSel.selectedIndex = 0;
      document.getElementById('gmLayerSettingColor').style.background = l.color;
    }
    document.getElementById('gmLayerSettingDrawer').classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  function closeLayerSettingDrawer() {
    document.getElementById('gmLayerSettingDrawer').classList.remove('open');
    document.querySelectorAll('.gm-lc').forEach(function(c){ c.classList.remove('selected'); });
  }

  /* ════════════════════════════════════════════════════════
     변경 이력 모달
  ════════════════════════════════════════════════════════ */
  var DEMO_HISTORY = {
    d1: [
      { date:'2026-05-20 10:15', actor:'김민준', dept:'기후에너지과', action:'속성 수정', detail:'갱신 주기: 주간 → 1일' },
      { date:'2026-05-10 14:22', actor:'이수진', dept:'기후에너지과', action:'공개 전환', detail:'비공개 → 공개' },
      { date:'2026-04-25 09:10', actor:'김민준', dept:'기후에너지과', action:'데이터 업로드', detail:'신규 Shapefile 등록 (847개 지점)' },
      { date:'2026-04-18 09:30', actor:'관리자', dept:'시스템',       action:'초기 등록', detail:'데이터 최초 등록' }
    ],
    d2: [
      { date:'2026-05-15 11:00', actor:'이수진', dept:'교통정책과', action:'속성 수정', detail:'좌표계: EPSG-5186 → EPSG-4326' },
      { date:'2026-05-02 15:30', actor:'이수진', dept:'교통정책과', action:'데이터 업로드', detail:'GeoJSON 갱신 (202개 노선)' },
      { date:'2026-03-10 14:00', actor:'관리자', dept:'시스템',     action:'초기 등록', detail:'데이터 최초 등록' }
    ]
  };

  function initHistoryModal() {
    var scrim    = document.getElementById('gmHistoryScrim');
    var closeBtn = document.getElementById('gmHistoryClose');
    var closeFt  = document.getElementById('gmHistoryCloseBtn');
    if (scrim)    scrim.addEventListener('click', closeHistoryModal);
    if (closeBtn) closeBtn.addEventListener('click', closeHistoryModal);
    if (closeFt)  closeFt.addEventListener('click', closeHistoryModal);
  }

  function openHistoryModal(d) {
    var titleEl    = document.getElementById('gmHistoryTitle');
    var subtitleEl = document.getElementById('gmHistorySubtitle');
    var bodyEl     = document.getElementById('gmHistoryBody');
    if (!titleEl) return;

    titleEl.textContent    = d.name + ' · 변경 이력';
    subtitleEl.textContent = d.dept + ' · ' + (d.modifier || '-');

    var history = DEMO_HISTORY[d.id] || [
      { date: d.modified, actor: d.modifier || 'Admin', dept: d.dept, action: '속성 수정', detail: '최근 수정' },
      { date: d.created,  actor: 'Admin', dept: '시스템', action: '초기 등록', detail: '데이터 최초 등록' }
    ];

    bodyEl.innerHTML = '<table style="width:100%;border-collapse:collapse;font:400 12px/1.5 var(--font-sans);">'
      + '<thead><tr style="background:var(--surface-inset);">'
      + '<th style="padding:9px 14px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">일시</th>'
      + '<th style="padding:9px 14px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">처리자</th>'
      + '<th style="padding:9px 14px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">작업</th>'
      + '<th style="padding:9px 14px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">내용</th>'
      + '</tr></thead><tbody>'
      + history.map(function(h, i) {
          var ACTION_COLORS = { '초기 등록':'var(--status-info)', '공개 전환':'var(--status-success)', '속성 수정':'var(--status-warning)', '데이터 업로드':'var(--status-pending)' };
          var color = ACTION_COLORS[h.action] || 'var(--fg-3)';
          return '<tr style="background:' + (i % 2 === 0 ? '#fff' : 'var(--bg-subtle)') + ';">'
            + '<td style="padding:9px 14px;color:var(--fg-3);border-bottom:1px solid var(--border-2);white-space:nowrap;">' + h.date + '</td>'
            + '<td style="padding:9px 14px;color:var(--fg-1);font-weight:500;border-bottom:1px solid var(--border-2);white-space:nowrap;">' + h.actor + '<br><span style="font-size:11px;color:var(--fg-4);">' + h.dept + '</span></td>'
            + '<td style="padding:9px 14px;border-bottom:1px solid var(--border-2);"><span style="color:' + color + ';font-weight:600;">' + h.action + '</span></td>'
            + '<td style="padding:9px 14px;color:var(--fg-2);border-bottom:1px solid var(--border-2);">' + h.detail + '</td>'
            + '</tr>';
        }).join('')
      + '</tbody></table>';

    document.getElementById('gmHistoryModal').classList.add('open');
  }

  function closeHistoryModal() {
    var m = document.getElementById('gmHistoryModal');
    if (m) m.classList.remove('open');
  }

  /* ════════════════════════════════════════════════════════
     일괄업로드 모달
  ════════════════════════════════════════════════════════ */
  function initUploadModal() {
    var scrim     = document.getElementById('gmUploadScrim');
    var closeBtn  = document.getElementById('gmUploadClose');
    var closeFt   = document.getElementById('gmUploadCloseBtn');
    var draftBtn  = document.getElementById('gmUploadDraftBtn');
    var submitBtn = document.getElementById('gmUploadSubmitBtn');
    var dropzone  = document.getElementById('gmUploadDropzone');
    var fileInput = document.getElementById('gmUploadFileInput');
    var fileName  = document.getElementById('gmUploadFileName');

    if (scrim)    scrim.addEventListener('click', closeUploadModal);
    if (closeBtn) closeBtn.addEventListener('click', closeUploadModal);
    if (closeFt)  closeFt.addEventListener('click', closeUploadModal);
    if (draftBtn) draftBtn.addEventListener('click', function() {
      showToast('임시저장되었습니다. 게시 전까지 지도에 반영되지 않습니다.');
    });
    if (submitBtn) submitBtn.addEventListener('click', function() {
      var name = document.getElementById('gmUploadName') && document.getElementById('gmUploadName').value.trim();
      if (!name) { alert('데이터명을 입력하세요.'); return; }
      showToast('데이터가 등록되었습니다: ' + name);
      closeUploadModal();
    });
    if (dropzone) {
      dropzone.addEventListener('click', function() { if (fileInput) fileInput.click(); });
      dropzone.addEventListener('dragover', function(e) { e.preventDefault(); dropzone.style.borderColor = 'var(--gp-primary)'; });
      dropzone.addEventListener('dragleave', function() { dropzone.style.borderColor = ''; });
      dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.style.borderColor = '';
        if (e.dataTransfer.files[0]) handleUploadFile(e.dataTransfer.files[0]);
      });
    }
    if (fileInput) fileInput.addEventListener('change', function() {
      if (this.files[0]) handleUploadFile(this.files[0]);
    });

    /* 업로드 유형 버튼 */
    document.querySelectorAll('.gm-upload-type-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.gm-upload-type-btn').forEach(function(b){ b.classList.remove('on'); });
        this.classList.add('on');
      });
    });

    function handleUploadFile(file) {
      if (fileName) {
        fileName.textContent = '선택된 파일: ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)';
        fileName.style.display = 'block';
      }
      var nameInput = document.getElementById('gmUploadName');
      if (nameInput && !nameInput.value) {
        nameInput.value = file.name.replace(/\.[^.]+$/, '');
      }
    }
  }

  function openUploadModal() {
    var m = document.getElementById('gmUploadModal');
    if (m) m.classList.add('open');
    var nameInput = document.getElementById('gmUploadName');
    if (nameInput) nameInput.value = '';
    var fileName = document.getElementById('gmUploadFileName');
    if (fileName) { fileName.style.display = 'none'; fileName.textContent = ''; }
  }

  function closeUploadModal() {
    var m = document.getElementById('gmUploadModal');
    if (m) m.classList.remove('open');
  }

  function nowStr() {
    var d = new Date();
    var pad = function(n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' +
           pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('#refreshBtn');
    if (!btn) return;
    var el = document.getElementById('updTime');
    if (el) el.textContent = nowStr();
    renderTable();
    if (typeof renderLayerTable === 'function') renderLayerTable();
  });

  init();
})();
