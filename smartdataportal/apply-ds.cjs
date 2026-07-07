const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\DataList.tsx';
let content = fs.readFileSync(file, 'utf8');

// Search Buttons
content = content.replace(
  'className="w-[120px] h-[56px] bg-[var(--gp-primary)] text-white rounded-[8px] font-bold text-[16px] transition-colors hover:bg-[#093d7a]"',
  'className="gp-btn gp-btn--lg gp-btn--primary w-[120px]"'
);
content = content.replace(
  'className="px-[20px] h-[56px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] font-medium flex items-center justify-center gap-2 hover:bg-slate-50"',
  'className="gp-btn gp-btn--lg gp-btn--secondary px-[20px]"'
);
content = content.replace(
  'className="px-[20px] h-[56px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] font-medium flex items-center justify-center gap-2 hover:bg-slate-50"',
  'className="gp-btn gp-btn--lg gp-btn--secondary px-[20px]"'
); // replace second one too

// Toolbar buttons
content = content.replace(
  'className="px-[16px] h-[40px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] text-[14px] font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors"',
  'className="gp-btn gp-btn--h40 gp-btn--secondary px-[16px]"'
);
content = content.replace(
  'className="px-[16px] h-[40px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] text-[14px] font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors"',
  'className="gp-btn gp-btn--h40 gp-btn--secondary px-[16px]"'
);
content = content.replace(
  'className="px-[16px] h-[40px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] text-[14px] font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors"',
  'className="gp-btn gp-btn--h40 gp-btn--secondary px-[16px]"'
);

// Table Badges
const badgeCode = `                <div className="flex justify-center">
                  <span className={\`gp-badge \${
                    item.scope === '공개' ? 'gp-badge--open' : 
                    item.scope === '요청시' ? 'gp-badge--request' : 
                    'gp-badge--limited'
                  }\`}>
                    {item.scope}
                  </span>
                </div>`;
                
content = content.replace(
  /                <div className="flex justify-center">\s+<span className=\{`px-\[12px\].*?`\}>\s+\{item\.scope\}\s+<\/span>\s+<\/div>/s,
  badgeCode
);

// Table Action Buttons
content = content.replace(
  'className="px-[14px] py-[6px] border border-[#D5D9E0] rounded-[6px] text-[#36445A] text-[13px] font-medium hover:bg-slate-50 transition-colors"',
  'className="gp-btn gp-btn--sm gp-btn--secondary"'
);
content = content.replace(
  'className="px-[14px] py-[6px] border border-[var(--gp-primary)] rounded-[6px] text-[var(--gp-primary)] text-[13px] font-bold flex items-center gap-1.5 hover:bg-[var(--gp-primary-soft)] transition-colors"',
  'className="gp-btn gp-btn--sm gp-btn--ghost"'
);

// Popular cards file tags
content = content.replace(
  '<span className="text-[12px] border border-[#D5D9E0] px-1.5 py-0.5 rounded text-[#36445A]">API</span>',
  '<span className="gp-filetag gp-filetag--api">API</span>'
);
content = content.replace(
  '<span className="text-[12px] border border-[#D5D9E0] px-1.5 py-0.5 rounded text-[#36445A]">CSV</span>',
  '<span className="gp-filetag gp-filetag--csv">CSV</span>'
);
content = content.replace(
  '<span className="text-[12px] border border-[#D5D9E0] px-1.5 py-0.5 rounded text-[#36445A]">API</span>',
  '<span className="gp-filetag gp-filetag--api">API</span>'
);
content = content.replace(
  '<span className="text-[12px] border border-[#D5D9E0] px-1.5 py-0.5 rounded text-[#36445A]">CSV</span>',
  '<span className="gp-filetag gp-filetag--csv">CSV</span>'
);

// Footer CTA buttons
content = content.replace(
  'className="px-[24px] h-[48px] bg-[var(--gp-primary)] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#093d7a] transition-colors"',
  'className="gp-btn gp-btn--primary px-[24px]"'
);
content = content.replace(
  'className="px-[24px] h-[48px] bg-white border border-[#D5D9E0] text-[#36445A] rounded-[8px] font-bold text-[15px] hover:bg-slate-50 transition-colors flex items-center gap-2"',
  'className="gp-btn gp-btn--secondary px-[24px]"'
);


fs.writeFileSync(file, content, 'utf8');
console.log('Design system applied!');
