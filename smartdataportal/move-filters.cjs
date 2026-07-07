const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original header block
const headerRegex = /\{\/\* Dashboard Header \*\/\}\s*<div className="mb-\[40px\] flex flex-col gap-\[8px\]">\s*<h2 className="text-\[28px\] font-bold text-\[var\(--fg-1\)\]">\{title \|\| '마일별 상세 데이터'\}<\/h2>\s*<p className="text-\[16px\] text-\[var\(--fg-3\)\]">\{subtitle \|\| '선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다\.'\}<\/p>\s*<\/div>/;

// The new combined header block
const newHeaderBlock = `{/* Dashboard Header & Filters */}
      <div className="mb-[40px] flex items-end justify-between">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[28px] font-bold text-[var(--fg-1)]">{title || '마일별 상세 데이터'}</h2>
          <p className="text-[16px] text-[var(--fg-3)]">{subtitle || '선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다.'}</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-[40px] relative pb-1">
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">기간 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[260px]">
              <span className="text-[14px]">2026-10-10 &nbsp;-&nbsp; 2026-11-10</span>
              <Calendar size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">지역 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[140px]">
              <span className="text-[14px]">광명역세권</span>
              <ChevronDown size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
        </div>
      </div>`;

// Replace header
content = content.replace(headerRegex, newHeaderBlock);

// Remove the filters from the tabs row
const filtersRegex = /\{\/\* Filters \*\/\}\s*<div className="flex items-center gap-\[40px\] relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Wait, the filtersRegex is tricky because it ends with double </div>.
// Let's replace the whole "Tab Menu & Filters" row up to the end of filters.
const tabRowRegex = /\{\/\* Tab Menu & Filters \*\/\}\s*<div className="flex items-center justify-between mb-\[32px\]">([\s\S]*?)\{\/\* Filters \*\/\}\s*<div className="flex items-center gap-\[40px\] relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Let's use a simpler string replace since we know the exact content.
const oldTabsStart = `{/* Tab Menu & Filters */}
      <div className="flex items-center justify-between mb-[32px]">`;
const newTabsStart = `{/* Tab Menu */}
      <div className="flex mb-[32px]">`;

content = content.replace(oldTabsStart, newTabsStart);

const oldFiltersBlock = `        {/* Filters */}
        <div className="flex items-center gap-[40px] relative">
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">기간 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[260px]">
              <span className="text-[14px]">2026-10-10 &nbsp;-&nbsp; 2026-11-10</span>
              <Calendar size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">지역 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[140px]">
              <span className="text-[14px]">광명역세권</span>
              <ChevronDown size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
        </div>
      </div>`;

const newFiltersBlock = `      </div>`;

content = content.replace(oldFiltersBlock, newFiltersBlock);

fs.writeFileSync(file, content, 'utf8');
console.log('Filters moved to title line!');
