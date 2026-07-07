const fs = require('fs');
const execSync = require('child_process').execSync;

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

for (let iter = 0; iter < 10; iter++) {
    console.log("Iteration " + iter);
    try {
        execSync('npx tsc --noEmit', { cwd: 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털', stdio: 'pipe' });
        console.log("Success!");
        break;
    } catch (err) {
        const output = err.stdout.toString();
        const errors = output.split('\n');
        let lines = fs.readFileSync(file, 'utf8').split('\n');
        let fixedSomething = false;

        for (const errLine of errors) {
            const match = errLine.match(/\((\d+),\d+\): error TS(\d+): (.*)/);
            if (!match) continue;
            
            const lineNum = parseInt(match[1]) - 1;
            const errCode = match[2];
            const errMsg = match[3];

            let line = lines[lineNum];
            if (line === undefined) continue;

            if (errCode === '1002') {
                if (line.includes('(') && !line.includes(')')) line += ')';
                else if (line.match(/className="[^"]*$/)) line += '"';
                else line += "'";
                fixedSomething = true;
            }
            if (errCode === '1382' || errCode === '1381') {
                if (line.includes('<span className') && !line.includes('</span>')) line = line.replace(/(className="[^"]*")\s*[^>]*$/, '$1></span>');
                else if (line.includes('<h2') && !line.includes('</h2>')) line += '</h2>';
                else if (line.includes('<h3') && !line.includes('</h3>')) line += '</h3>';
                else if (line.includes('</td') && !line.includes('</td>')) line = line.replace(/<\/td.*$/, '</td>');
                else if (line.includes('</th') && !line.includes('</th>')) line = line.replace(/<\/th.*$/, '</th>');
                else if (line.includes('name: \'') || line.includes('item: \'') || line.includes('label: \'')) {
                    line = line.replace(/,\s*$/, "',");
                    line = line.replace(/\}\s*,\s*$/, "' },");
                }
                else if (!line.includes('>')) line += '>';
                fixedSomething = true;
            }
            if (errCode === '17002') {
                if (errMsg.includes('div')) line += '</div>';
                if (errMsg.includes('h2')) line += '</h2>';
                if (errMsg.includes('tbody')) line += '</tbody>';
                if (errMsg.includes('table')) line += '</table>';
                fixedSomething = true;
            }
            if (errCode === '17008') {
                if (errMsg.includes('span')) line += '</span>';
                if (errMsg.includes('button')) line += '</button>';
                if (errMsg.includes('h3')) line += '</h3>';
                fixedSomething = true;
            }
            if (errCode === '1005' || errCode === '1003') {
                if (line.includes('name: \'') || line.includes('item: \'') || line.includes('value: \'') || line.includes('label: \'')) {
                    if ((line.match(/'/g) || []).length % 2 !== 0) {
                        line = line.replace(/,$/, "',");
                        line = line.replace(/ \},$/, "' },");
                        fixedSomething = true;
                    }
                }
            }

            lines[lineNum] = line;
        }

        if (fixedSomething) {
            fs.writeFileSync(file, lines.join('\n'), 'utf8');
        } else {
            console.log("Could not auto-fix anymore errors.");
            fs.writeFileSync('tsc-errors.txt', output, 'utf8');
            break;
        }
    }
}
