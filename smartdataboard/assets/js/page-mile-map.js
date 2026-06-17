/* =====================================================================
   광명 스마트데이터보드 · 4종 마일별 데이터 지도  (Kakao Maps v3)
   ===================================================================== */
(function () {
  'use strict';

  var BOUNDARY_COORDS = [
    [37.4650, 126.8450], [37.4720, 126.8600], [37.4780, 126.8780],
    [37.4820, 126.8920], [37.4860, 126.9050], [37.4780, 126.9120],
    [37.4620, 126.9080], [37.4480, 126.9020], [37.4350, 126.8980],
    [37.4220, 126.8880], [37.4180, 126.8720], [37.4200, 126.8560],
    [37.4280, 126.8430], [37.4420, 126.8380], [37.4540, 126.8350],
    [37.4620, 126.8380], [37.4650, 126.8450]
  ];

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
    { id:'e1', mile:'energy',   name:'광명역 태양광 발전소',    type:'태양광 발전', lat:37.4231, lng:126.8642, status:'ok',
      today:'34.2 MWh', accum:'1,234 MWh', lastSync:'2026-06-17 09:28', addr:'경기도 광명시 일직동 346' },
    { id:'e2', mile:'energy',   name:'광명스카이돔 태양광',      type:'태양광 발전', lat:37.4680, lng:126.8660, status:'ok',
      today:'22.1 MWh', accum:'856 MWh',   lastSync:'2026-06-17 09:25', addr:'경기도 광명시 철산동 460' },
    { id:'e3', mile:'energy',   name:'철산동 ESS',               type:'에너지 저장', lat:37.4780, lng:126.8870, status:'warn',
      today:'—',         accum:'456 MWh',   lastSync:'2026-06-17 08:55', addr:'경기도 광명시 철산동 12-4' },
    { id:'e4', mile:'energy',   name:'소하동 태양광',            type:'태양광 발전', lat:37.4420, lng:126.8780, status:'ok',
      today:'18.3 MWh', accum:'612 MWh',   lastSync:'2026-06-17 09:27', addr:'경기도 광명시 소하동 1212' },
    { id:'e5', mile:'energy',   name:'일직동 풍력터빈',          type:'풍력 발전',  lat:37.4320, lng:126.8550, status:'ok',
      today:'41.6 MWh', accum:'1,876 MWh', lastSync:'2026-06-17 09:30', addr:'경기도 광명시 일직동 산12' },
    { id:'m1', mile:'mobility', name:'광명역 EV-DRT 거점',       type:'EV-DRT',     lat:37.4245, lng:126.8660, status:'ok',
      today:'142회',    accum:'4,820회',   lastSync:'2026-06-17 09:29', addr:'경기도 광명시 일직동 KTX광명역' },
    { id:'m2', mile:'mobility', name:'철산역 공유전기차',         type:'공유 EV',    lat:37.4795, lng:126.8855, status:'ok',
      today:'38회',     accum:'1,240회',   lastSync:'2026-06-17 09:28', addr:'경기도 광명시 철산동 철산역' },
    { id:'m3', mile:'mobility', name:'하안동 마이크로버스',       type:'마이크로버스',lat:37.4460, lng:126.8720, status:'ok',
      today:'95회',     accum:'3,120회',   lastSync:'2026-06-17 09:25', addr:'경기도 광명시 하안동 320' },
    { id:'m4', mile:'mobility', name:'소하동 전동킥보드',         type:'전동킥보드', lat:37.4380, lng:126.8800, status:'warn',
      today:'21회',     accum:'780회',     lastSync:'2026-06-17 08:40', addr:'경기도 광명시 소하동 1100' },
    { id:'s1', mile:'safety',   name:'철산동 스마트폴 1',         type:'스마트폴',   lat:37.4820, lng:126.8820, status:'ok',
      today:'감지 12건', accum:'1,520건',  lastSync:'2026-06-17 09:30', addr:'경기도 광명시 철산동 102' },
    { id:'s2', mile:'safety',   name:'하안동 스마트CCTV',         type:'스마트CCTV', lat:37.4500, lng:126.8760, status:'ok',
      today:'감지 8건',  accum:'1,210건',  lastSync:'2026-06-17 09:29', addr:'경기도 광명시 하안동 150' },
    { id:'s3', mile:'safety',   name:'소하동 비상벨',             type:'비상벨',     lat:37.4410, lng:126.8830, status:'danger',
      today:'대응 2건',  accum:'820건',    lastSync:'2026-06-17 09:10', addr:'경기도 광명시 소하동 620' },
    { id:'s4', mile:'safety',   name:'광명역 침수감지',           type:'침수감지',   lat:37.4280, lng:126.8620, status:'ok',
      today:'감지 0건',  accum:'120건',    lastSync:'2026-06-17 09:28', addr:'경기도 광명시 일직동 400' },
    { id:'d1', mile:'data',     name:'광명 통합데이터허브',       type:'데이터 허브', lat:37.4550, lng:126.8700, status:'ok',
      today:'수집 1,520건', accum:'27,480건', lastSync:'2026-06-17 09:30', addr:'경기도 광명시 광명동 행정타운' },
    { id:'d2', mile:'data',     name:'에너지 데이터서버',         type:'데이터 서버', lat:37.4620, lng:126.8640, status:'ok',
      today:'수집 820건',  accum:'12,210건', lastSync:'2026-06-17 09:28', addr:'경기도 광명시 광명동 145' },
    { id:'d3', mile:'data',     name:'모빌리티 데이터서버',       type:'데이터 서버', lat:37.4480, lng:126.8740, status:'warn',
      today:'수집 410건',  accum:'8,820건',  lastSync:'2026-06-17 08:50', addr:'경기도 광명시 하안동 200' }
  ];

  var CHART_DATA = {
    energy: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[100,180,240,310,350], color:'#0C8AE5' },
      bar:   { labels:['광명역','스카이돔','철산동','소하동','일직동'], values:[170,110,130,110,150], color:'#0C8AE5' },
      donut: { segments:[{label:'상계', value:62, color:'#044E9E'},{label:'거래', value:38, color:'#FFB114'}] }
    },
    mobility: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[8000,9200,10400,11600,12480], color:'#1AAA5E' },
      bar:   { labels:['광명역','철산역','하안동','소하동','일직동'], values:[142,95,120,80,60], color:'#1AAA5E' },
      donut: { segments:[{label:'EV-DRT', value:58, color:'#044E9E'},{label:'공유EV', value:42, color:'#1AAA5E'}] }
    },
    safety: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[18000,21000,23500,25800,27480], color:'#ED8B16' },
      bar:   { labels:['스마트폴','스마트CCTV','비상벨','보행안전','침수감지'], values:[1520,1210,820,410,120], color:'#ED8B16' },
      donut: { segments:[{label:'스마트폴', value:58, color:'#044E9E'},{label:'기타', value:42, color:'#F05F42'}] }
    },
    data: {
      line:  { labels:['1월','2월','3월','4월','5월'], values:[16000,19000,22000,24800,27480], color:'#6E74D6' },
      bar:   { labels:['통합플랫폼','에너지','모빌리티','세이프티','시민포털'], values:[1520,1210,820,410,120], color:'#6E74D6' },
      donut: { segments:[
        {label:'센서 데이터', value:48, color:'#7153DB'},
        {label:'운영 데이터', value:32, color:'#063A74'},
        {label:'분석 데이터', value:20, color:'#FFB114'}
      ]}
    }
  };

  var activeMile = 'energy';
  var map = null;
  var markerRefs = [];
  var boundaryPolygon = null;
  var filterMileLayer = { energy:true, mobility:true, safety:true, data:true };
  var filterStatus    = { ok:true, warn:true, danger:true };

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
    initFilters();
    initSearch();
    initTabs();
    initMapControls();
    initPopup();
    initCharts('energy');
    if (window.lucide) lucide.createIcons();
  }

  function initMap() {
    var container = document.getElementById('gisMap');
    map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.454, 126.878),
      level: 6
    });
    map.setMinLevel(1);
    map.setMaxLevel(12);

    var paths = BOUNDARY_COORDS.map(function (c) {
      return new kakao.maps.LatLng(c[0], c[1]);
    });
    boundaryPolygon = new kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeWeight: 2.5,
      strokeColor: '#044E9E',
      strokeOpacity: 0.85,
      fillColor: '#044E9E',
      fillOpacity: 0.05
    });

    PINS.forEach(function (pin) { addMarker(pin); });
  }

  function buildPinEl(pin) {
    var borderColor = pin.status === 'ok' ? '#fff'
      : (pin.status === 'warn' ? '#ED8B16' : '#E0483D');
    var wrap = document.createElement('div');
    wrap.className = 'lf-pin-wrap';
    wrap.innerHTML =
      '<div class="lf-pin lf-pin--' + pin.mile + '" style="border-color:' + borderColor + ';cursor:pointer">'
      + MILE_ICONS_SVG[pin.mile] + '</div>';
    return wrap;
  }

  function addMarker(pin) {
    var el = buildPinEl(pin);
    el.addEventListener('click', function () { openPopup(pin); });
    var overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(pin.lat, pin.lng),
      content: el,
      map: map,
      xAnchor: 0.5,
      yAnchor: 1.0,
      zIndex: 1
    });
    markerRefs.push({ pin: pin, overlay: overlay });
  }

  function applyMarkerFilter() {
    markerRefs.forEach(function (ref) {
      var p = ref.pin;
      ref.overlay.setMap((filterMileLayer[p.mile] && filterStatus[p.status]) ? map : null);
    });
  }

  function initFilters() {
    document.querySelectorAll('input[name="mileType"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (this.checked) setActiveMile(this.value);
      });
    });
    var boundaryChk = document.querySelector('input[data-layer="boundary"]');
    if (boundaryChk) {
      boundaryChk.addEventListener('change', function () {
        boundaryPolygon.setMap(this.checked ? map : null);
      });
    }
    document.querySelectorAll('input[data-layer-mile]').forEach(function (chk) {
      chk.addEventListener('change', function () {
        filterMileLayer[this.dataset.layerMile] = this.checked;
        applyMarkerFilter();
      });
    });
    document.querySelectorAll('input[data-status]').forEach(function (chk) {
      chk.addEventListener('change', function () {
        filterStatus[this.dataset.status] = this.checked;
        applyMarkerFilter();
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
      if (e.key === 'Escape') closePopup();
    });
  }

  function openPopup(pin) {
    var badge = document.getElementById('popupBadge');
    badge.style.background = MILE_COLORS[pin.mile];
    badge.innerHTML = MILE_ICONS_SVG[pin.mile];
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
      map.setCenter(new kakao.maps.LatLng(37.454, 126.878));
      map.setLevel(6);
    });
    document.getElementById('btnClearSel').addEventListener('click', function () {
      closePopup();
      var si = document.getElementById('gisSearchInput');
      if (si) { si.value = ''; closeDropdown(); }
    });
    document.getElementById('btnExport').addEventListener('click', function () { alert('지도 내보내기 기능은 준비 중입니다.'); });
    document.getElementById('btnShare').addEventListener('click', function () { alert('공유이동 기능은 준비 중입니다.'); });
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
    document.querySelectorAll('.mile-tab').forEach(function (t) {
      var on = t.dataset.mile === mile;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.mile-pane').forEach(function (p) {
      p.classList.toggle('on', p.id === 'pane-' + mile);
    });
    setTimeout(function () { initCharts(mile); }, 40);
    if (!map) return;
    var milePins = PINS.filter(function (p) { return p.mile === mile; });
    if (!milePins.length) return;
    var bounds = new kakao.maps.LatLngBounds();
    milePins.forEach(function (p) { bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)); });
    map.setBounds(bounds, 40, 40, 40, 40);
  }

  function initCharts(mile) {
    var d = CHART_DATA[mile];
    drawLineChart(mile, d.line);
    drawBarChart(mile, d.bar);
    drawDonutChart(mile, d.donut);
  }

  function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    return { ctx:ctx, w:rect.width, h:rect.height };
  }

  function drawLineChart(mile, data) {
    var canvas = document.getElementById(mile + 'LineChart'); if (!canvas) return;
    var s = setupCanvas(canvas), ctx = s.ctx, W = s.w, H = s.h;
    var pad = {t:16,r:12,b:8,l:44}, aw = W-pad.l-pad.r, ah = H-pad.t-pad.b;
    var mx = Math.max.apply(null, data.values) * 1.15, n = data.values.length;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.25,.5,.75,1].forEach(function(t){
      var y=pad.t+ah*(1-t);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke();
      ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right';
      var v=Math.round(mx*t); ctx.fillText(v>=1000?(v/1000).toFixed(1)+'k':v, pad.l-5, y+4);
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
    if(labelsEl) labelsEl.innerHTML=data.labels.map(function(l){return '<span>'+l+'</span>';}).join('');
  }

  function drawBarChart(mile, data) {
    var canvas=document.getElementById(mile+'BarChart'); if(!canvas) return;
    var s=setupCanvas(canvas), ctx=s.ctx, W=s.w, H=s.h;
    var pad={t:10,r:12,b:30,l:44}, aw=W-pad.l-pad.r, ah=H-pad.t-pad.b;
    var mx=Math.max.apply(null,data.values)*1.2, n=data.labels.length;
    var gap=aw/n, barW=Math.floor(gap*0.55);
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='#EEF1F6'; ctx.lineWidth=1;
    [0,.5,1].forEach(function(t){ var y=pad.t+ah*(1-t); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+aw,y); ctx.stroke(); ctx.fillStyle='#B0BAC8'; ctx.font='10px sans-serif'; ctx.textAlign='right'; var v=Math.round(mx*t); ctx.fillText(v>=1000?(v/1000).toFixed(1)+'k':v,pad.l-5,y+4); });
    data.values.forEach(function(v,i){
      var x=pad.l+gap*i+(gap-barW)/2, bh=(v/mx)*ah, y=pad.t+ah-bh, r=Math.min(5,barW/2,bh/2);
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+barW-r,y); ctx.quadraticCurveTo(x+barW,y,x+barW,y+r); ctx.lineTo(x+barW,y+bh); ctx.lineTo(x,y+bh); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
      ctx.fillStyle=data.color; ctx.fill();
      ctx.fillStyle='#8A95A6'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      var lbl=data.labels[i]; if(lbl.length>5) lbl=lbl.slice(0,4)+'…';
      ctx.fillText(lbl, x+barW/2, pad.t+ah+16);
    });
  }

  function drawDonutChart(mile, data) {
    var canvas=document.getElementById(mile+'DonutChart'); if(!canvas) return;
    var dpr=window.devicePixelRatio||1, size=140;
    canvas.width=size*dpr; canvas.height=size*dpr; canvas.style.width=size+'px'; canvas.style.height=size+'px';
    var ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr);
    var cx=size/2, cy=size/2, r=size*0.42, inner=r*0.62;
    var total=data.segments.reduce(function(a,s){return a+s.value;},0), angle=-Math.PI/2;
    data.segments.forEach(function(seg){ var sweep=(seg.value/total)*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+sweep); ctx.closePath(); ctx.fillStyle=seg.color; ctx.fill(); angle+=sweep; });
    ctx.beginPath(); ctx.arc(cx,cy,inner,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    var legendEl=document.getElementById(mile+'DonutLegend');
    if(legendEl) legendEl.innerHTML=data.segments.map(function(seg){ return '<div class="donut-legend-item"><div class="donut-legend-item__left"><span class="donut-legend-dot" style="background:'+seg.color+'"></span><span>'+seg.label+'</span></div><span class="donut-legend-pct">'+seg.value+'%</span></div>'; }).join('');
  }

  init();
})();
