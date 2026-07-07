const fs = require('fs');
const execSync = require('child_process').execSync;

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
const corrupted = file + '.corrupted';

// Start fresh from corrupted
fs.copyFileSync(corrupted, file);

for (let iter = 0; iter < 5; iter++) {
    console.log("Iteration", iter);
    try {
        execSync('npx tsc --noEmit', { cwd: 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털', stdio: 'pipe' });
        console.log("Compilation success!");
        break;
    } catch (err) {
        const errors = err.stdout.toString().split('\n');
        let lines = fs.readFileSync(file, 'utf8').split('\n');
        let fixed = false;

        for (const errLine of errors) {
            const match = errLine.match(/\((\d+),\d+\): error TS(\d+): (.*)/);
            if (!match) continue;
            
            const lineNum = parseInt(match[1]) - 1;
            const errCode = match[2];
            const errMsg = match[3];

            let line = lines[lineNum];
            if (line === undefined) continue;

            if (errCode === '1002') {
                if (line.includes('(') && !line.includes(')')) line = line + ')';
                else if (line.match(/className="[^"]*$/)) line = line + '"';
                else line = line + "'";
                fixed = true;
            }
            if (errCode === '1382' || errCode === '1381') {
                if (line.includes('<span className') && !line.includes('</span>')) line = line.replace(/(className="[^"]*")\s*[^>]*$/, '$1></span>');
                else if (line.includes('<h2') && !line.includes('</h2>')) line += '</h2>';
                else if (line.includes('<h3') && !line.includes('</h3>')) line += '</h3>';
                else if (line.includes('</td') && !line.includes('</td>')) line = line.replace(/<\/td.*$/, '</td>');
                else if (line.includes('</th') && !line.includes('</th>')) line = line.replace(/<\/th.*$/, '</th>');
                else if (!line.includes('>')) line += '>';
                fixed = true;
            }
            if (errCode === '17002') {
                if (errMsg.includes('div')) line += '</div>';
                if (errMsg.includes('h2')) line += '</h2>';
                if (errMsg.includes('tbody')) line += '</tbody>';
                if (errMsg.includes('table')) line += '</table>';
                if (errMsg.includes('tr')) line += '</tr>';
                if (errMsg.includes('td')) line += '</td>';
                if (errMsg.includes('thead')) line += '</thead>';
                fixed = true;
            }
            if (errCode === '17008') {
                if (errMsg.includes('span')) line += '</span>';
                if (errMsg.includes('button')) line += '</button>';
                if (errMsg.includes('h3')) line += '</h3>';
                fixed = true;
            }
            if (errCode === '1005' || errCode === '1003') {
                if (line.includes('name: \'') || line.includes('item: \'') || line.includes('value: \'') || line.includes('label: \'')) {
                    if ((line.match(/'/g) || []).length % 2 !== 0) {
                        line = line.replace(/,$/, "',");
                        line = line.replace(/ \},$/, "' },");
                        fixed = true;
                    }
                } else if (line.match(/\([0-9,]+[^)]*$/)) {
                    line += ')';
                    fixed = true;
                }
            }

            lines[lineNum] = line;
        }

        if (fixed) {
            fs.writeFileSync(file, lines.join('\n'), 'utf8');
        } else {
            console.log("Cannot auto-fix anymore");
            break;
        }
    }
}

// 2. Global replace for broken table data without removing lines!
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/(<th[^>]*>)[^<]*?\/th>/g, '$1데이터</th>');
content = content.replace(/(<td[^>]*>)[^<]*?\/td>/g, '$1데이터</td>');
content = content.replace(/(<span className="[^"]*")[^>]*?>([^<]*)<\/span\s*/g, '$1>$2</span>');
fs.writeFileSync(file, content, 'utf8');

execSync('node repair.cjs', { stdio: 'inherit' });
console.log('Restoration and text repair complete!');
