const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Mobility & Traffic
content = content.replace(
  /label: '광명역 통행량', val: '250', height: 160 \}/g,
  "label: '광명역 통행량', val: '250', height: 160 },\n        { label: '학온사거리 통행량', val: '190', height: 120 }"
);

// Data
content = content.replace(
  /label: '시민참여 데이터', val: '120', height: 80 \}/,
  "label: '시민참여 데이터', val: '120', height: 80 },\n        { label: '공간정보 활용', val: '180', height: 115 }"
);

fs.writeFileSync(file, content, 'utf8');
console.log('5th chart item added for mobility, traffic, and data!');
