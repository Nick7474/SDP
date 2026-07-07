const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', 'utf-8');

// Replace all activeTabProp back to activeTab
code = code.replace(/activeTabProp/g, 'activeTab');

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', code, 'utf-8');
console.log('Fixed ReferenceError for activeTabProp');
