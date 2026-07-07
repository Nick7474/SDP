const fs = require('fs');

const corruptedFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const targetFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corruptedFile, 'utf8');

// 1. Fix eaten `<` on closing tags!
// Any text followed by `/span>`, `/button>`, `/h2>`, `/h3>`, `/th>`, `/td>`, `/div>` without a `<` before it.
content = content.replace(/([^\s<])\s*\/(span|button|h2|h3|th|td|div|svg|tbody|table|tr)>/g, '$1</$2>');
// Also handle cases where there's just space before it
content = content.replace(/(^|[^<])\/(span|button|h2|h3|th|td|div|svg|tbody|table|tr)>/g, '$1</$2>');

// 2. Fix eaten `'` on string literals inside JS arrays/objects
content = content.replace(/label:\s*'([^']*?),/g, "label: '$1',");
content = content.replace(/name:\s*'([^']*?),/g, "name: '$1',");
content = content.replace(/item:\s*'([^']*?)\},/g, "item: '$1' },");
content = content.replace(/value:\s*'([^']*?)\},/g, "value: '$1' },");

// 3. Fix placeholders
content = content.replace(/placeholder="([^"]*?)className=/g, 'placeholder="$1" className=');

// 4. Fix string literals inside `{}` blocks: `{title || '...'}` or `{subtitle || '...'}`
content = content.replace(/\{title \|\| '([^']*?)\}/g, "{title || '$1'}");
content = content.replace(/\{subtitle \|\| '([^']*?)\}/g, "{subtitle || '$1'}");

// 5. Fix unclosed string literals in generic places
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Unterminated string literal like: `item: 'PM 2.5 ?도 }`
    if (line.includes("item: '") && !line.includes("' }") && line.includes("}")) {
        line = line.replace(/(\s*)\},$/, "' },");
    }
    
    // Fix unclosed elements
    if (line.includes('<h3') && !line.includes('</h3>') && line.includes('className')) {
        line += '</h3>';
    }
    
    // Fix unclosed button
    if (line.includes('<button') && line.includes('보기') && !line.includes('</button>')) {
        line += '</button>';
    }

    lines[i] = line;
}
content = lines.join('\n');

// 6. Fix `className="..."` followed by text then `</span>` but missing `>`
content = content.replace(/(className="[^"]*")\s*([^><]*?)<\/span>/g, '$1>$2</span>');

// 7. Fix `(13,190 嫄?` unclosed parenthesis
content = content.replace(/\([0-9,]+\s*[^<]*?(?=<\/span>|<\/td>|<\/div>)/g, (match) => {
    if (!match.includes(')')) return match + ')';
    return match;
});

// 8. Fix remaining `/td>` missing `<`
content = content.replace(/\/td>/g, '</td>').replace(/<<\/td>/g, '</td>');
content = content.replace(/\/th>/g, '</th>').replace(/<<\/th>/g, '</th>');
content = content.replace(/\/span>/g, '</span>').replace(/<<\/span>/g, '</span>');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed everything without stripping table bodies!');
