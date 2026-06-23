(function () {
  'use strict';

  /* ===== 데모 계정 =====
     아이디: admin  /  비밀번호: 1234
     등록 이메일: admin@gwangmyeong.go.kr (아이디/비밀번호 찾기 인증용)
  ====================== */
  var DEMO = { id: 'admin', pw: '1234', email: 'admin@gwangmyeong.go.kr', user: '홍길동', role: '시스템 관리자' };

  // 이미 로그인 상태면 홈으로
  if (sessionStorage.getItem('gmsb-auth')) {
    location.replace('pages/catalog-search.html');
    return;
  }

  /* ===== 유틸 ===== */
  function $(id) { return document.getElementById(id); }

  function maskId(id) {
    // 앞 2자리 + *** (예: admin → ad***)
    if (!id || id.length < 2) return '***';
    return id.slice(0, 2) + Array(id.length - 1).join('*');
  }

  function maskEmail(email) {
    // id 부분 앞 2자리만 노출 (예: admin@gwang.go.kr → ad***@gwang.go.kr)
    var at = email.indexOf('@');
    if (at < 2) return email;
    return email.slice(0, 2) + '***' + email.slice(at);
  }

  /* ===== 토스트 ===== */
  var _toastTimer;
  function showToast(msg, dur) {
    var t = $('lgToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { t.classList.remove('on'); }, dur || 3200);
  }

  /* ===== 모달 ===== */
  function openModal(scrimId) {
    var scrim = $(scrimId);
    if (!scrim) return;
    scrim.classList.add('on');
    if (window.lucide) lucide.createIcons();
  }
  function closeModal(scrimId) {
    var scrim = $(scrimId);
    if (scrim) scrim.classList.remove('on');
  }

  // 스크림 클릭 및 닫기 버튼
  document.querySelectorAll('.lg-scrim').forEach(function (scrim) {
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) closeModal(scrim.id);
    });
  });
  document.querySelectorAll('.lg-modal-x').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.getAttribute('data-close'));
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lg-scrim.on').forEach(function (s) {
        s.classList.remove('on');
      });
    }
  });

  /* ===== 비밀번호 표시 토글 ===== */
  var pwInput  = $('userPw');
  var pwToggle = $('pwToggle');
  var pwEyeIco = $('pwEyeIco');
  if (pwToggle && pwInput) {
    pwToggle.addEventListener('click', function () {
      var show = pwInput.type === 'password';
      pwInput.type = show ? 'text' : 'password';
      if (pwEyeIco) {
        pwEyeIco.setAttribute('data-lucide', show ? 'eye-off' : 'eye');
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  /* ===== 저장된 아이디 복원 ===== */
  var savedId = localStorage.getItem('gmsb-saved-id');
  if (savedId) {
    var ui = $('userId'); if (ui) ui.value = savedId;
    var rm = $('rememberMe'); if (rm) rm.checked = true;
  }

  /* ===== 로그인 폼 ===== */
  var form  = $('loginForm');
  var errEl = $('loginError');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = ($('userId').value || '').trim();
      var pw = ($('userPw').value || '');
      if (id === DEMO.id && pw === DEMO.pw) {
        var remember = $('rememberMe');
        if (remember && remember.checked) localStorage.setItem('gmsb-saved-id', id);
        else localStorage.removeItem('gmsb-saved-id');
        sessionStorage.setItem('gmsb-auth', JSON.stringify({ user: DEMO.user, id: id, role: DEMO.role }));
        location.replace('pages/catalog-search.html');
      } else {
        if (errEl) { errEl.classList.add('show'); if (window.lucide) lucide.createIcons(); }
      }
    });
    form.addEventListener('input', function () { if (errEl) errEl.classList.remove('show'); });
  }

  /* ===== 아이디 찾기 ===== */
  var findIdLink = $('findIdLink');
  if (findIdLink) {
    findIdLink.addEventListener('click', function (e) {
      e.preventDefault();
      $('findIdStep1').style.display = '';
      $('findIdStep2').style.display = 'none';
      $('findIdEmail').value = '';
      var err = $('findIdErr'); if (err) err.style.display = 'none';
      openModal('findIdScrim');
    });
  }

  var findIdBtn = $('findIdBtn');
  if (findIdBtn) {
    findIdBtn.addEventListener('click', function () {
      var email = ($('findIdEmail').value || '').trim();
      var errBox = $('findIdErr');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errBox) { errBox.style.display = 'flex'; if (window.lucide) lucide.createIcons(); }
        return;
      }
      if (errBox) errBox.style.display = 'none';
      // 데모: 어떤 이메일이든 admin 계정 반환
      var result = $('findIdResult');
      if (result) result.textContent = maskId(DEMO.id);
      $('findIdStep1').style.display = 'none';
      $('findIdStep2').style.display = '';
      if (window.lucide) lucide.createIcons();
    });
  }

  var findIdDone = $('findIdDone');
  if (findIdDone) {
    findIdDone.addEventListener('click', function () {
      closeModal('findIdScrim');
    });
  }

  /* ===== 비밀번호 찾기 ===== */
  var findPwLink = $('findPwLink');
  if (findPwLink) {
    findPwLink.addEventListener('click', function (e) {
      e.preventDefault();
      $('findPwStep1').style.display = '';
      $('findPwStep2').style.display = 'none';
      $('findPwId').value = '';
      $('findPwEmail').value = '';
      var err = $('findPwErr'); if (err) err.style.display = 'none';
      openModal('findPwScrim');
    });
  }

  var findPwBtn = $('findPwBtn');
  if (findPwBtn) {
    findPwBtn.addEventListener('click', function () {
      var id    = ($('findPwId').value    || '').trim();
      var email = ($('findPwEmail').value || '').trim();
      var errBox = $('findPwErr');
      var errMsg = $('findPwErrMsg');
      if (!id) {
        if (errMsg) errMsg.textContent = '아이디를 입력하세요.';
        if (errBox) { errBox.style.display = 'flex'; if (window.lucide) lucide.createIcons(); }
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errMsg) errMsg.textContent = '이메일 주소를 올바르게 입력하세요.';
        if (errBox) { errBox.style.display = 'flex'; if (window.lucide) lucide.createIcons(); }
        return;
      }
      // 데모: admin 아이디만 허용 (다른 아이디는 미등록 처리)
      if (id !== DEMO.id) {
        if (errMsg) errMsg.textContent = '등록된 아이디 정보를 찾을 수 없습니다.';
        if (errBox) { errBox.style.display = 'flex'; if (window.lucide) lucide.createIcons(); }
        return;
      }
      if (errBox) errBox.style.display = 'none';
      var emailResult = $('findPwEmailResult');
      if (emailResult) emailResult.textContent = maskEmail(email);
      $('findPwStep1').style.display = 'none';
      $('findPwStep2').style.display = '';
      if (window.lucide) lucide.createIcons();
    });
  }

  var findPwDone = $('findPwDone');
  if (findPwDone) {
    findPwDone.addEventListener('click', function () {
      closeModal('findPwScrim');
    });
  }

  /* ===== 회원가입 ===== */
  var signupLink = $('signupLink');
  if (signupLink) {
    signupLink.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('회원가입은 시스템 관리자에게 문의하세요. (광명시 스마트도시팀)', 4000);
    });
  }

  /* ===== 소셜 로그인 ===== */
  var kakaoBtn = $('kakaoLoginBtn');
  if (kakaoBtn) {
    kakaoBtn.addEventListener('click', function () {
      showToast('소셜 로그인은 지원되지 않습니다. 관리자 계정으로 로그인해 주세요.');
    });
  }
  var naverBtn = $('naverLoginBtn');
  if (naverBtn) {
    naverBtn.addEventListener('click', function () {
      showToast('소셜 로그인은 지원되지 않습니다. 관리자 계정으로 로그인해 주세요.');
    });
  }
})();

