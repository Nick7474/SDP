/* =====================================================================
   광명 스마트데이터보드 · SHELL 렌더러
   ---------------------------------------------------------------------
   반복되는 상단바 + 좌측 메뉴 + 페이지 헤더(브레드크럼/타이틀/설명)를
   nav.config.js + 각 페이지의 window.GMSB_PAGE 설정으로부터 자동 생성합니다.

   각 페이지에서 할 일:
   1) <body> 안에 마운트 지점 3개를 둔다 (없으면 자동 생성):
        <div id="gmsb-topbar"></div>
        <div class="shell">
          <div id="gmsb-sidebar"></div>
          <main class="page"> <div id="gmsb-header"></div> ...내용... </main>
        </div>
   2) shell.js 앞에서 페이지 정보를 선언한다:
        window.GMSB_BASE = '';          // 루트면 '', /pages/ 안이면 '../'
        window.GMSB_PAGE = {
          active: 'op.data-monitoring', // 활성 메뉴 (섹션.하위) — 홈은 'home'
          header: {                     // 생략하면 페이지 헤더 미표시(홈)
            title: '데이터 모니터링',
            desc:  '데이터 수집 상태와 …',
            actions: '<button class="btn btn--line">…</button>'  // 선택
          }
        };
   3) nav.config.js → shell.js 순서로 로드. (lucide 는 그 전에 로드)
   ===================================================================== */
(function () {
  var BASE  = window.GMSB_BASE  || '';
  var NAV   = window.GMSB_NAV   || [];
  var BRAND = window.GMSB_BRAND || {};
  var PAGE  = window.GMSB_PAGE  || { active: 'home' };

  function url(href) {
    if (!href || href === '#' || /^(https?:|mailto:|#)/.test(href)) return href || '#';
    return BASE + href;
  }
  function el(id) { return document.getElementById(id); }

  /* ---- active 파싱: 'section.sub' 또는 'home' ---- */
  var parts = (PAGE.active || '').split('.');
  var activeSection = parts[0] || '';
  var activeSub     = parts[1] || '';

  /* ============ 인증 확인 ============ */
  function checkAuth() {
    if (!sessionStorage.getItem('gmsb-auth')) {
      location.replace(BASE + 'login.html');
      return false;
    }
    try {
      var auth = JSON.parse(sessionStorage.getItem('gmsb-auth'));
      if (auth && auth.user) BRAND.user = auth.user;
    } catch (e) {}
    return true;
  }

  /* ============ 알림 데이터 (프로토타입용 샘플) ============ */
  var NOTIFS = [
    { type: 'warn',    icon: 'alert-triangle',  title: '연계 시스템 응답 지연 감지',    time: '15분 전',  read: false, href: 'pages/linkage-monitoring.html'   },
    { type: 'info',    icon: 'database',         title: '에너지 데이터 수집 완료',        time: '1시간 전', read: false, href: 'pages/operation-monitoring.html' },
    { type: 'success', icon: 'check-circle-2',   title: 'GIS 배치 처리 완료',             time: '3시간 전', read: true,  href: 'pages/gis-manage.html'           },
    { type: 'danger',  icon: 'alert-circle',     title: '스마트 센서 오류 감지 (3건)',    time: '어제',     read: true,  href: 'pages/status-monitoring.html'    },
    { type: 'info',    icon: 'file-text',        title: '탄소중립 월간 보고서 업데이트', time: '어제',     read: true,  href: 'pages/carbon-summary.html'       }
  ];

  /* ============ TOP BAR ============ */
  function renderTopbar() {
    var mount = el('gmsb-topbar'); if (!mount) return;

    var unread = NOTIFS.filter(function (n) { return !n.read; }).length;

    var notifItems = NOTIFS.map(function (n, i) {
      return '<div class="tb__notif-item' + (n.read ? ' tb__notif-item--read' : '') + '" data-idx="' + i + '" role="button" tabindex="0">' +
        '<span class="tb__notif-ic tb__notif-ic--' + n.type + '"><i data-lucide="' + n.icon + '"></i></span>' +
        '<div class="tb__notif-bd">' +
          '<p class="tb__notif-txt">' + n.title + '</p>' +
          '<time class="tb__notif-tm">' + n.time + '</time>' +
        '</div>' +
        (n.read ? '' : '<span class="tb__notif-dot" aria-hidden="true"></span>') +
      '</div>';
    }).join('');

    mount.outerHTML =
      '<header class="tb">' +
        '<a class="tb__brand" href="' + url(BRAND.logo ? 'index.html' : '#') + '" aria-label="' + (BRAND.name || '') + ' 홈">' +
          '<img src="' + url(BRAND.logo) + '" alt="">' +
          '<b>' + (BRAND.name || '') + '</b>' +
        '</a>' +
        '<div class="tb__center">' +
          '<img src="' + url(BRAND.cityLogo) + '" alt="광명시">' +
          '<span class="ct">' + (BRAND.cityTitle || '') + '</span>' +
        '</div>' +
        '<div class="tb__util">' +

          /* ── 계정 드롭다운 ── */
          '<div class="tb__user-wrap" id="gmsb-user-wrap">' +
            '<button class="tb__user" id="gmsb-user-btn" type="button" aria-haspopup="menu" aria-expanded="false">' +
              '<span class="tb__user-av"><i data-lucide="user-round"></i></span>' +
              '<span class="tb__user-name">' + (BRAND.user || '') + '</span>' +
              '<i data-lucide="chevron-down" class="tb__user-caret"></i>' +
            '</button>' +
            '<div class="tb__user-drop" id="gmsb-user-drop" role="menu" aria-hidden="true">' +
              '<div class="tb__drop-info">' +
                '<div class="tb__drop-av"><i data-lucide="user-round"></i></div>' +
                '<div>' +
                  '<p class="tb__drop-name">' + (BRAND.user || '') + '</p>' +
                  '<p class="tb__drop-role">시스템 관리자</p>' +
                '</div>' +
              '</div>' +
              '<hr class="tb__drop-sep">' +
              '<a class="tb__drop-item" href="' + url('pages/system-users.html') + '" role="menuitem">' +
                '<i data-lucide="user"></i>내 정보 관리' +
              '</a>' +
              '<a class="tb__drop-item" href="' + url('pages/system-prefs.html') + '" role="menuitem">' +
                '<i data-lucide="settings"></i>시스템 설정' +
              '</a>' +
              '<hr class="tb__drop-sep">' +
              '<button class="tb__drop-item tb__drop-item--out" id="gmsb-logout" type="button" role="menuitem">' +
                '<i data-lucide="log-out"></i>로그아웃' +
              '</button>' +
            '</div>' +
          '</div>' +

          /* ── 알림 벨 + 패널 ── */
          '<div class="tb__bell-wrap" id="gmsb-bell-wrap">' +
            '<button class="tb__bell" id="gmsb-bell" type="button" aria-label="알림 ' + unread + '건" aria-haspopup="dialog" aria-expanded="false">' +
              '<i data-lucide="bell" class="gp-ico"></i>' +
              '<span class="dot" id="gmsb-bell-dot"' + (unread ? '' : ' style="display:none"') + '>' + unread + '</span>' +
            '</button>' +
            '<div class="tb__notif-panel" id="gmsb-notif-panel" role="dialog" aria-label="알림" aria-hidden="true">' +
              '<div class="tb__notif-hd">' +
                '<span>알림 <em class="tb__notif-badge" id="gmsb-notif-count">' + unread + '</em></span>' +
                '<button class="tb__notif-x" id="gmsb-notif-close" type="button" aria-label="닫기"><i data-lucide="x"></i></button>' +
              '</div>' +
              '<div class="tb__notif-list" id="gmsb-notif-list">' + notifItems + '</div>' +
              '<div class="tb__notif-ft">' +
                '<button class="tb__notif-all" id="gmsb-notif-mark-all" type="button">모두 읽음 표시</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</header>';
  }

  /* ============ SIDEBAR ============ */
  function renderSidebar() {
    var mount = el('gmsb-sidebar'); if (!mount) return;
    var items = NAV.map(function (it) {
      var isActive = it.id === activeSection;
      var icHtml = it.img
        ? '<img src="' + url('assets/img/Property 1=' + it.img) + '" alt="">'
        : '<i data-lucide="' + it.icon + '"></i>';
      // 단일 링크 (children 없음)
      if (!it.children) {
        return '<div class="snb__item' + (isActive ? ' active' : '') + '">' +
          '<a class="snb__link" href="' + url(it.href) + '">' +
            '<span class="ic">' + icHtml + '</span>' +
            '<span class="lb">' + it.label + '</span>' +
          '</a></div>';
      }
      // 그룹 (2-depth)
      var subs = it.children.map(function (c) {
        var subActive = isActive && c.id === activeSub;
        return '<a href="' + url(c.href) + '"' + (subActive ? ' class="active"' : '') + '>' + c.label + '</a>';
      }).join('');
      return '<div class="snb__item' + (isActive ? ' active open' : '') + '" data-group>' +
        '<button class="snb__link" type="button">' +
          '<span class="ic">' + icHtml + '</span>' +
          '<span class="lb">' + it.label + '</span>' +
          '<i data-lucide="chevron-down" class="ca"></i>' +
        '</button>' +
        '<div class="snb__sub">' + subs + '</div>' +
      '</div>';
    }).join('');

    mount.outerHTML =
      '<nav class="snb" id="snb" aria-label="주 메뉴">' +
        '<div class="snb__list">' + items + '</div>' +
        '<div class="snb__bottom">' +
          '<button class="snb__pin" id="snb-pin" type="button" aria-label="메뉴 고정" title="메뉴 고정">' +
            '<span class="snb__pin-ic snb__pin-ic--pin"><i data-lucide="pin"></i></span>' +
            '<span class="snb__pin-ic snb__pin-ic--off"><i data-lucide="pin-off"></i></span>' +
            '<span class="snb__pin-lb">메뉴 고정</span>' +
          '</button>' +
          '<div class="snb__foot"><img src="' + url('assets/img/LM_logo.jpg') + '" alt="광명시"></div>' +
        '</div>' +
      '</nav>';
  }

  /* ============ PAGE HEADER ============ */
  function renderHeader() {
    var mount = el('gmsb-header'); if (!mount) return;
    var h = PAGE.header;
    if (!h) { mount.remove(); return; }   // 홈 등 헤더 없는 페이지

    // breadcrumb: 홈아이콘 › 섹션 › 현재
    var crumbs = '<a href="' + url('index.html') + '"><i data-lucide="home" class="gp-ico"></i></a>';
    var section = NAV.filter(function (n) { return n.id === activeSection; })[0];
    var current = h.title;
    if (section && section.children) {
      crumbs += '<span class="sep">›</span><a href="' + url(section.children[0].href) + '">' + section.label.replace(/<br\s*\/?>/gi, ' ') + '</a>';
      var sub = section.children.filter(function (c) { return c.id === activeSub; })[0];
      if (sub) current = sub.label;
    } else if (section) {
      crumbs += '<span class="sep">›</span>';
    }
    crumbs += '<span class="sep">›</span><span class="cur">' + current + '</span>';

    mount.outerHTML =
      '<div class="ph">' +
        '<nav class="crumbs" aria-label="위치">' + crumbs + '</nav>' +
        '<div class="ph__row">' +
          '<div>' +
            '<h1 class="ph__t">' + h.title + '</h1>' +
            (h.desc ? '<p class="ph__d">' + h.desc + '</p>' : '') +
          '</div>' +
          (h.actions ? '<div class="ph__right">' + h.actions + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  /* ============ SIDEBAR 인터랙션 (호버 + 아코디언 2-depth) ============ */
  function wireSidebar() {
    var snb = document.getElementById('snb'); if (!snb) return;

    // 아코디언 2-depth
    var groups = snb.querySelectorAll('.snb__item[data-group]');
    groups.forEach(function (g) {
      var btn = g.querySelector('.snb__link');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOpen = g.classList.contains('open');
        groups.forEach(function (o) { o.classList.remove('open'); });
        if (!wasOpen) g.classList.add('open');
      });
    });

    // 마우스 떠나면 비활성 그룹 접기 (핀 고정 시 무시)
    snb.addEventListener('mouseleave', function () {
      if (snb.classList.contains('snb--pinned')) return;
      groups.forEach(function (o) {
        o.classList.toggle('open', o.classList.contains('active'));
      });
    });
  }

  /* ============ PIN BUTTON (메뉴 고정/해제) ============ */
  function wirePinButton() {
    var snb = document.getElementById('snb');
    var btn = document.getElementById('snb-pin');
    if (!snb || !btn) return;
    // 페이지 이동 후에도 고정 상태 복원
    if (localStorage.getItem('gmsb-snb-pinned') === '1') {
      snb.classList.add('snb--pinned');
      btn.title = '메뉴 고정 해제';
      btn.setAttribute('aria-label', '메뉴 고정 해제');
    }
    btn.addEventListener('click', function () {
      var pinned = snb.classList.toggle('snb--pinned');
      var label = pinned ? '메뉴 고정 해제' : '메뉴 고정';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      localStorage.setItem('gmsb-snb-pinned', pinned ? '1' : '0');
    });
  }

  /* ============ UTIL — 계정 드롭다운 + 알림 패널 ============ */
  function wireUtil() {
    var userWrap   = el('gmsb-user-wrap');
    var userBtn    = el('gmsb-user-btn');
    var userDrop   = el('gmsb-user-drop');
    var bellWrap   = el('gmsb-bell-wrap');
    var bellBtn    = el('gmsb-bell');
    var notifPanel = el('gmsb-notif-panel');
    var notifClose = el('gmsb-notif-close');
    var markAllBtn = el('gmsb-notif-mark-all');
    var notifList  = el('gmsb-notif-list');
    var logoutBtn  = el('gmsb-logout');

    function closeUser() {
      if (userDrop) { userDrop.classList.remove('on'); userDrop.setAttribute('aria-hidden', 'true'); }
      if (userBtn)  { userBtn.setAttribute('aria-expanded', 'false'); }
    }
    function openUser() {
      closeNotif();
      if (userDrop) { userDrop.classList.add('on'); userDrop.removeAttribute('aria-hidden'); }
      if (userBtn)  { userBtn.setAttribute('aria-expanded', 'true'); }
    }
    function closeNotif() {
      if (notifPanel) { notifPanel.classList.remove('on'); notifPanel.setAttribute('aria-hidden', 'true'); }
      if (bellBtn)    { bellBtn.setAttribute('aria-expanded', 'false'); }
    }
    function openNotif() {
      closeUser();
      if (notifPanel) { notifPanel.classList.add('on'); notifPanel.removeAttribute('aria-hidden'); }
      if (bellBtn)    { bellBtn.setAttribute('aria-expanded', 'true'); }
    }

    if (userBtn) {
      userBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userDrop && userDrop.classList.contains('on') ? closeUser() : openUser();
      });
    }
    if (bellBtn) {
      bellBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        notifPanel && notifPanel.classList.contains('on') ? closeNotif() : openNotif();
      });
    }
    if (notifClose) {
      notifClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeNotif();
      });
    }

    // 바깥 클릭 시 닫기
    document.addEventListener('click', function (e) {
      if (userWrap   && !userWrap.contains(e.target))   closeUser();
      if (bellWrap   && !bellWrap.contains(e.target))   closeNotif();
    });

    // Esc 키로 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeUser(); closeNotif(); }
    });

    // 로그아웃
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem('gmsb-auth');
        location.replace(BASE + 'login.html');
      });
    }

    // 배지 업데이트 헬퍼
    function updateBadge() {
      var unread = NOTIFS.filter(function (n) { return !n.read; }).length;
      var dot      = el('gmsb-bell-dot');
      var countEl  = el('gmsb-notif-count');
      if (dot)     { dot.textContent = unread; dot.style.display = unread ? '' : 'none'; }
      if (countEl) { countEl.textContent = unread; }
      if (bellBtn) { bellBtn.setAttribute('aria-label', '알림 ' + unread + '건'); }
      // 외부 API 도 동기화
      if (typeof window.GMSB_SET_ALERT_COUNT === 'function') {
        window.GMSB_SET_ALERT_COUNT(unread);
      }
    }

    // 모두 읽음
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function () {
        NOTIFS.forEach(function (n) { n.read = true; });
        document.querySelectorAll('.tb__notif-item').forEach(function (item) {
          item.classList.add('tb__notif-item--read');
          var dot = item.querySelector('.tb__notif-dot');
          if (dot) dot.remove();
        });
        updateBadge();
      });
    }

    // 개별 알림 클릭 — 읽음 처리 후 관련 페이지로 이동
    if (notifList) {
      notifList.addEventListener('click', function (e) {
        var item = e.target.closest('.tb__notif-item');
        if (!item) return;
        var idx = parseInt(item.getAttribute('data-idx'), 10);
        if (isNaN(idx) || !NOTIFS[idx]) return;
        var n = NOTIFS[idx];
        if (!n.read) {
          n.read = true;
          item.classList.add('tb__notif-item--read');
          var dot = item.querySelector('.tb__notif-dot');
          if (dot) dot.remove();
          updateBadge();
        }
        if (n.href) {
          location.href = url(n.href);
        }
      });
    }
  }

  /* ============ 실행 ============ */
  function init() {
    if (!checkAuth()) return;
    renderTopbar();
    renderSidebar();
    renderHeader();
    wireSidebar();
    wirePinButton();
    wireUtil();
    if (window.lucide && lucide.createIcons) lucide.createIcons();
    window.GMSB_SHELL_READY = true;
    /* 페이지 JS에서 window.GMSB_ALERT_COUNT = N 로 배지 설정 가능 */
    window.GMSB_SET_ALERT_COUNT = function (n) {
      var dot  = document.getElementById('gmsb-bell-dot');
      var bell = document.getElementById('gmsb-bell');
      if (!dot) return;
      if (n > 0) { dot.textContent = n > 99 ? '99+' : n; dot.style.display = ''; }
      else { dot.style.display = 'none'; }
      if (bell) bell.setAttribute('aria-label', '알림 ' + n + '건');
    };
    if (typeof window.GMSB_ALERT_COUNT === 'number') {
      window.GMSB_SET_ALERT_COUNT(window.GMSB_ALERT_COUNT);
    }
    /* 탭이 있는 페이지에서 탭 전환 시 헤더(H1·설명·브레드크럼프 3뎁스)를 업데이트 */
    window.gmsbSetTab = function (label, desc) {
      var ph = document.querySelector('.ph');
      if (!ph) return;
      var h1 = ph.querySelector('.ph__t');
      if (h1) h1.textContent = label;
      if (desc !== undefined) {
        var d = ph.querySelector('.ph__d');
        if (d) d.textContent = desc;
      }
      var crumbs = ph.querySelector('.crumbs');
      if (!crumbs) return;
      if (!crumbs.dataset.pageCrumb) {
        var origCur = crumbs.querySelector('span.cur');
        if (!origCur) return;
        crumbs.dataset.pageCrumb = origCur.textContent;
        origCur.className = 'crumb-page';
        var sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = '›';
        var tabCur = document.createElement('span'); tabCur.className = 'cur'; tabCur.textContent = label;
        crumbs.appendChild(sep);
        crumbs.appendChild(tabCur);
      } else {
        var tabCur2 = crumbs.querySelector('span.cur');
        if (tabCur2) tabCur2.textContent = label;
      }
    };
    document.dispatchEvent(new CustomEvent('gmsb:shell-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
