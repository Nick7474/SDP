const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');

const dataStart = code.indexOf("activeTab === 'data' && (");

if (dataStart !== -1) {
  let dataBlock = code.substring(dataStart);
  
  // Replace the first '서비스별 이용량 비교' in the dataBlock
  dataBlock = dataBlock.replace('title="서비스별 이용량 비교"', 'title="시스템별 연계 데이터 비교"');
  
  code = code.substring(0, dataStart) + dataBlock;
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf-8');
  console.log('Successfully updated title for Data Mile BarChart.');
} else {
  console.log('Could not locate data block.');
}
