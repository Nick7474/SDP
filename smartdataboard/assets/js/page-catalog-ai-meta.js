/* =====================================================================
   광명 스마트데이터보드 · AI 메타데이터 추천
   ===================================================================== */
(function () {
  'use strict';

  var TERMS = [
    { id:1, term:'태양광 발전량',  eng:'Solar Power Generation',          field:'에너지',   syn:'태양광발전, 솔라발전',      datasets:18, linked:'태양광발전량 및 탄소 배출량, 신재생에너지 현황 외 17개', status:'active', regDate:'2026.01.14', lastUsed:'2026.06.18', aiConf:0.97, desc:'태양광 발전 설비에서 생산한 전력의 총량.' },
    { id:2, term:'친환경DRT 운행', eng:'Eco DRT Operation',               field:'모빌리티', syn:'수요응답버스, 친환경버스',   datasets:9,  linked:'친환경DRT 운행 현황 데이터 외 8개',                   status:'active', regDate:'2026.01.22', lastUsed:'2026.06.16', aiConf:0.91, desc:'수요응답형 친환경 대중교통 운행 정보.' },
    { id:3, term:'침수 예측',      eng:'Flood Risk Prediction',           field:'세이프티', syn:'AIoT침수, 침수홍수예측',    datasets:6,  linked:'재난 위험 정보, 수방 현황 외 5개',                    status:'review', regDate:'2026.02.10', lastUsed:'2026.06.14', aiConf:0.74, desc:'AI 기반 침수 발생 위험도 예측 결과.' },
    { id:4, term:'미세먼지 농도',  eng:'PM2.5 Concentration',             field:'환경',     syn:'초미세먼지, PM2.5',         datasets:14, linked:'대기측정소별 실시간 측정정보, 미세먼지 예보 외 13개', status:'active', regDate:'2026.01.03', lastUsed:'2026.06.17', aiConf:0.95, desc:'단위 부피당 PM2.5 입자 질량 농도(μg/m³).' },
    { id:5, term:'에너지 사용량',  eng:'Energy Usage',                    field:'에너지',   syn:'에너지사용량, 에너지소비량', datasets:21, linked:'에너지 사용 현황, 건물 에너지 외 20개',              status:'active', regDate:'2026.01.15', lastUsed:'2026.06.17', aiConf:0.98, desc:'건물·시설에서 일정 기간 동안 소비한 에너지 합계.' },
    { id:6, term:'가로등 점멸',    eng:'Streetlight Flickering',          field:'세이프티', syn:'가로등점멸, 가로등데이터',  datasets:5,  linked:'광명시 가로등 점멸 데이터, 시설 이력 외 4개',         status:'active', regDate:'2026.02.28', lastUsed:'2026.06.12', aiConf:0.83, desc:'가로등 점등/소등 이벤트 및 점멸 상태 정보.' },
    { id:7, term:'전기차 충전량',  eng:'EV Charging Amount',              field:'모빌리티', syn:'전기차충전전량, 충전량',    datasets:7,  linked:'전기차충전소 현황, 충전소 운영 외 6개',               status:'active', regDate:'2026.01.28', lastUsed:'2026.06.15', aiConf:0.88, desc:'충전기에서 공급된 전력량(kWh) 합계.' },
    { id:8, term:'온실가스 배출량',eng:'GHG Emission',                    field:'환경',     syn:'온실가스배출량, 탄소배출량', datasets:11, linked:'온실가스 모니터링, 탄소중립 지표 외 10개',            status:'active', regDate:'2026.02.05', lastUsed:'2026.06.13', aiConf:0.96, desc:'CO₂ 환산 온실가스 총 배출량(tCO₂e).' },
    { id:9, term:'주민등록인구',   eng:'Resident Registration Population',field:'데이터',   syn:'주민등록인구, 읍면동인구',  datasets:8,  linked:'주민등록인구 통계, 세대통계 외 7개',                  status:'active', regDate:'2026.01.30', lastUsed:'2026.06.18', aiConf:0.99, desc:'주민등록 기준 인구 수.' },
    { id:10,term:'스마트정류장',   eng:'Smart Bus Stop',                  field:'세이프티', syn:'스마트버스정류장',          datasets:4,  linked:'스마트정류장 현황, 대중교통 외 3개',                  status:'review', regDate:'2026.03.22', lastUsed:'2026.05.24', aiConf:0.68, desc:'디지털 기기 탑재 스마트 버스 정류장.' }
  ];

  var HIST_DB = {
    1: [
      { date:'2026-06-18', user:'김담당', action:'edit',   body:'동의어 "솔라발전" 추가' },
      { date:'2026-04-10', user:'이관리', action:'approve',body:'검토중 → 사용중 승인' },
      { date:'2026-01-14', user:'이관리', action:'create', body:'표준어 최초 등록' }
    ],
    3: [
      { date:'2026-06-14', user:'김담당', action:'edit', body:'설명 문구 수정' },
      { date:'2026-02-10', user:'박AI',   action:'create',body:'AI 추천 기반 등록 — 검토중 상태' }
    ],
    10:[
      { date:'2026-05-24', user:'박AI',   action:'create',body:'AI 추천 기반 등록 — 검토중 상태' }
    ]
  };

  var selectedTerm = null;

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
  }

  function boot() {
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) {
      document.addEventListener('gmsb:shell-ready', onReady, { once: true });
    } else { onReady(); }
  }

  function onReady() {
    initTabs();
    renderTermTable(TERMS);
    renderTermPagination(TERMS.length);
    initTermDrawer();
    initFilterBtns();
    initChkAll();
    initBatchActions();
    initHistModal();
    initAddModal();
    if (window.lucide) lucide.createIcons();
  }

  /* ── 탭 ── */
  function initTabs() {
    document.querySelectorAll('.page-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.page-tab').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on');
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  /* ── 전체 선택 ── */
  function initChkAll() {
    var chkAll = document.getElementById('termChkAll');
    if (!chkAll) return;
    chkAll.addEventListener('change', function () {
      document.querySelectorAll('.term-row-chk').forEach(function (c) { c.checked = chkAll.checked; });
      updateBatchBar();
    });
    document.addEventListener('change', function (e) {
      if (e.target && e.target.classList.contains('term-row-chk')) updateBatchBar();
    });
  }

  function updateBatchBar() {
    var checked = document.querySelectorAll('.term-row-chk:checked');
    var bar     = document.getElementById('termBatchBar');
    var cnt     = document.getElementById('termBatchCount');
    if (bar)    bar.classList.toggle('on', checked.length > 0);
    if (cnt)    cnt.textContent = checked.length;
  }

  function getCheckedIds() {
    var ids = [];
    document.querySelectorAll('.term-row-chk:checked').forEach(function (c) {
      ids.push(parseInt(c.dataset.id, 10));
    });
    return ids;
  }

  /* ── 일괄처리 ── */
  function initBatchActions() {
    var btnApprove = document.getElementById('btnBatchApprove');
    var btnReject  = document.getElementById('btnBatchReject');
    var btnCancel  = document.getElementById('btnBatchCancel');

    if (btnApprove) btnApprove.addEventListener('click', function () {
      var ids = getCheckedIds();
      ids.forEach(function (id) { var t = TERMS.find(function (x) { return x.id === id; }); if (t) t.status = 'active'; });
      clearChecks();
      renderTermTable(TERMS);
      showToast(ids.length + '건이 승인되었습니다.');
    });

    if (btnReject) btnReject.addEventListener('click', function () {
      var ids = getCheckedIds();
      ids.forEach(function (id) { var t = TERMS.find(function (x) { return x.id === id; }); if (t) t.status = 'inactive'; });
      clearChecks();
      renderTermTable(TERMS);
      showToast(ids.length + '건이 반려되었습니다.');
    });

    if (btnCancel) btnCancel.addEventListener('click', clearChecks);
  }

  function clearChecks() {
    document.querySelectorAll('.term-row-chk,.term-chk-all').forEach(function (c) { c.checked = false; });
    var chkAll = document.getElementById('termChkAll');
    if (chkAll) chkAll.checked = false;
    updateBatchBar();
  }

  /* ── 필터 칩 토글 + 검색 ── */
  function initFilterBtns() {
    ['termTypeGroup','termFieldGroup','termStatusGroup'].forEach(function (groupId) {
      var grp = document.getElementById(groupId);
      if (!grp) return;
      grp.querySelectorAll('.term-chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
          grp.querySelectorAll('.term-chip').forEach(function (b) { b.classList.remove('on'); });
          this.classList.add('on');
          applyTermFilter();
        });
      });
    });

    var termSearch = document.getElementById('termSearch');
    if (termSearch) termSearch.addEventListener('input', applyTermFilter);

    var searchBtn = document.getElementById('btnTermSearch');
    if (searchBtn) searchBtn.addEventListener('click', applyTermFilter);

    var resetBtn = document.getElementById('btnTermReset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      document.querySelectorAll('.term-chip-group .term-chip').forEach(function (c) { c.classList.remove('on'); });
      document.querySelectorAll('.term-chip-group .term-chip[data-val=""]').forEach(function (c) { c.classList.add('on'); });
      var inp = document.getElementById('termSearch');
      if (inp) inp.value = '';
      renderTermTable(TERMS);
      renderTermPagination(TERMS.length);
    });

    var addBtn = document.getElementById('btnTermAdd');
    if (addBtn) addBtn.addEventListener('click', function () { openAddModal(); });
  }

  function getTermChipVal(groupId) {
    var grp = document.getElementById(groupId);
    if (!grp) return '';
    var on = grp.querySelector('.term-chip.on');
    return on ? (on.dataset.val || '') : '';
  }

  var FIELD_MAP = { energy:'에너지', mobility:'모빌리티', safety:'세이프티', data:'데이터', env:'환경' };

  function applyTermFilter() {
    var type   = getTermChipVal('termTypeGroup');
    var field  = getTermChipVal('termFieldGroup');
    var status = getTermChipVal('termStatusGroup');
    var q = ((document.getElementById('termSearch') || {}).value || '').trim().toLowerCase();

    var filtered = TERMS.filter(function (t) {
      if (field  && t.field    !== (FIELD_MAP[field] || field)) return false;
      if (status && t.status   !== status) return false;
      if (q && t.term.indexOf(q) < 0 && t.eng.toLowerCase().indexOf(q) < 0 && t.syn.indexOf(q) < 0) return false;
      return true;
    });
    renderTermTable(filtered);
    renderTermPagination(filtered.length);
    if (window.lucide) lucide.createIcons();
  }

  /* ── 표준어 테이블 ── */
  function renderTermTable(data) {
    var tbody   = document.getElementById('termTbody');
    var countEl = document.getElementById('termCount');
    if (!tbody) return;
    if (countEl) countEl.textContent = '전체 ' + data.length + '건';

    tbody.innerHTML = data.map(function (t) {
      var stCls = { active:'active', review:'review', inactive:'inactive' }[t.status] || 'inactive';
      var stLbl = { active:'사용중', review:'검토중', inactive:'미사용' }[t.status] || t.status;
      var confPct = Math.round(t.aiConf * 100);
      var confCls = confPct >= 85 ? 'high' : confPct >= 65 ? 'mid' : 'low';
      return [
        '<tr data-id="' + t.id + '">',
          '<td><input type="checkbox" class="term-row-chk" data-id="' + t.id + '" aria-label="선택"></td>',
          '<td class="l" style="font-weight:700;color:var(--fg-1)">' + t.term + '</td>',
          '<td class="l" style="color:var(--fg-3);font-size:12px">' + t.eng + '</td>',
          '<td>' + t.field + '</td>',
          '<td class="l" style="font-size:12px;color:var(--fg-2)">' + t.syn + '</td>',
          '<td>' + t.datasets + '건</td>',
          '<td class="l"><span class="am-ds-link" data-id="' + t.id + '">' + t.linked + '</span></td>',
          '<td>',
            '<div class="am-conf-bar-wrap">',
              '<div class="am-conf-bar"><div class="am-conf-fill am-conf-fill--' + confCls + '" style="width:' + confPct + '%"></div></div>',
              '<span class="am-conf-val am-conf-val--' + confCls + '">' + confPct + '%</span>',
            '</div>',
          '</td>',
          '<td><span class="am-status am-status--' + stCls + '">' + stLbl + '</span></td>',
          '<td style="font-size:12px;white-space:nowrap">' + t.regDate + '</td>',
          '<td style="font-size:12px;white-space:nowrap">' + t.lastUsed + '</td>',
          '<td style="text-align:center">',
            '<button class="tbtn tbtn--sm am-term-detail" data-id="' + t.id + '" type="button">보기</button>',
          '</td>',
        '</tr>'
      ].join('');
    }).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function (e) {
        if (e.target.closest('input[type="checkbox"]')) return;
        openTermDrawer(parseInt(tr.dataset.id, 10));
      });
      var detailBtn = tr.querySelector('.am-term-detail');
      if (detailBtn) detailBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openTermDrawer(parseInt(tr.dataset.id, 10));
      });
      var chk = tr.querySelector('.term-row-chk');
      if (chk) chk.addEventListener('click', function (e) { e.stopPropagation(); });
    });
    if (window.lucide) lucide.createIcons();
  }

  function renderTermPagination(total) {
    var el = document.getElementById('termPagination');
    if (!el) return;
    el.innerHTML = [
      '<span class="ds-pg-info">총 ' + (total || 0) + '건</span>',
      '<div class="ds-pg-btns">',
        pgBtn('&laquo;'), pgBtn('&lsaquo;'),
        pgBtn('1', true), pgBtn('2'),
        pgBtn('&rsaquo;'), pgBtn('&raquo;'),
      '</div>'
    ].join('');
  }

  function pgBtn(label, active) {
    return '<button class="ds-pg-btn' + (active ? ' on' : '') + '" type="button">' + label + '</button>';
  }

  /* ── 표준어 드로어 ── */
  function initTermDrawer() {
    var drawer  = document.getElementById('termDrawer');
    var scrim   = document.getElementById('scrim');
    var closeX  = document.getElementById('tdClose');
    var cancelBtn = document.getElementById('tdCancelBtn');
    var saveBtn   = document.getElementById('tdSaveBtn');
    var histBtn   = document.getElementById('tdHistBtn');

    if (closeX)   closeX.addEventListener('click', function () { closeDrawer(drawer); });
    if (cancelBtn) cancelBtn.addEventListener('click', function () { closeDrawer(drawer); });
    if (scrim)    scrim.addEventListener('click', function () { closeDrawer(drawer); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer(drawer);
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (!selectedTerm) return;
      var termInput = document.getElementById('td_term');
      var engInput  = document.getElementById('td_eng');
      var fieldSel  = document.getElementById('td_field');
      var statusSel = document.getElementById('td_status');
      var descTA    = document.getElementById('td_desc');
      var memo      = document.getElementById('td_memo');

      if (termInput) selectedTerm.term = termInput.value.trim() || selectedTerm.term;
      if (engInput)  selectedTerm.eng  = engInput.value.trim()  || selectedTerm.eng;
      if (fieldSel)  selectedTerm.field = fieldSel.value;
      var statusMap = { '사용중':'active', '검토중':'review', '미사용':'inactive' };
      if (statusSel) selectedTerm.status = statusMap[statusSel.value] || 'active';
      if (descTA)    selectedTerm.desc = descTA.value;

      var hist = HIST_DB[selectedTerm.id] || (HIST_DB[selectedTerm.id] = []);
      var memoVal = (memo && memo.value.trim()) || '정보 수정';
      hist.unshift({ date: new Date().toISOString().slice(0,10), user:'관리자', action:'edit', body: memoVal });

      renderTermTable(TERMS);
      closeDrawer(drawer);
      showToast('표준어 정보가 저장되었습니다.');
    });

    if (histBtn) histBtn.addEventListener('click', function () {
      if (selectedTerm) openHistModal(selectedTerm);
    });

    document.querySelectorAll('.am-syn-del').forEach(function (btn) {
      btn.addEventListener('click', function () { this.closest('.am-syn-chip').remove(); });
    });
    var synAdd = document.getElementById('td_synAdd');
    if (synAdd) synAdd.addEventListener('click', function () {
      var v = prompt('동의어를 입력하세요:');
      if (v && v.trim()) {
        var span = document.createElement('span');
        span.className = 'am-syn-chip';
        span.innerHTML = v.trim() + ' <button class="am-syn-del" type="button">×</button>';
        span.querySelector('.am-syn-del').addEventListener('click', function () { span.remove(); });
        document.getElementById('td_synGroup').insertBefore(span, synAdd);
      }
    });

    var descTA = document.getElementById('td_desc');
    var hint   = document.getElementById('td_descHint');
    if (descTA && hint) descTA.addEventListener('input', function () { hint.textContent = this.value.length + '/500'; });

    var memoTA   = document.getElementById('td_memo');
    var memoHint = document.getElementById('td_memoHint');
    if (memoTA && memoHint) memoTA.addEventListener('input', function () { memoHint.textContent = this.value.length + '/300'; });
  }

  function openTermDrawer(id) {
    var t = TERMS.find(function (x) { return x.id === id; });
    if (!t) return;
    selectedTerm = t;

    set('tdTitle', t.term);

    setInput('td_term',    t.term);
    setInput('td_eng',     t.eng);
    setSelect('td_field',  t.field);
    var statusLbl = { active:'사용중', review:'검토중', inactive:'미사용' };
    setSelect('td_status', statusLbl[t.status] || t.status);
    setInput('td_datasets', t.datasets + '건');

    var descTA = document.getElementById('td_desc');
    if (descTA) { descTA.value = t.desc || ''; }
    var hint = document.getElementById('td_descHint');
    if (hint) hint.textContent = (t.desc || '').length + '/500';

    var memoTA = document.getElementById('td_memo');
    if (memoTA) memoTA.value = '';
    var memoHint = document.getElementById('td_memoHint');
    if (memoHint) memoHint.textContent = '0/300';

    set('td_linked', t.linked);
    var lastInput = document.getElementById('td_lastUsed');
    if (lastInput) lastInput.value = t.lastUsed.replace(/\./g, '-');

    var synGroup = document.getElementById('td_synGroup');
    var addBtn   = document.getElementById('td_synAdd');
    if (synGroup && addBtn) {
      synGroup.querySelectorAll('.am-syn-chip').forEach(function (c) { c.remove(); });
      t.syn.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
        var span = document.createElement('span');
        span.className = 'am-syn-chip';
        span.innerHTML = s + ' <button class="am-syn-del" type="button">×</button>';
        span.querySelector('.am-syn-del').addEventListener('click', function () { span.remove(); });
        synGroup.insertBefore(span, addBtn);
      });
    }

    /* AI 신뢰도 */
    var confPct = Math.round(t.aiConf * 100);
    set('td_aiScore', confPct + '%');
    set('td_aiDesc', confPct >= 85 ? '표준어 매핑 신뢰도가 높습니다.' : confPct >= 65 ? '일부 항목 검토가 필요합니다.' : '표준어 매핑 검토가 필요합니다.');

    var drawer = document.getElementById('termDrawer');
    var scrim  = document.getElementById('scrim');
    if (drawer) drawer.classList.add('on');
    if (scrim)  scrim.classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeDrawer(drawer) {
    if (drawer) drawer.classList.remove('on');
    var scrim = document.getElementById('scrim');
    var histOv = document.getElementById('histOverlay');
    if (scrim && (!histOv || !histOv.classList.contains('on'))) scrim.classList.remove('on');
  }

  /* ── 변경이력 모달 ── */
  function initHistModal() {
    var closeBtn = document.getElementById('histCloseBtn');
    var bg       = document.getElementById('histBg');
    if (closeBtn) closeBtn.addEventListener('click', closeHistModal);
    if (bg)       bg.addEventListener('click', closeHistModal);
  }

  function openHistModal(term) {
    set('histTermTitle', term.term);
    var list = document.getElementById('histList');
    if (!list) return;
    var items = HIST_DB[term.id] || [];
    if (!items.length) {
      list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--fg-4)">변경 이력이 없습니다.</div>';
    } else {
      list.innerHTML = items.map(function (h) {
        return [
          '<div class="am-hist-item">',
            '<div class="am-hist-item__meta">',
              '<strong>' + h.date + '</strong>' + h.user,
            '</div>',
            '<div class="am-hist-item__body">',
              '<span class="am-hist-item__action am-hist-item__action--' + h.action + '">' + { create:'등록', edit:'수정', approve:'승인', reject:'반려' }[h.action] + '</span>',
              '<div>' + h.body + '</div>',
            '</div>',
          '</div>'
        ].join('');
      }).join('');
    }
    document.getElementById('histOverlay').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeHistModal() {
    document.getElementById('histOverlay').classList.remove('on');
  }

  /* ── 용어 등록 모달 ── */
  function initAddModal() {
    var closeBtn  = document.getElementById('addCloseBtn');
    var cancelBtn = document.getElementById('addCancelBtn');
    var saveBtn   = document.getElementById('addSaveBtn');
    var bg        = document.getElementById('addBg');

    if (closeBtn)  closeBtn.addEventListener('click', closeAddModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAddModal);
    if (bg)        bg.addEventListener('click', closeAddModal);

    if (saveBtn) saveBtn.addEventListener('click', function () {
      var termV = (document.getElementById('add_term') || {}).value || '';
      var engV  = (document.getElementById('add_eng')  || {}).value || '';
      var fldV  = (document.getElementById('add_field')|| {}).value || '';
      if (!termV.trim()) { showToast('표준어를 입력해 주세요.'); return; }
      if (!engV.trim())  { showToast('영문명을 입력해 주세요.'); return; }
      if (!fldV)         { showToast('분야를 선택해 주세요.'); return; }

      var newId = Math.max.apply(null, TERMS.map(function (t) { return t.id; })) + 1;
      TERMS.push({
        id: newId, term: termV, eng: engV, field: fldV,
        syn: '', datasets: 0, linked: '—',
        status: 'review', regDate: new Date().toISOString().slice(0,10).replace(/-/g,'.'),
        lastUsed: '—', aiConf: 0, desc: (document.getElementById('add_desc') || {}).value || ''
      });
      renderTermTable(TERMS);
      renderTermPagination(TERMS.length);
      closeAddModal();
      showToast('표준어가 등록되었습니다. (검토중 상태)');
    });
  }

  function openAddModal() {
    ['add_term','add_eng','add_desc'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var fld = document.getElementById('add_field');
    if (fld) fld.value = '';
    document.getElementById('addOverlay').classList.add('on');
    if (window.lucide) lucide.createIcons();
  }

  function closeAddModal() {
    document.getElementById('addOverlay').classList.remove('on');
  }

  /* ── 유틸 ── */
  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setInput(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  function setSelect(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    Array.from(el.options).forEach(function (o) { o.selected = (o.text === text || o.value === text); });
  }

  var _toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('amToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'amToast';
      el.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(10px);background:var(--fg-1);color:#fff;padding:10px 22px;border-radius:var(--radius-pill);font:600 13px/1 var(--font-sans);z-index:9999;opacity:0;transition:opacity .22s,transform .22s;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
      el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2800);
  }

  init();
})();
