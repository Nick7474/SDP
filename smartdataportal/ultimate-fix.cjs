const fs = require('fs');
const corruptedPath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx.corrupted';
const targetPath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

let content = fs.readFileSync(corruptedPath, 'utf8');

// The file has ~2147 lines.
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Fix table headers: any `<th ...>.../th>` -> `<th ...>데이터</th>`
    if (line.includes('<th ') && !line.includes('</th>')) {
        line = line.replace(/(<th[^>]*>).*?\/th>/, '$1데이터</th>');
    }

    // Fix table cells: any `<td ...>.../td>` -> `<td ...>데이터</td>`
    if (line.includes('<td ') && !line.includes('</td>') && line.includes('/td>')) {
        line = line.replace(/(<td[^>]*>).*?\/td>/, '$1데이터</td>');
    }

    // Fix object arrays: `name: '광명... ,` -> `name: '광명...',`
    if (line.includes('name: \'') && line.endsWith(',')) {
        if ((line.match(/'/g) || []).length % 2 !== 0) {
            line = line.replace(/,$/, "',");
        }
    }
    if (line.includes('item: \'') && line.endsWith(' },')) {
        if ((line.match(/'/g) || []).length % 2 !== 0) {
            line = line.replace(/ \},$/, "' },");
        }
    }

    // Fix missing closing tags for span, button, h3 that have classes
    if (line.includes('<span className=') && !line.includes('</span>')) {
        line += '</span>';
    }
    if (line.includes('<button ') && !line.includes('</button>')) {
        // Only if it doesn't span multiple lines. Wait, some buttons span multiple lines.
        // Let's just fix the specific one: `<button onClick={...} className="gp-btn...">`
        if (line.includes('보기')) line += '</button>';
    }
    if (line.includes('<h3 ') && !line.includes('</h3>')) {
        line += '</h3>';
    }

    // Fix unclosed `{activeTab === 'public' && (` blocks? They are fine.
    
    // Some lines have `item: 'PM 2.5 ?도' },` but the quote is eaten? 
    // If it has `item: 'something },`, it means the quote was eaten.
    if (line.includes('item: \'') && !line.includes('\' }') && line.includes('}')) {
        line = line.replace(/\s*\},$/, "' },");
    }

    lines[i] = line;
}

// Write it back
fs.writeFileSync(targetPath, lines.join('\n'), 'utf8');
console.log('Restored and patched from .corrupted');
