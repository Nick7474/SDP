import { useState } from 'react';
import { 
  Bus, 
  Bike, 
  TreeDeciduous, 
  ArrowRight,
  ChevronRight,
  Sun,
  Activity,
  Flame,
  ArrowUp
} from 'lucide-react';

interface MileDataMapProps {
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  onShowToast: (msg: string) => void;
}

export default function MileDataMap({ activeTab, onTabChange, onShowToast }: MileDataMapProps) {
  
  const [activeNoticeTab, setActiveNoticeTab] = useState<'city' | 'notice'>('city');

  const getMileColor = (mile: 'energy' | 'mobility' | 'safety' | 'data') => {
    switch (mile) {
      case 'energy': return '#1587E1';
      case 'mobility': return '#1AAA5E';
      case 'safety': return '#ED8B16';
      case 'data': return '#6E74D6';
    }
  };

  const getMileLabel = (mile: 'energy' | 'mobility' | 'safety' | 'data') => {
    switch (mile) {
      case 'energy': return '에너지 마일';
      case 'mobility': return '모빌리티 마일';
      case 'safety': return '세이프티 마일';
      case 'data': return '데이터 마일';
    }
  };

  const handleMileChange = (mile: 'energy' | 'mobility' | 'safety' | 'data') => {
    onTabChange(mile);
    onShowToast(`'${getMileLabel(mile)}' 보드가 활성화되었습니다.`);
  };

  return (
    <div 
      className="w-full relative overflow-hidden select-none bg-cover bg-no-repeat bg-center" 
      style={{ 
        backgroundImage: "url('/images/datamap_bg.png')", 
        height: '920px' 
      }}
    >
      {/* Title Block (Top Left) - relative to outer 1920px container */}
      <div 
        className="absolute z-20 font-score" 
        style={{ 
          top: '30px', 
          left: '644px',
          fontFamily: "'S-CoreDream', sans-serif"
        }}
      >
        <span 
          className="block mb-1" 
          style={{ 
            fontSize: '17px', 
            fontWeight: 500, 
            color: '#044E9E' 
          }}
        >
          데이터로 보는 광명시 도시현황
        </span>
        <h2 
          className="leading-tight"
          style={{ 
            fontSize: '36px', 
            fontWeight: 800,
            letterSpacing: '-0.04em'
          }}
        >
          <span style={{ color: '#0C8AE5' }}>광명시</span>{' '}
          <span style={{ color: '#083891' }}>데이터 지도</span>
        </h2>
      </div>

      {/* Floating Vertical 4 Miles Toggle Control Group - relative to outer 1920px container */}
      <div 
        className="absolute z-20 flex flex-col gap-0 items-end"
        style={{ 
          right: '628px', 
          top: '44px', 
          width: '180px' 
        }}
      >
        {/* Connecting Line — centered on the 60px button icon (right: 30px = half of 60px) */}
        <div 
          className="absolute w-[1.5px] bg-[#E2E8F0]" 
          style={{ 
            right: '30px', 
            top: '30px', 
            bottom: '30px', 
            zIndex: 10 
          }} 
        />

        {[
          { id: 'energy', label: '에너지 마일', on: '/icons/btn_energymile_on.svg', off: '/icons/btn_energymile_off.svg' },
          { id: 'mobility', label: '모빌리티 마일', on: '/icons/btn_mobilitymile_on.svg', off: '/icons/btn_mobilitymile_off.svg' },
          { id: 'safety', label: '세이프티 마일', on: '/icons/btn_safetymile_on.svg', off: '/icons/btn_safetymile_off.svg' },
          { id: 'data', label: '데이터 마일', on: '/icons/btn_datamile_on.svg', off: '/icons/btn_datamile_off.svg' }
        ].map((mile) => {
          const isSelected = activeTab === mile.id;
          return (
            <button
              key={mile.id}
              onClick={() => handleMileChange(mile.id as any)}
              className="relative flex items-center justify-end gap-[4px] cursor-pointer focus:outline-none group z-20"
              style={{ height: '60px', width: '100%' }}
            >
              {/* Label Text */}
              <span 
                className="font-pretendard-gov transition-all"
                style={{
                  fontSize: '14px',
                  fontWeight: isSelected ? '700' : '400',
                  color: isSelected ? '#16243B' : '#7C8896'
                }}
              >
                {mile.label}
              </span>
              
              {/* Button Image */}
              <img 
                src={isSelected ? mile.on : mile.off} 
                alt="" 
                className="object-contain group-hover:scale-105 transition-transform shrink-0" 
                style={{ 
                  width: '60px', 
                  height: '60px'
                }}
              />
            </button>
          );
        })}
      </div>


      <div className="max-w-[1440px] mx-auto h-full px-0 relative flex items-start justify-between">

        {/* LEFT COLUMN (4 Cards, width 380px, height 200px, gap 16px) */}
        <div className="w-[380px] flex flex-col gap-[16px] z-10 mt-[30px]">
          
          {/* Card 1: 광명시 주요 도시지표 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 주요 도시지표</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            
            <div className="flex items-center justify-between mt-3 flex-1 pb-1">
              {/* Left Column: Bar Chart with Legend */}
              <div className="flex-1 flex flex-col justify-between h-[116px] pr-3">
                {/* Chart Grid & Bars */}
                <div className="relative h-[82px] w-full flex items-end justify-between px-1.5">
                  {/* Dashed Gridlines */}
                  <div className="absolute inset-x-0 bottom-0 h-0 border-b border-dashed border-[#E2E8F0] z-0" />
                  <div className="absolute inset-x-0 bottom-[27px] h-0 border-b border-dashed border-[#E2E8F0] z-0" />
                  <div className="absolute inset-x-0 bottom-[54px] h-0 border-b border-dashed border-[#E2E8F0] z-0" />
                  <div className="absolute inset-x-0 bottom-[82px] h-0 border-b border-dashed border-[#E2E8F0] z-0" />
                  
                  {[
                    { name: '태양광', prod: 18, accum: 26 },
                    { name: '풍력', prod: 54, accum: 60 },
                    { name: '지열', prod: 90, accum: 60 },
                    { name: '바이오', prod: 72, accum: 42 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                      <div className="flex items-end gap-0.5 h-[60px]">
                        {/* 당월 생산 (Orange/Yellow Bar) */}
                        <div 
                          className="w-[8px] bg-[#FFB114] rounded-t-[4px] transition-all duration-1000" 
                          style={{ height: `${item.prod}%` }}
                        />
                        {/* 당월 누적 (Blue Bar) */}
                        <div 
                          className="w-[8px] bg-[#0B50D0] rounded-t-[4px] transition-all duration-1000" 
                          style={{ height: `${item.accum}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-medium text-[#36445A] leading-none">{item.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Chart Legend */}
                <div className="flex items-center justify-center gap-3 text-[13px] text-[#36445A] font-medium leading-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFB114] shrink-0" />
                    <span>당월 생산</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0B50D0] shrink-0" />
                    <span>당월 누적</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Values Sub-box */}
              <div className="w-[118px] h-[116px] bg-[#F0F3F8] rounded-[12px] py-[2px] px-[12px] flex flex-col justify-center shrink-0">
                <div>
                  <span className="text-[14px] font-normal text-[#36445A] block leading-none mb-[8px]">금일 생산량</span>
                  <span className="text-[18px] font-bold text-[#EC8913] font-pretendard-gov block leading-none">
                    11.88 <span className="text-[13px] font-normal">kWh</span>
                  </span>
                </div>
                <div className="border-t border-[#D2DAE6] my-2" />
                <div>
                  <span className="text-[14px] font-normal text-[#36445A] block leading-none mb-[8px]">당월 누적</span>
                  <span className="text-[18px] font-bold text-[#0B50D0] font-pretendard-gov block leading-none">
                    56.00 <span className="text-[13px] font-normal">kWh</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 생활·교통 현황 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">생활·교통 현황</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 flex-1 pb-1">
              {/* 친환경 EV-DRT 버스 */}
              <div className="bg-[#E7F4FE] rounded-[16px] p-3 flex flex-col justify-between h-[116px]">
                <span className="text-[14px] font-medium text-[#36445A] block leading-none">친환경 EV-DRT 버스</span>
                <div className="flex items-end justify-between mt-1">
                  <img 
                    src="/images/img_bus_02.png" 
                    alt="친환경 EV-DRT 버스" 
                    style={{ width: '77px', height: '61px' }}
                    className="object-contain"
                  />
                  <div className="text-right">
                    <span className="text-[32px] font-bold text-[#16243B] font-pretendard-gov leading-none block">
                      23<span className="text-[14px] font-normal ml-0.5">대</span>
                    </span>
                    <span className="block text-[14px] font-normal text-[#5A6878] mt-1 leading-none">운행중</span>
                  </div>
                </div>
              </div>

              {/* 공공자전거 이용률 */}
              <div className="bg-[#ECF2FE] rounded-[16px] p-3 flex flex-col justify-between h-[116px]">
                <span className="text-[14px] font-medium text-[#36445A] block leading-none">공공자전거 이용률</span>
                <div className="flex items-end justify-between mt-1">
                  <img 
                    src="/images/img_bicycle_02.png" 
                    alt="공공자전거 이용률" 
                    style={{ width: '64px', height: '58px' }}
                    className="object-contain"
                  />
                  <div className="text-right">
                    <span className="text-[32px] font-bold text-[#16243B] font-pretendard-gov leading-none block">
                      0.8<span className="text-[14px] font-normal ml-0.5">%</span>
                    </span>
                    <span className="block text-[14px] font-normal text-[#5A6878] mt-1 leading-none">전일 대비</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 환경·안전 지표 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">환경·안전 지표</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex justify-between items-center mt-3 flex-1 pb-1">
              {[
                { 
                  label: '초미세먼지', 
                  sub: '(PM2.5)', 
                  status: '보통', 
                  value: '16', 
                  unit: 'µg/m³', 
                  trackColor: '#BECBFF', 
                  arcColor: '#4064FF', 
                  statusColor: '#4064FF',
                  progress: 0.30 
                },
                { 
                  label: '미세먼지', 
                  sub: '(PM10)', 
                  status: '좋음', 
                  value: '23', 
                  unit: 'µg/m³', 
                  trackColor: '#86C5F2', 
                  arcColor: '#0C8AE5', 
                  statusColor: '#0C8AE5',
                  progress: 0.40 
                },
                { 
                  label: '오존', 
                  sub: '(O3)', 
                  status: '보통', 
                  value: '0.054', 
                  unit: 'ppm', 
                  trackColor: '#E1DAB2', 
                  arcColor: '#C4B65D', 
                  statusColor: '#917B26',
                  progress: 0.33 
                }
              ].map((ind, idx) => {
                const radius = 31;
                const strokeWidth = 8;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference * (1 - ind.progress);
                
                return (
                  <div key={idx} className="flex flex-col items-center text-center w-[110px]">
                    <div className="relative w-[70px] h-[70px] mb-2 hover:scale-105 transition-transform duration-200 gp-pin-in">
                      <svg width="70" height="70" viewBox="0 0 70 70" className="w-full h-full transform -rotate-90">
                        <circle 
                          cx="35" 
                          cy="35" 
                          r={radius} 
                          fill="transparent" 
                          stroke={ind.trackColor} 
                          strokeWidth={strokeWidth} 
                        />
                        <circle 
                          cx="35" 
                          cy="35" 
                          r={radius} 
                          fill="transparent" 
                          stroke={ind.arcColor} 
                          strokeWidth={strokeWidth} 
                          strokeDasharray={circumference} 
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="butt"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[16px] font-bold text-[#212529] font-pretendard-gov leading-none">
                          {ind.value}
                        </span>
                        <span className="text-[10px] font-medium text-[#7C8896] mt-0.5 leading-none">
                          {ind.unit}
                        </span>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-[#212529] leading-tight block">
                      {ind.label}
                    </span>
                    <span className="text-[13px] font-normal text-[#495057] leading-tight block">
                      {ind.sub}
                    </span>
                    <span 
                      className="text-[13px] font-bold leading-tight block mt-0.5"
                      style={{ color: ind.statusColor }}
                    >
                      {ind.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: 인기 도시 데이터 TOP 5 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">인기 도시 데이터 TOP 5</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex flex-col gap-1.5 mt-[4px] flex-1 justify-center">
              {[
                { rank: 1, type: '교통', name: '전기차충전소 현황', val: '1,652', badgeClass: 'gp-badge--success' },
                { rank: 2, type: '환경', name: '대기오염 측정정보', val: '231', badgeClass: 'gp-badge--warning' },
                { rank: 3, type: '교통', name: '공영주차장 현황', val: '204', badgeClass: 'gp-badge--success' },
                { rank: 4, type: '에너지', name: '공공건물 태양광발전시설', val: '225', badgeClass: 'gp-badge--info' },
                { rank: 5, type: '행정', name: '주민등록인구 통계', val: '198', badgeClass: 'gp-badge--info' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[14px] font-pretendard-gov">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-[#16243B] w-[18px]">{item.rank}.</span>
                    <span className={`gp-badge ${item.badgeClass} shrink-0`}>
                      {item.type}
                    </span>
                    <span className="font-medium text-[#36445A] truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#16243B] shrink-0 pl-2">
                    {item.val}<span className="font-normal">건</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN (Map, width 508px, height 755px) */}
        <div className="w-[508px] h-[755px] relative shrink-0 self-start mt-[120px] gp-pin-stage">
          {/* Central Map Image */}
          <img 
            src="/images/datamap.png" 
            alt="광명시 데이터 지도" 
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Map Overlay Markers */}
          {activeTab === 'data' && (
            <>
              {/* Network Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path 
                  d="M175 100 L320 150 L100 310 Z M175 100 L100 310 L205 500 L330 380 L320 150 Z M100 310 L120 460 L205 500 M320 150 L205 500 M100 310 L330 380 M320 150 L205 500" 
                  stroke="#6B62CA" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.6"
                />
              </svg>

              {/* 이노베이션센터 Pin */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '150px', top: '60px' }}>
                <img src="/icons/pin_datamile.png" alt="이노베이션센터" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>이노베이션센터</span>
              </div>

              {/* 통합플랫폼 Pin */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '180px', top: '470px' }}>
                <img src="/icons/pin_datamile.png" alt="통합플랫폼" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>통합플랫폼</span>
              </div>

              {/* 데이터 연계 Bubble */}
              <div className="absolute flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-[#6B62CA] border-[1.5px] border-white shadow-[0_0_20px_rgba(107,98,202,0.8)] text-white z-10 gp-mappin gp-pin-in" style={{ left: '275px', top: '105px' }}>
                <span className="text-[11px] font-medium leading-none mb-1">데이터 연계</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[22px] font-bold leading-none font-pretendard-gov">32</span>
                  <span className="text-[11px] font-medium leading-none">건</span>
                </div>
              </div>

              {/* API Bubble */}
              <div className="absolute flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-[#6B62CA] border-[1.5px] border-white shadow-[0_0_20px_rgba(107,98,202,0.8)] text-white z-10 gp-mappin gp-pin-in" style={{ left: '60px', top: '265px' }}>
                <span className="text-[11px] font-medium leading-none mb-1">API</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[22px] font-bold leading-none font-pretendard-gov">8</span>
                  <span className="text-[11px] font-medium leading-none">종</span>
                </div>
              </div>

              {/* 수집데이터 Bubble */}
              <div className="absolute flex flex-col items-center justify-center w-[84px] h-[84px] rounded-full bg-[#6B62CA] border-[1.5px] border-white shadow-[0_0_20px_rgba(107,98,202,0.8)] text-white z-10 gp-mappin gp-pin-in" style={{ left: '290px', top: '340px' }}>
                <span className="text-[11px] font-medium leading-none mb-1">수집데이터</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[22px] font-bold leading-none font-pretendard-gov">128</span>
                  <span className="text-[11px] font-medium leading-none">건</span>
                </div>
              </div>

              {/* MRV Bubble */}
              <div className="absolute flex flex-col items-center justify-center w-[74px] h-[74px] rounded-full bg-[#6B62CA] border-[1.5px] border-white shadow-[0_0_20px_rgba(107,98,202,0.8)] text-white z-10 gp-mappin gp-pin-in" style={{ left: '75px', top: '425px' }}>
                <span className="text-[11px] font-medium leading-none mb-1">MRV</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[20px] font-bold leading-none font-pretendard-gov">12</span>
                  <span className="text-[11px] font-medium leading-none">건</span>
                </div>
              </div>

              {/* Tooltip for 데이터 통합 플랫폼 */}
              <div 
                className="absolute bg-white border border-[#E6E8EA] rounded-[8px] shadow-xl p-3.5 z-20 pointer-events-auto"
                style={{ 
                  left: '340px', 
                  top: '110px', 
                  width: '185px',
                  boxShadow: '0 10px 25px rgba(22, 36, 59, 0.15)'
                }}
              >
                <h4 className="font-pretendard-gov font-bold text-[13px] text-[#234178] leading-tight pb-1 mb-1.5 border-b border-[#E6E8EA]">
                  데이터 통합 플랫폼
                </h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>데이터 연계</span>
                    <span className="font-bold text-[#6B62CA] font-pretendard-gov text-[13px]">32 <span className="font-normal text-[13px] text-[#36445A]">건</span></span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>API</span>
                    <span className="font-bold text-[#6B62CA] font-pretendard-gov text-[13px]">8 <span className="font-normal text-[13px] text-[#36445A]">종</span></span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'energy' && (
            <>
              {/* Blue Pin 18 */}
              <div 
                className="absolute cursor-pointer group flex items-center justify-center gp-pin-in"
                style={{ left: '160px', top: '100px', width: '32px', height: '32px' }}
                onClick={() => onShowToast("서광명 지역 데이터 현황입니다.")}
              >
                <div className="w-8 h-8 rounded-full bg-[#1587E1] text-white font-bold text-[13px] flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200">
                  18
                </div>
              </div>

              {/* Blue Pin 21 */}
              <div 
                className="absolute cursor-pointer group flex items-center justify-center z-10 gp-pin-in"
                style={{ left: '200px', top: '135px', width: '32px', height: '32px' }}
                onClick={() => onShowToast("광명 사거리 및 광명동 핵심 연계지입니다.")}
              >
                <div className="w-8 h-8 rounded-full bg-[#1587E1] text-white font-bold text-[13px] flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200">
                  21
                </div>
              </div>

              {/* Blue Pin 16 */}
              <div 
                className="absolute cursor-pointer group flex items-center justify-center gp-pin-in"
                style={{ left: '275px', top: '105px', width: '32px', height: '32px' }}
                onClick={() => onShowToast("철산 지역 공공 데이터 현황입니다.")}
              >
                <div className="w-8 h-8 rounded-full bg-[#1587E1] text-white font-bold text-[13px] flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200">
                  16
                </div>
              </div>

              {/* Blue Pin 12 */}
              <div 
                className="absolute cursor-pointer group flex items-center justify-center gp-pin-in"
                style={{ left: '340px', top: '95px', width: '32px', height: '32px' }}
                onClick={() => onShowToast("하안 지역 그린 데이터 연계지입니다.")}
              >
                <div className="w-8 h-8 rounded-full bg-[#1587E1] text-white font-bold text-[13px] flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200">
                  12
                </div>
              </div>

              {/* Blue Circle 350 MWh (Center Upper) */}
              <div 
                className="absolute cursor-pointer w-[76px] h-[76px] rounded-full bg-[#1587E1]/95 backdrop-blur-sm border-2 border-white shadow-lg flex flex-col items-center justify-center text-white hover:scale-105 transition-transform duration-200 gp-pin-in z-10"
                style={{ left: '215px', top: '175px' }}
                onClick={() => onShowToast("광명동 지구 태양광 누적 발전량은 350 MWh 입니다.")}
              >
                <span className="text-[17px] font-bold leading-none font-pretendard-gov">350</span>
                <span className="text-[9px] font-medium tracking-wide mt-0.5 leading-none">MWh</span>
              </div>

              {/* Blue Circle 350 MWh (Lower Left) */}
              <div 
                className="absolute cursor-pointer w-[76px] h-[76px] rounded-full bg-[#1587E1]/95 backdrop-blur-sm border-2 border-white shadow-lg flex flex-col items-center justify-center text-white hover:scale-105 transition-transform duration-200 gp-pin-in"
                style={{ left: '175px', top: '535px' }}
                onClick={() => onShowToast("가학동 태양광 발전단지 누적 발전량은 350 MWh 입니다.")}
              >
                <span className="text-[17px] font-bold leading-none font-pretendard-gov">350</span>
                <span className="text-[9px] font-medium tracking-wide mt-0.5 leading-none">MWh</span>
              </div>

              {/* Blue Circle 440 MWh (Lower Right) */}
              <div 
                className="absolute cursor-pointer w-[96px] h-[96px] rounded-full bg-[#1587E1]/95 backdrop-blur-sm border-2 border-white shadow-lg flex flex-col items-center justify-center text-white hover:scale-105 transition-transform duration-200 gp-pin-in"
                style={{ left: '305px', top: '480px' }}
                onClick={() => onShowToast("소하/일직동 태양광 누적 발전량은 440 MWh 입니다.")}
              >
                <span className="text-[22px] font-bold leading-none font-pretendard-gov">440</span>
                <span className="text-[10px] font-semibold tracking-wider mt-0.5 leading-none">MWh</span>
              </div>

              {/* Energy Marker */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '265px', top: '210px' }}>
                <img src="/icons/pin_energymile.png" alt="에너지 마커" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
              </div>

              {/* Tooltip Popover */}
              <div 
                className="absolute bg-white border border-[#E6E8EA] rounded-[8px] shadow-xl p-3.5 z-20 pointer-events-auto"
                style={{ 
                  left: '305px', 
                  top: '160px', 
                  width: '185px',
                  boxShadow: '0 10px 25px rgba(22, 36, 59, 0.15)'
                }}
              >
                <h4 className="font-pretendard-gov font-bold text-[13px] text-[#234178] leading-tight pb-1 mb-1.5 border-b border-[#E6E8EA]">
                  신재생 에너지 자원 발전소
                </h4>
                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>현재출력</span>
                    <span className="font-bold text-[#1587E1] font-pretendard-gov text-[13px]">168 <span className="font-normal text-[13px] text-[#36445A]">kW</span></span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>누적발전량</span>
                    <span className="font-bold text-[#0B50A0] font-pretendard-gov text-[13px]">1,248 <span className="font-normal text-[13px] text-[#36445A]">MWh</span></span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'mobility' && (
            <>
              {/* Dashed Routes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path 
                  d="M 260 85 L 170 230 L 230 380 M 232 412 L 235 440 L 140 510 L 280 560 L 400 400 L 235 440" 
                  fill="none" stroke="#21B465" strokeWidth="2" strokeDasharray="4 4" 
                />
                <path
                  d="M 260 85 L 230 380"
                  fill="none" stroke="#21B465" strokeWidth="2" strokeDasharray="4 4" 
                />
              </svg>

              {/* G-SMART HUB */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '40px', top: '100px' }}>
                <div className="w-[6px] h-[6px] bg-[#1587E1] rounded-full mb-1"></div>
                <span className="text-[13px] font-normal text-[#15347B] leading-none whitespace-nowrap">G-SMART HUB</span>
              </div>

              {/* 1번 정류점 */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '242px', top: '65px' }}>
                <img src="/icons/pin_mobilitymile.png" alt="1번 정류점" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>1번 정류점</span>
                <span className="mt-0.5 text-[10px] font-medium text-[#7C8896] leading-none whitespace-nowrap">(운영거점)</span>
              </div>

              {/* Tooltip for 1번 정류점 */}
              <div 
                className="absolute bg-white border border-[#E6E8EA] rounded-[8px] shadow-xl p-3.5 z-20 pointer-events-auto"
                style={{ 
                  left: '286px', 
                  top: '55px', 
                  width: '185px',
                  boxShadow: '0 10px 25px rgba(22, 36, 59, 0.15)'
                }}
              >
                <h4 className="font-pretendard-gov font-bold text-[13px] text-[#234178] leading-tight pb-1 mb-1.5 border-b border-[#E6E8EA]">
                  친환경 DRT 운영 거점
                </h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>운행</span>
                    <span className="font-bold text-[#21B465] font-pretendard-gov text-[13px]">23 <span className="font-normal text-[13px] text-[#36445A]">대</span></span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>전월 대비</span>
                    <span className="font-bold text-[#21B465] font-pretendard-gov text-[13px]">+12.3 <span className="font-normal text-[13px] text-[#36445A]">%</span></span>
                  </div>
                </div>
              </div>

              {/* 2번 정류점 */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '152px', top: '210px' }}>
                <img src="/icons/pin_mobilitymile.png" alt="2번 정류점" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>2번 정류점</span>
              </div>


              {/* 3번 정류점 */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '217px', top: '420px' }}>
                <img src="/icons/pin_mobilitymile.png" alt="3번 정류점" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>3번 정류점</span>
              </div>

              {/* 4번 정류점 */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '122px', top: '490px' }}>
                <img src="/icons/pin_mobilitymile.png" alt="4번 정류점" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>4번 정류점</span>
              </div>

              {/* 5번 정류점 (No icon, just text) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '260px', top: '550px' }}>
                <span className="text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>5번 정류점</span>
              </div>

              {/* 6번 정류점 */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '382px', top: '380px' }}>
                <img src="/icons/pin_mobilitymile.png" alt="6번 정류점" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#1B4426] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>6번 정류점</span>
              </div>
            </>
          )}

          {activeTab === 'safety' && (
            <>

              {/* Safety Marker (안전센서) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '80px', top: '70px' }}>
                <img src="/icons/pin_safetymile.png" alt="안전센서" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>안전센서</span>
              </div>

              {/* 미세먼지 보통 (Top) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '210px', top: '110px' }}>
                <img src="/icons/mk_flood.svg" alt="미세먼지 보통" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>미세먼지 보통</span>
              </div>

              {/* 위험알림 2건 (Top Right) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '330px', top: '60px' }}>
                <img src="/icons/mk_warning.svg" alt="위험알림 2건" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>위험알림 2건</span>
              </div>

              {/* 침수홍수 관제 지점 (Mid Left) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '170px', top: '300px' }}>
                <img src="/icons/mk_overflow.svg" alt="침수홍수 관제 지점" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
              </div>

              {/* Tooltip for 침수홍수 관제 지점 */}
              <div 
                className="absolute bg-white border border-[#E6E8EA] rounded-[8px] shadow-xl p-3.5 z-20 pointer-events-auto"
                style={{ 
                  left: '20px', 
                  top: '290px', 
                  width: '185px',
                  boxShadow: '0 10px 25px rgba(22, 36, 59, 0.15)'
                }}
              >
                <h4 className="font-pretendard-gov font-bold text-[13px] text-[#234178] leading-tight pb-1 mb-1.5 border-b border-[#E6E8EA]">
                  침수홍수 관제 지점
                </h4>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>수위</span>
                    <span className="font-bold text-[#1587E1] font-pretendard-gov text-[13px]">정상</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-normal text-[#36445A]">
                    <span>위험알림</span>
                    <span className="font-bold text-[#1587E1] font-pretendard-gov text-[13px]">0 <span className="font-normal text-[13px] text-[#36445A]">건</span></span>
                  </div>
                </div>
              </div>

              {/* 강우 예측 (Bottom Left) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '140px', top: '400px' }}>
                <img src="/icons/mk_rain.svg" alt="강우 예측" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>강우 예측</span>
              </div>

              {/* 침수 예측 (Very Bottom Left) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '160px', top: '490px' }}>
                <img src="/icons/mk_flood.svg" alt="침수 예측" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>침수 예측</span>
              </div>

              {/* 주의 구역 (Mid Right) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '340px', top: '320px' }}>
                <img src="/icons/mk_warning.svg" alt="주의 구역" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>주의 구역</span>
              </div>

              {/* 주의 구역 (Bottom Right) */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '280px', top: '440px' }}>
                <img src="/icons/mk_warning.svg" alt="주의 구역" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[12px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>주의 구역</span>
              </div>
            </>
          )}

          {/* 광명역 (Train) - 공통 표시 */}
          <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none" style={{ left: '212px', top: '350px' }}>
            <img src="/icons/mk_train.svg" alt="광명역" className="w-[44px] h-[44px] object-contain drop-shadow-md" />
            <span className="mt-1 text-[12px] font-bold text-[#15347B] leading-none whitespace-nowrap">광명역</span>
          </div>

          {/* Floating Switcher has been relocated to outer container */}

        </div>

        {/* RIGHT COLUMN (4 Cards, width 380px, height 200px, gap 16px) */}
        <div className="w-[380px] flex flex-col gap-[16px] z-10 mt-[30px]">
          
          {/* Card 1: 분야별 도시지표 현황 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA] shrink-0">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">분야별 도시지표 현황</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex items-center justify-between flex-1 py-2 gap-2">
              {/* Left: Donut Chart 120×120 with % labels */}
              <div className="relative shrink-0 w-[120px] h-[120px]">
                <svg width="120" height="120" viewBox="0 0 120 120" className="w-full h-full">
                  {/* r=30, strokeWidth=60, circumference=188.50 */}
                  {/* 교통 55%: 103.68 */}
                  <circle cx="60" cy="60" r="30" fill="transparent"
                    stroke="#1AAA5E" strokeWidth="60"
                    strokeDasharray="103.68 84.82"
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                  {/* 에너지 30%: 56.55 */}
                  <circle cx="60" cy="60" r="30" fill="transparent"
                    stroke="#1587E1" strokeWidth="60"
                    strokeDasharray="56.55 131.95"
                    strokeDashoffset="-103.68"
                    transform="rotate(-90 60 60)"
                  />
                  {/* 폐기물 10%: 18.85 */}
                  <circle cx="60" cy="60" r="30" fill="transparent"
                    stroke="#6E74D6" strokeWidth="60"
                    strokeDasharray="18.85 169.65"
                    strokeDashoffset="-160.23"
                    transform="rotate(-90 60 60)"
                  />
                  {/* 기타 5%: 9.42 */}
                  <circle cx="60" cy="60" r="30" fill="transparent"
                    stroke="#ED8B16" strokeWidth="60"
                    strokeDasharray="9.42 179.08"
                    strokeDashoffset="-179.08"
                    transform="rotate(-90 60 60)"
                  />

                  {/* White divider lines between segments */}
                  {/* 0% (Top) */}
                  <line x1="60" y1="60" x2="60" y2="0" stroke="white" strokeWidth="1" />
                  {/* 55% */}
                  <line x1="60" y1="60" x2="41.46" y2="117.06" stroke="white" strokeWidth="1" />
                  {/* 85% */}
                  <line x1="60" y1="60" x2="11.46" y2="24.73" stroke="white" strokeWidth="1" />
                  {/* 95% */}
                  <line x1="60" y1="60" x2="41.46" y2="2.94" stroke="white" strokeWidth="1" />

                  {/* White center hole */}
                  <circle cx="60" cy="60" r="28" fill="white" />

                  {/* % labels — number 600, % regular */}
                  {/* 교통 55% at 99° */}
                  <text x="103" y="71" textAnchor="middle" fill="white" fontFamily="inherit">
                    <tspan fontSize="12" fontWeight="600">55</tspan><tspan fontSize="10" fontWeight="400">%</tspan>
                  </text>
                  {/* 에너지 30% at 252° */}
                  <text x="18" y="78" textAnchor="middle" fill="white" fontFamily="inherit">
                    <tspan fontSize="12" fontWeight="600">30</tspan><tspan fontSize="10" fontWeight="400">%</tspan>
                  </text>
                  {/* 폐기물 10% at 324° */}
                  <text x="34" y="28" textAnchor="middle" fill="white" fontFamily="inherit">
                    <tspan fontSize="12" fontWeight="600">10</tspan><tspan fontSize="10" fontWeight="400">%</tspan>
                  </text>
                  {/* 기타 5% at 351° */}
                  <text x="53" y="21" textAnchor="middle" fill="white" fontFamily="inherit">
                    <tspan fontSize="12" fontWeight="600">5</tspan><tspan fontSize="10" fontWeight="400">%</tspan>
                  </text>
                </svg>
              </div>

              {/* Right: KPI + Legend box */}
              <div className="flex flex-col justify-center gap-[16px] shrink-0 w-[196px]">
                {/* KPI Value */}
                <div className="leading-none w-full pl-1">
                  <span className="text-[24px] font-bold text-[#16243B] font-pretendard-gov">1,245.8</span>
                  <span className="text-[12px] font-normal text-[#7C8896] ml-1.5">tCO₂eq</span>
                </div>
                {/* Legend 2x2 — sub-box style (광명시 주요 도시지표 참고) */}
                <div className="w-full bg-[#F0F3F8] rounded-[12px] p-[12px] grid grid-cols-2 gap-x-4 gap-y-2.5 font-pretendard-gov">
                  {[
                    { color: '#1AAA5E', label: '교통',   value: '55', unit: '%' },
                    { color: '#6E74D6', label: '폐기물', value: '10', unit: '%' },
                    { color: '#1587E1', label: '에너지', value: '30', unit: '%' },
                    { color: '#ED8B16', label: '기타',   value: '5',  unit: '%' },
                  ].map(({ color, label, value, unit }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[12px] font-normal text-[#36445A]">{label}</span>
                      <span className="text-[12px] ml-auto">
                        <span className="font-bold text-[#16243B]">{value}</span>
                        <span className="font-normal text-[#16243B]">{unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Card 2: 광명시 종합 도시지수 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 종합 도시지수</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex items-center justify-between mt-3 flex-1">
              {/* Left: Gauge Chart & Label */}
              <div className="flex flex-col items-center shrink-0 w-[160px] mt-1">
                <div className="relative w-[140px] h-[75px]">
                  <svg width="100%" height="100%" viewBox="0 0 100 55" className="overflow-visible">
                    {/* Background track */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#B1CEFB" strokeWidth="16" />
                    {/* Active track (72%) */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#256EF4" strokeWidth="16" strokeDasharray="125.66" strokeDashoffset="35.18" />
                    {/* White gap at 72% */}
                    <line x1="81" y1="50" x2="99" y2="50" stroke="white" strokeWidth="3" transform="rotate(309.6 50 50)" />
                    {/* Needle Base */}
                    <circle cx="50" cy="50" r="5" fill="#36445A" />
                    {/* Needle Pointer */}
                    <polygon points="50,45 50,55 80,50" fill="#36445A" transform="rotate(309.6 50 50)" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[13px] font-medium text-[#5A6878]">탄소 배출 지수</span>
                  <span className="text-[28px] font-bold text-[#16243B] leading-none">72</span>
                </div>
              </div>

              {/* Right: Data Box */}
              <div className="w-[170px] bg-[#F5F8FC] rounded-[14px] py-[8px] px-[14px] flex flex-col gap-[12px] justify-center shrink-0">
                <div className="flex flex-col mt-1">
                  <span className="text-[12px] text-[#36445A] font-medium">총 배출량</span>
                  <div className="flex items-baseline gap-1 mt-0">
                    <span className="text-[20px] font-bold text-[#16243B] leading-none font-pretendard-gov">239.18</span>
                    <span className="text-[11px] font-medium text-[#16243B]">tCO₂eq</span>
                  </div>
                </div>
                <div className="flex flex-col mb-1">
                  <span className="text-[12px] text-[#36445A] font-medium">목표 대비 저감률</span>
                  <div className="flex items-baseline gap-[8px] mt-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[20px] font-bold text-[#256EF4] leading-none font-pretendard-gov">30.53</span>
                      <span className="text-[14px] font-bold text-[#256EF4]">%</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#E0483D] leading-none">
                      ▲4.8%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 광명시 데이터 알림 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 데이터 알림</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex w-full h-[34px] border border-[#E6E8EA] rounded-full mt-3 overflow-hidden">
              <button 
                onClick={() => setActiveNoticeTab('city')}
                className={`flex-1 text-[14px] font-bold transition-colors ${
                  activeNoticeTab === 'city' ? 'bg-[#1587E1] text-white rounded-full' : 'text-[#36445A] hover:bg-slate-50'
                }`}
              >
                시정 소식
              </button>
              <button 
                onClick={() => setActiveNoticeTab('notice')}
                className={`flex-1 text-[14px] font-bold transition-colors ${
                  activeNoticeTab === 'notice' ? 'bg-[#1587E1] text-white rounded-full' : 'text-[#36445A] hover:bg-slate-50'
                }`}
              >
                공지사항
              </button>
            </div>

            <div className="flex flex-col gap-2.5 mt-2 flex-1">
              {(activeNoticeTab === 'city'
                ? [
                    { title: '광명시, 탄소중립 실천 경제 활성화..', date: '26.03.13' },
                    { title: '2026년 광명 스마트데이터포털 서비스 점검 안내', date: '26.03.13' },
                    { title: '우리 동네 기후에너지 체험관 운영', date: '26.03.13' }
                  ]
                : [
                    { title: '스마트데이터포털 시스템 개선 및 보안 업데이트 조치', date: '26.03.12' },
                    { title: '데이터 수집 장비 정기 점검 안내 (5/20)', date: '26.03.11' },
                    { title: '2026년 광명 스마트데이터포털 서비스 점검에 따른 사이트 중단 안내', date: '26.03.10' }
                  ]
              ).map((notice, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between text-[14px] font-pretendard-gov font-medium cursor-pointer hover:text-[#1587E1] transition-colors"
                  onClick={() => onShowToast(`'${notice.title}' 공지로 이동합니다.`)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#1587E1] shrink-0"></div>
                    <span className="truncate text-[#16243B]">{notice.title}</span>
                  </div>
                  <span className="text-[#5A6878] text-[12px] shrink-0 ml-2 font-normal">{notice.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: 주요 변화 인사이트 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">주요 변화 인사이트</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>

            <div className="flex items-center justify-between mt-3 flex-1">
              {/* Tree illustration and details */}
              <div className="flex items-center gap-[24px]">
                <img src="/icons/ic_tree.svg" alt="Tree" className="w-[30px] h-[40px] shrink-0 object-contain" />
                <div className="min-w-0">
                  <span className="text-[13px] font-medium text-[#5A6878] block leading-none">오늘 광명시가 심은 나무</span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-[32px] font-bold text-[#16243B] font-pretendard-gov leading-none">1,248</span>
                    <span className="text-[16px] font-semibold text-[#16243B] leading-none">그루</span>
                  </div>
                  <span className="text-[12px] font-medium text-[#5A6878] block mt-1.5 leading-none">
                    (실시간 탄소 감축량 <span className="font-bold text-[#16243B]">12.4t</span> 환산)
                  </span>
                </div>
              </div>

              {/* Action button */}
              <button 
                onClick={() => onShowToast("시민 탄소중립 참여하기 행동 캠페인 창으로 이동합니다.")}
                className="gp-btn gp-btn--primary gp-btn--sm shrink-0"
              >
                참여하기<ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom 3 metrics */}
            <div className="pt-2 mt-2 mb-1 flex justify-between items-center px-1">
              {/* Metric 1 */}
              <div className="flex items-center gap-2">
                <img src="/icons/ic_team-fill.svg" alt="Team" className="w-[24px] h-[24px] shrink-0" />
                <div className="flex flex-col justify-center">
                  <span className="text-[13px] font-normal text-[#36445A] leading-tight">참여 의병</span>
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight">4.2만명</span>
                </div>
              </div>
              <div className="w-px h-[24px] bg-[#E4E9F1]"></div>
              {/* Metric 2 */}
              <div className="flex items-center gap-2">
                <img src="/icons/ic_leaf-fill.svg" alt="Leaf" className="w-[24px] h-[24px] shrink-0" />
                <div className="flex flex-col justify-center">
                  <span className="text-[13px] font-normal text-[#36445A] leading-tight">누적 사용량</span>
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight">1.2억 P</span>
                </div>
              </div>
              <div className="w-px h-[24px] bg-[#E4E9F1]"></div>
              {/* Metric 3 */}
              <div className="flex items-center gap-2">
                <img src="/icons/ic_luggage-fill.svg" alt="Luggage" className="w-[24px] h-[24px] shrink-0" />
                <div className="flex flex-col justify-center">
                  <span className="text-[13px] font-normal text-[#36445A] leading-tight">총 감축량</span>
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight">320 t</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
