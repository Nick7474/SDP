const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace KPIs
const kpiRegex = /<div className="w-full h-\[120px\] bg-white border border-\[var\(--border-light\)\] rounded-\[12px\] mb-6 flex items-center justify-between px-\[40px\] shadow-none">[\s\S]*?(?=\{\/\* Charts Row \*\/\}|<div className="flex gap-6 mb-12">)/;

const newKpiBlock = `<div className="w-full h-[120px] bg-white border border-[var(--border-light)] rounded-[12px] mb-6 flex items-center justify-between px-[40px] shadow-none">
        {currentData.kpis.map((kpi: any, idx: number) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-4 flex-1">
              <img src={kpi.icon} alt={kpi.label} className="w-[48px] h-[48px] shrink-0" onError={(e) => { e.currentTarget.src = "/icons/ic_dash_gen.svg"; }} />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[var(--fg-3)] leading-tight mb-1">{kpi.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-[var(--fg-1)] leading-none">{kpi.value}</span>
                  <span className="text-[14px] font-medium text-[var(--fg-4)] leading-none">{kpi.unit}</span>
                </div>
              </div>
            </div>
            {idx < currentData.kpis.length - 1 && <div className="h-[28px] w-[1px] bg-[var(--border-1)] shrink-0 ml-auto mr-auto" />}
          </React.Fragment>
        ))}
      </div>
      `;

content = content.replace(kpiRegex, newKpiBlock);

// 2. Replace Chart Array
content = content.replace(
  /\[\s*\{\s*label:\s*'광명역 태양광'[\s\S]*?\]\.map/, 
  'currentData.chartData.map'
);

fs.writeFileSync(file, content, 'utf8');
console.log('KPI and Chart fixed!');
