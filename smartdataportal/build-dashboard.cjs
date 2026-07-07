const fs = require('fs');

const tsxContent = `import React, { useState } from 'react';
import BarChart from './BarChart';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface MileDashboardProps {
  onShowToast: (msg: string) => void;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  title?: string;
  subtitle?: string;
  customTabs?: { id: string; label: string }[];
}

export default function MileDashboard({ onShowToast, activeTab, onTabChange, title, subtitle, customTabs }: MileDashboardProps) {
  const [localActiveTab, setLocalActiveTab] = useState('energy');
  const currentTab = activeTab || localActiveTab;
  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    else setLocalActiveTab(tab);
  };

  const tabs = customTabs || [
    { id: 'energy', label: '에너지·건물' },
    { id: 'mobility', label: '교통·이동' },
    { id: 'environment', label: '환경·기후' },
    { id: 'safety', label: '안전·재난' },
    { id: 'public', label: '공공시설' }
  ];

  const tabData: Record<string, any> = {
    energy: {
      kpis: [
        { label: '총 발전량', value: '1,420', unit: 'MWh', icon: '/icons/ic_dash_gen.svg' },
        { label: '시간당 발전량', value: '59.2', unit: 'MWh', icon: '/icons/ic_dash_clock.svg' },
        { label: '운영 중인 발전소', value: '12', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '절감률', value: '15.4', unit: '%', icon: '/icons/ic_dash_saverate.svg' },
        { label: '온실가스 감축량', value: '2,100', unit: 'tCO2', icon: '/icons/ic_dash_carbon.svg' },
      ],
      donutLegends: [
        { name: '공공시설', percent: '48%', value: '(763MWh)', color: '#0B50A0' },
        { name: '주거시설', percent: '32%', value: '(509MWh)', color: '#2B7EEB' },
        { name: '상업시설', percent: '15%', value: '(238MWh)', color: '#66A8FF' },
        { name: '산업시설', percent: '5%', value: '(79MWh)', color: '#A3CDFF' }
      ]
    },
    mobility: {
      kpis: [
        { label: '총 운행 차량', value: '45,210', unit: '대', icon: '/icons/ic_dash_vehicle.svg' },
        { label: '일일 교통량', value: '120,500', unit: '대', icon: '/icons/ic_dash_traffic.svg' },
        { label: '평균 이동 시간', value: '35', unit: '분', icon: '/icons/ic_dash_clock.svg' },
        { label: '혼잡도', value: '보통', unit: '', icon: '/icons/ic_dash_data2.svg' },
        { label: '대중교통 이용률', value: '42.5', unit: '%', icon: '/icons/ic_dash_bus.svg' },
      ],
      donutLegends: [
        { name: '승용차', percent: '55%', value: '(66,275대)', color: '#0B50A0' },
        { name: '버스', percent: '30%', value: '(36,150대)', color: '#2B7EEB' },
        { name: '택시', percent: '10%', value: '(12,050대)', color: '#66A8FF' },
        { name: '화물차', percent: '5%', value: '(6,025대)', color: '#A3CDFF' }
      ]
    },
    environment: {
      kpis: [
        { label: '초미세먼지', value: '12', unit: 'μg/m³', icon: '/icons/ic_dash_pm25.svg' },
        { label: '평균기온', value: '24.5', unit: '°C', icon: '/icons/ic_dash_temp.svg' },
        { label: '녹지 접근성', value: '85', unit: '%', icon: '/icons/ic_dash_green.svg' },
        { label: '온실가스 배출량', value: '1,200', unit: 'tCO2', icon: '/icons/ic_dash_ghg.svg' },
        { label: '환경 쾌적성', value: '좋음', unit: '', icon: '/icons/ic_dash_comfort.svg' },
      ],
      donutLegends: [
        { name: '산업', percent: '40%', value: '(480tCO2)', color: '#0B50A0' },
        { name: '수송', percent: '35%', value: '(420tCO2)', color: '#2B7EEB' },
        { name: '건물', percent: '20%', value: '(240tCO2)', color: '#66A8FF' },
        { name: '기타', percent: '5%', value: '(60tCO2)', color: '#A3CDFF' }
      ]
    },
    safety: {
      kpis: [
        { label: '총 안전시설', value: '1,240', unit: '개', icon: '/icons/ic_dash_mom.svg' },
        { label: 'CCTV 수', value: '850', unit: '대', icon: '/icons/ic_dash_cctv.svg' },
        { label: '대피소 수', value: '120', unit: '개소', icon: '/icons/ic_dash_home.svg' },
        { label: '소방시설 수', value: '270', unit: '개', icon: '/icons/ic_dash_data4.svg' },
        { label: '사고 발생률', value: '1.2', unit: '%', icon: '/icons/ic_dash_warning.svg' },
      ],
      donutLegends: [
        { name: '교통안전', percent: '50%', value: '(620개)', color: '#0B50A0' },
        { name: '생활안전', percent: '30%', value: '(372개)', color: '#2B7EEB' },
        { name: '재난안전', percent: '15%', value: '(186개)', color: '#66A8FF' },
        { name: '기타', percent: '5%', value: '(62개)', color: '#A3CDFF' }
      ]
    },
    public: {
      kpis: [
        { label: '공공시설 수', value: '450', unit: '개소', icon: '/icons/ic_dash_building2.svg' },
        { label: '전월 대비', value: '+12', unit: '개소', icon: '/icons/ic_dash_rising.svg' },
        { label: '문화·체육시설', value: '125', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '복지시설', value: '85', unit: '개소', icon: '/icons/ic_dash_home.svg' },
        { label: '평균접근성', value: '92', unit: '%', icon: '/icons/ic_dash_coverage.svg' },
      ],
      donutLegends: [
        { name: '문화·체육', percent: '35%', value: '(157개)', color: '#0B50A0' },
        { name: '복지', percent: '25%', value: '(112개)', color: '#2B7EEB' },
        { name: '교육', percent: '20%', value: '(90개)', color: '#66A8FF' },
        { name: '보건', percent: '10%', value: '(45개)', color: '#A3CDFF' },
        { name: '기타', percent: '10%', value: '(46개)', color: '#E5F0FF' }
      ]
    }
  };

  const currentData = tabData[currentTab] || tabData['energy'];

  return (
    <div className="w-[1440px] shrink-0 flex flex-col items-start px-[80px] py-[40px]">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex items-end gap-3">
          <h2 className="text-[28px] font-bold text-[var(--fg-1)] flex items-center gap-3">
            {title || '마일별 데이터 현황'}
            <span className="text-[14px] font-medium text-white bg-[var(--gp-primary)] px-3 py-1 rounded-[20px] shadow-sm">
              데이터 기준일: 2026-06-26
            </span>
          </h2>
          <p className="text-[16px] text-[var(--fg-3)] mb-1">
            {subtitle || '광명시의 다양한 마일별 데이터를 한눈에 확인하세요.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-light)] mb-[40px] w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={\`px-6 py-4 text-[16px] font-bold relative transition-colors \${
              currentTab === tab.id
                ? 'text-[var(--gp-primary)]'
                : 'text-[var(--fg-4)] hover:text-[var(--fg-3)]'
            }\`}
          >
            {tab.label}
            {currentTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--gp-primary)]" />
            )}
          </button>
        ))}
      </div>

      {/* KPI Cards Row */}
      <div className="flex gap-[24px] mb-[40px] w-full">
        {currentData.kpis.map((kpi: any, idx: number) => (
          <div key={idx} className="flex flex-col bg-white border border-[var(--border-1)] rounded-[12px] p-[24px] shadow-sm flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#F5F8FF] flex items-center justify-center">
                <img src={kpi.icon} alt="icon" className="w-[24px] h-[24px]" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-medium text-[var(--fg-3)]">{kpi.label}</span>
              <div className="flex items-baseline gap-[4px]">
                <span className="text-[28px] font-bold text-[var(--fg-1)]">{kpi.value}</span>
                <span className="text-[15px] font-medium text-[var(--fg-4)]">{kpi.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex gap-[24px] mb-[40px] w-full">
        {/* Bar Chart 1 */}
        <BarChart title="월별 추이" dateLabel="2026.06.26" yAxisTicks={[0, 20, 40, 60, 80]} maxValue={80} yAxisUnit="" data={[{label:'1월',val:45}, {label:'2월',val:52}, {label:'3월',val:38}, {label:'4월',val:65}, {label:'5월',val:48}, {label:'6월',val:55}, {label:'7월',val:42}, {label:'8월',val:60}, {label:'9월',val:50}, {label:'10월',val:48}, {label:'11월',val:55}, {label:'12월',val:62}]} />

        {/* Bar Chart 2 */}
        <BarChart title="권역별 현황" dateLabel="2026.06.26" yAxisTicks={[0, 20, 40, 60, 80, 100]} maxValue={100} yAxisUnit="" data={[{label:'광명권',val:85}, {label:'철산권',val:62}, {label:'하안권',val:45}, {label:'소하권',val:30}]} />

        {/* Donut Chart */}
        <div className="w-[304px] shrink-0 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-[24px] flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">구성비</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.06.26</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative mt-2">
            <div className="relative w-[140px] h-[140px] mb-[16px]">
              <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5F0FF" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0B50A0" strokeWidth="20" strokeDasharray="120.6 251.2" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2B7EEB" strokeWidth="20" strokeDasharray="80.4 251.2" strokeDashoffset="-120.6" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#66A8FF" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-201" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#A3CDFF" strokeWidth="20" strokeDasharray="12.5 251.2" strokeDashoffset="-238.7" />
              </svg>
            </div>
            <div className="flex flex-col gap-[6px] w-full">
              {currentData.donutLegends.map((leg: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: leg.color }} />
                    <span className="ml-[6px] text-[13px] font-medium text-[var(--fg-2)]">{leg.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[13px] font-bold text-[var(--fg-1)]">{leg.percent}</span>
                    <span className="ml-[4px] text-[11px] text-[var(--fg-4)] w-[48px] text-right">{leg.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="flex flex-col gap-[16px] w-full shrink-0 mb-[24px]">
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col gap-[40px] text-left">
            <h2 className="font-pretendard-gov text-[24px] font-bold text-[#16243B] leading-none">
              원천 데이터
            </h2>
            <span className="font-pretendard-gov text-[16px] text-[#7C8896] font-normal leading-none mb-1">
              총 242건
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="gp-searchfield w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-4)]" size={20} />
              <input type="text" placeholder="검색어를 입력하세요" className="gp-input !pl-[48px]" />
            </div>
            <button className="gp-btn gp-btn--primary gp-btn--h48 ml-1 w-[80px]">
              검색
            </button>
            <button className="gp-select-btn gp-select-btn--h48 w-[120px] ml-2">
              <span className="text-[14px]">최신순</span>
              <ChevronDown size={16} className="text-[var(--fg-4)]" />
            </button>
          </div>
        </div>

        <div className="gp-table-container overflow-x-auto">
          <table className="gp-table w-full whitespace-nowrap min-w-[1200px]">
            <thead>
              <tr>
                <th className="w-[80px] !text-center">번호</th>
                <th className="text-left w-[240px]">데이터명</th>
                <th className="w-[120px] !text-center">마일</th>
                <th className="w-[240px] text-left">분류</th>
                <th className="w-[160px] text-left">데이터 항목</th>
                <th className="w-[100px] !text-center">형식</th>
                <th className="w-[140px] !text-center">기준일</th>
                <th className="w-[100px] !text-center">상세보기</th>
                <th className="w-[100px] !text-center">다운로드</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((idx) => (
                <tr key={idx}>
                  <td className="!text-center">{idx}</td>
                  <td className="text-left font-medium text-[var(--fg-2)]">광명시 {currentData.kpis[0].label} 현황 {idx}</td>
                  <td className="!text-center">{tabs.find(t => t.id === currentTab)?.label || '데이터'}</td>
                  <td className="text-left">전체 지역</td>
                  <td className="text-left">주요 측정 항목</td>
                  <td className="!text-center">CSV</td>
                  <td className="!text-center">2026-06-26</td>
                  <td className="!text-center">
                    <button className="gp-btn gp-btn--secondary gp-btn--sm h-[32px] px-3">보기</button>
                  </td>
                  <td className="!text-center">
                    <button onClick={() => onShowToast("파일이 다운로드 되었습니다")} className="gp-btn gp-btn--secondary gp-btn--sm h-[32px] px-3 text-[var(--gp-primary)]">
                      다운로드
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <div className="gp-pagination">
            <button className="gp-pagination__btn gp-pagination__btn--prev"><ChevronLeft size={16}/></button>
            <button className="gp-pagination__btn gp-pagination__btn--active">1</button>
            <button className="gp-pagination__btn">2</button>
            <button className="gp-pagination__btn">3</button>
            <button className="gp-pagination__btn">4</button>
            <button className="gp-pagination__btn">5</button>
            <button className="gp-pagination__btn gp-pagination__btn--next"><ChevronRight size={16}/></button>
          </div>
        </div>

      </div>

    </div>
  );
}
`;

fs.writeFileSync('c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx', tsxContent, 'utf8');
console.log('UI structure perfectly replicated!');
