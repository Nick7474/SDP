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

  // Replace text size in <h2> tags
  content = content.replace(/(<h2[^>]*text-\[)\d+px(\][^>]*>)/g, '$124px$2');

  // Replace subtitle text size (usually <p> following <h2>)
  // This is a bit tricky with regex, so we'll look for pattern: <div className="mb-...">\n *<h2 ...>...</h2>\n *<p className="... text-[15px] ...">
  // Or just generally: any <p> that has text-[14px], text-[15px], text-[16px] that is acting as a subtitle.
  // A subtitle typically has text-[var(--fg-3)] or text-[#5A6878] or text-[#656D81] and is inside a header div.
  
  // Let's do a more robust string replacement:
  // Find <h2 ...> ... </h2> \s* <p className="... text-[XXpx] ..."
  content = content.replace(/(<h2[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*text-\[)\d+px(\][^>]*>)/g, '$116px$2');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFiles++;
    console.log(`Updated: ${path.basename(filePath)}`);
  }
});

console.log(`Finished updating ${modifiedFiles} files.`);
