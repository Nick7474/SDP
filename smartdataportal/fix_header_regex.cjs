const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', 'utf-8');

const regex1 = /href="#sol-map"[\s\S]*?onClick=\{\(e\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?onNavigate\('intro'\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?const el = document\.getElementById\('sol-map'\);[\s\S]*?if \(el\) el\.scrollIntoView\(\{ behavior: 'smooth' \}\);[\s\S]*?\}, 100\);[\s\S]*?\}\}([\s\S]*?)>([\s\S]*?)광명시 데이터/m;

const replacement1 = "href=\"#city-map\" onClick={(e) => { e.preventDefault(); onNavigate('cityMap'); }}$1>$2광명시 데이터";

code = code.replace(regex1, replacement1);


const regex2 = /href="#sol-map"[\s\S]*?onClick=\{\(e\) => \{[\s\S]*?e\.preventDefault\(\);[\s\S]*?setMobileMenuOpen\(false\);[\s\S]*?onNavigate\('intro'\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?const el = document\.getElementById\('sol-map'\);[\s\S]*?if \(el\) el\.scrollIntoView\(\{ behavior: 'smooth' \}\);[\s\S]*?\}, 100\);[\s\S]*?\}\}([\s\S]*?)>([\s\S]*?)<span>광명시 데이터<\/span>/m;

const replacement2 = "href=\"#city-map\" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate('cityMap'); }}$1>$2<span>광명시 데이터</span>";

code = code.replace(regex2, replacement2);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/Header.tsx', code, 'utf-8');
console.log('Fixed Header.tsx via double-quote regex.');
