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
  ArrowUp,
  ArrowDown,
  TrendingUp
} from 'lucide-react';

interface CityDataMapProps {
  onShowToast: (msg: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function CityDataMap({ onShowToast, activeTab: propActiveTab, onTabChange }: CityDataMapProps) {
  const [internalTab, setInternalTab] = useState<string>('population');
  const activeTab = propActiveTab || internalTab;
  
  const [activeNoticeTab, setActiveNoticeTab] = useState<'city' | 'notice'>('city');

  const getMileColor = (mile: string) => {
    switch (mile) {
      case 'energy': return '#1587E1';
      case 'traffic': return '#1AAA5E';
      case 'safety': return '#ED8B16';
      case 'public': return '#6E74D6';
      case 'population': return '#F04C4C';
      case 'climate': return '#00B8D9';
      default: return '#1587E1';
    }
  };

  const getMileLabel = (mile: string) => {
    switch (mile) {
      case 'energy': return '에너지·건물';
      case 'traffic': return '교통·이동';
      case 'safety': return '안전·재난';
      case 'public': return '공공시설';
      case 'population': return '인구·생활';
      case 'climate': return '환경·기후';
      default: return '데이터';
    }
  };

  const handleMileChange = (mile: string) => {
    if (onTabChange) onTabChange(mile);
    else setInternalTab(mile);
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
          { id: 'population', label: '인구·생활', on: '/icons/btn_population_on.svg', off: '/icons/btn_population_off.svg' },
          { id: 'traffic', label: '교통·이동', on: '/icons/btn_traffic_on.svg', off: '/icons/btn_traffic_off.svg' },
          { id: 'climate', label: '환경·기후', on: '/icons/btn_climate_on.svg', off: '/icons/btn_climate_on-3.svg' },
          { id: 'safety', label: '안전·재난', on: '/icons/btn_climate_on-1.svg', off: '/icons/btn_climate_on-2.svg' },
          { id: 'energy', label: '에너지·건물', on: '/icons/btn_energy_on.svg', off: '/icons/btn_energy_off.svg' },
          { id: 'public', label: '공공시설', on: '/icons/btn_public_on.svg', off: '/icons/btn_public_off.svg' }
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
            
            <div className="flex items-center justify-between mt-3 flex-1 pb-3 gap-[8px]">
              {/* 총 인구 */}
              <div className="flex-1 bg-[#F5F8FC] rounded-[12px] py-[12px] flex flex-col items-center justify-center h-full">
                <img src="/icons/ic_community.svg" alt="총 인구" className="w-[36px] h-[36px]" />
                <span className="text-[14px] text-[#36445A] font-normal mt-[8px]">총 인구</span>
                <span className="text-[16px] font-bold text-[#16243B] font-pretendard-gov mt-[4px]">
                  282,927<span className="text-[13px] font-normal ml-[2px]">명</span>
                </span>
              </div>
              
              {/* 세대 수 */}
              <div className="flex-1 bg-[#F5F8FC] rounded-[12px] py-[12px] flex flex-col items-center justify-center h-full">
                <img src="/icons/ic_home.svg" alt="세대 수" className="w-[36px] h-[36px]" />
                <span className="text-[14px] text-[#36445A] font-normal mt-[8px]">세대 수</span>
                <span className="text-[16px] font-bold text-[#16243B] font-pretendard-gov mt-[4px]">
                  124,557<span className="text-[13px] font-normal ml-[2px]">세대</span>
                </span>
              </div>
              
              {/* 행정동 수 */}
              <div className="flex-1 bg-[#F5F8FC] rounded-[12px] py-[12px] flex flex-col items-center justify-center h-full">
                <img src="/icons/ic_building.svg" alt="행정동 수" className="w-[36px] h-[36px]" />
                <span className="text-[14px] text-[#36445A] font-normal mt-[8px]">행정동 수</span>
                <span className="text-[16px] font-bold text-[#16243B] font-pretendard-gov mt-[4px]">
                  18<span className="text-[13px] font-normal ml-[2px]">개동</span>
                </span>
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
                    <div className="relative w-[70px] h-[70px] mb-2 hover:scale-105 transition-transform duration-200">
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
                <span className="mt-1 text-[13px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>이노베이션센터</span>
              </div>

              {/* 통합플랫폼 Pin */}
              <div className="absolute flex flex-col items-center justify-center z-10 gp-mappin gp-pin-in" style={{ left: '180px', top: '470px' }}>
                <img src="/icons/pin_datamile.png" alt="통합플랫폼" className="w-[50px] h-[60px] object-contain drop-shadow-md" />
                <span className="mt-1 text-[13px] font-normal text-[#36445A] leading-none whitespace-nowrap" style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff' }}>통합플랫폼</span>
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
              {/* Energy Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '160px', top: '100px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_building.svg" alt="에너지 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">건물 에너지 사용량</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#12839F] font-pretendard-gov leading-tight">12,450</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">MWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '275px', top: '105px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_building.svg" alt="에너지 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">건물 에너지 사용량</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#12839F] font-pretendard-gov leading-tight">8,920</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">MWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '175px', top: '535px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_building.svg" alt="에너지 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">건물 에너지 사용량</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#12839F] font-pretendard-gov leading-tight">14,100</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">MWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '305px', top: '480px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_building.svg" alt="에너지 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">건물 에너지 사용량</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#12839F] font-pretendard-gov leading-tight">10,540</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">MWh</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'population' && (
            <>
              {/* Population Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '180px', top: '150px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_population.svg" alt="인구 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">인구</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#1587E1] font-pretendard-gov leading-tight">24,380</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Population Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '260px', top: '320px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_population.svg" alt="인구 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">인구</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#1587E1] font-pretendard-gov leading-tight">18,452</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Population Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '140px', top: '480px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_population.svg" alt="인구 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">인구</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#1587E1] font-pretendard-gov leading-tight">31,029</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Population Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '320px', top: '540px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_population.svg" alt="인구 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">인구</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#1587E1] font-pretendard-gov leading-tight">12,890</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">명</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'traffic' && (
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

              {/* Mobility Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '240px', top: '65px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_traffic.svg" alt="교통 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">대중교통 이용</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#21B465] font-pretendard-gov leading-tight">345,276</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">건/일</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobility Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '150px', top: '210px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_traffic.svg" alt="교통 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">대중교통 이용</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#21B465] font-pretendard-gov leading-tight">284,102</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">건/일</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobility Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '215px', top: '420px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_traffic.svg" alt="교통 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">대중교통 이용</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#21B465] font-pretendard-gov leading-tight">412,890</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">건/일</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobility Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '380px', top: '380px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_traffic.svg" alt="교통 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">대중교통 이용</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#21B465] font-pretendard-gov leading-tight">156,720</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">건/일</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'safety' && (
            <>
              {/* Safety Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '80px', top: '70px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate.svg" alt="안전 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">생활안전지수</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#EC8913] font-pretendard-gov leading-tight">83</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '210px', top: '110px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate.svg" alt="안전 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">생활안전지수</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#EC8913] font-pretendard-gov leading-tight">85</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '170px', top: '300px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate.svg" alt="안전 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">생활안전지수</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#EC8913] font-pretendard-gov leading-tight">88</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '340px', top: '320px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate.svg" alt="안전 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">생활안전지수</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#EC8913] font-pretendard-gov leading-tight">81</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'climate' && (
            <>
              {/* Climate Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '120px', top: '160px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate-1.svg" alt="기후 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">녹지 면적</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#0C8AE5] font-pretendard-gov leading-tight">125.6</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">ha</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Climate Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '280px', top: '300px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate-1.svg" alt="기후 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">녹지 면적</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#0C8AE5] font-pretendard-gov leading-tight">112.4</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">ha</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Climate Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '180px', top: '480px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate-1.svg" alt="기후 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">녹지 면적</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#0C8AE5] font-pretendard-gov leading-tight">134.2</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">ha</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Climate Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '360px', top: '520px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_climate-1.svg" alt="기후 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">녹지 면적</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#0C8AE5] font-pretendard-gov leading-tight">108.9</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">ha</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'public' && (
            <>
              {/* Public Pin 1 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '120px', top: '160px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_public.svg" alt="공공 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">공공시설</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#855FDF] font-pretendard-gov leading-tight">156</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">개소</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Pin 2 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '280px', top: '300px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_public.svg" alt="공공 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">공공시설</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#855FDF] font-pretendard-gov leading-tight">84</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">개소</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Pin 3 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '180px', top: '480px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_public.svg" alt="공공 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">공공시설</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#855FDF] font-pretendard-gov leading-tight">112</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">개소</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Pin 4 */}
              <div className="absolute flex items-start z-10 group cursor-pointer transition-transform hover:scale-105 drop-shadow-md gp-pin-in" style={{ left: '360px', top: '520px' }}>
                <div className="relative z-20 shrink-0">
                  <img src="/icons/pin_public.svg" alt="공공 핀" className="w-[70px] h-[83px] object-contain" />
                </div>
                <div className="bg-white border border-[#D2DAE6] flex flex-col relative z-10 -ml-[30px] mt-[10px] h-fit" style={{ padding: '8px 12px 8px 12px', borderRadius: '8px' }}>
                  <div className="pl-[12px] flex flex-col">
                    <span className="text-[14px] font-bold text-[#16243B] leading-tight mb-0.5">공공시설</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] font-bold text-[#855FDF] font-pretendard-gov leading-tight">95</span>
                      <span className="text-[13px] font-medium text-[#5A6878] leading-tight">개소</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}


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
                  <span className="text-[#5A6878] text-[13px] shrink-0 ml-2 font-normal">{notice.date}</span>
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
              {/* Icon and details */}
              <div className="flex items-center gap-[16px]">
                <TrendingUp size={40} className="text-[#1587E1] shrink-0" strokeWidth={2.5} />
                <div className="min-w-0">
                  <span className="text-[13px] font-medium text-[#5A6878] block leading-none">전년 동월 대비 인구 증가</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-[32px] font-bold text-[#16243B] font-pretendard-gov leading-none">2,145</span>
                    <span className="text-[16px] font-semibold text-[#16243B] leading-none">명</span>
                    <span className="text-[13px] font-normal text-[#5A6878] ml-1 leading-none">(+0.76%)</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button 
                onClick={() => onShowToast("자세히 보기 페이지로 이동합니다.")}
                className="gp-btn gp-btn--primary gp-btn--sm shrink-0"
              >
                자세히 보기<ChevronRight size={16} />
              </button>
            </div>

            {/* Bottom 3 metrics */}
            <div className="pt-2 mt-2 mb-2 flex justify-between items-center px-1">
              {/* Metric 1 */}
              <div className="flex flex-col justify-center items-center flex-1">
                <span className="text-[13px] font-normal text-[#5A6878] leading-tight mb-2">대중교통 이용 증가</span>
                <div className="flex items-center gap-1">
                  <ArrowUp size={16} className="text-[#21B465]" strokeWidth={3} />
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight font-pretendard-gov">-12.4</span>
                  <span className="text-[13px] font-normal text-[#16243B] leading-tight">%</span>
                </div>
              </div>
              <div className="w-px h-[32px] bg-[#E4E9F1]"></div>
              {/* Metric 2 */}
              <div className="flex flex-col justify-center items-center flex-1">
                <span className="text-[13px] font-normal text-[#5A6878] leading-tight mb-2">미세먼지 개선</span>
                <div className="flex items-center gap-1">
                  <ArrowDown size={16} className="text-[#21B465]" strokeWidth={3} />
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight font-pretendard-gov">-12.4</span>
                  <span className="text-[13px] font-normal text-[#16243B] leading-tight">%</span>
                </div>
              </div>
              <div className="w-px h-[32px] bg-[#E4E9F1]"></div>
              {/* Metric 3 */}
              <div className="flex flex-col justify-center items-center flex-1">
                <span className="text-[13px] font-normal text-[#5A6878] leading-tight mb-2">공공시설 확충</span>
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-[#1587E1]" strokeWidth={3} />
                  <span className="text-[16px] font-bold text-[#16243B] leading-tight font-pretendard-gov">+12</span>
                  <span className="text-[13px] font-normal text-[#16243B] leading-tight">개소</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
