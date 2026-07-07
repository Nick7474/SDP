/* ─────────────────────────────────────────────────────────
   지도 인터랙션 온보딩 가이드 엔진 (스포트라이트 코치마크)
   - 첫 진입 시 부모(App)가 postMessage('gm-start-map-guide')로 시작(스플래시 종료 후)
   - '?' 버튼으로 언제든 재생 / localStorage 로 1회 완료 기록
   - 무빙 마커는 window.__busModalOpen 로 지도 애니메이션을 정지시켜 고정
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var DONE_KEY = 'gm-map-guide-done';

  // 스텝 정의 (버스 → 건물 → 바이크, 각 카드 내용 상이 / Figma 2071-23344·2076-41779)
  //  지도를 프레임 700에 정지시킨 뒤, 실제(정지된) 버스·바이크 위치(#lottie-bg 대비 % 영역)와 건물을 스포트라이트
  var STEPS = [
    {
      num: '①', label: '버스', shape: 'circle',
      // 크기(wPct/hPct)는 바이크 스텝과 동일 → 원 지름 일치. 중심은 정류장 핀+버스 차량을 함께 감싸도록.
      target: { xPct: 0.583, yPct: 0.409, wPct: 0.03, hPct: 0.024 },
      title: '버스를 클릭 → DRT 운행정보',
      desc: '버스를 클릭하면 친환경 DRT(수요응답형 교통) 운행 정보를 확인할 수 있어요.'
    },
    {
      num: '②', label: '건물', shape: 'circle', tip: 'left',
      // 클릭 히트박스가 아니라 롯데몰 건물의 실제 시각 중심/크기에 맞춘 영역(#lottie-bg 대비 %)
      target: { xPct: 0.653, yPct: 0.371, wPct: 0.142, hPct: 0.072 },
      title: '건물을 클릭 → 4대 마일 데이터',
      desc: '건물(솔루션)을 클릭하면 에너지·모빌리티·안전·데이터 4대 마일 지표를 확인할 수 있어요.'
    },
    {
      num: '③', label: '바이크', shape: 'circle',
      target: { xPct: 0.437, yPct: 0.322, wPct: 0.03, hPct: 0.024 },
      title: '바이크를 선택 → 공유 모빌리티',
      desc: '바이크를 선택하면 친환경 배달·공유 모빌리티(BSS 공유거점) 데이터를 확인할 수 있어요.'
    }
  ];

  var root, catcher, spot, tip, titleEl, descEl, dotsEl, prevBtn, nextBtn, skipBtn;
  var idx = 0;
  var tipShown = false; // 첫 render 전까지 카드 숨김(좌측상단 깜빡임/슬라이드 방지)
  var active = false;

  // 대상 rect(뷰포트 좌표) 반환. null | 선택자 | 영역객체 지원
  function pickTarget(target) {
    if (!target) return null;
    // 영역 객체: #lottie-bg 대비 중심% + 크기%
    if (typeof target === 'object') {
      var bg = document.getElementById('lottie-bg');
      if (!bg) return null;
      var b = bg.getBoundingClientRect();
      if (!b.width || !b.height) return null;
      var w = b.width * target.wPct, h = b.height * target.hPct;
      var left = b.left + b.width * target.xPct - w / 2;
      var top = b.top + b.height * target.yPct - h / 2;
      return { left: left, top: top, width: w, height: h, right: left + w, bottom: top + h };
    }
    // 선택자: 첫 매칭 요소의 rect(모든 타겟은 첫 화면에 배치되므로 뷰포트 필터 불필요)
    var els = document.querySelectorAll(target);
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.width && r.height) return r;
    }
    return null;
  }

  function placeSpot(rect, shape) {
    if (!rect || shape === 'none') {
      spot.style.left = (window.innerWidth / 2) + 'px';
      spot.style.top = (window.innerHeight / 2) + 'px';
      spot.style.width = '0px'; spot.style.height = '0px';
      spot.classList.remove('is-pulse');
      return null;
    }
    // 정원(perfect circle): 대상의 긴 변 기준 지름으로 정사각형 (border-radius:50%는 CSS, Figma 2079:11051)
    var pad = shape === 'circle' ? 14 : 12;
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var d = Math.max(rect.width, rect.height) + pad * 2;
    var l = cx - d / 2, t = cy - d / 2;
    spot.style.left = l + 'px'; spot.style.top = t + 'px';
    spot.style.width = d + 'px'; spot.style.height = d + 'px';
    spot.classList.add('is-pulse');
    return { l: l, t: t, w: d, h: d };
  }

  function placeTip(box, side) {
    var tw = tip.offsetWidth, th = tip.offsetHeight, m = 16;
    var left, top;
    // 대상이 없거나 스포트라이트가 뷰포트 밖이면 카드를 화면 중앙에(항상 보이도록)
    var offscreen = box && (box.t + box.h < 8 || box.t > window.innerHeight - 8);
    if (!box || offscreen) {
      left = (window.innerWidth - tw) / 2;
      top = (window.innerHeight - th) / 2;
    } else if (side === 'right' || side === 'left') {
      // 스포트라이트 좌/우측에 세로 중앙 정렬(건물 스텝). 뷰포트를 넘으면 가장자리에 정렬.
      left = side === 'left' ? (box.l - m - tw) : (box.l + box.w + m);
      left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
      top = box.t + box.h / 2 - th / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - th - 8));
    } else {
      if (box.t + box.h + m + th <= window.innerHeight - 8) top = box.t + box.h + m;
      else if (box.t - m - th >= 8) top = box.t - m - th;
      else top = Math.min(Math.max(8, box.t), window.innerHeight - th - 8);
      left = box.l + box.w / 2 - tw / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    }
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';
  }

  // 세 타깃(버스·건물·바이크)을 감싸는 문서상 영역 반환. 레이아웃 미확정이면 null.
  //  - 건물(.bldg-zone)은 절대%배치라 rect 신뢰 가능 → 이 값이 화면 하단(>500) 근처면 레이아웃 확정으로 판단
  function measureTargets() {
    var minTop = Infinity, maxBot = -Infinity, count = 0;
    for (var i = 0; i < STEPS.length; i++) {
      var rc = pickTarget(STEPS[i].target);
      if (!rc || !rc.height) continue;
      var top = rc.top + window.pageYOffset;
      if (top < minTop) minTop = top;
      if (top + rc.height > maxBot) maxBot = top + rc.height;
      count++;
    }
    if (count < STEPS.length || minTop === Infinity) return null; // 아직 전부 준비 안 됨
    return { minTop: minTop, maxBot: maxBot };
  }

  // 가이드 시작 시 1회 스크롤: 세 타깃 영역의 중심을 화면 중앙으로.
  // (세 타깃은 세로 ~300px 안에 모여 한 화면에 함께 들어옴)
  // scrollIntoView는 이 페이지에서 신뢰 불가 → 문서 스크롤값을 직접 계산.
  // CSS scroll-behavior:smooth 를 무시하려 behavior:'auto' 로 즉시 이동, 스크롤 후 rAF에서 배치.
  // 레이아웃(Lottie/건물)이 확정될 때까지 최대 ~1.5s 재시도.
  var focusTries = 0;
  function focusMap() {
    if (!active) return;
    var m = measureTargets();
    if (!m) {
      if (focusTries++ < 15) { setTimeout(focusMap, 100); return; }
      render(); // 실패해도 카드는 표출(placeTip 이 뷰포트 내로 클램프)
      return;
    }
    var center = (m.minTop + m.maxBot) / 2;
    var maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var y = Math.min(maxScroll, Math.max(0, center - window.innerHeight / 2));
    try { window.scrollTo({ top: y, left: 0, behavior: 'auto' }); }
    catch (e) { window.scrollTo(0, y); }
    // 스크롤·Lottie 레이아웃이 '안정'된 뒤 딱 한 번만 그린다 → 스포트라이트가 움직이지 않고
    // 처음부터 정확한 위치(버스)에 나타남. (첫 render 전까진 스팟에 크기가 없어 딤/구멍도 안 보임)
    stablePrev = null; stableCount = 0; stableTries = 0;
    waitStableThenRender();
  }

  // 현재 스텝 타깃의 화면상 위치가 연속으로 동일해질 때까지 대기 후 render (최대 ~1.3s)
  var stablePrev = null, stableCount = 0, stableTries = 0;
  function waitStableThenRender() {
    if (!active) return;
    var rc = pickTarget(STEPS[idx].target);
    var key = rc ? (Math.round(rc.top) + ',' + Math.round(rc.left) + ',' + Math.round(rc.width)) : 'na';
    if (key === stablePrev) stableCount++; else { stableCount = 0; stablePrev = key; }
    if (stableCount >= 2 || stableTries++ > 22) { render(); return; }
    setTimeout(waitStableThenRender, 55);
  }

  function render() {
    var s = STEPS[idx];
    tip.querySelector('.mapguide-tip__badge .num').textContent = s.num;
    tip.querySelector('.mapguide-tip__badge .lbl').textContent = s.label;
    titleEl.textContent = s.title;
    descEl.textContent = s.desc;
    // dots
    Array.prototype.forEach.call(dotsEl.children, function (d, i) {
      d.className = i === idx ? 'on' : '';
    });
    // 첫 스텝: [다음]만(넓게) / 이후: [이전][다음] (Figma 2071/2076)
    if (idx === 0) { prevBtn.style.display = 'none'; nextBtn.style.width = '90px'; }
    else { prevBtn.style.display = ''; nextBtn.style.width = '56px'; }
    nextBtn.textContent = '다음';
    // 스포트라이트/툴팁 배치(동기) — 스크롤 이동이 없으므로 즉시 정확
    var rect = pickTarget(s.target);
    var box = placeSpot(rect, rect ? s.shape : 'none');
    // 첫 배치는 위치 트랜지션 없이(좌측상단→제자리 슬라이드 방지) 놓고 페이드인
    if (!tipShown) tip.style.transition = 'none';
    placeTip(box, s.tip);
    if (!tipShown) {
      void tip.offsetHeight;       // 리플로우 강제 → 위치 즉시 확정
      tip.style.transition = '';   // CSS 트랜지션(위치 이동 + 페이드) 복구
      tip.style.opacity = '1';     // 제자리에서 페이드인
      tipShown = true;
    }
  }

  function onResize() { if (active) focusMap(); }

  function end() {
    if (!active) return;
    active = false;
    try { localStorage.setItem(DONE_KEY, '1'); } catch (e) { /* ignore */ }
    window.removeEventListener('resize', onResize);
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
    window.__busModalOpen = false; // 지도 애니메이션 재개
    if (window.lottieAnim) { try { window.lottieAnim.play(); } catch (e) { /* ignore */ } }
    // 가이드 종료 시 자동으로 최상단으로 스크롤
    try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }
    catch (e) { window.scrollTo(0, 0); }
  }

  function next() { if (idx >= STEPS.length - 1) { end(); return; } idx++; render(); }
  function prev() { if (idx > 0) { idx--; render(); } }

  function build() {
    root = document.createElement('div');
    root.className = 'mapguide-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', '지도 사용법 안내');

    catcher = document.createElement('div');
    catcher.className = 'mapguide-catch';

    spot = document.createElement('div');
    spot.className = 'mapguide-spot';

    tip = document.createElement('div');
    tip.className = 'mapguide-tip';
    tip.style.opacity = '0'; // 첫 render 가 위치를 잡을 때까지 숨김
    tip.innerHTML =
      '<span class="mapguide-tip__badge"><b class="num"></b><span class="lbl"></span></span>' +
      '<p class="mapguide-tip__title"></p>' +
      '<p class="mapguide-tip__desc"></p>' +
      '<div class="mapguide-tip__foot">' +
        '<div class="mapguide-dots"></div>' +
        '<div class="mapguide-actions">' +
          '<button type="button" class="mapguide-btn mapguide-btn--line mapguide-prev">이전</button>' +
          '<button type="button" class="mapguide-btn mapguide-btn--solid mapguide-next">다음</button>' +
        '</div>' +
        '<button type="button" class="mapguide-skip">건너뛰기</button>' +
      '</div>';

    root.appendChild(catcher);
    root.appendChild(spot);
    root.appendChild(tip);
    document.body.appendChild(root);

    titleEl = tip.querySelector('.mapguide-tip__title');
    descEl = tip.querySelector('.mapguide-tip__desc');
    dotsEl = tip.querySelector('.mapguide-dots');
    prevBtn = tip.querySelector('.mapguide-prev');
    nextBtn = tip.querySelector('.mapguide-next');
    skipBtn = tip.querySelector('.mapguide-skip');

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    skipBtn.addEventListener('click', end);
    // 카운트 대비: dots 개수를 스텝 수에 맞춤
    while (dotsEl.children.length > STEPS.length) dotsEl.removeChild(dotsEl.lastChild);
    while (dotsEl.children.length < STEPS.length) dotsEl.appendChild(document.createElement('i'));
  }

  function start() {
    if (active) return;
    active = true;
    idx = 0;
    tipShown = false; // 새 세션: 카드 첫 표시 재설정
    // 결정적 프레임(700)으로 고정 → 버스·바이크가 항상 같은 위치에 보이도록
    if (window.lottieAnim) { try { window.lottieAnim.goToAndStop(700, true); } catch (e) { /* ignore */ } }
    window.__busModalOpen = true; // 지도 애니메이션 정지(차분한 배경)
    build();
    window.addEventListener('resize', onResize);
    focusTries = 0;
    focusMap();                        // 타깃 영역으로 스크롤 후 스포트라이트 배치
  }

  // ESC = 건너뛰기
  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'Escape') end();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // 부모(App)에서 시작 신호
  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin) return;
    if (e.data && e.data.type === 'gm-start-map-guide') {
      // [임시] 매 새로고침마다 노출. 1회 노출로 복구하려면 아래 한 줄 주석 해제.
      // try { if (localStorage.getItem(DONE_KEY)) return; } catch (_) { /* ignore */ }
      // Lottie 마커 준비 대기(최대 ~2s)
      var tries = 0;
      (function waitReady() {
        if (document.querySelector('#lottie-bg .lt-bus') || tries > 20) { start(); return; }
        tries++; setTimeout(waitReady, 100);
      })();
    }
  });

  // '?' 재생 버튼 (상시)
  function addHelpButton() {
    if (document.querySelector('.mapguide-help')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mapguide-help';
    btn.setAttribute('aria-label', '지도 사용법 다시 보기');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M14.106 5.553C14.3836 5.69172 14.6897 5.76393 15 5.76393C15.3103 5.76393 15.6164 5.69172 15.894 5.553L19.553 3.723C19.7056 3.64676 19.8751 3.61081 20.0455 3.61857C20.2159 3.62633 20.3814 3.67754 20.5265 3.76733C20.6715 3.85712 20.7911 3.98251 20.874 4.13158C20.9569 4.28065 21.0003 4.44844 21 4.619V17.383C20.9999 17.5687 20.9481 17.7506 20.8504 17.9085C20.7528 18.0664 20.6131 18.194 20.447 18.277L15.894 20.554C15.6164 20.6927 15.3103 20.7649 15 20.7649C14.6897 20.7649 14.3836 20.6927 14.106 20.554L9.894 18.448C9.6164 18.3093 9.31033 18.2371 9 18.2371C8.68967 18.2371 8.3836 18.3093 8.106 18.448L4.447 20.278C4.29435 20.3543 4.12472 20.3902 3.95426 20.3824C3.78379 20.3746 3.61816 20.3233 3.47312 20.2334C3.32808 20.1435 3.20846 20.018 3.12565 19.8688C3.04283 19.7196 2.99958 19.5516 3 19.381V6.618C3.0001 6.43234 3.05188 6.25037 3.14955 6.09247C3.24722 5.93458 3.38692 5.80699 3.553 5.724L8.106 3.447C8.3836 3.30828 8.68967 3.23607 9 3.23607C9.31033 3.23607 9.6164 3.30828 9.894 3.447L14.106 5.553Z" stroke="#EEF6FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M15 5.764V20.764" stroke="#EEF6FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M9 3.236V18.236" stroke="#EEF6FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var tipEl = document.createElement('div');
    tipEl.className = 'mapguide-help__tip';
    tipEl.textContent = '지도 사용법 다시 보기';
    btn.addEventListener('click', function () { start(); });
    document.body.appendChild(btn);
    document.body.appendChild(tipEl);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHelpButton);
  } else {
    addHelpButton();
  }

  // 외부에서 재생 가능하도록 노출
  window.__startMapGuide = start;
})();
