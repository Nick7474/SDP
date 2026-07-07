const fs = require('fs');

// 1. Generate CityDataMap.tsx
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
      <div className="max-w-[1280px] h-full mx-auto relative z-10 pt-[100px] flex gap-[20px] pb-6">
        
        {/* Left Panels */}
        <div className="w-[340px] flex flex-col gap-[20px] h-full overflow-y-auto pr-1 custom-scrollbar">
          
          {/* 광명시 주요 도시지표 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">광명시 주요 도시지표</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex justify-between gap-3 text-center">
              <div className="flex-1 bg-[var(--bg-page)] rounded-[12px] p-3 flex flex-col items-center justify-center">
                <img src="/icons/ic_dash_community.svg" alt="인구" className="w-8 h-8 mb-2 opacity-80"/>
                <span className="text-[12px] text-[var(--fg-3)] mb-1">총 인구</span>
                <div className="text-[14px] font-bold text-[var(--fg-1)]">282,927<span className="text-[12px] font-normal ml-1">명</span></div>
              </div>
              <div className="flex-1 bg-[var(--bg-page)] rounded-[12px] p-3 flex flex-col items-center justify-center">
                <img src="/icons/ic_dash_home.svg" alt="세대수" className="w-8 h-8 mb-2 opacity-80"/>
                <span className="text-[12px] text-[var(--fg-3)] mb-1">세대 수</span>
                <div className="text-[14px] font-bold text-[var(--fg-1)]">124,557<span className="text-[12px] font-normal ml-1">세대</span></div>
              </div>
              <div className="flex-1 bg-[var(--bg-page)] rounded-[12px] p-3 flex flex-col items-center justify-center">
                <img src="/icons/ic_dash_building.svg" alt="행정동" className="w-8 h-8 mb-2 opacity-80"/>
                <span className="text-[12px] text-[var(--fg-3)] mb-1">행정동 수</span>
                <div className="text-[14px] font-bold text-[var(--fg-1)]">18<span className="text-[12px] font-normal ml-1">개동</span></div>
              </div>
            </div>
          </div>

          {/* 생활·교통 현황 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">생활·교통 현황</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-[var(--bg-page)] rounded-[12px] p-4 flex flex-col">
                <span className="text-[13px] font-medium text-[var(--fg-2)] mb-3 text-center">친환경 EV-DRT 버스</span>
                <div className="flex items-center justify-center gap-3">
                  <img src="/icons/ic_dash_bus.svg" alt="버스" className="w-[50px] h-[50px]"/>
                  <div className="flex flex-col items-end">
                    <div className="text-[24px] font-bold text-[var(--fg-1)] leading-none">23<span className="text-[14px] font-normal ml-1">대</span></div>
                    <span className="text-[12px] text-[var(--fg-4)] mt-1">운행중</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-[var(--bg-page)] rounded-[12px] p-4 flex flex-col">
                <span className="text-[13px] font-medium text-[var(--fg-2)] mb-3 text-center">공공자전거 이용률</span>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-[40px] h-[40px] bg-purple-100 rounded-full flex items-center justify-center">🚲</div>
                  <div className="flex flex-col items-end">
                    <div className="text-[24px] font-bold text-[var(--fg-1)] leading-none">0.8<span className="text-[14px] font-normal ml-1">%</span></div>
                    <span className="text-[12px] text-[var(--fg-4)] mt-1">전일 대비</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 환경·안전 지표 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">환경·안전 지표</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex justify-between items-end pb-2">
              <div className="flex flex-col items-center">
                <div className="relative w-[70px] h-[70px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#7148E2" fill="none" strokeWidth="4" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-bold text-[var(--fg-1)]">16</span>
                    <span className="text-[9px] text-[var(--fg-4)]">µg/m³</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[var(--fg-2)] text-center">초미세먼지<br/>(PM2.5)</span>
                <span className="text-[13px] font-bold text-[#7148E2] mt-1">보통</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-[70px] h-[70px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#1587E1" fill="none" strokeWidth="4" strokeDasharray="30, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-bold text-[var(--fg-1)]">23</span>
                    <span className="text-[9px] text-[var(--fg-4)]">µg/m³</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[var(--fg-2)] text-center">미세먼지<br/>(PM10)</span>
                <span className="text-[13px] font-bold text-[#1587E1] mt-1">좋음</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-[70px] h-[70px] mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path stroke="#E6E8EA" fill="none" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#FDBA21" fill="none" strokeWidth="4" strokeDasharray="50, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[14px] font-bold text-[var(--fg-1)]">0.054</span>
                    <span className="text-[9px] text-[var(--fg-4)]">ppm</span>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-[var(--fg-2)] text-center">오존<br/>(O3)</span>
                <span className="text-[13px] font-bold text-[#FDBA21] mt-1">보통</span>
              </div>
            </div>
          </div>

          {/* 인기 도시 데이터 TOP 5 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">인기 도시 데이터 TOP 5</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { rank: 1, type: '교통', label: '전기차 충전소 이용 현황', val: '1,682건', color: '#F28923' },
                { rank: 2, type: '환경', label: '대기질 관측 데이터', val: '231건', color: '#41A554' },
                { rank: 3, type: '교통', label: '공공자전거 대여 이력', val: '284건', color: '#F28923' },
                { rank: 4, type: '에너지', label: '전기차 충전소 이용 현황', val: '225건', color: '#A068D8' },
                { rank: 5, type: '에너지', label: '에너지 사용량 통계', val: '198건', color: '#A068D8' }
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between py-1.5 border-b border-[var(--border-light)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-bold text-[var(--fg-1)]">{item.rank}.</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px]" style={{ color: item.color, backgroundColor: \`\${item.color}15\` }}>{item.type}</span>
                    <span className="text-[13px] font-medium text-[var(--fg-2)] truncate max-w-[120px]">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[var(--fg-1)]">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Map Area */}
        <div className="flex-1 h-full relative flex items-center justify-center">
          <div className="absolute top-0 w-full text-center mt-[-30px]">
            <span className="text-[16px] font-bold text-[var(--gp-primary)] mb-1 block">데이터로 보는 광명시 도시현황</span>
            <h1 className="text-[32px] font-pretendard-gov font-bold text-[var(--fg-1)]">광명시 데이터 지도</h1>
          </div>
          
          <div className="relative w-full h-[600px] flex items-center justify-center mt-12">
            <svg viewBox="0 0 800 800" className="w-[85%] h-[85%] absolute opacity-80" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 180, 255, 0.2))' }}>
              <path d="M 400 100 Q 500 120 550 200 T 600 400 Q 580 500 500 600 T 350 650 Q 250 600 200 500 T 250 300 Q 300 150 400 100 Z" fill="#E8F4FE" stroke="#48C3F2" strokeWidth="3"/>
              <path d="M 400 100 Q 500 120 550 200" fill="none" stroke="#256EF4" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            {/* Map Pins */}
            <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">인구</span>
                <span className="text-[13px] font-bold text-[#0C8AE5]">24,380 <span className="text-[10px]">명</span></span>
              </div>
              <img src="/icons/pin_population.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>

            <div className="absolute top-[35%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">대중교통 이용</span>
                <span className="text-[13px] font-bold text-[#41A554]">345,276 <span className="text-[10px]">건/월</span></span>
              </div>
              <img src="/icons/pin_traffic.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>

            <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">건물 에너지 사용량</span>
                <span className="text-[13px] font-bold text-[#6D839D]">12,450 <span className="text-[10px]">MWh</span></span>
              </div>
              <img src="/icons/pin_building.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>

            <div className="absolute top-[60%] right-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">공공시설</span>
                <span className="text-[13px] font-bold text-[#7148E2]">156 <span className="text-[10px]">개소</span></span>
              </div>
              <img src="/icons/pin_public.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>

            <div className="absolute bottom-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">생활안전지수</span>
                <span className="text-[13px] font-bold text-[#F28923]">83 <span className="text-[10px]">/100</span></span>
              </div>
              <img src="/icons/pin_climate-1.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>

            <div className="absolute bottom-[20%] right-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[var(--border-light)] mb-[-10px] z-10 flex flex-col items-center">
                <span className="text-[11px] font-bold text-[var(--fg-2)]">녹지 면적</span>
                <span className="text-[13px] font-bold text-[#0C8AE5]">125.6 <span className="text-[10px]">ha</span></span>
              </div>
              <img src="/icons/pin_climate.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
            </div>
          </div>
          
          {/* Floating Right Menu */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-[12px] items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onShowToast(\`'\${tab.label}' 데이터가 활성화되었습니다.\`);
                }}
                className="w-[60px] h-[60px] rounded-full shadow-md hover:scale-105 transition-transform"
              >
                <img src={activeTab === tab.id ? tab.on : tab.off} alt={tab.label} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-[340px] flex flex-col gap-[20px] h-full overflow-y-auto pl-1 custom-scrollbar">
          
          {/* 분야별 도시지표 현황 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">분야별 도시지표 현황</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-[28px] font-bold text-[var(--fg-1)]">1,245.8 <span className="text-[12px] font-normal text-[var(--fg-4)]">tCO₂eq</span></div>
                <div className="grid grid-cols-2 gap-y-2 mt-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#41A554]"></div><span className="text-[11px] text-[var(--fg-2)]">교통</span> <span className="text-[11px] font-bold">55%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7148E2]"></div><span className="text-[11px] text-[var(--fg-2)]">폐기물</span> <span className="text-[11px] font-bold">10%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1587E1]"></div><span className="text-[11px] text-[var(--fg-2)]">에너지</span> <span className="text-[11px] font-bold">30%</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FDBA21]"></div><span className="text-[11px] text-[var(--fg-2)]">기타</span> <span className="text-[11px] font-bold">5%</span></div>
                </div>
              </div>
              <div className="w-[100px] h-[100px] relative">
                <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#41A554" strokeWidth="20" strokeDasharray="103.67 188.49" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#1587E1" strokeWidth="20" strokeDasharray="56.54 188.49" transform="rotate(198 50 50)" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#7148E2" strokeWidth="20" strokeDasharray="18.84 188.49" transform="rotate(306 50 50)" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#FDBA21" strokeWidth="20" strokeDasharray="9.42 188.49" transform="rotate(342 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(0 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(198 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(306 50 50)" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" transform="rotate(342 50 50)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white pointer-events-none">
                  <span className="absolute" style={{top: '25%', right: '25%'}}>55%</span>
                  <span className="absolute" style={{bottom: '30%', left: '30%'}}>30%</span>
                  <span className="absolute" style={{top: '25%', left: '25%'}}>15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 광명시 종합 도시지수 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">광명시 종합 도시지수</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-[120px] h-[60px] overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-[120px] h-[120px] rounded-full border-[15px] border-[#E6E8EA]"></div>
                  <div className="absolute top-0 left-0 w-[120px] h-[120px] rounded-full border-[15px] border-[#256EF4]" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', transform: 'rotate(120deg)' }}></div>
                </div>
                <div className="absolute bottom-[-10px] flex flex-col items-center">
                  <span className="text-[11px] text-[var(--fg-3)]">탄소 배출 지수</span>
                  <span className="text-[28px] font-bold text-[var(--fg-1)] leading-none">72</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 border-l border-[var(--border-light)] pl-4">
                <div className="flex justify-between items-center"><span className="text-[12px] text-[var(--fg-2)]">전국 평균</span><span className="text-[14px] font-bold text-[var(--fg-1)]">68.4</span></div>
                <div className="flex justify-between items-center"><span className="text-[12px] text-[var(--fg-2)]">경기도 평균</span><span className="text-[14px] font-bold text-[var(--fg-1)]">72.3</span></div>
                <div className="flex justify-between items-center"><span className="text-[12px] text-[var(--fg-2)]">전년 대비</span><span className="text-[12px] font-bold text-[#E92E2E]">▲ 4.8%</span></div>
              </div>
            </div>
          </div>

          {/* 광명시 데이터 알림 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">광명시 데이터 알림</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="flex w-full h-[34px] border border-[#E6E8EA] rounded-full overflow-hidden mb-3">
              <button 
                onClick={() => setActiveNoticeTab('city')}
                className={\`flex-1 text-[14px] font-bold transition-colors \${activeNoticeTab === 'city' ? 'bg-[#1587E1] text-white rounded-full' : 'text-[#36445A] hover:bg-slate-50'}\`}
              >
                최신 업데이트
              </button>
              <button 
                onClick={() => setActiveNoticeTab('notice')}
                className={\`flex-1 text-[14px] font-bold transition-colors \${activeNoticeTab === 'notice' ? 'bg-[#1587E1] text-white rounded-full' : 'text-[#36445A] hover:bg-slate-50'}\`}
              >
                공지사항
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { title: '광명시, 탄소중립 실천 경제 활성화..', date: '26.03.13' },
                { title: '2026년 에코뷰 서비스 점검 안내', date: '26.03.13' },
                { title: '우리 동네 기후에너지 체험관 운영', date: '26.03.13' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center cursor-pointer group">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-1 h-1 rounded-full bg-[#1587E1] shrink-0" />
                    <span className="text-[13px] text-[var(--fg-2)] group-hover:text-[var(--gp-primary)] transition-colors truncate">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-[var(--fg-4)] shrink-0 ml-3">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 주요 변화 인사이트 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[16px] shadow-sm border border-[var(--border-light)] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pretendard-gov text-[18px] font-bold text-[var(--fg-1)]">주요 변화 인사이트</h3>
              <span className="text-[12px] text-[var(--fg-4)]">26년 03월 기준</span>
            </div>
            <div className="bg-[#F8FBFF] rounded-[12px] p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <ArrowRight size={18} className="text-[#1587E1] transform -rotate-45"/>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[var(--fg-3)]">전년 동월 대비 인구 증가</span>
                    <div className="text-[24px] font-bold text-[var(--fg-1)] leading-none mt-1">2,145 <span className="text-[14px] font-normal">명</span> <span className="text-[12px] text-[var(--fg-4)]">(+0.76%)</span></div>
                  </div>
                </div>
                <button className="flex items-center bg-[#004B87] text-white px-3 py-1.5 rounded-[6px] text-[11px] font-medium hover:bg-[#003865]">
                  자세히 보기 <ChevronRight size={12} className="ml-1"/>
                </button>
              </div>
              <div className="h-[1px] bg-[#E6E8EA] w-full" />
              <div className="flex justify-between px-2">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-[var(--fg-4)]">대중교통 이용 증가</span>
                  <span className="text-[13px] font-bold text-[#41A554] mt-1">↑ 12.4%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-[var(--fg-4)]">미세먼지 개선</span>
                  <span className="text-[13px] font-bold text-[#41A554] mt-1">↓ 12.4%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-[var(--fg-4)]">공공시설 확충</span>
                  <span className="text-[13px] font-bold text-[#1587E1] mt-1">↑ 12 개소</span>
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

// 2. Add CityDataMap to App.tsx
let appCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', 'utf-8');
if (!appCode.includes("import CityDataMap")) {
  appCode = appCode.replace("import MileDataMap from './components/MileDataMap';", "import MileDataMap from './components/MileDataMap';\nimport CityDataMap from './components/CityDataMap';");
  
  appCode = appCode.replace("useState<'intro' | 'archive' | 'map'>('intro')", "useState<'intro' | 'archive' | 'map' | 'cityMap'>('intro')");
  
  appCode = appCode.replace(
    "<MileDataMap activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />\n            <MileDashboard activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />",
    `{currentPage === 'cityMap' ? (
              <CityDataMap onShowToast={triggerToast} />
            ) : (
              <>
                <MileDataMap activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />
                <MileDashboard activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />
              </>
            )}`
  );
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', appCode, 'utf-8');
}

// 3. Update Header.tsx to navigate to cityMap
let headerCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', 'utf-8');
if (headerCode.includes("광명시 데이터")) {
  headerCode = headerCode.replace(
    /onClick=\{\(e\) => \{\s*e\.preventDefault\(\);\s*\}\}/g, 
    "onClick={(e) => { e.preventDefault(); onNavigate('cityMap'); setMobileMenuOpen(false); }}"
  );
  
  // Actually, some places in header still just have e.preventDefault() without onNavigate for '광명시 데이터'.
  // We'll replace specifically for 광명시 데이터.
  headerCode = headerCode.replace(
    /href="#sol-map"\s*onClick=\{\(e\) => \{\s*e\.preventDefault\(\);\s*\}\}/g,
    'href="#city-map" onClick={(e) => { e.preventDefault(); onNavigate(\'cityMap\'); }}'
  );
  
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', headerCode, 'utf-8');
}

console.log("Successfully created CityDataMap and linked navigation.");
