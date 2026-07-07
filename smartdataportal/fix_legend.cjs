const fs = require('fs');
let b = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');
b = b.replace(/className="flex flex-col gap-3 ml-8"/g, 'className="flex flex-col gap-3 ml-8 w-[170px]"');
fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', b, 'utf-8');
console.log("Updated legend width to fix chart alignment.");
