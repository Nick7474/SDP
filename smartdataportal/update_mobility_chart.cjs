const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const mobilityStart = code.indexOf("activeTab === 'mobility' && (");
const safetyStart = code.indexOf("activeTab === 'safety' && (");

if (mobilityStart !== -1 && safetyStart !== -1) {
  let mobilityBlock = code.substring(mobilityStart, safetyStart);
  
  mobilityBlock = mobilityBlock.replace('EV-DRT/거래 비율', '이동 수단 비율');
  
  // The first '상계' in the mobilityBlock should be changed to 'EV-DRT'
  mobilityBlock = mobilityBlock.replace('<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">상계</span>', '<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">EV-DRT</span>');
  
  code = code.substring(0, mobilityStart) + mobilityBlock + code.substring(safetyStart);
  
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
  console.log('Successfully updated Mobility donut chart text.');
} else {
  console.log('Failed to find blocks.');
}
