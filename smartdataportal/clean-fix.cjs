const fs = require('fs');

const corrupted = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const target = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corrupted, 'utf8');

// Fix eaten closing tags (e.g. "/td>", "/tr>", "/span>")
content = content.replace(/(?<!<)(\/(td|tr|th|thead|tbody|table|span|div|button|h2|h3)>)/g, '<$1');

// Fix unterminated strings like: dataName = '愿묐챸??꽭沅?臾명솕쨌泥댁쑁?쒖꽕 ?곗씠??;
// This regex looks for: variable = '...; and injects a single quote before the semicolon
content = content.replace(/=\s*'([^'\n]*);/g, "= '$1';");

// Fix unterminated strings inside objects: label: '...,
content = content.replace(/label:\s*'([^'\n]*),/g, "label: '$1',");
content = content.replace(/val:\s*'([^'\n]*),/g, "val: '$1',");
content = content.replace(/name:\s*'([^'\n]*),/g, "name: '$1',");
content = content.replace(/item:\s*'([^'\n]*),/g, "item: '$1',");

// General fix for unterminated string literals at the end of the line
content = content.replace(/'([^'\n]+)$/gm, "'$1'");

// Fix missing </div> at the very end
// The corrupted file ends at line 2147 abruptly
// Let's just make sure it's closed properly.
if (!content.trim().endsWith('}')) {
    content += '\n  );\n}';
}

fs.writeFileSync(target, content, 'utf8');
console.log('Clean fix applied!');
