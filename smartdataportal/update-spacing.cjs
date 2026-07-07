const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;

walkDir(componentsDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace gap-3, gap-4 etc. with gap-[4px] in flex containers that hold h1/h2 and p
  // Specifically, look for flex flex-col gap-* right before an h1 or h2
  content = content.replace(/(className="[^"]*flex flex-col[^"]*)gap-\d+([^"]*">\s*<h[12])/g, '$1gap-[4px]$2');
  
  // 2. Replace mb-[Xpx] or mb-X on h1/h2 tags with mb-[4px]
  // Note: we only want to do this if there's a <p> tag right after it.
  content = content.replace(/(<h[12][^>]*className="[^"]*?\b)mb-(?:\[\d+px\]|\d+)([^"]*?">[\s\S]*?<\/h[12]>\s*<p\b)/g, '$1mb-[4px]$2');

  // 3. If there is no mb- class on the h1/h2 but there is a <p> right after it, and it's not in a flex gap container,
  // we might need to add mb-[4px]. But let's first check if there are mt- classes on the following <p>.
  content = content.replace(/(<h[12][^>]*>[\s\S]*?<\/h[12]>\s*<p[^>]*className="[^"]*?\b)mt-(?:\[\d+px\]|\d+)([^"]*?">)/g, '$1$2');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFiles++;
    console.log(`Updated spacing in: ${path.basename(filePath)}`);
  }
});

console.log(`Finished updating spacing in ${modifiedFiles} files.`);
