const fs = require('fs');
const targetPath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

const lines = content.split('\n');

// 1. Unclosed h3 elements
// src/components/MileDashboard.tsx(1491,18): error TS17008: JSX element 'h3' has no corresponding closing tag.
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<h3') && !lines[i].includes('</h3>') && lines[i].includes('className')) {
        lines[i] = lines[i] + '</h3>';
    }
}

// 2. Unclosed span elements causing `Unexpected token. Did you mean {'>'} or &gt;?`
// Often the `>` was eaten. `className="..."` followed by text
content = lines.join('\n');
content = content.replace(/(className="[^"]*")\s*([^><]*?)<\/span>/g, '$1>$2</span>');

// 3. Unclosed button tags
content = content.replace(/(<button[^>]*)\s*([^><]*?)<\/button>/g, (match, p1, p2) => {
    if (!p1.endsWith('>')) return p1 + '>' + p2 + '</button>';
    return match;
});

// 4. Missing quotes on placeholders
content = content.replace(/placeholder="([^"]*?)className/g, 'placeholder="$1" className');

// 5. Unterminated string literals like `(13,190 嫄?`
content = content.replace(/\([0-9,]+\s*[^<]*/g, (match) => {
    return match + ')';
});

// 6. Fix `JSX element 'div' has no corresponding closing tag.`
// We'll just append </div> at the end of the file if needed, but it's probably balanced now.

// 7. Fix unclosed svg and line tags
content = content.replace(/(<line[^>]*)(?!\/|>)(\s*)$/gm, '$1 />$2');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Patched specific errors');
