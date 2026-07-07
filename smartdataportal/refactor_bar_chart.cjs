const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

// Add import
if (!code.includes("import BarChart from './BarChart';")) {
  code = code.replace("import { Calendar", "import BarChart from './BarChart';\nimport { Calendar");
}

// Energy Bar Chart
const energyBarChartStart = code.indexOf('{/* Chart 2: 발전소별 생산량 비교 (Bar Chart) */}');
const energyBarChartEnd = code.indexOf('</div>', code.indexOf('</svg>', energyBarChartStart)) + 6;
// There are two closing divs after svg. Let's find the correct end.
// We can just use regex.
const energyRegex = /\{\/\* Chart 2: 발전소별 생산량 비교 \(Bar Chart\) \*\/\}\s*<div className="flex-1[\s\S]*?<\/div>\s*<\/div>/;
const mobilityRegex = /\{\/\* Chart 2: 서비스별 이용량 비교 \(Bar Chart\) \*\/\}\s*<div className="flex-1[\s\S]*?<\/div>\s*<\/div>/;

const newEnergyBarChart = `{/* Chart 2: 발전소별 생산량 비교 (Bar Chart) */}
        <BarChart 
          title="발전소별 생산량 비교"
          dateLabel="2026.05 기준"
          maxValue={250}
          yAxisTicks={[0, 50, 100, 150, 200, 250]}
          data={[
            { label: '광명역 태양광', val: 170 },
            { label: '광명스카이돔 태양광', val: 110 },
            { label: '철산동 태양광', val: 130 },
            { label: '소하동 태양광', val: 110 },
            { label: '일직동 태양광', val: 150 }
          ]}
        />`;

const newMobilityBarChart = `{/* Chart 2: 서비스별 이용량 비교 (Bar Chart) */}
        <BarChart 
          title="서비스별 이용량 비교"
          dateLabel="2026.05 기준"
          maxValue={4000}
          yAxisTicks={[0, 1000, 2000, 3000, 4000]}
          data={[
            { label: '친환경 EV-DRT', val: 3400 },
            { label: '공공자전거', val: 1010 },
            { label: '스마트 주차', val: 2470 },
            { label: '전기차 충전', val: 1500 },
            { label: '교통정보 안내', val: 2520 }
          ]}
        />`;

code = code.replace(energyRegex, newEnergyBarChart);
code = code.replace(mobilityRegex, newMobilityBarChart);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
console.log('Successfully updated MileDashboard.tsx');
