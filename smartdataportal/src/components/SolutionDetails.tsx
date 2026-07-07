import { useState } from 'react';
import { Solution } from '../types';
import { Play, ChevronRight, Video, BarChart3 } from 'lucide-react';

interface SolutionDetailsProps {
  solutions: Solution[];
  selectedSolution: Solution;
  onSelectSolution: (sol: Solution) => void;
  onNavigateToData: (mileType: string) => void;
}

export default function SolutionDetails({
  solutions,
  selectedSolution,
  onSelectSolution,
  onNavigateToData
}: SolutionDetailsProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 마일 타입에 따른 전용 컬러 토큰 반환
  const getMileColorTokens = (mileType: string) => {
    switch (mileType) {
      case 'energy':
        return {
          primary: '#1587E1',
          bgSoft: '#E6F2FD',
          bgHighlight: '#F0F8FF',
        };
      case 'mobility':
        return {
          primary: '#1AAA5E',
          bgSoft: '#E8F5E9',
          bgHighlight: '#F4FBF7',
        };
      case 'safety':
        return {
          primary: '#ED8B16',
          bgSoft: '#FFF3E0',
          bgHighlight: '#FFFBF5',
        };
      case 'data':
      default:
        return {
          primary: '#6E74D6',
          bgSoft: '#EEEFFF',
          bgHighlight: '#F7F8FC',
        };
    }
  };

  const tokens = getMileColorTokens(selectedSolution.mileType);

  return (
    <div className="flex flex-col gap-[24px]">
      
      {/* 1. 상단 타이틀 & 설명 영역 */}
      <div>
        <div className="flex items-center gap-[12px] font-score">
          <span 
            className="text-[52px] font-black leading-none" 
            style={{ color: tokens.primary, fontWeight: 900 }}
          >
            {selectedSolution.id}
          </span>
          <h2 className="text-[24px] font-bold text-[#16243B] leading-tight mt-[6px]">
            {selectedSolution.name}
          </h2>
        </div>
        
        <p className="mt-[16px] font-pretendard-gov text-[15px] font-normal text-[#4E5968] leading-relaxed text-justify whitespace-pre-line">
          {selectedSolution.description}
        </p>
      </div>

      {/* 2. 세부 스펙 테이블 (테두리가 있고 가로 구분선이 지나는 구조) */}
      <div 
        className="bg-white rounded-[16px] border border-[#E6E8EA] flex flex-col overflow-hidden"
      >
        {/* 적용 위치 */}
        <div className="flex items-start py-[18px] px-[20px] border-b border-[#E6E8EA]">
          <div className="flex items-center gap-[10px] w-[112px] shrink-0 mt-[1px]">
            <img src="/icons/ic_location.png" alt="적용 위치" className="w-[24px] h-[24px] object-contain shrink-0" />
            <span className="text-[15px] font-bold text-[#1E2124] font-pretendard-gov leading-none">적용 위치</span>
          </div>
          <div className="flex-1 text-[14px] font-normal text-[#4E5968] font-pretendard-gov leading-relaxed pl-[20px]">
            {selectedSolution.location}
          </div>
        </div>

        {/* 주요 기능 */}
        <div className="flex items-start py-[18px] px-[20px] border-b border-[#E6E8EA]">
          <div className="flex items-center gap-[10px] w-[112px] shrink-0 mt-[1px]">
            <img src="/icons/ic_function.png" alt="주요 기능" className="w-[24px] h-[24px] object-contain shrink-0" />
            <span className="text-[15px] font-bold text-[#1E2124] font-pretendard-gov leading-none">주요 기능</span>
          </div>
          <div className="flex-1 flex flex-col gap-y-[6px] text-[14px] font-normal text-[#4E5968] font-pretendard-gov leading-relaxed pl-[20px]">
            {selectedSolution.features.map((feature, i) => (
              <div key={i} className="flex items-start">
                <span className="shrink-0 mr-[4px]">·</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 관련 데이터 */}
        <div className="flex items-start py-[18px] px-[20px] border-b border-[#E6E8EA]">
          <div className="flex items-center gap-[10px] w-[112px] shrink-0 mt-[1px]">
            <img src="/icons/ic_data.png" alt="관련 데이터" className="w-[24px] h-[24px] object-contain shrink-0" />
            <span className="text-[15px] font-bold text-[#1E2124] font-pretendard-gov leading-none">관련 데이터</span>
          </div>
          <div className="flex-1 flex flex-col gap-y-[6px] text-[14px] font-normal text-[#4E5968] font-pretendard-gov leading-relaxed pl-[20px]">
            {selectedSolution.data.map((dt, i) => (
              <div key={i} className="flex items-start">
                <span className="shrink-0 mr-[4px]">·</span>
                <span>{dt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 참여 기관 */}
        <div className="flex items-start py-[18px] px-[20px]">
          <div className="flex items-center gap-[10px] w-[112px] shrink-0 mt-[1px]">
            <img src="/icons/ic_people.png" alt="참여기관" className="w-[24px] h-[24px] object-contain shrink-0" />
            <span className="text-[15px] font-bold text-[#1E2124] font-pretendard-gov leading-none">참여기관</span>
          </div>
          <div className="flex-1 text-[14px] font-normal text-[#4E5968] font-pretendard-gov leading-relaxed pl-[20px]">
            {selectedSolution.partners}
          </div>
        </div>
      </div>

      {/* 3. 소개 영상 썸네일 영역 */}
      <div 
        className="relative rounded-[16px] bg-slate-950 overflow-hidden border border-[#E6E8EA] shadow-sm shrink-0"
        style={{ height: '238px' }}
      >
        {!isPlayingVideo ? (
          <div className="relative w-full h-full">
            {/* 임시 비디오 썸네일 배경 이미지 */}
            <img 
              src="/images/hero_bg.png" 
              alt="비디오 썸네일" 
              className="w-full h-full object-cover opacity-60 filter brightness-75 blur-xs"
            />
            {/* 오버레이 그라디언트 및 텍스트 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 flex flex-col justify-between p-[20px]">
              
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-white font-pretendard-gov flex items-center gap-[6px]">
                  {selectedSolution.id === '03' ? 'BSS' : selectedSolution.id === '07' ? 'AIoT' : 'G-SMART'} 솔루션 소개 영상
                </span>
                <span className="text-[12px] font-mono font-bold text-white bg-black/60 px-[8px] py-[2px] rounded">
                  01:28
                </span>
              </div>

              {/* 재생 버튼 */}
              <button 
                onClick={() => setIsPlayingVideo(true)}
                className="absolute inset-0 m-auto w-[56px] h-[56px] rounded-full bg-white text-[#0B50A0] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label="홍보 영상 재생"
              >
                <Play size={22} className="fill-current ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center p-[24px] text-center">
            <div className="w-[40px] h-[40px] rounded-full border-4 border-[#1AAA5E] border-t-transparent animate-spin mb-[16px]" />
            <p className="text-[14px] text-white font-semibold font-pretendard-gov">{selectedSolution.name}</p>
            <p className="text-[12px] text-slate-400 mt-[4px] font-pretendard-gov">스마트도시 관제망 영상 수신 중...</p>
            <button 
              onClick={() => setIsPlayingVideo(false)}
              className="mt-[16px] px-[12px] py-[6px] bg-slate-800 text-white rounded-[6px] text-[12px] font-medium hover:bg-slate-700 transition-colors cursor-pointer font-pretendard-gov"
            >
              재생 종료
            </button>
          </div>
        )}
      </div>

      {/* 4. 하단 액션 버튼 */}
      <div className="grid grid-cols-2 gap-[12px]">
        <button 
          onClick={() => setIsPlayingVideo(true)}
          className="bg-[#0B50A0] text-white text-[15px] font-semibold h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] hover:bg-[#094080] transition-colors cursor-pointer font-pretendard-gov"
        >
          <Video size={16} />
          솔루션 영상보기
        </button>
        <button 
          onClick={() => onNavigateToData(selectedSolution.mileType)}
          className="bg-white border border-[#0B50A0] text-[#0B50A0] text-[15px] font-semibold h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] hover:bg-slate-50 transition-colors cursor-pointer font-pretendard-gov"
        >
          <BarChart3 size={16} />
          관련 데이터 보기
        </button>
      </div>

      {/* 5. 다른 솔루션 보기 리스트 */}
      <div className="border-t border-[#E6E8EA] pt-[24px]">
        <h3 className="font-score font-bold text-[18px] text-[#16243B] mb-[16px]">
          다른 솔루션 보기
        </h3>

        {/* 1~10 리스트 영역 (바깥 테두리는 삭제하고, 내부 항목들이 플랫하게 나열된 형태) */}
        <div className="max-h-[380px] overflow-y-auto bg-white custom-scrollbar flex flex-col shrink-0">
          {solutions.map((sol, idx) => {
            const solTokens = getMileColorTokens(sol.mileType);
            const isCurrent = sol.id === selectedSolution.id;
            const isLast = idx === solutions.length - 1;

            // 다음 항목이 active 또는 hover 중인지 판단하여 현재 항목의 border-bottom 제거
            const nextSol = idx < solutions.length - 1 ? solutions[idx + 1] : null;
            const isNextActive = nextSol ? nextSol.id === selectedSolution.id : false;
            const isNextHovered = nextSol ? nextSol.id === hoveredId : false;
            const hideBorderBottom = isLast || isCurrent || isNextActive || isNextHovered;

            return (
              <button
                key={sol.id}
                onClick={() => onSelectSolution(sol)}
                onMouseEnter={() => setHoveredId(sol.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full text-left transition-all flex items-center justify-between outline-none cursor-pointer group px-[16px]
                  ${isCurrent 
                    ? 'border border-[#B1CEFB] rounded-[8px] bg-[#ECF2FE]' 
                    : `border border-transparent hover:border-[#B1CEFB] hover:rounded-[8px] hover:bg-[#ECF2FE] bg-white ${
                        hideBorderBottom ? 'border-b-transparent' : 'border-b-[#E6E8EA]'
                      }`
                  }
                `}
                style={{
                  height: '42px',
                }}
              >
                <div className="flex items-center gap-[12px]">
                  {/* 번호 (Medium) */}
                  <span 
                    className={`text-[14px] font-medium font-pretendard-gov transition-colors ${
                      isCurrent ? 'text-[#256EF4]' : 'text-[#7A8898] group-hover:text-[#256EF4]'
                    }`}
                  >
                    {sol.id}
                  </span>
                  {/* 솔루션 이름 (Regular) */}
                  <span 
                    className={`text-[14px] font-normal truncate font-pretendard-gov max-w-[220px] transition-colors ${
                      isCurrent ? 'text-[#256EF4]' : 'text-[#1E2124] group-hover:text-[#256EF4]'
                    }`}
                  >
                    {sol.name}
                  </span>
                </div>

                <div className="flex items-center gap-[8px]">
                  {/* 마일 이름 라벨 (배경 없이 텍스트 컬러만 적용 - Medium) */}
                  <span 
                    className="text-[14px] font-medium font-pretendard-gov"
                    style={{ color: solTokens.primary }}
                  >
                    {sol.mileType === 'energy' ? '에너지 마일' : sol.mileType === 'mobility' ? '모빌리티 마일' : sol.mileType === 'safety' ? '세이프티 마일' : '데이터 마일'}
                  </span>
                  <ChevronRight 
                    size={14} 
                    className={`transition-colors ${
                      isCurrent ? 'text-[#256EF4]' : 'text-[#7A8898] group-hover:text-[#256EF4]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
