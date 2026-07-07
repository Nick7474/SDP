const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx.backup', 'utf-8');

const startMarker = '{/* KPI Cards Row */}';
const startIndex = code.indexOf(startMarker);

// Find the position of the last "</div>" before the main container closes.
// We can just find the string "    </div>\r\n  );\r\n}" or similar.
const endMatch = code.match(/      <\/div>\s*<\/div>\s*\);\s*}/);
if (!endMatch) {
  console.log("Could not find end match!");
  process.exit(1);
}

const endIndex = endMatch.index + 12; // length of "      </div>"

const energyContent = code.substring(startIndex, endIndex);

const mobilityContent = energyContent
  .replace('ic_dash_gen.svg', 'ic_dash_bus.svg')
  .replace('총 발전량', '총 운행량')
  .replace('총 발전량', '총 운행량')
  .replace('350', '12,480')
  .replace('MWh', '회')
  .replace('ic_dash_output.svg', 'ic_dash_profile.svg')
  .replace('현재 출력', '이용자 수')
  .replace('현재 출력', '이용자 수')
  .replace('168', '168')
  .replace('MWh', '명')
  .replace('ic_dash_totalgen.svg', 'ic_dash_clock.svg')
  .replace('누적발전량', '평균 배차시간')
  .replace('누적발전량', '평균 배차시간')
  .replace('1,268', '6.7')
  .replace('MWh', '분')
  .replace('ic_dash_carbon.svg', 'ic_dash_coverage.svg')
  .replace('탄소저감량', '운행 커버리지')
  .replace('탄소저감량', '운행 커버리지')
  .replace('156.15', '92')
  .replace('tCO₂eq', '%')
  .replace('월별 발전량 추이', '월별 모빌리티 이용 추이')
  .replace('{[0, 100, 200, 300, 400].map((val, idx) => {\\n                const y = 180 - (idx * 40);', 
           '{[0, 2000, 4000, 6000, 8000, 10000].map((val, idx) => {\\n                const y = 180 - (idx * 28);')
  .replace('{val}</text>', '{val === 0 ? 0 : val.toLocaleString()}</text>')
  .replace('(MWh)', '(명)')
  .replace('M 35 140 L 120 120 L 205 85 L 290 75 L 375 45', 'M 35 152 L 120 138 L 205 110 L 290 107 L 375 82')
  .replace(
    `[
                { val: '100', y: 140 },
                { val: '150', y: 120 },
                { val: '240', y: 85 },
                { val: '260', y: 75 },
                { val: '340', y: 45 }
              ]`,
    `[
                { val: '2,000', y: 152 },
                { val: '3,000', y: 138 },
                { val: '5,000', y: 110 },
                { val: '5,200', y: 107 },
                { val: '7,000', y: 82 }
              ]`
  )
  .replace('발전소별 생산량 비교', '서비스별 이용량 비교')
  .replace('{[0, 50, 100, 150, 200, 250].map((val, idx) => {\\n                const y = 180 - (idx * 32);',
           '{[0, 1000, 2000, 3000, 4000].map((val, idx) => {\\n                const y = 180 - (idx * 35);')
  .replace(
    `[
                { label: '광명역 태양광', val: '170', height: 110 },
                { label: '광명스카이돔 태양광', val: '110', height: 70 },
                { label: '철산동 태양광', val: '130', height: 85 },
                { label: '소하동 태양광', val: '110', height: 70 },
                { label: '일직동 태양광', val: '150', height: 100 }
              ].map((item, idx) => {
                const x = 45 + (idx * 80);
                const h = (item.val / 250) * 160;
                const y = 180 - h;
                const lines = item.label.split(' ');
                return (
                  <g key={item.label}>
                    <rect x={x - 15} y={y} width="30" height={h} fill="var(--gp-point)" rx="2" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{item.val}</text>
                    <text x={x} y="204" textAnchor="middle" fontSize="12" fill="#464C53">{lines[0]}</text>
                    <text x={x} y="222" textAnchor="middle" fontSize="12" fill="#464C53">{lines[1]}</text>
                  </g>
                );
              })`,
    `[
                { label: '친환경 EV-DRT', val: 3400 },
                { label: '공공자전거', val: 1010 },
                { label: '스마트 주차', val: 2470 },
                { label: '전기차 충전', val: 1500 },
                { label: '교통정보 안내', val: 2520 }
              ].map((item, idx) => {
                const x = 45 + (idx * 80);
                const h = (item.val / 4000) * 140;
                const y = 180 - h;
                const lines = item.label.split(' ');
                return (
                  <g key={item.label}>
                    <rect x={x - 15} y={y} width="30" height={h} fill="var(--gp-point)" rx="2" />
                    <rect x={x - 22} y={y - 20} width="44" height="16" fill="white" stroke="var(--border-1)" strokeWidth="1" rx="2" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{item.val.toLocaleString()}</text>
                    <text x={x} y="204" textAnchor="middle" fontSize="12" fill="#464C53">{lines[0]}</text>
                    <text x={x} y="222" textAnchor="middle" fontSize="12" fill="#464C53">{lines[1] || ''}</text>
                  </g>
                );
              })`
  )
  .replace('상계/거래 비율', '이동 수단 비율')
  .replace('상계', 'EV-DRT')
  .replace('bg-[#FFAE1A]', 'bg-[var(--status-success)]')
  .replace('stroke="#FFAE1A"', 'stroke="var(--status-success)"')
  .replace(/광명역 태양광 발전량 데이터/g, '광명역 EV-DRT 운행데이터')
  .replace(/에너지/g, '모빌리티')
  .replace(/신재생 에너지 자원 발전소/g, '친환경 EV-DRT 버스')
  .replace(/발전량/g, '운행횟수');

const newCode = code.substring(0, startIndex) +
  "{activeTab === 'energy' && (\n        <>\n" +
  energyContent.replace(/\n/g, '\n        ') +
  "\n        </>\n      )}\n\n" +
  "      {activeTab === 'mobility' && (\n        <>\n" +
  mobilityContent.replace(/\n/g, '\n        ') +
  "\n        </>\n      )}\n" +
  code.substring(endIndex);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', newCode, 'utf-8');
console.log('Successfully updated MileDashboard.tsx');
