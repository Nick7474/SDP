const fs = require('fs');

const cityDataMapCode = `import { useState } from 'react';
import { 
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface CityDataMapProps {
  onShowToast: (msg: string) => void;
}

export default function CityDataMap({ onShowToast }: CityDataMapProps) {
  const [activeTab, setActiveTab] = useState('population');
  const [activeNoticeTab, setActiveNoticeTab] = useState<'city' | 'notice'>('city');

  const tabs = [
    { id: 'population', label: '인구·생활', on: '/icons/btn_population_on.svg', off: '/icons/btn_population_off.svg' },
    { id: 'traffic', label: '교통·이동', on: '/icons/btn_traffic_on.svg', off: '/icons/btn_traffic_off.svg' },
    { id: 'climate', label: '환경·기후', on: '/icons/btn_climate_on.svg', off: '/icons/btn_climate_on-3.svg' },
    { id: 'safety', label: '안전·재난', on: '/icons/btn_climate_on-1.svg', off: '/icons/btn_climate_on-2.svg' },
    { id: 'energy', label: '에너지·건물', on: '/icons/btn_energy_on.svg', off: '/icons/btn_energy_off.svg' },
    { id: 'public', label: '공공시설', on: '/icons/btn_public_on.svg', off: '/icons/btn_public_off.svg' }
  ];

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

      {/* Floating Vertical Tabs - relative to outer 1920px container */}
      <div 
        className="absolute z-20 flex flex-col gap-0 items-end"
        style={{ 
          right: '628px', 
          top: '44px', 
          width: '180px' 
        }}
      >
        <div 
          className="absolute w-[1.5px] bg-[#E2E8F0]" 
          style={{ right: '30px', top: '30px', bottom: '30px', zIndex: 10 }} 
        />
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onShowToast(\`'\${tab.label}' 보드가 활성화되었습니다.\`);
              }}
              className="relative flex items-center justify-end gap-[4px] cursor-pointer focus:outline-none group z-20"
              style={{ height: '60px', width: '100%' }}
            >
              <span 
                className="font-pretendard-gov transition-all"
                style={{
                  fontSize: '12px',
                  fontWeight: isSelected ? '700' : '400',
                  color: isSelected ? '#16243B' : '#7C8896'
                }}
              >
                {tab.label}
              </span>
              <img 
                src={isSelected ? tab.on : tab.off} 
                alt="" 
                className="object-contain group-hover:scale-105 transition-transform shrink-0" 
                style={{ width: '60px', height: '60px' }}
              />
            </button>
          );
        })}
      </div>

      {/* Central Map Image Block - identical to MileDataMap but with custom pins */}
      <div 
        className="absolute z-10" 
        style={{ 
          left: '50%', 
          top: '460px', 
          transform: 'translate(-50%, -50%)',
          width: '850px',
          height: '750px',
          pointerEvents: 'none'
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 800 800" className="w-[85%] h-[85%] absolute opacity-80" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 180, 255, 0.2))' }}>
            <path d="M 400 100 Q 500 120 550 200 T 600 400 Q 580 500 500 600 T 350 650 Q 250 600 200 500 T 250 300 Q 300 150 400 100 Z" fill="#E8F4FE" stroke="#48C3F2" strokeWidth="3"/>
            <path d="M 400 100 Q 500 120 550 200" fill="none" stroke="#256EF4" strokeWidth="2" strokeDasharray="5,5" />
          </svg>

          {/* Pins mapped to mockup locations */}
          {/* 1. Population */}
          <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0C8AE5] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_community.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">인구</span>
                <span className="text-[13px] font-bold text-[#0C8AE5] leading-none">24,380 <span className="text-[10px]">명</span></span>
              </div>
            </div>
            <img src="/icons/pin_population.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

          {/* 2. Traffic */}
          <div className="absolute top-[35%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#41A554] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_bus.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">대중교통 이용</span>
                <span className="text-[13px] font-bold text-[#41A554] leading-none">345,276 <span className="text-[10px]">건/월</span></span>
              </div>
            </div>
            <img src="/icons/pin_traffic.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

          {/* 3. Building Energy */}
          <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#6D839D] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_building.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">건물 에너지 사용량</span>
                <span className="text-[13px] font-bold text-[#6D839D] leading-none">12,450 <span className="text-[10px]">MWh</span></span>
              </div>
            </div>
            <img src="/icons/pin_building.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

          {/* 4. Public */}
          <div className="absolute top-[60%] right-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#7148E2] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_home.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">공공시설</span>
                <span className="text-[13px] font-bold text-[#7148E2] leading-none">156 <span className="text-[10px]">개소</span></span>
              </div>
            </div>
            <img src="/icons/pin_public.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

          {/* 5. Safety */}
          <div className="absolute bottom-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#EC8913] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_emergency.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">생활안전지수</span>
                <span className="text-[13px] font-bold text-[#EC8913] leading-none">83 <span className="text-[10px]">/100</span></span>
              </div>
            </div>
            <img src="/icons/pin_climate-1.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

          {/* 6. Climate */}
          <div className="absolute bottom-[20%] right-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
            <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0C8AE5] flex items-center justify-center shrink-0">
                <img src="/icons/ic_dash_status.svg" className="w-4 h-4 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--fg-2)] leading-tight">녹지 면적</span>
                <span className="text-[13px] font-bold text-[#0C8AE5] leading-none">125.6 <span className="text-[10px]">ha</span></span>
              </div>
            </div>
            <img src="/icons/pin_climate.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
          </div>

        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-[1440px] mx-auto h-full px-0 relative flex items-start justify-between">
        
        {/* LEFT COLUMN (4 Cards, width 380px, height 200px, gap 16px) */}
        <div className="w-[380px] flex flex-col gap-[16px] z-10 mt-[30px]">
          
          {/* Card 1: 광명시 주요 도시지표 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 주요 도시지표</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex items-center justify-between mt-3 flex-1 pb-1 gap-2">
              <div className="flex-1 bg-[#F8FBFF] rounded-[12px] p-3 flex flex-col items-center justify-center border border-[#E8F4FE]">
                <img src="/icons/ic_dash_community.svg" alt="인구" className="w-[32px] h-[32px] mb-2"/>
                <span className="text-[13px] font-medium text-[#7C8896] mb-1">총 인구</span>
                <div className="text-[16px] font-bold text-[#16243B]">282,927<span className="text-[13px] font-normal ml-0.5 text-[#36445A]">명</span></div>
              </div>
              <div className="flex-1 bg-[#F8FBFF] rounded-[12px] p-3 flex flex-col items-center justify-center border border-[#E8F4FE]">
                <img src="/icons/ic_dash_home.svg" alt="세대수" className="w-[32px] h-[32px] mb-2"/>
                <span className="text-[13px] font-medium text-[#7C8896] mb-1">세대 수</span>
                <div className="text-[16px] font-bold text-[#16243B]">124,557<span className="text-[13px] font-normal ml-0.5 text-[#36445A]">세대</span></div>
              </div>
              <div className="flex-1 bg-[#F8FBFF] rounded-[12px] p-3 flex flex-col items-center justify-center border border-[#E8F4FE]">
                <img src="/icons/ic_dash_building.svg" alt="행정동" className="w-[32px] h-[32px] mb-2"/>
                <span className="text-[13px] font-medium text-[#7C8896] mb-1">행정동 수</span>
                <div className="text-[16px] font-bold text-[#16243B]">18<span className="text-[13px] font-normal ml-0.5 text-[#36445A]">개동</span></div>
              </div>
            </div>
          </div>

          {/* Card 2: 생활·교통 현황 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">생활·교통 현황</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex items-center justify-between mt-3 flex-1 pb-1 gap-3">
              <div className="flex-1 h-full bg-[#F8FBFF] rounded-[12px] p-4 flex flex-col justify-between border border-[#E8F4FE]">
                <span className="text-[14px] font-bold text-[#16243B] text-center">친환경 EV-DRT 버스</span>
                <div className="flex items-end justify-between px-2">
                  <img src="/icons/ic_dash_bus.svg" alt="버스" className="w-[42px] h-[42px] drop-shadow-md"/>
                  <div className="flex flex-col items-end">
                    <div className="text-[28px] font-bold text-[#16243B] leading-none mb-1">23<span className="text-[16px] font-medium ml-1 text-[#36445A]">대</span></div>
                    <span className="text-[12px] font-medium text-[#7C8896]">운행중</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full bg-[#F8FBFF] rounded-[12px] p-4 flex flex-col justify-between border border-[#E8F4FE]">
                <span className="text-[14px] font-bold text-[#16243B] text-center">공공자전거 이용률</span>
                <div className="flex items-end justify-between px-2">
                  <div className="w-[42px] h-[42px] bg-[#EBE7FA] rounded-full flex items-center justify-center drop-shadow-sm border border-[#D5CFF2]">
                    <span className="text-[22px]">🚲</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[28px] font-bold text-[#16243B] leading-none mb-1">0.8<span className="text-[16px] font-medium ml-1 text-[#36445A]">%</span></div>
                    <span className="text-[12px] font-medium text-[#7C8896]">전일 대비</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 환경·안전 지표 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">환경·안전 지표</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex items-end justify-between mt-3 flex-1 pb-2 px-1 gap-2">
              <div className="flex flex-col items-center">
                <div className="relative w-[75px] h-[75px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#7148E2" fill="none" strokeWidth="4" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[18px] font-bold text-[#16243B] leading-none mb-1">16</span>
                    <span className="text-[10px] text-[#7C8896] leading-none">µg/m³</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[#36445A] text-center leading-[1.2] mb-1">초미세먼지<br/>(PM2.5)</span>
                <span className="text-[13px] font-bold text-[#7148E2]">보통</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-[75px] h-[75px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#1587E1" fill="none" strokeWidth="4" strokeDasharray="30, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[18px] font-bold text-[#16243B] leading-none mb-1">23</span>
                    <span className="text-[10px] text-[#7C8896] leading-none">µg/m³</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[#36445A] text-center leading-[1.2] mb-1">미세먼지<br/>(PM10)</span>
                <span className="text-[13px] font-bold text-[#1587E1]">좋음</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-[75px] h-[75px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#FDBA21" fill="none" strokeWidth="4" strokeDasharray="50, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-bold text-[#16243B] leading-none mb-1">0.054</span>
                    <span className="text-[10px] text-[#7C8896] leading-none">ppm</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[#36445A] text-center leading-[1.2] mb-1">오존<br/>(O3)</span>
                <span className="text-[13px] font-bold text-[#FDBA21]">보통</span>
              </div>
            </div>
          </div>

          {/* Card 4: 인기 도시 데이터 TOP 5 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">인기 도시 데이터 TOP 5</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex flex-col mt-3 flex-1 pb-2">
              {[
                { rank: 1, type: '교통', label: '전기차 충전소 이용 현황', val: '1,682건', color: '#F28923' },
                { rank: 2, type: '환경', label: '대기질 관측 데이터', val: '231건', color: '#41A554' },
                { rank: 3, type: '교통', label: '공공자전거 대여 이력', val: '284건', color: '#F28923' },
                { rank: 4, type: '에너지', label: '전기차 충전소 이용 현황', val: '225건', color: '#A068D8' },
                { rank: 5, type: '에너지', label: '에너지 사용량 통계', val: '198건', color: '#A068D8' }
              ].map((item, idx) => (
                <div key={item.rank} className={\`flex items-center justify-between py-[5px] \${idx !== 4 ? 'border-b border-dashed border-[#E2E8F0]' : ''}\`}>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-bold text-[#16243B] w-[14px]">{item.rank}.</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px]" style={{ color: item.color, backgroundColor: \`\${item.color}15\` }}>{item.type}</span>
                    <span className="text-[13px] font-medium text-[#36445A] truncate w-[160px]">{item.label}</span>
                  </div>
                  <span className="text-[14px] font-bold text-[#16243B]">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 Cards) */}
        <div className="w-[380px] flex flex-col gap-[16px] z-10 mt-[30px]">
          
          {/* Card 5: 분야별 도시지표 현황 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">분야별 도시지표 현황</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex items-center mt-3 flex-1 pb-1">
              <div className="flex-1">
                <div className="text-[32px] font-bold text-[#16243B] leading-none mb-1">1,245.8</div>
                <div className="text-[13px] font-medium text-[#7C8896] mb-4 pl-1">tCO₂eq</div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 pl-1">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#41A554]"></div><span className="text-[12px] font-medium text-[#36445A]">교통</span> <span className="text-[12px] font-bold text-[#16243B]">55%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FDBA21]"></div><span className="text-[12px] font-medium text-[#36445A]">기타</span> <span className="text-[12px] font-bold text-[#16243B]">5%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#1587E1]"></div><span className="text-[12px] font-medium text-[#36445A]">에너지</span> <span className="text-[12px] font-bold text-[#16243B]">30%</span></div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#7148E2]"></div><span className="text-[12px] font-medium text-[#36445A]">폐기물</span> <span className="text-[12px] font-bold text-[#16243B]">10%</span></div>
                </div>
              </div>
              <div className="w-[110px] h-[110px] relative mr-2">
                <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#41A554" strokeWidth="20" strokeDasharray="103.67 188.49" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#FDBA21" strokeWidth="20" strokeDasharray="9.42 188.49" transform="rotate(198 50 50)" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#7148E2" strokeWidth="20" strokeDasharray="18.84 188.49" transform="rotate(216 50 50)" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#1587E1" strokeWidth="20" strokeDasharray="56.54 188.49" transform="rotate(252 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(0 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(198 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(216 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(252 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white pointer-events-none">
                  <span className="absolute" style={{top: '22%', right: '22%'}}>55%</span>
                  <span className="absolute" style={{top: '22%', left: '22%'}}>30%</span>
                  <span className="absolute" style={{bottom: '22%', left: '42%'}}>10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: 광명시 종합 도시지수 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 종합 도시지수</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="flex mt-3 flex-1 pb-1 gap-6 items-center">
              <div className="flex-1 flex flex-col items-center justify-center relative pt-4 pl-4">
                <div className="w-[140px] h-[70px] overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-[140px] h-[140px] rounded-full border-[20px] border-[#E8F4FE]"></div>
                  <div className="absolute top-0 left-0 w-[140px] h-[140px] rounded-full border-[20px] border-[#256EF4]" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', transform: 'rotate(120deg)' }}></div>
                </div>
                <div className="absolute bottom-[-14px] flex flex-col items-center bg-white px-2">
                  <span className="text-[12px] font-medium text-[#7C8896]">탄소 배출 지수</span>
                  <span className="text-[36px] font-bold text-[#16243B] leading-none mt-1">72</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-[14px] border-l border-[#E2E8F0] pl-6 h-[100px]">
                <div className="flex justify-between items-center"><span className="text-[13px] font-medium text-[#7C8896]">전국 평균</span><span className="text-[15px] font-bold text-[#16243B]">68.4</span></div>
                <div className="flex justify-between items-center"><span className="text-[13px] font-medium text-[#7C8896]">경기도 평균</span><span className="text-[15px] font-bold text-[#16243B]">72.3</span></div>
                <div className="flex justify-between items-center"><span className="text-[13px] font-medium text-[#7C8896]">전년 대비</span><span className="text-[14px] font-bold text-[#E92E2E]">▲ 4.8%</span></div>
              </div>
            </div>
          </div>

          {/* Card 7: 광명시 데이터 알림 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">광명시 데이터 알림</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            
            <div className="flex mt-3 mb-2 h-[32px] rounded-full border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC]">
              <button 
                onClick={() => setActiveNoticeTab('city')}
                className={\`flex-1 text-[13px] font-bold transition-colors \${activeNoticeTab === 'city' ? 'bg-[#0B50D0] text-white' : 'text-[#7C8896] hover:bg-[#F1F5F9]'}\`}
              >
                최신 업데이트
              </button>
              <button 
                onClick={() => setActiveNoticeTab('notice')}
                className={\`flex-1 text-[13px] font-bold transition-colors \${activeNoticeTab === 'notice' ? 'bg-[#0B50D0] text-white' : 'text-[#7C8896] hover:bg-[#F1F5F9]'}\`}
              >
                공지사항
              </button>
            </div>
            
            <div className="flex flex-col flex-1 pb-1">
              {[
                { title: '광명시, 탄소중립 실천 경제 활성화..', date: '26.03.13' },
                { title: '2026년 에코뷰 서비스 점검 안내', date: '26.03.13' },
                { title: '우리 동네 기후에너지 체험관 운영', date: '26.03.13' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 cursor-pointer group">
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                    <div className="w-[3px] h-[3px] rounded-full bg-[#0B50D0] shrink-0" />
                    <span className="text-[13px] font-medium text-[#36445A] group-hover:text-[#0B50D0] transition-colors truncate">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-[#7C8896] shrink-0">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 8: 주요 변화 인사이트 */}
          <div className="w-[380px] h-[200px] bg-white border border-[#E6E8EA] rounded-[16px] py-[4px] px-[16px] shadow-[var(--elev-2)] flex flex-col justify-between relative hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center h-[48px] border-b border-[#E6E8EA]">
              <h3 className="font-score font-bold text-[18px] text-[#16243B]">주요 변화 인사이트</h3>
              <span className="text-[13px] font-normal text-[#7C8896]">26년 03월 기준</span>
            </div>
            <div className="bg-[#F8FBFF] rounded-[12px] p-4 flex flex-col justify-between border border-[#E8F4FE] mt-3 mb-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/icons/ic_dash_rising.svg" alt="상승" className="w-[32px] h-[32px]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-[#7C8896] mb-0.5">전년 동월 대비 인구 증가</span>
                    <div className="text-[20px] font-bold text-[#16243B] leading-none">2,145 <span className="text-[13px] font-normal text-[#36445A]">명</span> <span className="text-[12px] font-medium text-[#7C8896] ml-1">(+0.76%)</span></div>
                  </div>
                </div>
                <button className="flex items-center bg-[#083891] text-white px-3 py-1.5 rounded-[6px] text-[12px] font-medium hover:bg-[#06286B] transition-colors shadow-sm">
                  자세히 보기 <ChevronRight size={14} className="ml-0.5"/>
                </button>
              </div>
              <div className="h-[1px] bg-[#E2E8F0] w-full my-2.5" />
              <div className="flex justify-between items-center px-1">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium text-[#7C8896] mb-1">대중교통 이용 증가</span>
                  <span className="text-[13px] font-bold text-[#41A554]">↑ 12.4%</span>
                </div>
                <div className="w-[1px] h-[24px] bg-[#E2E8F0]"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium text-[#7C8896] mb-1">미세먼지 개선</span>
                  <span className="text-[13px] font-bold text-[#41A554]">↓ 12.4%</span>
                </div>
                <div className="w-[1px] h-[24px] bg-[#E2E8F0]"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium text-[#7C8896] mb-1">공공시설 확충</span>
                  <span className="text-[13px] font-bold text-[#0B50D0]">↑ 12 개소</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', cityDataMapCode, 'utf-8');
console.log('Successfully recreated CityDataMap.tsx with exact MileDataMap layout system.');
