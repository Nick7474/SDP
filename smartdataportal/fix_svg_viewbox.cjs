const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

// 1. Line Chart viewBox fixes (Energy, Mobility, Safety)
// Energy: viewBox="-30 0 420 220"
code = code.replace(/viewBox="-30 0 420 220"/g, 'viewBox="-50 0 440 220"');

// 2. Add yAxisUnit to BarCharts
// Energy
code = code.replace(
  '<BarChart \n          title="발전소별 생산량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={250}',
  '<BarChart \n          title="발전소별 생산량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={250}\n          yAxisUnit="(MWh)"'
);

// Mobility
code = code.replace(
  '<BarChart \n          title="서비스별 이용량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={4000}',
  '<BarChart \n          title="서비스별 이용량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={4000}\n          yAxisUnit="(명)"'
);

// Safety
// First verify if Safety has BarChart already inside the file, since I generated it via node script.
// It should be `<BarChart \n          title="서비스별 이용량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={2000}`
code = code.replace(
  '<BarChart \n          title="서비스별 이용량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={2000}',
  '<BarChart \n          title="서비스별 이용량 비교"\n          dateLabel="2026.05 기준"\n          maxValue={2000}\n          yAxisUnit="(건)"'
);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
console.log('Successfully updated MileDashboard.tsx with viewBox and yAxisUnit fixes.');
