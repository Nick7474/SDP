const fs = require('fs');
const path = require('path');

const publicDir = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\public';
const files = fs.readdirSync(publicDir).filter(f => f.startsWith('btn_') && f.endsWith('.svg'));

files.forEach(file => {
  const fullPath = path.join(publicDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace filter region from x="0" y="0" width="60" height="60"
  // to x="-20%" y="-20%" width="140%" height="140%" so the drop shadow is not clipped
  const before = content;
  content = content.replace(
    /(<filter[^>]+?)x="0"\s+y="0"\s+width="60"\s+height="60"([^>]*>)/g,
    '$1x="-20%" y="-20%" width="140%" height="140%"$2'
  );

  // Also handle energymile_on which has y="2" and height="60" (different)
  content = content.replace(
    /(<filter[^>]+?)x="0"\s+y="2"\s+width="60"\s+height="60"([^>]*>)/g,
    '$1x="-20%" y="-20%" width="140%" height="140%"$2'
  );

  if (content !== before) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⚠️  No match found in: ${file}`);
    // Show the filter line for debugging
    const match = content.match(/<filter[^>]*>/);
    if (match) console.log('   Filter tag:', match[0]);
  }
});
