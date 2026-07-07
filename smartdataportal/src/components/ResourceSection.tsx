import { useState } from 'react';
import { Download, PlayCircle, BarChart3, Globe, ExternalLink, CheckCircle } from 'lucide-react';

interface ResourceSectionProps {
}

export default function ResourceSection({}: ResourceSectionProps) {
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloadMessage(`'${title}' 파일이 다운로드 준비되었습니다.`);
    setTimeout(() => {
      setDownloadMessage(null);
    }, 4500);
  };

  // Mock QR rendering function removed in favor of real image file qrcode.png

  return (
    <section id="resources" className="py-10 bg-white scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-0">
        
        {/* Action Download notification bubble */}
        {downloadMessage && (
          <div className="mb-6 p-4 bg-[#E8F5E9] border border-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
            <CheckCircle className="text-[#1AAA5E] shrink-0" size={18} />
            <div className="flex-1 text-xs sm:text-sm font-semibold text-[#2E7D32]">
              {downloadMessage}
            </div>
          </div>
        )}

        {/* Section Heading Row with top alignment */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-[24px] w-full">
          <div className="text-left flex-1">
            <h2 className="font-score font-bold text-[24px] text-[#16243B] leading-tight mb-[4px]">
              사업 관련 자료와 서비스를 확인하세요
            </h2>
            <p className="font-score text-[16px] font-normal text-[var(--fg-3)]">
              사업 개요와 성과, 데이터를 쉽게 확인하고 필요한 자료를 다운로드하세요.
            </p>
          </div>
          <div className="w-[392px] text-left hidden lg:block ml-[80px] shrink-0">
            <h2 className="font-score font-bold text-[24px] text-[#16243B] leading-tight">
              QR 바로가기
            </h2>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch w-full gap-8 lg:gap-0">
          
          {/* Left Section: 4 Promotional Cards (968px) */}
          <div className="flex flex-row gap-[16px] overflow-x-auto lg:overflow-x-visible shrink-0 pb-2 lg:pb-0">
            
            {/* Card 1: 사업소개서 다운로드 */}
            <div className="w-[230px] h-[152px] bg-white p-[14px] rounded-[12px] border border-[#E2E8F0] flex flex-col justify-between shrink-0">
              <div className="flex gap-[12px] items-start">
                <img 
                  src="/icons/ic_download01.png" 
                  alt="" 
                  className="w-[48px] h-[48px] object-contain shrink-0" 
                />
                <div className="flex flex-col gap-[3px] text-left">
                  <h3 className="text-[16px] font-bold text-[#0B50A0] leading-tight font-pretendard-gov">
                    사업소개서 다운로드
                  </h3>
                  <p className="text-[14px] font-normal text-[var(--fg-3)] leading-normal font-pretendard-gov">
                    사업 개요, 10대 솔루션 추진 계획을 확인하세요.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('광명역세권_사업소개서.pdf')}
                className="w-full h-[32px] border border-[#0B50A0] text-[#0B50A0] hover:bg-[#E7EFF9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center font-pretendard-gov cursor-pointer"
              >
                다운로드
              </button>
            </div>

            {/* Card 2: 홍보영상 보기 */}
            <div className="w-[230px] h-[152px] bg-white p-[14px] rounded-[12px] border border-[#E2E8F0] flex flex-col justify-between shrink-0">
              <div className="flex gap-[12px] items-start">
                <img 
                  src="/icons/ic_video02.png" 
                  alt="" 
                  className="w-[48px] h-[48px] object-contain shrink-0" 
                />
                <div className="flex flex-col gap-[3px] text-left">
                  <h3 className="text-[16px] font-bold text-[#0B50A0] leading-tight font-pretendard-gov">
                    홍보영상 보기
                  </h3>
                  <p className="text-[14px] font-normal text-[var(--fg-3)] leading-normal font-pretendard-gov">
                    사업 소개 영상을 통해 주요 내용을 살펴보세요.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('광명스마트솔루션_종합영상.mp4')}
                className="w-full h-[32px] border border-[#0B50A0] text-[#0B50A0] hover:bg-[#E7EFF9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center font-pretendard-gov cursor-pointer"
              >
                다운로드
              </button>
            </div>

            {/* Card 3: 데이터시각화 보기 */}
            <div className="w-[230px] h-[152px] bg-white p-[14px] rounded-[12px] border border-[#E2E8F0] flex flex-col justify-between shrink-0">
              <div className="flex gap-[12px] items-start">
                <img 
                  src="/icons/ic_graph03.png" 
                  alt="" 
                  className="w-[48px] h-[48px] object-contain shrink-0" 
                />
                <div className="flex flex-col gap-[3px] text-left">
                  <h3 className="text-[16px] font-bold text-[#0B50A0] leading-tight font-pretendard-gov">
                    데이터시각화 보기
                  </h3>
                  <p className="text-[14px] font-normal text-[var(--fg-3)] leading-normal font-pretendard-gov">
                    다양한 통계와 지표를 시각화로 제공합니다.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload('광명스마트솔루션_시각화일러스트.pdf')}
                className="w-full h-[32px] border border-[#0B50A0] text-[#0B50A0] hover:bg-[#E7EFF9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center font-pretendard-gov cursor-pointer"
              >
                바로가기
              </button>
            </div>

            {/* Card 4: 연관 플랫폼 보기 */}
            <div className="w-[230px] h-[152px] bg-white p-[14px] rounded-[12px] border border-[#E2E8F0] flex flex-col justify-between shrink-0">
              <div className="flex gap-[12px] items-start">
                <img 
                  src="/icons/ic_link04.png" 
                  alt="" 
                  className="w-[48px] h-[48px] object-contain shrink-0" 
                />
                <div className="flex flex-col gap-[3px] text-left">
                  <h3 className="text-[16px] font-bold text-[#0B50A0] leading-tight font-pretendard-gov">
                    연관 플랫폼 보기
                  </h3>
                  <p className="text-[14px] font-normal text-[var(--fg-3)] leading-normal font-pretendard-gov">
                    관련 플랫폼 서비스를 함께 연결합니다.
                  </p>
                </div>
              </div>
              <a 
                href="https://www.gm.go.kr" 
                target="_blank" 
                rel="noreferrer"
                className="w-full h-[32px] border border-[#0B50A0] text-[#0B50A0] hover:bg-[#E7EFF9] text-[13px] font-bold rounded-[6px] transition-colors flex items-center justify-center font-pretendard-gov cursor-pointer"
              >
                바로가기
              </a>
            </div>

          </div>

          {/* Right Section: QR Codes Box (392px) */}
          <div className="w-full lg:w-[392px] flex flex-col shrink-0">
            <h2 className="font-score font-bold text-[24px] text-[#16243B] leading-tight mb-6 block lg:hidden text-left mt-8">
              QR 바로가기
            </h2>
            
            <div className="bg-white border border-[#E2E8F0] rounded-[12px] py-[16px] px-[20px] h-[152px] flex items-center justify-between">
              {/* QR Item 1 */}
              <div className="flex flex-col items-center gap-[6px] flex-1">
                <img 
                  src="/images/qrcode.png" 
                  alt="사업소개서 QR" 
                  className="w-[88px] h-[88px] object-contain shrink-0" 
                />
                <span className="text-[16px] font-medium text-[#36445A] font-pretendard-gov text-center whitespace-nowrap leading-[18px]">
                  사업소개서
                </span>
              </div>

              {/* QR Item 2 */}
              <div className="flex flex-col items-center gap-[6px] flex-1">
                <img 
                  src="/images/qrcode.png" 
                  alt="홍보영상 QR" 
                  className="w-[88px] h-[88px] object-contain shrink-0" 
                />
                <span className="text-[16px] font-medium text-[#36445A] font-pretendard-gov text-center whitespace-nowrap leading-[18px]">
                  홍보영상
                </span>
              </div>

              {/* QR Item 3 */}
              <div className="flex flex-col items-center gap-[6px] flex-1">
                <img 
                  src="/images/qrcode.png" 
                  alt="데이터 시각화 QR" 
                  className="w-[88px] h-[88px] object-contain shrink-0" 
                />
                <span className="text-[16px] font-medium text-[#36445A] font-pretendard-gov text-center whitespace-nowrap leading-[18px]">
                  데이터 시각화
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
