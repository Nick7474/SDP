const fs = require('fs');

const filePath = 'c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const startLine = 401; // 0-indexed, so line 402 is index 401
const endLine = 511; // 0-indexed, so line 512 is index 511

const replacement = `      {/* Charts Row */}
      <div className="flex gap-6 mb-12">
        {/* Chart 1: Line Chart */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.line.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.01~2026.05</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-40 0 460 220" className="w-full h-full overflow-visible">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const val = currentData.charts.line.max * ratio;
                const y = 180 - (ratio * 140);
                return (
                  <g key={idx}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val === 0 ? 0 : val.toLocaleString()}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-1)" strokeWidth="1" />
                  </g>
                );
              })}
              <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#464C53">{currentData.charts.line.unit}</text>
              {currentData.charts.line.labels.map((label: string, idx: number) => (
                <text key={label} x={35 + idx * 85} y="206" textAnchor="middle" fontSize="12" fill="#464C53">{label}</text>
              ))}
              
              <path d={\`M \${currentData.charts.line.data.map((val: number, idx: number) => \`\${35 + idx * 85} \${180 - ((val / currentData.charts.line.max) * 140)}\`).join(' L ')}\`} fill="none" stroke="var(--light-primary-500)" strokeWidth="2" />
              {currentData.charts.line.data.map((val: number, idx: number) => (
                <circle key={idx} cx={35 + idx * 85} cy={180 - ((val / currentData.charts.line.max) * 140)} r="4" fill="var(--light-primary-500)" />
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Bar Chart */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.bar.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-40 0 460 220" className="w-full h-full overflow-visible">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const val = currentData.charts.bar.max * ratio;
                const y = 180 - (ratio * 140);
                return (
                  <g key={idx}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val === 0 ? 0 : val.toLocaleString()}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-light)" strokeWidth="1" />
                  </g>
                );
              })}
              {currentData.charts.bar.data.map((item: any, idx: number) => {
                const x = 45 + (idx * 80);
                const h = (item.val / currentData.charts.bar.max) * 140;
                const y = 180 - h;
                const lines = item.label.split(' ');
                return (
                  <g key={item.label}>
                    <rect x={x - 15} y={y} width="30" height={h} fill="var(--gp-point)" rx="2" />
                    <rect x={x - 22} y={y - 20} width="44" height="16" fill="white" stroke="var(--border-1)" strokeWidth="1" rx="2" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{item.val.toLocaleString()}</text>
                    <text x={x} y="204" textAnchor="middle" fontSize="12" fill="#464C53">{lines[0]}</text>
                    <text x={x} y="222" textAnchor="middle" fontSize="12" fill="#464C53">{lines[1] || ''}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Donut Chart */}
        <div className="w-[420px] shrink-0 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.donut.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-6 mt-2 pl-[16px]">
            <div className="relative w-[180px] h-[180px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke={currentData.charts.donut.items[1].color} strokeWidth="20" />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" stroke={currentData.charts.donut.items[0].color} strokeWidth="20" 
                  strokeDasharray={\`\${currentData.charts.donut.items[0].val * 2.51} 251\`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold" style={{ pointerEvents: 'none' }}>
                <span className="text-[16px] absolute top-[28px] left-[32px]">{currentData.charts.donut.items[0].val}%</span>
                <span className="text-[14px] absolute bottom-[40px] right-[24px] text-white/90">{currentData.charts.donut.items[1].val}%</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {currentData.charts.donut.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] text-[var(--fg-2)] font-medium">
                    {item.label} <strong className="text-[var(--fg-1)] ml-1">{item.val}%</strong>
                    <span className="text-[var(--fg-4)] font-normal ml-1">({item.unit})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>`;

lines.splice(startLine, endLine - startLine + 1, replacement);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed charts row successfully!');
