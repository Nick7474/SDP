/* =====================================================================
   광명 스마트데이터보드 · 탄소·에너지 공간 데이터  (Kakao Maps v3)
   ===================================================================== */
(function () {
  'use strict';

  var GM_BOUNDS = {
    north: 37.4968, south: 37.3922,
    west:  126.8172, east:  126.9108,
    svgW:  391, svgH: 561
  };

  /* 행정구역별 choropleth 범례 (탄소배출량 기준 — 높을수록 빨강) */
  var CE_CHOROPLETH_LEGEND = [
    { color:'#d72027', range:'50,000 이상' },
    { color:'#ef7c49', range:'35,000 ~ 50,000' },
    { color:'#feca80', range:'22,000 ~ 35,000' },
    { color:'#fcf7c1', range:'12,000 ~ 22,000' },
    { color:'#c8e2ad', range:'7,000 ~ 12,000' },
    { color:'#80bfab', range:'3,000 ~ 7,000' },
    { color:'#2b83bb', range:'3,000 미만' }
  ];

  /* 행정동별 탄소배출량 데이터 (tCO₂eq, 높을수록 빨강) */
  var DONG_DEMO_DATA = [
    { name:'철산1동',  value: 29800 },
    { name:'철산2동',  value: 11900 },
    { name:'철산3동',  value: 33500 },
    { name:'철산4동',  value: 63000 },
    { name:'광명1동',  value:  8540 },
    { name:'광명2동',  value: 21300 },
    { name:'광명3동',  value: 18200 },
    { name:'광명4동',  value:  3280 },
    { name:'광명5동',  value:  4200 },
    { name:'광명6동',  value: 44800 },
    { name:'광명7동',  value:  1800 },
    { name:'하안1동',  value: 52480 },
    { name:'하안2동',  value:  9700 },
    { name:'소하1동',  value:  3800 },
    { name:'소하2동',  value: 16800 },
    { name:'학온동',   value:  4850 },
    { name:'일직동',   value:  2500 }
  ];

  function tco2ToColor(v) {
    if (v >= 50000) return '#d72027';
    if (v >= 35000) return '#ef7c49';
    if (v >= 22000) return '#feca80';
    if (v >= 12000) return '#fcf7c1';
    if (v >= 7000)  return '#c8e2ad';
    if (v >= 3000)  return '#80bfab';
    return '#2b83bb';
  }

  /* ── 탄소저감 시설 목업 데이터 ── */
  var CARBON_PINS = [
    { id:'c1', tab:'carbon', sector:'renew',     name:'광명역 태양광 발전소',     type:'신재생에너지', lat:37.4218, lng:126.8648, value:48.7, unit:'tCO₂eq', status:'ok',   sync:'2026-05-26 14:30', addr:'경기도 광명시 일직동 346',       dong:'일직동', source:'건축물에너지정보플랫폼', summary:'공공부지 태양광 발전량을 탄소저감량으로 환산한 지점입니다.' },
    { id:'c2', tab:'carbon', sector:'building',  name:'철산동 건물에너지 절감',   type:'건물 절감',     lat:37.4742, lng:126.8822, value:32.1, unit:'tCO₂eq', status:'ok',   sync:'2026-05-26 14:20', addr:'경기도 광명시 철산동 12-4',      dong:'철산동', source:'공공건물 에너지관리시스템', summary:'업무시설 전력 사용량 개선 효과를 저감 기여량으로 산정합니다.' },
    { id:'c3', tab:'carbon', sector:'transport', name:'소하동 친환경 이동거점',   type:'교통 효율화',   lat:37.4392, lng:126.8755, value:21.4, unit:'tCO₂eq', status:'ok',   sync:'2026-05-26 14:30', addr:'경기도 광명시 소하동 134-2',     dong:'소하동', source:'친환경 교통 운영 데이터',   summary:'친환경 이동수단 이용 전환에 따른 탄소저감 효과를 집계합니다.' },
    { id:'c4', tab:'carbon', sector:'citizen',   name:'광명동 시민참여센터',      type:'시민참여 활동', lat:37.4552, lng:126.8692, value:14.2, unit:'tCO₂eq', status:'warn', sync:'2026-05-26 13:45', addr:'경기도 광명시 광명동 행정타운', dong:'광명동', source:'탄소중립 시민참여 플랫폼', summary:'시민참여 캠페인과 활동 실적을 저감량으로 환산한 지점입니다.' },
    { id:'c5', tab:'carbon', sector:'renew',     name:'하안동 재생에너지 거점',   type:'신재생에너지', lat:37.4518, lng:126.8748, value:38.9, unit:'tCO₂eq', status:'ok',   sync:'2026-05-26 14:25', addr:'경기도 광명시 하안동 320',       dong:'하안동', source:'재생에너지 발전량 수집 API', summary:'분산형 재생에너지 생산량을 기준으로 저감 기여량을 산정합니다.' },
    { id:'c6', tab:'carbon', sector:'building',  name:'일직동 스마트빌딩',        type:'건물 절감',     lat:37.4265, lng:126.8598, value:27.3, unit:'tCO₂eq', status:'ok',   sync:'2026-05-26 14:10', addr:'경기도 광명시 일직동 산12',      dong:'일직동', source:'스마트빌딩 에너지 데이터',   summary:'건물 자동제어와 효율 개선으로 절감된 에너지 사용량을 추적합니다.' }
  ];

  /* ── 에너지 시설 목업 데이터 ── */
  var ENERGY_PINS = [
    { id:'e1', tab:'energy', etype:'solar',  name:'광명역 태양광 발전소',       type:'태양광', lat:37.4218, lng:126.8648, value:543.4, unit:'kWh', status:'ok',   sync:'2026-05-26 15:05', addr:'경기도 광명시 일직동 346' },
    { id:'e2', tab:'energy', etype:'public', name:'광명동 공공시설 에너지 사용', type:'공공시설',lat:37.4618, lng:126.8632, value:412.8, unit:'kWh', status:'ok',   sync:'2026-05-26 15:05', addr:'경기도 광명시 광명동 145' },
    { id:'e3', tab:'energy', etype:'elec',   name:'철산동 전력 계량 지점',       type:'전력',   lat:37.4748, lng:126.8812, value:890.2, unit:'kWh', status:'warn', sync:'2026-05-26 14:50', addr:'경기도 광명시 철산동 102' },
    { id:'e4', tab:'energy', etype:'bldg',   name:'소하동 건물 에너지 사용',     type:'건물',   lat:37.4408, lng:126.8798, value:320.5, unit:'kWh', status:'ok',   sync:'2026-05-26 15:00', addr:'경기도 광명시 소하동 620' },
    { id:'e5', tab:'energy', etype:'solar',  name:'하안동 태양광 패널',          type:'태양광', lat:37.4545, lng:126.8732, value:186.3, unit:'kWh', status:'ok',   sync:'2026-05-26 14:58', addr:'경기도 광명시 하안동 150' },
    { id:'e6', tab:'energy', etype:'elec',   name:'일직동 에너지 허브',          type:'전력',   lat:37.4375, lng:126.8782, value:672.1, unit:'kWh', status:'ok',   sync:'2026-05-26 15:02', addr:'경기도 광명시 일직동 400' }
  ];

  /* 히트맵용 가중치 포인트 (lat, lng, weight 0~1) */
  var CARBON_HEAT_PTS = [
    {lat:37.4218,lng:126.8648,w:0.95}, {lat:37.4742,lng:126.8822,w:0.62},
    {lat:37.4392,lng:126.8755,w:0.78}, {lat:37.4552,lng:126.8692,w:0.45},
    {lat:37.4518,lng:126.8748,w:0.88}, {lat:37.4265,lng:126.8598,w:0.55},
    {lat:37.4450,lng:126.8700,w:0.70}, {lat:37.4620,lng:126.8760,w:0.80},
    {lat:37.4330,lng:126.8650,w:0.65}, {lat:37.4680,lng:126.8680,w:0.72}
  ];

  var ENERGY_HEAT_PTS = [
    {lat:37.4218,lng:126.8648,w:0.90}, {lat:37.4618,lng:126.8632,w:0.75},
    {lat:37.4748,lng:126.8812,w:1.00}, {lat:37.4408,lng:126.8798,w:0.60},
    {lat:37.4545,lng:126.8732,w:0.68}, {lat:37.4375,lng:126.8782,w:0.82},
    {lat:37.4480,lng:126.8720,w:0.55}, {lat:37.4700,lng:126.8750,w:0.78},
    {lat:37.4300,lng:126.8660,w:0.50}, {lat:37.4580,lng:126.8590,w:0.64}
  ];

  /* 히트맵 색상 팔레트 */
  var HEAT_PALETTE = {
    carbon: [
      { stop: 0.0, r:200, g:230, b:200 },
      { stop: 0.4, r:254, g:202, b:128 },
      { stop: 0.7, r:239, g:124, b: 73 },
      { stop: 1.0, r:215, g: 32, b: 39 }
    ],
    energy: [
      { stop: 0.0, r:255, g:249, b:196 },
      { stop: 0.4, r:255, g:177, b: 20 },
      { stop: 0.7, r:224, g: 72, b: 61 },
      { stop: 1.0, r:160, g: 20, b: 10 }
    ]
  };

  var CARBON_LAYERS = [
    { key:'renew',     label:'신재생에너지 지점',  count:'38개',  color:'#0C8AE5' },
    { key:'building',  label:'건물 절감 사업',     count:'124개', color:'#1AAA5E' },
    { key:'transport', label:'교통 효율화 거점',   count:'52개',  color:'#ED8B16' },
    { key:'citizen',   label:'시민참여 활동',      count:'89개',  color:'#6E74D6' }
  ];

  var ENERGY_LAYERS = [
    { key:'elec',   label:'전력 계량 지점',    count:'281개', color:'#0C8AE5' },
    { key:'solar',  label:'태양광 발전 지점',  count:'38개',  color:'#FFB114' },
    { key:'public', label:'공공시설 에너지',   count:'62개',  color:'#1AAA5E' },
    { key:'bldg',   label:'건물 에너지 사용',  count:'143개', color:'#6E74D6' }
  ];

  /* ── 차트 목업 데이터 ── */
  var CHART_DATA = {
    carbon: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[13850,14200,13650,14800,15400], color:'#E0483D', unit:'tCO₂eq' },
      donut: { total:15400, unit:'tCO₂eq', segments:[
        { label:'건물',   value:38, color:'#E0483D' },
        { label:'교통',   value:32, color:'#ED8B16' },
        { label:'산업',   value:18, color:'#6E74D6' },
        { label:'공공',   value:12, color:'#0C8AE5' }
      ]},
      bar:   { labels:['1월','2월','3월','4월','5월'], values:[13850,14200,13650,14800,15400], color:'#E0483D', unit:'tCO₂eq' }
    },
    energy: {
      line:  { labels:['2026.01','2026.02','2026.03','2026.04','2026.05'], values:[100,180,260,360,432], color:'#0C8AE5', unit:'MWh' },
      donut: { total:543.4, unit:'kWh', segments:[
        { label:'전력',    value:65, color:'#0C8AE5' },
        { label:'태양광',  value:20, color:'#FFB114' },
        { label:'공공시설',value:10, color:'#1AAA5E' },
        { label:'건물',    value: 5, color:'#6E74D6' }
      ]},
      bar:   {
        labels:['광명역\n태양광','공공시설\n태양광','철산동\n전력권역','소하동\n공시설','일직동\n공시설'],
        values2d: [
          { label:'발전량', values:[28,22,0,0,18],   color:'#1AAA5E' },
          { label:'사용량', values:[24,18,38,20,16],  color:'#0C8AE5' }
        ],
        unit:'MWh'
      }
    }
  };

  /* ── KPI 기준값 ── */
  var KPI_BASE = {
    carbon: [
      { num:15400, unit:'tCO₂eq', dec:0, scalable:true  },
      { prefix:'+', num:4.2, unit:'%', dec:1, scalable:false, color:'var(--status-danger)' },
      { num:24.8,  unit:'%',      dec:1, scalable:false },
      { text:'정상', color:'var(--status-success)' },
      { num:2,     unit:'곳',     dec:0, scalable:false },
      { text:'15:07', color:'var(--fg-1)' }
    ],
    energy: [
      { num:543.4,  unit:'kWh',  dec:1, scalable:true  },
      { num:323.8,  unit:'MWh',  dec:1, scalable:true  },
      { num:38,     unit:'소',   dec:0, scalable:false },
      { num:11.08,  unit:'kWh',  dec:2, scalable:true  },
      { text:'정상', color:'var(--status-success)' },
      { prefix:'+', num:12.3, unit:'%', dec:1, scalable:false, color:'var(--gp-primary)' }
    ]
  };

  var REGION_SCALE = { all:1.00, cheolsan:0.62, haan:0.48, soha:0.36, iljik:0.54, area:1.00 };

  /* ── 상태 ── */
  var activeTab    = 'carbon';
  var ceMap              = null;
  var heatCanvas         = null;
  var choroplethSvg      = null;
  var choroplethFillPaths = [];
  var PIN_Z_INDEX        = 1200;
  var LEGEND_STORAGE_KEY = 'gmsb:carbon-energy:legend-collapsed';
  var pinLayer           = null;
  var markerRefs         = [];
  var legendCollapsed    = false;
  var boundaryPolygon    = null;

  var _ceFilter = {
    carbon: { region:'all', periodScale:1.0 },
    energy: { region:'all', periodScale:1.0 }
  };

  /* ── 캘린더 상태 (탭별) ── */
  var _cal = {
    carbon: { viewYear:2026, viewMonth:0, selStart:new Date(2026,0,1), selEnd:new Date(2026,4,31), hovDate:null, step:0 },
    energy: { viewYear:2026, viewMonth:0, selStart:new Date(2026,0,1), selEnd:new Date(2026,4,31), hovDate:null, step:0 }
  };
  var _CAL_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var _CAL_DAYS   = ['일','월','화','수','목','금','토'];

  /* ════════════════════════════════════════════════════════
     부트
  ════════════════════════════════════════════════════════ */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryBoot);
    } else { tryBoot(); }
  }

  function tryBoot() {
    if (typeof kakao === 'undefined' || !kakao.maps) { setTimeout(tryBoot, 100); return; }
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) {
      document.addEventListener('gmsb:shell-ready', boot, { once: true });
    } else { boot(); }
  }

  function boot() {
    loadLegendState();
    initMap();
    initMapBoundsLock();
    initTabs();
    initFilters();
    initSearch();
    initMapControls();
    initPopup();
    initDistrictDrawer();
    initDatePicker('carbon');
    initDatePicker('energy');
    renderLayerList('carbon');
    renderLayerList('energy');
    applyMarkers('carbon');
    renderLegend('carbon');
    refreshDisplay('carbon');
    initDongTable();
    initChartDownloadBtns();
    initDrawerCsvBtn();
    if (window.lucide) lucide.createIcons();
  }

  /* ════════════════════════════════════════════════════════
     지도
  ════════════════════════════════════════════════════════ */
  function initMap() {
    var container = document.getElementById('ceMap');
    ceMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.444, 126.865),
      level: 7
    });
    ceMap.setMinLevel(1);
    ceMap.setMaxLevel(7);
    addHeatmapCanvas();
    loadChoroplethMap();
    ensurePinLayer();
  }

  function initMapBoundsLock() {
    var PAD = 0.03;
    var LAT_MIN = GM_BOUNDS.south - PAD, LAT_MAX = GM_BOUNDS.north + PAD;
    var LNG_MIN = GM_BOUNDS.west  - PAD, LNG_MAX = GM_BOUNDS.east  + PAD;
    var _guard = false;
    kakao.maps.event.addListener(ceMap, 'idle', function () {
      if (_guard) return;
      var c = ceMap.getCenter();
      var lat = Math.max(LAT_MIN, Math.min(LAT_MAX, c.getLat()));
      var lng = Math.max(LNG_MIN, Math.min(LNG_MAX, c.getLng()));
      if (Math.abs(lat - c.getLat()) > 0.0001 || Math.abs(lng - c.getLng()) > 0.0001) {
        _guard = true;
        ceMap.setCenter(new kakao.maps.LatLng(lat, lng));
        setTimeout(function () { _guard = false; }, 300);
      }
    });
  }

  function addHeatmapCanvas() {
    var mapEl = document.getElementById('ceMap');
    heatCanvas = document.createElement('canvas');
    heatCanvas.id = 'ceHeatmapCanvas';
    heatCanvas.style.display = 'none'; /* 기본: carbon 탭은 choropleth SVG 사용 */
    mapEl.appendChild(heatCanvas);
  }

  function loadChoroplethMap() {
    /* fetch() 대신 인라인 SVG DOM 직접 참조 (file:// 환경 CORS 우회) */
    var srcEl = document.getElementById('ceSectionSvg');
    if (!srcEl) return;
    var svgEl = srcEl.cloneNode(true);
    svgEl.removeAttribute('id');
    svgEl.removeAttribute('aria-hidden');
    /* <style> 제거 — 전역 CSS 오염 방지 */
    var styleEl = svgEl.querySelector('style');
    if (styleEl) styleEl.parentNode.removeChild(styleEl);
    /* 각 path 처리 */
    var dongIndex = 0;
    choroplethFillPaths = [];
    svgEl.querySelectorAll('path').forEach(function(el) {
      var cls = el.getAttribute('class') || '';
      if (cls === 'cls-7') {
        /* 외곽 경계선: 파란 경계선으로 표시 */
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', '#006FEF');
        el.setAttribute('stroke-width', '2.5');
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('stroke-linejoin', 'round');
      } else {
        /* 행정동 면: 데모 데이터 기반 색상 적용 */
        var d = DONG_DEMO_DATA[dongIndex] || { name:'', value: 0 };
        el.setAttribute('id', 'ce-dong-' + dongIndex);
        el.setAttribute('fill', tco2ToColor(d.value));
        el.setAttribute('data-name', d.name);
        el.setAttribute('data-value', String(d.value));
        /* 호버/클릭 인터랙션 — IIFE로 d 캡처 */
        (function(pathEl, dongData) {
          pathEl.style.pointerEvents = 'auto';
          pathEl.style.cursor = 'pointer';
          pathEl.addEventListener('mouseenter', function(e) {
            this.setAttribute('stroke', '#16243B');
            this.setAttribute('stroke-width', '1.5');
            this.setAttribute('stroke-opacity', '0.65');
            showDongTip(e, dongData.name, dongData.value);
          });
          pathEl.addEventListener('mousemove', function(e) {
            showDongTip(e, dongData.name, dongData.value);
          });
          pathEl.addEventListener('mouseleave', function() {
            this.removeAttribute('stroke');
            this.removeAttribute('stroke-width');
            this.removeAttribute('stroke-opacity');
            hideDongTip();
          });
          pathEl.addEventListener('click', function() {
            hideDongTip();
            openDistrictPopup(this);
          });
        })(el, d);
        choroplethFillPaths.push(el);
        dongIndex++;
      }
      el.removeAttribute('class');
    });
    svgEl.style.cssText = 'position:absolute;pointer-events:none;opacity:0.82;z-index:1;';
    svgEl.removeAttribute('width');
    svgEl.removeAttribute('height');
    var mapEl = document.getElementById('ceMap');
    mapEl.appendChild(svgEl);
    choroplethSvg = svgEl;
    positionChoroplethSvg();
    kakao.maps.event.addListener(ceMap, 'tilesloaded', function() {
      positionChoroplethSvg();
      positionPinLayer();
    });
  }

  /* 외부에서 실제 데이터로 choropleth 갱신할 때 호출 */
  function updateChoropleth(dongDataArray) {
    choroplethFillPaths.forEach(function(el, i) {
      var d = dongDataArray[i];
      if (!d) return;
      el.setAttribute('fill', tco2ToColor(d.value));
      el.setAttribute('data-name', d.name);
      el.setAttribute('data-value', String(d.value));
    });
  }

  function positionChoroplethSvg() {
    if (!choroplethSvg || !ceMap) return;
    var proj = ceMap.getProjection();
    var nw = proj.containerPointFromCoords(new kakao.maps.LatLng(GM_BOUNDS.north, GM_BOUNDS.west));
    var se = proj.containerPointFromCoords(new kakao.maps.LatLng(GM_BOUNDS.south, GM_BOUNDS.east));
    choroplethSvg.style.left   = nw.x + 'px';
    choroplethSvg.style.top    = nw.y + 'px';
    choroplethSvg.style.width  = (se.x - nw.x) + 'px';
    choroplethSvg.style.height = (se.y - nw.y) + 'px';
  }

  function ensurePinLayer() {
    if (pinLayer) return;
    var mapEl = document.getElementById('ceMap');
    pinLayer = document.createElement('div');
    pinLayer.id = 'cePinLayer';
    pinLayer.style.cssText = 'position:absolute;inset:0;z-index:' + PIN_Z_INDEX + ';pointer-events:none;';
    mapEl.appendChild(pinLayer);
  }

  function positionPinLayer() {
    if (!pinLayer || !ceMap) return;
    var proj = ceMap.getProjection();
    markerRefs.forEach(function(ref) {
      var pt = proj.containerPointFromCoords(ref.latLng);
      ref.el.style.left = pt.x + 'px';
      ref.el.style.top  = pt.y + 'px';
    });
  }

  function renderLegend(tab) {
    var el = document.getElementById('ceLegend');
    if (!el) return;
    el.classList.toggle('map-legend--collapsed', legendCollapsed);
    var head = '<div class="ce-legend-head">'
      + '<span class="ce-legend-head__title">범례</span>'
      + '<button class="ce-legend-toggle" id="ceLegendToggle" type="button" aria-label="' + (legendCollapsed ? '범례 펼치기' : '범례 접기') + '" title="' + (legendCollapsed ? '범례 펼치기' : '범례 접기') + '">'
      + '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>'
      + '</button></div>';
    var body = '';
    if (tab === 'carbon') {
      el.classList.add('map-legend--choropleth');
      body = '<p class="map-legend__title">탄소배출량 (tCO₂eq)</p><div class="ce-legend-steps">';
      CE_CHOROPLETH_LEGEND.forEach(function(item) {
        body += '<div class="ce-legend-step">'
          + '<span class="ce-legend-step__swatch" style="background:' + item.color + '"></span>'
          + '<span class="ce-legend-step__label">' + item.range + '</span>'
          + '</div>';
      });
      body += '</div><p class="ce-legend-unit">단위 : tonCO₂eq</p>'
        + '<div class="ce-legend-divider"></div>'
        + '<p class="map-legend__title">저감 사업·시설 지점</p>'
        + '<div class="ce-pin-legend">';
      CARBON_LAYERS.forEach(function(item) {
        body += '<div class="ce-pin-legend__item">'
          + '<span class="ce-pin-legend__pin" style="--pin-color:' + item.color + '"></span>'
          + '<span>' + item.label + '</span>'
          + '</div>';
      });
      body += '</div>';
    } else {
      el.classList.remove('map-legend--choropleth');
      body = '<p class="map-legend__title">에너지 사용 수준 (kWh)</p>'
        + '<div class="ce-legend-gradient">'
        + '<span class="ce-legend-low">낮음</span>'
        + '<div class="ce-legend-bar ce-legend-bar--energy"></div>'
        + '<span class="ce-legend-high">매우 높음</span>'
        + '</div>';
    }
    el.innerHTML = head + '<div class="ce-legend-body">' + body + '</div>';
    bindLegendToggle();
  }

  function loadLegendState() {
    try {
      legendCollapsed = localStorage.getItem(LEGEND_STORAGE_KEY) === '1';
    } catch (e) {
      legendCollapsed = false;
    }
  }

  function saveLegendState() {
    try {
      localStorage.setItem(LEGEND_STORAGE_KEY, legendCollapsed ? '1' : '0');
    } catch (e) {}
  }

  function bindLegendToggle() {
    var btn = document.getElementById('ceLegendToggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      legendCollapsed = !legendCollapsed;
      saveLegendState();
      renderLegend(activeTab);
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
        if (boundaryPolygon) boundaryPolygon.setMap(null);
        boundaryPolygon = new kakao.maps.Polygon({
          map: ceMap, path: coords,
          strokeWeight:2, strokeColor:'#006FEF', strokeOpacity:1.0,
          fillColor:'#006FEF', fillOpacity:0.07
        });
      }).catch(function(){});
  }

  /* ════════════════════════════════════════════════════════
     히트맵 (Canvas)
  ════════════════════════════════════════════════════════ */
  function renderHeatmap(tab) {
    if (!heatCanvas || !ceMap) return;
    var pts    = tab === 'carbon' ? CARBON_HEAT_PTS : ENERGY_HEAT_PTS;
    var palette = HEAT_PALETTE[tab];
    var proj   = ceMap.getProjection();
    var mapEl  = document.getElementById('ceMap');
    var W      = mapEl.offsetWidth;
    var H      = mapEl.offsetHeight;
    heatCanvas.width  = W;
    heatCanvas.height = H;
    var ctx = heatCanvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    var RADIUS = Math.max(W, H) * 0.18;

    pts.forEach(function(p) {
      var screenPt = proj.containerPointFromCoords(new kakao.maps.LatLng(p.lat, p.lng));
      var x = screenPt.x, y = screenPt.y;
      var grad = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);

      /* 팔레트 컬러 → 중심(high) 에서 외곽(low)으로 */
      var hi = palette[palette.length - 1];
      var lo = palette[0];
      grad.addColorStop(0,   'rgba(' + hi.r + ',' + hi.g + ',' + hi.b + ',' + (p.w * 0.75) + ')');
      grad.addColorStop(0.5, 'rgba(' + palette[Math.floor(palette.length/2)].r + ',' + palette[Math.floor(palette.length/2)].g + ',' + palette[Math.floor(palette.length/2)].b + ',' + (p.w * 0.4) + ')');
      grad.addColorStop(1,   'rgba(' + lo.r + ',' + lo.g + ',' + lo.b + ',0)');

      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    /* 범례 바 색상 업데이트 */
    var legBar = document.querySelector('.ce-legend-bar');
    if (legBar) {
      legBar.className = 'ce-legend-bar' + (tab === 'energy' ? ' ce-legend-bar--energy' : '');
    }
    var legTitle = document.querySelector('.map-legend .map-legend__title');
    if (legTitle) {
      legTitle.textContent = tab === 'carbon' ? '배출 수준 (tCO₂eq)' : '에너지 사용 수준 (kWh)';
    }
  }

  /* 지도 이동/줌 시 히트맵 재렌더 */
  function bindHeatmapEvents() {
    kakao.maps.event.addListener(ceMap, 'zoom_changed', function() {
      if (activeTab === 'energy') renderHeatmap('energy');
      else positionChoroplethSvg();
      positionPinLayer();
    });
    kakao.maps.event.addListener(ceMap, 'center_changed', function() {
      if (activeTab === 'energy') renderHeatmap('energy');
      else positionChoroplethSvg();
      positionPinLayer();
    });
  }

  /* ════════════════════════════════════════════════════════
     마커
  ════════════════════════════════════════════════════════ */
  var SECTOR_COLORS = { renew:'#0C8AE5', building:'#1AAA5E', transport:'#ED8B16', citizen:'#6E74D6' };
  var ETYPE_COLORS  = { elec:'#0C8AE5', solar:'#FFB114', public:'#1AAA5E', bldg:'#6E74D6', etc:'#AEB7C2' };
  var SECTOR_TO_MILE = { renew:'energy', building:'mobility', transport:'safety', citizen:'data' };
  var ETYPE_TO_MILE  = { elec:'energy', solar:'energy', public:'mobility', bldg:'data', etc:'data' };

  function buildPinEl(pin) {
    var base = window.GMSB_BASE || '../';
    var mile = pin.tab === 'carbon' ? (SECTOR_TO_MILE[pin.sector] || 'energy') : (ETYPE_TO_MILE[pin.etype] || 'energy');
    var el = document.createElement('div');
    el.style.cssText = 'position:absolute;z-index:' + PIN_Z_INDEX + ';width:50px;height:60px;margin-left:-25px;margin-top:-50px;cursor:pointer;pointer-events:auto;transition:transform .15s;';
    var img = document.createElement('img');
    img.src = base + 'assets/img/pin-' + mile + '.svg';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.25));pointer-events:none;';
    el.appendChild(img);
    if (pin.status === 'warn' || pin.status === 'danger') {
      var dot = document.createElement('span');
      dot.style.cssText = 'position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:' + (pin.status === 'danger' ? '#E0483D' : '#ED8B16') + ';border:2px solid #fff;pointer-events:none;';
      el.appendChild(dot);
    }
    el.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.12) translateY(-3px)'; });
    el.addEventListener('mouseleave', function() { this.style.transform = ''; });
    return el;
  }

  function applyMarkers(tab) {
    ensurePinLayer();
    markerRefs.forEach(function(ref){
      if (ref.el && ref.el.parentNode) ref.el.parentNode.removeChild(ref.el);
      if (ref.overlay) ref.overlay.setMap(null);
    });
    markerRefs = [];
    var pins = tab === 'carbon' ? CARBON_PINS : ENERGY_PINS;
    pins.forEach(function(pin) {
      var el = buildPinEl(pin);
      el.addEventListener('click', function(){ openPopup(pin); });
      pinLayer.appendChild(el);
      markerRefs.push({ pin: pin, el: el, latLng: new kakao.maps.LatLng(pin.lat, pin.lng) });
    });
    positionPinLayer();
    applyLayerVisibility(tab);
  }

  /* ════════════════════════════════════════════════════════
     탭 전환
  ════════════════════════════════════════════════════════ */
  var TAB_META = {
    carbon: { label: '탄소배출·저감 현황', desc: '광명시의 탄소배출·저감 데이터를 공간 정보와 함께 조회하여 지역별 현황, 저감 성과, 주요 지표 변화를 확인합니다.' },
    energy: { label: '에너지 현황',       desc: '광명시의 에너지 사용 현황을 공간 정보와 함께 조회합니다.' }
  };

  function initTabs() {
    if (window.gmsbSetTab) gmsbSetTab(TAB_META.carbon.label, TAB_META.carbon.desc);
    document.querySelectorAll('.page-tab').forEach(function(btn) {
      btn.addEventListener('click', function() { setActiveTab(this.dataset.tab); });
    });
  }

  function setActiveTab(tab) {
    if (TAB_META[tab] && window.gmsbSetTab) gmsbSetTab(TAB_META[tab].label, TAB_META[tab].desc);
    activeTab = tab;
    document.querySelectorAll('.page-tab').forEach(function(btn) {
      btn.classList.toggle('on', btn.dataset.tab === tab);
    });
    document.getElementById('filterCarbon').style.display = tab === 'carbon' ? 'block' : 'none';
    document.getElementById('filterEnergy').style.display = tab === 'energy'  ? 'block' : 'none';
    document.getElementById('ceFilterTitle').textContent  = tab === 'carbon' ? '탄소배출 분포 · 저감 사업 지점' : '에너지 사용 공간 데이터';
    document.getElementById('detailCarbon').style.display = tab === 'carbon' ? 'block' : 'none';
    document.getElementById('detailEnergy').style.display = tab === 'energy'  ? 'block' : 'none';
    var cTbl = document.getElementById('ceDongTblCarbon');
    var eTbl = document.getElementById('ceDongTblEnergy');
    if (cTbl) cTbl.style.display = tab === 'carbon' ? '' : 'none';
    if (eTbl) eTbl.style.display = tab === 'energy' ? '' : 'none';
    if (choroplethSvg) choroplethSvg.style.display = tab === 'carbon' ? '' : 'none';
    if (heatCanvas)    heatCanvas.style.display    = tab === 'energy'  ? '' : 'none';
    applyMarkers(tab);
    if (tab === 'energy') { renderHeatmap('energy'); }
    else { positionChoroplethSvg(); }
    renderLegend(tab);
    setTimeout(function() { refreshDisplay(tab); }, 40);
  }

  /* ════════════════════════════════════════════════════════
     레이어 리스트
  ════════════════════════════════════════════════════════ */
  function renderLayerList(tab) {
    var layers = tab === 'carbon' ? CARBON_LAYERS : ENERGY_LAYERS;
    var el = document.getElementById(tab === 'carbon' ? 'carbonLayerList' : 'energyLayerList');
    if (!el) return;
    var title = tab === 'carbon' ? document.getElementById('ceFilterTitle') : null;
    if (tab === 'carbon' && title) title.textContent = '탄소배출 분포 · 저감 사업 지점';
    el.innerHTML = layers.map(function(l) {
      return '<label class="layer-item">'
        + '<input type="checkbox" checked data-layer="' + l.key + '">'
        + '<span class="layer-item__dot" style="background:' + l.color + '"></span>'
        + '<span class="layer-item__label">' + l.label + '</span>'
        + (l.count ? '<span class="layer-item__count">' + l.count + '</span>' : '')
        + '</label>';
    }).join('');
    el.querySelectorAll('input[type="checkbox"]').forEach(function(input) {
      input.addEventListener('change', function() { applyLayerVisibility(tab); });
    });
  }

  function getCheckedLayerKeys(tab) {
    var el = document.getElementById(tab === 'carbon' ? 'carbonLayerList' : 'energyLayerList');
    if (!el) return null;
    return Array.prototype.slice.call(el.querySelectorAll('input[type="checkbox"]:checked')).map(function(input) {
      return input.getAttribute('data-layer');
    });
  }

  function applyLayerVisibility(tab) {
    var checked = getCheckedLayerKeys(tab);
    if (!checked) return;
    var energyTypeEl = document.getElementById('energyType');
    var energyType = energyTypeEl ? energyTypeEl.value : 'all';
    markerRefs.forEach(function(ref) {
      var key = tab === 'carbon' ? ref.pin.sector : ref.pin.etype;
      var show = checked.indexOf(key) > -1;
      if (tab === 'energy' && energyType !== 'all') show = show && key === energyType;
      ref.el.style.display = show ? '' : 'none';
    });
  }

  /* ════════════════════════════════════════════════════════
     필터 (지역 드롭다운 + 에너지 유형/연도)
  ════════════════════════════════════════════════════════ */
  function initFilters() {
    ['ceRegionSelect', 'enRegionSelect'].forEach(function(id, i) {
      var tab = i === 0 ? 'carbon' : 'energy';
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function() {
        _ceFilter[tab].region = this.value;
        refreshDisplay(tab);
      });
    });

    /* 에너지 탭 전용 필터 */
    ['energyYear', 'energyType', 'energyDong'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function() {
        refreshDisplay('energy');
        if (id === 'energyType') applyEnergyTypeFilter(this.value);
      });
    });
  }

  function applyEnergyTypeFilter(type) {
    /* 에너지 유형 필터: 해당 etype 마커만 표시 */
    applyLayerVisibility('energy');
  }

  /* ════════════════════════════════════════════════════════
     검색
  ════════════════════════════════════════════════════════ */
  function initSearch() {
    var input    = document.getElementById('ceSearchInput');
    var dropdown = document.getElementById('ceSearchDropdown');
    if (!input) return;
    var allPins = CARBON_PINS.concat(ENERGY_PINS);
    input.addEventListener('input', function() {
      var q = this.value.trim();
      if (q.length < 2) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
      var results = allPins.filter(function(p) { return p.name.indexOf(q) > -1 || p.type.indexOf(q) > -1; });
      if (!results.length) { dropdown.classList.remove('open'); return; }
      dropdown.innerHTML = results.slice(0,8).map(function(p) {
        var col = p.tab === 'carbon' ? (SECTOR_COLORS[p.sector]||'#044E9E') : (ETYPE_COLORS[p.etype]||'#044E9E');
        return '<div class="search-item" data-id="' + p.id + '">'
          + '<span class="search-item__dot" style="background:' + col + '"></span>'
          + p.name + '</div>';
      }).join('');
      dropdown.classList.add('open');
      dropdown.querySelectorAll('.search-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var found = allPins.find(function(p){ return p.id === item.dataset.id; });
          if (!found) return;
          input.value = found.name;
          dropdown.classList.remove('open');
          if (found.tab !== activeTab) setActiveTab(found.tab);
          ceMap.setCenter(new kakao.maps.LatLng(found.lat, found.lng));
          ceMap.setLevel(4);
          setTimeout(function(){ openPopup(found); }, 300);
        });
      });
    });
    document.addEventListener('click', function(e) {
      if (!input.closest('.gis-search').contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     지도 컨트롤
  ════════════════════════════════════════════════════════ */
  function initMapControls() {
    document.getElementById('ceBtnZoomIn').addEventListener('click', function() { ceMap.setLevel(ceMap.getLevel() - 1); });
    document.getElementById('ceBtnZoomOut').addEventListener('click', function() { ceMap.setLevel(ceMap.getLevel() + 1); });
    document.getElementById('ceBtnFitAll').addEventListener('click', function() {
      ceMap.setBounds(new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(GM_BOUNDS.south, GM_BOUNDS.west),
        new kakao.maps.LatLng(GM_BOUNDS.north, GM_BOUNDS.east)
      ), 30, 30, 30, 30);
    });
    document.getElementById('ceBtnCenter').addEventListener('click', function() {
      ceMap.setCenter(new kakao.maps.LatLng(37.444, 126.865));
      ceMap.setLevel(7);
    });
    document.getElementById('ceBtnExport').addEventListener('click', function() { alert('지도 내보내기 기능은 준비 중입니다.'); });
    bindHeatmapEvents();
  }

  /* ════════════════════════════════════════════════════════
     팝업
  ════════════════════════════════════════════════════════ */
  function initPopup() {
    document.getElementById('cePopupClose').addEventListener('click', closePopup);
    document.getElementById('cePopupScrim').addEventListener('click', closePopup);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closePopup(); closeDistrictDrawer(); } });
  }

  function openPopup(pin) {
    var isCarbon = pin.tab === 'carbon';
    var color    = isCarbon ? (SECTOR_COLORS[pin.sector]||'#044E9E') : (ETYPE_COLORS[pin.etype]||'#044E9E');
    var badge    = document.getElementById('cePopupBadge');
    var mile = isCarbon ? (SECTOR_TO_MILE[pin.sector] || 'energy') : (ETYPE_TO_MILE[pin.etype] || 'energy');
    badge.innerHTML = '<img src="' + (window.GMSB_BASE||'../') + 'assets/img/mile-' + mile + '.svg" style="width:38px;height:38px;display:block;" alt="">';
    document.getElementById('cePopupTitle').textContent  = pin.name;
    document.getElementById('cePopupType').textContent   = isCarbon ? pin.type + ' · 저감 사업·시설 지점' : pin.type + ' · 에너지 계측 지점';
    document.getElementById('cePopupMetric').style.display = '';
    document.getElementById('cePopupMetricLabel').textContent = isCarbon ? '저감 기여량' : '오늘 사용량';
    document.getElementById('cePopupMetricValue').innerHTML = pin.value + '<span>' + pin.unit + '</span>';
    document.getElementById('cePopupMetricDesc').textContent = isCarbon
      ? (pin.summary || '저감 사업 운영 데이터를 기반으로 산정한 기여량입니다.')
      : '실시간 계측 데이터를 기준으로 집계한 에너지 사용량입니다.';
    document.getElementById('cePopupMetric').style.borderColor = color;
    document.getElementById('cePopupMetric').style.borderLeftColor = color;
    document.getElementById('cePopupMetricValue').style.color = color;
    document.getElementById('cePopupAddrLb').textContent = '주소';
    document.getElementById('cePopupAddr').textContent   = pin.addr;
    document.getElementById('cePopupDongRow').style.display = isCarbon ? '' : 'none';
    document.getElementById('cePopupDong').textContent = pin.dong || '-';
    document.getElementById('cePopupVal1Lb').textContent = isCarbon ? '저감 기여량 (tCO₂eq)' : '오늘 사용량';
    document.getElementById('cePopupVal1').textContent   = pin.value + ' ' + pin.unit;
    document.getElementById('cePopupVal2Lb').textContent = '상태';
    var statusMap   = { ok:'정상', warn:'주의', danger:'위험' };
    var statusColor = { ok:'var(--status-success)', warn:'var(--status-warning)', danger:'var(--status-danger)' };
    document.getElementById('cePopupVal2').innerHTML = '<span style="color:' + statusColor[pin.status] + ';font-weight:700;">● ' + statusMap[pin.status] + '</span>';
    document.getElementById('cePopupSync').textContent = pin.sync;
    document.getElementById('cePopupSourceRow').style.display = isCarbon ? '' : 'none';
    document.getElementById('cePopupSource').textContent = pin.source || '-';
    /* 팝업 버튼 교체 */
    var ft = document.getElementById('cePopupFt');
    if (isCarbon) {
      ft.innerHTML = '<button class="btn btn--line" type="button" onclick="cePage.closePopup()">상세 분석</button>'
        + '<button class="btn btn--line" type="button" onclick="cePage.closePopup()">주변 배출</button>'
        + '<button class="btn btn--pri" type="button" onclick="cePage.closePopup()">닫기</button>';
    } else {
      ft.innerHTML = '<button class="btn btn--line" type="button" onclick="cePage.closePopup()">상세 보기</button>'
        + '<button class="btn btn--line" type="button" onclick="cePage.closePopup()">데이터 보기</button>'
        + '<button class="btn btn--pri" type="button" onclick="cePage.closePopup()">경로 보기</button>';
    }
    document.getElementById('ceMapPopup').classList.add('open');
  }

  function closePopup() {
    document.getElementById('ceMapPopup').classList.remove('open');
  }

  /* ════════════════════════════════════════════════════════
     데이터 갱신
  ════════════════════════════════════════════════════════ */
  function _computeTotalScale(tab) {
    return REGION_SCALE[_ceFilter[tab].region] * _ceFilter[tab].periodScale;
  }

  function _updateKpiStrip(tab, scale) {
    var defs    = KPI_BASE[tab];
    var prefix  = tab === 'carbon' ? 'ckpi' : 'ekpi';
    defs.forEach(function(def, i) {
      var el = document.getElementById(prefix + i);
      if (!el) return;
      if (def.text !== undefined) { el.style.color = def.color || ''; el.innerHTML = def.text; return; }
      var val = def.scalable ? def.num * scale : def.num;
      val = def.dec > 0 ? Math.round(val * Math.pow(10, def.dec)) / Math.pow(10, def.dec) : Math.round(val);
      var numStr = val >= 1000 ? val.toLocaleString() : String(val);
      el.style.color = def.color || '';
      el.innerHTML = (def.prefix||'') + numStr + '<span class="u">' + def.unit + '</span>';
    });
  }

  function refreshDisplay(tab) {
    var scale = _computeTotalScale(tab);
    _updateKpiStrip(tab, scale);
    if (tab === 'carbon') {
      var cd = CHART_DATA.carbon;
      var scaledLine = { labels:cd.line.labels, values:cd.line.values.map(function(v){ return Math.round(v*scale*10)/10; }), color:cd.line.color, unit:cd.line.unit };
      var scaledDonut = { total:Math.round(cd.donut.total*scale*10)/10, unit:cd.donut.unit, segments:cd.donut.segments };
      var linePts  = drawLineChart('carbonLineChart',  'carbonLineXLabels',  scaledLine);
      drawDonutChart('carbonDonutChart',  'carbonDonutLegend',  scaledDonut);
      var barRects = drawBarChart('carbonBarChart',    'carbonBarXLabels',   { labels:cd.bar.labels, values:cd.bar.values, color:cd.bar.color, unit:cd.bar.unit });
      bindLineTooltip('carbonLineChart',  scaledLine,  linePts);
      bindBarTooltip('carbonBarChart',    cd.bar,      barRects);
      bindDonutTooltip('carbonDonutChart', scaledDonut);
    } else {
      var ed = CHART_DATA.energy;
      var scaledELine = { labels:ed.line.labels, values:ed.line.values.map(function(v){ return Math.round(v*scale*10)/10; }), color:ed.line.color, unit:ed.line.unit };
      var scaledEDonut = { total:Math.round(ed.donut.total*scale*10)/10, unit:ed.donut.unit, segments:ed.donut.segments };
      var eLinePts = drawLineChart('energyLineChart', 'energyLineXLabels', scaledELine);
      drawDonutChart('energyDonutChart',  'energyDonutLegend',  scaledEDonut);
      drawGroupedBarChart('energyBarChart', ed.bar, scale);
      bindLineTooltip('energyLineChart',   scaledELine, eLinePts);
      bindDonutTooltip('energyDonutChart', scaledEDonut);
    }
  }

  /* ════════════════════════════════════════════════════════
     캘린더
  ════════════════════════════════════════════════════════ */
  function _calFmt(d) {
    if (!d) return '';
    var p = function(n){ return String(n).padStart(2,'0'); };
    return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
  }

  function _calSame(a,b) {
    return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function _calRenderMonth(gridId, calState) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var y = calState.viewYear, m = calState.viewMonth;
    var today = new Date();
    var firstDow = new Date(y, m, 1).getDay();
    var daysInMonth = new Date(y, m+1, 0).getDate();
    var html = '<div class="cal-weekdays">';
    _CAL_DAYS.forEach(function(d){ html += '<span>' + d + '</span>'; });
    html += '</div><div class="cal-days">';
    for (var e = 0; e < firstDow; e++) html += '<div class="cal-day cal-day--empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(y, m, d);
      var cls = 'cal-day';
      var ts = date.getTime();
      var ss = calState.selStart ? calState.selStart.getTime() : null;
      var se = calState.selEnd   ? calState.selEnd.getTime()   : null;
      var hh = calState.hovDate  ? calState.hovDate.getTime()  : null;
      if (_calSame(date, today)) cls += ' cal-day--today';
      if (_calSame(date, calState.selStart)) cls += ' cal-day--start';
      else if (_calSame(date, calState.selEnd)) cls += ' cal-day--end';
      else if (ss && se && ts > ss && ts < se) cls += ' cal-day--range';
      else if (calState.step === 1 && ss && hh && ts > ss && ts < hh) cls += ' cal-day--hov-range';
      html += '<div class="' + cls + '" data-y="'+y+'" data-m="'+m+'" data-d="'+d+'">' + d + '</div>';
    }
    html += '</div>';
    grid.innerHTML = html;
    grid.querySelectorAll('.cal-day:not(.cal-day--empty)').forEach(function(el) {
      el.addEventListener('click', function(ev) {
        ev.stopPropagation();
        var date = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
        if (calState.step === 0) {
          calState.selStart = date; calState.selEnd = null; calState.hovDate = null; calState.step = 1;
        } else {
          if (date < calState.selStart) { calState.selEnd = calState.selStart; calState.selStart = date; }
          else { calState.selEnd = date; }
          calState.hovDate = null; calState.step = 0;
        }
        _calUpdateDayClasses(gridId, calState);
      });
      el.addEventListener('mousemove', function() {
        if (calState.step === 1) {
          var newHov = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
          if (!_calSame(newHov, calState.hovDate)) { calState.hovDate = newHov; _calUpdateDayClasses(gridId, calState); }
        }
      });
    });
    grid.addEventListener('mouseleave', function() {
      if (calState.step === 1 && calState.hovDate) { calState.hovDate = null; _calUpdateDayClasses(gridId, calState); }
    });
  }

  function _calUpdateDayClasses(gridId, calState) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var today = new Date();
    grid.querySelectorAll('.cal-day:not(.cal-day--empty)').forEach(function(el) {
      var date = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
      var cls = 'cal-day';
      var ts = date.getTime(), ss = calState.selStart ? calState.selStart.getTime() : null;
      var se = calState.selEnd ? calState.selEnd.getTime() : null, hh = calState.hovDate ? calState.hovDate.getTime() : null;
      if (_calSame(date, today)) cls += ' cal-day--today';
      if (_calSame(date, calState.selStart)) cls += ' cal-day--start';
      else if (_calSame(date, calState.selEnd)) cls += ' cal-day--end';
      else if (ss && se && ts > ss && ts < se) cls += ' cal-day--range';
      else if (calState.step === 1 && ss && hh && ts > ss && ts < hh) cls += ' cal-day--hov-range';
      el.className = cls;
    });
  }

  function _parseInputDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((str||'').trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2]-1, +m[3]);
    return isNaN(d) ? null : d;
  }

  function initDatePicker(tab) {
    var isCarbon = tab === 'carbon';
    var triggerId   = isCarbon ? 'ceDateRangeTrigger' : 'enDateRangeTrigger';
    var dropdownId  = isCarbon ? 'ceDatePickerDropdown' : 'enDatePickerDropdown';
    var fromInputId = isCarbon ? 'ceDateFromInput' : 'enDateFromInput';
    var toInputId   = isCarbon ? 'ceDateToInput'   : 'enDateToInput';
    var labelId     = isCarbon ? 'ceCalLabel' : 'enCalLabel';
    var gridId      = isCarbon ? 'ceCalGrid' : 'enCalGrid';
    var prevId      = isCarbon ? 'ceCalPrev' : 'enCalPrev';
    var nextId      = isCarbon ? 'ceCalNext' : 'enCalNext';
    var rangeId     = isCarbon ? 'ceCalRange' : 'enCalRange';
    var applyId     = isCarbon ? 'ceCalApply' : 'enCalApply';
    var cancelId    = isCarbon ? 'ceCalCancel' : 'enCalCancel';
    var calState    = _cal[tab];

    var trigger   = document.getElementById(triggerId);
    var dropdown  = document.getElementById(dropdownId);
    var fromInput = document.getElementById(fromInputId);
    var toInput   = document.getElementById(toInputId);
    if (!trigger || !dropdown) return;

    function updateDisplay() {
      if (fromInput) fromInput.value = _calFmt(calState.selStart) || '';
      if (toInput)   toInput.value   = _calFmt(calState.selEnd)   || '';
    }

    function applyPeriod() {
      var ms = calState.selStart && calState.selEnd ? calState.selEnd.getTime() - calState.selStart.getTime() : 0;
      var days = Math.max(1, Math.round(ms / 86400000) + 1);
      _ceFilter[tab].periodScale = Math.min(2.0, Math.max(0.05, days / 151));
      refreshDisplay(tab);
    }

    function render() {
      var lbl = document.getElementById(labelId);
      if (lbl) lbl.textContent = calState.viewYear + '년 ' + _CAL_MONTHS[calState.viewMonth];
      _calRenderMonth(gridId, calState);
      var rng = document.getElementById(rangeId);
      if (rng) rng.textContent = (calState.selStart && calState.selEnd)
        ? _calFmt(calState.selStart) + ' — ' + _calFmt(calState.selEnd)
        : (calState.selStart ? _calFmt(calState.selStart) + ' — 종료일 선택' : '시작일을 선택하세요');
    }

    updateDisplay();

    /* 직접 입력 처리 */
    if (fromInput) {
      fromInput.addEventListener('change', function() {
        var d = _parseInputDate(this.value);
        if (d) { calState.selStart = d; if (calState.selEnd && calState.selEnd < d) calState.selEnd = null; applyPeriod(); }
        else this.value = _calFmt(calState.selStart) || '';
      });
      fromInput.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    if (toInput) {
      toInput.addEventListener('change', function() {
        var d = _parseInputDate(this.value);
        if (d) { calState.selEnd = d; if (calState.selStart && d < calState.selStart) calState.selStart = null; applyPeriod(); }
        else this.value = _calFmt(calState.selEnd) || '';
      });
      toInput.addEventListener('click', function(e) { e.stopPropagation(); });
    }

    trigger.addEventListener('click', function(e) {
      if (e.target === fromInput || e.target === toInput) return;
      e.stopPropagation();
      var wasOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open');
      if (!wasOpen) render();
    });

    document.getElementById(prevId).addEventListener('click', function(e) {
      e.stopPropagation();
      calState.viewMonth--; if (calState.viewMonth < 0) { calState.viewMonth = 11; calState.viewYear--; }
      calState.hovDate = null; render();
    });
    document.getElementById(nextId).addEventListener('click', function(e) {
      e.stopPropagation();
      calState.viewMonth++; if (calState.viewMonth > 11) { calState.viewMonth = 0; calState.viewYear++; }
      calState.hovDate = null; render();
    });
    document.getElementById(applyId).addEventListener('click', function(e) {
      e.stopPropagation();
      updateDisplay();
      dropdown.classList.remove('open');
      applyPeriod();
    });
    document.getElementById(cancelId).addEventListener('click', function(e) {
      e.stopPropagation(); dropdown.classList.remove('open');
    });
    document.addEventListener('click', function(e) {
      if (!trigger.contains(e.target)) dropdown.classList.remove('open');
    });
  }

  /* ════════════════════════════════════════════════════════
     차트 렌더링
  ════════════════════════════════════════════════════════ */
  function setupCanvas(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    return { ctx:ctx, w:rect.width, h:rect.height, canvas:canvas };
  }

  function fmtY(v) { return v >= 1000 ? (v/1000).toFixed(1)+'k' : String(v); }

  function drawLineChart(canvasId, xlabelId, data) {
    var s = setupCanvas(canvasId); if (!s) return [];
    var ctx = s.ctx, W = s.w, H = s.h, unit = data.unit || '';
    var pad = {t:20,r:12,b:8,l:52}, aw = W-pad.l-pad.r, ah = H-pad.t-pad.b;
    var mx = Math.max.apply(null, data.values) * 1.15, n = data.values.length;
    ctx.clearRect(0,0,W,H);
    if (unit) { ctx.fillStyle='#B0BAC8'; ctx.font='9px sans-serif'; ctx.textAlign='right'; ctx.fillText('('+unit+')', pad.l-5, pad.t-6); }
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.25,.5,.75,1].forEach(function(t){
      var y=pad.t+ah*(1-t); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right'; ctx.fillText(fmtY(Math.round(mx*t)), pad.l-5, y+4);
    });
    var pts = data.values.map(function(v,i){ return {x:pad.l+(i/(n-1))*aw, y:pad.t+ah*(1-v/mx)}; });
    var grad = ctx.createLinearGradient(0,pad.t,0,pad.t+ah);
    grad.addColorStop(0,data.color+'30'); grad.addColorStop(1,data.color+'00');
    ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
    for(var i=1;i<pts.length;i++){var cp={x:(pts[i-1].x+pts[i].x)/2,y:(pts[i-1].y+pts[i].y)/2}; ctx.quadraticCurveTo(pts[i-1].x,pts[i-1].y,cp.x,cp.y);}
    ctx.quadraticCurveTo(pts[n-1].x,pts[n-1].y,pts[n-1].x,pts[n-1].y);
    ctx.lineTo(pts[n-1].x,pad.t+ah); ctx.lineTo(pts[0].x,pad.t+ah); ctx.closePath();
    ctx.fillStyle=grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
    for(var j=1;j<pts.length;j++){var cp2={x:(pts[j-1].x+pts[j].x)/2,y:(pts[j-1].y+pts[j].y)/2}; ctx.quadraticCurveTo(pts[j-1].x,pts[j-1].y,cp2.x,cp2.y);}
    ctx.quadraticCurveTo(pts[n-1].x,pts[n-1].y,pts[n-1].x,pts[n-1].y);
    ctx.strokeStyle=data.color; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
    pts.forEach(function(p){ ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); ctx.strokeStyle=data.color; ctx.lineWidth=2; ctx.stroke(); });
    var lbEl = document.getElementById(xlabelId);
    if (lbEl) lbEl.innerHTML = data.labels.map(function(l,i){return '<span style="left:'+(pad.l+(i/(n-1))*aw)+'px">'+l+'</span>';}).join('');
    return pts;
  }

  function drawBarChart(canvasId, xlabelId, data) {
    var s = setupCanvas(canvasId); if (!s) return [];
    var ctx=s.ctx, W=s.w, H=s.h, unit=data.unit||'';
    var pad={t:20,r:12,b:40,l:52}, aw=W-pad.l-pad.r, ah=H-pad.t-pad.b;
    var mx=Math.max.apply(null,data.values)*1.2, n=data.labels.length;
    var gap=aw/n, barW=Math.floor(gap*0.55);
    ctx.clearRect(0,0,W,H);
    if (unit) { ctx.fillStyle='#B0BAC8'; ctx.font='9px sans-serif'; ctx.textAlign='right'; ctx.fillText('('+unit+')', pad.l-5, pad.t-6); }
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.5,1].forEach(function(t){
      var y=pad.t+ah*(1-t); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right'; ctx.fillText(fmtY(Math.round(mx*t)), pad.l-5, y+4);
    });
    var bars=[];
    data.values.forEach(function(v,i){
      var x=pad.l+gap*i+(gap-barW)/2, bh=(v/mx)*ah, y=pad.t+ah-bh, r=Math.min(5,barW/2,bh/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y); ctx.quadraticCurveTo(x+barW,y,x+barW,y+r); ctx.lineTo(x+barW,y+bh); ctx.lineTo(x,y+bh); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
      ctx.fillStyle=data.color; ctx.fill();
      bars.push({x:x,y:y,w:barW,h:bh});
      ctx.fillStyle='#8A95A6'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      var lines=data.labels[i].split('\n');
      lines.forEach(function(ln,li){ ctx.fillText(ln, x+barW/2, pad.t+ah+14+(li*13)); });
    });
    return bars;
  }

  /* 에너지 탭 — 발전량/사용량 그룹 바 */
  function drawGroupedBarChart(canvasId, data, scale) {
    var s = setupCanvas(canvasId); if (!s) return;
    var ctx=s.ctx, W=s.w, H=s.h, unit=data.unit||'';
    var pad={t:20,r:12,b:40,l:52}, aw=W-pad.l-pad.r, ah=H-pad.t-pad.b;
    var allVals = data.values2d[0].values.concat(data.values2d[1].values);
    var mx = Math.max.apply(null, allVals) * scale * 1.2;
    var n = data.labels.length, grpW = aw/n;
    var barW = Math.floor(grpW * 0.35);
    ctx.clearRect(0,0,W,H);
    if (unit) { ctx.fillStyle='#B0BAC8'; ctx.font='9px sans-serif'; ctx.textAlign='right'; ctx.fillText('('+unit+')', pad.l-5, pad.t-6); }
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.5,1].forEach(function(t){
      var y=pad.t+ah*(1-t); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right'; ctx.fillText(fmtY(Math.round(mx*t)), pad.l-5, y+4);
    });
    data.values2d.forEach(function(series, si) {
      series.values.forEach(function(v, i) {
        var sv = v * scale;
        var grpX = pad.l + i * grpW;
        var x = grpX + (grpW - barW*2 - 3)/2 + si * (barW + 3);
        var bh = Math.max(0, (sv/mx)*ah), y = pad.t+ah-bh;
        var r = Math.min(4, barW/2, bh/2);
        ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y); ctx.quadraticCurveTo(x+barW,y,x+barW,y+r); ctx.lineTo(x+barW,y+bh); ctx.lineTo(x,y+bh); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
        ctx.fillStyle = series.color; ctx.fill();
        if (si === 0) {
          ctx.fillStyle='#8A95A6'; ctx.font='10px sans-serif'; ctx.textAlign='center';
          var lines = data.labels[i].split('\n');
          lines.forEach(function(ln,li){ ctx.fillText(ln, grpX+grpW/2, pad.t+ah+14+(li*13)); });
        }
      });
    });
  }

  function drawDonutChart(canvasId, legendId, data) {
    var canvas = document.getElementById(canvasId); if (!canvas) return;
    var dpr = window.devicePixelRatio || 1, size = 160;
    canvas.width = size*dpr; canvas.height = size*dpr;
    canvas.style.width = size+'px'; canvas.style.height = size+'px';
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    var cx=size/2, cy=size/2, r=size*0.44, inner=r*0.58;
    var total = data.segments.reduce(function(a,s){ return a+s.value; }, 0);
    var angle = -Math.PI/2;
    data.segments.forEach(function(seg) {
      var sweep = (seg.value/total)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+sweep); ctx.closePath();
      ctx.fillStyle=seg.color; ctx.fill();
      if (seg.value >= 8) {
        var mid=angle+sweep/2;
        ctx.save(); ctx.fillStyle='#fff'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(seg.value+'%', cx+r*0.70*Math.cos(mid), cy+r*0.70*Math.sin(mid)); ctx.restore();
      }
      angle += sweep;
    });
    ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    var legendEl = document.getElementById(legendId);
    if (legendEl) {
      legendEl.innerHTML = data.segments.map(function(seg) {
        var actualVal = data.total > 0 ? Math.round(data.total * seg.value / 100 * 10)/10 : 0;
        var actualStr = actualVal >= 1000 ? actualVal.toLocaleString() : String(actualVal);
        var valStr = data.total > 0 ? '(' + actualStr + ' ' + data.unit + ')' : '';
        return '<div class="donut-legend-item">'
          + '<span class="donut-legend-dot" style="background:' + seg.color + '"></span>'
          + '<span class="donut-legend-name">' + seg.label + '</span>'
          + '<span class="donut-legend-pct">' + seg.value + '%</span>'
          + (valStr ? '<span class="donut-legend-val">' + valStr + '</span>' : '')
          + '</div>';
      }).join('');
    }
  }

  /* ── 툴팁 ── */
  function _showTooltip(e, lbl, v, unit) {
    var tt  = document.getElementById('ceChartTooltip');
    var ttL = document.getElementById('ceTtLabel');
    var ttV = document.getElementById('ceTtValue');
    if (!tt) return;
    ttL.textContent = lbl;
    var numStr = (typeof v === 'number' && v >= 1000) ? v.toLocaleString() : String(v);
    ttV.innerHTML = numStr + (unit ? '<span class="tt-unit"> '+unit+'</span>' : '');
    tt.style.left = (e.clientX+14)+'px'; tt.style.top = (e.clientY-14)+'px';
    tt.classList.add('visible');
  }

  function _hideTooltip() {
    var tt = document.getElementById('ceChartTooltip');
    if (tt) tt.classList.remove('visible');
  }

  function bindLineTooltip(canvasId, data, pts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !pts || !pts.length) return;
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect(), mx = e.clientX - rect.left;
      var closest=-1, minD=Infinity;
      pts.forEach(function(p,i){ var d=Math.abs(p.x-mx); if(d<minD){minD=d;closest=i;} });
      if (closest>=0 && minD<30) { _showTooltip(e, data.labels[closest], data.values[closest], data.unit||''); }
      else { _hideTooltip(); }
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  function bindBarTooltip(canvasId, data, bars) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !bars || !bars.length) return;
    canvas.addEventListener('mousemove', function(e) {
      var rect=canvas.getBoundingClientRect(), mx=e.clientX-rect.left, my=e.clientY-rect.top;
      var sx=rect.width>0?canvas.width/rect.width/(window.devicePixelRatio||1):1;
      var sy=rect.height>0?canvas.height/rect.height/(window.devicePixelRatio||1):1;
      var lx=mx*sx, ly=my*sy, found=-1;
      bars.forEach(function(b,i){ if(lx>=b.x&&lx<=b.x+b.w&&ly>=b.y&&ly<=b.y+b.h) found=i; });
      if (found>=0) { _showTooltip(e, data.labels[found].replace(/\n/g,' '), data.values[found], data.unit||''); }
      else { _hideTooltip(); }
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  function bindDonutTooltip(canvasId, data) {
    var canvas = document.getElementById(canvasId); if (!canvas) return;
    var size=160, cx=size/2, cy=size/2, r=size*0.44, inner=r*0.58;
    canvas.addEventListener('mousemove', function(e) {
      var rect=canvas.getBoundingClientRect(), dpr=window.devicePixelRatio||1;
      var mx=(e.clientX-rect.left)*(canvas.width/rect.width/dpr);
      var my=(e.clientY-rect.top)*(canvas.height/rect.height/dpr);
      var dx=mx-cx, dy=my-cy, dist=Math.sqrt(dx*dx+dy*dy);
      if (dist<inner||dist>r) { _hideTooltip(); return; }
      var ang=Math.atan2(dy,dx)-(-Math.PI/2); if(ang<0) ang+=Math.PI*2;
      var total=data.segments.reduce(function(a,s){return a+s.value;},0);
      var cum=0, found=null;
      for(var i=0;i<data.segments.length;i++){ cum+=(data.segments[i].value/total)*Math.PI*2; if(ang<=cum){found=data.segments[i];break;} }
      if (!found) { _hideTooltip(); return; }
      var actualVal = data.total>0 ? Math.round(data.total*found.value/100*10)/10 : 0;
      var actualStr = actualVal>=1000 ? actualVal.toLocaleString() : String(actualVal);
      _showTooltip(e, found.label, found.value + '% (' + actualStr + ' ' + data.unit + ')', '');
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  /* ════════════════════════════════════════════════════════
     구역 호버 툴팁
  ════════════════════════════════════════════════════════ */
  function showDongTip(e, name, value) {
    var tip = document.getElementById('ceDongTip');
    if (!tip) return;
    tip.innerHTML = '<div class="ce-dong-tip__name">' + name + '</div>'
      + '<div class="ce-dong-tip__val">' + value.toLocaleString() + ' tCO₂eq</div>';
    tip.style.display = 'block';
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 48) + 'px';
  }

  function hideDongTip() {
    var tip = document.getElementById('ceDongTip');
    if (tip) tip.style.display = 'none';
  }

  /* ════════════════════════════════════════════════════════
     행정동 클릭 → 지도 팝업
  ════════════════════════════════════════════════════════ */
  function openDistrictPopup(el) {
    var name  = el.getAttribute('data-name') || '—';
    var value = parseFloat(el.getAttribute('data-value')) || 0;
    var color = el.getAttribute('fill') || '#044E9E';

    document.getElementById('cePopupBadge').innerHTML =
      '<div style="width:34px;height:34px;border-radius:50%;background:' + color
      + ';display:flex;align-items:center;justify-content:center;">'
      + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>'
      + '<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>';

    document.getElementById('cePopupTitle').textContent  = name;
    document.getElementById('cePopupType').textContent   = '탄소배출 현황';
    document.getElementById('cePopupMetric').style.display = '';
    document.getElementById('cePopupMetric').style.borderColor = color;
    document.getElementById('cePopupMetric').style.borderLeftColor = color;
    document.getElementById('cePopupMetricLabel').textContent = '행정동 탄소배출량';
    document.getElementById('cePopupMetricValue').innerHTML = value.toLocaleString() + '<span>tCO₂eq</span>';
    document.getElementById('cePopupMetricValue').style.color = color;
    document.getElementById('cePopupMetricDesc').textContent = '행정동 단위 배출량 분포를 기준으로 한 면 데이터입니다.';
    document.getElementById('cePopupAddrLb').textContent = '행정동';
    document.getElementById('cePopupAddr').textContent   = '경기도 광명시 ' + name;
    document.getElementById('cePopupDongRow').style.display = 'none';
    document.getElementById('cePopupVal1Lb').textContent = '탄소배출량 (tCO₂eq)';
    document.getElementById('cePopupVal1').textContent   = value.toLocaleString();
    document.getElementById('cePopupVal2Lb').textContent = '배출 수준';
    var emLevel = value >= 50000 ? '매우 높음' : value >= 22000 ? '높음' : value >= 7000 ? '보통' : '낮음';
    var emColor = value >= 50000 ? 'var(--status-danger)' : value >= 22000 ? 'var(--status-warning)' : value >= 7000 ? 'var(--status-info)' : 'var(--status-success)';
    document.getElementById('cePopupVal2').innerHTML = '<span style="color:' + emColor + ';font-weight:700;">● ' + emLevel + '</span>';
    document.getElementById('cePopupSync').textContent   = '2023년 기준';
    document.getElementById('cePopupSourceRow').style.display = 'none';

    var ft = document.getElementById('cePopupFt');
    ft.innerHTML =
      '<button class="btn btn--line" type="button" id="cePopupDetailBtn">상세 분석</button>'
      + '<button class="btn btn--line" type="button" onclick="cePage.closePopup()">지역 비교</button>'
      + '<button class="btn btn--pri" type="button" onclick="cePage.closePopup()">닫기</button>';

    document.getElementById('cePopupDetailBtn').addEventListener('click', function() {
      closePopup();
      openDistrictDrawer(el);
    });

    document.getElementById('ceMapPopup').classList.add('open');
  }

  /* ════════════════════════════════════════════════════════
     행정동 상세 드로어
  ════════════════════════════════════════════════════════ */
  function initDistrictDrawer() {
    var btnClose  = document.getElementById('ceDdClose');
    var btnClose2 = document.getElementById('ceDdCloseBtn');
    var btnData   = document.getElementById('ceDdDataBtn');
    if (btnClose)  btnClose.addEventListener('click', closeDistrictDrawer);
    if (btnClose2) btnClose2.addEventListener('click', closeDistrictDrawer);
    if (btnData)   btnData.addEventListener('click', function() {
      alert('원천 데이터 연계는 준비 중입니다.');
    });
  }

  var _currentDrawerEl = null;

  function openDistrictDrawer(el) {
    _currentDrawerEl = el;
    var name   = el.getAttribute('data-name') || '—';
    var value  = parseFloat(el.getAttribute('data-value')) || 0;
    var color  = el.getAttribute('fill') || '#044E9E';
    var yearly = generateYearlyData(name, value);

    document.getElementById('ceDdBadge').style.background = color;
    document.getElementById('ceDdTitle').textContent = name;

    document.getElementById('ceDdTableBody').innerHTML = yearly.map(function(d) {
      return '<tr>'
        + '<td>' + d.year + '</td>'
        + '<td>' + fmtTco2(d.total) + '</td>'
        + '<td>' + fmtTco2(d.emission) + '</td>'
        + '<td style="color:var(--status-success)">' + fmtTco2(d.absorption) + '</td>'
        + '</tr>';
    }).join('');

    document.getElementById('ceDistrictDrawer').classList.add('open');
    setTimeout(function() { renderDistrictChart('ceDdChart', yearly); }, 60);
  }

  function closeDistrictDrawer() {
    document.getElementById('ceDistrictDrawer').classList.remove('open');
  }

  function generateYearlyData(name, value) {
    var years = [2019, 2020, 2021, 2022, 2023];
    var seed  = ((name.charCodeAt(0) || 65) + (name.charCodeAt(1) || 0)) * 7;
    return years.map(function(yr, i) {
      var trend      = 1 + Math.sin(seed * 0.017 + i * 1.73) * 0.09;
      var total      = Math.round(value * trend * 100) / 100;
      var absRate    = 0.016 + Math.abs(Math.sin(seed * 0.031 + i * 0.87)) * 0.005;
      var absorption = -(Math.round(Math.abs(total) * absRate * 100) / 100);
      var emission   = Math.round((total - absorption) * 100) / 100;
      return { year: yr, total: total, emission: emission, absorption: absorption };
    });
  }

  function fmtTco2(v) {
    return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderDistrictChart(canvasId, yearly) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var dpr  = window.devicePixelRatio || 1;
    var wrap = canvas.parentElement;
    canvas.width  = wrap.offsetWidth  * dpr;
    canvas.height = wrap.offsetHeight * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var W = wrap.offsetWidth, H = wrap.offsetHeight;
    var pad = { t: 24, r: 14, b: 30, l: 54 };
    var aw  = W - pad.l - pad.r, ah = H - pad.t - pad.b;

    var allV = [];
    yearly.forEach(function(d) { allV.push(d.total, d.emission, d.absorption); });
    var yMax = Math.max.apply(null, allV) * 1.12;
    var yMin = Math.min.apply(null, allV) < 0 ? Math.min.apply(null, allV) * 1.6 : -yMax * 0.04;
    var yRng = yMax - yMin;

    function toY(v) { return pad.t + ah * (1 - (v - yMin) / yRng); }

    ctx.clearRect(0, 0, W, H);

    /* Y 그리드 + 레이블 */
    [0, 0.25, 0.5, 0.75, 1].forEach(function(t) {
      var v = yMin + yRng * t, y = toY(v);
      ctx.strokeStyle = '#EEF1F6'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + aw, y); ctx.stroke();
      ctx.fillStyle = '#B0BAC8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((v / 1000).toFixed(0) + 'k', pad.l - 5, y + 3);
    });

    /* 0 기준선 */
    if (yMin < 0 && yMax > 0) {
      var zy = toY(0);
      ctx.strokeStyle = '#C8D0DE'; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(pad.l, zy); ctx.lineTo(pad.l + aw, zy); ctx.stroke();
      ctx.setLineDash([]);
    }

    /* 단위 */
    ctx.fillStyle = '#B0BAC8'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('(천 tCO₂eq)', pad.l - 5, pad.t - 9);

    /* 막대 */
    var n = yearly.length, grpW = aw / n;
    var barW = Math.floor(grpW * 0.22);
    var SERIES = [
      { key: 'total',      color: '#36445A' },
      { key: 'emission',   color: '#E0483D' },
      { key: 'absorption', color: '#1AAA5E' }
    ];

    yearly.forEach(function(d, gi) {
      var grpX = pad.l + gi * grpW;
      SERIES.forEach(function(s, si) {
        var v  = d[s.key];
        var x  = grpX + (grpW - barW * 3 - 4) / 2 + si * (barW + 2);
        var y1 = toY(Math.max(v, 0)), y0 = toY(Math.min(v, 0));
        var bh = Math.max(Math.abs(y0 - y1), 1), by = Math.min(y1, y0);
        var r  = Math.min(3, barW / 2, bh / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, by); ctx.lineTo(x + barW - r, by);
        ctx.quadraticCurveTo(x + barW, by, x + barW, by + r);
        ctx.lineTo(x + barW, by + bh); ctx.lineTo(x, by + bh);
        ctx.lineTo(x, by + r); ctx.quadraticCurveTo(x, by, x + r, by);
        ctx.closePath();
        ctx.fillStyle = s.color; ctx.fill();
      });
      ctx.fillStyle = '#8A95A6'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(String(d.year), grpX + grpW / 2, H - 7);
    });
  }

  /* ════════════════════════════════════════════════════════
     행정동 집계 테이블
  ════════════════════════════════════════════════════════ */
  var DONG_TABLE_DATA = DONG_DEMO_DATA.map(function(d) {
    var totalCity = 332650;
    var contrib   = Math.round(d.value / totalCity * 1000) / 10;
    var seed = d.name.charCodeAt(0) * 3 + (d.name.charCodeAt(1)||0);
    var yoyDelta  = +((((seed % 17) - 6) * 0.9).toFixed(1));
    var status    = d.value > 30000 ? 'warn' : 'ok';
    var grade     = d.value >= 50000 ? 'D' : d.value >= 30000 ? 'C' : d.value >= 12000 ? 'B' : 'A';
    return { name:d.name, emission:d.value, contrib:contrib, yoy:yoyDelta, status:status, grade:grade };
  });

  var ENERGY_DONG_DATA = [
    { name:'철산1동', today:82.4,  accum:40.2, solar:12.4, selfRate:15.0, yoy:+8.2 },
    { name:'철산2동', today:54.1,  accum:26.8, solar:8.1,  selfRate:15.0, yoy:+5.1 },
    { name:'철산3동', today:98.6,  accum:48.5, solar:0.0,  selfRate:0.0,  yoy:+11.4 },
    { name:'철산4동', today:130.2, accum:63.4, solar:22.3, selfRate:17.1, yoy:+3.2 },
    { name:'광명1동', today:41.8,  accum:20.5, solar:5.6,  selfRate:13.4, yoy:-2.1 },
    { name:'광명2동', today:67.3,  accum:32.9, solar:0.0,  selfRate:0.0,  yoy:+7.8 },
    { name:'광명3동', today:59.4,  accum:28.9, solar:7.2,  selfRate:12.1, yoy:+4.3 },
    { name:'광명4동', today:28.2,  accum:13.8, solar:4.4,  selfRate:15.6, yoy:-5.5 },
    { name:'광명5동', today:22.1,  accum:10.7, solar:3.2,  selfRate:14.5, yoy:+1.2 },
    { name:'광명6동', today:110.8, accum:54.2, solar:0.0,  selfRate:0.0,  yoy:+14.6 },
    { name:'광명7동', today:18.4,  accum:9.0,  solar:2.8,  selfRate:15.2, yoy:+0.4 },
    { name:'하안1동', today:142.6, accum:70.1, solar:18.2, selfRate:12.8, yoy:+9.1 },
    { name:'하안2동', today:48.3,  accum:23.7, solar:6.4,  selfRate:13.2, yoy:+3.8 },
    { name:'소하1동', today:38.7,  accum:19.1, solar:28.4, selfRate:73.4, yoy:-8.2 },
    { name:'소하2동', today:72.4,  accum:35.5, solar:9.8,  selfRate:13.5, yoy:+6.3 },
    { name:'학온동',  today:24.6,  accum:12.1, solar:12.1, selfRate:49.2, yoy:-3.7 },
    { name:'일직동',  today:89.2,  accum:43.9, solar:41.6, selfRate:46.6, yoy:+12.8 }
  ];

  var _dongSearchCarbon = '';
  var _dongSearchEnergy = '';

  function renderDongTable(tab) {
    if (tab === 'carbon') {
      var q = _dongSearchCarbon.toLowerCase();
      var rows = q ? DONG_TABLE_DATA.filter(function(d){ return d.name.indexOf(q) > -1; }) : DONG_TABLE_DATA;
      var tbody = document.getElementById('dongBodyCarbon');
      if (!tbody) return;
      tbody.innerHTML = rows.map(function(d) {
        var yoyHtml = '<span style="color:' + (d.yoy > 0 ? 'var(--status-danger)' : d.yoy < 0 ? 'var(--status-success)' : 'var(--fg-3)') + ';font-weight:700;">'
          + (d.yoy > 0 ? '▲ +' : d.yoy < 0 ? '▼ ' : '') + d.yoy + '%</span>';
        var stHtml = d.status === 'warn'
          ? '<span style="color:var(--status-danger);font-weight:700;">● 높음</span>'
          : '<span style="color:var(--status-success);font-weight:700;">● 양호</span>';
        var gradeColor = { A:'var(--status-success)', B:'var(--status-info)', C:'var(--status-warning)', D:'var(--status-danger)' };
        return '<tr style="cursor:pointer" onclick="cePage.openDongDrawerByName(\'' + d.name + '\')">'
          + '<td class="l" style="font-weight:600">' + d.name + '</td>'
          + '<td class="num">' + d.emission.toLocaleString() + '</td>'
          + '<td class="num">' + d.contrib + '%</td>'
          + '<td class="num">' + yoyHtml + '</td>'
          + '<td class="num" style="font-weight:700;color:' + gradeColor[d.grade] + '">' + d.grade + '</td>'
          + '<td>' + stHtml + '</td>'
          + '<td><button class="tbtn" type="button" onclick="event.stopPropagation();cePage.openDongDrawerByName(\'' + d.name + '\')">상세</button></td>'
          + '</tr>';
      }).join('') || '<tr class="tbl__empty"><td colspan="7"><i data-lucide="inbox"></i>검색 결과가 없습니다.</td></tr>';
      if (window.lucide) lucide.createIcons();
    } else {
      var q2 = _dongSearchEnergy.toLowerCase();
      var rows2 = q2 ? ENERGY_DONG_DATA.filter(function(d){ return d.name.indexOf(q2) > -1; }) : ENERGY_DONG_DATA;
      var tbody2 = document.getElementById('dongBodyEnergy');
      if (!tbody2) return;
      tbody2.innerHTML = rows2.map(function(d) {
        var yoyHtml2 = '<span style="color:' + (d.yoy > 0 ? 'var(--status-danger)' : 'var(--status-success)') + ';font-weight:700;">'
          + (d.yoy > 0 ? '+' : '') + d.yoy + '%</span>';
        return '<tr>'
          + '<td class="l" style="font-weight:600">' + d.name + '</td>'
          + '<td class="num">' + d.today.toLocaleString() + '</td>'
          + '<td class="num">' + d.accum.toLocaleString() + '</td>'
          + '<td class="num">' + d.solar.toLocaleString() + '</td>'
          + '<td class="num">' + d.selfRate + '%</td>'
          + '<td class="num">' + yoyHtml2 + '</td>'
          + '<td><button class="tbtn" type="button">상세</button></td>'
          + '</tr>';
      }).join('') || '<tr class="tbl__empty"><td colspan="7"><i data-lucide="inbox"></i>검색 결과가 없습니다.</td></tr>';
      if (window.lucide) lucide.createIcons();
    }
  }

  function initDongTable() {
    var sc = document.getElementById('dongSearchCarbon');
    var se = document.getElementById('dongSearchEnergy');
    if (sc) sc.addEventListener('input', function() { _dongSearchCarbon = this.value.trim(); renderDongTable('carbon'); });
    if (se) se.addEventListener('input', function() { _dongSearchEnergy = this.value.trim(); renderDongTable('energy'); });
    renderDongTable('carbon');
    renderDongTable('energy');

    /* CSV 내보내기 버튼 */
    var cCsv = document.getElementById('dongCarbonCsvBtn');
    if (cCsv) cCsv.addEventListener('click', function() { exportDongCsv('carbon'); });
    var eCsv = document.getElementById('dongEnergyCsvBtn');
    if (eCsv) eCsv.addEventListener('click', function() { exportDongCsv('energy'); });
  }

  function exportDongCsv(tab) {
    var rows, headers, filename;
    if (tab === 'carbon') {
      headers = ['행정동','탄소배출량(tCO₂eq)','배출비중(%)','전년대비(%)','배출등급','상태'];
      rows = DONG_TABLE_DATA.map(function(d) {
        return [d.name, d.emission, d.contrib, d.yoy, d.grade, d.status === 'ok' ? '양호' : '높음'].join(',');
      });
      filename = '광명시_행정동_탄소배출량_' + new Date().toISOString().slice(0,10) + '.csv';
    } else {
      headers = ['행정동','오늘사용량(kWh)','누적사용량(MWh)','태양광발전(kWh)','자급률(%)','전일대비(%)'];
      rows = ENERGY_DONG_DATA.map(function(d) {
        return [d.name, d.today, d.accum, d.solar, d.selfRate, d.yoy].join(',');
      });
      filename = '광명시_행정동_에너지사용_' + new Date().toISOString().slice(0,10) + '.csv';
    }
    var csv = '﻿' + headers.join(',') + '\n' + rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  /* ════════════════════════════════════════════════════════
     차트 CSV 다운로드
  ════════════════════════════════════════════════════════ */
  function initChartDownloadBtns() {
    var map = [
      { id:'carbonLineDlBtn',  tab:'carbon',  chart:'line'  },
      { id:'carbonDonutDlBtn', tab:'carbon',  chart:'donut' },
      { id:'carbonBarDlBtn',   tab:'carbon',  chart:'bar'   },
      { id:'energyLineDlBtn',  tab:'energy',  chart:'line'  },
      { id:'energyDonutDlBtn', tab:'energy',  chart:'donut' },
      { id:'energyBarDlBtn',   tab:'energy',  chart:'bar'   }
    ];
    map.forEach(function(m) {
      var btn = document.getElementById(m.id);
      if (!btn) return;
      btn.addEventListener('click', function() { exportChartCsv(m.tab, m.chart); });
    });
  }

  function exportChartCsv(tab, chart) {
    var d = CHART_DATA[tab];
    var lines, filename;
    if (chart === 'line') {
      lines = ['﻿기간,' + (tab === 'carbon' ? '탄소배출량(tCO₂eq)' : '에너지사용량(MWh)')];
      d.line.labels.forEach(function(l, i) { lines.push(l + ',' + d.line.values[i]); });
      filename = (tab === 'carbon' ? '월별탄소배출추이' : '에너지사용량추이') + '_' + new Date().toISOString().slice(0,10) + '.csv';
    } else if (chart === 'donut') {
      lines = ['﻿항목,비중(%)'];
      d.donut.segments.forEach(function(s) { lines.push(s.label + ',' + s.value); });
      filename = (tab === 'carbon' ? '분야별배출비중' : '에너지유형비중') + '_' + new Date().toISOString().slice(0,10) + '.csv';
    } else {
      if (tab === 'carbon') {
        lines = ['﻿기간,저감효과(%)'];
        d.bar.labels.forEach(function(l, i) { lines.push(l + ',' + d.bar.values[i]); });
      } else {
        lines = ['﻿구분'];
        d.bar.values2d.forEach(function(s) { lines[0] += ',' + s.label + '(' + d.bar.unit + ')'; });
        d.bar.labels.forEach(function(l, i) {
          var row = l.replace(/\n/g, ' ');
          d.bar.values2d.forEach(function(s) { row += ',' + s.values[i]; });
          lines.push(row);
        });
      }
      filename = (tab === 'carbon' ? '배출량추이' : '발전량대비사용량') + '_' + new Date().toISOString().slice(0,10) + '.csv';
    }
    var csv = lines.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  /* ════════════════════════════════════════════════════════
     드로어 CSV 다운로드
  ════════════════════════════════════════════════════════ */
  function initDrawerCsvBtn() {
    var btn = document.getElementById('ceDdCsvBtn');
    if (!btn) return;
    btn.addEventListener('click', function() {
      if (!_currentDrawerEl) return;
      var name  = _currentDrawerEl.getAttribute('data-name') || '행정동';
      var value = parseFloat(_currentDrawerEl.getAttribute('data-value')) || 0;
      var yearly = generateYearlyData(name, value);
      var csv = '﻿연도,전체(tCO₂eq),배출량(tCO₂eq),흡수량(tCO₂eq)\n'
        + yearly.map(function(d) { return d.year + ',' + d.total + ',' + d.emission + ',' + d.absorption; }).join('\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name + '_탄소배출저감_연도별데이터.csv';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    });
  }


  /* 행정동 이름으로 드로어 열기 (테이블 행 클릭용) */
  function openDongDrawerByName(name) {
    var el = document.querySelector('[data-name="' + name + '"]');
    if (el) { _currentDrawerEl = el; openDistrictDrawer(el); }
  }

  /* 외부 참조용 */
  window.cePage = {
    closePopup: closePopup,
    updateChoropleth: updateChoropleth,
    closeDistrictDrawer: closeDistrictDrawer,
    openDongDrawerByName: openDongDrawerByName
  };

  function nowStr() {
    var d = new Date(), p = function(n) { return String(n).padStart(2,'0'); };
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#refreshBtn')) return;
    var el = document.getElementById('updTime');
    if (el) el.textContent = nowStr();
  });

  init();
})();
