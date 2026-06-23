/* page-system-prefs.js — 시스템 설정 관리 */
(function () {
  'use strict';

  /* ── 탭별 안내 텍스트 ── */
  const GUIDES = {
    env: [
      '운영 화면에 적용되는 기본 설정입니다.',
      '변경 시 전체 관리자 화면에 반영됩니다.',
      'SSO 및 연계 시스템 설정은 별도 메뉴에서 관리합니다.',
      '저장 전 변경 내용을 확인하세요.'
    ],
    policy: [
      '비밀번호 정책은 모든 사용자에게 즉시 적용됩니다.',
      '잠금 해제는 관리자가 직접 처리해야 합니다.',
      '세션 만료 시 진행 중인 작업이 손실될 수 있습니다.',
      '저장 전 반드시 검토하세요.'
    ],
    link: [
      '연계 시스템 변경 시 일시적 데이터 단절이 발생할 수 있습니다.',
      'Endpoint 변경 전 반드시 테스트 연결을 확인하세요.',
      '인증키는 외부에 노출되지 않도록 주의하세요.',
      '변경 후 갱신 주기를 반드시 확인하세요.'
    ],
    sso: [
      'SSO 설정 변경은 모든 사용자의 재로그인을 요구합니다.',
      '클라이언트 시크릿은 암호화되어 저장됩니다.',
      '콜백 URL은 시스템에서 자동으로 관리합니다.',
      '연결 테스트 후 저장하세요.'
    ],
    log: [
      '로그 보관 기간이 짧을수록 스토리지 사용량이 줄어듭니다.',
      '법적 요건에 따라 특정 로그는 의무 보관 기간이 있습니다.',
      '압축 저장 사용 시 최대 40% 용량을 절약할 수 있습니다.',
      '자동 삭제 전 백업 여부를 확인하세요.'
    ]
  };

  /* ── 연계 시스템 Mock 데이터 ── */
  const LINKS = [
    { name:'DRT 운행 시스템',     type:'API',  ep:'/api/drt/v1',           auth:'API Key',    cycle:'실시간', status:'ok', lastConn:'10:14:52' },
    { name:'태양광 모니터링',      type:'API',  ep:'/api/solar/v2',         auth:'OAuth2',     cycle:'1시간',  status:'ok', lastConn:'10:00:00' },
    { name:'미세먼지 IoT 플랫폼', type:'API',  ep:'/iot/dust/stream',       auth:'API Key',    cycle:'10분',   status:'ok', lastConn:'10:13:00' },
    { name:'공공데이터포털',       type:'API',  ep:'data.go.kr/openapi',    auth:'API Key',    cycle:'1일',    status:'ok', lastConn:'08:00:00' },
    { name:'CCTV 관제 시스템',    type:'DB',   ep:'172.16.10.5:5432/cctv', auth:'DB 인증',    cycle:'5분',    status:'err',lastConn:'09:55:10' },
    { name:'행정 DB 연계',        type:'File', ep:'/sftp/admin/export',    auth:'SSH Key',    cycle:'월간',   status:'stop',lastConn:'2026.06.01' }
  ];

  let activeTab = 'env';

  /* ── 탭 전환 ── */
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.sp-menu-item').forEach(btn => {
      btn.classList.toggle('on', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.sp-tab-content').forEach(sec => {
      sec.style.display = 'none';
    });
    const el = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
    if (el) el.style.display = '';

    renderGuide(tabId);
    lucide.createIcons();
  }

  /* ── 안내 패널 ── */
  function renderGuide(tabId) {
    const items = GUIDES[tabId] || [];
    const list = document.getElementById('guideList');
    if (list) {
      list.innerHTML = items.map(g => `<li>${g}</li>`).join('');
    }
  }

  /* ── 연계 시스템 테이블 ── */
  function renderLinkTable() {
    const tbody = document.getElementById('linkTbody');
    if (!tbody) return;
    tbody.innerHTML = LINKS.map(l => {
      const typeCls = l.type === 'DB' ? 'sp-type-badge--db' : l.type === 'File' ? 'sp-type-badge--file' : '';
      const stPill = l.status === 'ok' ? 'pill--ok' : l.status === 'err' ? 'pill--err' : 'pill--stop';
      const stLbl  = l.status === 'ok' ? '정상' : l.status === 'err' ? '오류' : '중지';
      return `<tr>
        <td class="l" style="font-weight:600">${l.name}</td>
        <td><span class="sp-type-badge ${typeCls}">${l.type}</span></td>
        <td class="ep l"><code style="font-size:11px">${l.ep}</code></td>
        <td style="font-size:13px;color:var(--fg-3)">${l.auth}</td>
        <td style="font-size:13px;color:var(--fg-3)">${l.cycle}</td>
        <td><span class="pill ${stPill}">${stLbl}</span></td>
        <td style="font-size:12px;color:var(--fg-4);white-space:nowrap">${l.lastConn}</td>
        <td>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px">
            <button class="tbtn tbtn--sm" type="button">수정</button>
            <button class="tbtn tbtn--sm" type="button">테스트</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  /* ── 토글 텍스트 연동 ── */
  function initToggles() {
    document.querySelectorAll('.sp-tgl-input').forEach(input => {
      const row = input.closest('.sp-toggle-row');
      if (!row) return;
      const txt = row.querySelector('.sp-toggle-text');
      if (!txt) return;
      input.addEventListener('change', () => {
        txt.textContent = input.checked ? '사용' : '미사용';
      });
    });
  }

  /* ── SSO 비밀번호 보기 토글 ── */
  function initSsoEye() {
    const eye = document.querySelector('.sp-pw-eye');
    const inp = document.getElementById('ssoSecret');
    if (eye && inp) {
      eye.addEventListener('click', () => {
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        eye.querySelector('i')?.setAttribute('data-lucide', show ? 'eye-off' : 'eye');
        lucide.createIcons();
      });
    }
    document.getElementById('ssoTestBtn')?.addEventListener('click', () => {
      alert('SSO 연결 테스트 완료 - 정상 연결되었습니다.');
    });
  }

  /* ── 하단 액션 바 ── */
  function initActionBar() {
    document.getElementById('spSaveBtn')?.addEventListener('click', () => {
      showToast('설정이 저장되었습니다.');
      const hint = document.getElementById('spHint');
      if (hint) {
        const now = new Date();
        hint.textContent = `마지막 저장: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      }
    });
    document.getElementById('spResetBtn')?.addEventListener('click', () => {
      if (confirm('변경 내용을 초기화하시겠습니까?')) location.reload();
    });
  }

  /* ── 연계 시스템 추가 모달 ── */
  function initLinkModal() {
    const scrim = document.getElementById('spModalScrim');
    const modal = document.getElementById('spLinkModal');
    function openModal() {
      scrim.style.display = 'block'; modal.style.display = 'flex';
      lucide.createIcons();
    }
    function closeModal() {
      scrim.style.display = 'none'; modal.style.display = 'none';
      ['lnkName','lnkEp','lnkDept','lnkNote'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
    }
    document.getElementById('btnAddLink')?.addEventListener('click', openModal);
    document.getElementById('spLinkModalClose')?.addEventListener('click', closeModal);
    document.getElementById('spLinkModalCancel')?.addEventListener('click', closeModal);
    scrim?.addEventListener('click', closeModal);
    document.getElementById('spLinkModalSave')?.addEventListener('click', () => {
      const name = document.getElementById('lnkName')?.value.trim();
      const ep   = document.getElementById('lnkEp')?.value.trim();
      if (!name || !ep) { showToast('시스템명과 Endpoint는 필수입니다.'); return; }
      LINKS.push({
        name, type: document.getElementById('lnkType')?.value,
        ep,   auth: document.getElementById('lnkAuth')?.value,
        cycle: document.getElementById('lnkCycle')?.value,
        status: 'stop', lastConn: '—'
      });
      renderLinkTable();
      closeModal();
      showToast(`'${name}' 연계 시스템이 추가되었습니다.`);
    });
  }

  /* ── 부트 ── */
  function boot() {
    /* 메뉴 클릭 이벤트 */
    document.querySelectorAll('.sp-menu-item').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    renderLinkTable();
    initToggles();
    initSsoEye();
    initActionBar();
    initLinkModal();
    renderGuide('env');
    lucide.createIcons();

    /* 새로고침 */
    document.getElementById('btnRefresh')?.addEventListener('click', () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const el = document.getElementById('lastUpdated');
      if (el) el.textContent = hm;
      showToast('설정이 최신 상태로 갱신되었습니다.');
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
