const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const safetyStartMarker = "{activeTab === 'safety' && (";
const startIndex = code.indexOf(safetyStartMarker);

const endMarker = '    </div>\r\n  );\r\n}';
let endIndex = code.lastIndexOf(endMarker);
if (endIndex === -1) endIndex = code.lastIndexOf('    </div>\n  );\n}');

const safetyContentBlock = code.substring(startIndex, endIndex);

let dataContentBlock = safetyContentBlock.replace("{activeTab === 'safety' && (", "{activeTab === 'data' && (");

// 1. KPI Cards
dataContentBlock = dataContentBlock.replace('ic_dash_alarm.svg', 'ic_dash_data1.svg');
dataContentBlock = dataContentBlock.replace(/총 감지건수/g, '총 수집 데이터');

dataContentBlock = dataContentBlock.replace('ic_dash_emergency.svg', 'ic_dash_data2.svg');
dataContentBlock = dataContentBlock.replace(/긴급 대응 건수/g, '연계 시스템 수');
dataContentBlock = dataContentBlock.replace('>15<', '>24<');

dataContentBlock = dataContentBlock.replace('ic_dash_clock.svg', 'ic_dash_data3.svg');
dataContentBlock = dataContentBlock.replace(/평균 배차시간/g, 'API 호출 수');
dataContentBlock = dataContentBlock.replace('>6.7<', '>3,128<');
dataContentBlock = dataContentBlock.replace('>분<', '>건<');

dataContentBlock = dataContentBlock.replace('ic_dash_location.svg', 'ic_dash_data4.svg');
dataContentBlock = dataContentBlock.replace(/위험지역 모니터링/g, '데이터 적재율');
dataContentBlock = dataContentBlock.replace('>개소<', '>%<');

// 2. Charts
dataContentBlock = dataContentBlock.replace('월별 안전 이벤트 추이', '월별 데이터 수집 추이');

dataContentBlock = dataContentBlock.replace('서비스별 이용량 비교', '시스템별 연계 데이터 비교');
dataContentBlock = dataContentBlock.replace(
  `data={[
            { label: '스마트폴', val: 1520 },
            { label: '스마트 CCTV', val: 1210 },
            { label: '비상벨', val: 820 },
            { label: '보행안전 감지', val: 410 },
            { label: '침수 감지', val: 120 }
          ]}`,
  `data={[
            { label: '통합플랫폼', val: 1520 },
            { label: '에너지', val: 1210 },
            { label: '모빌리티', val: 820 },
            { label: '세이프티', val: 410 },
            { label: '시민포털', val: 120 }
          ]}`
);

// 3. Donut Chart replacement
// We need to replace the entire flex gap-4 div block for the donut chart.
// Let's locate it via string operations since regex with multi-line might be fragile.
const donutStart = dataContentBlock.indexOf('<div className="flex gap-4">');
// Since it's the last such block in the charts row, we can just find it. But wait, KPI row also has flex gap-4? No, KPI is flex gap-6 grid grid-cols-6.
// Let's find the Donut Chart title first:
const donutTitleIdx = dataContentBlock.indexOf('위험 감지 유형 비율');
if(donutTitleIdx !== -1) {
  dataContentBlock = dataContentBlock.substring(0, donutTitleIdx) + '데이터 유형 비율' + dataContentBlock.substring(donutTitleIdx + '위험 감지 유형 비율'.length);
}

// Locate the donut SVG block
const donutFlexStart = dataContentBlock.indexOf('<div className="flex gap-4">', donutTitleIdx);
const donutEnd = dataContentBlock.indexOf('</div>\n                  </div>\n                </div>\n              </div>', donutFlexStart);

const newDonutHtml = `<div className="flex gap-4">
                      <div className="relative w-[180px] h-[180px]">
                        <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F3F5" strokeWidth="20" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7148E2" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.48)} />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00357B" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.32)} transform="rotate(172.8 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FDBA21" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.20)} transform="rotate(288 50 50)" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[14px] font-bold text-white absolute" style={{ top: '25%', right: '22%' }}>48%</span>
                          <span className="text-[14px] font-bold text-white absolute" style={{ bottom: '20%', left: '38%' }}>32%</span>
                          <span className="text-[14px] font-bold text-white absolute" style={{ top: '45%', left: '16%' }}>20%</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-4 ml-4">
                        <div className="flex items-center">
                          <div className="w-[12px] h-[12px] bg-[#7148E2] rounded-[2px]" />
                          <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">센서 데이터</span>
                          <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">48%</span>
                          <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(13,190 건)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-[12px] h-[12px] bg-[#00357B] rounded-[2px]" />
                          <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">운영 데이터</span>
                          <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">32%</span>
                          <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(8,794 건)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-[12px] h-[12px] bg-[#FDBA21] rounded-[2px]" />
                          <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">분석 데이터</span>
                          <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">20%</span>
                          <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">(5,496 건)</span>
                        </div>
                      </div>`;

if(donutFlexStart !== -1 && donutEnd !== -1) {
  dataContentBlock = dataContentBlock.substring(0, donutFlexStart) + newDonutHtml + dataContentBlock.substring(donutEnd);
}

// 4. Data Table
dataContentBlock = dataContentBlock.replace(/광명역 스마트 폴 감지 데이터/g, '광명역 통합 수집 데이터');
dataContentBlock = dataContentBlock.replace(/세이프티/g, '데이터');
dataContentBlock = dataContentBlock.replace(/스마트 폴/g, '데이터 통합플랫폼');
dataContentBlock = dataContentBlock.replace(/감지 건수/g, '수집건수');


const newCode = code.substring(0, endIndex) +
  dataContentBlock + "\n" +
  code.substring(endIndex);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', newCode, 'utf-8');
console.log('Successfully added Data Mile to MileDashboard.tsx');
