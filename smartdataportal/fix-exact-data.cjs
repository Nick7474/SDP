const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const tabDataStr = `
  const tabData: Record<string, any> = {
    energy: {
      kpis: [
        { label: '총 발전량', value: '12,450', unit: 'MWH', icon: '/icons/ic_dash_gen.svg' },
        { label: '건물 에너지', value: '2,182', unit: 'MWH', icon: '/icons/ic_dash_building.svg' },
        { label: '온실가스 감축량', value: '239.1', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '에너지 효율 등급', value: 'B', unit: '등급', icon: '/icons/ic_dash_building2.svg' },
        { label: '전월 대비', value: '-4.8', unit: '%', icon: '/icons/ic_dash_home.svg' },
        { label: '전년 대비', value: '-2.7', unit: '%', icon: '/icons/ic_dash_mom.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명역 태양광', val: '170', height: 110 },
        { label: '광명스카이돔 태양광', val: '110', height: 70 },
        { label: '철산동 태양광', val: '130', height: 85 },
        { label: '소하동 태양광', val: '110', height: 70 },
        { label: '일직동 태양광', val: '150', height: 100 }
      ],
      tableTitle: '광명역 태양광 발전량 데이터'
    },
    population: {
      kpis: [
        { label: '총 인구', value: '24,380', unit: '명', icon: '/icons/ic_dash_community.svg' },
        { label: '세대 수', value: '24', unit: '만', icon: '/icons/ic_dash_home.svg' },
        { label: '인구 증감', value: '+0.8', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--status-success)' },
        { label: '생활 인프라', value: '24', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '접근성 지수', value: '89', unit: '점', icon: '/icons/ic_dash_location.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명동 인구', val: '250', height: 160 },
        { label: '철산동 인구', val: '220', height: 140 },
        { label: '하안동 인구', val: '190', height: 120 },
        { label: '소하동 인구', val: '180', height: 110 }
      ],
      tableTitle: '광명시 동별 인구 분포 데이터'
    },
    mobility: {
      kpis: [
        { label: '대중교통 이용', value: '345,380', unit: '건', icon: '/icons/ic_dash_bus.svg' },
        { label: '차량 통행량', value: '128,544', unit: '대', icon: '/icons/ic_dash_vehicle.svg' },
        { label: '교통 혼잡도', value: '68.5', unit: '점', icon: '/icons/ic_dash_traffic.svg' },
        { label: '공공자전거 이용', value: '2,156', unit: '건', icon: '/icons/ic_dash_bicycle.svg' },
        { label: '접근성 지수', value: '89', unit: '점', icon: '/icons/ic_dash_location.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명사거리역 통행량', val: '210', height: 140 },
        { label: '철산역 통행량', val: '180', height: 120 },
        { label: '하안사거리 통행량', val: '150', height: 100 },
        { label: '광명역 통행량', val: '250', height: 160 }
      ],
      tableTitle: '광명시 주요 교차로 통행량 데이터'
    },
    traffic: {
      kpis: [
        { label: '대중교통 이용', value: '345,380', unit: '건', icon: '/icons/ic_dash_bus.svg' },
        { label: '차량 통행량', value: '128,544', unit: '대', icon: '/icons/ic_dash_vehicle.svg' },
        { label: '교통 혼잡도', value: '68.5', unit: '점', icon: '/icons/ic_dash_traffic.svg' },
        { label: '공공자전거 이용', value: '2,156', unit: '건', icon: '/icons/ic_dash_bicycle.svg' },
        { label: '접근성 지수', value: '89', unit: '점', icon: '/icons/ic_dash_location.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명사거리역 통행량', val: '210', height: 140 },
        { label: '철산역 통행량', val: '180', height: 120 },
        { label: '하안사거리 통행량', val: '150', height: 100 },
        { label: '광명역 통행량', val: '250', height: 160 }
      ],
      tableTitle: '광명시 주요 교차로 통행량 데이터'
    },
    safety: {
      kpis: [
        { label: '안전 지수', value: '83', unit: '점', icon: '/icons/ic_dash_status.svg' },
        { label: '스마트 안전시설', value: '68', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '위험 알림 건수', value: '12', unit: '건', icon: '/icons/ic_dash_warning.svg' },
        { label: '긴급 출동', value: '4', unit: '건', icon: '/icons/ic_dash_alarm.svg' },
        { label: 'CCTV 커버리지', value: '89', unit: '%', icon: '/icons/ic_dash_cctv.svg' },
        { label: '전년 대비', value: '-2.7', unit: '%', icon: '/icons/ic_dash_mom.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '철산권역 방범망', val: '190', height: 130 },
        { label: '하안권역 방범망', val: '160', height: 110 },
        { label: '소하권역 방범망', val: '170', height: 115 },
        { label: '학온권역 방범망', val: '140', height: 90 }
      ],
      tableTitle: '광명시 권역별 치안 통계 데이터'
    },
    data: {
      kpis: [
        { label: '수집 데이터', value: '27,480', unit: '건', icon: '/icons/ic_dash_data1.svg' },
        { label: '데이터 활용', value: '24', unit: '%', icon: '/icons/ic_dash_data2.svg' },
        { label: 'API 호출 수', value: '3,128', unit: '건', icon: '/icons/ic_dash_data3.svg' },
        { label: '개방률', value: '24', unit: '%', icon: '/icons/ic_dash_data4.svg' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+12.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '공공데이터 활용', val: '230', height: 150 },
        { label: '민간데이터 융합', val: '140', height: 90 },
        { label: '실시간 IoT 수집', val: '210', height: 140 },
        { label: '시민참여 데이터', val: '120', height: 80 }
      ],
      tableTitle: '광명시 데이터 개방 포털 통계'
    },
    climate: {
      kpis: [
        { label: '초미세먼지', value: '16', unit: 'μg/m³', icon: '/icons/ic_dash_data1.svg' },
        { label: '평균기온', value: '12.4', unit: '°C', icon: '/icons/ic_dash_status.svg' },
        { label: '온실가스 감축', value: '68.5', unit: '%', icon: '/icons/ic_dash_carbon.svg' },
        { label: '탄소 배출량', value: '239.18', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '녹지 면적', value: '89', unit: 'ha', icon: '/icons/tree.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명권 대기질', val: '90', height: 60 },
        { label: '철산권 대기질', val: '80', height: 50 },
        { label: '하안권 대기질', val: '85', height: 55 },
        { label: '소하권 대기질', val: '95', height: 65 }
      ],
      tableTitle: '광명시 권역별 대기질 오염도 데이터'
    },
    environment: {
      kpis: [
        { label: '초미세먼지', value: '16', unit: 'μg/m³', icon: '/icons/ic_dash_data1.svg' },
        { label: '평균기온', value: '12.4', unit: '°C', icon: '/icons/ic_dash_status.svg' },
        { label: '온실가스 감축', value: '68.5', unit: '%', icon: '/icons/ic_dash_carbon.svg' },
        { label: '탄소 배출량', value: '239.18', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '녹지 면적', value: '89', unit: 'ha', icon: '/icons/tree.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명권 대기질', val: '90', height: 60 },
        { label: '철산권 대기질', val: '80', height: 50 },
        { label: '하안권 대기질', val: '85', height: 55 },
        { label: '소하권 대기질', val: '95', height: 65 }
      ],
      tableTitle: '광명시 권역별 대기질 오염도 데이터'
    },
    public: {
      kpis: [
        { label: '공공시설 총계', value: '323', unit: '개소', icon: '/icons/ic_dash_building2.svg' },
        { label: '전월 대비', value: '+5.2', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' },
        { label: '문화·체육시설', value: '94', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '복지시설', value: '82', unit: '개소', icon: '/icons/ic_dash_home.svg' },
        { label: '교육시설', value: '53', unit: '개소', icon: '/icons/ic_dash_carbon.svg' },
        { label: '접근성 보장률', value: '85', unit: '%', icon: '/icons/ic_dash_coverage.svg' }
      ],
      chartData: [
        { label: '광명동 공공시설', val: '120', height: 80 },
        { label: '철산동 공공시설', val: '80', height: 50 },
        { label: '하안동 공공시설', val: '70', height: 45 },
        { label: '소하동 공공시설', val: '53', height: 35 }
      ],
      tableTitle: '광명시 공공시설 분포 데이터'
    }
  };
`;

content = content.replace(/(const tabData: Record<string, any> = \{[\s\S]*?\};\n)/, tabDataStr + '\n');

fs.writeFileSync(file, content, 'utf8');
console.log('Exact data restored!');
