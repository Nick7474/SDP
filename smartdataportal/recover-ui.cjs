const fs = require('fs');

const corruptedPath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const targetPath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corruptedPath, 'utf8');

// 1. Remove ALL data arrays in tbodys that are causing syntax errors
// The structure is `<tbody>\n {[ \n { id: ... \n ].map((row` 
// We will just replace everything between <tbody> and </tbody> with a dummy row.
content = content.replace(/<tbody>[\s\S]*?<\/tbody>/g, '<tbody><tr><td colSpan={9} className="!text-center py-10">데이터 복구 필요</td></tr></tbody>');

// 2. Fix the broken <th> tags (like <th className="...">???/th>)
content = content.replace(/(<th[^>]*>)[^<]*?\/th>/g, '$1데이터</th>');

// 3. Fix the broken <td> tags
content = content.replace(/(<td[^>]*>)[^<]*?\/td>/g, '$1데이터</td>');
content = content.replace(/광명시\/td>/g, '광명시</td>');
content = content.replace(/광명[^<]*?<\/td>/g, '광명시</td>');

// 4. Fix broken <span tags (e.g. missing closing bracket before content)
// In some cases, `className="something"` was followed by `>μg/m³</span` but the `>` was eaten!
// If there is `<span className="[^"]*"(?!\s*>)[^<]*<\/span>`, fix it.
content = content.replace(/(<span className="[^"]*")[^>]*?>([^<]*)<\/span\s*/g, '$1>$2</span>');

// 5. Fix <button tags that might be missing >
content = content.replace(/(<button className="[^"]*")[^>]*?>\s*보기\s*<\/button\s*/g, '$1>보기</button>');

// 6. Fix <h3 tags
content = content.replace(/(<h3[^>]*>)[^<]*?<\/h3\s*/g, '$1데이터</h3>');

// Write out the result
fs.writeFileSync(targetPath, content, 'utf8');
console.log('UI structure recovered and table bodies stripped.');
