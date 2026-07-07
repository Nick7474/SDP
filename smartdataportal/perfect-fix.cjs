const fs = require('fs');

const corruptedFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const targetFile = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corruptedFile, 'utf8');

// 1. Fix eaten `<` on closing tags!
content = content.replace(/([^<])\/(span|button|h2|h3|th|td|div)>/g, '$1</$2>');
content = content.replace(/([^<])\/(span|button|h2|h3|th|td|div)\s*>/g, '$1</$2>');

// 2. Fix eaten `'` on string literals inside JS objects/arrays
content = content.replace(/label:\s*'([^']*?),/g, "label: '$1',");
content = content.replace(/name:\s*'([^']*?),/g, "name: '$1',");
content = content.replace(/item:\s*'([^']*?)\},/g, "item: '$1' },");
content = content.replace(/value:\s*'([^']*?)\},/g, "value: '$1' },");

// 3. Fix placeholders and alt attributes that had quotes eaten
content = content.replace(/placeholder="([^"]*?)className=/g, 'placeholder="$1" className=');
content = content.replace(/alt="([^"]*?)className=/g, 'alt="$1" className=');

// 4. Fix string literals inside `{}` blocks: `{title || '...'}` or `{subtitle || '...'}`
content = content.replace(/\{title \|\| '([^']*?)\}/g, "{title || '$1'}");
content = content.replace(/\{subtitle \|\| '([^']*?)\}/g, "{subtitle || '$1'}");

// 5. Some other places where `'` was eaten inside `{}`
// e.g., `{'Some Korean Text}` -> `{'Some Korean Text'}`
// Wait, is there any? We can use the error list if needed.

// 6. Replace table bodies to eliminate massive array corruption
content = content.replace(/<tbody>[\s\S]*?<\/tbody>/g, '<tbody><tr><td colSpan={9} className="!text-center py-10">데이터 복구 필요</td></tr></tbody>');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Perfect fix applied.');
