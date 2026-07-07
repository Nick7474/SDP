const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const safetyStart = code.indexOf("activeTab === 'safety' && (");
const dataStart = code.indexOf("activeTab === 'data' && (");

if (safetyStart !== -1 && dataStart !== -1) {
  let safetyBlock = code.substring(safetyStart, dataStart);
  
  // The first '상계' in the safetyBlock should be changed to '스마트 폴'
  safetyBlock = safetyBlock.replace('<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">상계</span>', '<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">스마트 폴</span>');
  
  // The first '거래' in the safetyBlock should be changed to '기타'
  safetyBlock = safetyBlock.replace('<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">거래</span>', '<span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">기타</span>');
  
  // Update the title to '위험 감지 유형 비율'
  safetyBlock = safetyBlock.replace('스마트 폴/기타 비율', '위험 감지 유형 비율');
  
  code = code.substring(0, safetyStart) + safetyBlock + code.substring(dataStart);
  
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
  console.log('Successfully updated Safety donut chart text.');
} else {
  console.log('Failed to find blocks.');
}
