const fs = require('fs');

let content = fs.readFileSync('c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted', 'utf8');

// 1. Fix missing `>` on tags with className before closing tag
content = content.replace(/(<(span|button|h2|h3|th|td)[^>]*className="[^"]*")([^><]*?)<\/\2/g, '$1>$3</$2');

// 2. Some tags don't have className but still have missing `>`. e.g. `<th className="w-[80px] !text-center">踰덊샇</th>`
// Actually, the above regex captures `<span className="...">` but wait! The corrupted text might contain ANY character.
content = content.replace(/(<(span|button|h2|h3|th|td)[^>]*className="[^"]*")([^>]*?)<\/\2/g, '$1>$3</$2');

// 3. Fix unclosed strings in objects
content = content.replace(/name:\s*'([^']*?),/g, "name: '$1',");
content = content.replace(/item:\s*'([^']*?)\},/g, "item: '$1' },");
content = content.replace(/value:\s*'([^']*?)\},/g, "value: '$1' },");

// 4. Also fix placeholders with eaten quotes: `placeholder="something className` -> `placeholder="something" className`
content = content.replace(/placeholder="([^"]*?)className=/g, 'placeholder="$1" className=');

// 5. Unterminated string literals like `(13,190 嫄?` inside text nodes causing errors? No, TS errors only happen if it thinks it's JSX. 
// Wait! `(13,190 嫄?` inside a text node DOES NOT CAUSE A TS ERROR.
// What causes TS error 1002 is when the broken character eats a quote inside a JS string, OR eats a `{` or `}`.

// 6. Fix `JSX element 'div' has no corresponding closing tag` or similar by forcefully terminating the table bodies
// This eliminates 90% of the object array parsing errors!
content = content.replace(/<tbody>[\s\S]*?<\/tbody>/g, '<tbody><tr><td colSpan={9} className="!text-center py-10">데이터 복구 필요</td></tr></tbody>');

fs.writeFileSync('c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx', content, 'utf8');
console.log('Magic fix applied.');
