const fs = require('fs');

let code = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf8');

// 1. We replace the current tabData with our new mileTabData and cityTabData
const tabDataRegex = /const tabData: Record<string, any> = \{[\s\S]*?^  \};\n/m;
const newTabData = `
  const isCityMode = !!title;

  const mileTabData: Record<string, any> = {
    energy: {
      kpis: [
        { label: '총 발전량', value: '12,450', unit: 'MWH', icon: '/icons/ic_dash_gen.svg' },
        { label: '건물 에너지', value: '2,182', unit: 'MWH', icon: '/icons/ic_dash_building.svg' },
        { label: '온실가스 감축량', value: '239.1', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '에너지 효율 등급', value: 'B', unit: '등급', icon: '/icons/ic_dash_building2.svg' },
        { label: '전월 대비', value: '-4.8', unit: '%', icon: '/icons/ic_dash_home.svg' },
        { label: '전년 대비', value: '-2.7', unit: '%', icon: '/icons/ic_dash_mom.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 발전량 추이', unit: '(MWh)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [100, 150, 240, 260, 340],
          max: 400
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
          max: 250
        },
        donut: {
          title: '상계/거래 비율',
          items: [
            { label: '상계', val: 62, color: '#0C51A3', unit: '217 MWh' },
            { label: '거래', val: 38, color: '#FFAE1A', unit: '135 MWh' }
          ]
        }
      },
      tableTitle: '광명역 태양광 발전량 데이터'
    },
    mobility: {
      kpis: [
        { label: '총 운행량', value: '12,480', unit: '회', icon: '/icons/ic_dash_bus.svg' },
        { label: '이용자 수', value: '168', unit: '명', icon: '/icons/ic_dash_profile.svg' },
        { label: '평균 배차시간', value: '6.7', unit: '분', icon: '/icons/ic_dash_clock.svg' },
        { label: '운행 커버리지', value: '92', unit: '%', icon: '/icons/ic_dash_coverage.svg' },
        { label: '전월 대비', value: '+2.3', unit: '%', icon: '/icons/ic_dash_rising.svg', color: 'var(--gp-primary)' }
      ],
      charts: {
        line: {
          title: '월별 모빌리티 이용 추이', unit: '(명)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [2000, 3000, 5000, 5200, 7000],
          max: 10000
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
          max: 4000
        },
        donut: {
          title: '이동 수단 비율',
          items: [
            { label: 'EV-DRT', val: 58, color: '#0C51A3', unit: '17,037 건' },
            { label: '기타', val: 42, color: '#3BA051', unit: '10,443 건' }
          ]
        }
      },
      tableTitle: '광명시 EV-DRT 운행 데이터'
    },
    safety: {
      kpis: [
        { label: '총 감지건수', value: '27,480', unit: '건', icon: '/icons/ic_dash_alarm.svg' },
        { label: '긴급 대응 건수', value: '15', unit: '건', icon: '/icons/ic_dash_emergency.svg' },
        { label: '위험지역 모니터링', value: '24', unit: '개소', icon: '/icons/ic_dash_location.svg' },
        { label: '안전 지수', value: 'A', unit: '등급', icon: '/icons/ic_dash_status.svg', color: 'var(--status-success)' }
      ],
      charts: {
        line: {
          title: '월별 안전 이벤트 추이', unit: '(건)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [100, 150, 240, 260, 340],
          max: 400
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
          max: 2000
        },
        donut: {
          title: '위험 감지 유형 비율',
          items: [
            { label: '스마트폴', val: 62, color: '#0C51A3', unit: '17,037 건' },
            { label: '기타', val: 38, color: '#FFAE1A', unit: '10,443 건' }
          ]
        }
      },
      tableTitle: '광명시 스마트 폴 감지 데이터'
    },
    data: {
      kpis: [
        { label: '수집 데이터', value: '27,480', unit: '건', icon: '/icons/ic_dash_data1.svg' },
        { label: '데이터 활용', value: '24', unit: '%', icon: '/icons/ic_dash_data2.svg' },
        { label: 'API 호출 수', value: '3,128', unit: '건', icon: '/icons/ic_dash_data3.svg' },
        { label: '개방률', value: '24', unit: '%', icon: '/icons/ic_dash_data4.svg' }
      ],
      charts: {
        line: {
          title: '데이터 개방 추이', unit: '(건)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [10, 25, 45, 80, 120],
          max: 150
        },
        bar: {
          title: '분야별 데이터 활용',
          data: [
            { label: '공공데이터 활용', val: 230 },
            { label: '민간데이터 융합', val: 140 },
            { label: '실시간 IoT 수집', val: 210 },
            { label: '시민참여 데이터', val: 120 },
            { label: '공간정보 활용', val: 180 }
          ],
          max: 300
        },
        donut: {
          title: '데이터 유형 비율',
          items: [
            { label: '정형', val: 75, color: '#0C51A3', unit: '3,450 건' },
            { label: '비정형', val: 25, color: '#3BA051', unit: '1,150 건' }
          ]
        }
      },
      tableTitle: '광명시 데이터 개방 포털 통계'
    }
  };

  const cityTabData: Record<string, any> = {
    population: {
      kpis: [
        { label: '총 인구', value: '282,927', unit: '명', icon: '/icons/ic_dash_community.svg' },
        { label: '세대 수', value: '124,557', unit: '세대', icon: '/icons/ic_dash_home.svg' },
        { label: '인구 증감', value: '-0.3', unit: '%', icon: '/icons/ic_dash_warning.svg', color: '#F04C4C' },
        { label: '행정동 수', value: '18', unit: '개동', icon: '/icons/ic_dash_building.svg' }
      ],
      charts: {
        line: {
          title: '월별 인구 추이', unit: '(명)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [283500, 283300, 283100, 283000, 282927],
          max: 284000
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
          max: 100000
        },
        donut: {
          title: '연령별 인구 비율',
          items: [
            { label: '청장년', val: 65, color: '#0C51A3', unit: '18.3만 명' },
            { label: '노년/유소년', val: 35, color: '#FFAE1A', unit: '9.9만 명' }
          ]
        }
      },
      tableTitle: '광명시 동별 인구 분포 데이터'
    },
    traffic: {
      kpis: [
        { label: '대중교통 이용', value: '345,380', unit: '건', icon: '/icons/ic_dash_bus.svg' },
        { label: '차량 통행량', value: '128,544', unit: '대', icon: '/icons/ic_dash_vehicle.svg' },
        { label: '교통 혼잡도', value: '68.5', unit: '점', icon: '/icons/ic_dash_traffic.svg' },
        { label: '공공자전거 이용', value: '2,156', unit: '건', icon: '/icons/ic_dash_bicycle.svg' }
      ],
      charts: {
        line: {
          title: '월별 대중교통 이용', unit: '(만건)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [32, 33, 35, 34, 34.5],
          max: 40
        },
        bar: {
          title: '주요 교차로 통행량',
          data: [
            { label: '광명사거리', val: 45000 },
            { label: '철산역', val: 38000 },
            { label: '하안사거리', val: 32000 },
            { label: '광명역', val: 51000 },
            { label: '소하삼거리', val: 29000 }
          ],
          max: 60000
        },
        donut: {
          title: '출퇴근 수단 비율',
          items: [
            { label: '대중교통', val: 54, color: '#3BA051', unit: '18.6만 건' },
            { label: '자가용', val: 46, color: '#F04C4C', unit: '15.9만 건' }
          ]
        }
      },
      tableTitle: '광명시 주요 교차로 통행량 데이터'
    },
    climate: {
      kpis: [
        { label: '초미세먼지', value: '16', unit: 'μg/m³', icon: '/icons/ic_dash_data1.svg' },
        { label: '평균기온', value: '12.4', unit: '°C', icon: '/icons/ic_dash_status.svg' },
        { label: '온실가스 배출', value: '239.18', unit: 'tCO₂eq', icon: '/icons/ic_dash_carbon.svg' },
        { label: '녹지 면적', value: '89', unit: 'ha', icon: '/icons/tree.svg' }
      ],
      charts: {
        line: {
          title: '월별 미세먼지 농도', unit: '(μg/m³)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [25, 22, 28, 19, 16],
          max: 50
        },
        bar: {
          title: '권역별 대기질 오염도',
          data: [
            { label: '광명권', val: 18 },
            { label: '철산권', val: 15 },
            { label: '하안권', val: 16 },
            { label: '소하권', val: 14 },
            { label: '학온권', val: 12 }
          ],
          max: 30
        },
        donut: {
          title: '대기질 좋음 비율',
          items: [
            { label: '좋음/보통', val: 82, color: '#1587E1', unit: '25일' },
            { label: '나쁨', val: 18, color: '#F04C4C', unit: '5일' }
          ]
        }
      },
      tableTitle: '광명시 권역별 대기질 오염도 데이터'
    },
    public: {
      kpis: [
        { label: '공공시설 총계', value: '323', unit: '개소', icon: '/icons/ic_dash_building2.svg' },
        { label: '문화·체육시설', value: '94', unit: '개소', icon: '/icons/ic_dash_building.svg' },
        { label: '복지시설', value: '82', unit: '개소', icon: '/icons/ic_dash_home.svg' },
        { label: '접근성 보장률', value: '85', unit: '%', icon: '/icons/ic_dash_coverage.svg' }
      ],
      charts: {
        line: {
          title: '공공시설 이용객', unit: '(천명)',
          labels: ['2026.01', '2026.02', '2026.03', '2026.04', '2026.05'],
          data: [150, 162, 175, 180, 192],
          max: 250
        },
        bar: {
          title: '동별 공공시설 현황',
          data: [
            { label: '광명동', val: 120 },
            { label: '철산동', val: 80 },
            { label: '하안동', val: 70 },
            { label: '소하동', val: 53 },
            { label: '학온동', val: 40 }
          ],
          max: 150
        },
        donut: {
          title: '시설물 유형 비율',
          items: [
            { label: '문화복지', val: 54, color: '#6E74D6', unit: '174개소' },
            { label: '기타행정', val: 46, color: '#1AAA5E', unit: '149개소' }
          ]
        }
      },
      tableTitle: '광명시 공공시설 분포 데이터'
    }
  };
  
  const dataMap = isCityMode ? cityTabData : mileTabData;
  const currentData = dataMap[activeTab] || dataMap['energy'] || dataMap['population'];
  if (!currentData.charts) {
    currentData.charts = mileTabData.energy.charts; // fallback
  }
`;

code = code.replace(tabDataRegex, newTabData);

// Replace currentData extraction
const curDataRegex = /const currentData = tabData\[activeTab\] \|\| tabData\['energy'\];/;
code = code.replace(curDataRegex, '');


// Now replace the Charts Row. We find <div className="flex gap-6 mb-12"> and the end of it.
const chartStartIdx = code.indexOf('<div className="flex gap-6 mb-12">');
const tableStartIdx = code.indexOf('<div className="w-full bg-white border border-[var(--border-light)] rounded-[12px] shadow-none overflow-hidden pb-4">');

if (chartStartIdx !== -1 && tableStartIdx !== -1) {
  const dynamicCharts = `
      {/* Charts Row */}
      <div className="flex gap-6 mb-12">
        {/* Chart 1: Line Chart */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.line.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.01~2026.05</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-40 0 460 220" className="w-full h-full overflow-visible">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const val = currentData.charts.line.max * ratio;
                const y = 180 - (ratio * 140);
                return (
                  <g key={idx}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val === 0 ? 0 : val.toLocaleString()}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-1)" strokeWidth="1" />
                  </g>
                );
              })}
              <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#464C53">{currentData.charts.line.unit}</text>
              {currentData.charts.line.labels.map((label: string, idx: number) => (
                <text key={label} x={35 + idx * 85} y="206" textAnchor="middle" fontSize="12" fill="#464C53">{label}</text>
              ))}
              
              <path d={\`M \${currentData.charts.line.data.map((val: number, idx: number) => \`\${35 + idx * 85} \${180 - ((val / currentData.charts.line.max) * 140)}\`).join(' L ')}\`} fill="none" stroke="var(--light-primary-500)" strokeWidth="2" />
              {currentData.charts.line.data.map((val: number, idx: number) => (
                <circle key={idx} cx={35 + idx * 85} cy={180 - ((val / currentData.charts.line.max) * 140)} r="4" fill="var(--light-primary-500)" />
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: Bar Chart */}
        <div className="flex-1 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.bar.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 relative w-full h-full mt-2">
            <svg viewBox="-40 0 460 220" className="w-full h-full overflow-visible">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const val = currentData.charts.bar.max * ratio;
                const y = 180 - (ratio * 140);
                return (
                  <g key={idx}>
                    <text x="-10" y={y + 4} textAnchor="end" fontSize="12" fill="#464C53">{val === 0 ? 0 : val.toLocaleString()}</text>
                    <line x1="0" y1={y} x2="410" y2={y} stroke="var(--border-light)" strokeWidth="1" />
                  </g>
                );
              })}
              {currentData.charts.bar.data.map((item: any, idx: number) => {
                const x = 45 + (idx * 80);
                const h = (item.val / currentData.charts.bar.max) * 140;
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
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Donut Chart */}
        <div className="w-[420px] shrink-0 h-[320px] bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-pretendard-gov font-bold text-[18px] text-[var(--fg-1)]">{currentData.charts.donut.title}</h3>
            <span className="text-[13px] font-normal text-[var(--fg-4)]">2026.05 기준</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-6 mt-2 pl-[16px]">
            <div className="relative w-[180px] h-[180px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke={currentData.charts.donut.items[1].color} strokeWidth="20" />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" stroke={currentData.charts.donut.items[0].color} strokeWidth="20" 
                  strokeDasharray={\`\${currentData.charts.donut.items[0].val * 2.51} 251\`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold" style={{ pointerEvents: 'none' }}>
                <span className="text-[16px] absolute top-[28px] left-[32px]">{currentData.charts.donut.items[0].val}%</span>
                <span className="text-[14px] absolute bottom-[40px] right-[24px] text-white/90">{currentData.charts.donut.items[1].val}%</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {currentData.charts.donut.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] text-[var(--fg-2)] font-medium">
                    {item.label} <strong className="text-[var(--fg-1)] ml-1">{item.val}%</strong>
                    <span className="text-[var(--fg-4)] font-normal ml-1">({item.unit})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
`;
  
  code = code.substring(0, chartStartIdx) + dynamicCharts + code.substring(tableStartIdx);
}

// Table Title
code = code.replace(/<span className="ttl">광명역 태양광 발전량 데이터<\/span>/g, '<span className="ttl">{currentData.tableTitle}</span>');

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', code, 'utf8');
console.log('Successfully refactored MileDashboard charts!');
