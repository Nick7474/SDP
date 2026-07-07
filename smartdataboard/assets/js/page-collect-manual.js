/* =====================================================================
   수동 데이터 입력 탭 (연계 모니터링 > 탭3)
   API 연계가 없는 수기 수집 데이터셋을 직접 입력하거나 파일로 적재.
   입력분은 NiFi 수동 수집원을 거쳐 데이터 허브에 적재된다(배포 시 반영).
   ===================================================================== */
(function(){
  'use strict';

  /* 수기 입력 대상 데이터셋 (API 미연계) */
  var DS = [
    { id:'CAMP', nm:'탄소중립 캠페인 실적', mile:'데이터', cycle:'월 1회', last:'2026-06-30', ent:'CampaignRecord',
      fields:[
        { k:'기준월',      t:'month',  ph:'2026-07' },
        { k:'캠페인명',    t:'text',   ph:'예: 우리동네 탄소줄이기' },
        { k:'참여 인원',   t:'number', ph:'명' },
        { k:'감축량(tCO₂)', t:'number', ph:'예: 12.5' }
      ] },
    { id:'EDU', nm:'환경교육 참여 실적', mile:'데이터', cycle:'행사별', last:'2026-06-27', ent:'EduRecord',
      fields:[
        { k:'행사일자',    t:'date',   ph:'' },
        { k:'프로그램명',  t:'text',   ph:'예: 기후학교' },
        { k:'참여 인원',   t:'number', ph:'명' },
        { k:'운영 장소',   t:'text',   ph:'예: 광명시민회관' }
      ] },
    { id:'REUSE', nm:'자원순환 수거 실적(수기)', mile:'데이터', cycle:'주 1회', last:'2026-06-29', ent:'CollectRecord',
      fields:[
        { k:'수거 주차',   t:'week',   ph:'' },
        { k:'품목',        t:'text',   ph:'예: 다회용기' },
        { k:'수거량(kg)',  t:'number', ph:'kg' },
        { k:'수거 지점 수', t:'number', ph:'개소' }
      ] },
    { id:'BIKE', nm:'공유이동수단 정비 실적', mile:'모빌리티', cycle:'수시', last:'2026-06-25', ent:'MaintRecord',
      fields:[
        { k:'정비일자',    t:'date',   ph:'' },
        { k:'대상',        t:'text',   ph:'예: 공유자전거' },
        { k:'정비 대수',   t:'number', ph:'대' },
        { k:'비고',        t:'text',   ph:'' }
      ] },
    { id:'STAT', nm:'월간 통계 수기 집계', mile:'데이터', cycle:'월 1회', last:'2026-06-30', ent:'StatRecord',
      fields:[
        { k:'기준월',      t:'month',  ph:'2026-07' },
        { k:'지표명',      t:'text',   ph:'예: 전기차 등록대수' },
        { k:'값',          t:'number', ph:'' },
        { k:'단위',        t:'text',   ph:'예: 대' }
      ] },
    { id:'ETC', nm:'기타 수기 데이터', mile:'데이터', cycle:'수시', last:'—', ent:'GenericRecord',
      fields:[
        { k:'기준일',      t:'date',   ph:'' },
        { k:'항목',        t:'text',   ph:'' },
        { k:'값',          t:'text',   ph:'' }
      ] }
  ];

  var sel = null, sub = 'input';

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function renderList(){
    var el = document.getElementById('mlItems');
    if(!el) return;
    el.innerHTML = DS.map(function(d){
      return '<div class="ml-it'+ (sel && sel.id===d.id ? ' on':'') +'" data-id="'+ d.id +'">'
        + '<span class="nm">'+ esc(d.nm) +'</span>'
        + '<span class="mt"><span class="mb mb--man">수기</span>'+ esc(d.mile) +' · '+ esc(d.cycle) +' · 최근 '+ esc(d.last) +'</span>'
        + '</div>';
    }).join('');
    var c = document.getElementById('mlCount'); if(c) c.textContent = DS.length;
  }

  function renderPanel(){
    var p = document.getElementById('mlPanel');
    if(!p) return;
    if(!sel){
      p.innerHTML = '<div class="ml-empty">'
        + '<i data-lucide="clipboard-pen"></i>'
        + '<div class="t">왼쪽에서 입력할 데이터셋을 선택하세요.<br>API 연계가 없는 수기 데이터를 직접 입력하거나 파일로 적재합니다.</div>'
        + '</div>';
      if(window.lucide) window.lucide.createIcons();
      return;
    }
    var body = sub === 'input' ? formHtml(sel) : uploadHtml(sel);
    p.innerHTML =
        '<div class="ph"><div><h3>'+ esc(sel.nm) +'</h3>'
      + '<div class="sub">NGSI-LD 엔터티 : <b>'+ esc(sel.ent) +'</b> · 수집 주기 '+ esc(sel.cycle) +' · 최근 입력 '+ esc(sel.last) +'</div></div></div>'
      + '<div class="ml-tabs">'
      + '<button class="ml-tab'+ (sub==='input'?' on':'') +'" data-sub="input" type="button">직접 입력</button>'
      + '<button class="ml-tab'+ (sub==='file'?' on':'') +'" data-sub="file" type="button">파일 업로드</button>'
      + '</div>' + body;
    if(window.lucide) window.lucide.createIcons();
  }

  function formHtml(d){
    var fs = d.fields.map(function(f){
      return '<div class="fg"><label>'+ esc(f.k) +' <span class="req">*</span></label>'
        + '<input type="'+ f.t +'" placeholder="'+ esc(f.ph) +'"></div>';
    }).join('');
    return '<div class="frm">'+ fs
      + '<div class="fg"><label>비고</label><textarea placeholder="추가 설명(선택)"></textarea></div>'
      + '<p class="hint">저장 시 입력분은 검증 후 NiFi 수동 수집원을 거쳐 데이터 허브에 적재됩니다.</p>'
      + '<div class="frow" style="justify-content:flex-end;gap:8px">'
      + '<button class="btn btn--line" type="button" id="mlReset">초기화</button>'
      + '<button class="btn btn--pri" type="button" id="mlSave"><i data-lucide="save" class="gp-ico"></i>저장</button>'
      + '</div></div>';
  }

  function uploadHtml(d){
    var cols = d.fields.map(function(f){ return f.k; }).join(', ');
    return '<div class="frm">'
      + '<div class="upz" id="mlDrop"><i data-lucide="upload-cloud"></i>'
      + '<div class="t">CSV·XLSX 파일을 끌어다 놓거나 클릭하여 선택</div>'
      + '<div class="s">필수 컬럼 : '+ esc(cols) +'</div></div>'
      + '<p class="hint">템플릿을 내려받아 형식에 맞춰 작성하면 검증 오류를 줄일 수 있습니다.</p>'
      + '<div class="frow" style="justify-content:space-between;gap:8px">'
      + '<button class="btn btn--line" type="button" id="mlTpl"><i data-lucide="download" class="gp-ico"></i>템플릿 내려받기</button>'
      + '<button class="btn btn--pri" type="button" id="mlUpload"><i data-lucide="check" class="gp-ico"></i>업로드·검증</button>'
      + '</div></div>';
  }

  function init(){
    if(!document.getElementById('mlItems')) return;
    renderList();
    renderPanel();

    document.getElementById('mlItems').addEventListener('click', function(e){
      var it = e.target.closest('.ml-it'); if(!it) return;
      sel = DS.filter(function(d){ return d.id === it.getAttribute('data-id'); })[0];
      sub = 'input';
      renderList(); renderPanel();
    });

    document.getElementById('mlPanel').addEventListener('click', function(e){
      var tb = e.target.closest('.ml-tab');
      if(tb){ sub = tb.getAttribute('data-sub'); renderPanel(); return; }
      if(e.target.closest('#mlSave') || e.target.closest('#mlUpload')){
        alert('입력분이 저장되었습니다. (허브 적재는 배포 시 반영)');
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
