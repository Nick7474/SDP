const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// population
content = content.replace(
  /label: '소하동 인구', val: '180', height: 110 \}/,
  "label: '소하동 인구', val: '180', height: 110 },\n        { label: '학온동 인구', val: '150', height: 95 }"
);

// climate
content = content.replace(
  /label: '소하동 탄소배출', val: '140', height: 90 \}/,
  "label: '소하동 탄소배출', val: '140', height: 90 },\n        { label: '학온동 탄소배출', val: '110', height: 70 }"
);

// public
content = content.replace(
  /label: '소하동 공공시설', val: '85', height: 55 \}/,
  "label: '소하동 공공시설', val: '85', height: 55 },\n        { label: '학온동 공공시설', val: '60', height: 40 }"
);

fs.writeFileSync(file, content, 'utf8');
console.log('5th chart items added for population, climate, and public!');
