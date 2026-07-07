const fs = require('fs');

const filePath = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace headers
content = content.replace(/\?이\?명/g, '데이터명');
content = content.replace(/\?\?\?\/th>/g, '<th>지표</th>');
content = content.replace(/\?이\?\?\?\?/g, '데이터 항목');
content = content.replace(/\?식/g, '형식');
content = content.replace(/기\?\?\?\/th>/g, '<th>기준일</th>');
content = content.replace(/\?세/g, '상세');
content = content.replace(/\?운로드/g, '다운로드');

// Replace table data names and items
content = content.replace(/광명\?\?\?미세먼\? 측정 \?이\?\?,/g, "광명시 초미세먼지 측정 데이터',");
content = content.replace(/PM 2\.5 \?도/g, 'PM 2.5 농도');

content = content.replace(/광명\?\?\?기온 \?이\?\?,/g, "광명시 기온 데이터',");
content = content.replace(/기온 \(\?균\/최고\/최\?\)/g, '기온 (평균/최고/최저)');

content = content.replace(/광명\?\?\?\?\? \?황 \?이\?\?,/g, "광명시 녹지 현황 데이터',");
content = content.replace(/\?\?\?\? \},/g, "녹지율' },"); // fixes eaten quote

content = content.replace(/광명\?\?\?\?실\?\?\?배출 \?이\?\?,/g, "광명시 온실가스 배출 데이터',");
content = content.replace(/\?실\?\?\?배출\?\? \},/g, "온실가스 배출량' },"); // fixes eaten quote

content = content.replace(/광명\?\?\?/g, '광명시'); // general fallback for 광명시
content = content.replace(/\?경·기후/g, '환경·기후');
content = content.replace(/\?일\?\?\?운로드 \?었\?니\?\?/g, '파일이 다운로드 되었습니다');

// Also some closing tags might be broken: <td className="!text-center">광명???/td> -> <td ...>광명시</td>
content = content.replace(/<td className="!text-center">광명시\/td>/g, '<td className="!text-center">광명시</td>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Repaired!');
