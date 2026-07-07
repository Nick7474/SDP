const fs = require('fs');
const path = require('path');

const publicDir = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\public';
const files = fs.readdirSync(publicDir).filter(f => f.startsWith('btn_') && f.endsWith('.svg'));

files.forEach(file => {
  const fullPath = path.join(publicDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const before = content;

  // Fix 1: Replace incorrect percentage-based filter coords (from previous broken fix)
  // back to proper absolute pixel coords with enough padding for the shadow.
  // feGaussianBlur stdDeviation=5 → blur spreads ~15px, feOffset dy=2 → 2px down
  // So we need: at least 15px padding on all sides
  // Filter region: x=-15 y=-15 width=90 height=90 (on a 60x60 canvas)
  content = content.replace(
    /(<filter\s[^>]*?)x="-20%"\s+y="-20%"\s+width="140%"\s+height="140%"([^>]*filterUnits="userSpaceOnUse"[^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );
  content = content.replace(
    /(<filter\s[^>]*?filterUnits="userSpaceOnUse"[^>]*?)x="-20%"\s+y="-20%"\s+width="140%"\s+height="140%"([^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );

  // Fix 2: Also handle any remaining old-style broken coords (fallback)
  // Replace any filter that still has the original tight x="0" y="0" width="60" height="60"
  content = content.replace(
    /(<filter\s[^>]*?)x="0"\s+y="0"\s+width="60"\s+height="60"([^>]*filterUnits="userSpaceOnUse"[^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );
  content = content.replace(
    /(<filter\s[^>]*?filterUnits="userSpaceOnUse"[^>]*?)x="0"\s+y="0"\s+width="60"\s+height="60"([^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );
  // energymile_on has y="2"
  content = content.replace(
    /(<filter\s[^>]*?)x="0"\s+y="2"\s+width="60"\s+height="60"([^>]*filterUnits="userSpaceOnUse"[^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );
  content = content.replace(
    /(<filter\s[^>]*?filterUnits="userSpaceOnUse"[^>]*?)x="0"\s+y="2"\s+width="60"\s+height="60"([^>]*>)/g,
    '$1x="-15" y="-15" width="90" height="90"$2'
  );

  if (content !== before) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    // Show current filter line for debug
    const match = content.match(/<filter[^>]*>/);
    console.log(`ℹ️  No change: ${file}  →  ${match ? match[0] : 'no filter found'}`);
  }
});
