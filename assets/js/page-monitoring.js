/* =====================================================================
   광명 스마트데이터보드 · 데이터 모니터링
   파트너사 7개 시스템 기준으로 데이터 정합성 반영 (2026-06-16)
   ===================================================================== */
(function () {
  function __run() {

  var TIMES = ['00시','02시','04시','06시','08시','10시','12시','14시','16시','18시','20시','22시'];
  var STLABEL = { ok:'정상', delay:'지연', err:'장애', stop:'중지', wait:'수집 대기' };

  /* ── 7개 파트너사 시스템 (o=정상, d=지연, e=장애, s=중지, w=수집대기) ── */
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
    { name:'탄소거래플랫폼',        type:'데이터',   method:'REST API', dept:'환경과',     partner:'그리너리/후시',
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

  /* ── 히트맵 렌더링 ── */
  var hm = document.getElementById('heatmap');
  ROWS.forEach(function (r) {
    var rl = document.createElement('div');
    rl.className = 'hm__rl'; rl.textContent = r.name; hm.appendChild(rl);
    r.cells.forEach(function (c, i) {
      var map = { o:'ok', d:'delay', e:'err', s:'stop', w:'wait' };
      var st = map[c];
      var cell = document.createElement('div'); cell.className = 'hm__cell';
      var bar = document.createElement('button');
      bar.className = 'hm__bar hm__bar--' + st;
      bar.setAttribute('type','button');
      if (st !== 'ok') {
        bar.classList.add('clk');
        bar.setAttribute('aria-label', r.name + ' ' + TIMES[i] + ' ' + STLABEL[st] + ' 상세');
        bar.dataset.name    = r.name;
        bar.dataset.type    = r.type;
        bar.dataset.method  = r.method;
        bar.dataset.partner = r.partner;
        bar.dataset.time    = TIMES[i];
        bar.dataset.status  = st;
        bar.dataset.dept    = r.dept;
        bar.dataset.last    = '2026-06-16 ' + TIMES[i].replace('시',':') + '00';
        bar.addEventListener('click', function () { openDrawer(bar.dataset); });
      } else {
        bar.setAttribute('aria-label', r.name + ' ' + TIMES[i] + ' 정상');
        bar.style.cursor = 'default';
      }
      cell.appendChild(bar); hm.appendChild(cell);
    });
  });

  /* ── 최근 수집 이력 (7개 파트너사 기준) ── */
  var HIST = [
    { tm:'15:07', name:'신재생 발전량',      type:'에너지',   method:'REST API', status:'ok',    cnt:'24건',      last:'15:07', dept:'에너지과',   partner:'케빈랩' },
    { tm:'15:02', name:'침수·수위 데이터',   type:'세이프티', method:'LoRa',     status:'delay', cnt:'1,240건',   last:'14:48', dept:'안전총괄과', partner:'스파이어' },
    { tm:'14:58', name:'대기질 측정',        type:'세이프티', method:'MQTT',     status:'ok',    cnt:'3,600건',   last:'14:58', dept:'안전총괄과', partner:'영진기술' },
    { tm:'14:51', name:'친환경 배달 현황',   type:'모빌리티', method:'API',      status:'ok',    cnt:'1,284건',   last:'14:51', dept:'교통과',     partner:'우아한형제들' },
    { tm:'14:40', name:'카셰어링 이용 현황', type:'모빌리티', method:'REST API', status:'ok',    cnt:'247건',     last:'14:40', dept:'교통과',     partner:'기아' },
    { tm:'14:32', name:'DRT 운행 데이터',    type:'모빌리티', method:'REST API', status:'err',   cnt:'0건',       last:'13:15', dept:'교통과',     partner:'현대' },
    { tm:'14:20', name:'탄소감축 데이터',    type:'데이터',   method:'REST API', status:'ok',    cnt:'38건',      last:'14:20', dept:'환경과',     partner:'그리너리/후시' }
  ];

  var pillCls = { ok:'pill--ok', delay:'pill--delay', err:'pill--err', stop:'pill--stop', wait:'pill--wait' };
  var body = document.getElementById('histBody');
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
      '<td><button class="tbtn" type="button">보기</button></td>';
    tr.querySelector('.tbtn').addEventListener('click', function () {
      openDrawer({ name:h.name, type:h.type, method:h.method, partner:h.partner,
        time:h.tm, status:h.status, dept:h.dept,
        last:'2026-06-16 ' + h.last + ':00', cnt:h.cnt });
    });
    body.appendChild(tr);
  });

  /* ── 드로어 ── */
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
        { t: '직전 주기',                 s: 'ok', d: '정상 수집 완료 (' + cnt + ')' },
        { t: '2주기 전',                  s: 'ok', d: '정상 수집 완료' }
      ];
      log.innerHTML = rows.map(function (r) {
        var cls = r.s === 'err' ? 'err' : r.s === 'delay' ? 'delay' : '';
        return '<div class="log__it ' + cls + '"><div class="log__tm">' + r.t + '</div><div class="log__ds">' + r.d + '</div></div>';
      }).join('');
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
  var dwClose = document.getElementById('dwClose');
  if (dwClose) dwClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ── 새로고침 버튼 ── */
  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      var b = this;
      var now = new Date();
      var p = function (n){ return String(n).padStart(2,'0'); };
      setText('updTime',
        now.getFullYear() + '-' + p(now.getMonth()+1) + '-' + p(now.getDate()) +
        ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds()));
      var ico = b.querySelector('[data-lucide]');
      if (ico) {
        ico.style.transition  = 'transform .6s';
        ico.style.transform   = 'rotate(360deg)';
        setTimeout(function(){ ico.style.transition='none'; ico.style.transform='rotate(0)'; }, 650);
      }
    });
  }

  } /* __run */

  if (window.GMSB_SHELL_READY) __run();
  else document.addEventListener('gmsb:shell-ready', __run, { once: true });
})();
