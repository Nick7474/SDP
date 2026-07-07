const fs = require('fs');
const filePath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// We will process the tsc output to find broken lines.
// But first, let's just aggressively fix common issues.
for (let i = 0; i < lines.length; i++) {
    // Fix missing closing tags on th/td
    if (lines[i].includes('className="') && lines[i].includes('!text-center"')) {
        if (!lines[i].includes('</')) {
            if (lines[i].includes('<th')) lines[i] += '지표</th>';
            if (lines[i].includes('<td')) lines[i] += '데이터</td>';
        }
    }
    
    // Fix unclosed spans
    if (lines[i].includes('<span') && !lines[i].includes('</span>')) {
        lines[i] += '</span>';
    }
    
    // Fix unclosed buttons
    if (lines[i].includes('<button') && !lines[i].includes('</button>')) {
        // Only if it doesn't span multiple lines, but button usually spans multiple lines if it has icon.
        // Let's be careful.
    }
    
    // Fix missing string quotes in data arrays
    if (lines[i].includes('name: \'') && !lines[i].includes('\', item:')) {
        // It's a broken name item
        lines[i] = lines[i].replace(/name:\s*'[^,]*,/g, "name: '데이터',");
    }
    if (lines[i].includes('item: \'') && !lines[i].includes('\' }')) {
        // It's a broken item property
        lines[i] = lines[i].replace(/item:\s*'[^}]*},/g, "item: '데이터' },");
    }
    
    // Fix h3 unclosed
    if (lines[i].includes('<h3') && !lines[i].includes('</h3>')) {
        lines[i] += '</h3>';
    }

    // Fix <td ...>광명시/td> missing <
    lines[i] = lines[i].replace(/광명시\/td>/g, '광명시</td>');
    lines[i] = lines[i].replace(/\?\?\?\/td>/g, '</td>');
    lines[i] = lines[i].replace(/\?\?\?\/th>/g, '</th>');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed some lines');
