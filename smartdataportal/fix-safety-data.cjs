const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const safetyDataStr = `safety: {
      kpis: [
        { label: '생활안전지수', value: '83', unit: '점', icon: '/icons/ic_dash_status.svg' },
        { label: '스마트 안전시설', value: '68', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '위험 알림 건수', value: '12', unit: '건', icon: '/icons/ic_dash_warning.svg' },
        { label: '침수 위험지역', value: '4', unit: '곳', icon: '/icons/ic_dash_alarm.svg' },
        { label: 'CCTV·센서 커버리지', value: '89', unit: '%', icon: '/icons/ic_dash_cctv.svg' },
        { label: '전월 대비', value: '-2.7', unit: '%', icon: '/icons/ic_dash_mom.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명동 생활안전', val: '170', height: 110 },
        { label: '철산동 생활안전', val: '110', height: 70 },
        { label: '하안동 생활안전', val: '130', height: 85 },
        { label: '소하동 생활안전', val: '110', height: 70 },
        { label: '학온동 생활안전', val: '150', height: 100 }
      ],
      tableTitle: '광명시 권역별 범죄 발생 현황'
    }`;

// Replace the safety object in tabData
content = content.replace(/safety:\s*\{[\s\S]*?tableTitle:\s*'[^']*'\s*\}/, safetyDataStr);

fs.writeFileSync(file, content, 'utf8');
console.log('Safety data fixed!');
