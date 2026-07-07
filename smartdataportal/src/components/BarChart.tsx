import React from 'react';

interface BarChartProps {
  title: string;
  dateLabel: string;
  data: { label: string; val: number }[];
  yAxisTicks: number[];
  maxValue: number;
  yAxisUnit?: string;
}

export default function BarChart({ title, dateLabel, data, yAxisTicks, maxValue, yAxisUnit }: BarChartProps) {
  return (
    <div className="w-[464px] shrink-0 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{title}</h3>
        <span className="text-[13px] font-normal text-[var(--fg-4)]">{dateLabel}</span>
      </div>
      <div className="flex-1 relative w-full h-full mt-2">
        <svg viewBox="-60 -25 480 255" className="w-full h-full overflow-visible">
          {yAxisUnit && (
            <text x="-10" y="-12" textAnchor="end" fontSize="11" fill="var(--fg-3)">{yAxisUnit}</text>
          )}
          {yAxisTicks.map((val, idx) => {
            const gap = 180 / (yAxisTicks.length - 1);
            const y = 180 - (idx * gap);
            return (
              <g key={val}>
                <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val.toLocaleString()}</text>
                <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-1)" strokeWidth="1" />
              </g>
            );
          })}
          {data.map((item, idx) => {
            const x = 45 + (idx * 80);
            const h = (item.val / maxValue) * 140;
            const y = 180 - h;
            const lines = item.label.split(' ');
            
            const displayVal = item.val.toLocaleString();
            
            return (
              <g key={item.label}>
                <rect x={x - 15} y={y} width="30" height={h} fill="var(--gp-point)" rx="2" />
                <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{displayVal}</text>
                
                <text x={x} y="204" textAnchor="middle" fontSize="12" fill="#464C53">{lines[0]}</text>
                <text x={x} y="222" textAnchor="middle" fontSize="12" fill="#464C53">{lines[1] || ''}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
