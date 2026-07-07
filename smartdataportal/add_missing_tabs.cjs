const fs = require('fs');

const target = 'c:\\Users\\hrjeong\\Desktop\\광명 스마트데이터포털\\src\\components\\MileDashboard.tsx';
let code = fs.readFileSync(target, 'utf8');

const missingMileData = `
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
`;

code = code.replace(/tableTitle: '광명시 스마트 폴 감지 데이터'\s*\}\s*\};\s*const cityTabData/, "tableTitle: '광명시 스마트 폴 감지 데이터'\n    },\n" + missingMileData + "\n  const cityTabData");

const missingCityData = `
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
`;

code = code.replace(/tableTitle: '광명시 동별 인구 분포 데이터'\s*\}\s*\};\s*const dataMap/, "tableTitle: '광명시 동별 인구 분포 데이터'\n    },\n" + missingCityData + "\n  const dataMap");

const headerRegex = /\{\/\* Dashboard Header \*\/\}\s*<div className="mb-\[40px\] flex flex-col gap-\[8px\]">\s*<h2 className="text-\[28px\] font-bold text-\[var\(--fg-1\)\]">\{title \|\| '마일별 상세 데이터'\}<\/h2>\s*<p className="text-\[16px\] text-\[var\(--fg-3\)\]">\{subtitle \|\| '선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다\.'\}<\/p>\s*<\/div>/;

const newHeader = `{/* Dashboard Header */}
      <div className="mb-[40px] flex justify-between items-end">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[28px] font-bold text-[var(--fg-1)]">{title || '마일별 상세 데이터'}</h2>
          <p className="text-[16px] text-[var(--fg-3)]">{subtitle || '선택한 마일의 주요 지표와 원천 데이터를 확인할 수 있습니다.'}</p>
        </div>
        {/* Filters moved to Title Line */}
        <div className="flex items-center gap-[40px] relative">
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">기간 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[260px]">
              <span className="text-[14px]">2026-10-10 &nbsp;-&nbsp; 2026-11-10</span>
              <Calendar size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-medium text-[var(--fg-2)]">지역 선택</span>
            <button className="gp-select-btn gp-select-btn--h48 w-[140px]">
              <span className="text-[14px]">광명역세권</span>
              <ChevronDown size={18} className="text-[var(--fg-4)]" />
            </button>
          </div>
        </div>
      </div>`;

code = code.replace(headerRegex, newHeader);

const filtersRegex = /\{\/\* Filters \*\/\}\s*<div className="flex items-center gap-\[40px\] relative">\s*<div className="flex items-center gap-\[12px\]">\s*<span className="text-\[14px\] font-medium text-\[var\(--fg-2\)\]">기간 선택<\/span>\s*<button className="gp-select-btn gp-select-btn--h48 w-\[260px\]">\s*<span className="text-\[14px\]">2026-10-10 &nbsp;-&nbsp; 2026-11-10<\/span>\s*<Calendar size=\{18\} className="text-\[var\(--fg-4\)\]" \/>\s*<\/button>\s*<\/div>\s*<div className="flex items-center gap-\[12px\]">\s*<span className="text-\[14px\] font-medium text-\[var\(--fg-2\)\]">지역 선택<\/span>\s*<button className="gp-select-btn gp-select-btn--h48 w-\[140px\]">\s*<span className="text-\[14px\]">광명역세권<\/span>\s*<ChevronDown size=\{18\} className="text-\[var\(--fg-4\)\]" \/>\s*<\/button>\s*<\/div>\s*<\/div>/;

code = code.replace(filtersRegex, '');
code = code.replace(/<div className="flex items-center justify-between mb-\[32px\]">/, '<div className="flex mb-[32px]">');

fs.writeFileSync(target, code, 'utf8');
console.log('Update successful!');
