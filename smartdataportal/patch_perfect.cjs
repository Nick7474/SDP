const fs = require('fs');

const backupFile = 'c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx.backup';
const targetFile = 'c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx';

let code = fs.readFileSync(backupFile, 'utf8');

// 1. Add Props
code = code.replace(
  /export default function MileDashboard\(\{ onShowToast \}: MileDashboardProps\) \{/,
  `export default function MileDashboard({ onShowToast, title, subtitle, activeTab: externalActiveTab, onTabChange, customTabs }: any) {`
);

code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\('energy'\);/,
  `const [internalActiveTab, setInternalActiveTab] = useState('energy');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = (id: string) => {
    if (onTabChange) onTabChange(id);
    else setInternalActiveTab(id);
  };`
);

code = code.replace(
  /const tabs = \[[\s\S]*?\];/,
  `const tabs = customTabs || [
    { id: 'energy', label: 'Energy Mile' },
    { id: 'mobility', label: 'Mobility Mile' },
    { id: 'safety', label: 'Safety Mile' },
    { id: 'data', label: 'Data Mile' },
  ];`
);

// 2. Add Tab Data Map
const tabDataBlock = `
  const isCityMode = !!title;

  const mileTabData: Record<string, any> = {
    energy: {
      kpis: [
        { label: '총 발전량', value: '350', unit: 'MWh', icon: '/icons/ic_dash_gen.svg', color: 'var(--fg-1)' },
        { label: '현재 출력', value: '168', unit: 'MWh', icon: '/icons/ic_dash_output.svg', color: 'var(--fg-1)' },
        { label: '누적발전량', value: '1,268', unit: 'MWh', icon: '/icons/ic_dash_totalgen.svg', color: 'var(--fg-1)' },
        { label: '탄소저감량', value: '156.15', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg', color: 'var(--fg-1)' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+12.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 발전량 추이', unit: '(MWh)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [
            { val: 100, y: 140 },
            { val: 150, y: 120 },
            { val: 240, y: 85 },
            { val: 260, y: 75 },
            { val: 340, y: 45 }
          ],
          yLabels: [0, 100, 200, 300, 400],
          yStep: 40
        },
        bar: {
          title: '발전소별 생산량 비교',
          data: [
            { label: '광명역 태양광', val: 170 },
            { label: '광명스카이돔 태양광', val: 110 },
            { label: '철산동 태양광', val: 130 },
            { label: '소하동 태양광', val: 110 },
            { label: '일직동 태양광', val: 150 }
          ],
          yLabels: [0, 50, 100, 150, 200, 250],
          yStep: 32,
          maxVal: 250
        },
        donut: {
          title: '상계/거래 비율',
          items: [
            { label: '상계', val: 62, unit: '217 MWh', color: 'var(--gp-primary)', dash: '136.34 219.91', rotate: '136.8 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(136.8 50 50)' },
            { label: '거래', val: 38, unit: '135 MWh', color: '#FFAE1A', dash: '83.57 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' },
          text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명역 태양광 발전량 데이터'
    },
    mobility: {
      kpis: [
        { label: '총 운행량', value: '12,480', unit: '회', icon: '/icons/ic_dash_bus.svg', color: 'var(--fg-1)' },
        { label: '이용자 수', value: '168', unit: '명', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '운행 커버리지', value: '92', unit: '%', icon: '/icons/ic_dash_coverage.svg', color: 'var(--fg-1)' },
        { label: '탄소저감량', value: '45.2', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg', color: 'var(--fg-1)' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+4.2', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 운행횟수 추이', unit: '(회)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [
            { val: '2,000', y: 152 },
            { val: '3,000', y: 138 },
            { val: '5,000', y: 110 },
            { val: '5,200', y: 107 },
            { val: '7,000', y: 82 }
          ],
          yLabels: [0, 2000, 4000, 6000, 8000, 10000],
          yStep: 28
        },
        bar: {
          title: '서비스별 이용량 비교',
          data: [
            { label: '친환경 EV-DRT', val: 3400 },
            { label: '공공자전거', val: 1010 },
            { label: '스마트 주차', val: 2470 },
            { label: '전기차 충전', val: 1500 },
            { label: '교통정보 안내', val: 2520 }
          ],
          yLabels: [0, 1000, 2000, 3000, 4000],
          yStep: 32,
          maxVal: 4000
        },
        donut: {
          title: '이동 수단 비율',
          items: [
            { label: 'EV-DRT', val: 58, unit: '17,037 건', color: 'var(--gp-primary)', dash: '127.5 219.91', rotate: '151.2 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(151.2 50 50)' },
            { label: '기타', val: 42, unit: '10,443 건', color: '#3BA051', dash: '92.4 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' },
          text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 EV-DRT 운행 데이터'
    },
    safety: {
      kpis: [
        { label: '총 감지건수', value: '27,480', unit: '건', icon: '/icons/ic_dash_alarm.svg', color: 'var(--fg-1)' },
        { label: '긴급 대응 건수', value: '15', unit: '건', icon: '/icons/ic_dash_emergency.svg', color: 'var(--fg-1)' },
        { label: '위험지역 모니터링', value: '24', unit: '개소', icon: '/icons/ic_dash_location.svg', color: 'var(--fg-1)' },
        { label: '안전 지수', value: 'A', unit: '등급', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '-8.5', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 안전 이벤트 추이', unit: '(건)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [
            { val: 100, y: 140 },
            { val: 150, y: 120 },
            { val: 240, y: 85 },
            { val: 260, y: 75 },
            { val: 340, y: 45 }
          ],
          yLabels: [0, 100, 200, 300, 400],
          yStep: 40
        },
        bar: {
          title: '권역별 감지건수 비교',
          data: [
            { label: '스마트폴', val: 1520 },
            { label: '스마트 CCTV', val: 1210 },
            { label: '비상벨', val: 820 },
            { label: '보행안전 감지', val: 410 },
            { label: '침수 감지', val: 120 }
          ],
          yLabels: [0, 500, 1000, 1500, 2000],
          yStep: 35,
          maxVal: 2000
        },
        donut: {
          title: '위험 감지 유형 비율',
          items: [
            { label: '스마트폴', val: 62, unit: '17,037 건', color: 'var(--gp-primary)', dash: '136.34 219.91', rotate: '136.8 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(136.8 50 50)' },
            { label: '기타', val: 38, unit: '10,443 건', color: '#FFAE1A', dash: '83.57 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' },
          text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 스마트 폴 감지 데이터'
    }
  };

  const cityTabData: Record<string, any> = {
    population: {
      kpis: [
        { label: '총 인구', value: '282,927', unit: '명', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '세대 수', value: '124,557', unit: '세대', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '청년 인구', value: '84,120', unit: '명', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '행정동 수', value: '18', unit: '개동', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '인구 증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 인구 추이', unit: '(명)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [
            { val: 283500, y: 140 },
            { val: 283300, y: 120 },
            { val: 283100, y: 85 },
            { val: 283000, y: 75 },
            { val: 282927, y: 45 }
          ],
          yLabels: [282000, 282500, 283000, 283500, 284000],
          yStep: 40
        },
        bar: {
          title: '동별 인구 분포',
          data: [
            { label: '광명동', val: 92000 },
            { label: '철산동', val: 85000 },
            { label: '하안동', val: 76000 },
            { label: '소하동', val: 69000 },
            { label: '학온동', val: 41000 }
          ],
          yLabels: [0, 20000, 40000, 60000, 80000, 100000],
          yStep: 32,
          maxVal: 100000
        },
        donut: {
          title: '연령별 인구 비율',
          items: [
            { label: '청장년', val: 65, unit: '18.3만 명', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '유소년/노년', val: 35, unit: '9.9만 명', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' },
          text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 동별 인구 분포 데이터'
    }
  };

  const dataMap = isCityMode ? cityTabData : mileTabData;
  const currentData = dataMap[activeTab] || dataMap['energy'] || dataMap['population'];
  if (!currentData.charts) {
    currentData.charts = mileTabData.energy.charts;
  }
`;

code = code.replace(
  /return \(/,
  tabDataBlock + '\n  return ('
);

// 3. Patch Header Text
code = code.replace(
  /<h2 className="text-\[28px\] font-bold text-\[var\(--fg-1\)\]">마일별 상세 데이터<\/h2>/,
  '<h2 className="text-[28px] font-bold text-[var(--fg-1)]">{title || \'마일별 상세 데이터\'}</h2>'
);
code = code.replace(
  /<p className="text-\[16px\] text-\[var\(--fg-3\)\]">선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다\.<\/p>/,
  '<p className="text-[16px] text-[var(--fg-3)]">{subtitle || \'선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다.\'}</p>'
);

// 4. Patch KPIs block
const kpiStartIdx = code.indexOf('      {/* KPI Cards Row */}');
const chartStartIdx = code.indexOf('      {/* Charts Row */}');

const newKpiBlock = `      {/* KPI Cards Row */}
      <div className="w-full h-[120px] bg-white border border-[var(--border-light)] rounded-[12px] mb-6 flex items-center justify-between px-[40px] shadow-none">
        {currentData.kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="flex items-center gap-4 relative">
            <img src={kpi.icon} alt={kpi.label} className="w-[48px] h-[48px] shrink-0" onError={(e) => { e.currentTarget.src = "/icons/ic_dash_gen.svg"; }} />
            <div className="flex flex-col min-w-[80px]">
              <span className="text-[14px] font-medium text-[var(--fg-3)] leading-tight mb-1">{kpi.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-bold leading-none" style={{ color: kpi.color }}>{kpi.value}</span>
                {kpi.unit && <span className="text-[14px] font-medium text-[var(--fg-4)] leading-none">{kpi.unit}</span>}
              </div>
            </div>
            {idx < currentData.kpis.length - 1 && <div className="absolute right-[-24px] h-[28px] w-[1px] bg-[var(--border-1)] shrink-0" />}
          </div>
        ))}
      </div>\n\n`;

code = code.substring(0, kpiStartIdx) + newKpiBlock + code.substring(chartStartIdx);

// 5. Patch Charts exactly without breaking SVG

// Line chart dynamic patching
code = code.replace(
  /\{\[0, 100, 200, 300, 400\]\.map\(\(val, idx\) => \{[\s\S]*?const y = 180 - \(idx \* 40\);/,
  `{currentData.charts.line.yLabels.map((val: number, idx: number) => {
                const y = 180 - (idx * currentData.charts.line.yStep);`
);
code = code.replace(
  /\(MWh\)/,
  '{currentData.charts.line.unit}'
);
code = code.replace(
  /\{\[\'2026\.01\', \'2026\.02\', \'2026\.03\', \'2026\.04\', \'2026\.05\'\]\.map/,
  `{currentData.charts.line.labels.map`
);
code = code.replace(
  /<path d="M 35 140 L 120 120 L 205 85 L 290 75 L 375 45" fill="none" stroke="var\(--light-primary-500\)" strokeWidth="2" \/>/,
  `<path d={\`M \${currentData.charts.line.data.map((item: any, idx: number) => \`\${35 + idx * 85} \${item.y}\`).join(' L ')}\`} fill="none" stroke="var(--light-primary-500)" strokeWidth="2" />`
);
code = code.replace(
  /\{\[\s*\{\s*val:\s*'100',\s*y:\s*140\s*\},[\s\S]*?\]\.map/,
  `{currentData.charts.line.data.map`
);
code = code.replace(
  /<h3 className="font-pretendard-gov font-bold text-\[18px\] text-\[var\(--fg-1\)\]">월별 발전량 추이<\/h3>/,
  '<h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.line.title}</h3>'
);

// Bar Chart dynamic patching
code = code.replace(
  /<h3 className="font-pretendard-gov font-bold text-\[18px\] text-\[var\(--fg-1\)\]">발전소별 생산량 비교<\/h3>/,
  '<h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.bar.title}</h3>'
);
code = code.replace(
  /\{\[0, 50, 100, 150, 200, 250\]\.map\(\(val, idx\) => \{[\s\S]*?const y = 180 - \(idx \* 32\);/,
  `{currentData.charts.bar.yLabels.map((val: number, idx: number) => {
                const y = 180 - (idx * currentData.charts.bar.yStep);`
);
code = code.replace(
  /\{\[\s*\{\s*label:\s*'광명역 태양광',[\s\S]*?\]\.map/,
  `{currentData.charts.bar.data.map`
);
code = code.replace(
  /const h = \(item\.val \/ 250\) \* 160;/,
  `const h = (Number(item.val) / currentData.charts.bar.maxVal) * 160;`
);
code = code.replace(
  /<text x=\{x\} y=\{y - 8\} textAnchor="middle" fontSize="11" fill="var\(--fg-1\)" fontWeight="600">\{item\.val\}<\/text>/,
  '<text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{Number(item.val).toLocaleString()}</text>'
);


// Donut chart patching
code = code.replace(
  /<h3 className="font-pretendard-gov font-bold text-\[18px\] text-\[var\(--fg-1\)\]">상계\/거래 비율<\/h3>/,
  '<h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.donut.title}</h3>'
);

const donutRegex = /<svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">[\s\S]*?\(135 MWh\)<\/span>\s*<\/div>\s*<\/div>\s*<\/div>/;

const dynamicDonut = `<svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke={currentData.charts.donut.items[1].color} strokeWidth="30" strokeDasharray={currentData.charts.donut.items[1].dash} />
                <circle cx="50" cy="50" r="35" fill="none" stroke={currentData.charts.donut.items[0].color} strokeWidth="30" strokeDasharray={currentData.charts.donut.items[0].dash} transform={currentData.charts.donut.items[0].rotate ? \`rotate(\${currentData.charts.donut.items[0].rotate.replace('rotate(','').replace(')','')})\` : ''} />
                <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" transform={currentData.charts.donut.items[0].line1} />
                <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" transform={currentData.charts.donut.items[0].line2} />
                <circle cx="50" cy="50" r="20.5" fill="white" />
              </svg>
              <span className="absolute text-white font-normal text-[16px] -translate-x-1/2 -translate-y-1/2" style={currentData.charts.donut.text1}>{currentData.charts.donut.items[1].val}%</span>
              <span className="absolute text-white font-normal text-[16px] -translate-x-1/2 -translate-y-1/2" style={currentData.charts.donut.text2}>{currentData.charts.donut.items[0].val}%</span>
            </div>
            <div className="flex flex-col gap-3 ml-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: currentData.charts.donut.items[0].color }} />
                <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">{currentData.charts.donut.items[0].label}</span>
                <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">{currentData.charts.donut.items[0].val}%</span>
                <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">({currentData.charts.donut.items[0].unit})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: currentData.charts.donut.items[1].color }} />
                <span className="ml-[8px] text-[13px] font-medium text-[var(--fg-2)]">{currentData.charts.donut.items[1].label}</span>
                <span className="ml-[6px] text-[14px] font-bold text-[var(--fg-1)]">{currentData.charts.donut.items[1].val}%</span>
                <span className="ml-[6px] text-[12px] text-[var(--fg-4)]">({currentData.charts.donut.items[1].unit})</span>
              </div>
            </div>
          </div>`;

code = code.replace(donutRegex, dynamicDonut);

// 6. Fix table title
code = code.replace(/<span className="ttl">광명역 태양광 발전량 데이터<\/span>/g, '<span className="ttl">{currentData.tableTitle}</span>');

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Patch complete!');
