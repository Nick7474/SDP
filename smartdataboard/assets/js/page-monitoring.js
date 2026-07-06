/* =====================================================================
   광명 스마트데이터보드 · 데이터 모니터링
   ===================================================================== */
(function () {
  function __run() {

  var TIMES = ['00시','02시','04시','06시','08시','10시','12시','14시','16시','18시','20시','22시'];
  var STLABEL = { ok:'정상', delay:'지연', err:'장애', stop:'중지', wait:'수집 대기' };

  /* ── 날짜 헬퍼 ── */
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtDate(d) { return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
  function fmtTime(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function todayStr() { return fmtDate(new Date()); }
  function dateByOffset(n) { var d = new Date(); d.setDate(d.getDate() - n); return fmtDate(d); }

  var selectedDate = todayStr();

  /* ── 7개 파트너사 시스템 ── */
  var ROWS = [
    { name:'신재생에너지 가상거래', type:'에너지',   method:'REST API', dept:'에너지과',   partner:'케빈랩',
      cells:['o','o','o','o','o','o','o','o','o','o','o','o'] },
    { name:'IoT 그린배리어',        type:'세이프티', method:'MQTT',     dept:'안전총괄과', partner:'영진기술',
      cells:['o','o','o','o','o','o','o','d','o','o','o','o'] },
    { name:'AIoT 침수홍수',         type:'세이프티', method:'LoRa',     dept:'안전총괄과', partner:'스파이어',
      cells:['o','o','o','o','o','o','o','o','o','d','o','o'] },
    { name:'친환경 배달',           type:'모빌리티', method:'API',      dept:'교통과',     partner:'우아한형제들',
      cells:['o','o','o','o','o','o','o','o','o','o','w','w'] },
    { name:'전기차 카셰어링',       type:'모빌리티', method:'REST API', dept:'교통과',     partner:'기아',
      cells:['o','o','o','o','o','o','o','o','o','o','o','o'] },
    { name:'친환경 DRT',            type:'모빌리티', method:'REST API', dept:'교통과',     partner:'현대',
      cells:['o','o','o','o','o','o','o','o','e','o','o','o'] },
    { name:'탄소거래플랫폼',        type:'에너지',   method:'REST API', dept:'환경과',     partner:'그리너리/후시파트너스',
      cells:['o','o','o','o','o','o','o','o','o','o','o','o'] }
  ];

  var CODE = {
    err:  { code:'500 / TIMEOUT', msg:'원천 시스템 응답 없음 (연결 타임아웃)' },
    delay:{ code:'200 (지연)',    msg:'응답 지연 — 수집 주기 초과 (기준 1분)' },
    stop: { code:'-',             msg:'수집 일시 중지 (점검/계약 만료)' },
    wait: { code:'202 (대기)',    msg:'배치 수집 대기열에 적재됨 (야간 배치 예정)' },
    ok:   { code:'200',           msg:'정상 수집 완료' }
  };
  var CNT = { ok:'정상 수집 완료', delay:'지연 건 확인 필요', err:'0건 (수집 실패)', stop:'0건', wait:'배치 대기 중' };
  var pillCls = { ok:'pill--ok', delay:'pill--delay', err:'pill--err', stop:'pill--stop', wait:'pill--wait' };

  /* ═══════════════════════════════════════════════════════════════
     이상 감지 섹션
     ═══════════════════════════════════════════════════════════════ */
  var ANOMALIES = [
    { name:'DRT 운행 데이터',       type:'장애',    detail:'원천시스템 응답 없음 (TIMEOUT)',        detectedAt:'14:32', duration:'1시간 12분', status:'err',   partner:'현대',           dept:'교통과' },
    { name:'침수·수위 데이터',      type:'지연',    detail:'수집 주기 초과 (기준 1분, 현재 19분)',  detectedAt:'15:02', duration:'20분',       status:'delay', partner:'스파이어',        dept:'안전총괄과' },
    { name:'친환경 배달 현황',      type:'수집대기', detail:'야간 배치 처리 대기 중',               detectedAt:'11:00', duration:'4시간 7분',  status:'wait',  partner:'우아한형제들',    dept:'교통과' }
  ];

  function renderAnomalies() {
    var body = document.getElementById('anomalyBody');
    var cnt  = document.getElementById('anomalyCount');
    if (!body) return;
    if (ANOMALIES.length === 0) {
      body.innerHTML = '<tr class="tbl__empty"><td colspan="7"><i data-lucide="inbox"></i>이상 감지된 항목이 없습니다.</td></tr>';
      if (cnt) { cnt.textContent = '0건'; cnt.className = 'pill pill--ok'; }
      lucide.createIcons();
      return;
    }
    if (cnt) cnt.textContent = ANOMALIES.length + '건';
    body.innerHTML = ANOMALIES.map(function (a) {
      var pc = pillCls[a.status] || 'pill--stop';
      return '<tr data-idx="' + ANOMALIES.indexOf(a) + '">' +
        '<td class="l" style="font-weight:600;color:var(--fg-1)">' + a.name + '</td>' +
        '<td><span class="pill ' + pc + '">' + a.type + '</span></td>' +
        '<td style="font:400 13px/1.5 var(--font-sans);color:var(--fg-2)">' + a.detail + '</td>' +
        '<td class="num">' + a.detectedAt + '</td>' +
        '<td class="num">' + a.duration + '</td>' +
        '<td style="font:400 13px/1 var(--font-sans);color:var(--fg-2)">' + a.dept + '</td>' +
        '<td><button class="tbtn tbtn--sm" type="button">상세</button></td>' +
      '</tr>';
    }).join('');
    body.querySelectorAll('tr[data-idx]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var a = ANOMALIES[parseInt(tr.dataset.idx)];
        openDrawer({ name:a.name, type:a.type, method:'-', partner:a.partner,
          time:a.detectedAt, status:a.status, dept:a.dept, cnt:'-', last:'-' });
      });
    });
    lucide.createIcons();
  }

  /* ═══════════════════════════════════════════════════════════════
     히트맵 렌더링 + 툴팁
     ═══════════════════════════════════════════════════════════════ */
  var tooltip = document.getElementById('hmTooltip');

  function showTooltip(e, html) {
    if (!tooltip) return;
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    posTooltip(e);
  }
  function posTooltip(e) {
    if (!tooltip) return;
    var x = e.clientX + 12, y = e.clientY - 10;
    var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
    if (x + tw > window.innerWidth - 12) x = e.clientX - tw - 12;
    if (y + th > window.innerHeight - 12) y = e.clientY - th - 10;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }
  function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
  }

  var stColor = { ok:'#4ade80', delay:'#fbbf24', err:'#f87171', stop:'#94a3b8', wait:'#94a3b8' };

  function renderHeatmap(dateStr) {
    var hm = document.getElementById('heatmap');
    if (!hm) return;
    var isToday = (dateStr === todayStr());
    var now = new Date();
    var curIdx = isToday ? Math.floor(now.getHours() / 2) : 12;

    /* 기존 데이터 행 제거 (헤더 13개 유지) */
    var kids = Array.prototype.slice.call(hm.children);
    kids.slice(13).forEach(function (el) { if (!el.id) el.remove(); });

    ROWS.forEach(function (r) {
      var rl = document.createElement('div');
      rl.className = 'hm__rl'; rl.textContent = r.name; hm.appendChild(rl);
      r.cells.forEach(function (c, i) {
        var map = { o:'ok', d:'delay', e:'err', s:'stop', w:'wait' };
        var st = map[c] || 'ok';
        var isFuture = isToday && (i > curIdx);

        var cell = document.createElement('div'); cell.className = 'hm__cell';
        var bar = document.createElement('button');
        bar.className = 'hm__bar ' + (isFuture ? 'hm__bar--future' : 'hm__bar--' + st);
        bar.setAttribute('type', 'button');
        bar.dataset.name    = r.name;
        bar.dataset.type    = r.type;
        bar.dataset.method  = r.method;
        bar.dataset.partner = r.partner;
        bar.dataset.time    = TIMES[i];
        bar.dataset.status  = isFuture ? 'future' : st;
        bar.dataset.dept    = r.dept;
        bar.dataset.last    = dateStr + ' ' + TIMES[i].replace('시', ':') + '00';
        bar.setAttribute('aria-label', r.name + ' ' + TIMES[i] + (isFuture ? ' 미수집' : ' ' + STLABEL[st]));

        if (isFuture) {
          bar.addEventListener('mouseenter', function (e) {
            showTooltip(e, '<b>' + r.name + '</b><br>' + TIMES[i] + ' · <span style="color:#94a3b8">아직 수집되지 않은 시간대입니다.</span>');
          });
        } else {
          bar.addEventListener('mouseenter', function (e) {
            showTooltip(e, '<b>' + r.name + '</b><br>' + TIMES[i] + ' · <span style="color:' + (stColor[st]||'#94a3b8') + '">' + STLABEL[st] + '</span>');
          });
          if (st !== 'ok') {
            bar.classList.add('clk');
            bar.addEventListener('click', function () { hideTooltip(); openDrawer(bar.dataset); });
          } else {
            bar.style.cursor = 'default';
          }
        }
        bar.addEventListener('mousemove', posTooltip);
        bar.addEventListener('mouseleave', hideTooltip);
        cell.appendChild(bar); hm.appendChild(cell);
      });
    });

    /* 기준 일시 텍스트 업데이트 */
    var baseDateEl = document.getElementById('hmBaseDate');
    if (baseDateEl) baseDateEl.textContent = dateStr + (isToday ? ' (오늘)' : '');

    /* 현재 시간 기준선 */
    renderNowLine(isToday);
  }

  /* ── 현재 시간 기준선 ── */
  var nowLineTimer = null;

  function renderNowLine(show) {
    var hm = document.getElementById('heatmap');
    if (!hm) return;
    var line = document.getElementById('hmNowLine');

    if (!show) {
      if (line) line.style.display = 'none';
      return;
    }

    if (!line) {
      line = document.createElement('div');
      line.id = 'hmNowLine';
      line.className = 'hm__now-line';
      line.innerHTML = '<span class="hm__now-chip" id="hmNowChip"></span>';
      hm.appendChild(line);
    }
    line.style.display = '';

    var now    = new Date();
    var mins   = now.getHours() * 60 + now.getMinutes();
    var ratio  = mins / 1440;
    var headerH = (hm.querySelector('.hm__h') || {}).offsetHeight || 44;
    var hmW    = hm.offsetWidth;
    var leftPx = 140 + ratio * (hmW - 140);

    line.style.left = leftPx + 'px';
    line.style.top  = headerH + 'px';

    var chip = document.getElementById('hmNowChip');
    if (chip) chip.textContent = '지금 ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  }

  /* ── 단일 날짜 캘린더 피커 ── */
  var _CAL_MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var _CAL_DAYS   = ['일','월','화','수','목','금','토'];
  var _hmCal = (function () {
    var now = new Date();
    return { viewYear: now.getFullYear(), viewMonth: now.getMonth(), selDate: new Date() };
  }());

  function _hmCalFmt(d) {
    if (!d) return '—';
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
  }
  function _hmCalSame(a, b) {
    return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function _hmCalRender() {
    var label = document.getElementById('hmCalLabel');
    if (label) label.textContent = _hmCal.viewYear + '년 ' + _CAL_MONTHS[_hmCal.viewMonth];

    var grid = document.getElementById('hmCalGrid');
    if (!grid) return;
    var today    = new Date();
    var firstDow = new Date(_hmCal.viewYear, _hmCal.viewMonth, 1).getDay();
    var daysInM  = new Date(_hmCal.viewYear, _hmCal.viewMonth + 1, 0).getDate();

    var html = '<div class="cal-weekdays">';
    _CAL_DAYS.forEach(function (d) { html += '<span>' + d + '</span>'; });
    html += '</div><div class="cal-days">';
    for (var e = 0; e < firstDow; e++) html += '<div class="cal-day cal-day--empty"></div>';
    for (var d = 1; d <= daysInM; d++) {
      var date = new Date(_hmCal.viewYear, _hmCal.viewMonth, d);
      var cls  = 'cal-day';
      if (_hmCalSame(date, today)) cls += ' cal-day--today';
      if (_hmCalSame(date, _hmCal.selDate)) cls += ' cal-day--selected';
      html += '<div class="' + cls + '" data-y="' + _hmCal.viewYear + '" data-m="' + _hmCal.viewMonth + '" data-d="' + d + '">' + d + '</div>';
    }
    html += '</div>';
    grid.innerHTML = html;

    /* 선택 텍스트 */
    var selEl = document.getElementById('hmCalSelected');
    if (selEl) selEl.textContent = _hmCal.selDate ? _hmCalFmt(_hmCal.selDate) : '날짜를 선택하세요';

    /* 날짜 클릭 */
    grid.querySelectorAll('.cal-day:not(.cal-day--empty)').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();
        _hmCal.selDate = new Date(+el.dataset.y, +el.dataset.m, +el.dataset.d);
        _hmCalRender();
      });
    });
  }

  function initDateFilter() {
    var trigger  = document.getElementById('hmDateTrigger');
    var dropdown = document.getElementById('hmDateDropdown');
    var chips    = document.querySelectorAll('#hmDateChips .chip');

    /* 퀵 칩 (오늘/어제) */
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        selectedDate = dateByOffset(parseInt(chip.dataset.day, 10));
        _hmCal.selDate = new Date(selectedDate);
        _hmCal.viewYear  = _hmCal.selDate.getFullYear();
        _hmCal.viewMonth = _hmCal.selDate.getMonth();
        document.getElementById('hmDateDisplay').textContent = selectedDate;
        renderHeatmap(selectedDate);
        renderHist(selectedDate);
        if (nowLineTimer) clearInterval(nowLineTimer);
        if (selectedDate === todayStr()) nowLineTimer = setInterval(function () { renderNowLine(true); }, 60000);
      });
    });

    /* 트리거 클릭 → 드롭다운 토글 */
    if (trigger && dropdown) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('open');
        dropdown.classList.toggle('open');
        if (!isOpen) _hmCalRender();
      });

      /* 이전/다음 달 */
      var prev = document.getElementById('hmCalPrev');
      var next = document.getElementById('hmCalNext');
      if (prev) prev.addEventListener('click', function (e) {
        e.stopPropagation();
        _hmCal.viewMonth--;
        if (_hmCal.viewMonth < 0) { _hmCal.viewMonth = 11; _hmCal.viewYear--; }
        _hmCalRender();
      });
      if (next) next.addEventListener('click', function (e) {
        e.stopPropagation();
        _hmCal.viewMonth++;
        if (_hmCal.viewMonth > 11) { _hmCal.viewMonth = 0; _hmCal.viewYear++; }
        _hmCalRender();
      });

      /* 적용 */
      var applyBtn = document.getElementById('hmCalApply');
      if (applyBtn) applyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        selectedDate = _hmCalFmt(_hmCal.selDate);
        document.getElementById('hmDateDisplay').textContent = selectedDate;
        chips.forEach(function (c) { c.classList.remove('on'); });
        dropdown.classList.remove('open');
        renderHeatmap(selectedDate);
        renderHist(selectedDate);
        if (nowLineTimer) clearInterval(nowLineTimer);
        if (selectedDate === todayStr()) nowLineTimer = setInterval(function () { renderNowLine(true); }, 60000);
      });

      /* 취소 */
      var cancelBtn = document.getElementById('hmCalCancel');
      if (cancelBtn) cancelBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.remove('open');
      });

      /* 외부 클릭 닫기 */
      document.addEventListener('click', function (e) {
        if (dropdown && !trigger.contains(e.target)) dropdown.classList.remove('open');
      });
    }
  }

  initDateFilter();

  /* ═══════════════════════════════════════════════════════════════
     최근 수집 이력 + 상세 모달
     ═══════════════════════════════════════════════════════════════ */
  var HIST = [
    { tm:'15:07', name:'신재생 발전량',      type:'에너지',   method:'REST API', status:'ok',    cnt:'24건',    last:'15:07', dept:'에너지과',   partner:'케빈랩' },
    { tm:'15:02', name:'침수·수위 데이터',   type:'세이프티', method:'LoRa',     status:'delay', cnt:'1,240건', last:'14:48', dept:'안전총괄과', partner:'스파이어' },
    { tm:'14:58', name:'대기질 측정',        type:'세이프티', method:'MQTT',     status:'ok',    cnt:'3,600건', last:'14:58', dept:'안전총괄과', partner:'영진기술' },
    { tm:'14:51', name:'친환경 배달 현황',   type:'모빌리티', method:'API',      status:'ok',    cnt:'1,284건', last:'14:51', dept:'교통과',     partner:'우아한형제들' },
    { tm:'14:40', name:'카셰어링 이용 현황', type:'모빌리티', method:'REST API', status:'ok',    cnt:'247건',   last:'14:40', dept:'교통과',     partner:'기아' },
    { tm:'14:32', name:'DRT 운행 데이터',    type:'모빌리티', method:'REST API', status:'err',   cnt:'0건',     last:'13:15', dept:'교통과',     partner:'현대' },
    { tm:'14:20', name:'탄소감축 데이터',    type:'에너지',   method:'REST API', status:'ok',    cnt:'38건',    last:'14:20', dept:'환경과',     partner:'그리너리/후시파트너스' }
  ];

  function renderHist(dateStr) {
    var histBody = document.getElementById('histBody');
    if (!histBody) return;
    histBody.innerHTML = '';
    HIST.forEach(function (h) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="num">' + h.tm + '</td>' +
        '<td class="l">' + h.name + '</td>' +
        '<td>' + h.type + '</td>' +
        '<td>' + h.method + '</td>' +
        '<td><span class="pill ' + (pillCls[h.status]||'pill--stop') + '">' + STLABEL[h.status] + '</span></td>' +
        '<td class="num">' + h.cnt + '</td>' +
        '<td class="num">' + h.last + '</td>' +
        '<td><button class="tbtn tbtn--sm" type="button">상세</button></td>';
      var drawData = { name:h.name, type:h.type, method:h.method, partner:h.partner,
        time:h.tm, status:h.status, dept:h.dept,
        last: dateStr + ' ' + h.last + ':00', cnt:h.cnt };
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function () { openDrawer(drawData); });
      histBody.appendChild(tr);
    });
  }

  /* ── 수집 이력 상세 모달 ── */
  var histModalScrim = document.getElementById('histModalScrim');
  var histModal      = document.getElementById('histModal');

  function openHistModal(h) {
    var st = h.status;
    var pc = pillCls[st] || 'pill--stop';
    var pill = document.getElementById('hmModalPill');
    if (pill) { pill.textContent = STLABEL[st]; pill.className = 'pill ' + pc; }
    setText('hmModalName', h.name);
    setText('hmModalMeta', h.type + ' · ' + h.method + ' · ' + h.partner);
    setText('hm_partner',  h.partner);
    setText('hm_type',     h.type);
    setText('hm_method',   h.method);
    setText('hm_dept',     h.dept);
    setText('hm_cnt',      h.cnt);
    setText('hm_last',     selectedDate + ' ' + h.last + ':00');

    var log = document.getElementById('hmModalLog');
    if (log) {
      var logRows = [
        { t: selectedDate + ' ' + h.last + ':00', s: st,   d: CODE[st].msg + (h.cnt !== '0건' ? ' (' + h.cnt + ')' : '') },
        { t: '직전 주기 (정상)',               s: 'ok', d: '정상 수집 완료' },
        { t: '2주기 전 (정상)',                s: 'ok', d: '정상 수집 완료' },
        { t: '3주기 전 (정상)',                s: 'ok', d: '정상 수집 완료' }
      ];
      log.innerHTML = logRows.map(function (r) {
        var cls = r.s === 'err' ? 'err' : r.s === 'delay' ? 'delay' : '';
        return '<div class="log__it ' + cls + '"><div class="log__tm">' + r.t + '</div><div class="log__ds">' + r.d + '</div></div>';
      }).join('');
    }

    lucide.createIcons();
    histModalScrim.style.display = '';
    histModal.style.display = '';
    document.getElementById('hmModalClose').focus();

    document.getElementById('hmModalCsvBtn').onclick = function () {
      exportHistCsv(h);
    };
  }

  function closeHistModal() {
    histModalScrim.style.display = 'none';
    histModal.style.display = 'none';
  }

  if (document.getElementById('hmModalClose'))
    document.getElementById('hmModalClose').addEventListener('click', closeHistModal);
  if (document.getElementById('hmModalCloseBtn'))
    document.getElementById('hmModalCloseBtn').addEventListener('click', closeHistModal);
  if (histModalScrim)
    histModalScrim.addEventListener('click', closeHistModal);

  function exportHistCsv(h) {
    var rows = [
      ['수집 시간','데이터명','구분','방식','제공기관','담당부서','상태','수집건수'],
      [selectedDate + ' ' + h.tm, h.name, h.type, h.method, h.partner, h.dept, STLABEL[h.status], h.cnt]
    ];
    var csv = '﻿' + rows.map(function (r) { return r.map(function (v) { return '"' + v + '"'; }).join(','); }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url; a.download = '수집이력_' + h.name + '.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  /* ═══════════════════════════════════════════════════════════════
     드로어
     ═══════════════════════════════════════════════════════════════ */
  var drawer = document.getElementById('drawer');
  var scrim  = document.getElementById('scrim');
  function setText(id, v){ var el=document.getElementById(id); if(el) el.textContent = v; }

  function openDrawer(d) {
    var st  = d.status || 'err';
    var cnt = d.cnt || CNT[st] || '—';
    setText('dwName',    d.name);
    setText('f_name',    d.name);
    setText('f_partner', d.partner || '—');
    setText('f_type',    d.type);
    setText('f_method',  d.method);
    setText('f_time',    d.time + ' 시간대');
    setText('f_count',   cnt);
    setText('f_last',    d.last || '—');
    setText('f_dept',    d.dept || '—');
    setText('f_code',    CODE[st].code);
    setText('f_msg',     CODE[st].msg);

    var fs = document.getElementById('f_status');
    if (fs) { fs.textContent = STLABEL[st]; fs.className = st === 'err' ? 'err' : st === 'delay' ? 'delay' : ''; }

    var banner = document.getElementById('dwBanner');
    if (banner) {
      banner.className = 'dw__banner dw__banner--' + st;
      var bIco = { ok:'circle-check', delay:'clock', err:'triangle-alert', stop:'circle-pause', wait:'hourglass' };
      var ico = banner.querySelector('[data-lucide]');
      if (ico) ico.setAttribute('data-lucide', bIco[st] || 'info');
      var bMsg = {
        ok:    '정상적으로 수집되고 있습니다.',
        delay: '수집 주기를 초과했습니다. 원천 응답 지연을 확인하세요.',
        err:   '수집에 실패했습니다. 원천 시스템 연결을 점검하세요.',
        stop:  '수집이 일시 중지된 상태입니다.',
        wait:  '배치 수집 대기열에서 처리를 기다리는 중입니다.'
      };
      setText('dwBannerT', STLABEL[st]);
      setText('dwBannerS', bMsg[st] || '');
    }

    var log = document.getElementById('dwLog');
    if (log) {
      var rows = [
        { t: d.last || (d.time + ':00'), s: st,   d: CODE[st].msg },
        { t: '직전 주기',                 s: 'ok', d: '정상 수집 완료 (' + (d.cnt || '-') + ')' },
        { t: '2주기 전',                  s: 'ok', d: '정상 수집 완료' },
        { t: '3주기 전',                  s: 'ok', d: '정상 수집 완료' }
      ];
      log.innerHTML = rows.map(function (r) {
        var cls = r.s === 'err' ? 'err' : r.s === 'delay' ? 'delay' : '';
        return '<div class="log__it ' + cls + '"><div class="log__tm">' + r.t + '</div><div class="log__ds">' + r.d + '</div></div>';
      }).join('');
    }

    /* 오류 로그 CSV 버튼 — 오류/지연 상태일 때만 표시 */
    var csvBtn = document.getElementById('dwErrCsvBtn');
    if (csvBtn) {
      csvBtn.style.display = (st === 'err' || st === 'delay') ? '' : 'none';
      csvBtn.onclick = function () { exportErrCsv(d); };
    }

    lucide.createIcons();
    drawer.classList.add('on'); scrim.classList.add('on');
    drawer.setAttribute('aria-hidden','false');
    var closeBtn = document.getElementById('dwClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('on'); scrim.classList.remove('on');
    drawer.setAttribute('aria-hidden','true');
  }

  document.getElementById('dwClose').addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', function (e) {
    if (!histModal || histModal.style.display === 'none') closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); closeHistModal(); }
  });

  /* ── 재수집 버튼 confirm ── */
  var recollectBtn = document.getElementById('dwRecollectBtn');
  if (recollectBtn) {
    recollectBtn.addEventListener('click', function () {
      var name = document.getElementById('dwName').textContent || '선택된 데이터';
      if (!confirm('"' + name + '" 데이터를 즉시 재수집합니다. 계속하시겠습니까?')) return;
      recollectBtn.disabled = true;
      recollectBtn.textContent = '재수집 중…';
      setTimeout(function () {
        recollectBtn.disabled = false;
        recollectBtn.innerHTML = '<i data-lucide="refresh-cw" class="gp-ico"></i>재수집 실행';
        lucide.createIcons();
        showToast('재수집 요청이 완료되었습니다.');
      }, 1400);
    });
  }

  /* ── 오류 로그 CSV 다운로드 ── */
  function exportErrCsv(d) {
    var name = d.name || '오류로그';
    var rows = [
      ['수집 시간','데이터명','상태','오류코드','오류메시지','담당부서','제공기관'],
      [d.last || d.time, d.name, STLABEL[d.status || 'err'], CODE[d.status||'err'].code, CODE[d.status||'err'].msg, d.dept || '—', d.partner || '—']
    ];
    var csv = '﻿' + rows.map(function (r) { return r.map(function (v) { return '"' + v + '"'; }).join(','); }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url; a.download = '오류로그_' + name + '.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  /* ── 새로고침 버튼 ── */
  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      var now = new Date();
      var p = function (n){ return String(n).padStart(2,'0'); };
      setText('updTime',
        now.getFullYear() + '-' + p(now.getMonth()+1) + '-' + p(now.getDate()) +
        ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds()));
      var ico = refreshBtn.querySelector('[data-lucide]');
      if (ico) {
        ico.style.transition  = 'transform .6s';
        ico.style.transform   = 'rotate(360deg)';
        setTimeout(function(){ ico.style.transition='none'; ico.style.transform='rotate(0)'; }, 650);
      }
    });
  }

  /* ── 토스트 ── */
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--fg-1);color:#fff;padding:11px 22px;border-radius:var(--radius-pill);font:500 14px/1 var(--font-sans);box-shadow:var(--elev-3);z-index:400;white-space:nowrap;';
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 2200);
  }

  /* ── 초기 실행 ── */
  /* hmDateDisplay 초기값 */
  var _dispEl = document.getElementById('hmDateDisplay');
  if (_dispEl) _dispEl.textContent = selectedDate;

  renderAnomalies();
  renderHeatmap(selectedDate);
  renderHist(selectedDate);
  nowLineTimer = setInterval(function () { renderNowLine(true); }, 60000);

  } /* __run */

  if (window.GMSB_SHELL_READY) __run();
  else document.addEventListener('gmsb:shell-ready', __run, { once: true });
})();
