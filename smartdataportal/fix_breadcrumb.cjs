const fs = require('fs');
let appCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', 'utf-8');

appCode = appCode.replace(/\{currentPage === 'map' \? \([\s\S]*?<\/>\s*\) : \(/, 
`{currentPage === 'map' || currentPage === 'cityMap' ? (
                <>
                  <span className="leading-none text-[var(--fg-3)]">데이터 지도</span>
                  <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                  <span className="leading-none text-[var(--gp-primary)] font-semibold">
                    {currentPage === 'map' ? '마일별 데이터' : '광명시 데이터'}
                  </span>
                </>
              ) : (`);

// Clean up the inner else branch string just in case
appCode = appCode.replace(
  /\{currentPage === 'intro' \? '사업소개' : currentPage === 'archive' \? '자료실' : '광명시 데이터'\}/,
  "{currentPage === 'intro' ? '사업소개' : '자료실'}"
);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', appCode, 'utf-8');
console.log('Fixed breadcrumb for cityMap.');
