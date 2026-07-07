import { ArrowRight } from 'lucide-react';

interface Scenario {
  title: string;
  tabTitle: string;
  badge: string;
  badgeTheme: 'energy' | 'mobility' | 'safety' | 'data';
  concept: string;
  steps: string[];
  impact: string;
}

export default function ScenarioSection() {

  const partnerLogos = [
    { name: "SK", src: "/images/logo_sk.png", width: 76, height: 62 },
    { name: "현대자동차", src: "/images/logo_hyundai.png", width: 85, height: 51 },
    { name: "기아", src: "/images/logo_kia.png", width: 86.76, height: 29 },
    { name: "우아한형제들", src: "/images/logo_우아한형제들.png", width: 111, height: 33 },
    { name: "그리너리", src: "/images/logo_greenery.png", width: 150.23, height: 27 },
    { name: "한양대학교", src: "/images/logo_hyu.png", width: 108, height: 37 },
    { name: "경기교통공사", src: "/images/logo_경기교통공사.png", width: 118.4, height: 43 },
    { name: "광명시", src: "/images/logo_광명시.png", width: 102, height: 57 }
  ];

  const scenarios: Scenario[] = [
    {
      title: "친환경 배달문화",
      tabTitle: "친환경 배달문화",
      badge: "Mobility",
      badgeTheme: "mobility",
      concept: "전기이륜차 및 다회용기 물류 순환 동선을 통합 관제하며 배달 시 온실가스를 상시 절감하는 도심 물류 통합망 시나리오입니다.",
      steps: [
        "EV 배달 라이더가 식음료 상권에서 다회용기 식품을 담아 무공해로 소비자에게 운송 배송 완료 건 자동 집계",
        "인접 이륜차 전용 배터리 교환 스테이션(BSS)에서 급속 배터리 팩 슬라이딩 교환으로 정체 없는 스마트 복합 주행",
        "소비자가 배출한 다회용 식기를 무선 RFID 수집함에 반납, 수거 세척 전문 파트너 기업을 통해 위생 가공 세정 처리",
        "전 주기 활동 데이터를 데이터 통합 플랫폼으로 동기화하여 온실가스 감축량(tCO₂eq) 리포트 자동 전환 발행"
      ],
      impact: "일회용 배달용기 쓰레기 최대 연간 120톤 제어 및 배달 운송 이산화탄소 40% 저감 기함"
    },
    {
      title: "비전 가상 에너지 거래",
      tabTitle: "에너지 거래",
      badge: "Energy",
      badgeTheme: "energy",
      concept: "공공 유휴부지 국산 태양광 인프라로 생산한 청정 전력을 원거리 지역 가맹 상가와 직접 상계 결제하는 차세대 이분산 거래 시나리오입니다.",
      steps: [
        "광명시 공공 옥상 및 융통부지 태양광 패널에서 생산된 저탄소 전기에 대한 주간 실시간 인버터 모니터링 분석 지원",
        "스마트 전력 넷미터링(VNM) 가상 망을 가동하여 전력이 가장 필요한 계약 가맹 중소 자영업자에 해당 발전량 분배 매칭",
        "분배받은 발전 청정 에너지 크레딧만큼 한전 월별 요금 고지서상에서 비용 가상 상계 처리 및 보정 정산 제공",
        "지역 상생 신재생에너지 상호작용 지표를 탄소 통합 원장 데이터베이스에 연속 등록 처리"
      ],
      impact: "지자체 중심의 중소상가 자립 RE100 기반 기지 조성 및 가구별 전력 기본료 최대 25% 가치 절감 효과 제공"
    },
    {
      title: "전기 모빌리티 연계 전송",
      tabTitle: "전기차 기반 이동 서비스",
      badge: "Mobility",
      badgeTheme: "mobility",
      concept: "전기 카셰어링 거점에서 주민 전용 차량 예약과 운율 충전 정보를 자율 전송해 탄소 포인트를 수산하는 공유 교통 시나리오입니다.",
      steps: [
        "모바일 포털앱 및 연합 플랫폼으로 사각지대 주민 및 직장인이 거점 EV 차량 지정 및 카셰어링 예약 접수",
        "주행거리 기반 스마트 센서에서 수집되는 무탄소 이동 가치 실측치를 실시간 탄소 플랫폼 메인 서버로 연동 전개",
        "반납 완료 시 충전 슬롯 잔량 분석 후 자율 요금 정산 및 탄소 저감 기여 보상 크레딧 즉시 인쇄",
        "적립된 보상 크레딧을 광명사랑화폐 모바일 잔액으로 자동 전환 처리하여 시민 지역 경제 소비에 이용하도록 순환"
      ],
      impact: "사적 노후 사륜차 소유 의지 제어 및 시내 도심 대기질 질소산화물 저감 18.5% 연속 유도"
    },
    {
      title: "안전 예보 및 탄소 관리",
      tabTitle: "탄소관리 및 데이터 통합",
      badge: "Safety / Data",
      badgeTheme: "safety",
      concept: "천수 수재해 센서와 IoT 그린배리어를 연합해 기동 위험 안전 통보 및 공공 에너지 소모 원장을 분석하는 복합망입니다.",
      steps: [
        "안양천·목감천 상습 위험 저지대 미세 수위 센서에서 취합되는 수치를 3초 주기로 초고속 취합 관제",
        "폭우 등 이상 한계치 돌입 시, 보차도 입구 차단 장치가 기계식 가동 기동하며 시민 무선 단말기로 경보 푸시 즉각 발송",
        "주요 학교 스쿨존 및 대로 스마트 그린배리어와 보행 바이오벽 고압 작동을 연합 시동해 배기가스 분쇄",
        "각 공공 구조물에서 상시 소모되는 전기에 대한 친환경 상쇄 계량을 탄소 원장에 융합 통계화"
      ],
      impact: "돌발 상습 침수 주민 고립율 완벽 차단(0건 유지) 및 도심 밀집 미세먼지(PM2.5) 시간당 최대 30% 포집"
    },
    {
      title: "시민 혁신 이노베이션 리빙랩",
      tabTitle: "시민참여형 G-SMART HUB",
      badge: "Data",
      badgeTheme: "data",
      concept: "시민과 전문가 및 환경 벤처가 스마트데이터포털 공개 Open API를 활용해 기후 문제를 발굴하고 아이디어를 실증하는 시나리오입니다.",
      steps: [
        "이노베이션 플랫폼 및 G-SMART HUB에서 스마트 에코데이터 10대 솔루션 공개 카탈로그 분석 자료 개방",
        "주민 리빙랩 주도로 미세먼지 정화 장벽 설치 필요 지점 및 친환경 배달 다회용기 거점 요구지 GIS 시각화",
        "스타트업 연계를 가동해 시뮬레이션 데이터를 작성하고, 지자체 실무부서의 매칭 타당성 타진 및 실증 예산 보조금 매칭",
        "실제 설치 완료 완료 단계의 탄소 측정 데이터를 포털에 투명 공유해 성과 시민 보고회 상시 개최"
      ],
      impact: "시민 제안형 스마트도시 조례 입안 및 해카톤 가동 연 5건 이상 상생 스마트 벤처 실증 기회 조달"
    }
  ];

  const getThemeClass = (theme: string) => {
    switch (theme) {
      case 'energy': return 'bg-[#E6F2FD] text-[#1587E1] border-[#1587E1]/20';
      case 'mobility': return 'bg-[#E8F5E9] text-[#1AAA5E] border-[#1AAA5E]/20';
      case 'safety': return 'bg-[#FFF3E0] text-[#ED8B16] border-[#ED8B16]/20';
      case 'data':
      default: return 'bg-[#EEEFFF] text-[#6E74D6] border-[#6E74D6]/20';
    }
  };

  return (
    <section id="scenario" className="pt-14 pb-10 bg-white scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-0">
        
        {/* Header Title */}
        <div className="mb-[32px]">
          <h2 className="font-score font-bold text-[24px] text-[#16243B] mb-[4px] leading-tight">
            서비스 시나리오
          </h2>
          <p className="font-score text-[16px] font-normal text-[var(--fg-3)] leading-normal">
            광명시는 민간기업, 연구기관, 공공기관과 함께 탄소중립 스마트도시 서비스를 구축하고 운영합니다.
          </p>
        </div>

        {/* ── 연계 파트너 + 가로 탭 버튼 + 더 둘러보기 영역 (통합 상단 패널) ── */}
        <div className="flex flex-col gap-[20px] mb-[32px] w-full">
          {/* 1행: 연계 파트너 로고 (박스 없이 나열) */}
          <div className="flex items-center justify-between gap-[24px] py-[12px] overflow-x-auto lg:overflow-x-visible">
            {partnerLogos.map((logo, index) => (
              <img 
                key={index} 
                src={logo.src} 
                alt={logo.name} 
                style={{ width: `${logo.width}px`, height: `${logo.height}px` }}
                className="object-contain opacity-95 hover:opacity-100 transition-opacity shrink-0"
              />
            ))}
          </div>

          {/* 2행: 5개 가로 탭 버튼 & 더 둘러보기 버튼 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">
            {/* 5개 알약형 탭 버튼 */}
            <div className="flex flex-wrap items-center gap-[16px]">
              {[
                { title: "친환경 배달문화", bg: "#E8F2FF", border: "#B2D3FF", text: "#0B50A0" },
                { title: "에너지 거래", bg: "#FFF2E6", border: "#FFD9B3", text: "#ED8B16" },
                { title: "전기차 기반 이동 서비스", bg: "#E8F2FF", border: "#B2D3FF", text: "#0B50A0" },
                { title: "탄소관리 및 데이터 통합", bg: "#F3EFFF", border: "#DECFFF", text: "#6E74D6" },
                { title: "시민참여형 G-SMART HUB", bg: "#EAF9EE", border: "#B8EAD0", text: "#1AAA5E" }
              ].map((chip, index) => (
                <div
                  key={index}
                  className="h-[40px] px-[30px] rounded-full border text-[16px] font-semibold flex items-center justify-center font-pretendard-gov select-none whitespace-nowrap"
                  style={{
                    backgroundColor: chip.bg,
                    borderColor: chip.border,
                    color: chip.text,
                  }}
                >
                  {chip.title}
                </div>
              ))}
            </div>

            {/* 더 둘러보기 버튼 */}
            <button 
              onClick={() => {
                const el = document.getElementById('resources');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white border border-[#0B50A0] text-[#0B50A0] hover:bg-[#F5F9FF] text-[15px] font-semibold w-[180px] h-[48px] rounded-[8px] flex items-center justify-center gap-[6px] transition-all cursor-pointer font-pretendard-gov shrink-0"
            >
              <span>더 둘러보기</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
