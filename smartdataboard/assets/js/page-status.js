/* =====================================================================
   광명 스마트데이터보드 · 상태 모니터링 (2026-06-17)
   ===================================================================== */
(function () {
  function __run() {

  var DPR         = window.devicePixelRatio || 1;
  var CHART_COLOR = '#1AAA5E'; /* 성능 지표 통일 녹색 */

  /* ── 차트 레이블·데이터 (3시간 구간 × 9포인트) ── */
  var CHART_LABELS = ['10:00','13:00','16:00','19:00','22:00','01:00','04:00','07:00','10:00'];

  var METRICS = {
    cpu:   { label:'CPU 사용률',    unit:'%',  data:[32,30,33,29,28,31,34,72,28], maxV:100,  warnV:70   },
    mem:   { label:'메모리 사용률', unit:'%',  data:[44,45,43,46,47,45,46,48,46], maxV:100,  warnV:80   },
    resp:  { label:'평균 응답속도', unit:'ms', data:[380,410,430,380,420,1620,510,390,410],  maxV:2000, warnV:1000 },
    avail: { label:'가용률',        unit:'%',  data:[100,100,100,100,100,99.8,99.9,100,100], maxV:100,  warnV:null }
  };

  /* ── 서비스 목록 ── */
  var SERVICES = [
    { name:'웹 서비스',     status:'ok' },
    { name:'API 서비스',    status:'ok' },
    { name:'DB 서비스',     status:'ok' },
    { name:'캐시 서비스',   status:'ok' },
    { name:'파일 스토리지', status:'ok' },
    { name:'스케줄러',      status:'ok' }
  ];

  var STLABEL = { ok:'정상', delay:'지연', err:'오류', stop:'중지' };

  /* ── 리소스 스파크라인 (2시간 구간 × 12포인트) ── */
  var RESOURCES = [
    { name:'CPU 사용률',    val:'28.6', unit:'%', spec:'8 Core 중 2.29 Core 사용',
      data:[35,32,33,31,29,28,31,34,72,45,28,28.6], color:'#0C8AE5', maxV:100 },
    { name:'메모리 사용률', val:'46.3', unit:'%', spec:'7.42 GB / 16 GB',
      data:[44,44,45,46,44,46,47,45,46,48,46,46.3], color:'#1AAA5E', maxV:100 },
    { name:'디스크 사용률', val:'35.7', unit:'%', spec:'171 GB / 480 GB',
      data:[35.4,35.5,35.5,35.6,35.5,35.6,35.7,35.6,35.7,35.7,35.7,35.7], color:'#6E74D6', maxV:100 }
  ];

  /* ── 알림 목록 ── */
  var ALERTS = [
    { time:'07:12', type:'warn', content:'CPU 사용률 72% 초과', service:'API 서비스', priority:'높음', status:'unread',
      impact:'API 응답 속도 영향 가능', action:'자동 스케일링 트리거 확인, 원인 분석 권장', owner:'시스템운영팀' },
    { time:'03:45', type:'warn', content:'API 평균 응답 시간 1.62초 초과', service:'API 서비스', priority:'높음', status:'unread',
      impact:'일부 사용자 응답 지연', action:'DB 쿼리 최적화 또는 캐시 설정 확인 권장', owner:'시스템운영팀' },
    { time:'02:00', type:'info', content:'정기 백업 완료', service:'DB 서비스', priority:'낮음', status:'done',
      impact:'없음', action:'백업 파일 보관 주기 확인', owner:'system' },
    { time:'00:30', type:'info', content:'스마트데이터보드 v1.3.2 배포 완료', service:'웹 서비스', priority:'낮음', status:'done',
      impact:'없음', action:'배포 이력 확인', owner:'admin' },
    { time:'00:00', type:'info', content:'일일 정기 점검 완료', service:'전체', priority:'낮음', status:'done',
      impact:'없음', action:'다음 점검 일정 확인', owner:'system' }
  ];

  /* ── 이벤트 막대 차트 (2시간 구간 × 12) ── */
  var BAR_LABELS = ['00','02','04','06','08','10','12','14','16','18','20','22'];
  var BAR_DATA   = [0,1,0,1,0,0,0,0,0,0,0,0];

  /* ─────────────────── 공통 툴팁 ─────────────────── */
  var ttEl   = document.getElementById('stTooltip');
  var ttTime = document.getElementById('ttTime');
  var ttDot  = document.getElementById('ttDot');
  var ttVal  = document.getElementById('ttVal');

  function showTT(e, time, val, color) {
    if (!ttEl) return;
    ttTime.textContent = time;
    ttVal.textContent  = val;
    ttDot.style.background = color || CHART_COLOR;
    var ttx = e.clientX + 14;
    var tty = e.clientY - 44;
    if (ttx + 170 > window.innerWidth)  ttx = e.clientX - 184;
    if (tty < 8) tty = e.clientY + 14;
    ttEl.style.left = ttx + 'px';
    ttEl.style.top  = tty + 'px';
    ttEl.classList.add('on');
  }

  function hideTT() {
    if (ttEl) ttEl.classList.remove('on');
  }

  /* ─────────────────── 서비스 목록 렌더링 ─────────────────── */
  var svcList = document.getElementById('svcList');
  if (svcList) {
    SERVICES.forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'st-svc';
      div.innerHTML =
        '<div class="st-svc__left">' +
          '<span class="st-svc__dot st-svc__dot--' + s.status + '"></span>' +
          '<div class="st-svc__name">' + s.name + '</div>' +
        '</div>' +
        '<span class="pill pill--' + s.status + '">' + STLABEL[s.status] + '</span>';
      svcList.appendChild(div);
    });
  }

  /* ─────────────────── 스파크라인 ─────────────────── */
  function drawSparkline(ctx, data, color, maxV, w, h, hoverIdx) {
    hoverIdx = (hoverIdx === undefined) ? -1 : hoverIdx;
    var pad = 4;
    var pts = data.map(function (v, i) {
      return {
        x: pad + (i / (data.length - 1)) * (w - pad * 2),
        y: pad + (1 - v / maxV) * (h - pad * 2)
      };
    });

    /* 그라데이션 fill */
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.lineTo(pts[pts.length - 1].x, h);
    ctx.lineTo(pts[0].x, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* 라인 */
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    /* 도트 (모든 포인트에 작은 원, hover 포인트는 크게) */
    pts.forEach(function (pt, idx) {
      var isHover = (idx === hoverIdx);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHover ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      if (isHover) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  function redrawSparkline(canvas, r, hi) {
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;
    if (!w || !h) return;
    canvas.width  = w * DPR;
    canvas.height = h * DPR;
    var ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);
    drawSparkline(ctx, r.data, r.color, r.maxV, w, h, hi);
  }

  function setupSparkHover(canvas, r) {
    var lastIdx = -1;
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var w = canvas.offsetWidth;
      var pad = 4;
      var n = r.data.length;
      var i = Math.round((mx - pad) / ((w - pad * 2) / (n - 1)));
      i = Math.max(0, Math.min(n - 1, i));
      if (i !== lastIdx) { lastIdx = i; redrawSparkline(canvas, r, i); }
      showTT(e, r.name, r.data[i].toFixed(1) + r.unit, r.color);
    });
    canvas.addEventListener('mouseleave', function () {
      if (lastIdx !== -1) { lastIdx = -1; redrawSparkline(canvas, r, -1); }
      hideTT();
    });
  }

  /* 리소스 목록 렌더링 */
  var resList = document.getElementById('resList');
  if (resList) {
    RESOURCES.forEach(function (r) {
      var cid = 'spark-' + r.name.replace(/\s/g, '');
      var div = document.createElement('div');
      div.className = 'st-res';
      div.innerHTML =
        '<div class="st-res__meta">' +
          '<div class="st-res__name">' + r.name + '</div>' +
          '<div class="st-res__val">' + r.val + '<span class="u">' + r.unit + '</span></div>' +
          '<div class="st-res__spec">' + r.spec + '</div>' +
        '</div>' +
        '<canvas class="st-res__canvas" id="' + cid + '"></canvas>';
      resList.appendChild(div);
    });

    setTimeout(function () {
      RESOURCES.forEach(function (r) {
        var canvas = document.getElementById('spark-' + r.name.replace(/\s/g, ''));
        if (!canvas) return;
        redrawSparkline(canvas, r, -1);
        setupSparkHover(canvas, r);
      });
    }, 80);
  }

  /* ─────────────────── 라인 차트 ─────────────────── */
  var lineCanvas = document.getElementById('lineChart');
  var activeMetric = 'cpu';
  var lineHoverIdx = -1;

  function drawLineChart(metricKey, hoverIdx) {
    if (!lineCanvas) return;
    hoverIdx = (hoverIdx === undefined) ? -1 : hoverIdx;
    var m  = METRICS[metricKey];
    var w  = lineCanvas.offsetWidth  || 400;
    var h  = lineCanvas.offsetHeight || 220;
    lineCanvas.width  = w * DPR;
    lineCanvas.height = h * DPR;
    var ctx = lineCanvas.getContext('2d');
    ctx.scale(DPR, DPR);

    var padL = 42, padR = 18, padT = 16, padB = 10;
    var cw = w - padL - padR;
    var ch = h - padT - padB;
    var data = m.data;
    var isAvail = (metricKey === 'avail');
    var isResp  = (metricKey === 'resp');
    var minV  = isAvail ? 99.5 : 0;
    var range = m.maxV - minV;

    function xOf(i) { return padL + (i / (data.length - 1)) * cw; }
    function yOf(v) { return padT + (1 - (v - minV) / range) * ch; }

    /* 그리드 + Y 라벨 */
    var gridCount = 4;
    ctx.strokeStyle = '#EEF1F6';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#B0BAC8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (var g = 0; g <= gridCount; g++) {
      var gv = minV + (range / gridCount) * g;
      var gy = yOf(gv);
      ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(w - padR, gy); ctx.stroke();
      var lbl = isResp ? Math.round(gv).toString() : (isAvail ? gv.toFixed(1) : Math.round(gv).toString());
      ctx.fillText(lbl, padL - 5, gy + 4);
    }

    /* 경고 임계선 */
    if (m.warnV) {
      ctx.save();
      ctx.strokeStyle = '#ED8B1655';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, yOf(m.warnV)); ctx.lineTo(w - padR, yOf(m.warnV));
      ctx.stroke();
      ctx.restore();
    }

    /* 그라데이션 영역 */
    var grad = ctx.createLinearGradient(0, padT, 0, h - padB);
    grad.addColorStop(0, CHART_COLOR + '35');
    grad.addColorStop(1, CHART_COLOR + '00');
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0]));
    for (var i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
    ctx.lineTo(xOf(data.length - 1), padT + ch);
    ctx.lineTo(xOf(0), padT + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* 라인 */
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0]));
    for (var k = 1; k < data.length; k++) ctx.lineTo(xOf(k), yOf(data[k]));
    ctx.strokeStyle = CHART_COLOR;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    /* hover: 수직선 + 강조 도트 */
    if (hoverIdx >= 0 && hoverIdx < data.length) {
      var hx = xOf(hoverIdx);
      var hy = yOf(data[hoverIdx]);
      ctx.save();
      ctx.strokeStyle = '#CDD5E0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(hx, padT); ctx.lineTo(hx, padT + ch); ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fillStyle = CHART_COLOR;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    /* chart meta 업데이트 */
    var last = data[data.length - 1];
    var meta = document.getElementById('chartMeta');
    if (meta) {
      var dispVal = isResp ? last + m.unit : (isAvail ? last.toFixed(2) + m.unit : last.toFixed(1) + m.unit);
      meta.innerHTML = '<b>' + dispVal + '</b>' + m.label + ' (현재)';
    }

    /* X 라벨 */
    var xlabels = document.getElementById('chartXLabels');
    if (xlabels) {
      xlabels.innerHTML = CHART_LABELS.map(function (l) {
        return '<span>' + l + '</span>';
      }).join('');
    }
  }

  /* 탭 전환 */
  document.querySelectorAll('.st-tabs .st-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.st-tabs .st-tab').forEach(function (t) {
        t.classList.remove('on'); t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('on'); tab.setAttribute('aria-selected', 'true');
      activeMetric = tab.dataset.metric;
      lineHoverIdx = -1;
      drawLineChart(activeMetric, -1);
    });
  });

  /* 라인 차트 hover */
  if (lineCanvas) {
    lineCanvas.addEventListener('mousemove', function (e) {
      var rect = lineCanvas.getBoundingClientRect();
      var mx   = e.clientX - rect.left;
      var padL = 42, padR = 18;
      var cw   = lineCanvas.offsetWidth - padL - padR;
      var n    = CHART_LABELS.length;
      var i    = Math.round((mx - padL) / cw * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      var dist = Math.abs(mx - (padL + (i / (n - 1)) * cw));
      if (dist <= 40 && mx >= padL && mx <= lineCanvas.offsetWidth - padR) {
        if (i !== lineHoverIdx) { lineHoverIdx = i; drawLineChart(activeMetric, i); }
        var m = METRICS[activeMetric];
        var v = m.data[i];
        var dispVal = m.unit === 'ms'
          ? v + 'ms'
          : (activeMetric === 'avail' ? v.toFixed(2) : v.toFixed(1)) + m.unit;
        showTT(e, CHART_LABELS[i], m.label + ':  ' + dispVal, CHART_COLOR);
      } else {
        if (lineHoverIdx !== -1) { lineHoverIdx = -1; drawLineChart(activeMetric, -1); hideTT(); }
      }
    });
    lineCanvas.addEventListener('mouseleave', function () {
      if (lineHoverIdx !== -1) { lineHoverIdx = -1; drawLineChart(activeMetric, -1); }
      hideTT();
    });
  }

  /* ─────────────────── 막대 차트 ─────────────────── */
  var barCanvas = document.getElementById('barChart');
  var barHoverIdx = -1;

  function drawBarChart(ctx, w, h, hoverIdx) {
    hoverIdx = (hoverIdx === undefined) ? -1 : hoverIdx;
    var padL = 24, padR = 10, padT = 10, padB = 22;
    var cw = w - padL - padR;
    var ch = h - padT - padB;
    var maxV  = Math.max.apply(null, BAR_DATA) || 1;
    var slotW = cw / BAR_DATA.length;
    var barW  = slotW * 0.55;
    var barOff = (slotW - barW) / 2;

    /* 그리드 */
    ctx.strokeStyle = '#EEF1F6';
    ctx.lineWidth = 1;
    for (var g = 0; g <= maxV; g++) {
      var gy = padT + (1 - g / maxV) * ch;
      ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(w - padR, gy); ctx.stroke();
    }

    /* 막대 */
    BAR_DATA.forEach(function (v, i) {
      var x  = padL + slotW * i + barOff;
      var bh = v > 0 ? (v / maxV) * ch : 2;
      var y  = padT + ch - bh;
      var isHv = (i === hoverIdx);
      if (v > 0) {
        ctx.fillStyle = isHv ? '#B86A05' : '#ED8B16';
      } else {
        ctx.fillStyle = isHv ? '#D8DEE8' : '#EEF1F6';
      }
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, bh, v > 0 ? [3, 3, 0, 0] : [2, 2, 0, 0]);
      } else {
        ctx.rect(x, y, barW, bh);
      }
      ctx.fill();

      /* X 라벨 */
      ctx.fillStyle = '#B0BAC8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(BAR_LABELS[i], x + barW / 2, h - padB + 14);
    });
  }

  function redrawBarChart(hi) {
    if (!barCanvas) return;
    var w = barCanvas.offsetWidth;
    var h = barCanvas.offsetHeight;
    if (!w || !h) return;
    barCanvas.width  = w * DPR;
    barCanvas.height = h * DPR;
    var ctx = barCanvas.getContext('2d');
    ctx.scale(DPR, DPR);
    drawBarChart(ctx, w, h, hi);
  }

  if (barCanvas) {
    barCanvas.addEventListener('mousemove', function (e) {
      var rect = barCanvas.getBoundingClientRect();
      var mx   = e.clientX - rect.left;
      var padL = 24, padR = 10;
      var cw   = barCanvas.offsetWidth - padL - padR;
      var slotW = cw / BAR_DATA.length;
      var i = Math.floor((mx - padL) / slotW);
      if (i >= 0 && i < BAR_DATA.length && mx >= padL) {
        if (i !== barHoverIdx) { barHoverIdx = i; redrawBarChart(i); }
        var nextH = (parseInt(BAR_LABELS[i]) + 2) % 24;
        var timeRange = BAR_LABELS[i] + ':00 ~ ' + String(nextH).padStart(2, '0') + ':00';
        var valText = BAR_DATA[i] > 0 ? '경고 ' + BAR_DATA[i] + '건' : '이벤트 없음';
        showTT(e, timeRange, valText, '#ED8B16');
      } else {
        if (barHoverIdx !== -1) { barHoverIdx = -1; redrawBarChart(-1); hideTT(); }
      }
    });
    barCanvas.addEventListener('mouseleave', function () {
      if (barHoverIdx !== -1) { barHoverIdx = -1; redrawBarChart(-1); }
      hideTT();
    });
  }

  /* ─────────────────── 알림 테이블 ─────────────────── */
  var PAGE_SIZE   = 5;
  var currentPage = 1;

  var TYPE_CLS = { warn:'st-type-warn', err:'st-type-err', info:'st-type-info' };
  var TYPE_LBL = { warn:'경고', err:'오류', info:'정보' };
  var ST_LBL   = { unread:'미확인', done:'완료' };

  function renderAlerts(page) {
    var body = document.getElementById('alertBody');
    if (!body) return;
    body.innerHTML = '';
    var start = (page - 1) * PAGE_SIZE;
    var slice = ALERTS.slice(start, start + PAGE_SIZE);
    if (!slice.length) {
      body.innerHTML = '<tr class="tbl__empty"><td colspan="6"><i data-lucide="inbox"></i>알림이 없습니다.</td></tr>';
      lucide.createIcons(); return;
    }
    slice.forEach(function (a) {
      var tr = document.createElement('tr');
      if (a.status === 'unread') tr.className = 'st-alert-row--unread';
      tr.style.cursor = 'pointer';
      tr.innerHTML =
        '<td class="num" style="font-size:13px">' + a.time + '</td>' +
        '<td><span class="' + (TYPE_CLS[a.type] || '') + '">' + (TYPE_LBL[a.type] || '정보') + '</span></td>' +
        '<td class="l" style="font-weight:' + (a.status === 'unread' ? '700' : '500') + '">' + a.content + '</td>' +
        '<td style="font-size:13px">' + a.service + '</td>' +
        '<td><span class="pill ' + (a.status === 'unread' ? 'pill--delay' : 'pill--ok') + '">' + ST_LBL[a.status] + '</span></td>' +
        '<td style="text-align:center"><button class="tbtn tbtn--sm" type="button">보기</button></td>';
      tr.querySelector('.tbtn').addEventListener('click', function (ev) { ev.stopPropagation(); openDrawer(a); });
      tr.addEventListener('click', function () { openDrawer(a); });
      body.appendChild(tr);
    });
    lucide.createIcons();
    renderPagination(page);
  }

  function renderPagination(current) {
    var pg = document.getElementById('pagination');
    if (!pg) return;
    var totalPages = Math.ceil(ALERTS.length / PAGE_SIZE);
    pg.innerHTML = '';
    var prev = document.createElement('button');
    prev.className = 'pg-btn'; prev.innerHTML = '&#8249;'; prev.disabled = (current === 1);
    prev.addEventListener('click', function () { if (currentPage > 1) { currentPage--; renderAlerts(currentPage); } });
    pg.appendChild(prev);
    for (var p = 1; p <= totalPages; p++) {
      (function (n) {
        var btn = document.createElement('button');
        btn.className = 'pg-btn' + (n === current ? ' on' : '');
        btn.textContent = n;
        btn.addEventListener('click', function () { currentPage = n; renderAlerts(n); });
        pg.appendChild(btn);
      })(p);
    }
    var next = document.createElement('button');
    next.className = 'pg-btn'; next.innerHTML = '&#8250;';
    next.disabled = (current === Math.ceil(ALERTS.length / PAGE_SIZE));
    next.addEventListener('click', function () {
      var tot = Math.ceil(ALERTS.length / PAGE_SIZE);
      if (currentPage < tot) { currentPage++; renderAlerts(currentPage); }
    });
    pg.appendChild(next);
  }

  /* ─────────────────── 드로어 ─────────────────── */
  var drawer = document.getElementById('drawer');
  var scrim  = document.getElementById('scrim');

  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  function openDrawer(a) {
    setText('f_time',     a.time + ' (2026-06-17)');
    setText('f_type',     TYPE_LBL[a.type] || '정보');
    setText('f_content',  a.content);
    setText('f_service',  a.service);
    setText('f_priority', a.priority || '보통');
    setText('f_impact',   a.impact   || '—');
    setText('f_action',   a.action   || '—');
    setText('f_owner',    a.owner    || '—');
    var fs = document.getElementById('f_status');
    if (fs) {
      fs.innerHTML = '<span class="pill ' + (a.status === 'unread' ? 'pill--delay' : 'pill--ok') + '">' + ST_LBL[a.status] + '</span>';
    }
    var dwMark = document.getElementById('dwMarkBtn');
    if (dwMark) {
      dwMark.onclick = function () { a.status = 'done'; renderAlerts(currentPage); closeDrawer(); };
    }
    lucide.createIcons();
    drawer.classList.add('on'); scrim.classList.add('on');
    drawer.setAttribute('aria-hidden', 'false');
    var closeBtn = document.getElementById('dwClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('on'); scrim.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* 전체 확인 */
  var markAllBtn = document.getElementById('markAllBtn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', function () {
      ALERTS.forEach(function (a) { a.status = 'done'; });
      renderAlerts(currentPage);
    });
  }

  /* 새로고침 */
  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      var now = new Date();
      var p = function (n) { return String(n).padStart(2, '0'); };
      var el = document.getElementById('updTime');
      if (el) el.textContent =
        now.getFullYear() + '-' + p(now.getMonth() + 1) + '-' + p(now.getDate()) +
        ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds());
      var ico = this.querySelector('[data-lucide]');
      if (ico) {
        ico.style.transition = 'transform .6s';
        ico.style.transform  = 'rotate(360deg)';
        setTimeout(function () { ico.style.transition = 'none'; ico.style.transform = 'rotate(0)'; }, 650);
      }
    });
  }

  /* ─────────────────── 초기 렌더링 ─────────────────── */
  renderAlerts(1);

  setTimeout(function () {
    drawLineChart('cpu', -1);
    redrawBarChart(-1);
  }, 120);

  } /* __run */

  if (window.GMSB_SHELL_READY) __run();
  else document.addEventListener('gmsb:shell-ready', __run, { once: true });
})();
