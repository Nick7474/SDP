const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/hrjeong/Desktop/광명 스마트데이터포털/public';
const srcDir = 'c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src';

const iconsDir = path.join(publicDir, 'icons');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

const files = fs.readdirSync(publicDir);
const replacements = {};

files.forEach(file => {
    const fullPath = path.join(publicDir, file);
    if (fs.statSync(fullPath).isDirectory()) return;

    let targetDir = null;
    let newPrefix = '';

    if (file.match(/^(ic_|btn_|breadcrumb_ic_|login\.png|mappin_|pin_)/)) {
        targetDir = iconsDir;
        newPrefix = '/icons/';
    } else if (file.match(/^(banner_bg_|bg_|img_|logo|datamap|hero_bg|solution map|qrcode)/)) {
        targetDir = imagesDir;
        newPrefix = '/images/';
    }

    if (targetDir) {
        fs.renameSync(fullPath, path.join(targetDir, file));
        replacements['/' + file] = newPrefix + file;
    }
});

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const allFiles = walk(srcDir);
const indexHtml = path.join(publicDir, 'index.html');
if (fs.existsSync(indexHtml)) allFiles.push(indexHtml);

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    for (const [oldPath, newPath] of Object.entries(replacements)) {
        if (content.includes(oldPath + '"') || content.includes(oldPath + "'") || content.includes(oldPath + ')')) {
            content = content.split(oldPath + '"').join(newPath + '"');
            content = content.split(oldPath + "'").join(newPath + "'");
            content = content.split(oldPath + ')').join(newPath + ')');
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Migration complete. Files moved and references updated.');
