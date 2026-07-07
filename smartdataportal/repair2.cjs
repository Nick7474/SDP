const fs = require('fs');

const filePath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The headers
content = content.replace(/<th className="w-\[80px\] !text-center">.*?<\/th>/g, '<th className="w-[80px] !text-center">번호</th>');
content = content.replace(/<th className="text-left w-\[240px\]">.*?<\/th>/g, '<th className="text-left w-[240px]">데이터명</th>');
content = content.replace(/<th className="w-\[120px\] !text-center">분야<\/th>/g, '<th className="w-[120px] !text-center">분야</th>');
content = content.replace(/<th className="w-\[120px\] !text-center">[^<]*?\/th>/g, '<th className="w-[120px] !text-center">지표</th>');
content = content.replace(/<th className="w-\[160px\] !text-center">.*?<\/th>/g, '<th className="w-[160px] !text-center">데이터 항목</th>');
content = content.replace(/<th className="w-\[100px\] !text-center">.*?<\/th>/g, '<th className="w-[100px] !text-center">형식</th>');
content = content.replace(/<th className="w-\[120px\] !text-center">기[^<]*?\/th>/g, '<th className="w-[120px] !text-center">기준일</th>');

// The missing < in closing tags
content = content.replace(/광명시\/td>/g, '광명시</td>');
content = content.replace(/광명[^<]*?\/td>/g, '광명시</td>');
content = content.replace(/광명[^<]*?<\/td>/g, '광명시</td>');
content = content.replace(/<td className="!text-center">\?[^<]*?<\/td>/g, '<td className="!text-center">환경·기후</td>');

// Syntax errors with missing quotes
// Example: { id: '99', name: '광명???미세먼? 측정 ?이??, item: 'PM 2.5 ?도' },
content = content.replace(/name:\s*'[^']*,/g, (match) => {
    // If it matches `name: 'something,` without a closing quote before the comma, add it.
    if ((match.match(/'/g) || []).length === 1) {
        return match.replace(/,$/, "',");
    }
    return match;
});

content = content.replace(/item:\s*'[^']*},/g, (match) => {
    // If it matches `item: 'something },` without a closing quote, add it.
    if ((match.match(/'/g) || []).length === 1) {
        return match.replace(/ \},$/, "' },");
    }
    return match;
});

// Also fix some specific broken tags from earlier tsc output:
content = content.replace(/<span([^>]*?)>\s*([0-9\.]+)\s*<\/span\s*/g, '<span$1>$2</span>');
content = content.replace(/<button([^>]*?)>\s*보기\s*<\/button\s*/g, '<button$1>보기</button>');

// Let's just fix any unclosed span
// If there's `<span className="text-[14px] font-medium text-[var(--fg-4)] leading-none">μg/m³` without `</span>`
content = content.replace(/(<span[^>]*>[^<]*)<\/div>/g, (match, p1) => {
    if (!p1.includes('</span>') && p1.includes('<span')) {
        return p1 + '</span></div>';
    }
    return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Repaired pass 2!');
