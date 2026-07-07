const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\hrjeong\\.gemini\\antigravity\\brain\\9d405b19-2444-4e39-815e-7cfb6c257b76\\.system_generated\\logs\\transcript_full.jsonl';

if (!fs.existsSync(transcriptPath)) {
    console.log("Transcript not found.");
    process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
let bestContent = null;

for (const line of lines) {
    if (!line) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
            for (const call of obj.tool_calls) {
                if (call.name === 'write_to_file') {
                    if (call.args && call.args.TargetFile && call.args.TargetFile.endsWith('MileDashboard.tsx')) {
                        bestContent = call.args.CodeContent;
                    }
                }
            }
        }
    } catch (e) {}
}

if (bestContent) {
    fs.writeFileSync('C:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx', bestContent, 'utf8');
    console.log("Successfully extracted and restored MileDashboard.tsx!");
} else {
    console.log("Could not find the original content in the logs.");
}
