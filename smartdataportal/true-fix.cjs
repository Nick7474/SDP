const fs = require('fs');

const corruptedFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const targetFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corruptedFile, 'utf8');

// 1. Fix eaten `<` on closing tags!
// Any text followed by `/span>`, `/button>`, `/h2>`, `/h3>`, `/th>`, `/td>` without a `<` before it.
content = content.replace(/([^<])\/(span|button|h2|h3|th|td|div)>/g, '$1</$2>');

// 2. Fix eaten `'` on string literals inside JS arrays
content = content.replace(/label:\s*'([^']*?),/g, "label: '$1',");
content = content.replace(/name:\s*'([^']*?),/g, "name: '$1',");
content = content.replace(/item:\s*'([^']*?)\},/g, "item: '$1' },");
content = content.replace(/value:\s*'([^']*?)\},/g, "value: '$1' },");

// 3. Fix placeholders
content = content.replace(/placeholder="([^"]*?)className=/g, 'placeholder="$1" className=');

// 4. In case the regex in #1 misses some cases with whitespace:
content = content.replace(/([^<])\/(span|button|h2|h3|th|td|div)\s*>/g, '$1</$2>');

// 5. Replace table bodies to eliminate massive array corruption that might not be caught by regex #2
content = content.replace(/<tbody>[\s\S]*?<\/tbody>/g, '<tbody><tr><td colSpan={9} className="!text-center py-10">데이터 복구 필요</td></tr></tbody>');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('True fix applied.');
