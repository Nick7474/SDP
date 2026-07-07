const fs = require('fs');
const execSync = require('child_process').execSync;

try {
    console.log("Running ultimate-fix.cjs...");
    execSync('node ultimate-fix.cjs', { stdio: 'inherit' });

    console.log("Running patch-errors.cjs...");
    execSync('node patch-errors.cjs', { stdio: 'inherit' });

    console.log("Running repair.cjs...");
    execSync('node repair.cjs', { stdio: 'inherit' });

    const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';

    // Now we have around 80 errors. We will manually fix them with safe regex.
    for (let iter = 0; iter < 5; iter++) {
        try {
            execSync('npx tsc --noEmit', { stdio: 'pipe' });
            console.log("Successfully compiled!");
            break;
        } catch (err) {
            const output = err.stdout.toString();
            const errors = output.split('\n');
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
                    if (line.includes('(') && !line.includes(')')) line += ')';
                    else line += "'";
                    fixed = true;
                }
                if (errCode === '1382' || errCode === '1381') {
                    if (line.includes('<span className') && !line.includes('</span>')) line += '</span>';
                    else if (line.includes('<h2') && !line.includes('</h2>')) line += '</h2>';
                    else if (line.includes('<h3') && !line.includes('</h3>')) line += '</h3>';
                    else if (line.includes('</td') && !line.includes('</td>')) line = line.replace(/<\/td.*$/, '</td>');
                    else if (line.includes('</th') && !line.includes('</th>')) line = line.replace(/<\/th.*$/, '</th>');
                    else if (line.includes('name: \'') || line.includes('item: \'') || line.includes('label: \'')) {
                        line = line.replace(/,\s*$/, "',");
                        line = line.replace(/\}\s*,\s*$/, "' },");
                    }
                    else if (!line.includes('>')) line += '>';
                    fixed = true;
                }
                if (errCode === '17002') {
                    if (errMsg.includes('div')) line += '</div>';
                    if (errMsg.includes('h2')) line += '</h2>';
                    if (errMsg.includes('tbody')) line += '</tbody>';
                    if (errMsg.includes('table')) line += '</table>';
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
                            line = line.replace(/,\s*$/, "',");
                            line = line.replace(/\}\s*,\s*$/, "' },");
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
                console.log("Could not auto-fix anymore errors.");
                fs.writeFileSync('tsc-errors-pipeline.txt', output, 'utf8');
                break;
            }
        }
    }
} catch (e) {
    console.error(e);
}
