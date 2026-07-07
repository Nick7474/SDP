import { useState } from 'react';
import { Solution } from '../types';
import { Sun, Zap, Cctv, Waves, Leaf, Car, Bus, Database, Building2 } from 'lucide-react';

/** 오토바이(스쿠터) 아이콘 — lucide에 없어 동일 스트로크로 커스텀 */
const Scooter = ({ size = 25, color = '#fff' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="17.5" r="3" />
    <circle cx="18.5" cy="17.5" r="3" />
    <path d="M8 17.5h6.3l3.4-8.2h-3" />
    <path d="M14 5.6h3l2.6 5.4" />
    <path d="M2.4 10.8h3.8l1.9 3.9" />
  </svg>
);

/** 솔루션별 고유 아이콘 (모두 동일 스타일의 라인 아이콘으로 일관성 유지) */
const SOLUTION_ICONS: Record<string, any> = {
  '01': Sun,        // 신재생 에너지 자원 발전소
  '02': Zap,        // 신재생 에너지 거래 서비스 VNM
  '03': Scooter,    // 친환경 배달문화 밸류체인 BSS (오토바이)
  '04': Car,        // 전기차 기반 커뮤니티 카셰어링
  '05': Bus,        // 전기버스 기반 친환경 DRT
  '06': Cctv,       // IoT 그린배리어
  '07': Waves,      // AIoT 기반 침수-홍수 통합관제
  '08': Leaf,       // 탄소관리 플랫폼
  '09': Database,   // 데이터 통합 플랫폼
  '10': Building2,  // G-SMART HUB
};

/** 물방울 핀(Figma 2100:11067): 마일색 balloon + 흰 테두리 + 뾰족한 꼬리 + 흰색 솔루션 아이콘 */
function SolutionPin({ color, id }: { color: string; id: string }) {
  const Icon = SOLUTION_ICONS[id] || Car;
  return (
    <div className="relative" style={{ width: 45, height: 54 }}>
      <svg width="45" height="54" viewBox="0 0 50 60" style={{ display: 'block', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.25))' }}>
        {/* 원형 헤드(호) + 접선 삼각 꼬리 = Figma 물방울 핀 */}
        <path
          d="M12 36 A19 19 0 1 1 38 36 L25 49 Z"
          fill={color}
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      {/* 헤드(원형부) 중앙에 흰색 아이콘 */}
      <div className="absolute left-0 top-0 flex items-center justify-center" style={{ width: 45, height: 40 }}>
        <Icon size={22} color="#fff" strokeWidth={1.6} />
      </div>
    </div>
  );
}

const extraPins: Record<string, { x: number; y: number }[]> = {
  '01': [
    { x: 220, y: 160 },
    { x: 180, y: 320 },
    { x: 250, y: 450 },
    { x: 200, y: 720 }
  ],
  '02': [
    { x: 240, y: 190 },
    { x: 290, y: 310 },
    { x: 210, y: 460 },
    { x: 190, y: 680 }
  ],
  '03': [
    { x: 325, y: 175 },
    { x: 310, y: 390 },
    { x: 420, y: 560 },
    { x: 240, y: 660 }
  ],
  '04': [
    { x: 350, y: 220 },
    { x: 280, y: 340 },
    { x: 390, y: 510 },
    { x: 260, y: 680 }
  ],
  '05': [
    { x: 300, y: 240 },
    { x: 340, y: 420 },
    { x: 440, y: 590 },
    { x: 220, y: 700 }
  ],
  '06': [
    { x: 340, y: 120 },
    { x: 220, y: 440 },
    { x: 370, y: 480 },
    { x: 280, y: 750 }
  ],
  '07': [
    { x: 210, y: 420 },
    { x: 260, y: 490 },
    { x: 380, y: 530 },
    { x: 250, y: 720 }
  ],
  '08': [
    { x: 260, y: 250 },
    { x: 230, y: 380 },
    { x: 190, y: 520 },
    { x: 280, y: 690 }
  ],
  '09': [
    { x: 360, y: 220 },
    { x: 410, y: 340 },
    { x: 430, y: 690 },
    { x: 310, y: 800 }
  ],
  '10': [
    { x: 390, y: 260 },
    { x: 350, y: 410 },
    { x: 410, y: 720 },
    { x: 330, y: 780 }
  ]
};


interface SolutionMapProps {
  solutions: Solution[];
  activeId: string;
  onSelectSolution: (sol: Solution) => void;
}

export default function SolutionMap({ solutions, activeId, onSelectSolution }: SolutionMapProps) {
  
  // 카드의 가상 너비를 동적 측정하여 SVG 라인이 정확히 달라붙도록 상태 관리
  const [cardWidths, setCardWidths] = useState<Record<string, number>>({});

  // 10대 솔루션 카드 영역 absolute 좌표 세팅 (930px 전체 영역 기준 정밀 픽셀 단위 매핑)
  // 각 이미지 고유 비율에 따라 imgW(가로), imgH(세로)를 개별 최적화 적용
  const mapOverlayAreas = [
    // 왼쪽 그룹 (left: 930px 컨테이너 기준 정밀 배치)
    {
      id: '01',
      top: 46,
      left: 21,
      mileType: 'energy',
      num: '01',
      img: '/images/img_powerstation.png',
      imgW: 70,
      imgH: 47,
      name: '신재생 에너지\n자원 발전소',
      dotX: 226,
      dotY: 212,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${dotX} ${jointY} L ${jointX} ${jointY}`
    },
    {
      id: '02',
      top: 200,
      left: 4,
      mileType: 'energy',
      num: '02',
      img: '/images/img_energy.png',
      imgW: 47,
      imgH: 56,
      name: '신재생 에너지\n거래 서비스 VNM',
      dotX: 215,
      dotY: 300,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    },
    {
      id: '06',
      top: 412,
      left: 16,
      mileType: 'safety',
      num: '06',
      img: '/images/img_cctv.png',
      imgW: 47,
      imgH: 56,
      name: 'IoT 그린배리어',
      dotX: 218,
      dotY: 426,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    },
    {
      id: '07',
      top: 593,
      left: 1,
      mileType: 'safety',
      num: '07',
      img: '/images/img_controller.png',
      imgW: 50,
      imgH: 54,
      name: 'AIoT 기반\n침수-홍수 통합관제',
      dotX: 246,
      dotY: 590,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${dotX} ${jointY} L ${jointX} ${jointY}`
    },
    {
      id: '08',
      top: 790,
      left: 46,
      mileType: 'energy',
      num: '08',
      img: '/images/img_building02.png',
      imgW: 52,
      imgH: 57,
      name: '탄소관리 플랫폼',
      dotX: 248,
      dotY: 742,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    },

    // 오른쪽 그룹 (right: 930px 컨테이너 우측 기준 정밀 배치)
    {
      id: '04', // 카셰어링 (num 03)
      top: 35,
      right: 44,
      mileType: 'mobility',
      num: '03',
      img: '/images/img_charging station.png',
      imgW: 70,
      imgH: 46,
      name: '전기차 기반\n커뮤니티 카셰어링',
      dotX: 350,
      dotY: 116,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${dotX} ${jointY} L ${jointX} ${jointY}`
    },
    {
      id: '03', // BSS (num 04)
      top: 178,
      right: 52,
      mileType: 'mobility',
      num: '04',
      img: '/images/img_motorcycle.png',
      imgW: 50,
      imgH: 55,
      name: '친환경 배달문화\n밸류체인 BSS',
      dotX: 330,
      dotY: 260,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${dotX} ${jointY} L ${jointX} ${jointY}`
    },
    {
      id: '05', // DRT (num 05)
      top: 358,
      right: 2,
      mileType: 'mobility',
      num: '05',
      img: '/images/img_bus.png',
      imgW: 70,
      imgH: 46,
      name: '전기버스 기반\n친환경 DRT',
      dotX: 388,
      dotY: 416,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    },
    {
      id: '09', // 데이터 통합 플랫폼 (num 09)
      top: 588,
      right: 1,
      mileType: 'data',
      num: '09',
      img: '/images/img_building01.png',
      imgW: 53,
      imgH: 60,
      name: '데이터 통합 플랫폼',
      dotX: 395,
      dotY: 633,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    },
    {
      id: '10', // G-SMART HUB (num 10)
      top: 790,
      right: 28,
      mileType: 'data',
      num: '10',
      img: '/images/img_building03.png',
      imgW: 44,
      imgH: 57,
      name: 'G-SMART HUB',
      dotX: 400,
      dotY: 740,
      getPath: (dotX: number, dotY: number, jointX: number, jointY: number) =>
        `M ${dotX} ${dotY} L ${jointX} ${jointY}`
    }
  ];

  const activeArea = mapOverlayAreas.find(area => area.id === activeId);
  const activeMileType = activeArea ? activeArea.mileType : null;

  const getMileColor = (mileType: string) => {
    switch (mileType) {
      case 'energy': return '#1587E1';
      case 'mobility': return '#1AAA5E';
      case 'safety': return '#ED8B16';
      case 'data': return '#6E74D6';
      default: return '#1AAA5E';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: '930px' }}>
      
      {/* 930px absolute 좌표 기준선 컨테이너 (지도 마진 74px을 내포하여 높이 971px로 확장) */}
      <div 
        className="relative overflow-visible shrink-0 select-none"
        style={{
          width: '930px',
          height: '971px',
        }}
      >
        {/* 중앙 정렬 지도 이미지 (가로 614px, 세로 897px, top: 74px, left: 158px) */}
        <img 
          src="/images/solution map.png" 
          alt="솔루션 지도" 
          className="absolute object-cover"
          style={{
            width: '614px',
            height: '897px',
            top: '74px',
            left: '158px',
          }}
        />

        {/* SVG 연결선 및 지도 위 도트 레이어 (전체 930px * 971px 영역 커버) */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          width="930"
          height="971"
          viewBox="0 0 930 971"
          style={{ zIndex: 15 }}
        >
          {mapOverlayAreas.map((area) => {
            const isActive = area.id === activeId;
            const mileColor = getMileColor(area.mileType);
            
            const jointY = area.top + 43; // 카드 높이 86px의 세로 정중앙
            const measuredWidth = cardWidths[area.id] || 230;
            
            // left가 존재하면 왼쪽 그룹, right가 존재하면 오른쪽 그룹
            const jointX = (area as any).left !== undefined 
              ? (area as any).left + measuredWidth 
              : 930 - (area as any).right!;

            // 930px 컨테이너 기준 지도 도트 좌표 변환 (지도 오프셋 X: 158, Y: 74)
            const dotX_930 = area.dotX + 158;
            const dotY_930 = area.dotY + 74;
            
            const pathD = area.getPath(dotX_930, dotY_930, jointX, jointY);
            
            return (
              <g key={`lines-${area.id}`}>
                {/* 연결 라인 (활성화 시 굵어지고 빛나는 효과 적용) */}
                <path 
                  d={pathD}
                  fill="none"
                  stroke={mileColor}
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? `drop-shadow(0px 0px 4px ${mileColor})` : 'none',
                    opacity: isActive ? 1.0 : 0.85
                  }}
                />
                
                <circle 
                  cx={dotX_930}
                  cy={dotY_930}
                  r="8"
                  fill="white"
                  stroke={mileColor}
                  strokeWidth="1"
                  className="transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))'
                  }}
                />
                <circle 
                  cx={dotX_930}
                  cy={dotY_930}
                  r="5"
                  fill={mileColor}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* 10대 솔루션 말풍선 카드 오버레이 */}
        {mapOverlayAreas.map((area) => {
          const isActive = area.id === activeId;
          const mileColor = getMileColor(area.mileType);
          const targetSol = solutions.find(s => s.id === area.id);

          return (
            <button
              key={area.id}
              ref={(el) => {
                if (el && cardWidths[area.id] !== el.offsetWidth) {
                  setCardWidths(prev => ({ ...prev, [area.id]: el.offsetWidth }));
                }
              }}
              onClick={() => targetSol && onSelectSolution(targetSol)}
              className="absolute cursor-pointer transition-all focus:outline-none text-left bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98] duration-200"
              style={{
                top: `${area.top}px`,
                ...((area as any).left !== undefined ? { left: `${(area as any).left}px` } : { right: `${(area as any).right}px` }),
                width: 'max-content', // 고정 width 대신 콘텐츠 크기에 가변 정렬하여 여백 제거
                height: '86px',
                borderRadius: '12px',
                // 활성화 시에만 2px 굵기의 마일 컬러 보더 및 글로우 효과 적용
                border: isActive ? `2px solid ${mileColor}` : '1.5px solid #E6E8EA',
                boxShadow: isActive ? `0 0 15px ${mileColor}77, 0 4px 12px rgba(0,0,0,0.06)` : '0 4px 12px rgba(0,0,0,0.06)',
                zIndex: isActive ? 30 : 20,
                padding: '10px 16px', // 좌우 패딩을 16px로 통일
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              aria-label={`${area.num}번 ${area.name.replace('\n', ' ')} section 선택`}
            >
              {/* Card Illustration Icon (각 이미지 고유 imgW, imgH 개별 최적화 적용 및 object-contain으로 찌그러짐 차단) */}
              <img 
                src={area.img} 
                alt="" 
                className="object-contain shrink-0"
                style={{
                  width: `${area.imgW}px`,
                  height: `${area.imgH}px`,
                }}
              />

              {/* Card Title Text (Pretendard-gov 18px semibold, whitespace-nowrap 적용하여 잘림 방지) */}
              <div className="flex flex-col justify-center min-w-0 pr-1">
                {area.name.split('\n').map((line, i) => (
                  <span 
                    key={i} 
                    className="font-pretendard-gov text-[18px] font-semibold leading-tight whitespace-nowrap block"
                    style={{ 
                       color: isActive ? mileColor : '#1E2124',
                    }}
                  >
                    {line || '\u00A0'}
                  </span>
                ))}
              </div>
            </button>
          );
        })}

        {/* 활성화된 솔루션 ID에 따른 지도 위 추가 핀 렌더링 (색=마일, 아이콘=솔루션, 애니메이션 적용) */}
        {activeId && activeMileType && extraPins[activeId]?.map((pin, index) => {
          const leftPos = 158 + pin.x - 22.5;
          const topPos = 74 + pin.y - 54;

          return (
            <div
              key={`${activeId}-extra-pin-${index}`}
              className="absolute select-none pointer-events-none animate-pin-pop"
              style={{
                left: `${leftPos}px`,
                top: `${topPos}px`,
                width: '45px',
                height: '54px',
                zIndex: 25,
              }}
            >
              <SolutionPin color={getMileColor(activeMileType)} id={activeId} />
            </div>
          );
        })}

        {/* 맵핀 최상위 레이어 오버레이 (부모 z-index 겹침 버그를 완전히 극복하여 카드 보더를 항상 덮도록 분리 렌더링) */}
        {mapOverlayAreas.map((area) => {
          // 마일별 업로드된 핀 이미지 매핑
          const getPinImage = (mileType: string) => {
            switch (mileType) {
              case 'energy': return '/icons/mappin_en.png';
              case 'mobility': return '/icons/mappin_mo.png';
              case 'safety': return '/icons/mappin_sf.png';
              case 'data': return '/icons/mappin_dm.png';
              default: return '/icons/mappin_mo.png';
            }
          };

          // 카드 박스의 가장 좌측 픽셀 위치를 동적으로 산출
          const measuredWidth = cardWidths[area.id] || 230;
          const pinLeft = (area as any).left !== undefined 
            ? (area as any).left 
            : 930 - (area as any).right! - measuredWidth;

          return (
            <div
              key={`pin-${area.id}`}
              className="absolute select-none pointer-events-none"
              style={{
                top: `${area.top - 34}px`, // 핀 높이 54px 중 20px이 카드 박스 상단과 겹치도록 (-34px)
                left: `${pinLeft}px`, // 박스 가장 좌측에 정밀 피트
                width: '45px',
                height: '54px',
                zIndex: 40, // 카드보다 높은 z-index로 완벽한 얹힘 효과 실현
              }}
            >
              {/* 전달받은 정밀 PNG 핀 배경 이미지 렌더링 */}
              <img 
                src={getPinImage(area.mileType)} 
                alt="" 
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}
              />
              
              {/* 맵핀 내부 숫자 (Pretendard-gov 18px semibold, 동적으로 핀 위에 오버레이) */}
              <div 
                className="absolute text-white font-pretendard-gov text-[18px] font-semibold flex items-center justify-center"
                style={{
                  top: '0px', // 원형 머리 영역의 정중앙 배치
                  left: '0px',
                  width: '45px',
                  height: '45px', // 45px 원형 헤드 영역 크기 매핑
                }}
              >
                {area.num}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 (Legend, 가로 540px로 중앙 정렬) */}
      <div 
        className="mt-[20px] bg-white border border-[#E6E8EA] flex justify-center items-center gap-[32px] shrink-0"
        style={{
          width: '540px',
          height: '52px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#4E5968] font-pretendard-gov">
          <span className="w-[10px] h-[10px] rounded-full bg-[#1587E1] inline-block shrink-0" />
          <span>에너지 마일</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#4E5968] font-pretendard-gov">
          <span className="w-[10px] h-[10px] rounded-full bg-[#1AAA5E] inline-block shrink-0" />
          <span>모빌리티 마일</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#4E5968] font-pretendard-gov">
          <span className="w-[10px] h-[10px] rounded-full bg-[#ED8B16] inline-block shrink-0" />
          <span>세이프티 마일</span>
        </div>
        <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#4E5968] font-pretendard-gov">
          <span className="w-[10px] h-[10px] rounded-full bg-[#6E74D6] inline-block shrink-0" />
          <span>데이터 마일</span>
        </div>
      </div>

    </div>
  );
}
