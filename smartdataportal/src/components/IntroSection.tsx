import { ArrowRight } from 'lucide-react';

export default function IntroSection() {
  const scrollToMap = () => {
    const el = document.getElementById('sol-map');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const timelineSteps = [
    { date: "2024.04", title: "강소형 스마트도시", desc: "조성사업 선정" },
    { date: "2024.06", title: "광명역세권 10대", desc: "솔루션 선정" },
    { date: "2024.12", title: "데이터 플랫폼 구축", desc: "및 시범 운영" },
    { date: "2025. 현재", title: "서비스 고도화 및", desc: "전면 운영" },
  ];

  const solutionCards = [
    {
      bg: "url('/images/bg_bss.png')",
      title: '친환경 배달문화 BSS',
      desc: (
        <>
          전기이륜차 충전과 다회용기<br />
          순환으로 배달 탄소를 줄입니다.
        </>
      ),
      titleColor: '#256EF4',
    },
    {
      bg: "url('/images/bg_AIoT.png')",
      title: 'AIoT 침수·홍수 통합관제',
      desc: (
        <>
          수위 모니터링과 예측 분석으로<br />
          침수·홍수에 선제 대응합니다.
        </>
      ),
      titleColor: '#EC7813',
    },
    {
      bg: "url('/images/bg_smarthub.png')",
      title: 'G-SMART HUB',
      desc: (
        <>
          시민참여로 데이터를 통한 도시문제<br />
          해결을 확장합니다.
        </>
      ),
      titleColor: '#5917B8',
    },
  ];

  return (
    <section
      id="intro"
      className="relative h-[920px] w-full bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/images/hero_bg.png')" }}
    >
      <div className="max-w-[1440px] mx-auto px-0 h-full pt-[100px] pb-8 flex flex-row gap-8 items-start">

        {/* ── 좌측 컬럼 ── */}
        <div className="flex-1 flex flex-col">

          {/* 상단: 타이틀 + 텍스트 + 아이콘 카드 + 버튼 */}
          <div>
            <h1 className="font-score text-[44px] font-bold text-[var(--fg-1)] tracking-tight leading-tight mb-[16px]">
              광명 스마트데이터포털
            </h1>
            <p className="font-score text-[16px] font-normal text-[var(--fg-2)]  leading-relaxed">
              스마트 도시와 탄소중립 데이터를 연결해 도시문제 해결, 정책 의사결정, 시민 체감<br />
              서비스를 지원합니다. 신재생·모빌리티·안전·데이터를 유기적으로 연계하여<br />
              탄소중립 실현과 시민 중심의 스마트도시 미래를 만들어갑니다.
            </p>

            {/* 카드 4개 + 버튼 영역 (608px 내에서 중앙 정렬) */}
            <div className="flex flex-col items-center w-[608px] mt-[22px]">
              {/* 아이콘 카드 4개 */}
              <div className="flex items-center gap-[16px] w-full">
                {[
                  { src: '/icons/ic_dataflow.png',  label: '데이터 전송' },
                  { src: '/icons/ic_analytics.png', label: '시각화' },
                  { src: '/icons/ic_analysis.png',  label: 'AI 비지니스 분석' },
                  { src: '/icons/ic_carbon.png',    label: '탄소산정' },
                ].map(({ src, label }) => (
                  <div
                    key={label}
                    className="w-[140px] h-[130px] bg-white border border-[var(--border-1)] rounded-[var(--radius-md)] flex flex-col items-center justify-center shrink-0 hover:border-[var(--gp-primary)] hover:shadow-md transition-all cursor-pointer"
                  >
                    <img src={src} alt={label} className="w-[70px] h-[70px] object-contain" />
                    <span className="mt-[12px] font-pretendard-gov text-[16px] font-semibold text-[var(--fg-2)] text-center leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* 버튼 */}
              <div className="mt-8">
                <button
                  onClick={scrollToMap}
                  className="gp-btn gp-btn--primary px-6 hover:shadow-lg hover:shadow-[#0B50A0]/15 transition-all text-sm h-12 w-[200px]"
                >
                  솔루션 지도보기 <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* 하단: 사업 연혁 타임라인 - 버튼 아래 110px 간격 */}
          <div className="mt-[110px] w-full">
            <h2 className="font-score font-bold text-[24px] text-[#16243B] mb-[32px]">
              사업 연혁
            </h2>

            <div className="relative w-[800px]">
              {/* 가로 선 */}
              <div 
                className="absolute left-0 right-0 h-[2px] bg-[#C4D9FD] z-0" 
                style={{ top: '12px' }}
              />

              {/* 4개 단계 */}
              <div className="grid grid-cols-4 relative z-10">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    {/* 타임라인 노드 (점) */}
                    <div className="w-[24px] h-[24px] rounded-full bg-[#E5EEFE] flex items-center justify-center shrink-0">
                      <div className="w-[12px] h-[12px] rounded-full bg-[#0B50A0] border-2 border-white ring-2 ring-[#0B50A0]" />
                    </div>

                    {/* 날짜 */}
                    <span className="mt-[16px] font-score font-bold text-[18px] text-[#0B50A0] leading-none">
                      {step.date}
                    </span>

                    {/* 설명 */}
                    <p className="mt-[10px] font-pretendard-gov text-[14px] font-medium text-[#4E5968] leading-normal">
                      {step.title}<br />
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 우측 카드 패널 ── */}
        <div
          className="shrink-0 flex flex-col"
          style={{
            width: '472px',
            height: '696px',
            borderRadius: '16px',
            border: '1px solid #E6E8EA',
            backgroundColor: '#FFFFFF',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* 패널 타이틀 */}
          <h2 className="font-score font-bold text-[24px] text-[var(--fg-1)] leading-tight shrink-0">
            탄소중립 스마트도시 광명
          </h2>

          {/* 3개 솔루션 카드 */}
          <div className="flex flex-col gap-[12px] mt-[24px]">
            {solutionCards.map(({ bg, title, desc, titleColor }) => (
              <div
                key={title}
                className="shrink-0 relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                style={{
                  width: '424px',
                  height: '180px',
                  borderRadius: '16px',
                  border: '1px solid #ECF2FE',
                  background: bg,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* 텍스트: top 24px, left 24px */}
                <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                  <h3
                    className="font-score font-bold text-[24px] leading-tight mb-[8px]"
                    style={{ color: titleColor }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-pretendard-gov text-[16px] font-semibold leading-snug"
                    style={{ color: '#1E2124' }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
