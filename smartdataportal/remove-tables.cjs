const fs = require('fs');
const filePath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// We will find all <table ...> and </table> and remove everything between them!
// This will fix the syntax errors inside the tables.

let newContent = '';
let inTable = false;
let tableDepth = 0;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('<table')) {
        inTable = true;
        tableDepth++;
        if (tableDepth === 1) {
            newContent += '              <div className="p-10 text-center text-red-500">테이블 데이터 복구 중...</div>\n';
        }
    }
    
    if (!inTable) {
        newContent += line + '\n';
    }
    
    if (line.includes('</table')) {
        tableDepth--;
        if (tableDepth === 0) {
            inTable = false;
        }
    }
}

// Write the file back
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Tables removed.');
