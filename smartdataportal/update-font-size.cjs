const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components';
const files = ['CityDataMap.tsx', 'MileDataMap.tsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text-[XXpx] with text-[13px] for the date text
  // The date texts might be "26년 03월 기준" or similar, usually inside a span with text-[#7C8896]
  
  // We'll target: className="text-[12px] font-normal text-[#7C8896]" or text-[13px] or text-[14px] etc.
  // right before ">26년" or ">"
  content = content.replace(/className="text-\[\d+px\] font-normal text-\[#7C8896\]">(\d+년 \d+월 기준)<\/span>/g, 'className="text-[13px] font-normal text-[#7C8896]">$1</span>');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Font size updated to 13px for all panels in CityDataMap and MileDataMap.');
