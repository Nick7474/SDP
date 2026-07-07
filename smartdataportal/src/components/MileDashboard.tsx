import { useState } from 'react';
import { Calendar, ChevronDown, Search, Download, Sun, Zap, BarChart2, Leaf, ShieldCheck, TrendingUp } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import SortSelect from './SortSelect';

interface MileDashboardProps {
  onShowToast: (msg: string) => void;
}

export default function MileDashboard({ onShowToast, title, subtitle, activeTab: externalActiveTab, onTabChange, customTabs }: any) {
  const [internalActiveTab, setInternalActiveTab] = useState('energy');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = (id: string) => {
    if (onTabChange) onTabChange(id);
    else setInternalActiveTab(id);
  };

  const tabs = customTabs || [
    { id: 'energy', label: '에너지 마일' },
    { id: 'mobility', label: '모빌리티 마일' },
    { id: 'safety', label: '세이프티 마일' },
    { id: 'data', label: '데이터 마일' },
  ];

  
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
          title: '월별 발전량 추이', unit: '(Mwh)',
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
    },

    data: {
      kpis: [
        { label: '수집 데이터', value: '42.5', unit: 'TB', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '개방 데이터셋', value: '1,240', unit: '개', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '일일 API 호출', value: '8.5', unit: '만건', icon: '/icons/ic_dash_rising.svg', color: 'var(--fg-1)' },
        { label: '활용률', value: '78', unit: '%', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '운영상태', value: '정상', unit: '', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' },
        { label: '전월 대비', value: '+5.5', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 데이터 수집량', unit: '(TB)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 10, y: 140 }, { val: 20, y: 120 }, { val: 25, y: 85 }, { val: 30, y: 75 }, { val: 42.5, y: 45 }],
          yLabels: [0, 15, 30, 45, 60], yStep: 40
        },
        bar: {
          title: '분야별 데이터 개방',
          data: [{ label: '교통', val: 150 }, { label: '환경', val: 120 }, { label: '안전', val: 130 }, { label: '에너지', val: 110 }, { label: '행정', val: 140 }],
          yLabels: [0, 50, 100, 150, 200, 250], yStep: 32, maxVal: 250
        },
        donut: {
          title: '데이터 활용 비율',
          items: [
            { label: '공공', val: 65, unit: '806 개', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '민간', val: 35, unit: '434 개', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 공공데이터 개방 현황'
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
    },

    traffic: {
      kpis: [
        { label: '일평균 통행량', value: '124', unit: '천대', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '평균 이동속도', value: '32', unit: 'km/h', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '대중교통 분담률', value: '45', unit: '%', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '교통사고 건수', value: '12', unit: '건', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 통행량 추이', unit: '(천대)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 100, y: 140 }, { val: 110, y: 120 }, { val: 115, y: 85 }, { val: 120, y: 75 }, { val: 124, y: 45 }],
          yLabels: [100, 110, 120, 130, 140], yStep: 40
        },
        bar: {
          title: '주요 교차로 통행량',
          data: [{ label: '광명사거리', val: 92000 }, { label: '철산역', val: 85000 }, { label: '하안사거리', val: 76000 }, { label: '광명역', val: 69000 }, { label: '소하사거리', val: 41000 }],
          yLabels: [0, 20000, 40000, 60000, 80000, 100000], yStep: 32, maxVal: 100000
        },
        donut: {
          title: '차량 유형 비율',
          items: [
            { label: '승용차', val: 65, unit: '8만 대', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '상용차', val: 35, unit: '4만 대', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 주요 교차로 통행량 데이터'
    },
    climate: {
      kpis: [
        { label: '초미세먼지', value: '15', unit: 'μg/m³', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '온실가스 배출', value: '180', unit: '천톤', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '폐기물 재활용', value: '62', unit: '%', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '녹지면적률', value: '45', unit: '%', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 미세먼지 추이', unit: '(μg/m³)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 10, y: 140 }, { val: 12, y: 120 }, { val: 13, y: 85 }, { val: 14, y: 75 }, { val: 15, y: 45 }],
          yLabels: [0, 5, 10, 15, 20], yStep: 40
        },
        bar: {
          title: '권역별 대기질 오염도',
          data: [{ label: '광명권', val: 90 }, { label: '철산권', val: 80 }, { label: '하안권', val: 85 }, { label: '소하권', val: 95 }, { label: '학온권', val: 41 }],
          yLabels: [0, 20, 40, 60, 80, 100], yStep: 32, maxVal: 100
        },
        donut: {
          title: '배출원 비율',
          items: [
            { label: '산업', val: 65, unit: '117 천톤', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '수송', val: 35, unit: '63 천톤', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 대기질 모니터링 데이터'
    },
    safety: {
      kpis: [
        { label: 'CCTV 가동률', value: '98', unit: '%', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '범죄율 증감', value: '-2.4', unit: '%', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '긴급출동시간', value: '4.5', unit: '분', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '안전지수', value: 'A', unit: '등급', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 범죄 발생 추이', unit: '(건)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 10, y: 140 }, { val: 12, y: 120 }, { val: 13, y: 85 }, { val: 14, y: 75 }, { val: 15, y: 45 }],
          yLabels: [0, 5, 10, 15, 20], yStep: 40
        },
        bar: {
          title: '권역별 치안 통계',
          data: [{ label: '광명권', val: 90 }, { label: '철산권', val: 80 }, { label: '하안권', val: 85 }, { label: '소하권', val: 95 }, { label: '학온권', val: 41 }],
          yLabels: [0, 20, 40, 60, 80, 100], yStep: 32, maxVal: 100
        },
        donut: {
          title: '신고 유형 비율',
          items: [
            { label: '안전', val: 65, unit: '117 건', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '기타', val: 35, unit: '63 건', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 치안 통계 데이터'
    },
    energy: {
      kpis: [
        { label: '에너지사용', value: '45.2', unit: 'TOE', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '신재생생산', value: '12', unit: 'MWh', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '자립률', value: '15', unit: '%', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '절감목표', value: '92', unit: '%', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 에너지 사용량', unit: '(TOE)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 10, y: 140 }, { val: 12, y: 120 }, { val: 13, y: 85 }, { val: 14, y: 75 }, { val: 15, y: 45 }],
          yLabels: [0, 5, 10, 15, 20], yStep: 40
        },
        bar: {
          title: '권역별 전력 사용량',
          data: [{ label: '광명권', val: 90 }, { label: '철산권', val: 80 }, { label: '하안권', val: 85 }, { label: '소하권', val: 95 }, { label: '학온권', val: 41 }],
          yLabels: [0, 20, 40, 60, 80, 100], yStep: 32, maxVal: 100
        },
        donut: {
          title: '에너지원 비율',
          items: [
            { label: '전력', val: 65, unit: '117 TOE', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '가스', val: 35, unit: '63 TOE', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 에너지 사용량 데이터'
    },
    public: {
      kpis: [
        { label: '공공시설', value: '142', unit: '개소', icon: '/icons/ic_dash_profile.svg', color: 'var(--fg-1)' },
        { label: '이용객수', value: '1.2', unit: '만명', icon: '/icons/ic_dash_home.svg', color: 'var(--fg-1)' },
        { label: '만족도', value: '92', unit: '점', icon: '/icons/ic_dash_people.svg', color: 'var(--fg-1)' },
        { label: '가동률', value: '98', unit: '%', icon: '/icons/ic_dash_building.svg', color: 'var(--fg-1)' },
        { label: '증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: '#F04C4C' },
        { label: '전년 대비', value: '-1.2', unit: '%', icon: '/icons/ic_dash_mom.svg', color: '#F04C4C' }
      ],
      charts: {
        line: {
          title: '월별 시설 이용 추이', unit: '(명)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [{ val: 10, y: 140 }, { val: 12, y: 120 }, { val: 13, y: 85 }, { val: 14, y: 75 }, { val: 15, y: 45 }],
          yLabels: [0, 5, 10, 15, 20], yStep: 40
        },
        bar: {
          title: '유형별 시설 수',
          data: [{ label: '문화', val: 90 }, { label: '체육', val: 80 }, { label: '복지', val: 85 }, { label: '청소년', val: 95 }, { label: '기타', val: 41 }],
          yLabels: [0, 20, 40, 60, 80, 100], yStep: 32, maxVal: 100
        },
        donut: {
          title: '이용자 연령 비율',
          items: [
            { label: '성인', val: 65, unit: '117 명', color: 'var(--gp-primary)', dash: '142.9 219.91', rotate: '126 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(126 50 50)' },
            { label: '아동', val: 35, unit: '63 명', color: '#FFAE1A', dash: '77 219.91', rotate: '0 50 50', line1: 'rotate(0 50 50)', line2: 'rotate(0 50 50)' }
          ],
          text1: { left: '165px', top: '74px' }, text2: { left: '35px', top: '126px' }
        }
      },
      tableTitle: '광명시 공공시설 이용 데이터'
    }
  };

  const dataMap = isCityMode ? cityTabData : mileTabData;
  const currentData = dataMap[activeTab] || dataMap['energy'] || dataMap['population'];
  if (!currentData.charts) {
    currentData.charts = mileTabData.energy.charts;
  }

  return (
    <div className="max-w-[1440px] mx-auto mt-[40px] mb-20 px-0 select-none font-pretendard-gov text-[var(--fg-2)]">
      {/* Dashboard Header */}
      <div className="mb-[40px] flex justify-between items-end">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[24px] font-bold text-[var(--fg-1)]">{title || '마일별 상세 데이터'}</h2>
          <p className="text-[16px] text-[var(--fg-3)]">{subtitle || '선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다.'}</p>
        </div>
        {/* Filters moved to Title Line */}
        <div className="flex items-center gap-[40px] relative">
          <DateRangePicker label="기간 선택" />
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">지역 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[140px]">
              <span className="text-[14px]">광명역세권</span>
              <ChevronDown size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Menu & Filters */}
      <div className="flex mb-[32px]">
        {/* Tabs Container */}
        <div className="flex border border-[var(--border-1)] rounded-[8px] bg-white">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center w-[160px] h-[56px] transition-colors border-r border-[var(--border-1)] last:border-r-0 ${
                  isActive 
                    ? 'bg-[var(--gp-primary)] text-white font-bold text-[16px]' 
                    : 'bg-white text-[var(--fg-4)] font-normal text-[16px] hover:bg-[var(--bg-subtle)]'
                } ${index === 0 ? 'rounded-l-[8px]' : ''} ${index === tabs.length - 1 ? 'rounded-r-[8px]' : ''} font-pretendard-gov`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        
      </div>

      {/* KPI Cards Row */}
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
      </div>

      {/* Charts Row */}
      <div className="flex gap-6 mb-12">
        {/* Chart 1: 월별 발전량 추이 (Line Chart) */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.line.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.01~2026.05</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-50 0 470 220" className="w-full h-full">
              {currentData.charts.line.yLabels.map((val: number, idx: number) => {
                const y = 180 - (idx * currentData.charts.line.yStep);
                return (
                  <g key={val}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-1)" strokeWidth="1" />
                  </g>
                );
              })}
              <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#464C53">{currentData.charts.line.unit}</text>
              {currentData.charts.line.labels.map((label, idx) => (
                <text key={label} x={35 + idx * 85} y="206" textAnchor="middle" fontSize="12" fill="#464C53">{label}</text>
              ))}
              <path d={`M ${currentData.charts.line.data.map((item: any, idx: number) => `${35 + idx * 85} ${item.y}`).join(' L ')}`} fill="none" stroke="var(--light-primary-500)" strokeWidth="2" />
              {currentData.charts.line.data.map((item, idx) => (
                <g key={idx}>
                  <circle cx={35 + idx * 85} cy={item.y} r="4" fill="var(--light-primary-500)" />
                  <circle cx={35 + idx * 85} cy={item.y} r="2" fill="#fff" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: 발전소별 생산량 비교 (Bar Chart) */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.bar.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-50 0 470 230" className="w-full h-full">
              {currentData.charts.bar.yLabels.map((val: number, idx: number) => {
                const y = 180 - (idx * currentData.charts.bar.yStep);
                return (
                  <g key={val}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-1)" strokeWidth="1" />
                  </g>
                );
              })}
              {currentData.charts.bar.data.map((item, idx) => {
                const x = 45 + (idx * 80);
                const h = (Number(item.val) / currentData.charts.bar.maxVal) * 160;
                const y = 180 - h;
                const lines = item.label.split(' ');
                return (
                  <g key={item.label}>
                    <rect x={x - 15} y={y} width="30" height={h} fill="var(--gp-point)" rx="2" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="11" fill="var(--fg-1)" fontWeight="600">{Number(item.val).toLocaleString()}</text>
                    <text x={x} y="204" textAnchor="middle" fontSize="12" fill="#464C53">{lines[0]}</text>
                    <text x={x} y="222" textAnchor="middle" fontSize="12" fill="#464C53">{lines[1]}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: 상계/거래 비율 (Donut Chart) */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.donut.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 flex items-center justify-center relative mt-2">
            <div className="relative w-[200px] h-[200px]">
              <svg viewBox="-1 -1 102 102" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke={currentData.charts.donut.items[1].color} strokeWidth="30" strokeDasharray={currentData.charts.donut.items[1].dash} />
                <circle cx="50" cy="50" r="35" fill="none" stroke={currentData.charts.donut.items[0].color} strokeWidth="30" strokeDasharray={currentData.charts.donut.items[0].dash} transform={currentData.charts.donut.items[0].rotate ? `rotate(${currentData.charts.donut.items[0].rotate.replace('rotate(','').replace(')','')})` : ''} />
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
            {/* Search Input using .gp-searchfield */}
            <div className="gp-searchfield w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-4)]" size={20} />
              <input type="text" placeholder="검색어를 입력하세요" className="gp-input !pl-[48px]" />
            </div>
            {/* Search Button */}
            <button className="gp-btn gp-btn--primary gp-btn--h48 ml-1 w-[80px]">
              검색
            </button>
            {/* Sort Select */}
            <div className="ml-2">
              <SortSelect width="w-[120px]" size="h48" />
            </div>
          </div>
        </div>

        {/* Table using DS classes */}
        <div className="gp-table-container overflow-x-auto">
        <table className="gp-table w-full whitespace-nowrap min-w-[1200px]">
          <thead>
            <tr>
              <th className="w-[80px] !text-center">번호</th>
              <th className="text-left w-[240px]">데이터명</th>
              <th className="w-[120px] !text-center">마일</th>
              <th className="w-[240px] text-left">솔루션</th>
              <th className="w-[160px] text-left">데이터 항목</th>
              <th className="w-[100px] !text-center">형식</th>
              <th className="w-[140px] !text-center">기준일</th>
              <th className="w-[100px] !text-center">상세</th>
              <th className="w-[140px] !text-center">다운로드</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, idx) => (
              <tr key={idx}>
                <td className="!text-center text-[var(--fg-4)]">{99 - idx}</td>
                <td className="text-left"><span className="ttl">{currentData.tableTitle}</span></td>
                <td className="!text-center">에너지</td>
                <td className="text-left">신재생 에너지 자원 발전소</td>
                <td className="text-left">발전량</td>
                <td className="!text-center">CSV</td>
                <td className="!text-center text-[var(--fg-3)]">2026-06-26</td>
                <td className="!text-center">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => onShowToast("데이터 상세 보기 팝업이 열립니다.")}
                      className="gp-btn gp-btn--secondary gp-btn--sm"
                    >
                      보기
                    </button>
                  </div>
                </td>
                <td className="!text-center">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => onShowToast("'광명역_태양광_발전량_데이터.csv' 파일이 다운로드 되었습니다.")}
                      className="gp-btn gp-btn--secondary gp-btn--sm gap-1 mx-auto"
                    >
                      <Download size={14} /> 다운로드
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Pagination using DS classes */}
      <div className="gp-pager mt-8">
        <button className="nav" aria-label="이전">‹ 이전</button>
        <button aria-current="true">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button className="nav" disabled style={{ background: 'transparent', cursor: 'default' }}>…</button>
        <button>120</button>
        <button className="nav" aria-label="다음">다음 ›</button>
      </div>

    </div>
  );
}
