const fs = require('fs');
let b = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');
b = b.replace(/viewBox="-40 0 460 220"/g, 'viewBox="-60 0 480 220"');
fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', b, 'utf-8');
console.log("Updated viewBox successfully");
