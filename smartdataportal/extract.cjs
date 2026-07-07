const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
let content = fs.readFileSync(file, 'utf8');

const tabs = ['energy', 'population', 'economy', 'mobility', 'traffic', 'safety', 'data', 'climate', 'environment', 'public'];

tabs.forEach(tab => {
    const idx = content.indexOf(`activeTab === '${tab}'`);
    if (idx === -1) return;
    
    console.log(`\n=== TAB: ${tab} ===`);
    let block = content.slice(idx, idx + 8000); // Take a chunk
    
    // Find KPI block
    const kpiMatch = block.match(/<div className="w-full h-\[120px\] bg-white border border-\[var\(--border-light\)\] rounded-\[12px\] mb-6 flex items-center justify-between px-\[40px\] shadow-none">([\s\S]*?)(?=<!-- Charts Row -->|<div className="flex gap-6 mb-12">)/);
    
    if (kpiMatch) {
        const kpiHtml = kpiMatch[1];
        const items = kpiHtml.split(/<div className="h-\[28px\] w-\[1px\] bg-\[var\(--border-1\)\] shrink-0" \/>/);
        
        items.forEach((item, i) => {
            const iconMatch = item.match(/src="([^"]+)"/);
            const valMatch = item.match(/<span className="text-\[28px\][^>]*>([^<]+)<\/span>/);
            const unitMatch = item.match(/<span className="text-\[14px\] font-medium text-\[var\(--fg-4\)\] leading-none">([^<]+)<\/span>/);
            const colorMatch = item.match(/text-\[var\(--([^\)]+)\)\]/);
            const labelMatch = item.match(/<span className="text-\[14px\] font-medium text-\[var\(--fg-3\)\] leading-tight mb-1">([^<]+)<\/span>/);
            
            let color = '';
            if (item.includes('var(--status-success)')) color = 'var(--status-success)';
            else if (item.includes('var(--gp-primary)')) color = 'var(--gp-primary)';
            else if (item.includes('var(--status-warning)')) color = 'var(--status-warning)';
            
            console.log(`  KPI ${i+1}: icon=${iconMatch?.[1]} val=${valMatch?.[1]} unit=${unitMatch?.[1] || ''} color=${color} labelRaw=${labelMatch?.[1]}`);
        });
    } else {
        console.log("  KPI block not found");
    }
});
