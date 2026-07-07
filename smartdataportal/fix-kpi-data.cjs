const fs = require('fs');

const file = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the entire tabData definition
const tabDataStr = `
  const tabData: Record<string, any> = {
    energy: {
      kpis: [
        { label: '총 발전량', value: '350', unit: 'MWh', icon: '/icons/ic_dash_gen.svg' },
        { label: '현재 출력', value: '168', unit: 'MWh', icon: '/icons/ic_dash_output.svg' },
        { label: '누적발전량', value: '1,268', unit: 'MWh', icon: '/icons/ic_dash_totalgen.svg' },
        { label: '탄소저감량', value: '156.15', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+12.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
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
    mobility: {
      kpis: [
        { label: '일평균 통행량', value: '124', unit: '천대', icon: '/icons/ic_dash_traffic.svg' },
        { label: '평균 이동속도', value: '32', unit: 'km/h', icon: '/icons/ic_dash_speed.svg' },
        { label: '대중교통 분담률', value: '45', unit: '%', icon: '/icons/ic_dash_bus.svg' },
        { label: '교통사고 건수', value: '12', unit: '건', icon: '/icons/ic_dash_warning.svg' },
        { label: '교통흐름', value: '원활', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비 통행량', value: '-2.1', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
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
        { label: 'CCTV 가동률', value: '98', unit: '%', icon: '/icons/ic_dash_cctv.svg' },
        { label: '범죄율 증감', value: '-2.4', unit: '%', icon: '/icons/ic_dash_shield.svg' },
        { label: '긴급출동 평균시간', value: '4.5', unit: '분', icon: '/icons/ic_dash_clock.svg' },
        { label: '안전지수', value: 'A', unit: '등급', icon: '/icons/ic_dash_safe.svg' },
        { label: '시스템상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+5.2', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
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
        { label: '수집 데이터', value: '42.5', unit: 'TB', icon: '/icons/ic_dash_data2.svg' },
        { label: '개방 데이터셋', value: '1,240', unit: '개', icon: '/icons/ic_dash_data3.svg' },
        { label: '일일 API 호출', value: '8.5', unit: '만건', icon: '/icons/ic_dash_api.svg' },
        { label: '데이터 활용률', value: '78', unit: '%', icon: '/icons/ic_dash_chart.svg' },
        { label: '서버상태', value: '안정', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비 증가', value: '+14.2', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '공공데이터 활용', val: '230', height: 150 },
        { label: '민간데이터 융합', val: '140', height: 90 },
        { label: '실시간 IoT 수집', val: '210', height: 140 },
        { label: '시민참여 데이터', val: '120', height: 80 }
      ],
      tableTitle: '광명시 데이터 개방 포털 통계'
    },
    population: {
      kpis: [
        { label: '총 인구수', value: '28.5', unit: '만명', icon: '/icons/ic_dash_people.svg' },
        { label: '세대수', value: '11.2', unit: '만세대', icon: '/icons/ic_dash_home.svg' },
        { label: '청년 비율', value: '28.4', unit: '%', icon: '/icons/ic_dash_youth.svg' },
        { label: '노년 비율', value: '15.2', unit: '%', icon: '/icons/ic_dash_elder.svg' },
        { label: '인구 증감상태', value: '안정', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+0.4', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명동 인구', val: '250', height: 160 },
        { label: '철산동 인구', val: '220', height: 140 },
        { label: '하안동 인구', val: '190', height: 120 },
        { label: '소하동 인구', val: '180', height: 110 }
      ],
      tableTitle: '광명시 동별 인구 분포 데이터'
    },
    economy: {
      kpis: [
        { label: '지역내총생산', value: '8.5', unit: '조원', icon: '/icons/ic_dash_money.svg' },
        { label: '사업체 수', value: '2.4', unit: '만개', icon: '/icons/ic_dash_building.svg' },
        { label: '종사자 수', value: '14.2', unit: '만명', icon: '/icons/ic_dash_people2.svg' },
        { label: '벤처기업 수', value: '320', unit: '개', icon: '/icons/ic_dash_rocket.svg' },
        { label: '경제지표', value: '양호', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+3.1', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '제조업 생산', val: '200', height: 130 },
        { label: '서비스업 생산', val: '240', height: 155 },
        { label: '건설업 생산', val: '120', height: 80 },
        { label: '도소매업 생산', val: '160', height: 105 }
      ],
      tableTitle: '광명시 주요 산업별 생산 데이터'
    },
    environment: {
      kpis: [
        { label: '초미세먼지', value: '15', unit: 'μg/m³', icon: '/icons/ic_dash_pm25.svg' },
        { label: '온실가스 배출', value: '180', unit: '천톤', icon: '/icons/ic_dash_carbon.svg' },
        { label: '폐기물 재활용', value: '62', unit: '%', icon: '/icons/ic_dash_recycle.svg' },
        { label: '녹지면적률', value: '45', unit: '%', icon: '/icons/ic_dash_green.svg' },
        { label: '대기상태', value: '좋음', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '-4.5', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      chartData: [
        { label: '광명권 대기질', val: '90', height: 60 },
        { label: '철산권 대기질', val: '80', height: 50 },
        { label: '하안권 대기질', val: '85', height: 55 },
        { label: '소하권 대기질', val: '95', height: 65 }
      ],
      tableTitle: '광명시 권역별 대기질 오염도 데이터'
    }
  };`;

content = content.replace(/(const tabData: Record<string, any> = \{[\s\S]*?\};\n)/, tabDataStr + '\n');

// 2. Replace the KPI block to use custom color and hide the last vertical line
const kpiRegex = /<div className="w-full h-\[120px\] bg-white border border-\[var\(--border-light\)\] rounded-\[12px\] mb-6 flex items-center justify-between px-\[40px\] shadow-none">[\s\S]*?(?=\{\/\* Charts Row \*\/\}|<div className="flex gap-6 mb-12">)/;

const newKpiBlock = `<div className="w-full h-[120px] bg-white border border-[var(--border-light)] rounded-[12px] mb-6 flex items-center justify-between px-[40px] shadow-none">
        {currentData.kpis.map((kpi: any, idx: number) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-4 flex-1">
              <img src={kpi.icon} alt={kpi.label} className="w-[48px] h-[48px] shrink-0" onError={(e) => { e.currentTarget.src = "/icons/ic_dash_gen.svg"; }} />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[var(--fg-3)] leading-tight mb-1">{kpi.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold leading-none" style={{ color: kpi.color || 'var(--fg-1)' }}>{kpi.value}</span>
                  {kpi.unit && <span className="text-[14px] font-medium text-[var(--fg-4)] leading-none">{kpi.unit}</span>}
                </div>
              </div>
            </div>
            {idx < currentData.kpis.length - 1 && <div className="h-[28px] w-[1px] bg-[var(--border-1)] shrink-0 ml-auto mr-auto" />}
          </React.Fragment>
        ))}
      </div>
      `;

content = content.replace(kpiRegex, newKpiBlock);

fs.writeFileSync(file, content, 'utf8');
console.log('KPI data fixed!');
