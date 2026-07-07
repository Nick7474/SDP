const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const safetyStart = code.indexOf("activeTab === 'safety' && (");
const dataStart = code.indexOf("activeTab === 'data' && (");

if (safetyStart !== -1 && dataStart !== -1) {
  let safetyBlock = code.substring(safetyStart, dataStart);
  
  const chartStartStr = '{/* Chart 3:';
  let chartStart = safetyBlock.indexOf(chartStartStr);
  let tableSectionStart = safetyBlock.indexOf('{/* Data Table Section */}', chartStart);
  
  if (chartStart !== -1 && tableSectionStart !== -1) {
    const newChartBlock = `                {/* Chart 3: 이벤트 유형 비율 (Donut Chart) */}
                <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">이벤트 유형 비율</h3>
                    <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative mt-2">
                    <div className="relative w-[200px] h-[200px]">
                      <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#004B87" strokeWidth="30" strokeDasharray="120.95 219.91" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#41A554" strokeWidth="30" strokeDasharray="54.98 219.91" transform="rotate(198 50 50)" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#F28923" strokeWidth="30" strokeDasharray="43.98 219.91" transform="rotate(288 50 50)" />
                        
                        <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" transform="rotate(0 50 50)" />
                        <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" transform="rotate(198 50 50)" />
                        <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" transform="rotate(288 50 50)" />
                        
                        <circle cx="50" cy="50" r="20.5" fill="white" />
                      </svg>
                      <span className="absolute text-white font-normal text-[16px] -translate-x-1/2 -translate-y-1/2" style={{ left: '169px', top: '111px' }}>55%</span>
                      <span className="absolute text-white font-normal text-[16px] -translate-x-1/2 -translate-y-1/2" style={{ left: '38px', top: '132px' }}>25%</span>
                      <span className="absolute text-white font-normal text-[16px] -translate-x-1/2 -translate-y-1/2" style={{ left: '59px', top: '43px' }}>20%</span>
                    </div>
                    <div className="flex flex-col gap-3 ml-8 w-[220px] whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#004B87] rounded-[2px]" />
                        <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">보행 안전</span>
                        <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">55%</span>
                        <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(2,200 건)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#41A554] rounded-[2px]" />
                        <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">재난/환경</span>
                        <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">25%</span>
                        <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(1,000 건)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#F28923] rounded-[2px]" />
                        <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">시설이상</span>
                        <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">20%</span>
                        <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(800 건)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        
              `;
              
    safetyBlock = safetyBlock.substring(0, chartStart) + newChartBlock + safetyBlock.substring(tableSectionStart);
    
    code = code.substring(0, safetyStart) + safetyBlock + code.substring(dataStart);
    fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
    console.log('Successfully applied 3-segment Donut Chart to Safety Mile.');
  } else {
    console.log('Could not locate chart start or table section start.');
  }
} else {
  console.log('Could not locate safety or data blocks.');
}
