const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
let content = fs.readFileSync(file, 'utf8');

const extractChartData = (tab) => {
    const idx = content.indexOf(`activeTab === '${tab}'`);
    if (idx === -1) {
        console.log(`TAB ${tab} not found.`);
        return;
    }
    let block = content.slice(idx, idx + 8000);
    const chartMatch = block.match(/Chart 2:[\s\S]*?\[([\s\S]*?)\]\.map\(\(item, idx\)/);
    if (chartMatch) {
        console.log(`=== TAB: ${tab} ===`);
        console.log(chartMatch[1]);
    } else {
        console.log(`=== TAB: ${tab} ===`);
        console.log('Chart data not found.');
    }
};

extractChartData('mobility');
extractChartData('data');
