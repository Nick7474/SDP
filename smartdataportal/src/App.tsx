import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import IntroSection from './components/IntroSection';
import SolutionMap from './components/SolutionMap';
import SolutionDetails from './components/SolutionDetails';
import ScenarioSection from './components/ScenarioSection';
import ResourceSection from './components/ResourceSection';
import ResourceArchive from './components/ResourceArchive';
import MileDataMap from './components/MileDataMap';
import CityDataMap from './components/CityDataMap';
import MileDashboard from './components/MileDashboard';
import DataList from './components/DataList';
import DataDetail from './components/DataDetail';
import PersonalCarbon from './components/PersonalCarbon';
import Notice from './components/Notice';
import NoticeDetail from './components/NoticeDetail';
import Admin from './components/Admin';
import SplashModal from './components/SplashModal';
import Login from './components/Login';
import Footer from './components/Footer';
import RelatedPlatforms from './components/RelatedPlatforms';
import { solutionsData } from './data';
import { Sparkles, MessageCircle, HelpCircle, FileDown, CheckCircle, ArrowRight } from 'lucide-react';

type PageId = 'home' | 'intro' | 'archive' | 'map' | 'cityMap' | 'dataList' | 'dataDetail' | 'personalCarbon' | 'relatedPlatforms' | 'notice' | 'noticeDetail' | 'admin' | 'login';

// URL(?page=login|admin) 진입 부팅. admin은 세션 없으면 login으로 강등(직접 URL 접근 차단).
function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home';
  const page = new URLSearchParams(window.location.search).get('page');
  if (page === 'admin') return sessionStorage.getItem('sdp-admin-auth') ? 'admin' : 'login';
  if (page === 'login') return 'login';
  return 'home';
}

export default function App() {
  const [activeMileTab, setActiveMileTab] = useState<'energy' | 'mobility' | 'safety' | 'data'>('energy');
  const [activeCityTab, setActiveCityTab] = useState<string>('population');
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());
  // 포털 관리자 로그인 상태 여부 (스플래시 팝업은 일반 시민에게만 노출). 네비게이션마다 재평가됨.
  const isAdminAuthed = typeof window !== 'undefined' && !!sessionStorage.getItem('sdp-admin-auth');
  const [activeSolutionId, setActiveSolutionId] = useState<string>("01"); // default active: "01" (신재생 에너지 자원 발전소)
  const [mileFilter, setMileFilter] = useState<string>("all");
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // 지도 온보딩 가이드: 스플래시 종료 + 홈 iframe 로드 후 1회 시작 신호 전송
  const homeIframeRef = useRef<HTMLIFrameElement>(null);
  const [homeReady, setHomeReady] = useState(false);
  const [splashResolved, setSplashResolved] = useState(false);
  const guideSentRef = useRef(false);

  useEffect(() => {
    if (currentPage === 'home' && homeReady && splashResolved && !guideSentRef.current) {
      guideSentRef.current = true;
      homeIframeRef.current?.contentWindow?.postMessage(
        { type: 'gm-start-map-guide' },
        window.location.origin
      );
    }
  }, [currentPage, homeReady, splashResolved]);

  // 관리자 접근 가드: 세션 없이 admin 진입 시 로그인으로 전환
  useEffect(() => {
    if (currentPage === 'admin' && !sessionStorage.getItem('sdp-admin-auth')) {
      setCurrentPage('login');
    }
  }, [currentPage]);

  const selectedSolution = solutionsData.find(s => s.id === activeSolutionId) || solutionsData[0];

  // 알림(토스트) 전체 비활성화: 호출돼도 아무것도 표시하지 않음
  const triggerToast = (_msg: string) => {
    // no-op
  };

  // 메인(home) iframe 내부 네비 클릭 → 부모 라우팅 수신
  useEffect(() => {
    const allowed = ['home', 'intro', 'map', 'cityMap', 'dataList', 'dataDetail', 'personalCarbon', 'relatedPlatforms', 'notice', 'noticeDetail', 'admin', 'login', 'archive'];
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data: any = e.data;
      if (data && data.type === 'gm-navigate' && allowed.includes(data.page)) {
        if (data.page === 'map' && ['energy', 'mobility', 'safety', 'data'].includes(data.mile)) {
          setActiveMileTab(data.mile);
        }
        setCurrentPage(data.page);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleSelectSolution = (sol: any) => {
    setActiveSolutionId(sol.id);
  };

  const handleNavigateToData = (mileType: string) => {
    setMileFilter(mileType);
    const el = document.getElementById('resources');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    triggerToast(`'${mileType.toUpperCase()} MILE' 관련 자료와 서비스 내역이 활성화되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--fg-2)] flex flex-col font-sans selection:bg-[var(--gp-primary-soft)] selection:text-[var(--gp-primary)] antialiased">
      {/* 첫 진입 스플래시 모달 (ECOVIEW 안내) — 일반 시민만 노출. 관리자(로그인 상태·login·admin 화면)에서는 미노출 */}
      {!isAdminAuthed && currentPage !== 'login' && currentPage !== 'admin' && (
        <SplashModal onNavigate={setCurrentPage} onResolved={() => setSplashResolved(true)} />
      )}

      {/* Toast alert bubble */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="text-[var(--status-success)] shrink-0 mt-0.5" size={16} />
          <div className="flex-1">
            <span className="text-[10.5px] font-bold text-slate-400 block uppercase tracking-wider">알림 수신</span>
            <p className="text-xs font-semibold leading-normal mt-0.5">{activeToast}</p>
          </div>
        </div>
      )}

      {currentPage === 'admin' ? (
        <Admin onShowToast={triggerToast} onNavigate={setCurrentPage} />
      ) : currentPage === 'home' ? (
        <>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <iframe
            ref={homeIframeRef}
            onLoad={() => setHomeReady(true)}
            src="/home/index.html?v=170"
            title="광명 스마트데이터포털"
            className="w-full border-0 block"
            style={{ height: 'calc(100vh - 80px)' }}
          />
        </>
      ) : (
      <>
      {/* GNB Header */}
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Breadcrumb Bar */}
      <div className="border-b border-[var(--border-1)] bg-white w-full">
        <div className="max-w-[1440px] mx-auto px-0">
          <div className="flex items-center gap-[8px] h-[44px] text-[16px] font-medium font-pretendard-gov text-[var(--fg-3)]">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('home');
              }}
              className="flex items-center shrink-0"
            >
              <img src="/icons/breadcrumb_ic_home.png" alt="홈" width={24} height={24} className="w-6 h-6 object-contain" />
            </a>
            <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
            {currentPage === 'dataList' ? (
              <span className="leading-none text-[var(--fg-3)]">데이터 목록</span>
            ) : currentPage === 'dataDetail' ? (
              <>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('dataList');
                  }}
                  className="hover:text-[var(--gp-primary)] transition-colors cursor-pointer leading-none text-[var(--fg-3)]"
                >
                  데이터 목록
                </a>
                <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                <span className="leading-none text-[var(--fg-3)]">광명역세권 건물 에너지 사용량 데이터</span>
              </>
            ) : currentPage === 'personalCarbon' ? (
              <span className="leading-none text-[var(--fg-3)]">시민탄소저감활동</span>
            ) : currentPage === 'relatedPlatforms' ? (
              <span className="leading-none text-[var(--fg-3)]">연관플랫폼</span>
            ) : currentPage === 'notice' ? (
              <span className="leading-none text-[var(--fg-3)]">공지사항</span>
            ) : currentPage === 'login' ? (
              <span className="leading-none text-[var(--fg-3)]">로그인</span>
            ) : currentPage === 'noticeDetail' ? (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('notice');
                  }}
                  className="hover:text-[var(--gp-primary)] transition-colors cursor-pointer leading-none text-[var(--fg-3)]"
                >
                  공지사항
                </a>
                <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                <span className="leading-none text-[var(--fg-3)]">상세</span>
              </>
            ) : currentPage === 'map' || currentPage === 'cityMap' ? (
                <>
                  <span className="leading-none text-[var(--fg-3)]">데이터 지도</span>
                  <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                  <span className="leading-none text-[var(--fg-3)]">
                    {currentPage === 'map' ? '마일별 데이터' : '광명시 데이터'}
                  </span>
                </>
              ) : (
              <>
                <a 
                  href="#intro" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('intro');
                  }}
                  className="hover:text-[var(--gp-primary)] transition-colors cursor-pointer leading-none"
                >
                  강소형스마트도시 광명
                </a>
                <img src="/icons/breadcrumb_ic_arrow.png" alt=">" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                <span className="leading-none text-[var(--fg-3)]">
                  {currentPage === 'intro' ? '사업소개' : '자료실'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1">
        {currentPage === 'intro' ? (
          <>
            {/* 1. Introduction Section & Timeline */}
            <IntroSection />

            {/* 2. Interactive Solutions Explorer (Left Map, Right Details Node) */}
            <section id="sol-map" className="py-14 bg-white scroll-mt-20">
              <div className="max-w-[1440px] mx-auto px-0">
                
                {/* Title Block */}
                <div className="mb-[32px]">
                  <h2 className="font-score font-bold text-[28px] text-[#16243B] leading-tight">
                    솔루션 지도
                  </h2>
                </div>

                {/* 좌우 컬럼 레이아웃 (지도 733px 고정, 우측 패널 472px 고정 및 컨테이너 우측 배치) */}
                <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-[40px] lg:gap-0">
                  
                  {/* 좌측 지도 영역 */}
                  <div className="shrink-0 lg:sticky lg:top-[88px]">
                    <SolutionMap 
                      solutions={solutionsData} 
                      activeId={activeSolutionId}
                      onSelectSolution={handleSelectSolution}
                    />
                  </div>

                  {/* 우측 상세 정보 패널 (472px 고정) */}
                  <div 
                    className="shrink-0 bg-white border border-[#E6E8EA] rounded-[16px] p-[24px]"
                    style={{
                      width: '472px',
                      boxShadow: '0 0 12px rgba(57, 63, 80, 0.12)',
                    }}
                  >
                    <SolutionDetails 
                      solutions={solutionsData}
                      selectedSolution={selectedSolution}
                      onSelectSolution={handleSelectSolution}
                      onNavigateToData={handleNavigateToData}
                    />
                  </div>

                </div>

              </div>
            </section>

            {/* 3. Service Scenario with cooperative logs */}
            <ScenarioSection />

            {/* 4. Action resources downloadable catalogs & QR scans */}
            <ResourceSection />

            {/* 5. Highlight Downward call-to-action (CTA) Section */}
            <section className="pt-10 pb-20 bg-white" id="partner-banner">
              <div className="max-w-[1440px] mx-auto px-0">
                
                <div 
                  className="gp-cta relative flex flex-col lg:block shadow-inner hover:shadow-lg transition-shadow duration-300 w-full"
                  style={{
                    background: "url('/images/banner_bg_01.png') no-repeat left center / cover",
                    borderRadius: '24px',
                  }}
                >
                  {/* Inner wrapper for padding on mobile, height & relative position on desktop */}
                  <div className="p-8 lg:p-0 lg:relative lg:h-[234px] w-full">
                    
                    {/* Left CTA text */}
                    <div 
                      className="text-left lg:absolute lg:left-[346px] lg:top-1/2 lg:-translate-y-1/2 lg:w-[480px]"
                    >
                      <h2 
                        className="font-pretendard-gov text-white leading-[1.3] mb-3"
                        style={{ fontSize: '32px', fontWeight: 700 }}
                      >
                        데이터로 연결된 광명,<br />
                        시민과 함께 더 나은 미래로
                      </h2>
                      <p 
                        className="font-pretendard-gov text-white/85"
                        style={{ fontSize: '16px', lineHeight: '1.6', fontWeight: 400 }}
                      >
                        광명시는 기술과 데이터, 그리고 시민의 참여로<br />
                        지속가능한 스마트도시를 만들어갑니다.
                      </p>
                    </div>

                    {/* Right Action Trigger Buttons */}
                    <div className="flex flex-row items-center gap-[12px] mt-6 lg:mt-0 lg:absolute lg:right-[48px] lg:top-1/2 lg:-translate-y-1/2 shrink-0">
                      <button 
                        onClick={() => triggerToast("'광명역세권_통합솔루션_종합보고서.pdf'를 성실히 준비하여 다운로드를 실행하였습니다.")}
                        className="bg-white hover:bg-slate-50 text-[#0B50A0] font-semibold text-[15px] w-[230px] h-[48px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer font-pretendard-gov shrink-0"
                      >
                        사업소개 자료 다운로드
                      </button>
                      
                      <button 
                        onClick={() => triggerToast("문의 접수 상담 창구가 로딩되었습니다. 시민지원센터(1688-3399) 및 실시간 채팅 문의 가능지입니다.")}
                        className="bg-transparent border border-white/60 hover:border-white hover:bg-white/10 text-white font-semibold text-[15px] w-[230px] h-[48px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer font-pretendard-gov shrink-0"
                      >
                        문의하기
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </section>
          </>
        ) : currentPage === 'archive' ? (
          <ResourceArchive onShowToast={triggerToast} />
        ) : currentPage === 'dataList' ? (
          <DataList onShowToast={triggerToast} onNavigate={setCurrentPage} />
        ) : currentPage === 'dataDetail' ? (
          <DataDetail onShowToast={triggerToast} onNavigate={setCurrentPage} />
        ) : currentPage === 'personalCarbon' ? (
          <PersonalCarbon />
        ) : currentPage === 'login' ? (
          <Login onShowToast={triggerToast} onLoginSuccess={() => setCurrentPage('admin')} />
        ) : currentPage === 'notice' ? (
          <Notice onShowToast={triggerToast} onNavigate={setCurrentPage} />
        ) : currentPage === 'noticeDetail' ? (
          <NoticeDetail onShowToast={triggerToast} onNavigate={setCurrentPage} />
        ) : currentPage === 'relatedPlatforms' ? (
          <RelatedPlatforms />
        ) : (
          <div className="pb-10 bg-[var(--bg-page)]">
            {currentPage === 'cityMap' ? (
              <>
                <CityDataMap 
                  onShowToast={triggerToast} 
                  activeTab={activeCityTab}
                  onTabChange={setActiveCityTab}
                />
                <MileDashboard 
                  activeTab={activeCityTab} 
                  onTabChange={setActiveCityTab} 
                  onShowToast={triggerToast} 
                  title="도시지표 상세 데이터"
                  subtitle="광명역세권 주요 데이터를 차트와 원천 데이터로 확인할 수 있습니다."
                  customTabs={[
                    { id: 'population', label: '인구 · 생활' },
                    { id: 'traffic', label: '교통 · 이동' },
                    { id: 'climate', label: '환경 · 기후' },
                    { id: 'safety', label: '안전 · 재난' },
                    { id: 'energy', label: '에너지 · 건물' },
                    { id: 'public', label: '공공시설' },
                  ]}
                />
              </>
            ) : (
              <>
                <MileDataMap activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />
                <MileDashboard activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Gwangmyeong Copyright Footer */}
      <Footer />
      </>
      )}
    </div>
  );
}
