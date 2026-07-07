const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const safetyDataStr = `safety: {
      kpis: [
        { label: '총 감지건수', value: '27,480', unit: '건', icon: '/icons/ic_dash_emergency.svg' },
        { label: '긴급 대응 건수', value: '15', unit: '건', icon: '/icons/ic_dash_alarm.svg' },
        { label: '평균 배차시간', value: '6.7', unit: '분', icon: '/icons/ic_dash_clock.svg' },
        { label: '위험지역 모니터링', value: '24', unit: '개소', icon: '/icons/ic_dash_location.svg' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+12.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
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
console.log('Safety data updated from image!');
