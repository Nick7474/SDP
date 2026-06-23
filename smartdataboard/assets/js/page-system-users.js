/* page-system-users.js — 사용자 관리 */
(function () {
  'use strict';

  /* ── 메뉴 정의 ── */
  const MENUS = [
    { id: 'home',     label: '홈',                  icon: 'home' },
    { id: 'op',       label: '운영 모니터링',          icon: 'monitor-dot' },
    { id: 'gis',      label: 'GIS 도시 데이터 조회',   icon: 'map' },
    { id: 'carbon',   label: '탄소중립 도시 현황',      icon: 'leaf' },
    { id: 'catalog',  label: 'AI 데이터 카탈로그',      icon: 'database' },
    { id: 'analysis', label: '데이터 분석·시각화',      icon: 'chart-column' },
    { id: 'system',   label: '시스템 관리',             icon: 'settings' },
    { id: 'auth',     label: '인증연계',               icon: 'shield-check' }
  ];

  /* ── Mock 데이터 ── */
  const USERS = [
    { id:'hong01', name:'홍길동', dept:'스마트도시과',  role:'admin',    group:'전체 관리',          menus:[0,1,2,3,4,5,6,7], menuCount:128, status:'active',   lastLogin:'2026.06.04 15:07', regDate:'2025.01.15' },
    { id:'kim02',  name:'김OO',  dept:'환경관리과',   role:'dept',     group:'탄소중립 조회·수정',   menus:[0,1,2,3,4],       menuCount:86,  status:'active',   lastLogin:'2026.06.04 14:20', regDate:'2025.02.20' },
    { id:'park03', name:'박OO',  dept:'교통정책과',   role:'dept',     group:'모빌리티 조회',       menus:[0,1,2],           menuCount:54,  status:'pending',  lastLogin:'—',                regDate:'2026.06.03' },
    { id:'lee04',  name:'이OO',  dept:'외부기관',     role:'external', group:'API 조회',           menus:[0,4],             menuCount:32,  status:'inactive', lastLogin:'2026.05.30 09:45', regDate:'2025.04.10' },
    { id:'choi05', name:'최OO',  dept:'정보통신과',   role:'user',     group:'데이터 조회',         menus:[0,1,2,3,4,5],     menuCount:41,  status:'locked',   lastLogin:'2026.05.15 11:32', regDate:'2025.03.05' },
    { id:'jung06', name:'정OO',  dept:'안전총괄과',   role:'user',     group:'안전 데이터 조회',    menus:[0,1],             menuCount:47,  status:'active',   lastLogin:'2026.06.04 10:15', regDate:'2025.03.18' },
    { id:'oh07',   name:'오OO',  dept:'환경관리과',   role:'user',     group:'탄소중립 조회',       menus:[0,3],             menuCount:28,  status:'active',   lastLogin:'2026.06.03 11:00', regDate:'2025.05.02' },
    { id:'kang08', name:'강OO',  dept:'스마트도시과',  role:'admin',    group:'전체 관리',          menus:[0,1,2,3,4,5,6,7], menuCount:128, status:'active',   lastLogin:'2026.06.04 08:45', regDate:'2025.01.20' },
    { id:'yoon09', name:'윤OO',  dept:'교통정책과',   role:'dept',     group:'모빌리티 조회·수정',  menus:[0,1,2],           menuCount:60,  status:'pending',  lastLogin:'—',                regDate:'2026.05.28' },
    { id:'lim10',  name:'임OO',  dept:'정보통신과',   role:'external', group:'시스템 모니터링',     menus:[0,1,6],           menuCount:35,  status:'active',   lastLogin:'2026.06.04 13:30', regDate:'2025.03.15' }
  ];

  const ROLE_LBL = { admin:'관리자', dept:'부서 담당자', external:'외부 연계 사용자', user:'일반 사용자' };
  const STATUS_LBL  = { active:'사용 중', pending:'승인 대기', inactive:'비활성', locked:'잠김' };
  const STATUS_PILL = { active:'pill--ok', pending:'pill--warn', inactive:'pill--stop', locked:'pill--err' };

  let filters = { role:'', dept:'', status:'', q:'' };
  let currentPage = 1;
  let pageSize = 10;
  let currentUid = null;

  /* ── 헬퍼 ── */
  function roleBadge(role) {
    return `<span class="role-badge role-badge--${role}">${ROLE_LBL[role] || role}</span>`;
  }
  function statusPill(status) {
    return `<span class="pill ${STATUS_PILL[status] || 'pill--stop'}">${STATUS_LBL[status] || status}</span>`;
  }
  function filteredUsers() {
    return USERS.filter(u => {
      if (filters.role   && u.role   !== filters.role)   return false;
      if (filters.dept   && u.dept   !== filters.dept)   return false;
      if (filters.status && u.status !== filters.status) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!u.name.toLowerCase().includes(q) &&
            !u.id.toLowerCase().includes(q)   &&
            !u.dept.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  let selectedIds = new Set();

  function updateBulkBar() {
    const bar = document.getElementById('suBulkBar');
    const cnt = document.getElementById('suBulkCount');
    if (!bar) return;
    if (selectedIds.size > 0) {
      bar.style.display = 'flex';
      cnt.textContent = `${selectedIds.size}명 선택됨`;
    } else {
      bar.style.display = 'none';
    }
  }

  /* ── 테이블 렌더 ── */
  function renderTable() {
    const data = filteredUsers();
    const tbody = document.getElementById('userTbody');

    if (!data.length) {
      tbody.innerHTML = `<tr class="tbl__empty"><td colspan="11"><i data-lucide="inbox"></i>조건에 맞는 사용자가 없습니다.</td></tr>`;
      lucide.createIcons();
      document.getElementById('userPagination').innerHTML = '';
      return;
    }

    const start = (currentPage - 1) * pageSize;
    const slice = data.slice(start, start + pageSize);

    tbody.innerHTML = slice.map(u => `
      <tr data-uid="${u.id}">
        <td style="padding:0 10px;text-align:center"><input type="checkbox" class="su-row-chk" data-uid="${u.id}" ${selectedIds.has(u.id)?'checked':''} aria-label="${u.name} 선택"></td>
        <td class="l" style="font-weight:700;color:var(--fg-1)">${u.name}</td>
        <td style="font:500 13px/1 monospace;color:var(--fg-3)">${u.id}</td>
        <td style="font-size:14px">${u.dept}</td>
        <td>${roleBadge(u.role)}</td>
        <td style="font-size:13px;color:var(--fg-2)">${u.group}</td>
        <td class="num">${u.menuCount}</td>
        <td>${statusPill(u.status)}</td>
        <td style="font-size:13px;color:var(--fg-3);white-space:nowrap">${u.lastLogin}</td>
        <td style="font-size:13px;color:var(--fg-3);white-space:nowrap">${u.regDate}</td>
        <td style="text-align:center">
          <button class="tbtn tbtn--sm su-edit-btn" data-uid="${u.id}" type="button">보기</button>
        </td>
      </tr>`).join('');

    lucide.createIcons();
    renderPagination(data.length);

    tbody.querySelectorAll('.su-row-chk').forEach(chk => {
      chk.addEventListener('change', e => {
        e.stopPropagation();
        if (chk.checked) selectedIds.add(chk.dataset.uid);
        else selectedIds.delete(chk.dataset.uid);
        updateBulkBar();
      });
    });
    tbody.querySelectorAll('tr[data-uid]').forEach(tr => {
      tr.addEventListener('click', e => {
        if (e.target.type === 'checkbox' || e.target.classList.contains('tbtn')) return;
        openDrawer(tr.dataset.uid);
      });
      tr.querySelector('.su-edit-btn').addEventListener('click', e => {
        e.stopPropagation();
        openDrawer(tr.dataset.uid);
      });
    });

    const allChk = document.getElementById('suCheckAll');
    if (allChk) {
      allChk.checked = slice.every(u => selectedIds.has(u.id));
    }
  }

  /* ── 페이지네이션 ── */
  function renderPagination(total) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const pag = document.getElementById('userPagination');

    let html = `<span class="su-pagination__total">전체 ${total}건</span>`;
    html += `<button class="su-pg-btn" data-act="prev" ${currentPage===1?'disabled':''}><i data-lucide="chevron-left" style="width:14px;height:14px"></i></button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="su-pg-btn ${i===currentPage?'on':''}" data-act="${i}">${i}</button>`;
    }
    html += `<button class="su-pg-btn" data-act="next" ${currentPage===pages?'disabled':''}><i data-lucide="chevron-right" style="width:14px;height:14px"></i></button>`;
    pag.innerHTML = html;
    lucide.createIcons();

    pag.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        if (act === 'prev' && currentPage > 1)    { currentPage--; renderTable(); }
        else if (act === 'next' && currentPage < pages) { currentPage++; renderTable(); }
        else if (!isNaN(act)) { currentPage = +act; renderTable(); }
      });
    });
  }

  /* ── 드로어 ── */
  function openDrawer(uid) {
    currentUid = uid;
    const u = USERS.find(x => x.id === uid);
    if (!u) return;

    document.getElementById('ud_userId').textContent = u.id;
    document.getElementById('ud_roleBadgeK').innerHTML = roleBadge(u.role);
    document.getElementById('ud_name').textContent = u.name;
    document.getElementById('ud_id').textContent   = u.id;
    document.getElementById('ud_dept').textContent = u.dept;
    document.getElementById('ud_role').innerHTML   = roleBadge(u.role);
    document.getElementById('ud_group').textContent     = u.group;
    document.getElementById('ud_lastLogin').textContent = u.lastLogin;
    document.getElementById('ud_regDate').textContent   = u.regDate;

    /* 접근 가능 메뉴 */
    document.getElementById('ud_menuList').innerHTML = MENUS.map((m, i) => `
      <label class="su-menu-item">
        <input type="checkbox" ${u.menus.includes(i) ? 'checked' : ''}>
        <span class="menu-ic"><i data-lucide="${m.icon}"></i></span>
        <span class="menu-nm">${m.label}</span>
      </label>`).join('');

    /* 상태 토글 */
    const toggle = document.getElementById('ud_statusToggle');
    const lbl    = document.getElementById('ud_toggleLbl');
    toggle.checked    = u.status === 'active';
    lbl.textContent   = u.status === 'active' ? '사용 중' : '비활성';
    toggle.onchange   = () => { lbl.textContent = toggle.checked ? '사용 중' : '비활성'; };

    document.getElementById('userDrawer').classList.add('on');
    document.getElementById('userDrawer').setAttribute('aria-hidden', 'false');
    document.getElementById('scrim').classList.add('on');
    lucide.createIcons();
  }

  function closeDrawer() {
    document.getElementById('userDrawer').classList.remove('on');
    document.getElementById('userDrawer').setAttribute('aria-hidden', 'true');
    document.getElementById('scrim').classList.remove('on');
  }

  /* ── 필터 초기화 ── */
  function initFilters() {
    document.getElementById('searchBtn').addEventListener('click', applyFilter);
    document.getElementById('resetBtn').addEventListener('click', () => {
      document.getElementById('filterRole').value = '';
      document.getElementById('filterDept').value = '';
      document.getElementById('filterStatus').value = '';
      document.getElementById('userSearch').value = '';
      filters = { role:'', dept:'', status:'', q:'' };
      currentPage = 1;
      renderTable();
    });
    document.getElementById('userSearch').addEventListener('keydown', e => {
      if (e.key === 'Enter') applyFilter();
    });
  }

  function applyFilter() {
    filters.role   = document.getElementById('filterRole').value;
    filters.dept   = document.getElementById('filterDept').value;
    filters.status = document.getElementById('filterStatus').value;
    filters.q      = document.getElementById('userSearch').value.trim();
    currentPage = 1;
    renderTable();
  }

  /* ── 드로어 이벤트 ── */
  function initDrawer() {
    ['udClose', 'udClose2'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', closeDrawer);
    });
    document.getElementById('scrim').addEventListener('click', closeDrawer);
    document.getElementById('udSave').addEventListener('click', () => {
      const u = USERS.find(x => x.id === currentUid);
      if (u) {
        const toggle = document.getElementById('ud_statusToggle');
        u.status = toggle.checked ? 'active' : 'inactive';
        renderTable();
        showToast('저장되었습니다.');
      }
      closeDrawer();
    });
    document.getElementById('udDeactivate').addEventListener('click', () => {
      const u = USERS.find(x => x.id === currentUid);
      if (!u) return;
      if (!confirm(`'${u.name}' 계정을 비활성화하시겠습니까?\n비활성화된 계정은 로그인이 불가능합니다.`)) return;
      u.status = 'inactive';
      renderTable();
      showToast('비활성 처리되었습니다.');
      closeDrawer();
    });
    document.getElementById('ud_pwBtn').addEventListener('click', () => {
      alert('비밀번호 초기화 이메일이 발송되었습니다.');
    });
    document.getElementById('addUserBtn').addEventListener('click', openRegModal);
  }

  /* ── 사용자 등록 모달 ── */
  function openRegModal() {
    const scrim = document.getElementById('suRegScrim');
    const modal = document.getElementById('suRegModal');
    if (!scrim || !modal) return;
    // 임시 비밀번호 자동생성
    const pw = document.getElementById('regPw');
    if (pw) pw.value = 'Gmsb@' + Math.random().toString(36).slice(2,8).toUpperCase();
    scrim.style.display = 'block'; modal.style.display = 'flex';
    lucide.createIcons();
  }
  function closeRegModal() {
    document.getElementById('suRegScrim').style.display = 'none';
    document.getElementById('suRegModal').style.display = 'none';
    ['regName','regId','regEmail','regNote'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
  }
  function initRegModal() {
    document.getElementById('suRegClose')?.addEventListener('click', closeRegModal);
    document.getElementById('suRegCancel')?.addEventListener('click', closeRegModal);
    document.getElementById('suRegScrim')?.addEventListener('click', closeRegModal);
    document.getElementById('suRegSave')?.addEventListener('click', () => {
      const name = document.getElementById('regName')?.value.trim();
      const id   = document.getElementById('regId')?.value.trim();
      const dept = document.getElementById('regDept')?.value;
      if (!name || !id || !dept) { showToast('사용자명, ID, 소속 부서는 필수입니다.'); return; }
      if (USERS.find(u => u.id === id)) { showToast('이미 사용 중인 ID입니다.'); return; }
      USERS.push({
        id, name, dept,
        role: document.getElementById('regRole')?.value || 'user',
        group: document.getElementById('regGroup')?.value || '데이터 조회',
        menus: [0], menuCount: 1, status: 'pending',
        lastLogin: '—', regDate: new Date().toISOString().slice(0,10).replace(/-/g,'.')
      });
      renderTable();
      closeRegModal();
      showToast(`'${name}' 계정이 등록되었습니다. (승인 대기)`);
    });
  }

  /* ── 접속 로그 모달 ── */
  const LOG_MOCK = [
    { dt:'2026.06.04 15:07', ip:'10.0.1.14', browser:'Chrome 124', result:'성공' },
    { dt:'2026.06.04 09:22', ip:'10.0.1.14', browser:'Chrome 124', result:'성공' },
    { dt:'2026.06.03 17:45', ip:'10.0.1.14', browser:'Chrome 124', result:'성공' },
    { dt:'2026.06.02 11:08', ip:'10.0.1.99', browser:'Edge 124',   result:'실패 (비밀번호 오류)' },
    { dt:'2026.06.01 08:30', ip:'10.0.1.14', browser:'Chrome 124', result:'성공' }
  ];
  function openLogModal(uid) {
    const u = USERS.find(x => x.id === uid);
    const scrim = document.getElementById('suLogScrim');
    const modal = document.getElementById('suLogModal');
    if (!scrim || !modal || !u) return;
    document.getElementById('suLogUserName').textContent = u.name + ' (' + u.id + ')';
    document.getElementById('suLogBody').innerHTML = LOG_MOCK.map(l => {
      const ok = l.result === '성공';
      return `<tr>
        <td style="white-space:nowrap">${l.dt}</td>
        <td style="font:500 12px/1 monospace">${l.ip}</td>
        <td style="font-size:13px">${l.browser}</td>
        <td><span class="pill ${ok?'pill--ok':'pill--err'}">${l.result}</span></td>
      </tr>`;
    }).join('');
    scrim.style.display = 'block'; modal.style.display = 'flex';
    lucide.createIcons();
  }
  function closeLogModal() {
    document.getElementById('suLogScrim').style.display = 'none';
    document.getElementById('suLogModal').style.display = 'none';
  }
  function initLogModal() {
    document.getElementById('suLogClose')?.addEventListener('click', closeLogModal);
    document.getElementById('suLogCloseBtn')?.addEventListener('click', closeLogModal);
    document.getElementById('suLogScrim')?.addEventListener('click', closeLogModal);
    document.getElementById('ud_logBtn')?.addEventListener('click', () => {
      closeDrawer();
      openLogModal(currentUid);
    });
  }

  /* ── CSV 내보내기 ── */
  function exportCsv() {
    const data = filteredUsers();
    const header = ['사용자명','ID','부서','역할','권한 그룹','접근 메뉴 수','상태','최근 접속','등록일'];
    const rows = data.map(u => [u.name, u.id, u.dept, ROLE_LBL[u.role]||u.role, u.group, u.menuCount, STATUS_LBL[u.status]||u.status, u.lastLogin, u.regDate]);
    const csv = '﻿' + [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'users_export_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── 일괄 처리 ── */
  function initBulkActions() {
    document.getElementById('suCheckAll')?.addEventListener('change', e => {
      const data = filteredUsers();
      const start = (currentPage-1)*pageSize;
      const slice = data.slice(start, start+pageSize);
      slice.forEach(u => { if (e.target.checked) selectedIds.add(u.id); else selectedIds.delete(u.id); });
      renderTable();
      updateBulkBar();
    });
    document.getElementById('suBulkDeactivate')?.addEventListener('click', () => {
      if (!confirm(`선택한 ${selectedIds.size}명을 일괄 비활성화하시겠습니까?`)) return;
      selectedIds.forEach(id => { const u = USERS.find(x => x.id===id); if (u) u.status='inactive'; });
      selectedIds.clear(); updateBulkBar(); renderTable();
      showToast('일괄 비활성화가 완료되었습니다.');
    });
    document.getElementById('suBulkGroup')?.addEventListener('click', () => {
      const grp = prompt('변경할 권한 그룹명을 입력하세요:');
      if (!grp) return;
      selectedIds.forEach(id => { const u = USERS.find(x => x.id===id); if (u) u.group=grp; });
      selectedIds.clear(); updateBulkBar(); renderTable();
      showToast(`권한 그룹이 '${grp}'으로 변경되었습니다.`);
    });
    document.getElementById('suBulkCancel')?.addEventListener('click', () => {
      selectedIds.clear(); updateBulkBar(); renderTable();
    });
    document.getElementById('btnExportCsv')?.addEventListener('click', exportCsv);
  }

  /* ── 부트 ── */
  function boot() {
    initFilters();
    initDrawer();
    initRegModal();
    initLogModal();
    initBulkActions();
    renderTable();

    /* 새로고침 */
    document.getElementById('btnRefresh')?.addEventListener('click', () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const el = document.getElementById('lastUpdated');
      if (el) el.textContent = hm;
      showToast('데이터가 갱신되었습니다.');
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1A2942;color:#fff;padding:12px 24px;border-radius:10px;font:500 14px/1 var(--font-sans);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.2);pointer-events:none;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  document.addEventListener('gmsb:shell-ready', boot);
})();
