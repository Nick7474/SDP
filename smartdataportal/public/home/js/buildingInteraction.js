/**
 * Building Hover + Click — Simple image overlay approach
 * No Lottie manipulation. Just shows/hides a pre-designed hover PNG.
 */
(function () {
  'use strict';

  var BUILDINGS = {
    energy: {
      name: '에너지 마일',
      subtitle: '신재생에너지 생산 · 가상거래 현황',
      description: '태양광·풍력·지열 등 신재생에너지 생산 현황과 광명역세권 가상 에너지 거래를 실시간으로 통합 관리합니다.',
      color: '#0C8AE5',
      particleColor: '#37EEFE',
      iconSvg: './img/00_E_O.svg',
      tooltipIconSvg: './img/info_energy.svg',
      hoverImgId: 'hover-img-energy',
    },
    mobility: {
      name: '모빌리티 마일',
      subtitle: '친환경 이동 서비스 통합 운영 현황',
      description: '전기이륜차 배달, EV-DRT 버스, 카셰어링 등 친환경 이동 수단의 통합 운영 현황을 한눈에 파악합니다.',
      color: '#06A85B',
      particleColor: '#37EEFE',
      iconSvg: './img/01_M_O.svg',
      tooltipIconSvg: './img/info_mobility.svg',
      hoverImgId: 'hover-img-mobility',
    },
    safety: {
      name: '세이프티 마일',
      subtitle: 'AIoT 침수·홍수 통합관제 현황',
      description: 'AIoT 수위 센서가 맨홀과 지표면을 24시간 감시해 침수·홍수 위험을 조기에 감지하고 신속 대응합니다.',
      color: '#EC8913',
      particleColor: '#37EEFE',
      iconSvg: './img/02_S_O.svg',
      tooltipIconSvg: './img/info_safety.svg',
      hoverImgId: 'hover-img-safety',
    },
    data: {
      name: '데이터 마일',
      subtitle: '탄소 거래·데이터 통합 플랫폼 현황',
      description: '도시 곳곳에서 수집된 데이터를 탄소 배출권 거래와 연계해 광명시의 탄소중립을 데이터로 추진합니다.',
      color: '#636CCC',
      particleColor: '#37EEFE',
      iconSvg: './img/00_DM.svg',
      tooltipIconSvg: './img/info_Data.svg',
      hoverImgId: 'hover-img-data',
    },
  };

  /* ── Accent color map for modals ── */
  var ACCENT_MAP = {
    energy:   { accent: '#0C8AE5', gradient: 'linear-gradient(135deg,#0C8AE5cc,#0C8AE5)' },
    mobility: { accent: '#06A85B', gradient: 'linear-gradient(135deg,#06A85Bcc,#06A85B)' },
    safety:   { accent: '#EC8913', gradient: 'linear-gradient(135deg,#EC8913cc,#EC8913)' },
    data:     { accent: '#636CCC', gradient: 'linear-gradient(135deg,#636CCCcc,#636CCC)' },
  };

  /* ── BSS Station Data (Mobility only) ── */
  var BSS_DATA = [
    { name: '광명역 BSS',    addr: '광명시 일직로 72',  status: 'active',  avail: 8,  total: 12, swaps: 42 },
    { name: '철산역 BSS',    addr: '광명시 철산로 10',  status: 'active',  avail: 6,  total: 10, swaps: 36 },
    { name: '하안동 BSS',    addr: '광명시 하안로 60',  status: 'active',  avail: 5,  total: 8,  swaps: 28 },
    { name: '소하동 BSS',    addr: '광명시 소하로 48',  status: 'maint',   avail: 3,  total: 10, swaps: 18 },
    { name: '광명사거리 BSS', addr: '광명시 광명로 76',  status: 'active',  avail: 7,  total: 10, swaps: 31 },
    { name: '옥길동 BSS',    addr: '광명시 옥길로 15',  status: 'active',  avail: 9,  total: 12, swaps: 25 },
  ];

  /* ── DOM ─────────────────────────── */
  var overlay = document.getElementById('building-modal-overlay');
  if (!overlay) return;
  var modal     = overlay.querySelector('.bldg-modal');
  var modalBody = overlay.querySelector('.bldg-modal__body');
  var modalTitle = overlay.querySelector('.bldg-modal__title');
  var modalSub  = overlay.querySelector('.bldg-modal__subtitle');
  var modalIcon = overlay.querySelector('.bldg-modal__icon');
  var modalIconImg = document.getElementById('bldg-modal-icon-img');
  var closeBtn  = overlay.querySelector('.bldg-modal__close');
  var backdrop  = overlay.querySelector('.bldg-modal-backdrop');

  /* ── Tooltip ─────────────────────────────── */
  var tooltip = document.getElementById('mile-tooltip');
  var tooltipIconEl = tooltip && tooltip.querySelector('.mile-tooltip__icon img');
  var tooltipNameEl = tooltip && tooltip.querySelector('.mile-tooltip__name');
  var tooltipDescEl = tooltip && tooltip.querySelector('.mile-tooltip__desc');
  var tooltipHintEl = tooltip && tooltip.querySelector('.mile-tooltip__hint');
  var tooltipMode = 'building';
  var tooltipAnchor = null;
  var tooltipTimer = null;

  function positionTooltip() {
    if (!tooltip) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var tw = tooltip.offsetWidth || 244;
    var th = tooltip.offsetHeight || 120;
    var left, top;

    if (tooltipMode === 'building') {
      left = lastPointer.x + 22;
      top  = lastPointer.y - th / 2;
    } else if (tooltipAnchor) {
      var r = tooltipAnchor.getBoundingClientRect();
      if (tooltipMode === 'quickmenu') {
        left = r.left - tw - 14;
        top  = r.top + r.height / 2 - th / 2;
      } else {
        left = r.left + r.width / 2 - tw / 2;
        top  = r.bottom + 10;
        if (top + th > vh - 10) top = r.top - th - 10;
      }
    }

    left = Math.max(10, Math.min(vw - tw - 10, left));
    top  = Math.max(10, Math.min(vh - th - 10, top));
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top + 'px';
  }

  function showTooltip(info, mode, anchor, showHint) {
    if (!tooltip) return;
    clearTimeout(tooltipTimer);
    tooltipMode   = mode;
    tooltipAnchor = anchor || null;
    if (tooltipIconEl) tooltipIconEl.src = info.tooltipIconSvg || info.iconSvg;
    if (tooltipNameEl) tooltipNameEl.textContent = info.name + '이란?';
    if (tooltipDescEl) tooltipDescEl.textContent = info.description;
    if (tooltipHintEl) tooltipHintEl.style.display = showHint ? '' : 'none';
    tooltip.style.setProperty('--tt-accent', info.color);
    positionTooltip();
    tooltipTimer = setTimeout(function () {
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
    }, 80);
  }

  function hideTooltip() {
    clearTimeout(tooltipTimer);
    if (tooltip) {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  /* ── Scroll lock (prevents layout shift) ── */
  var savedScrollY = 0;

  function lockScroll() {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
    // Use fixed positioning to prevent scrollbar disappearance layout shift
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  /* ── Pulse state ────────────────── */
  var pulseId = null;
  var currentImg = null;

  function startPulse(img) {
    stopPulse(); // always clean up before starting new
    currentImg = img;
    currentImg.style.opacity = '1';
    var start = performance.now();
    function tick(now) {
      var t = (now - start) / 1000;
      var v = 0.6 + 0.4 * Math.sin(t * 2.5);
      currentImg.style.opacity = v.toFixed(2);
      pulseId = requestAnimationFrame(tick);
    }
    pulseId = requestAnimationFrame(tick);
  }

  function stopPulse() {
    if (pulseId) { cancelAnimationFrame(pulseId); pulseId = null; }
    if (currentImg) { currentImg.style.opacity = '0'; currentImg = null; }
  }

  /* ── Particles ──────────────────── */
  var pTimer = null;
  var lastPointer = { x: 0, y: 0 };

  document.addEventListener('pointermove', function (event) {
    lastPointer.x = event.clientX;
    lastPointer.y = event.clientY;
    if (tooltip && tooltip.classList.contains('is-visible') && tooltipMode === 'building') {
      positionTooltip();
    }
  }, { passive: true });

  function spawnParticles(zone, color) {
    var stage = document.querySelector('.map-stage');
    if (!stage) return;
    var r = zone.getBoundingClientRect();
    var sr = stage.getBoundingClientRect();
    var cx = r.left - sr.left + r.width / 2;
    var topY = r.top - sr.top;

    for (var i = 0; i < 3; i++) {
      var d = document.createElement('div');
      var sz = 2 + Math.random() * 4;
      var ox = (Math.random() - 0.5) * r.width * 0.6;
      d.style.cssText =
        'position:absolute;z-index:1;pointer-events:none;border-radius:50%;' +
        'left:' + (cx + ox) + 'px;top:' + (topY + Math.random() * r.height * 0.5) + 'px;' +
        'width:' + sz + 'px;height:' + sz + 'px;background:' + color + ';opacity:0;' +
        'box-shadow:0 0 ' + sz*3 + 'px ' + color + ';';
      stage.appendChild(d);
      var dur = 1400 + Math.random() * 800;
      var rise = 50 + Math.random() * 50;
      d.animate([
        { opacity: 0, transform: 'translateY(0) scale(0.5)' },
        { opacity: 0.7, transform: 'translateY(-' + rise*0.4 + 'px) scale(1)' },
        { opacity: 0, transform: 'translateY(-' + rise + 'px) scale(0.2)' },
      ], { duration: dur, easing: 'ease-out', fill: 'forwards' });
      setTimeout(function(el){ el.remove(); }, dur + 50, d);
    }
  }

  /* ── Start/stop hover effect ── */
  function startHoverEffect(zone, info) {
    var hoverImg = document.getElementById(info.hoverImgId);
    if (hoverImg) startPulse(hoverImg);
    spawnParticles(zone, info.particleColor);
    if (pTimer) clearInterval(pTimer);
    pTimer = setInterval(function(){ spawnParticles(zone, info.particleColor); }, 1100);
  }

  function stopHoverEffect() {
    stopPulse();
    if (pTimer) { clearInterval(pTimer); pTimer = null; }
  }

  /* ── 건물 모양(홀로그램 알파) 기반 정밀 히트테스트 ──
     사각형 zone 대신, 각 건물 홀로그램 이미지의 불투명 픽셀 위에서만 hover/클릭 인정 */
  var ALPHA = {};   // key -> { a:Uint8Array, w, h, fit }
  var ALPHA_THRESHOLD = 40;
  function preloadAlpha(key) {
    var el = document.getElementById(BUILDINGS[key].hoverImgId);
    if (!el) return;
    function draw() {
      var nw = el.naturalWidth, nh = el.naturalHeight;
      if (!nw || !nh) return;
      var c = document.createElement('canvas'); c.width = nw; c.height = nh;
      var cx = c.getContext('2d');
      try {
        cx.drawImage(el, 0, 0, nw, nh);
        var d = cx.getImageData(0, 0, nw, nh).data;
        var a = new Uint8Array(nw * nh);
        for (var i = 0; i < nw * nh; i++) a[i] = d[i * 4 + 3];
        ALPHA[key] = { a: a, w: nw, h: nh, fit: (getComputedStyle(el).objectFit || 'contain') };
      } catch (err) { /* same-origin이라 정상; 실패 시 알파 없음 */ }
    }
    if (el.complete && el.naturalWidth) draw();
    else el.addEventListener('load', draw);
  }
  Object.keys(BUILDINGS).forEach(preloadAlpha);

  // 클릭/커서 좌표가 해당 건물 홀로그램의 불투명 영역 위인지 검사
  function onBuilding(key, x, y) {
    var info = ALPHA[key];
    var el = document.getElementById(BUILDINGS[key].hoverImgId);
    if (!info || !el) return true;  // 알파 정보 없으면 기존처럼 통과(폴백)
    var r = el.getBoundingClientRect();
    var rx = x - r.left, ry = y - r.top;
    if (rx < 0 || ry < 0 || rx > r.width || ry > r.height) return false;
    var ix, iy;
    if (info.fit === 'fill') {
      ix = rx / r.width * info.w; iy = ry / r.height * info.h;
    } else { // contain
      var scale = Math.min(r.width / info.w, r.height / info.h);
      var dw = info.w * scale, dh = info.h * scale;
      var ox = (r.width - dw) / 2, oy = (r.height - dh) / 2;
      var lx = rx - ox, ly = ry - oy;
      if (lx < 0 || ly < 0 || lx > dw || ly > dh) return false;
      ix = lx / dw * info.w; iy = ly / dh * info.h;
    }
    ix = Math.floor(ix); iy = Math.floor(iy);
    if (ix < 0 || iy < 0 || ix >= info.w || iy >= info.h) return false;
    return info.a[iy * info.w + ix] > ALPHA_THRESHOLD;
  }

  // 건물 zone 아래에 클릭 가능한 마커(버스/오토바이/핀)가 있는지 — 있으면 커서 포인터 유지
  function markerBeneath(x, y) {
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el && el.closest && el.closest('.lt-bus, .lt-scooter, .lt-vehicle, .lt-pinhover')) return true;
    }
    return false;
  }

  document.querySelectorAll('.bldg-zone').forEach(function (zone) {
    var key = zone.dataset.building;
    var info = BUILDINGS[key];
    if (!info) return;
    var hovering = false;
    zone.style.cursor = 'default';

    zone.addEventListener('mousemove', function (e) {
      if (overlay.classList.contains('is-open')) return;
      var hit = onBuilding(key, e.clientX, e.clientY);
      if (hit) {
        if (!hovering) {
          hovering = true;
          startHoverEffect(zone, info);
          showTooltip(info, 'building', null, true);
        }
        zone.style.cursor = 'pointer';
      } else {
        if (hovering) {
          hovering = false;
          stopHoverEffect();
          hideTooltip();
        }
        // 건물 모양 밖이라도 그 아래 마커가 있으면 포인터 유지(클릭 가능 표시)
        zone.style.cursor = markerBeneath(e.clientX, e.clientY) ? 'pointer' : 'default';
      }
    });

    zone.addEventListener('mouseleave', function () {
      hovering = false; zone.style.cursor = 'default';
      stopHoverEffect();
      hideTooltip();
    });

    zone.addEventListener('click', function (e) {
      if (!onBuilding(key, e.clientX, e.clientY)) return;  // 건물 모양 밖 클릭은 무시
      stopHoverEffect();
      openModal(key, info);
    });
  });

  /* ── BSS Section Builder ───────── */
  function buildBssSection() {
    var totalAvail = 0, totalCap = 0;
    BSS_DATA.forEach(function(s) { totalAvail += s.avail; totalCap += s.total; });
    var pct = Math.round(totalAvail / totalCap * 100);

    var html = '<div class="bss-section">';
    html += '<div class="bss-header">';
    html += '<div class="bss-header__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="7" x2="14" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="9" y="10" width="6" height="4" rx="1" fill="currentColor" opacity=".3"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/></svg></div>';
    html += '<div class="bss-header__title">BSS 배터리 교환 스테이션 현황</div>';
    html += '</div>';

    html += '<div class="bss-summary">';
    html += '<div class="bss-summary__meta"><span class="bss-summary__count">총 <strong>' + BSS_DATA.length + '</strong>개소</span>';
    html += '<span class="bss-summary__avail">가용 배터리 <strong>' + totalAvail + '</strong> / ' + totalCap + '</span></div>';
    html += '<div class="bss-progress"><div class="bss-progress__bar" style="width:' + pct + '%"></div></div>';
    html += '<div class="bss-progress__pct">' + pct + '%</div>';
    html += '</div>';

    html += '<div class="bss-list">';
    BSS_DATA.forEach(function(s) {
      var statusCls = s.status === 'active' ? 'bss-status--active' : 'bss-status--maint';
      var batteryPct = Math.round(s.avail / s.total * 100);

      html += '<div class="bss-item">';
      html += '<div class="bss-item__status ' + statusCls + '"></div>';
      html += '<div class="bss-item__info">';
      html += '<div class="bss-item__name">' + s.name + '</div>';
      html += '<div class="bss-item__addr">' + s.addr + '</div>';
      html += '</div>';
      html += '<div class="bss-item__battery">';
      html += '<div class="bss-battery-bar"><div class="bss-battery-fill" style="width:' + batteryPct + '%"></div></div>';
      html += '<span class="bss-battery-label">' + s.avail + '/' + s.total + '</span>';
      html += '</div>';
      html += '<div class="bss-item__swaps"><strong>' + s.swaps + '</strong><span>회/일</span></div>';
      html += '</div>';
    });
    html += '</div></div>';

    return html;
  }

  /* ── Modal ────────────────────────── */
  function openModal(key, info) {
    var accentInfo = ACCENT_MAP[key] || ACCENT_MAP.energy;

    try {
      var src = document.querySelector('[data-mile="' + key + '"]');
      if (src && modalBody) {
        var body = src.querySelector('.m-body');
        if (body) {
          modalBody.innerHTML = body.innerHTML;
          modalBody.querySelectorAll('.m-slide').forEach(function (s, i) {
            s.classList.add('active');
            s.classList.remove('exit-left');
            s.style.cssText = 'position:relative;opacity:1;visibility:visible;transform:none;pointer-events:auto;';
            if (i > 0) s.style.cssText += 'margin-top:20px;padding-top:20px;border-top:1px solid #eee;';
          });
        }

        if (key === 'mobility') {
          var bssHtml = buildBssSection();
          var bssContainer = document.createElement('div');
          bssContainer.style.cssText = 'margin-top:20px;padding-top:20px;border-top:1px solid #eee;';
          bssContainer.innerHTML = bssHtml;
          modalBody.appendChild(bssContainer);
        }
      }
      if (modalTitle) modalTitle.textContent = info.name;
      if (modalSub) modalSub.textContent = info.subtitle;
      if (modalIconImg) modalIconImg.src = info.iconSvg;
      if (modalIcon) modalIcon.style.background = 'transparent';
      if (modal) modal.style.setProperty('--modal-accent', accentInfo.accent);
    } catch (e) {
      console.warn('[BI] Modal error:', e);
    }
    overlay.classList.add('is-open');
    lockScroll();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    unlockScroll();
    stopHoverEffect();
    setTimeout(function () {
      var target = document.elementFromPoint(lastPointer.x, lastPointer.y);
      var zone = target && target.closest ? target.closest('.bldg-zone') : null;
      if (!zone) {
        document.querySelectorAll('.bldg-zone').forEach(function (candidate) {
          if (zone) return;
          var rect = candidate.getBoundingClientRect();
          if (
            lastPointer.x >= rect.left &&
            lastPointer.x <= rect.right &&
            lastPointer.y >= rect.top &&
            lastPointer.y <= rect.bottom
          ) {
            zone = candidate;
          }
        });
      }
      if (!zone) return;
      var key = zone.dataset.building;
      var info = BUILDINGS[key];
      if (info) startHoverEffect(zone, info);
    }, 80);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });

  /* ── Quick-menu tooltip ─────────────────── */
  document.querySelectorAll('[data-mile-target]').forEach(function (btn) {
    var key = btn.dataset.mileTarget;
    var info = BUILDINGS[key];
    if (!info) return;
    btn.addEventListener('mouseenter', function () {
      showTooltip(info, 'quickmenu', btn, false);
    });
    btn.addEventListener('mouseleave', hideTooltip);
  });

  /* ── Modal info-button tooltip ──────────── */
  document.querySelectorAll('.m-info-btn').forEach(function (btn) {
    var key = btn.dataset.mileInfo;
    var info = BUILDINGS[key];
    if (!info) return;
    btn.addEventListener('mouseenter', function () {
      btn.classList.add('is-active');
      showTooltip(info, 'modal-info', btn, false);
    });
    btn.addEventListener('mouseleave', function () {
      btn.classList.remove('is-active');
      hideTooltip();
    });
  });

})();
