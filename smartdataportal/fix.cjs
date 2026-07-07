const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const filePath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
const backupPath = filePath + '.corrupted';

// 1. Read the corrupted UTF-8 file as a string
const corruptedContent = fs.readFileSync(filePath, 'utf8');

// Backup the corrupted file just in case
fs.writeFileSync(backupPath, corruptedContent, 'utf8');

// 2. Convert the string back to a buffer using CP949 encoding.
// Since PowerShell read UTF-8 bytes as CP949 and then wrote as UTF-8, 
// we reverse it by encoding the string back to CP949.
const originalBuffer = iconv.encode(corruptedContent, 'cp949');

// 3. Write the buffer back to the file
fs.writeFileSync(filePath, originalBuffer);

console.log("Recovery attempted!");
