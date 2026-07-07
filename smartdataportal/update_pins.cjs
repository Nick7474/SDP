const fs = require('fs');

let cityCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', 'utf-8');

// 1. Replace the 4 Miles Toggle Control Group with the 6 City Data toggle controls
const toggleGroupTarget = `        {[
          { id: 'energy', label: '에너지 마일', on: '/icons/btn_energymile_on.svg', off: '/icons/btn_energymile_off.svg' },
          { id: 'mobility', label: '모빌리티 마일', on: '/icons/btn_mobilitymile_on.svg', off: '/icons/btn_mobilitymile_off.svg' },
          { id: 'safety', label: '세이프티 마일', on: '/icons/btn_safetymile_on.svg', off: '/icons/btn_safetymile_off.svg' },
          { id: 'data', label: '데이터 마일', on: '/icons/btn_datamile_on.svg', off: '/icons/btn_datamile_off.svg' }
        ].map((mile) => {`;

const toggleGroupReplacement = `        {[
          { id: 'population', label: '인구·생활', on: '/icons/btn_population_on.svg', off: '/icons/btn_population_off.svg' },
          { id: 'traffic', label: '교통·이동', on: '/icons/btn_traffic_on.svg', off: '/icons/btn_traffic_off.svg' },
          { id: 'climate', label: '환경·기후', on: '/icons/btn_climate_on.svg', off: '/icons/btn_climate_on-3.svg' },
          { id: 'safety', label: '안전·재난', on: '/icons/btn_climate_on-1.svg', off: '/icons/btn_climate_on-2.svg' },
          { id: 'energy', label: '에너지·건물', on: '/icons/btn_energy_on.svg', off: '/icons/btn_energy_off.svg' },
          { id: 'public', label: '공공시설', on: '/icons/btn_public_on.svg', off: '/icons/btn_public_off.svg' }
        ].map((mile) => {`;

cityCode = cityCode.replace(toggleGroupTarget, toggleGroupReplacement);

// 2. Replace the old pins inside the map block with the new 6 pins
const mapPinsTarget = /<img[\s\S]*?className="w-full h-full object-contain"[\s\S]*?style=\{\{ opacity: 0\.9 \}\}[\s\S]*?\/>([\s\S]*?)<\/div>\s*<\/div>\s*<div className="max-w-\[1440px\]/;

const newPins = `

        {/* 1. Population */}
        <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#0C8AE5] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_community.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">인구</span>
              <span className="text-[13px] font-bold text-[#0C8AE5] leading-none mt-0.5">24,380 <span className="text-[10px]">명</span></span>
            </div>
          </div>
          <img src="/icons/pin_population.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>

        {/* 2. Traffic */}
        <div className="absolute top-[35%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#41A554] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_bus.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">대중교통 이용</span>
              <span className="text-[13px] font-bold text-[#41A554] leading-none mt-0.5">345,276 <span className="text-[10px]">건/월</span></span>
            </div>
          </div>
          <img src="/icons/pin_traffic.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>

        {/* 3. Building Energy */}
        <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#6D839D] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_building.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">건물 에너지 사용량</span>
              <span className="text-[13px] font-bold text-[#6D839D] leading-none mt-0.5">12,450 <span className="text-[10px]">MWh</span></span>
            </div>
          </div>
          <img src="/icons/pin_building.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>

        {/* 4. Public */}
        <div className="absolute top-[60%] right-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#7148E2] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_home.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">공공시설</span>
              <span className="text-[13px] font-bold text-[#7148E2] leading-none mt-0.5">156 <span className="text-[10px]">개소</span></span>
            </div>
          </div>
          <img src="/icons/pin_public.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>

        {/* 5. Safety */}
        <div className="absolute bottom-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#EC8913] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_emergency.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">생활안전지수</span>
              <span className="text-[13px] font-bold text-[#EC8913] leading-none mt-0.5">83 <span className="text-[10px]">/100</span></span>
            </div>
          </div>
          <img src="/icons/pin_climate-1.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>

        {/* 6. Climate */}
        <div className="absolute bottom-[20%] right-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group">
          <div className="bg-white px-3 py-1.5 rounded-[20px] shadow-md border border-[#E6E8EA] mb-[-10px] z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 rounded-full bg-[#0C8AE5] flex items-center justify-center shrink-0">
              <img src="/icons/ic_dash_status.svg" className="w-4 h-4 brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#7C8896] leading-tight">녹지 면적</span>
              <span className="text-[13px] font-bold text-[#0C8AE5] leading-none mt-0.5">125.6 <span className="text-[10px]">ha</span></span>
            </div>
          </div>
          <img src="/icons/pin_climate.svg" alt="pin" className="w-[50px] h-[50px] drop-shadow-md z-0"/>
        </div>
      </div>

      <div className="max-w-[1440px]`;

cityCode = cityCode.replace(mapPinsTarget, function(match, p1) {
  return match.replace(p1, newPins);
});

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', cityCode, 'utf-8');
console.log('Replaced map pins successfully.');
