const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const mobilityStartMarker = "{activeTab === 'mobility' && (";
const startIndex = code.indexOf(mobilityStartMarker);

// Find `      )}\n\n\n    </div>`
const endMarker = '    </div>\r\n  );\r\n}';
let endIndex = code.lastIndexOf(endMarker);
if (endIndex === -1) endIndex = code.lastIndexOf('    </div>\n  );\n}');

const mobilityContentBlock = code.substring(startIndex, endIndex);

let safetyContentBlock = mobilityContentBlock.replace("{activeTab === 'mobility' && (", "{activeTab === 'safety' && (");

// 1. KPI Cards
safetyContentBlock = safetyContentBlock.replace('ic_dash_bus.svg', 'ic_dash_alarm.svg');
safetyContentBlock = safetyContentBlock.replace(/총 운행량/g, '총 감지건수');
safetyContentBlock = safetyContentBlock.replace('12,480', '27,480');
safetyContentBlock = safetyContentBlock.replace('>회<', '>건<');

safetyContentBlock = safetyContentBlock.replace('ic_dash_profile.svg', 'ic_dash_emergency.svg');
safetyContentBlock = safetyContentBlock.replace(/이용자 수/g, '긴급 대응 건수');
safetyContentBlock = safetyContentBlock.replace('>168<', '>15<');
safetyContentBlock = safetyContentBlock.replace('>명<', '>건<');

safetyContentBlock = safetyContentBlock.replace('ic_dash_coverage.svg', 'ic_dash_location.svg');
safetyContentBlock = safetyContentBlock.replace(/운행 커버리지/g, '위험지역 모니터링');
safetyContentBlock = safetyContentBlock.replace('>92<', '>24<');
safetyContentBlock = safetyContentBlock.replace('>%<', '>개소<');

// 2. Charts
// Chart 1
safetyContentBlock = safetyContentBlock.replace('월별 운행횟수 추이', '월별 안전 이벤트 추이');
safetyContentBlock = safetyContentBlock.replace('(명)', '(건)');
safetyContentBlock = safetyContentBlock.replace(
  '{[0, 2000, 4000, 6000, 8000, 10000].map((val, idx) => {\\n                const y = 180 - (idx * 28);',
  '{[0, 100, 200, 300, 400].map((val, idx) => {\\n                const y = 180 - (idx * 40);'
);
safetyContentBlock = safetyContentBlock.replace('M 35 152 L 120 138 L 205 110 L 290 107 L 375 82', 'M 35 140 L 120 120 L 205 85 L 290 75 L 375 45');
safetyContentBlock = safetyContentBlock.replace(
  `[
                { val: '2,000', y: 152 },
                { val: '3,000', y: 138 },
                { val: '5,000', y: 110 },
                { val: '5,200', y: 107 },
                { val: '7,000', y: 82 }
              ]`,
  `[
                { val: '100', y: 140 },
                { val: '150', y: 120 },
                { val: '240', y: 85 },
                { val: '260', y: 75 },
                { val: '340', y: 45 }
              ]`
);
safetyContentBlock = safetyContentBlock.replace('{val === 0 ? 0 : val.toLocaleString()}', '{val}');

// Chart 2 BarChart
safetyContentBlock = safetyContentBlock.replace('maxValue={4000}', 'maxValue={2000}');
safetyContentBlock = safetyContentBlock.replace(
  'yAxisTicks={[0, 1000, 2000, 3000, 4000]}',
  'yAxisTicks={[0, 500, 1000, 1500, 2000]}'
);
safetyContentBlock = safetyContentBlock.replace(
  `data={[
            { label: '친환경 EV-DRT', val: 3400 },
            { label: '공공자전거', val: 1010 },
            { label: '스마트 주차', val: 2470 },
            { label: '전기차 충전', val: 1500 },
            { label: '교통정보 안내', val: 2520 }
          ]}`,
  `data={[
            { label: '스마트폴', val: 1520 },
            { label: '스마트 CCTV', val: 1210 },
            { label: '비상벨', val: 820 },
            { label: '보행안전 감지', val: 410 },
            { label: '침수 감지', val: 120 }
          ]}`
);

// Chart 3 Donut Chart
safetyContentBlock = safetyContentBlock.replace('위험 감지 유형 비율', '위험 감지 유형 비율'); // previously already changed in my thought but not here, let's fix:
safetyContentBlock = safetyContentBlock.replace('이동 수단 비율', '위험 감지 유형 비율');
safetyContentBlock = safetyContentBlock.replace('EV-DRT', '스마트 폴');
safetyContentBlock = safetyContentBlock.replace('(17,037 건)', '(17,037 건)'); // It was '(217 MWh)'
safetyContentBlock = safetyContentBlock.replace('(217 MWh)', '(17,037 건)');
safetyContentBlock = safetyContentBlock.replace('기타', '기타'); // Just in case, wait, mobility has "거래" currently! Let me replace "거래" with "기타".
safetyContentBlock = safetyContentBlock.replace('거래', '기타');
safetyContentBlock = safetyContentBlock.replace('(10,443 건)', '(10,443 건)');
safetyContentBlock = safetyContentBlock.replace('(135 MWh)', '(10,443 건)');

// Change stroke and bg color for the green part to orange
safetyContentBlock = safetyContentBlock.replace('stroke="var(--status-success)"', 'stroke="#FFAE1A"');
safetyContentBlock = safetyContentBlock.replace('bg-[var(--status-success)]', 'bg-[#FFAE1A]');

// 4. Data Table
safetyContentBlock = safetyContentBlock.replace(/광명역 EV-DRT 운행데이터/g, '광명역 스마트 폴 감지 데이터');
safetyContentBlock = safetyContentBlock.replace(/모빌리티/g, '세이프티');
safetyContentBlock = safetyContentBlock.replace(/친환경 EV-DRT 버스/g, '스마트 폴');
safetyContentBlock = safetyContentBlock.replace(/운행횟수/g, '감지 건수');

const newCode = code.substring(0, endIndex) +
  safetyContentBlock + "\n" +
  code.substring(endIndex);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', newCode, 'utf-8');
console.log('Successfully added Safety Mile to MileDashboard.tsx');
