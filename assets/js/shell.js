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
  var BASE = window.GMSB_BASE || '';
  var NAV = window.GMSB_NAV || [];
  var BRAND = window.GMSB_BRAND || {};
  var PAGE = window.GMSB_PAGE || { active: 'home' };

  // base 를 href 에 적용 (외부링크/앵커는 그대로)
  function url(href) {
    if (!href || href === '#' || /^(https?:|mailto:|#)/.test(href)) return href || '#';
    return BASE + href;
  }
  function el(id) { return document.getElementById(id); }

  /* ---- active 파싱: 'section.sub' 또는 'home' ---- */
  var parts = (PAGE.active || '').split('.');
  var activeSection = parts[0] || '';
  var activeSub = parts[1] || '';

  /* ============ TOP BAR ============ */
  function renderTopbar() {
    var mount = el('gmsb-topbar'); if (!mount) return;
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
          '<span class="tb__user"><i data-lucide="user-round" class="gp-ico"></i>' + (BRAND.user || '') + '</span>' +
          '<button class="tb__bell" aria-label="알림 ' + (BRAND.alerts || 0) + '건">' +
            '<i data-lucide="bell" class="gp-ico"></i>' +
            (BRAND.alerts ? '<span class="dot">' + BRAND.alerts + '</span>' : '') +
          '</button>' +
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

  /* ============ 실행 ============ */
  function init() {
    renderTopbar();
    renderSidebar();
    renderHeader();
    wireSidebar();
    wirePinButton();
    if (window.lucide && lucide.createIcons) lucide.createIcons();
    window.GMSB_SHELL_READY = true;
    document.dispatchEvent(new CustomEvent('gmsb:shell-ready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
