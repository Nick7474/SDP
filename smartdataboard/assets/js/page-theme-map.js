/* =====================================================================
   광명 스마트데이터보드 · 도시 데이터 주제도 (Kakao Maps v3)
   ===================================================================== */
(function () {
  'use strict';

  /* ── 경계 ── */
  var GM_BOUNDS = { north:37.4968, south:37.3922, west:126.8172, east:126.9108, svgW:391, svgH:561 };

  /* ── 분야 → 4대 마일 매핑 ── */
  var FIELD_TO_MILE = {
    '교통·이동':    'mobility',
    '안전·재난':    'safety',
    '에너지·건물':  'energy',
    '탄소·그린모드':'energy'
  };
  var PIN_FILES  = { energy:'pin-energy.svg',  mobility:'pin-mobility.svg',  safety:'pin-safety.svg',  data:'pin-data.svg'  };
  var MILE_FILES = { energy:'mile-energy.svg', mobility:'mile-mobility.svg', safety:'mile-safety.svg', data:'mile-data.svg' };

  /* ── 아이콘 SVG 경로 ── */
  var ICO = {
    users:       '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    activity:    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    wind:        '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    bus:         '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16M12 3v8M8 19v2M16 19v2M3 15h18"/><circle cx="8" cy="19" r="1"/><circle cx="16" cy="19" r="1"/>',
    zap:         '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    bike:        '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
    camera:      '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    alert:       '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    droplets:    '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    cloud:       '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
    tree:        '<path d="M12 22v-7"/><path d="M7.5 14H5a1 1 0 0 1-.707-1.707l7.5-7.5a1 1 0 0 1 1.414 0l7.5 7.5A1 1 0 0 1 19 14h-2.5"/>',
    leaf:        '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    sun:         '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    book:        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    hospital:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><path d="M12 7v6M9 10h6"/>',
    building:    '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>',
    home:        '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    info:        '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    database:    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
    chart:       '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'
  };

  function iconSvg(name, sz) {
    sz = sz || 14;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + sz + '" height="' + sz
      + '" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      + (ICO[name] || ICO.info) + '</svg>';
  }

  /* ── 레이어 정의 ── */
  var LAYER_CFG = {
    'pop-dong':    { label:'행정동별 인구 분포',  field:'인구·생활',    color:'#0C8AE5', iconName:'users',    heatmap:true,  vis:'단계구분도', freq:'월 1회',  source:'광명시 행정 데이터',        spatial:'행정동'   },
    'pop-float':   { label:'유동인구 밀도',       field:'인구·생활',    color:'#1AAA5E', iconName:'activity', heatmap:false, vis:'히트맵',     freq:'일간',    source:'통신사 유동인구 데이터',    spatial:'행정동'   },
    'pop-dust':    { label:'미세먼지 분포',       field:'인구·생활',    color:'#6E74D6', iconName:'wind',     heatmap:false, vis:'버블',       freq:'1시간',   source:'대기측정망 API',           spatial:'측정소'   },
    'trans-bus':   { label:'버스 노선 현황',      field:'교통·이동',    color:'#1AAA5E', iconName:'bus',      heatmap:false, vis:'포인트',     freq:'실시간',  source:'버스 노선 API',            spatial:'정류장'   },
    'trans-traffic':{ label:'교통량 밀도 분포',  field:'교통·이동',    color:'#ED8B16', iconName:'activity', heatmap:true,  vis:'히트맵',     freq:'1시간',   source:'교통 빅데이터 플랫폼',     spatial:'도로'     },
    'trans-ev':    { label:'전기차 충전소 위치',  field:'교통·이동',    color:'#0C8AE5', iconName:'zap',      heatmap:false, vis:'포인트',     freq:'월 1회',  source:'한국전력공사 데이터',       spatial:'시설'     },
    'trans-bike':  { label:'공공자전거 스테이션', field:'교통·이동',    color:'#6E74D6', iconName:'bike',     heatmap:false, vis:'포인트',     freq:'실시간',  source:'따릉이 연계 데이터',        spatial:'스테이션' },
    'trans-parking':{ label:'주차장 현황',        field:'교통·이동',    color:'#AEB7C2', iconName:'building', heatmap:false, vis:'포인트',     freq:'월 1회',  source:'광명시 주차 정보',         spatial:'시설'     },
    'safe-crime':  { label:'범죄 발생 분포',      field:'안전·재난',    color:'#E0483D', iconName:'alert',    heatmap:true,  vis:'히트맵',     freq:'월 1회',  source:'경기남부경찰청',            spatial:'행정동'   },
    'safe-cctv':   { label:'CCTV 설치 현황',     field:'안전·재난',    color:'#ED8B16', iconName:'camera',   heatmap:false, vis:'포인트',     freq:'분기',    source:'광명시 CCTV 관제센터',    spatial:'설치위치' },
    'safe-flood':  { label:'침수 위험 구역',      field:'안전·재난',    color:'#6E74D6', iconName:'droplets', heatmap:false, vis:'폴리곤',     freq:'연 1회',  source:'기상청 수문 데이터',        spatial:'구역'     },
    'env-air':     { label:'대기질 모니터링',     field:'환경·기후',    color:'#0C8AE5', iconName:'cloud',    heatmap:false, vis:'포인트',     freq:'1시간',   source:'대기측정망 API',           spatial:'측정소'   },
    'env-heat':    { label:'도시열섬 지수',       field:'환경·기후',    color:'#E0483D', iconName:'thermometer',heatmap:true, vis:'히트맵',    freq:'일간',    source:'기상청 도시기후 데이터',    spatial:'행정동'   },
    'env-green':   { label:'녹지 분포 현황',      field:'환경·기후',    color:'#1AAA5E', iconName:'tree',     heatmap:false, vis:'폴리곤',     freq:'연 1회',  source:'국토지리정보원',            spatial:'구역'     },
    'env-water':   { label:'수질 측정 지점',      field:'환경·기후',    color:'#6E74D6', iconName:'droplets', heatmap:false, vis:'포인트',     freq:'주간',    source:'환경부 물환경정보시스템',   spatial:'측정소'   },
    'energy-use':  { label:'건물 에너지 사용',    field:'에너지·건물',  color:'#FFB114', iconName:'building', heatmap:true,  vis:'단계구분도', freq:'월 1회',  source:'한국에너지공단 데이터',     spatial:'행정동'   },
    'energy-solar':{ label:'태양광 발전 지점',    field:'에너지·건물',  color:'#F59E0B', iconName:'sun',      heatmap:false, vis:'포인트',     freq:'일간',    source:'에너지 지원 API',          spatial:'시설'     },
    'energy-age':  { label:'노후건물 분포',       field:'에너지·건물',  color:'#6E74D6', iconName:'home',     heatmap:true,  vis:'단계구분도', freq:'연 1회',  source:'건축물대장 공공 데이터',    spatial:'행정동'   },
    'energy-cert': { label:'에너지 인증 건물',    field:'에너지·건물',  color:'#0C8AE5', iconName:'zap',      heatmap:false, vis:'포인트',     freq:'연 1회',  source:'국토교통부 데이터',         spatial:'시설'     },
    'pub-school':  { label:'학교 위치',           field:'공공시설',     color:'#1AAA5E', iconName:'book',     heatmap:false, vis:'포인트',     freq:'연간',    source:'교육부 학교 정보',         spatial:'시설'     },
    'pub-hospital':{ label:'의료기관 현황',       field:'공공시설',     color:'#E0483D', iconName:'hospital', heatmap:false, vis:'포인트',     freq:'연간',    source:'건강보험심사평가원',        spatial:'시설'     },
    'pub-welfare': { label:'복지시설 분포',       field:'공공시설',     color:'#6E74D6', iconName:'building', heatmap:false, vis:'포인트',     freq:'연간',    source:'광명시 복지 정보시스템',    spatial:'시설'     },
    'pub-park':    { label:'공원·녹지 현황',      field:'공공시설',     color:'#1AAA5E', iconName:'tree',     heatmap:false, vis:'폴리곤',     freq:'연간',    source:'국토지리정보원 공원 데이터',spatial:'구역'    },
    'carbon-est':  { label:'탄소배출 추정 분포',  field:'탄소·그린모드',color:'#1AAA5E', iconName:'leaf',     heatmap:true,  vis:'히트맵',     freq:'월 1회',  source:'에너지 사용 기반 추정',     spatial:'행정동'   },
    'carbon-sink': { label:'마일별 흡수원 위치',  field:'탄소·그린모드',color:'#0C8AE5', iconName:'tree',     heatmap:false, vis:'포인트',     freq:'분기',    source:'탄소흡수원 DB',             spatial:'시설'     }
  };

  /* ── 핀 데이터 (전 레이어) ── */
  var ALL_PINS = [
    /* pop-dong: 행정동별 인구 */
    { id:'pd-1', layer:'pop-dong',    name:'일직동',           lat:37.4265, lng:126.8598, data:{ total:20541, prev:+0.8, float:82, carbon:72, resident:15432, household:7021 } },
    { id:'pd-2', layer:'pop-dong',    name:'소하동',           lat:37.4408, lng:126.8798, data:{ total:35210, prev:-0.3, float:71, carbon:65, resident:28150, household:12400 } },
    { id:'pd-3', layer:'pop-dong',    name:'하안동',           lat:37.4518, lng:126.8748, data:{ total:58340, prev:+1.2, float:88, carbon:58, resident:46820, household:19220 } },
    { id:'pd-4', layer:'pop-dong',    name:'철산동',           lat:37.4742, lng:126.8822, data:{ total:42180, prev:+0.5, float:90, carbon:61, resident:34560, household:14080 } },
    { id:'pd-5', layer:'pop-dong',    name:'광명동',           lat:37.4618, lng:126.8632, data:{ total:29870, prev:-0.1, float:64, carbon:70, resident:23480, household:9610 } },
    { id:'pd-6', layer:'pop-dong',    name:'학온동',           lat:37.4380, lng:126.8668, data:{ total:18920, prev:+0.4, float:55, carbon:48, resident:14800, household:5820 } },
    /* pop-float: 유동인구 */
    { id:'pf-1', layer:'pop-float',   name:'철산역 상권',      lat:37.4762, lng:126.8852, data:{ count:12400, density:92, peak:'18:00–20:00' } },
    { id:'pf-2', layer:'pop-float',   name:'광명 버스터미널',  lat:37.4680, lng:126.8778, data:{ count:8200,  density:78, peak:'08:00–09:00' } },
    { id:'pf-3', layer:'pop-float',   name:'하안로 상업지구',  lat:37.4520, lng:126.8810, data:{ count:6500,  density:65, peak:'12:00–13:00' } },
    { id:'pf-4', layer:'pop-float',   name:'광명역 환승지구',  lat:37.4175, lng:126.8672, data:{ count:9800,  density:85, peak:'07:30–09:30' } },
    /* trans-bus: 버스 */
    { id:'tb-1', layer:'trans-bus',   name:'철산역 환승센터',  lat:37.4748, lng:126.8796, data:{ routes:8,  daily:3240, interval:'5-10분' } },
    { id:'tb-2', layer:'trans-bus',   name:'광명 버스터미널',  lat:37.4680, lng:126.8778, data:{ routes:14, daily:5820, interval:'3-8분'  } },
    { id:'tb-3', layer:'trans-bus',   name:'하안사거리 정류장',lat:37.4520, lng:126.8800, data:{ routes:5,  daily:1850, interval:'8-15분' } },
    { id:'tb-4', layer:'trans-bus',   name:'광명역 버스정류장',lat:37.4175, lng:126.8672, data:{ routes:10, daily:4200, interval:'5-12분' } },
    { id:'tb-5', layer:'trans-bus',   name:'소하동 주민센터',  lat:37.4420, lng:126.8810, data:{ routes:3,  daily:720,  interval:'15-20분'} },
    /* trans-ev: 전기차 충전소 */
    { id:'ev-1', layer:'trans-ev',    name:'광명역 공영주차장',lat:37.4180, lng:126.8680, data:{ chargers:20, available:12, usage:40  } },
    { id:'ev-2', layer:'trans-ev',    name:'하안지구 충전소',  lat:37.4540, lng:126.8760, data:{ chargers:8,  available:3,  usage:63  } },
    { id:'ev-3', layer:'trans-ev',    name:'철산 상업지구',    lat:37.4750, lng:126.8840, data:{ chargers:6,  available:0,  usage:100 } },
    { id:'ev-4', layer:'trans-ev',    name:'소하 2지구',       lat:37.4400, lng:126.8820, data:{ chargers:4,  available:2,  usage:50  } },
    /* trans-bike: 공공자전거 */
    { id:'bk-1', layer:'trans-bike',  name:'광명역 스테이션',  lat:37.4185, lng:126.8685, data:{ docks:20, avail:8,  usage:68 } },
    { id:'bk-2', layer:'trans-bike',  name:'하안공원 스테이션',lat:37.4535, lng:126.8765, data:{ docks:15, avail:5,  usage:55 } },
    { id:'bk-3', layer:'trans-bike',  name:'철산역 스테이션',  lat:37.4750, lng:126.8860, data:{ docks:18, avail:12, usage:40 } },
    { id:'bk-4', layer:'trans-bike',  name:'소하천 스테이션',  lat:37.4410, lng:126.8830, data:{ docks:10, avail:3,  usage:75 } },
    /* safe-cctv: CCTV */
    { id:'cc-1', layer:'safe-cctv',   name:'하안동 CCTV 존',   lat:37.4510, lng:126.8760, data:{ count:24, lastCheck:'2026.05.01' } },
    { id:'cc-2', layer:'safe-cctv',   name:'철산동 CCTV 존',   lat:37.4700, lng:126.8800, data:{ count:18, lastCheck:'2026.04.15' } },
    { id:'cc-3', layer:'safe-cctv',   name:'광명동 CCTV 존',   lat:37.4610, lng:126.8620, data:{ count:12, lastCheck:'2026.05.10' } },
    { id:'cc-4', layer:'safe-cctv',   name:'소하동 CCTV 존',   lat:37.4390, lng:126.8790, data:{ count:16, lastCheck:'2026.04.28' } },
    { id:'cc-5', layer:'safe-cctv',   name:'일직동 CCTV 존',   lat:37.4260, lng:126.8600, data:{ count:8,  lastCheck:'2026.05.20' } },
    /* env-air: 대기질 */
    { id:'air-1', layer:'env-air',    name:'광명시 대기측정소', lat:37.4630, lng:126.8640, data:{ pm25:12, pm10:24, aqi:'good'     } },
    { id:'air-2', layer:'env-air',    name:'하안동 측정소',     lat:37.4520, lng:126.8740, data:{ pm25:18, pm10:35, aqi:'moderate'} },
    { id:'air-3', layer:'env-air',    name:'광명역 측정소',     lat:37.4200, lng:126.8680, data:{ pm25:9,  pm10:18, aqi:'good'    } },
    /* energy-solar: 태양광 */
    { id:'sol-1', layer:'energy-solar',name:'광명 태양광 1호',  lat:37.4430, lng:126.8880, data:{ capacity:500,  monthly:58.4,  opRate:92 } },
    { id:'sol-2', layer:'energy-solar',name:'광명 태양광 2호',  lat:37.4710, lng:126.8770, data:{ capacity:320,  monthly:37.2,  opRate:88 } },
    { id:'sol-3', layer:'energy-solar',name:'광명역세권 태양광',lat:37.4190, lng:126.8700, data:{ capacity:1200, monthly:140.2, opRate:95 } },
    { id:'sol-4', layer:'energy-solar',name:'소하지구 태양광',  lat:37.4450, lng:126.8820, data:{ capacity:280,  monthly:32.4,  opRate:85 } },
    /* pub-school: 학교 */
    { id:'sc-1', layer:'pub-school',  name:'광명초등학교',      lat:37.4670, lng:126.8600, data:{ schoolName:'광명초등학교',  students:820,  schoolType:'초등학교' } },
    { id:'sc-2', layer:'pub-school',  name:'하안중학교',        lat:37.4500, lng:126.8720, data:{ schoolName:'하안중학교',    students:640,  schoolType:'중학교'   } },
    { id:'sc-3', layer:'pub-school',  name:'철산고등학교',      lat:37.4760, lng:126.8820, data:{ schoolName:'철산고등학교',  students:1080, schoolType:'고등학교' } },
    { id:'sc-4', layer:'pub-school',  name:'소하초등학교',      lat:37.4450, lng:126.8850, data:{ schoolName:'소하초등학교',  students:560,  schoolType:'초등학교' } },
    { id:'sc-5', layer:'pub-school',  name:'광덕초등학교',      lat:37.4380, lng:126.8640, data:{ schoolName:'광덕초등학교',  students:480,  schoolType:'초등학교' } },
    /* pub-hospital: 의료기관 */
    { id:'hp-1', layer:'pub-hospital',name:'광명성애병원',      lat:37.4680, lng:126.8660, data:{ hospitalName:'광명성애병원', beds:420, specialty:'종합병원'    } },
    { id:'hp-2', layer:'pub-hospital',name:'하안 의원',         lat:37.4500, lng:126.8750, data:{ hospitalName:'하안 의원',    beds:30,  specialty:'내과'        } },
    { id:'hp-3', layer:'pub-hospital',name:'철산 클리닉',       lat:37.4730, lng:126.8810, data:{ hospitalName:'철산 클리닉',  beds:18,  specialty:'가정의학과'  } },
    /* pub-welfare: 복지시설 */
    { id:'wl-1', layer:'pub-welfare', name:'광명시 노인복지관', lat:37.4620, lng:126.8680, data:{ name:'광명시 노인복지관', capacity:200, type:'노인복지' } },
    { id:'wl-2', layer:'pub-welfare', name:'하안종합사회복지관',lat:37.4510, lng:126.8790, data:{ name:'하안종합사회복지관', capacity:150, type:'종합복지'} },
    /* carbon-est: 탄소배출 추정 */
    { id:'ce-1', layer:'carbon-est',  name:'철산동',            lat:37.4742, lng:126.8822, data:{ emission:4820, prevYear:-3.2, source:'전기/열'    } },
    { id:'ce-2', layer:'carbon-est',  name:'하안동',            lat:37.4518, lng:126.8748, data:{ emission:6120, prevYear:-1.8, source:'전기'       } },
    { id:'ce-3', layer:'carbon-est',  name:'광명동',            lat:37.4618, lng:126.8632, data:{ emission:3240, prevYear:+0.4, source:'가스/열'    } },
    { id:'ce-4', layer:'carbon-est',  name:'소하동',            lat:37.4408, lng:126.8798, data:{ emission:3980, prevYear:-2.1, source:'전기/가스'  } },
    /* carbon-sink: 흡수원 */
    { id:'cs-1', layer:'carbon-sink', name:'광명 도시숲 1호',   lat:37.4580, lng:126.8690, data:{ sinkRate:42, area:12.4, treeType:'참나무류'} },
    { id:'cs-2', layer:'carbon-sink', name:'안양천 수변공원',   lat:37.4350, lng:126.8720, data:{ sinkRate:35, area:8.8,  treeType:'버드나무류'} }
  ];

  /* ── 히트맵 포인트 ── */
  var TM_HEAT_PTS = [
    {lat:37.4742, lng:126.8822, w:1.00}, {lat:37.4518, lng:126.8748, w:0.88},
    {lat:37.4618, lng:126.8632, w:0.82}, {lat:37.4408, lng:126.8798, w:0.75},
    {lat:37.4265, lng:126.8598, w:0.68}, {lat:37.4380, lng:126.8668, w:0.60},
    {lat:37.4480, lng:126.8720, w:0.78}, {lat:37.4650, lng:126.8760, w:0.72}
  ];

  /* ── 상태 ── */
  var tmMap = null;
  var heatCanvas = null;
  var markerRefs = {};        // { layerId: [{overlay, el, pin}] }
  var boundaryPolygon = null;
  var activeLayers = ['pop-dong', 'pop-float', 'carbon-est'];
  var selectedPin = null;
  var currentDisplay = 'heatmap';
  var favoriteLayers = new Set(JSON.parse(localStorage.getItem('tm_favorites') || '[]'));
  var favFilterActive = false;

  /* ════════════════════════════════════════════════════════
     부트
  ════════════════════════════════════════════════════════ */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryBoot);
    } else { tryBoot(); }
  }

  function tryBoot() {
    if (typeof kakao === 'undefined' || !kakao.maps) { setTimeout(tryBoot, 100); return; }
    var hd = document.getElementById('gmsb-header');
    if (hd && hd.children.length === 0) {
      document.addEventListener('gmsb:shell-ready', boot, { once: true });
    } else { boot(); }
  }

  function boot() {
    initMap();
    initTree();
    initFavorites();
    initSpatialBtns();
    initOpacitySlider();
    initDisplayMode();
    initSearch();
    initPopup();
    initDrawer();
    initSrcModal();
    applyMarkers();
    renderHeatmap();
    updateActiveLayersOverlay();
    if (window.lucide) lucide.createIcons();
  }

  /* ════════════════════════════════════════════════════════
     지도
  ════════════════════════════════════════════════════════ */
  function initMap() {
    var container = document.getElementById('tmMap');
    tmMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.444, 126.865),
      level: 7
    });
    loadBoundary();
    addHeatmapCanvas();

    document.getElementById('tmBtnZoomIn').addEventListener('click', function () { tmMap.setLevel(tmMap.getLevel() - 1); });
    document.getElementById('tmBtnZoomOut').addEventListener('click', function () { tmMap.setLevel(tmMap.getLevel() + 1); });
    document.getElementById('tmBtnFitAll').addEventListener('click', function () {
      tmMap.setBounds(new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(GM_BOUNDS.south, GM_BOUNDS.west),
        new kakao.maps.LatLng(GM_BOUNDS.north, GM_BOUNDS.east)
      ), 20, 20, 20, 20);
    });
    document.getElementById('tmBtnCenter').addEventListener('click', function () {
      tmMap.setCenter(new kakao.maps.LatLng(37.444, 126.865)); tmMap.setLevel(7);
    });
    document.getElementById('tmBtnExport').addEventListener('click', function () {
      var mapCanvas = document.querySelector('#tmMap canvas');
      if (mapCanvas) {
        try {
          var link = document.createElement('a');
          link.download = '광명스마트데이터보드_주제도_' + new Date().toISOString().slice(0, 10) + '.png';
          link.href = mapCanvas.toDataURL('image/png');
          link.click();
        } catch (e) {
          alert('지도 내보내기는 동일 도메인 환경에서만 지원됩니다.');
        }
      } else {
        alert('지도 내보내기 기능은 준비 중입니다.');
      }
    });

    kakao.maps.event.addListener(tmMap, 'zoom_changed', function () { renderHeatmap(); hideHoverTip(); });
    kakao.maps.event.addListener(tmMap, 'center_changed', function () { renderHeatmap(); hideHoverTip(); });
    kakao.maps.event.addListener(tmMap, 'click', closePopup);
  }

  function loadBoundary() {
    var base = window.GMSB_BASE || '../';
    fetch(base + 'assets/img/GM_Map_outerline.svg')
      .then(function (r) { return r.text(); })
      .then(function (svgText) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgText, 'image/svg+xml');
        var srcPath = doc.querySelector('path');
        if (!srcPath) return;
        var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('viewBox', '0 0 ' + GM_BOUNDS.svgW + ' ' + GM_BOUNDS.svgH);
        svgEl.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:' + GM_BOUNDS.svgW + 'px;height:' + GM_BOUNDS.svgH + 'px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(svgEl);
        var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', srcPath.getAttribute('d'));
        svgEl.appendChild(pathEl);
        var totalLen = pathEl.getTotalLength();
        var N = 600, coords = [];
        for (var i = 0; i <= N; i++) {
          var pt = pathEl.getPointAtLength((i / N) * totalLen);
          var lat = GM_BOUNDS.north - (pt.y / GM_BOUNDS.svgH) * (GM_BOUNDS.north - GM_BOUNDS.south);
          var lng = GM_BOUNDS.west  + (pt.x / GM_BOUNDS.svgW) * (GM_BOUNDS.east  - GM_BOUNDS.west);
          coords.push(new kakao.maps.LatLng(lat, lng));
        }
        document.body.removeChild(svgEl);
        if (boundaryPolygon) boundaryPolygon.setMap(null);
        boundaryPolygon = new kakao.maps.Polygon({
          map: tmMap, path: coords,
          strokeWeight: 2, strokeColor: '#0C8AE5', strokeOpacity: 1.0,
          fillColor: '#0C8AE5', fillOpacity: 0.06
        });
      }).catch(function () {});
  }

  function addHeatmapCanvas() {
    var mapEl = document.getElementById('tmMap');
    heatCanvas = document.createElement('canvas');
    heatCanvas.id = 'tmHeatmapCanvas';
    heatCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:.65;';
    mapEl.appendChild(heatCanvas);
  }

  /* ════════════════════════════════════════════════════════
     히트맵
  ════════════════════════════════════════════════════════ */
  function renderHeatmap() {
    if (!heatCanvas || !tmMap) return;
    var hasHeat = activeLayers.some(function (id) { return LAYER_CFG[id] && LAYER_CFG[id].heatmap; });
    if (!hasHeat || currentDisplay !== 'heatmap') {
      heatCanvas.getContext('2d').clearRect(0, 0, heatCanvas.width, heatCanvas.height);
      return;
    }
    var proj = tmMap.getProjection();
    var mapEl = document.getElementById('tmMap');
    var W = mapEl.offsetWidth, H = mapEl.offsetHeight;
    heatCanvas.width = W; heatCanvas.height = H;
    var ctx = heatCanvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    var RADIUS = Math.max(W, H) * 0.20;
    TM_HEAT_PTS.forEach(function (p) {
      var sp = proj.containerPointFromCoords(new kakao.maps.LatLng(p.lat, p.lng));
      var x = sp.x, y = sp.y;
      var grad = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
      grad.addColorStop(0,   'rgba(224,72,61,'   + (p.w * 0.70) + ')');
      grad.addColorStop(0.3, 'rgba(237,139,22,'  + (p.w * 0.55) + ')');
      grad.addColorStop(0.6, 'rgba(12,138,229,'  + (p.w * 0.40) + ')');
      grad.addColorStop(1,   'rgba(229,237,248,0)');
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  /* ════════════════════════════════════════════════════════
     마커
  ════════════════════════════════════════════════════════ */
  function buildMarkerEl(pin, cfg) {
    var base = window.GMSB_BASE || '../';
    var mile = FIELD_TO_MILE[cfg.field] || 'data';
    var pinFile = PIN_FILES[mile];

    var el = document.createElement('div');
    el.className = 'tm-pin-marker';
    el.style.cssText = 'position:relative;width:44px;height:53px;cursor:pointer;transition:transform .15s;';

    var img = document.createElement('img');
    img.src = base + 'assets/img/' + pinFile;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.22));pointer-events:none;';
    el.appendChild(img);

    el.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.12) translateY(-3px)'; });
    el.addEventListener('mouseleave',  function () { this.style.transform = ''; });
    return el;
  }

  function calcBubbleSize(pin) {
    var d = pin.data || {};
    var v = d.total || d.count || d.density || d.emission || 50;
    var max = 60000;
    return Math.max(18, Math.min(52, Math.round((v / max) * 40) + 16));
  }

  function applyMarkers() {
    Object.keys(markerRefs).forEach(function (lid) {
      markerRefs[lid].forEach(function (r) { r.overlay.setMap(null); });
    });
    markerRefs = {};

    activeLayers.forEach(function (layerId) {
      var cfg = LAYER_CFG[layerId];
      if (!cfg) return;
      markerRefs[layerId] = [];

      ALL_PINS.filter(function (p) { return p.layer === layerId; }).forEach(function (pin) {
        var el = buildMarkerEl(pin, cfg);
        el.addEventListener('mouseenter', function () { showHoverTip(pin, cfg); });
        el.addEventListener('mouseleave',  hideHoverTip);
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          openPopup(pin, cfg);
        });
        var overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(pin.lat, pin.lng),
          content: el, map: tmMap,
          xAnchor: 0.5, yAnchor: 0.83, zIndex: 5
        });
        markerRefs[layerId].push({ pin: pin, overlay: overlay, el: el });
      });
    });
  }

  function setSelectedMarker(pin) {
    Object.keys(markerRefs).forEach(function (lid) {
      markerRefs[lid].forEach(function (r) {
        r.el.classList.remove('selected');
        r.el.style.zIndex = '';
      });
    });
    if (!pin) return;
    Object.keys(markerRefs).forEach(function (lid) {
      markerRefs[lid].forEach(function (r) {
        if (r.pin.id === pin.id) {
          r.el.classList.add('selected');
          r.el.style.zIndex = '10';
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     호버 툴팁
  ════════════════════════════════════════════════════════ */
  function showHoverTip(pin, cfg) {
    var tip = document.getElementById('tmHoverTip');
    if (!tip || !tmMap) return;
    document.getElementById('tmHoverName').textContent = cfg.label;
    document.getElementById('tmHoverVal').textContent  = pin.name;
    var proj = tmMap.getProjection();
    var pt = proj.containerPointFromCoords(new kakao.maps.LatLng(pin.lat, pin.lng));
    tip.style.left = (pt.x + 22) + 'px';
    tip.style.top  = (pt.y - 36) + 'px';
    tip.classList.add('visible');
  }

  function hideHoverTip() {
    var tip = document.getElementById('tmHoverTip');
    if (tip) tip.classList.remove('visible');
  }

  /* ════════════════════════════════════════════════════════
     팝업 (centered modal)
  ════════════════════════════════════════════════════════ */
  function initPopup() {
    document.getElementById('tmPopupClose').addEventListener('click', closePopup);
    document.getElementById('tmPopupScrim').addEventListener('click', closePopup);
    document.getElementById('tmPopupDetailBtn').addEventListener('click', function () {
      closePopup();
      if (selectedPin) openDrawer(selectedPin);
    });
    document.getElementById('tmPopupDataBtn').addEventListener('click', function () {
      if (selectedPin) openSrcModal(LAYER_CFG[selectedPin.layer] || {}, selectedPin);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePopup(); closeDrawer(); closeSrcModal(); }
    });
  }

  function openPopup(pin, cfg) {
    selectedPin = pin;
    hideHoverTip();

    /* 뱃지: 4대 마일 아이콘 */
    var mile = FIELD_TO_MILE[cfg.field] || 'data';
    document.getElementById('tmPopupBadge').innerHTML =
      '<img src="' + (window.GMSB_BASE||'../') + 'assets/img/' + MILE_FILES[mile] + '" style="width:38px;height:38px;display:block;" alt="">';
    document.getElementById('tmPopupTitle').textContent = pin.name;
    document.getElementById('tmPopupType').textContent  = cfg.label + ' · ' + cfg.field;
    document.getElementById('tmPopupDl').innerHTML = buildPopupRows(pin, cfg);

    document.getElementById('tmMapPopup').classList.add('open');
    setSelectedMarker(pin);
  }

  function closePopup() {
    var popup = document.getElementById('tmMapPopup');
    if (popup) popup.classList.remove('open');
    setSelectedMarker(null);
    selectedPin = null;
  }


  /* ── 팝업 내 데이터 행 빌더 ── */
  function buildPopupRows(pin, cfg) {
    var d = pin.data || {};
    var rows = [
      pRow('주제명',    cfg.label),
      pRow('분야',      cfg.field),
      pRow('공간 단위', cfg.spatial),
      pRow('데이터 출처', cfg.source || '-'),
      pRow('기준일',    '2026.05.26')
    ];
    var DIV = '<div style="height:1px;background:var(--border-2);margin:2px 0;"></div>';

    switch (pin.layer) {
      case 'pop-dong': {
        var tc = d.prev >= 0 ? 'var(--status-danger)' : 'var(--status-info)';
        var ta = d.prev >= 0 ? '▲' : '▼';
        rows.push(DIV,
          pRow('총인구',        (d.total || 0).toLocaleString() + '명'),
          pRow('전월 대비',     '<span style="color:' + tc + '">' + (d.prev >= 0 ? '+' : '') + d.prev + '% ' + ta + '</span>'),
          pRow('유동인구 지수',   d.float + '점'),
          pRow('탄소배출 추정', '<span style="color:var(--status-warning)">' + d.carbon + '점</span>')
        );
        break;
      }
      case 'pop-float': {
        rows.push(DIV,
          pRow('유동인구 수', (d.count || 0).toLocaleString() + '명'),
          pRow('밀도 지수',   d.density + '점'),
          pRow('피크 시간대', d.peak || '18:00–20:00')
        );
        break;
      }
      case 'trans-bus': {
        rows.push(DIV,
          pRow('노선 수',     d.routes + '개'),
          pRow('하루 이용객', (d.daily || 0).toLocaleString() + '명'),
          pRow('배차 간격',   d.interval)
        );
        break;
      }
      case 'trans-ev': {
        var ac = d.available > 0 ? 'var(--status-success)' : 'var(--status-danger)';
        rows.push(DIV,
          pRow('충전기 수',   d.chargers + '대'),
          pRow('가용 충전기', '<span style="color:' + ac + '">' + d.available + '대</span>'),
          pRow('이용률',      d.usage + '%')
        );
        break;
      }
      case 'trans-bike': {
        var bc = d.avail > 0 ? 'var(--status-success)' : 'var(--status-danger)';
        rows.push(DIV,
          pRow('거치대 수', d.docks + '개'),
          pRow('이용 가능', '<span style="color:' + bc + '">' + d.avail + '대</span>'),
          pRow('이용률',    d.usage + '%')
        );
        break;
      }
      case 'safe-cctv': {
        rows.push(DIV,
          pRow('설치 대수', d.count + '대'),
          pRow('최근 점검', d.lastCheck),
          pRow('운영 상태', '<span style="color:var(--status-success)">● 정상</span>')
        );
        break;
      }
      case 'env-air': {
        var AQI = { good:['좋음','var(--status-success)'], moderate:['보통','var(--status-warning)'], bad:['나쁨','var(--status-danger)'] };
        var qi = AQI[d.aqi] || AQI.moderate;
        rows.push(DIV,
          pRow('PM2.5', d.pm25 + ' ㎍/㎥'),
          pRow('PM10',  d.pm10 + ' ㎍/㎥'),
          pRow('AQI',   '<span style="color:' + qi[1] + '">' + qi[0] + '</span>')
        );
        break;
      }
      case 'energy-solar': {
        rows.push(DIV,
          pRow('발전 용량', d.capacity + ' kW'),
          pRow('월 발전량', d.monthly + ' MWh'),
          pRow('가동률',    d.opRate + '%')
        );
        break;
      }
      case 'carbon-est': {
        var cc = d.prevYear < 0 ? 'var(--status-success)' : 'var(--status-danger)';
        var ca = d.prevYear < 0 ? '▼' : '▲';
        rows.push(DIV,
          pRow('탄소배출량', (d.emission || 0).toLocaleString() + ' tCO₂'),
          pRow('전년 대비',  '<span style="color:' + cc + '">' + (d.prevYear > 0 ? '+' : '') + d.prevYear + '% ' + ca + '</span>'),
          pRow('주 에너지원', d.source || '전기/열')
        );
        break;
      }
      case 'carbon-sink': {
        rows.push(DIV,
          pRow('흡수율',    d.sinkRate + ' tCO₂/년'),
          pRow('면적',      d.area + ' ha'),
          pRow('수종',      d.treeType || '혼합림')
        );
        break;
      }
      case 'pub-school': {
        rows.push(DIV,
          pRow('학교명',   d.schoolName),
          pRow('학생 수',  (d.students || 0).toLocaleString() + '명'),
          pRow('학교 유형', d.schoolType)
        );
        break;
      }
      case 'pub-hospital': {
        rows.push(DIV,
          pRow('병원명',    d.hospitalName),
          pRow('병상 수',   d.beds + '개'),
          pRow('전문 분야', d.specialty)
        );
        break;
      }
      case 'pub-welfare': {
        rows.push(DIV,
          pRow('시설명',  d.name || pin.name),
          pRow('수용 인원', d.capacity + '명'),
          pRow('복지 유형', d.type)
        );
        break;
      }
      default: {
        if (d.value || d.status) rows.push(DIV);
        if (d.value)  rows.push(pRow('수치', d.value));
        if (d.status) rows.push(pRow('상태', d.status));
      }
    }
    return rows.join('');
  }

  function pRow(dt, dd) {
    return '<div class="map-popup__row">'
      + '<span class="map-popup__dt">' + dt + '</span>'
      + '<span class="map-popup__dd">' + dd + '</span>'
      + '</div>';
  }

  /* ════════════════════════════════════════════════════════
     트리 아코디언 + 레이어 체크박스
  ════════════════════════════════════════════════════════ */
  function initTree() {
    document.querySelectorAll('.tm-cat__hd').forEach(function (hd) {
      hd.addEventListener('click', function () { this.closest('.tm-cat').classList.toggle('open'); });
    });

    document.querySelectorAll('.tm-layer-item input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var lid = this.dataset.layer;
        if (this.checked) {
          if (activeLayers.indexOf(lid) < 0) activeLayers.push(lid);
        } else {
          activeLayers = activeLayers.filter(function (l) { return l !== lid; });
        }
        closePopup();
        applyMarkers();
        renderHeatmap();
        updateActiveLayersOverlay();
      });
    });
  }

  function updateActiveLayersOverlay() {
    var el = document.getElementById('tmActiveLayers');
    if (!el) return;
    if (!activeLayers.length) {
      el.innerHTML = '<div class="tm-active-item" style="color:var(--fg-4)">활성 레이어 없음</div>';
      return;
    }
    el.innerHTML = activeLayers.map(function (id) {
      var cfg = LAYER_CFG[id];
      if (!cfg) return '';
      return '<div class="tm-active-item">'
        + '<div class="tm-active-dot" style="background:' + cfg.color + '"></div>'
        + cfg.label + '</div>';
    }).filter(Boolean).join('');
  }

  /* ════════════════════════════════════════════════════════
     공간 단위 버튼
  ════════════════════════════════════════════════════════ */
  function initSpatialBtns() {
    var ZOOM_MAP = { dong:7, '500m':8, facility:9, sensor:9, line:8 };
    document.querySelectorAll('.tm-spatial-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.tm-spatial-btn').forEach(function (b) { b.classList.remove('on'); });
        this.classList.add('on');
        var s = this.dataset.spatial;
        if (ZOOM_MAP[s] !== undefined) tmMap.setLevel(ZOOM_MAP[s]);
        closePopup();
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     투명도 슬라이더
  ════════════════════════════════════════════════════════ */
  function initOpacitySlider() {
    var slider = document.getElementById('tmOpacitySlider');
    var valEl  = document.getElementById('tmOpacityVal');
    if (!slider) return;
    slider.addEventListener('input', function () {
      var v = +this.value;
      valEl.textContent = v + '%';
      slider.style.background = 'linear-gradient(to right, var(--gp-primary) ' + v + '%, var(--border-1) ' + v + '%)';
      if (heatCanvas) heatCanvas.style.opacity = (v / 100 * 0.65);
    });
  }

  /* ════════════════════════════════════════════════════════
     표시 방식
  ════════════════════════════════════════════════════════ */
  function initDisplayMode() {
    document.querySelectorAll('input[name="tmDisplay"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        currentDisplay = this.value;
        var LABELS = { heatmap:'히트맵', bubble:'버블', point:'포인트', grid:'격자 Grid' };
        var vis = document.getElementById('tmVisTypeLabel');
        if (vis) vis.textContent = LABELS[this.value] || this.value;
        if (heatCanvas) heatCanvas.style.display = (this.value === 'heatmap') ? 'block' : 'none';
        closePopup();
        applyMarkers();
        if (this.value === 'heatmap') renderHeatmap();
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     검색
  ════════════════════════════════════════════════════════ */
  function initSearch() {
    var input    = document.getElementById('tmSearchInput');
    var dropdown = document.getElementById('tmSearchDropdown');
    if (!input) return;

    var allLayers = Object.keys(LAYER_CFG).map(function (id) { return { id: id, cfg: LAYER_CFG[id] }; });

    input.addEventListener('input', function () {
      var q = this.value.trim();
      if (!q.length) { dropdown.classList.remove('open'); return; }
      var results = allLayers.filter(function (l) {
        return l.cfg.label.indexOf(q) > -1 || l.cfg.field.indexOf(q) > -1;
      });
      if (!results.length) { dropdown.classList.remove('open'); return; }
      dropdown.innerHTML = results.slice(0, 8).map(function (l) {
        return '<div class="search-item" data-id="' + l.id + '">'
          + '<span class="search-item__dot" style="background:' + l.cfg.color + '"></span>'
          + l.cfg.label + ' <small>(' + l.cfg.field + ')</small></div>';
      }).join('');
      dropdown.classList.add('open');
      dropdown.querySelectorAll('.search-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var lid = item.dataset.id;
          input.value = LAYER_CFG[lid].label;
          dropdown.classList.remove('open');
          if (activeLayers.indexOf(lid) < 0) {
            activeLayers.push(lid);
            var cb = document.querySelector('.tm-layer-item input[data-layer="' + lid + '"]');
            if (cb) { cb.checked = true; }
            applyMarkers();
            renderHeatmap();
            updateActiveLayersOverlay();
          }
        });
      });
    });

    document.addEventListener('click', function (e) {
      var wrap = input.closest('.gis-search');
      if (wrap && !wrap.contains(e.target)) dropdown.classList.remove('open');
    });
  }

  /* ════════════════════════════════════════════════════════
     상세 드로어
  ════════════════════════════════════════════════════════ */
  function initDrawer() {
    document.getElementById('tmDrawerClose').addEventListener('click', closeDrawer);
    document.getElementById('tmDrawerDataBtn').addEventListener('click', function () {
      if (selectedPin) openSrcModal(LAYER_CFG[selectedPin.layer] || {}, selectedPin);
    });
    document.getElementById('tmDrawerExportBtn').addEventListener('click', function () {
      if (selectedPin) exportLayerCsv(selectedPin);
    });
  }

  /* ════════════════════════════════════════════════════════
     즐겨찾기
  ════════════════════════════════════════════════════════ */
  function initFavorites() {
    var filterBtn = document.getElementById('tmFavFilterBtn');
    if (filterBtn) {
      filterBtn.addEventListener('click', function () {
        favFilterActive = !favFilterActive;
        filterBtn.classList.toggle('on', favFilterActive);
        applyFavFilter();
      });
    }

    document.querySelectorAll('.tm-fav-btn').forEach(function (btn) {
      var lid = btn.dataset.fav;
      renderFavBtn(btn, lid);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (favoriteLayers.has(lid)) {
          favoriteLayers.delete(lid);
        } else {
          favoriteLayers.add(lid);
        }
        localStorage.setItem('tm_favorites', JSON.stringify(Array.from(favoriteLayers)));
        renderFavBtn(btn, lid);
        if (favFilterActive) applyFavFilter();
      });
    });
  }

  function renderFavBtn(btn, lid) {
    var on = favoriteLayers.has(lid);
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"'
      + ' fill="' + (on ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"'
      + ' stroke-linecap="round" stroke-linejoin="round">'
      + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    btn.style.color = on ? 'var(--status-warning)' : 'var(--fg-disabled)';
  }

  function applyFavFilter() {
    document.querySelectorAll('.tm-layer-item').forEach(function (item) {
      var favBtn = item.querySelector('.tm-fav-btn');
      if (!favBtn) return;
      var lid = favBtn.dataset.fav;
      if (favFilterActive) {
        item.style.display = favoriteLayers.has(lid) ? '' : 'none';
      } else {
        item.style.display = '';
      }
    });
    document.querySelectorAll('.tm-cat').forEach(function (cat) {
      if (!favFilterActive) { cat.style.display = ''; return; }
      var visible = Array.from(cat.querySelectorAll('.tm-layer-item')).some(function (el) {
        return el.style.display !== 'none';
      });
      cat.style.display = visible ? '' : 'none';
    });
  }

  /* ════════════════════════════════════════════════════════
     원천 데이터 모달
  ════════════════════════════════════════════════════════ */
  var _srcPin = null;

  function initSrcModal() {
    var scrim = document.getElementById('tmSrcModalScrim');
    var closeBtn = document.getElementById('tmSrcClose');
    var closeFt = document.getElementById('tmSrcCloseBtn');
    var csvBtn  = document.getElementById('tmSrcCsvBtn');
    if (scrim)   scrim.addEventListener('click', closeSrcModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSrcModal);
    if (closeFt)  closeFt.addEventListener('click', closeSrcModal);
    if (csvBtn)   csvBtn.addEventListener('click', function () {
      if (_srcPin) exportLayerCsv(_srcPin);
    });
  }

  function openSrcModal(cfg, pin) {
    _srcPin = pin || null;
    var titleEl    = document.getElementById('tmSrcTitle');
    var subtitleEl = document.getElementById('tmSrcSubtitle');
    var bodyEl     = document.getElementById('tmSrcBody');
    if (!titleEl) return;

    titleEl.textContent    = (cfg.label || '주제도') + ' 원천 데이터';
    subtitleEl.textContent = cfg.field + ' · ' + (cfg.source || '-');

    var SCHEMA_MAP = {
      'pop-dong':      [['행정동코드','TEXT'],['행정동명','TEXT'],['총인구','INTEGER'],['세대수','INTEGER'],['갱신일','DATE']],
      'pop-float':     [['행정동코드','TEXT'],['유동인구수','INTEGER'],['밀도지수','FLOAT'],['피크시간대','TEXT'],['기준일','DATE']],
      'trans-bus':     [['정류장ID','TEXT'],['정류장명','TEXT'],['노선수','INTEGER'],['일평균이용객','INTEGER'],['배차간격','TEXT']],
      'trans-ev':      [['충전소ID','TEXT'],['충전소명','TEXT'],['충전기수','INTEGER'],['가용충전기','INTEGER'],['이용률','FLOAT']],
      'trans-bike':    [['스테이션ID','TEXT'],['스테이션명','TEXT'],['거치대수','INTEGER'],['이용가능','INTEGER'],['이용률','FLOAT']],
      'safe-cctv':     [['구역ID','TEXT'],['구역명','TEXT'],['설치대수','INTEGER'],['최근점검일','DATE'],['운영상태','TEXT']],
      'env-air':       [['측정소ID','TEXT'],['측정소명','TEXT'],['PM2_5','FLOAT'],['PM10','FLOAT'],['AQI등급','TEXT']],
      'energy-solar':  [['설비ID','TEXT'],['설비명','TEXT'],['발전용량_kW','FLOAT'],['월발전량_MWh','FLOAT'],['가동률','FLOAT']],
      'carbon-est':    [['행정동코드','TEXT'],['행정동명','TEXT'],['탄소배출량_tCO2','FLOAT'],['전년대비','FLOAT'],['주에너지원','TEXT']],
      'carbon-sink':   [['흡수원ID','TEXT'],['흡수원명','TEXT'],['흡수율_tCO2','FLOAT'],['면적_ha','FLOAT'],['수종','TEXT']],
      'pub-school':    [['학교ID','TEXT'],['학교명','TEXT'],['학교유형','TEXT'],['학생수','INTEGER'],['소재지','TEXT']],
      'pub-hospital':  [['기관ID','TEXT'],['기관명','TEXT'],['병상수','INTEGER'],['전문분야','TEXT'],['소재지','TEXT']],
      'pub-welfare':   [['시설ID','TEXT'],['시설명','TEXT'],['복지유형','TEXT'],['수용인원','INTEGER'],['소재지','TEXT']]
    };

    var lid = pin ? pin.layer : '';
    var schema = SCHEMA_MAP[lid] || [['컬럼명','타입'],['데이터값','TEXT']];
    var apiUrl = '/api/v1/layers/' + (lid || 'unknown');

    bodyEl.innerHTML = '<div style="margin-bottom:12px;">'
      + '<p style="font:600 12px/1 var(--font-sans);color:var(--fg-3);margin:0 0 6px;">API 엔드포인트</p>'
      + '<code style="display:block;background:var(--bg-sunken);border:1px solid var(--border-1);border-radius:6px;padding:8px 10px;font:500 12px/1.5 monospace;color:var(--gp-primary);word-break:break-all;">'
      + apiUrl + '</code>'
      + '</div>'
      + '<div style="margin-bottom:12px;">'
      + '<p style="font:600 12px/1 var(--font-sans);color:var(--fg-3);margin:0 0 6px;">갱신 주기 · ' + (cfg.freq || '-') + '</p>'
      + '</div>'
      + '<p style="font:600 12px/1 var(--font-sans);color:var(--fg-3);margin:0 0 6px;">데이터 스키마</p>'
      + '<table style="width:100%;border-collapse:collapse;font:400 12px/1.4 var(--font-sans);">'
      + '<thead><tr style="background:var(--surface-inset);">'
      + '<th style="padding:7px 10px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">컬럼명</th>'
      + '<th style="padding:7px 10px;text-align:left;font-weight:600;color:var(--fg-3);border-bottom:1px solid var(--border-1);">타입</th>'
      + '</tr></thead><tbody>'
      + schema.map(function (row, i) {
          return '<tr style="background:' + (i % 2 === 0 ? '#fff' : 'var(--bg-subtle)') + ';">'
            + '<td style="padding:7px 10px;color:var(--fg-1);font-weight:500;border-bottom:1px solid var(--border-2);">' + row[0] + '</td>'
            + '<td style="padding:7px 10px;color:var(--fg-4);font-family:monospace;border-bottom:1px solid var(--border-2);">' + row[1] + '</td>'
            + '</tr>';
        }).join('')
      + '</tbody></table>';

    document.getElementById('tmSrcModal').classList.add('open');
  }

  function closeSrcModal() {
    var m = document.getElementById('tmSrcModal');
    if (m) m.classList.remove('open');
  }

  /* ════════════════════════════════════════════════════════
     CSV 내보내기
  ════════════════════════════════════════════════════════ */
  function exportLayerCsv(pin) {
    var cfg  = LAYER_CFG[pin.layer] || {};
    var pins = ALL_PINS.filter(function (p) { return p.layer === pin.layer; });
    if (!pins.length) return;

    var keys = Object.keys(pins[0].data || {});
    var header = ['id', 'name', 'lat', 'lng'].concat(keys).join(',');
    var rows = pins.map(function (p) {
      var base = [p.id, '"' + p.name + '"', p.lat, p.lng];
      var extra = keys.map(function (k) {
        var v = (p.data || {})[k];
        return (v === undefined || v === null) ? '' : (typeof v === 'string' ? '"' + v.replace(/"/g, '""') + '"' : v);
      });
      return base.concat(extra).join(',');
    });

    var csv = '﻿' + header + '\n' + rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = '광명_' + (cfg.label || pin.layer) + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openDrawer(pin) {
    if (!pin) return;
    var cfg = LAYER_CFG[pin.layer] || {};
    var d   = pin.data || {};

    document.getElementById('drSubject').textContent     = pin.name + ' ' + cfg.label;
    document.getElementById('drField').textContent       = cfg.field || '-';
    document.getElementById('drSpatialUnit').textContent = cfg.spatial || '-';
    document.getElementById('drVisType').textContent     = cfg.vis || '-';
    document.getElementById('drDataBase').textContent    = '2026.05';
    document.getElementById('drRegion').textContent      = '광명시 전체';
    document.getElementById('drFreq').textContent        = cfg.freq || '-';
    document.getElementById('drSource').textContent      = cfg.source || '-';

    /* pop-dong 전용 KPI */
    if (pin.layer === 'pop-dong') {
      document.getElementById('drTotalPop').textContent  = (d.total || 0).toLocaleString();
      document.getElementById('drFloatIdx').textContent  = d.float || '-';
      document.getElementById('drCarbonIdx').textContent = d.carbon || '-';
      var prevColor = d.prev >= 0 ? 'var(--status-danger)' : 'var(--status-info)';
      var prevEl = document.getElementById('drPrevMonth');
      prevEl.textContent = (d.prev >= 0 ? '+' : '') + d.prev + '%';
      prevEl.style.color = prevColor;
      var trendEl = document.getElementById('drPrevTrend');
      trendEl.className = 'tm-kpi-card__trend ' + (d.prev >= 0 ? 'tm-kpi-card__trend--up' : 'tm-kpi-card__trend--down');
      trendEl.textContent = d.prev >= 0 ? '▲ 증가' : '▼ 감소';
      document.getElementById('drResidentPop').textContent = (d.resident  || 0).toLocaleString() + '명';
      document.getElementById('drHousehold').textContent   = (d.household || 0).toLocaleString() + '세대';
    }

    document.getElementById('tmDrawer').classList.add('open');
    if (window.lucide) lucide.createIcons();
  }

  function closeDrawer() {
    document.getElementById('tmDrawer').classList.remove('open');
  }

  function nowStr() {
    var d = new Date(), p = function(n) { return String(n).padStart(2,'0'); };
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#refreshBtn')) return;
    var el = document.getElementById('updTime');
    if (el) el.textContent = nowStr();
  });

  window.tmPage = { closePopup: closePopup, closeDrawer: closeDrawer };

  init();
})();
