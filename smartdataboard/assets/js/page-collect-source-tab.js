/* =====================================================================
   수집원 관리 탭 (연계 모니터링 > 탭2)
   NiFi 수집 대상(어댑터) 등록·조회·상태 관리. 드로어 id는 cs* 네임스페이스.
   ===================================================================== */
(function(){
  'use strict';

  /* 수집원 마스터 (18개 외부 어댑터 + 내부 시스템 매핑) */
  var CS = [
    { nm:'신재생에너지 발전량',   ad:'EX_KBL_001',    mile:'에너지',   zone:'DMZ',   method:'REST_PULL', cycle:'1시간',   ep:'/kevinlab/api/pv/power',      auth:'API Key',  ent:'PowerPlant',        st:'on'  },
    { nm:'IoT 그린배리어',        ad:'EX_YJT_001',    mile:'세이프티', zone:'DMZ',   method:'REST_PULL', cycle:'10분',   ep:'/yjt/api/airquality',         auth:'API Key',  ent:'AirQualityObserved', st:'on'  },
    { nm:'침수·수위 관측',        ad:'EX_SPR_001',    mile:'세이프티', zone:'DMZ',   method:'PUSH',      cycle:'실시간', ep:'/collect/push/spire/flood',   auth:'HMAC',     ent:'FloodMonitoring',   st:'on'  },
    { nm:'친환경 DRT 운행',       ad:'EX_HMC_001',    mile:'모빌리티', zone:'DMZ',   method:'REST_PULL', cycle:'일',   ep:'/hyundai/drt/routes',         auth:'OAuth2',   ent:'DrtRoute',          st:'err' },
    { nm:'전기차 카셰어링',       ad:'EX_KIA_001',    mile:'모빌리티', zone:'DMZ',   method:'REST_PULL', cycle:'주간',  ep:'/kia/carshare/status',        auth:'OAuth2',   ent:'Vehicle',           st:'on'  },
    { nm:'배터리 교환소(BSS)',    ad:'EX_LGE_001',    mile:'모빌리티', zone:'DMZ',   method:'REST_PULL', cycle:'월간',   ep:'/lge/bss/stations',           auth:'API Key',  ent:'BssStation',        st:'on'  },
    { nm:'전기이륜차 배달',       ad:'EX_WWH_001',    mile:'모빌리티', zone:'DMZ',   method:'PUSH',      cycle:'주간', ep:'/collect/push/woowa/dlv',     auth:'HMAC',     ent:'Vehicle',           st:'on'  },
    { nm:'다회용기 순환',         ad:'EX_EAT_001',    mile:'데이터',   zone:'DMZ',   method:'REST_PULL', cycle:'주간', ep:'/eatgreen/reuse/shops',       auth:'API Key',  ent:'ReusableShop',      st:'on'  },
    { nm:'탄소거래 실적',         ad:'EX_GRN_001',    mile:'데이터',   zone:'DMZ',   method:'REST_PULL', cycle:'월간', ep:'/greenery/carbon/trade',      auth:'OAuth2',   ent:'CarbonCredit',      st:'on'  },
    { nm:'경기 광역 데이터허브',   ad:'EX_GG_HUB_001', mile:'광역',     zone:'DMZ',   method:'REST_PULL', cycle:'1시간', ep:'/gghub/ngsi-ld/entities',     auth:'NGSI-LD',  ent:'(다종)',            st:'on'  },
    { nm:'정책플랫폼 연계',       ad:'IN_GM_PLF_001', mile:'내부',     zone:'내부망', method:'DB',        cycle:'1일',   ep:'jdbc:policy_db',              auth:'DB 계정',  ent:'PolicyDataset',     st:'on'  },
    { nm:'탄소중립포인트',        ad:'IN_GM_CNP_001', mile:'내부',     zone:'내부망', method:'REST_PULL', cycle:'1시간', ep:'/gm/cnp/points',              auth:'내부 토큰', ent:'CarbonPoint',       st:'on'  },
    { nm:'지능형교통정보(ITS)',   ad:'IN_GM_ITS_001', mile:'내부',     zone:'내부망', method:'REST_PULL', cycle:'5분',   ep:'/gm/its/traffic',             auth:'내부 토큰', ent:'TrafficFlow',       st:'stop' }
  ];

  var MILELB = { on:'가동', stop:'중지', err:'오류' };
  var ZCLS = { 'DMZ':'zb--dmz', '내부망':'zb--int', '수동':'zb--man' };
  var MCLS = { 'REST_PULL':'mb--api', 'PUSH':'mb--push', '파일':'mb--file', 'DB':'mb--db' };
  var SCLS = { on:'sb--on', stop:'sb--stop', err:'sb--err' };
  var SLB  = { on:'가동', stop:'중지', err:'오류' };

  var flt = { zone:'', method:'', st:'', q:'' };

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function match(r){
    if(flt.zone && r.zone !== flt.zone) return false;
    if(flt.method && r.method !== flt.method) return false;
    if(flt.st && r.st !== flt.st) return false;
    if(flt.q){
      var q = flt.q.toLowerCase();
      if((r.nm + r.ad + r.ep + r.ent).toLowerCase().indexOf(q) < 0) return false;
    }
    return true;
  }

  function render(){
    var body = document.getElementById('csBody');
    if(!body) return;
    var rows = CS.filter(match);
    document.getElementById('csCount').textContent = rows.length;
    body.innerHTML = rows.map(function(r, i){
      return '<tr data-i="'+ CS.indexOf(r) +'">'
        + '<td class="l"><b>'+ esc(r.nm) +'</b></td>'
        + '<td><span class="mono">'+ esc(r.ad) +'</span></td>'
        + '<td>'+ esc(r.mile) +'</td>'
        + '<td><span class="zb '+ ZCLS[r.zone] +'">'+ esc(r.zone) +'</span></td>'
        + '<td><span class="mb '+ MCLS[r.method] +'">'+ esc(r.method) +'</span></td>'
        + '<td>'+ esc(r.cycle) +'</td>'
        + '<td class="l"><span class="mono">'+ esc(r.ep) +'</span></td>'
        + '<td>'+ esc(r.ent) +'</td>'
        + '<td><span class="sb '+ SCLS[r.st] +'">'+ SLB[r.st] +'</span></td>'
        + '<td><button class="rbtn" data-edit="'+ CS.indexOf(r) +'" type="button"><i data-lucide="settings-2"></i>관리</button></td>'
        + '</tr>';
    }).join('');
    if(window.lucide) window.lucide.createIcons();
  }

  /* ── 드로어 ── */
  function openDrawer(r){
    var d = document.getElementById('csDrawer'), s = document.getElementById('csScrim');
    if(!d) return;
    document.getElementById('csDwTitle').textContent = r ? '수집원 수정' : '수집원 등록';
    setV('csf_nm', r ? r.nm : '');
    setV('csf_ad', r ? r.ad : '');
    setV('csf_mile', r ? r.mile : '에너지');
    setV('csf_zone', r ? r.zone : 'DMZ');
    setV('csf_method', r ? r.method : 'REST_PULL');
    setV('csf_cycle', r ? r.cycle : '');
    setV('csf_ep', r ? r.ep : '');
    setV('csf_auth', r ? r.auth : 'API Key');
    setV('csf_ent', r ? r.ent : '');
    setV('csf_st', r ? r.st : 'on');
    d.classList.add('on'); s.classList.add('on'); d.setAttribute('aria-hidden','false');
  }
  function closeDrawer(){
    var d = document.getElementById('csDrawer'), s = document.getElementById('csScrim');
    if(d){ d.classList.remove('on'); d.setAttribute('aria-hidden','true'); }
    if(s) s.classList.remove('on');
  }
  function setV(id, v){ var el = document.getElementById(id); if(el) el.value = v; }

  function init(){
    if(!document.getElementById('csBody')) return;
    render();

    /* 필터 칩 */
    document.querySelectorAll('#pane-source .cl-chips').forEach(function(grp){
      grp.addEventListener('click', function(e){
        var b = e.target.closest('.cl-chip'); if(!b) return;
        var field = grp.getAttribute('data-field');
        grp.querySelectorAll('.cl-chip').forEach(function(c){ c.classList.remove('on'); });
        b.classList.add('on');
        flt[field] = b.getAttribute('data-val');
        render();
      });
    });

    /* 검색 */
    var q = document.getElementById('csSearch');
    if(q) q.addEventListener('input', function(){ flt.q = q.value.trim(); render(); });

    /* 행 관리 / 등록 */
    document.getElementById('csBody').addEventListener('click', function(e){
      var b = e.target.closest('[data-edit]'); if(!b) return;
      openDrawer(CS[+b.getAttribute('data-edit')]);
    });
    var add = document.getElementById('csAddBtn');
    if(add) add.addEventListener('click', function(){ openDrawer(null); });

    /* 드로어 닫기 */
    var x = document.getElementById('csDwClose'), sc = document.getElementById('csScrim'), cc = document.getElementById('csDwCancel');
    if(x) x.addEventListener('click', closeDrawer);
    if(sc) sc.addEventListener('click', closeDrawer);
    if(cc) cc.addEventListener('click', closeDrawer);
    var save = document.getElementById('csDwSave');
    if(save) save.addEventListener('click', function(){
      closeDrawer();
      if(window.GMSB_toast) window.GMSB_toast('수집원 정보가 저장되었습니다. (NiFi 반영은 배포 시 적용)');
      else alert('수집원 정보가 저장되었습니다.');
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
