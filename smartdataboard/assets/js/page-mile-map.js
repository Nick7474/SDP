/* =====================================================================
   광명 스마트데이터보드 · 4종 마일별 데이터 지도  (Kakao Maps v3)
   ===================================================================== */
(function () {
  'use strict';

  /* 광명시 지리 범위 — SVG viewBox(0 0 391 561) 기준 NW/SE 좌표 */
  var GM_BOUNDS = {
    north: 37.4968, south: 37.3922,
    west:  126.8172, east:  126.9108,
    svgW:  391, svgH: 561
  };

  var MILE_COLORS = {
    energy:   '#0C8AE5',
    mobility: '#1AAA5E',
    safety:   '#ED8B16',
    data:     '#6E74D6'
  };

  var MILE_ICONS_SVG = {
    energy:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    mobility: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="18" r="3"/><path d="M10 18H6V6a2 2 0 0 1 2-2h5l3 3v11h-3"/><path d="m6 11 3-3h6"/></svg>',
    safety:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    data:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>'
  };

  var PINS = [
    /* 에너지 마일 — 일직동/소하동/철산동 내부 좌표 */
    { id:'e1', mile:'energy',   layerKey:'solar',   name:'광명역 태양광 발전소',  type:'태양광 발전', lat:37.4218, lng:126.8648, status:'ok',
      today:'34.2 MWh', accum:'1,234 MWh', lastSync:'2026-06-17 09:28', addr:'경기도 광명시 일직동 346' },
    { id:'e2', mile:'energy',   layerKey:'solar',   name:'광명스카이돔 태양광',    type:'태양광 발전', lat:37.4672, lng:126.8605, status:'ok',
      today:'22.1 MWh', accum:'856 MWh',   lastSync:'2026-06-17 09:25', addr:'경기도 광명시 철산동 460' },
    { id:'e3', mile:'energy',   layerKey:'meter',   name:'철산동 ESS',             type:'에너지 저장', lat:37.4742, lng:126.8822, status:'warn',
      today:'—',         accum:'456 MWh',   lastSync:'2026-06-17 08:55', addr:'경기도 광명시 철산동 12-4' },
    { id:'e4', mile:'energy',   layerKey:'solar',   name:'소하동 태양광',          type:'태양광 발전', lat:37.4392, lng:126.8755, status:'ok',
      today:'18.3 MWh', accum:'612 MWh',   lastSync:'2026-06-17 09:27', addr:'경기도 광명시 소하동 1212' },
    { id:'e5', mile:'energy',   layerKey:'solar',   name:'일직동 풍력터빈',        type:'풍력 발전',  lat:37.4265, lng:126.8598, status:'ok',
      today:'41.6 MWh', accum:'1,876 MWh', lastSync:'2026-06-17 09:30', addr:'경기도 광명시 일직동 산12' },
    /* 모빌리티 마일 */
    { id:'m1', mile:'mobility', layerKey:'drt',     name:'광명역 EV-DRT 거점',     type:'EV-DRT',     lat:37.4213, lng:126.8662, status:'ok',
      today:'142회',    accum:'4,820회',   lastSync:'2026-06-17 09:29', addr:'경기도 광명시 일직동 KTX광명역' },
    { id:'m2', mile:'mobility', layerKey:'evshare', name:'철산역 공유전기차',       type:'공유 EV',    lat:37.4762, lng:126.8842, status:'ok',
      today:'38회',     accum:'1,240회',   lastSync:'2026-06-17 09:28', addr:'경기도 광명시 철산동 철산역' },
    { id:'m3', mile:'mobility', layerKey:'micro',   name:'하안동 마이크로버스',     type:'마이크로버스',lat:37.4545, lng:126.8732, status:'ok',
      today:'95회',     accum:'3,120회',   lastSync:'2026-06-17 09:25', addr:'경기도 광명시 하안동 320' },
    { id:'m4', mile:'mobility', layerKey:'micro',   name:'소하동 전동킥보드',       type:'전동킥보드', lat:37.4375, lng:126.8782, status:'warn',
      today:'21회',     accum:'780회',     lastSync:'2026-06-17 08:40', addr:'경기도 광명시 소하동 1100' },
    /* 세이프티 마일 */
    { id:'s1', mile:'safety',   layerKey:'pole',    name:'철산동 스마트폴 1',       type:'스마트폴',   lat:37.4748, lng:126.8812, status:'ok',
      today:'감지 12건', accum:'1,520건',  lastSync:'2026-06-17 09:30', addr:'경기도 광명시 철산동 102' },
    { id:'s2', mile:'safety',   layerKey:'cctv',    name:'하안동 스마트CCTV',       type:'스마트CCTV', lat:37.4518, lng:126.8748, status:'ok',
      today:'감지 8건',  accum:'1,210건',  lastSync:'2026-06-17 09:29', addr:'경기도 광명시 하안동 150' },
    { id:'s3', mile:'safety',   layerKey:'bell',    name:'소하동 비상벨',           type:'비상벨',     lat:37.4408, lng:126.8798, status:'danger',
      today:'대응 2건',  accum:'820건',    lastSync:'2026-06-17 09:10', addr:'경기도 광명시 소하동 620' },
    { id:'s4', mile:'safety',   layerKey:'flood',   name:'광명역 침수감지',         type:'침수감지',   lat:37.4225, lng:126.8658, status:'ok',
      today:'감지 0건',  accum:'120건',    lastSync:'2026-06-17 09:28', addr:'경기도 광명시 일직동 400' },
    /* 데이터 마일 */
    { id:'d1', mile:'data',     layerKey:'hub',     name:'광명 통합데이터허브',     type:'데이터 허브', lat:37.4552, lng:126.8692, status:'ok',
      today:'수집 1,520건', accum:'27,480건', lastSync:'2026-06-17 09:30', addr:'경기도 광명시 광명동 행정타운' },
    { id:'d2', mile:'data',     layerKey:'sensor',  name:'에너지 데이터서버',       type:'데이터 서버', lat:37.4618, lng:126.8632, status:'ok',
      today:'수집 820건',  accum:'12,210건', lastSync:'2026-06-17 09:28', addr:'경기도 광명시 광명동 145' },
    { id:'d3', mile:'data',     layerKey:'sensor',  name:'모빌리티 데이터서버',     type:'데이터 서버', lat:37.4478, lng:126.8720, status:'warn',
      today:'수집 410건',  accum:'8,820건',  lastSync:'2026-06-17 08:50', addr:'경기도 광명시 하안동 200' }
  ];

  var RELATED_PINS = [
    { id:'rel-park1', type:'park',   name:'철산공원',         lat:37.4702, lng:126.8812, color:'#00897B' },
    { id:'rel-park2', type:'park',   name:'도덕산 근린공원',  lat:37.4532, lng:126.8578, color:'#00897B' },
    { id:'rel-park3', type:'park',   name:'소하근린공원',     lat:37.4395, lng:126.8748, color:'#00897B' },
    { id:'rel-drt1',  type:'drt-rt', name:'DRT A-01 운행중', lat:37.4738, lng:126.8648, color:'#7B1FA2' },
    { id:'rel-drt2',  type:'drt-rt', name:'DRT B-03 운행중', lat:37.4608, lng:126.8782, color:'#7B1FA2' },
    { id:'rel-drt3',  type:'drt-rt', name:'DRT C-07 운행중', lat:37.4452, lng:126.8672, color:'#7B1FA2' },
    { id:'rel-dem1',  type:'demand', name:'에너지 수요 구역 A', lat:37.4662, lng:126.8702, color:'#E64A19' },
    { id:'rel-dem2',  type:'demand', name:'에너지 수요 구역 B', lat:37.4508, lng:126.8832, color:'#E64A19' },
    { id:'rel-dem3',  type:'demand', name:'에너지 수요 구역 C', lat:37.4352, lng:126.8648, color:'#E64A19' }
  ];

  var CHART_DATA = {
    energy: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[100,180,240,310,350], color:'#0C8AE5', unit:'MWh' },
      bar:   { labels:['광명역','스카이돔','철산동\nESS','소하동','일직동\n풍력'], values:[120,65,30,55,80], color:'#0C8AE5', unit:'MWh' },
      donut: { total:350, unit:'MWh', segments:[{label:'태양광', value:78, color:'#044E9E'},{label:'ESS·풍력', value:22, color:'#FFB114'}] }
    },
    mobility: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[8000,9200,10400,11600,12480], color:'#1AAA5E', unit:'회' },
      bar:   { labels:['친환경\nDRT', '전기차\n카셰어링', '친환경\n배달', '공유\n킥보드', '기타'], values:[4800,2200,3600,1280,600], color:'#1AAA5E', unit:'회' },
      donut: { total:12480, unit:'회', segments:[{label:'친환경DRT', value:38, color:'#1AAA5E'},{label:'전기차카셰어링', value:18, color:'#0C8AE5'},{label:'친환경배달', value:29, color:'#044E9E'},{label:'기타', value:15, color:'#6E74D6'}] }
    },
    safety: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[18000,21000,23500,25800,27480], color:'#ED8B16', unit:'건' },
      bar:   { labels:['스마트폴', '스마트\nCCTV', '비상벨', '보행안전', '침수감지'], values:[9200,12480,3600,1200,1000], color:'#ED8B16', unit:'건' },
      donut: { total:27480, unit:'건', segments:[{label:'스마트CCTV', value:45, color:'#E0483D'},{label:'스마트폴', value:34, color:'#ED8B16'},{label:'기타장비', value:21, color:'#6E74D6'}] }
    },
    data: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[28000,32000,37000,41500,44963], color:'#6E74D6', unit:'건' },
      bar:   { labels:['대기질\n센서', '침수·수위', '모빌리티\n운행', '에너지\n발전', '기타API'], values:[17280,17280,4800,720,4883], color:'#6E74D6', unit:'건' },
      donut: { total:44963, unit:'건', segments:[
        {label:'센서 데이터', value:77, color:'#6E74D6'},
        {label:'운행 데이터', value:11, color:'#044E9E'},
        {label:'기타 API', value:12, color:'#ED8B16'}
      ]}
    }
  };

  var SPATIAL_LAYERS = {
    energy: [
      { key:'solar',   label:'태양광 발전 지점',       count:'38개',  color:'#FFB114' },
      { key:'ev',      label:'EV 충전소 위치',         count:'124개', color:'#0C8AE5' },
      { key:'heatmap', label:'전체 사용량 히트맵',      count:null,    color:'#E0483D' },
      { key:'meter',   label:'에너지 계량 지점',        count:'89개',  color:'#6E74D6' },
      { key:'vuln',    label:'취약계층 에너지 지원 구역',count:null,    color:'#1AAA5E' }
    ],
    mobility: [
      { key:'drt',     label:'EV-DRT 노선',            count:'6개',   color:'#1AAA5E' },
      { key:'evshare', label:'공유 EV 위치',            count:'42대',  color:'#0C8AE5' },
      { key:'charge',  label:'EV 충전소',               count:'58개',  color:'#6E74D6' },
      { key:'micro',   label:'마이크로버스 정류장',      count:'24개',  color:'#ED8B16' }
    ],
    safety: [
      { key:'pole',    label:'스마트폴 위치',           count:'86개',  color:'#ED8B16' },
      { key:'cctv',    label:'스마트 CCTV',             count:'143개', color:'#E0483D' },
      { key:'bell',    label:'비상벨 위치',              count:'52개',  color:'#6E74D6' },
      { key:'flood',   label:'침수 감지 구역',           count:'18개',  color:'#0C8AE5' }
    ],
    data: [
      { key:'hub',     label:'통합 데이터허브',          count:'3개',   color:'#6E74D6' },
      { key:'sensor',  label:'도시 센서 노드',           count:'281개', color:'#0C8AE5' },
      { key:'zone',    label:'데이터 수집 구역',          count:'12개',  color:'#1AAA5E' }
    ]
  };

  var RELATED_LAYERS = [
    { key:'park',   label:'공원·녹지 위치',    count:'210개', color:'#00897B' },
    { key:'drt-rt', label:'DRT 실시간 위치',   count:'23대',  color:'#7B1FA2' },
    { key:'demand', label:'에너지 수요 지점',   count:'289개', color:'#E64A19' },
    { key:'admin',  label:'행정동 경계',        count:null,    color:'#044E9E' }
  ];

  var activeMile = 'energy';
  var map = null;
  var markerRefs = [];
  var relatedMarkerRefs = [];
  var boundaryPolygon = null;

  /* ── 필터 상태 ── */
  var _filter = { region: 'all', periodScale: 1.0, areaScale: 1.0 };

  /* ── 폴리곤 드로우 상태 ── */
  var _draw = {
    active:    false,
    points:    [],      /* kakao.maps.LatLng[] */
    polylines: [],      /* kakao.maps.Polyline[] */
    polygon:   null,    /* kakao.maps.Polygon */
    rubber:    null,    /* kakao.maps.Polyline (rubber-band) */
    dots:      []       /* kakao.maps.CustomOverlay[] (꼭짓점 마커) */
  };

  /* ── 원형 드로우 상태 ── */
  var _circle = {
    active:        false,
    phase:         0,       /* 0=중심 대기, 1=반경 대기 */
    center:        null,    /* kakao.maps.LatLng */
    radius:        0,       /* 미터 */
    previewCircle: null,    /* kakao.maps.Circle (드래그 중 미리보기) */
    finalCircle:   null,    /* kakao.maps.Circle (확정 원) */
    centerDot:     null,    /* CustomOverlay (중심 마커) */
    radiusLabel:   null,    /* CustomOverlay (반경 라벨) */
    _clickListener: null,
    _moveListener:  null
  };

  /* ── 지역별 배율 ── */
  var REGION_SCALE = { all:1.00, cheolsan:0.62, haan:0.48, soha:0.36, iljik:0.54, area:1.00 };

  /* ── KPI 기준값 (스케일 가능 항목) ── */
  var KPI_BASE = {
    energy:   [
      { num:350,     unit:'MWh',  dec:0, scalable:true  },
      { num:116.2,   unit:'MWh',  dec:1, scalable:true  },
      { num:1268,    unit:'MWh',  dec:0, scalable:true  },
      { num:156.1,   unit:'tCO₂', dec:1, scalable:true  },
      { text:'정상', color:'var(--status-success)'       },
      { prefix:'+',  num:12.3,    unit:'%', dec:1, scalable:false, color:'var(--gp-primary)' }
    ],
    mobility: [
      { num:12480,   unit:'회',   dec:0, scalable:true  },
      { num:6800,    unit:'명',   dec:0, scalable:true  },
      { num:6.7,     unit:'분',   dec:1, scalable:false },
      { num:92,      unit:'%',    dec:0, scalable:false },
      { text:'정상', color:'var(--status-success)'       },
      { prefix:'+',  num:9.7,     unit:'%', dec:1, scalable:false, color:'var(--gp-primary)' }
    ],
    safety:   [
      { num:27480,   unit:'건',   dec:0, scalable:true  },
      { num:15,      unit:'건',   dec:0, scalable:true  },
      { num:6.7,     unit:'분',   dec:1, scalable:false },
      { num:299,     unit:'개소', dec:0, scalable:false },
      { text:'정상', color:'var(--status-success)'       },
      { prefix:'+',  num:8.4,     unit:'%', dec:1, scalable:false, color:'var(--gp-primary)' }
    ],
    data:     [
      { num:987658,  unit:'건',   dec:0, scalable:true  },
      { num:12,      unit:'개',   dec:0, scalable:false },
      { num:44963,   unit:'건',   dec:0, scalable:true  },
      { num:98.7,    unit:'%',    dec:1, scalable:false },
      { text:'정상', color:'var(--status-success)'       },
      { prefix:'+',  num:5.2,     unit:'%', dec:1, scalable:false, color:'var(--gp-primary)' }
    ]
  };

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryBoot);
    } else {
      tryBoot();
    }
  }

  function tryBoot() {
    if (typeof kakao === 'undefined' || !kakao.maps) {
      setTimeout(tryBoot, 100);
      return;
    }
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) {
      document.addEventListener('gmsb:shell-ready', boot, { once: true });
    } else {
      boot();
    }
  }

  function boot() {
    initMap();
    initMapBoundsLock();
    initRelatedMarkers();
    renderLayerLists(activeMile);
    applyMarkerFilter();
    initFilters();
    initSearch();
    initTabs();
    initMapControls();
    initPopup();
    initDatePicker();
    initRegionFilter();
    initAreaModal();
    /* URL ?mile= 파라미터로 초기 탭 결정 */
    var urlMile = new URLSearchParams(location.search).get('mile');
    var validMiles = ['energy', 'mobility', 'safety', 'data'];
    if (urlMile && validMiles.indexOf(urlMile) !== -1) {
      setActiveMile(urlMile);
    } else {
      refreshDisplay('energy');
    }
    if (window.lucide) lucide.createIcons();
  }

  function initRelatedMarkers() {
    RELATED_PINS.forEach(function (rp) {
      var el = document.createElement('div');
      el.className = 'map-related-pin';
      el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:transparent;'
        + 'border:3px solid ' + rp.color + ';box-shadow:0 1px 4px rgba(0,0,0,.2);cursor:pointer;';
      el.title = rp.name;
      var overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(rp.lat, rp.lng),
        content: el,
        map: map,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 2
      });
      relatedMarkerRefs.push({ type: rp.type, overlay: overlay });
    });
  }

  function applyRelatedFilter() {
    var relatedEl = document.getElementById('relatedLayerList');
    var enabled = {};
    if (relatedEl) {
      relatedEl.querySelectorAll('input[data-related-layer]').forEach(function (chk) {
        enabled[chk.dataset.relatedLayer] = chk.checked;
      });
    }
    if (boundaryPolygon) {
      boundaryPolygon.setMap((enabled['admin'] !== false) ? map : null);
    }
    relatedMarkerRefs.forEach(function (ref) {
      ref.overlay.setMap((enabled[ref.type] !== false) ? map : null);
    });
  }

  function renderLayerLists(mile) {
    var spatialEl = document.getElementById('spatialLayerList');
    var relatedEl = document.getElementById('relatedLayerList');
    var layers = SPATIAL_LAYERS[mile] || [];
    if (spatialEl) {
      spatialEl.innerHTML = layers.map(function (l) {
        return '<label class="layer-item">'
          + '<input type="checkbox" checked data-spatial-layer="' + l.key + '">'
          + '<span class="layer-item__dot" style="background:' + l.color + '"></span>'
          + '<span class="layer-item__label">' + l.label + '</span>'
          + (l.count ? '<span class="layer-item__count">' + l.count + '</span>' : '')
          + '</label>';
      }).join('');
      spatialEl.querySelectorAll('input[data-spatial-layer]').forEach(function (chk) {
        chk.addEventListener('change', function () { applyMarkerFilter(); });
      });
    }
    if (relatedEl) {
      relatedEl.innerHTML = RELATED_LAYERS.map(function (l) {
        return '<label class="layer-item">'
          + '<input type="checkbox" checked data-related-layer="' + l.key + '">'
          + '<span class="layer-item__dot" style="background:' + l.color + '"></span>'
          + '<span class="layer-item__label">' + l.label + '</span>'
          + (l.count ? '<span class="layer-item__count">' + l.count + '</span>' : '')
          + '</label>';
      }).join('');
      relatedEl.querySelectorAll('input[data-related-layer]').forEach(function (chk) {
        chk.addEventListener('change', function () { applyRelatedFilter(); });
      });
    }
  }

  function initMap() {
    var container = document.getElementById('gisMap');
    map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.444, 126.865),
      level: 7
    });
    map.setMinLevel(1);
    map.setMaxLevel(7);

    PINS.forEach(function (pin) { addMarker(pin); });
    loadBoundaryFromSVG();
  }

  function initMapBoundsLock() {
    /* 광명시 경계 ± 약 3km 패딩으로 중심점 허용 범위 설정 */
    var PAD = 0.03; /* 위경도 약 0.03° ≈ 3.3km */
    var LAT_MIN = GM_BOUNDS.south - PAD;
    var LAT_MAX = GM_BOUNDS.north + PAD;
    var LNG_MIN = GM_BOUNDS.west  - PAD;
    var LNG_MAX = GM_BOUNDS.east  + PAD;
    var _boundsGuard = false;

    kakao.maps.event.addListener(map, 'idle', function () {
      if (_boundsGuard) return;
      var c   = map.getCenter();
      var lat = Math.max(LAT_MIN, Math.min(LAT_MAX, c.getLat()));
      var lng = Math.max(LNG_MIN, Math.min(LNG_MAX, c.getLng()));
      if (Math.abs(lat - c.getLat()) > 0.0001 || Math.abs(lng - c.getLng()) > 0.0001) {
        _boundsGuard = true;
        map.setCenter(new kakao.maps.LatLng(lat, lng));
        setTimeout(function () { _boundsGuard = false; }, 300);
      }
    });
  }

  function loadBoundaryFromSVG() {
    /* fetch 없이 HTML에 인라인된 #gmBoundarySvg에서 path 직접 참조 */
    var srcEl = document.getElementById('gmBoundarySvg');
    var srcPath = srcEl ? srcEl.querySelector('path') : null;
    if (!srcPath) return;

    /* 임시 SVG를 오프스크린에 삽입해 getTotalLength/getPointAtLength 사용 */
    var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', '0 0 ' + GM_BOUNDS.svgW + ' ' + GM_BOUNDS.svgH);
    svgEl.style.cssText = 'position:fixed;top:-9999px;left:-9999px;'
      + 'width:' + GM_BOUNDS.svgW + 'px;height:' + GM_BOUNDS.svgH + 'px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(svgEl);

    var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', srcPath.getAttribute('d'));
    svgEl.appendChild(pathEl);

    var totalLen = pathEl.getTotalLength();
    var N = 600;
    var coords = [];
    for (var i = 0; i <= N; i++) {
      var pt = pathEl.getPointAtLength((i / N) * totalLen);
      var lat = GM_BOUNDS.north - (pt.y / GM_BOUNDS.svgH) * (GM_BOUNDS.north - GM_BOUNDS.south);
      var lng = GM_BOUNDS.west  + (pt.x / GM_BOUNDS.svgW) * (GM_BOUNDS.east  - GM_BOUNDS.west);
      coords.push(new kakao.maps.LatLng(lat, lng));
    }
    document.body.removeChild(svgEl);

    if (boundaryPolygon) boundaryPolygon.setMap(null);
    boundaryPolygon = new kakao.maps.Polygon({
      map: map,
      path: coords,
      strokeWeight: 2,
      strokeColor: '#0C8AE5',
      strokeOpacity: 1.0,
      fillColor: '#0C8AE5',
      fillOpacity: 0.07
    });
  }

  function buildPinEl(pin) {
    var base = window.GMSB_BASE || '../';
    var statusHtml = (pin.status !== 'ok')
      ? '<span class="map-pin-status map-pin-status--' + pin.status + '"></span>'
      : '';
    var wrap = document.createElement('div');
    wrap.className = 'map-pin-wrap';
    wrap.innerHTML = '<img class="map-pin-img" src="' + base + 'assets/img/pin-' + pin.mile + '.svg" alt="">' + statusHtml;
    return wrap;
  }

  function addMarker(pin) {
    var el = buildPinEl(pin);
    el.addEventListener('click', function () { openPopup(pin); });
    var overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(pin.lat, pin.lng),
      content: el,
      map: null,
      xAnchor: 0.5,
      yAnchor: 0.83,
      zIndex: 1
    });
    markerRefs.push({ pin: pin, overlay: overlay });
  }

  function applyMarkerFilter() {
    var spatialEl = document.getElementById('spatialLayerList');
    var activeSpatial = {};
    if (spatialEl) {
      spatialEl.querySelectorAll('input[data-spatial-layer]').forEach(function (chk) {
        activeSpatial[chk.dataset.spatialLayer] = chk.checked;
      });
    }
    markerRefs.forEach(function (ref) {
      var p = ref.pin;
      var isMile = (p.mile === activeMile);
      var isLayerOn = (activeSpatial[p.layerKey] !== false);
      ref.overlay.setMap((isMile && isLayerOn) ? map : null);
    });
  }

  function initFilters() {
    document.querySelectorAll('input[name="mileType"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (this.checked) setActiveMile(this.value);
      });
    });
  }

  function initSearch() {
    var input    = document.getElementById('gisSearchInput');
    var dropdown = document.getElementById('searchDropdown');
    if (!input) return;
    input.addEventListener('input', function () {
      var q = this.value.trim();
      if (q.length < 2) { closeDropdown(); return; }
      var results = PINS.filter(function (p) {
        return p.name.indexOf(q) > -1 || p.type.indexOf(q) > -1;
      });
      renderDropdown(results);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDropdown(); this.blur(); }
    });
    document.addEventListener('click', function (e) {
      if (!input.closest('.gis-search').contains(e.target)) closeDropdown();
    });
    function renderDropdown(results) {
      if (!results.length) { closeDropdown(); return; }
      dropdown.innerHTML = results.slice(0, 8).map(function (p) {
        return '<div class="search-item" data-id="' + p.id + '">'
          + '<span class="search-item__dot" style="background:' + MILE_COLORS[p.mile] + '"></span>'
          + '<span>' + p.name + '</span></div>';
      }).join('');
      dropdown.classList.add('open');
      dropdown.querySelectorAll('.search-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var found = PINS.find(function (p) { return p.id === item.dataset.id; });
          if (!found) return;
          input.value = found.name;
          closeDropdown();
          map.setCenter(new kakao.maps.LatLng(found.lat, found.lng));
          map.setLevel(3);
          setTimeout(function () { openPopup(found); }, 400);
        });
      });
    }
  }

  function closeDropdown() {
    var dd = document.getElementById('searchDropdown');
    if (dd) { dd.classList.remove('open'); dd.innerHTML = ''; }
  }

  function initPopup() {
    document.getElementById('popupClose').addEventListener('click', closePopup);
    document.getElementById('popupScrim').addEventListener('click', closePopup);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePopup();
        if (_draw.active)   clearDrawing();
        if (_circle.active) clearCircleDraw();
        closeAreaModal();
      }
    });
  }

  function openPopup(pin) {
    var badge = document.getElementById('popupBadge');
    var base = window.GMSB_BASE || '../';
    badge.style.background = '';
    badge.innerHTML = '<img src="' + base + 'assets/img/mile-' + pin.mile + '.svg" alt="" width="34" height="34" style="display:block;">';
    document.getElementById('popupTitle').textContent    = pin.name;
    document.getElementById('popupType').textContent     = pin.type;
    document.getElementById('popupAddr').textContent     = pin.addr;
    document.getElementById('popupToday').textContent    = pin.today;
    document.getElementById('popupAccum').textContent    = pin.accum;
    document.getElementById('popupLastSync').textContent = pin.lastSync;
    var statusMap   = { ok:'정상', warn:'주의', danger:'위험' };
    var statusColor = { ok:'var(--status-success)', warn:'var(--status-warning)', danger:'var(--status-danger)' };
    document.getElementById('popupStatus').innerHTML =
      '<span style="color:' + statusColor[pin.status] + ';font-weight:700;">● ' + statusMap[pin.status] + '</span>';
    document.getElementById('mapPopup').classList.add('open');
  }

  function closePopup() {
    document.getElementById('mapPopup').classList.remove('open');
  }
  window.closePopup = closePopup;

  function initMapControls() {
    document.getElementById('btnZoomIn').addEventListener('click', function () { map.setLevel(map.getLevel() - 1); });
    document.getElementById('btnZoomOut').addEventListener('click', function () { map.setLevel(map.getLevel() + 1); });
    document.getElementById('btnFitAll').addEventListener('click', function () {
      map.setBounds(new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(GM_BOUNDS.south, GM_BOUNDS.west),
        new kakao.maps.LatLng(GM_BOUNDS.north, GM_BOUNDS.east)
      ), 30, 30, 30, 30);
    });
    document.getElementById('btnCenter').addEventListener('click', function () {
      map.setCenter(new kakao.maps.LatLng(37.454, 126.873));
      map.setLevel(6);
    });
    document.getElementById('btnDrawArea').addEventListener('click', function () {
      if (_draw.active) { clearDrawing(); } else { startDrawing(); }
    });
    document.getElementById('btnDrawCircle').addEventListener('click', function () {
      if (_circle.active) { clearCircleDraw(); } else { startCircleDraw(); }
    });
    document.getElementById('btnClearSel').addEventListener('click', function () {
      closePopup();
      clearDrawing();
      clearCircleDraw();
      closeAreaModal();
      var si = document.getElementById('gisSearchInput');
      if (si) { si.value = ''; closeDropdown(); }
    });
    var btnViewReset = document.getElementById('btnViewReset');
    if (btnViewReset) btnViewReset.addEventListener('click', function () {
      map.setCenter(new kakao.maps.LatLng(37.444, 126.865));
      map.setLevel(7);
    });
    var btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', function () {
      var mapCanvas = document.querySelector('#gisMap canvas');
      if (mapCanvas) {
        try {
          var link = document.createElement('a');
          link.download = '광명스마트데이터보드_지도_' + new Date().toISOString().slice(0,10) + '.png';
          link.href = mapCanvas.toDataURL('image/png');
          link.click();
        } catch(e) {
          alert('지도 내보내기는 동일 도메인 환경에서만 지원됩니다.');
        }
      } else {
        alert('지도 내보내기 기능은 준비 중입니다.');
      }
    });
  }

  function initTabs() {
    document.querySelectorAll('.mile-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { setActiveMile(this.dataset.mile); });
    });
  }

  function setActiveMile(mile) {
    activeMile = mile;
    var radio = document.querySelector('input[name="mileType"][value="' + mile + '"]');
    if (radio) radio.checked = true;
    renderLayerLists(mile);
    applyMarkerFilter();
    document.querySelectorAll('.mile-tab').forEach(function (t) {
      var on = t.dataset.mile === mile;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.mile-pane').forEach(function (p) {
      p.classList.toggle('on', p.id === 'pane-' + mile);
    });
    setTimeout(function () { refreshDisplay(mile); }, 40);
    if (!map) return;
    var milePins = PINS.filter(function (p) { return p.mile === mile; });
    if (!milePins.length) return;
    var bounds = new kakao.maps.LatLngBounds();
    milePins.forEach(function (p) { bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)); });
    map.setBounds(bounds, 40, 40, 40, 40);
  }

  function initCharts(mile) {
    refreshDisplay(mile);
  }

  /* ── 스케일 합산 ── */
  function _computeTotalScale() {
    return REGION_SCALE[_filter.region] * _filter.periodScale * _filter.areaScale;
  }

  /* ── 기간 스케일 계산 (선택 일수 / 기준 151일) ── */
  function _computePeriodScale() {
    if (!_cal.selStart || !_cal.selEnd) return 1.0;
    var ms = _cal.selEnd.getTime() - _cal.selStart.getTime();
    var days = Math.max(1, Math.round(ms / 86400000) + 1);
    return Math.min(2.0, Math.max(0.05, days / 151));
  }

  /* ── 스케일 적용 차트 데이터 복사 ── */
  function _scaleData(mile, scale) {
    var base = CHART_DATA[mile];
    var sc = scale;
    return {
      line: {
        labels: base.line.labels,
        values: base.line.values.map(function(v){ return Math.round(v * sc * 10) / 10; }),
        color:  base.line.color,
        unit:   base.line.unit
      },
      bar: {
        labels: base.bar.labels,
        values: base.bar.values.map(function(v){ return Math.round(v * sc); }),
        color:  base.bar.color,
        unit:   base.bar.unit
      },
      donut: {
        total:    Math.round(base.donut.total * sc),
        unit:     base.donut.unit,
        segments: base.donut.segments
      }
    };
  }

  /* ── KPI 스트립 DOM 업데이트 ── */
  function _updateKpiStrip(mile, scale) {
    var pane = document.getElementById('pane-' + mile);
    if (!pane) return;
    var items = pane.querySelectorAll('.mile-kpi-item');
    var defs = KPI_BASE[mile];
    if (!defs) return;
    items.forEach(function(item, i) {
      var def = defs[i];
      if (!def) return;
      var vl = item.querySelector('.mile-kpi__vl');
      if (!vl) return;
      if (def.text !== undefined) {
        vl.style.color = def.color || '';
        vl.innerHTML = def.text;
        return;
      }
      var val = def.scalable ? def.num * scale : def.num;
      val = def.dec > 0 ? Math.round(val * Math.pow(10, def.dec)) / Math.pow(10, def.dec) : Math.round(val);
      var numStr = val >= 1000 ? val.toLocaleString() : String(val);
      var prefix = def.prefix || '';
      vl.style.color = def.color || '';
      vl.innerHTML = prefix + numStr + '<span class="u">' + def.unit + '</span>';
    });
  }

  /* ── 메인 렌더 함수 (필터 변경 시 항상 호출) ── */
  function refreshDisplay(mile) {
    mile = mile || activeMile;
    var scale = _computeTotalScale();
    var scaled = _scaleData(mile, scale);
    _updateKpiStrip(mile, scale);
    var linePts   = drawLineChart(mile, scaled.line);
    var barRects  = drawBarChart(mile, scaled.bar);
    drawDonutChart(mile, scaled.donut);
    bindLineTooltip(mile + 'LineChart', scaled.line, linePts);
    bindBarTooltip(mile + 'BarChart',   scaled.bar,  barRects);
    bindDonutTooltip(mile, scaled.donut);
  }

  var REGION_MAP = {
    all:      { lat: 37.444,  lng: 126.865, level: 7 },
    cheolsan: { lat: 37.4748, lng: 126.882, level: 5 },
    haan:     { lat: 37.4518, lng: 126.874, level: 5 },
    soha:     { lat: 37.4395, lng: 126.878, level: 5 },
    iljik:    { lat: 37.4225, lng: 126.862, level: 5 }
  };

  /* ── 지역 필터 ── */
  function initRegionFilter() {
    var sel = document.getElementById('regionSelect');
    if (!sel) return;
    sel.addEventListener('change', function () {
      /* 폴리곤/원형이 그려진 상태에서 일반 지역 선택 시 → 선택 지우기 */
      if (this.value !== 'area') {
        if (_circle.active)      stopCircleDraw();
        if (_circle.finalCircle) { _circle.finalCircle.setMap(null); _circle.finalCircle = null; }
        if (_circle.centerDot)   { _circle.centerDot.setMap(null);   _circle.centerDot = null; }
        _circle.center = null; _circle.radius = 0;
        if (_draw.polygon) { _draw.polygon.setMap(null); _draw.polygon = null; }
        _draw.polylines.forEach(function(pl){ pl.setMap(null); }); _draw.polylines = [];
        _draw.dots.forEach(function(d){ d.setMap(null); }); _draw.dots = [];
        _draw.points = [];
        _filter.areaScale = 1.0;
        _deselectAreaOption();
      }
      _filter.region = this.value;
      /* 선택 지역으로 지도 이동 */
      if (map && REGION_MAP[this.value]) {
        var rv = REGION_MAP[this.value];
        map.setCenter(new kakao.maps.LatLng(rv.lat, rv.lng));
        map.setLevel(rv.level);
      }
      refreshDisplay(activeMile);
    });
  }

  /* 지역 드롭다운에 "선택영역" 옵션 추가 및 선택 */
  function _selectAreaOption() {
    var sel = document.getElementById('regionSelect');
    if (!sel) return;
    var opt = sel.querySelector('option[value="area"]');
    if (!opt) {
      opt = document.createElement('option');
      opt.value = 'area';
      opt.textContent = '선택영역';
      sel.insertBefore(opt, sel.firstChild);
    }
    sel.value = 'area';
    _filter.region = 'area';
  }

  /* 지역 드롭다운에서 "선택영역" 옵션 제거 + 전체로 복원 */
  function _deselectAreaOption() {
    var sel = document.getElementById('regionSelect');
    if (!sel) return;
    var opt = sel.querySelector('option[value="area"]');
    if (opt) sel.removeChild(opt);
    if (_filter.region === 'area') {
      sel.value = 'all';
      _filter.region = 'all';
    }
  }

  function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    return { ctx:ctx, w:rect.width, h:rect.height };
  }

  function fmtYAxis(v, unit) {
    var s = v >= 1000 ? (v/1000).toFixed(1)+'k' : String(v);
    return unit ? s + unit : s;
  }

  function drawLineChart(mile, data) {
    var canvas = document.getElementById(mile + 'LineChart'); if (!canvas) return;
    var s = setupCanvas(canvas), ctx = s.ctx, W = s.w, H = s.h;
    var unit = data.unit || '';
    var pad = {t:20,r:12,b:8,l:52}, aw = W-pad.l-pad.r, ah = H-pad.t-pad.b;
    var mx = Math.max.apply(null, data.values) * 1.15, n = data.values.length;
    ctx.clearRect(0,0,W,H);
    /* 단위 레이블 (Y축 값과 동일 x 정렬) */
    if (unit) {
      ctx.fillStyle='#B0BAC8'; ctx.font='9px sans-serif'; ctx.textAlign='right';
      ctx.fillText('(' + unit + ')', pad.l-5, pad.t - 6);
    }
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.25,.5,.75,1].forEach(function(t){
      var y=pad.t+ah*(1-t);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right';
      ctx.fillText(fmtYAxis(Math.round(mx*t), ''), pad.l-5, y+4);
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
    var labelsEl=document.getElementById(mile+'LineXLabels');
    if(labelsEl) labelsEl.innerHTML=data.labels.map(function(l,i){return '<span style="left:'+(pad.l+(i/(n-1))*aw)+'px">'+l+'</span>';}).join('');
    return pts;
  }

  function drawBarChart(mile, data) {
    var canvas=document.getElementById(mile+'BarChart'); if(!canvas) return;
    var s=setupCanvas(canvas), ctx=s.ctx, W=s.w, H=s.h;
    var unit = data.unit || '';
    var pad={t:20,r:12,b:40,l:52}, aw=W-pad.l-pad.r, ah=H-pad.t-pad.b;
    var mx=Math.max.apply(null,data.values)*1.2, n=data.labels.length;
    var gap=aw/n, barW=Math.floor(gap*0.55);
    ctx.clearRect(0,0,W,H);
    if (unit) {
      ctx.fillStyle='#B0BAC8'; ctx.font='9px sans-serif'; ctx.textAlign='right';
      ctx.fillText('(' + unit + ')', pad.l-5, pad.t - 6);
    }
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.5,1].forEach(function(t){
      var y=pad.t+ah*(1-t); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right';
      ctx.fillText(fmtYAxis(Math.round(mx*t), ''), pad.l-5, y+4);
    });
    var bars = [];
    data.values.forEach(function(v,i){
      var x=pad.l+gap*i+(gap-barW)/2, bh=(v/mx)*ah, y=pad.t+ah-bh, r=Math.min(5,barW/2,bh/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y); ctx.quadraticCurveTo(x+barW,y,x+barW,y+r); ctx.lineTo(x+barW,y+bh); ctx.lineTo(x,y+bh); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
      ctx.fillStyle=data.color; ctx.fill();
      bars.push({x:x, y:y, w:barW, h:bh});
      ctx.fillStyle='#8A95A6'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      var lines=data.labels[i].split('\n');
      lines.forEach(function(ln,li){ ctx.fillText(ln, x+barW/2, pad.t+ah+14+(li*13)); });
    });
    return bars;
  }

  function drawDonutChart(mile, data) {
    var canvas = document.getElementById(mile + 'DonutChart'); if (!canvas) return;
    var dpr = window.devicePixelRatio || 1, size = 160;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    var cx = size/2, cy = size/2, r = size*0.44, inner = r*0.58;
    var total = data.segments.reduce(function(a, s){ return a + s.value; }, 0);
    var angle = -Math.PI/2;
    data.segments.forEach(function(seg) {
      var sweep = (seg.value / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, angle, angle + sweep); ctx.closePath();
      ctx.fillStyle = seg.color; ctx.fill();
      if (seg.value >= 8) {
        var mid = angle + sweep / 2;
        var lx = cx + r * 0.70 * Math.cos(mid);
        var ly = cy + r * 0.70 * Math.sin(mid);
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seg.value + '%', lx, ly);
        ctx.restore();
      }
      angle += sweep;
    });
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    var legendEl = document.getElementById(mile + 'DonutLegend');
    if (legendEl) {
      var kpiTotal = data.total || 0;
      var kpiUnit  = data.unit  || '';
      legendEl.innerHTML = data.segments.map(function(seg) {
        var actualVal = kpiTotal > 0 ? Math.round(kpiTotal * seg.value / 100) : 0;
        var actualStr = actualVal >= 1000 ? actualVal.toLocaleString() : String(actualVal);
        var valStr = kpiTotal > 0 ? '(' + actualStr + ' ' + kpiUnit + ')' : '';
        return '<div class="donut-legend-item">'
          + '<span class="donut-legend-dot" style="background:' + seg.color + '"></span>'
          + '<span class="donut-legend-name">' + seg.label + '</span>'
          + '<span class="donut-legend-pct">' + seg.value + '%</span>'
          + (valStr ? '<span class="donut-legend-val">' + valStr + '</span>' : '')
          + '</div>';
      }).join('');
    }
  }

  function bindDonutTooltip(mile, data) {
    var canvas = document.getElementById(mile + 'DonutChart');
    if (!canvas) return;
    var size = 160, cx = size/2, cy = size/2, r = size*0.44, inner = r*0.58;
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      var mx = (e.clientX - rect.left) * (canvas.width / rect.width / dpr);
      var my = (e.clientY - rect.top)  * (canvas.height / rect.height / dpr);
      var dx = mx - cx, dy = my - cy, dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < inner || dist > r) { _hideTooltip(); return; }
      var ang = Math.atan2(dy, dx) - (-Math.PI/2);
      if (ang < 0) ang += Math.PI * 2;
      var total = data.segments.reduce(function(a, s){ return a + s.value; }, 0);
      var cum = 0, found = null;
      for (var i = 0; i < data.segments.length; i++) {
        cum += (data.segments[i].value / total) * Math.PI * 2;
        if (ang <= cum) { found = data.segments[i]; break; }
      }
      if (!found) { _hideTooltip(); return; }
      var kpiTotal = data.total || 0, kpiUnit = data.unit || '';
      var actualVal = kpiTotal > 0 ? Math.round(kpiTotal * found.value / 100) : 0;
      var actualStr = actualVal >= 1000 ? actualVal.toLocaleString() : String(actualVal);
      var tt = document.getElementById('chartTooltip');
      var ttLbl = document.getElementById('ttLabel');
      var ttVal = document.getElementById('ttValue');
      if (!tt) return;
      ttLbl.textContent = found.label;
      ttVal.innerHTML = found.value + '<span class="tt-unit">%</span>'
        + (kpiTotal > 0 ? '&nbsp;<span class="tt-unit">(' + actualStr + ' ' + kpiUnit + ')</span>' : '');
      tt.style.left = (e.clientX + 14) + 'px';
      tt.style.top  = (e.clientY - 14) + 'px';
      tt.classList.add('visible');
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  /* ────────────────────────────────────────────────────────
     듀얼 캘린더 날짜 피커
  ──────────────────────────────────────────────────────── */
  var _cal = {
    viewYear: 2026, viewMonth: 0,
    selStart: new Date(2026, 0, 1),
    selEnd:   new Date(2026, 4, 31),
    hovDate:  null,
    step:     0   /* 0=완료, 1=시작 선택 후 종료 대기 */
  };
  var _CAL_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var _CAL_DAYS   = ['일','월','화','수','목','금','토'];

  function _calFmt(d) {
    if (!d) return '';
    var p = function(n){ return String(n).padStart(2,'0'); };
    return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
  }

  function _calSame(a, b) {
    return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function _calUpdateDisplay() {
    var f = document.getElementById('dateFromDisplay');
    var t = document.getElementById('dateToDisplay');
    if (f) f.textContent = _calFmt(_cal.selStart) || '—';
    if (t) t.textContent = _calFmt(_cal.selEnd)   || '—';
  }

  function _calUpdateRangeText() {
    var el = document.getElementById('calSelectedRange');
    if (!el) return;
    if (_cal.selStart && _cal.selEnd) {
      el.textContent = _calFmt(_cal.selStart) + ' — ' + _calFmt(_cal.selEnd);
    } else if (_cal.selStart) {
      el.textContent = _calFmt(_cal.selStart) + ' — 종료일을 선택하세요';
    } else {
      el.textContent = '시작일을 선택하세요';
    }
  }

  /* 호버 시 DOM 교체 없이 클래스만 업데이트 (버그 방지) */
  function _calUpdateDayClasses() {
    var grid = document.getElementById('calLeft');
    if (!grid) return;
    var today = new Date();
    grid.querySelectorAll('.cal-day:not(.cal-day--empty)').forEach(function(el) {
      var date = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
      var cls = 'cal-day';
      var ts = date.getTime();
      var ss = _cal.selStart ? _cal.selStart.getTime() : null;
      var se = _cal.selEnd   ? _cal.selEnd.getTime()   : null;
      var hh = _cal.hovDate  ? _cal.hovDate.getTime()  : null;
      if (_calSame(date, today)) cls += ' cal-day--today';
      if (_calSame(date, _cal.selStart)) cls += ' cal-day--start';
      else if (_calSame(date, _cal.selEnd)) cls += ' cal-day--end';
      else if (ss && se && ts > ss && ts < se) cls += ' cal-day--range';
      else if (_cal.step === 1 && ss && hh && ts > ss && ts < hh) cls += ' cal-day--hov-range';
      el.className = cls;
    });
  }

  function _calRenderMonth(id, year, month) {
    var grid = document.getElementById(id);
    if (!grid) return;
    var today = new Date();
    var firstDow = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<div class="cal-weekdays">';
    _CAL_DAYS.forEach(function(d){ html += '<span>' + d + '</span>'; });
    html += '</div><div class="cal-days">';

    for (var e = 0; e < firstDow; e++) html += '<div class="cal-day cal-day--empty"></div>';

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var cls  = 'cal-day';
      var ts   = date.getTime();
      var ss   = _cal.selStart ? _cal.selStart.getTime() : null;
      var se   = _cal.selEnd   ? _cal.selEnd.getTime()   : null;
      var hh   = _cal.hovDate  ? _cal.hovDate.getTime()  : null;

      if (_calSame(date, today)) cls += ' cal-day--today';
      if (_calSame(date, _cal.selStart)) cls += ' cal-day--start';
      else if (_calSame(date, _cal.selEnd)) cls += ' cal-day--end';
      else if (ss && se && ts > ss && ts < se) cls += ' cal-day--range';
      else if (_cal.step === 1 && ss && hh && ts > ss && ts < hh) cls += ' cal-day--hov-range';

      html += '<div class="' + cls + '" data-y="'+year+'" data-m="'+month+'" data-d="'+d+'">' + d + '</div>';
    }
    html += '</div>';
    grid.innerHTML = html;

    grid.querySelectorAll('.cal-day:not(.cal-day--empty)').forEach(function(el){
      el.addEventListener('click', function(ev){
        ev.stopPropagation();
        var date = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
        if (_cal.step === 0) {
          _cal.selStart = date; _cal.selEnd = null; _cal.hovDate = null; _cal.step = 1;
        } else {
          if (date < _cal.selStart) { _cal.selEnd = _cal.selStart; _cal.selStart = date; }
          else { _cal.selEnd = date; }
          _cal.hovDate = null; _cal.step = 0;
        }
        _calUpdateRangeText();
        _calRender();
      });
      el.addEventListener('mousemove', function(){
        if (_cal.step === 1) {
          var newHov = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
          if (!_calSame(newHov, _cal.hovDate)) {
            _cal.hovDate = newHov;
            _calUpdateDayClasses();
          }
        }
      });
    });
    grid.addEventListener('mouseleave', function(){
      if (_cal.step === 1 && _cal.hovDate) {
        _cal.hovDate = null;
        _calUpdateDayClasses();
      }
    });
  }

  function _calRender() {
    var y = _cal.viewYear, m = _cal.viewMonth;
    var ll = document.getElementById('calLabelLeft');
    if (ll) ll.textContent = y + '년 ' + _CAL_MONTHS[m];
    _calRenderMonth('calLeft', y, m);
    _calUpdateRangeText();
  }

  function initDatePicker() {
    var trigger  = document.getElementById('dateRangeTrigger');
    var dropdown = document.getElementById('datePickerDropdown');
    if (!trigger || !dropdown) return;

    /* 초기 표시 동기화 */
    _calUpdateDisplay();

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var wasOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open');
      if (!wasOpen) _calRender();
    });

    var prev = document.getElementById('calPrev');
    var next = document.getElementById('calNext');
    if (prev) prev.addEventListener('click', function(e) {
      e.stopPropagation();
      _cal.viewMonth--;
      if (_cal.viewMonth < 0) { _cal.viewMonth = 11; _cal.viewYear--; }
      _cal.hovDate = null;
      _calRender();
    });
    if (next) next.addEventListener('click', function(e) {
      e.stopPropagation();
      _cal.viewMonth++;
      if (_cal.viewMonth > 11) { _cal.viewMonth = 0; _cal.viewYear++; }
      _cal.hovDate = null;
      _calRender();
    });

    var applyBtn  = document.getElementById('calApply');
    var cancelBtn = document.getElementById('calCancel');
    if (applyBtn) applyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      _calUpdateDisplay();
      dropdown.classList.remove('open');
      _filter.periodScale = _computePeriodScale();
      refreshDisplay(activeMile);
    });
    if (cancelBtn) cancelBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.remove('open');
    });

    document.addEventListener('click', function(e) {
      if (!trigger.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  function _showTooltip(e, lbl, v, unit) {
    var tt = document.getElementById('chartTooltip');
    var ttLbl = document.getElementById('ttLabel');
    var ttVal = document.getElementById('ttValue');
    if (!tt) return;
    ttLbl.textContent = lbl;
    var numStr = (typeof v === 'number' && v >= 1000) ? v.toLocaleString() : String(v);
    ttVal.innerHTML = numStr + (unit ? '<span class="tt-unit"> ' + unit + '</span>' : '');
    tt.style.left = (e.clientX + 14) + 'px';
    tt.style.top  = (e.clientY - 14) + 'px';
    tt.classList.add('visible');
  }

  function _hideTooltip() {
    var tt = document.getElementById('chartTooltip');
    if (tt) tt.classList.remove('visible');
  }

  function bindLineTooltip(canvasId, data, pts) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !pts || !pts.length) return;
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var closest = -1, minDist = Infinity;
      pts.forEach(function(p, i) {
        var dist = Math.abs(p.x - mx);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest >= 0 && minDist < 30) {
        _showTooltip(e, data.labels[closest], data.values[closest], data.unit || '');
      } else {
        _hideTooltip();
      }
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  function bindBarTooltip(canvasId, data, bars) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !bars || !bars.length) return;
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var sx = rect.width  > 0 ? canvas.width  / rect.width  / (window.devicePixelRatio || 1) : 1;
      var sy = rect.height > 0 ? canvas.height / rect.height / (window.devicePixelRatio || 1) : 1;
      var lx = mx * sx, ly = my * sy;
      var found = -1;
      bars.forEach(function(b, i) {
        if (lx >= b.x && lx <= b.x + b.w && ly >= b.y && ly <= b.y + b.h) found = i;
      });
      if (found >= 0) {
        _showTooltip(e, data.labels[found].replace(/\n/g, ' '), data.values[found], data.unit || '');
      } else {
        _hideTooltip();
      }
    });
    canvas.addEventListener('mouseleave', _hideTooltip);
  }

  /* ═══════════════════════════════════════════════════════════
     폴리곤 영역 선택 기능
  ═══════════════════════════════════════════════════════════ */

  function startDrawing() {
    if (!map) return;
    clearCircleDraw(); /* 기존 원형 선택 초기화 */
    _draw.active = true;
    _draw.points = [];
    document.querySelector('.gis-map-area').classList.add('draw-mode');
    document.getElementById('btnDrawArea').classList.add('active');
    map.setCursor('crosshair');
    var hint = document.getElementById('drawHint');
    if (hint) hint.textContent = '지도를 클릭해 영역을 그리세요 · 더블클릭으로 완료 · ESC 취소';

    _draw._clickListener   = kakao.maps.event.addListener(map, 'click',    _drawClick);
    _draw._moveListener    = kakao.maps.event.addListener(map, 'mousemove', _drawMouseMove);
    _draw._dblClickListener = kakao.maps.event.addListener(map, 'dblclick', _drawDblClick);
  }

  function stopDrawing() {
    _draw.active = false;
    document.querySelector('.gis-map-area').classList.remove('draw-mode');
    document.getElementById('btnDrawArea').classList.remove('active');
    map.setCursor('');

    if (_draw._clickListener)    kakao.maps.event.removeListener(map, 'click',    _draw._clickListener);
    if (_draw._moveListener)     kakao.maps.event.removeListener(map, 'mousemove', _draw._moveListener);
    if (_draw._dblClickListener) kakao.maps.event.removeListener(map, 'dblclick', _draw._dblClickListener);
    if (_draw.rubber) { _draw.rubber.setMap(null); _draw.rubber = null; }
  }

  function clearDrawing() {
    stopDrawing();
    _draw.polylines.forEach(function(pl){ pl.setMap(null); });
    _draw.polylines = [];
    _draw.dots.forEach(function(d){ d.setMap(null); });
    _draw.dots = [];
    if (_draw.polygon) { _draw.polygon.setMap(null); _draw.polygon = null; }
    _draw.points = [];
    _filter.areaScale = 1.0;
    _deselectAreaOption();
    refreshDisplay(activeMile);
  }

  function _addVertexDot(latlng) {
    var el = document.createElement('div');
    el.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#044E9E;'
      + 'border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);pointer-events:none;';
    var ov = new kakao.maps.CustomOverlay({
      position: latlng, content: el, map: map,
      xAnchor: 0.5, yAnchor: 0.5, zIndex: 10
    });
    _draw.dots.push(ov);
  }

  function _drawClick(mouseEvent) {
    var latlng = mouseEvent.latLng;
    _draw.points.push(latlng);
    _addVertexDot(latlng);

    if (_draw.points.length > 1) {
      var prev = _draw.points[_draw.points.length - 2];
      var pl = new kakao.maps.Polyline({
        map: map, path: [prev, latlng],
        strokeColor: '#044E9E', strokeOpacity: 0.85,
        strokeWeight: 2, strokeStyle: 'solid'
      });
      _draw.polylines.push(pl);
    }
  }

  function _drawMouseMove(mouseEvent) {
    if (!_draw.active || _draw.points.length === 0) return;
    var latlng = mouseEvent.latLng;
    var last = _draw.points[_draw.points.length - 1];
    if (_draw.rubber) _draw.rubber.setMap(null);
    _draw.rubber = new kakao.maps.Polyline({
      map: map, path: [last, latlng],
      strokeColor: '#044E9E', strokeOpacity: 0.45,
      strokeWeight: 1.5, strokeStyle: 'dashed'
    });
  }

  function _drawDblClick(mouseEvent) {
    /* 더블클릭 = 마지막 클릭이 두 번 발생 → 마지막 포인트 중복 제거 */
    if (_draw.points.length > 0) {
      _draw.points.pop();
      var lastPl = _draw.polylines.pop();
      if (lastPl) lastPl.setMap(null);
      var lastDot = _draw.dots.pop();
      if (lastDot) lastDot.setMap(null);
    }
    if (_draw.points.length >= 3) {
      finishPolygon();
    } else {
      clearDrawing();
    }
  }

  function finishPolygon() {
    stopDrawing();
    /* 기존 세그먼트 라인 제거 */
    _draw.polylines.forEach(function(pl){ pl.setMap(null); });
    _draw.polylines = [];
    _draw.dots.forEach(function(d){ d.setMap(null); });
    _draw.dots = [];

    _draw.polygon = new kakao.maps.Polygon({
      map: map,
      path: _draw.points,
      strokeColor: '#044E9E', strokeOpacity: 0.9, strokeWeight: 2,
      fillColor: '#044E9E', fillOpacity: 0.12
    });

    /* 영역 내 핀 탐색 */
    var foundPins = PINS.filter(function(pin) {
      return _pointInPolygon({ lat: pin.lat, lng: pin.lng }, _draw.points);
    });

    /* 영역 스케일: 핀 수 비율 (최소 5%) */
    var totalPinCount   = PINS.filter(function(p){ return p.mile === activeMile; }).length;
    var matchedCount    = foundPins.filter(function(p){ return p.mile === activeMile; }).length;
    _filter.areaScale   = totalPinCount > 0
      ? Math.max(0.05, matchedCount / totalPinCount)
      : 1.0;

    _selectAreaOption();
    refreshDisplay(activeMile);
    showAreaModal(foundPins);
  }

  /* Ray-casting 포인트-인-폴리곤 */
  function _pointInPolygon(pt, polygon) {
    var x = pt.lat, y = pt.lng;
    var inside = false;
    var n = polygon.length;
    for (var i = 0, j = n - 1; i < n; j = i++) {
      var xi = polygon[i].getLat(), yi = polygon[i].getLng();
      var xj = polygon[j].getLat(), yj = polygon[j].getLng();
      var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /* ═══════════════════════════════════════════════════════════
     원형 반경 선택 기능
  ═══════════════════════════════════════════════════════════ */

  /* Haversine 거리 (미터) */
  function _haversineDistance(lat1, lng1, lat2, lng2) {
    var R    = 6371000;
    var phi1 = lat1 * Math.PI / 180;
    var phi2 = lat2 * Math.PI / 180;
    var dphi = (lat2 - lat1) * Math.PI / 180;
    var dlam = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dphi/2)*Math.sin(dphi/2)
          + Math.cos(phi1)*Math.cos(phi2)*Math.sin(dlam/2)*Math.sin(dlam/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function _pointInCircle(pin, center, radius) {
    return _haversineDistance(pin.lat, pin.lng, center.getLat(), center.getLng()) <= radius;
  }

  function _fmtRadius(m) {
    return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m) + ' m';
  }

  /* center에서 bearingDeg 방향으로 distM 미터 이동한 LatLng */
  function _destinationPoint(center, distM, bearingDeg) {
    var R    = 6371000;
    var brng = bearingDeg * Math.PI / 180;
    var d    = distM / R;
    var lat1 = center.getLat() * Math.PI / 180;
    var lng1 = center.getLng() * Math.PI / 180;
    var lat2 = Math.asin(Math.sin(lat1)*Math.cos(d) + Math.cos(lat1)*Math.sin(d)*Math.cos(brng));
    var lng2 = lng1 + Math.atan2(Math.sin(brng)*Math.sin(d)*Math.cos(lat1), Math.cos(d) - Math.sin(lat1)*Math.sin(lat2));
    return new kakao.maps.LatLng(lat2 * 180/Math.PI, lng2 * 180/Math.PI);
  }

  function startCircleDraw() {
    if (!map) return;
    clearDrawing(); /* 기존 다각형 선택 초기화 */
    _circle.active = true;
    _circle.phase  = 0;
    document.querySelector('.gis-map-area').classList.add('draw-mode');
    document.getElementById('btnDrawCircle').classList.add('active');
    map.setCursor('crosshair');
    var hint = document.getElementById('drawHint');
    if (hint) hint.textContent = '지도를 클릭해 중심점을 설정하세요 · ESC 취소';
    _circle._clickListener = kakao.maps.event.addListener(map, 'click',     _circleClick);
    _circle._moveListener  = kakao.maps.event.addListener(map, 'mousemove', _circleMouseMove);
  }

  function stopCircleDraw() {
    if (_circle._clickListener) kakao.maps.event.removeListener(map, 'click',     _circle._clickListener);
    if (_circle._moveListener)  kakao.maps.event.removeListener(map, 'mousemove', _circle._moveListener);
    _circle._clickListener = null;
    _circle._moveListener  = null;
    _circle.active = false;
    _circle.phase  = 0;
    document.querySelector('.gis-map-area').classList.remove('draw-mode');
    var btn = document.getElementById('btnDrawCircle');
    if (btn) btn.classList.remove('active');
    map.setCursor('');
    if (_circle.previewCircle) { _circle.previewCircle.setMap(null); _circle.previewCircle = null; }
    if (_circle.radiusLabel)   { _circle.radiusLabel.setMap(null);   _circle.radiusLabel   = null; }
  }

  function clearCircleDraw() {
    stopCircleDraw();
    if (_circle.centerDot)   { _circle.centerDot.setMap(null);   _circle.centerDot   = null; }
    if (_circle.finalCircle) { _circle.finalCircle.setMap(null); _circle.finalCircle = null; }
    _circle.center = null;
    _circle.radius = 0;
    _filter.areaScale = 1.0;
    _deselectAreaOption();
    refreshDisplay(activeMile);
  }

  function _circleClick(mouseEvent) {
    var latlng = mouseEvent.latLng;
    if (_circle.phase === 0) {
      /* 1차 클릭: 중심점 설정 */
      _circle.center = latlng;
      _circle.phase  = 1;
      var dotEl = document.createElement('div');
      dotEl.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#044E9E;'
        + 'border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);pointer-events:none;';
      _circle.centerDot = new kakao.maps.CustomOverlay({
        position: latlng, content: dotEl, map: map,
        xAnchor: 0.5, yAnchor: 0.5, zIndex: 10
      });
      var hint = document.getElementById('drawHint');
      if (hint) hint.textContent = '클릭해 반경을 확정하세요 · ESC 취소';
    } else {
      /* 2차 클릭: 반경 확정 */
      var dist = _haversineDistance(
        _circle.center.getLat(), _circle.center.getLng(),
        latlng.getLat(), latlng.getLng()
      );
      if (dist < 10) return; /* 너무 작으면 무시 */
      _circle.radius = dist;
      finishCircle();
    }
  }

  function _circleMouseMove(mouseEvent) {
    if (!_circle.active || _circle.phase !== 1 || !_circle.center) return;
    var latlng = mouseEvent.latLng;
    var dist = _haversineDistance(
      _circle.center.getLat(), _circle.center.getLng(),
      latlng.getLat(), latlng.getLng()
    );
    if (dist < 1) return;
    _circle.radius = dist;

    /* 미리보기 원 업데이트 */
    if (_circle.previewCircle) {
      _circle.previewCircle.setRadius(dist);
    } else {
      _circle.previewCircle = new kakao.maps.Circle({
        map: map, center: _circle.center, radius: dist,
        strokeColor: '#044E9E', strokeOpacity: 0.75, strokeWeight: 2, strokeStyle: 'dashed',
        fillColor: '#044E9E', fillOpacity: 0.09
      });
    }

    /* 반경 라벨 (원의 동쪽 끝 위치) */
    var edgePt = _destinationPoint(_circle.center, dist, 90);
    var labelHtml = '<div style="background:rgba(4,78,158,.88);color:#fff;'
      + 'font:600 11px/1 Pretendard,sans-serif;padding:4px 9px;border-radius:20px;'
      + 'white-space:nowrap;pointer-events:none;margin-left:6px;">반경 ' + _fmtRadius(dist) + '</div>';
    if (_circle.radiusLabel) {
      _circle.radiusLabel.setPosition(edgePt);
      _circle.radiusLabel.setContent(labelHtml);
    } else {
      _circle.radiusLabel = new kakao.maps.CustomOverlay({
        map: map, position: edgePt, content: labelHtml,
        xAnchor: 0, yAnchor: 0.5, zIndex: 12
      });
    }
  }

  function finishCircle() {
    var center = _circle.center;
    var radius = _circle.radius;
    stopCircleDraw(); /* 리스너 + 미리보기 제거 (centerDot은 유지) */

    /* 확정 원 */
    _circle.finalCircle = new kakao.maps.Circle({
      map: map, center: center, radius: radius,
      strokeColor: '#044E9E', strokeOpacity: 0.9, strokeWeight: 2, strokeStyle: 'solid',
      fillColor: '#044E9E', fillOpacity: 0.12
    });

    /* 중심 마커 복원 (stopCircleDraw 후 null이 되지 않음 — centerDot은 stopCircleDraw에서 건드리지 않음) */

    /* 핀 탐색 */
    var foundPins = PINS.filter(function (pin) {
      return _pointInCircle(pin, center, radius);
    });

    var totalPinCount = PINS.filter(function (p) { return p.mile === activeMile; }).length;
    var matchedCount  = foundPins.filter(function (p) { return p.mile === activeMile; }).length;
    _filter.areaScale = totalPinCount > 0
      ? Math.max(0.05, matchedCount / totalPinCount)
      : 1.0;

    _selectAreaOption();
    refreshDisplay(activeMile);
    showAreaModal(foundPins, '반경 ' + _fmtRadius(radius));
  }

  /* ═══════════════════════════════════════════════════════════
     영역 선택 결과 모달
  ═══════════════════════════════════════════════════════════ */

  function showAreaModal(foundPins, areaDesc) {
    var modal  = document.getElementById('areaModal');
    var bd     = document.getElementById('areaModalBd');
    if (!modal || !bd) return;

    var scale       = _computeTotalScale();
    var mileDefs    = KPI_BASE[activeMile] || [];
    var mileColor   = MILE_COLORS[activeMile] || '#044E9E';
    var mileLabels  = { energy:'에너지', mobility:'모빌리티', safety:'세이프티', data:'데이터' };

    /* KPI 카드 (스케일 가능한 항목만, 최대 4개) */
    var kpiCards = mileDefs
      .filter(function(d){ return d.num !== undefined && d.scalable; })
      .slice(0, 4)
      .map(function(d) {
        var val = Math.round(d.num * scale * Math.pow(10, d.dec || 0)) / Math.pow(10, d.dec || 0);
        var numStr = val >= 1000 ? val.toLocaleString() : String(val);
        return '<div class="area-modal__kpi">'
          + '<span class="area-modal__kpi-lb">' + (d.label || d.unit) + '</span>'
          + '<div class="area-modal__kpi-vl">' + numStr + '<span class="u">' + d.unit + '</span></div>'
          + '</div>';
      }).join('');

    /* KPI 라벨 맵 */
    var labelMap = {
      energy:   ['총 발전량', '오늘 발전량', '누적 발전량', '탄소저감량'],
      mobility: ['총 운행량', '이용자 수',   '평균배차시간', '운행커버리지'],
      safety:   ['수집 건수',  '이상 감지',  '응답시간',     '설치 개소'],
      data:     ['월 수집 건수', '연동 시스템', '금일 API호출', '가동률']
    };
    var labels = labelMap[activeMile] || [];
    kpiCards = mileDefs
      .filter(function(d){ return d.num !== undefined && d.scalable; })
      .slice(0, 4)
      .map(function(d, i) {
        var val = Math.round(d.num * scale * Math.pow(10, d.dec || 0)) / Math.pow(10, d.dec || 0);
        var numStr = val >= 1000 ? val.toLocaleString() : String(val);
        return '<div class="area-modal__kpi">'
          + '<span class="area-modal__kpi-lb">' + (labels[i] || d.unit) + '</span>'
          + '<div class="area-modal__kpi-vl">' + numStr + '<span class="u">' + d.unit + '</span></div>'
          + '</div>';
      }).join('');

    /* 핀 칩 */
    var filteredPins = foundPins.filter(function(p){ return p.mile === activeMile; });
    var pinChips = filteredPins.length
      ? filteredPins.map(function(p) {
          var col = MILE_COLORS[p.mile] || mileColor;
          var statusLabel = { ok:'정상', warn:'주의', danger:'위험' };
          return '<span class="area-modal__pin-chip">'
            + '<span class="area-modal__pin-chip-dot" style="background:' + col + '"></span>'
            + p.name
            + '</span>';
        }).join('')
      : '<span style="font:400 12px/1 var(--font-sans);color:var(--fg-4);">선택 영역 내 시설물이 없습니다</span>';

    var pinsHd = mileLabels[activeMile] + ' 마일';
    if (areaDesc) pinsHd += ' · ' + areaDesc;
    pinsHd += ' · 시설 ' + filteredPins.length + '개소';

    bd.innerHTML = kpiCards
      + '<div class="area-modal__pins">'
      + '<div class="area-modal__pins-hd">' + pinsHd + '</div>'
      + '<div class="area-modal__pin-list">' + pinChips + '</div>'
      + '</div>';

    modal.classList.add('open');
  }

  function closeAreaModal() {
    var modal = document.getElementById('areaModal');
    if (modal) modal.classList.remove('open');
  }

  function initAreaModal() {
    var modal  = document.getElementById('areaModal');
    var scrim  = document.getElementById('areaModalScrim');
    var closeBtn = document.getElementById('areaModalClose');
    var cancelBtn = document.getElementById('areaModalCancel');
    var detailBtn = document.getElementById('areaModalDetail');
    if (!modal) return;
    if (scrim)    scrim.addEventListener('click', closeAreaModal);
    if (closeBtn) closeBtn.addEventListener('click', closeAreaModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAreaModal);
    if (detailBtn) detailBtn.addEventListener('click', function() {
      closeAreaModal();
      var detail = document.querySelector('.mile-detail');
      if (detail) {
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

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
