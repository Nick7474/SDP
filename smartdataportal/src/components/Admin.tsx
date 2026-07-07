import { useState } from 'react';
import {
  UserCircle, ExternalLink, ChevronRight,
} from 'lucide-react';
import Footer from './Footer';
import AdminContent from './AdminContent';
import AdminAccount from './AdminAccount';

interface AdminProps {
  onShowToast?: (msg: string) => void;
  onNavigate?: (page: any) => void;
}

const statCards = [
  { iconSrc: '/icons_admin/ic_admin_noti_50.svg', label: '게시중 공지', value: '24', unit: '건', sub: '중요 공지 3건', link: '공지사항 관리' },
  { iconSrc: '/icons_admin/ic_admin_document_50.svg', label: '등록 자료', value: '86', unit: '건', sub: '이번 달 등록 12건', link: '자료실 관리' },
  { iconSrc: '/icons_admin/ic_admin_banner_50.svg', label: '노출 중 팝업 · 배너', value: '85', unit: '건', sub: '배너 2개 · 팝업 1개', link: '팝업 · 배너관리' },
  { iconSrc: '/icons_admin/ic_admin_hide_50.svg', label: '숨김 메뉴', value: '1', unit: '개', sub: '연관플랫폼 내 숨김 항목', link: '메뉴 노출 관리' },
];

const recentRows = [
  { title: '광명 스마트데이터포털 서비스 정기 점검 안내', cat: '공지', date: '2026.05.20', status: '게시중' },
  { title: '데이터시각화 지표 갱신 안내', cat: '공지', date: '2026.05.20', status: '게시중' },
  { title: '개인탄소저감활동 이용 안내', cat: '공지', date: '2026.05.20', status: '임시저장' },
  { title: '광명 스마트데이터포털 이용 가이드.pdf', cat: '자료실', date: '2026.05.20', status: '공개' },
  { title: '데이터 목록 설명서.xlsx', cat: '자료실', date: '2026.05.20', status: '공개' },
];

const tasks = [
  { iconSrc: '/icons_admin/ic_admin_lock_24.svg', label: '비공개 콘텐츠', value: '5', unit: '건' },
  { iconSrc: '/icons_admin/ic_admin_hide_24.svg', label: '숨김 메뉴', value: '1', unit: '개' },
  { iconSrc: '/icons_admin/ic_admin_clock_24.svg', label: '종료 예정 · 팝업', value: '2', unit: '개' },
  { iconSrc: '/icons_admin/ic_admin_link_24.svg', label: '미노출 연관플랫폼', value: '4', unit: '개' },
];

const sidebarMenu = [
  { icon: '/icons_admin/ic_admin_dashboard.svg', iconOn: '/icons_admin/ic_admin_dashboard_on.svg', label: '대시보드' },
  { icon: '/icons_admin/ic_admin_content.svg', iconOn: '/icons_admin/ic_admin_content_on.svg', label: '콘텐츠 관리' },
  { icon: '/icons_admin/ic_admin_account.svg', iconOn: '/icons_admin/ic_admin_account_on.svg', label: '관리자 계정' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case '게시중': return 'bg-[#ECF2FE] text-[#0B50D0]';
    case '공개': return 'bg-[#EAF6EC] text-[#3FA654]';
    case '임시저장':
    default: return 'bg-[#F4F5F6] text-[#58616A]';
  }
};

export default function Admin({ onShowToast, onNavigate }: AdminProps) {
  const [activeMenu, setActiveMenu] = useState('대시보드');
  const [activeTab, setActiveTab] = useState('공지사항');
  const [contentTab, setContentTab] = useState('공지사항 관리');
  const tabs = ['공지사항', '자료실', '데이터목록'];

  // 로그아웃: 관리자 세션 해제 후 서비스 홈으로 (이후 상단 관리자 메뉴 자동 숨김)
  const handleLogout = () => {
    sessionStorage.removeItem('sdp-admin-auth');
    onShowToast?.('로그아웃되었습니다.');
    onNavigate?.('home');
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white font-pretendard-gov">
      {/* Admin Header */}
      <header className="h-[90px] bg-white border-b border-[#E6E6E6] flex items-center justify-between px-[40px] shrink-0">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate?.('intro'); }}
          className="flex items-center shrink-0"
        >
          <img src="/images/logo.svg" alt="광명 스마트데이터포털" width={215} height={60} className="w-[215px] h-[60px] object-contain" />
        </a>
        <div className="flex items-center gap-[36px]">
          <button
            onClick={() => onNavigate?.('home')}
            className="h-[48px] w-[170px] rounded-[6px] border border-[#CDD1D5] bg-white flex items-center justify-center gap-[6px] text-[16px] font-medium text-[#131416] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
          >
            사용자 화면 보기 <ExternalLink size={16} />
          </button>
          <div className="flex items-center gap-[20px] text-[16px] font-medium text-[#131416]">
            <span>운영관리자</span>
            <span className="w-px h-[12px] bg-[#CDD1D5]" />
            <button onClick={handleLogout} className="hover:text-[var(--gp-primary)] transition-colors">로그아웃</button>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[260px] shrink-0 bg-[#ECF2FE] flex flex-col justify-between px-[16px] py-[16px]">
          <nav className="flex flex-col gap-[20px]">
            {sidebarMenu.map(({ icon, iconOn, label }) => {
              const active = activeMenu === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveMenu(label)}
                  className={`h-[54px] rounded-[6px] flex items-center gap-[14px] px-[16px] transition-colors ${
                    active
                      ? 'bg-[#0B50D0] text-white'
                      : 'text-[#464C53] hover:bg-white'
                  }`}
                >
                  <img src={active ? iconOn : icon} alt="" width={24} height={24} className="w-6 h-6 shrink-0" />
                  <span className={`text-[18px] ${active ? 'font-semibold' : 'font-normal'}`}>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin info */}
          <div className="bg-white border border-[#E6E8EA] rounded-[8px] p-[19px] flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[40px] h-[40px] rounded-full bg-[#ECF2FE] flex items-center justify-center shrink-0">
                <UserCircle size={26} className="text-[#0B50D0]" />
              </div>
              <div className="flex flex-col gap-[2px] text-[14px] min-w-0">
                <span className="font-medium text-[#131416] truncate">운영관리자</span>
                <span className="font-normal text-[#464C53] truncate">admin@gm.go.kr</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="h-[48px] rounded-[8px] border border-[#CDD1D5] bg-white text-[16px] font-semibold text-[#1E2124] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
            >
              로그아웃
            </button>
          </div>
        </aside>

        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Breadcrumb */}
          <div className="h-[44px] bg-white border-b border-[#EAEBEC] flex items-center gap-[8px] px-[24px] text-[16px] font-medium text-[#6D7882]">
            <img src="/icons/breadcrumb_ic_home.png" alt="홈" width={24} height={24} className="w-6 h-6 object-contain" />
            <ChevronRight size={16} className="text-[#B1B8BE]" />
            <span>관리자</span>
            <ChevronRight size={16} className="text-[#B1B8BE]" />
            <span>{activeMenu}</span>
            {activeMenu === '콘텐츠 관리' && (
              <>
                <ChevronRight size={16} className="text-[#B1B8BE]" />
                <span>{contentTab}</span>
              </>
            )}
          </div>

          {/* Main */}
          {activeMenu === '콘텐츠 관리' ? (
          <AdminContent onShowToast={onShowToast} onTabChange={setContentTab} />
          ) : activeMenu === '관리자 계정' ? (
          <AdminAccount onShowToast={onShowToast} />
          ) : (
          <main className="flex-1 p-[32px] flex flex-col gap-[32px] bg-white">
            {/* Title */}
            <div className="flex flex-col gap-[4px]">
              <h1 className="text-[28px] font-bold text-[#1E2124]">대시보드</h1>
              <p className="text-[16px] text-[#464C53]">
                광명 스마트데이터포털 사용자 화면과 분리된 운영자 전용 CMS 입니다. 공지사항, 자료실, 연관플랫폼, 메뉴 노출, 배너 · 팝업을 최소 기능으로 관리합니다.
              </p>
            </div>

            <div className="flex flex-col gap-[24px]">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px]">
                {statCards.map(({ iconSrc, label, value, unit, sub, link }) => (
                  <div key={label} className="bg-white border border-[#E6E8EA] rounded-[12px] p-[20px] flex flex-col justify-between min-h-[166px]">
                    <div className="flex items-start gap-[20px]">
                      <img src={iconSrc} alt="" width={50} height={50} className="w-[50px] h-[50px] shrink-0" />
                      <div className="flex flex-col text-[#131416]">
                        <span className="text-[16px] font-medium">{label}</span>
                        <div className="flex items-center gap-[5px]">
                          <span className="text-[40px] font-bold leading-tight">{value}</span>
                          <span className="text-[16px] font-normal">{unit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#464C53]">{sub}</span>
                      <button
                        onClick={() => onShowToast?.(`'${link}' 화면은 준비 중입니다.`)}
                        className="flex items-center gap-[4px] text-[14px] font-semibold text-[#0B50D0] hover:underline"
                      >
                        {link} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two panels */}
              <div className="flex flex-col xl:flex-row gap-[24px] items-stretch">
                {/* 최근 등록 콘텐츠 */}
                <div className="flex-1 min-w-0 bg-white border border-[#E6E8EA] rounded-[12px] p-[24px]">
                  <div className="flex items-center justify-between mb-[40px]">
                    <h2 className="text-[18px] font-semibold text-[#131416]">최근 등록 콘텐츠</h2>
                    <button onClick={() => onShowToast?.('전체 콘텐츠 목록은 준비 중입니다.')} className="flex items-center gap-[4px] text-[14px] text-[#131416] hover:text-[var(--gp-primary)]">
                      전체 보기 <ChevronRight size={15} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-[#CDD1D5] mb-[24px]">
                    {tabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`h-[40px] px-[24px] text-[16px] -mb-px border-b-2 transition-colors ${
                          activeTab === tab
                            ? 'border-[#0B50D0] text-[#0B50D0] font-bold'
                            : 'border-transparent text-[#B1B8BE] font-medium hover:text-[var(--gp-primary)]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="border border-[#E6E8EA] rounded-[4px] overflow-hidden">
                    <div className="flex bg-[#F4F5F6] h-[40px] items-center text-[14px] font-semibold text-[#131416]">
                      <span className="flex-1 px-[16px]">제목</span>
                      <span className="w-[120px] px-[16px]">구분</span>
                      <span className="w-[120px] px-[16px]">등록일</span>
                      <span className="w-[120px] px-[16px] text-center">상태</span>
                    </div>
                    {recentRows.map((row, idx) => (
                      <div key={idx} className="flex h-[44px] items-center text-[14px] text-[#1E2124] border-t border-[#E6E8EA]">
                        <span className="flex-1 px-[16px] truncate">{row.title}</span>
                        <span className="w-[120px] px-[16px]">{row.cat}</span>
                        <span className="w-[120px] px-[16px]">{row.date}</span>
                        <span className="w-[120px] px-[16px] flex justify-center">
                          <span className={`inline-flex items-center px-[10px] py-[4px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>
                            {row.status}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 처리 필요 항목 */}
                <div className="w-full xl:w-[590px] shrink-0 bg-white border border-[#E6E8EA] rounded-[12px] p-[24px]">
                  <div className="flex items-center justify-between mb-[18px]">
                    <h2 className="text-[18px] font-semibold text-[#131416]">처리 필요 항목</h2>
                    <button onClick={() => onShowToast?.('처리 필요 항목 전체 목록은 준비 중입니다.')} className="flex items-center gap-[4px] text-[14px] text-[#131416] hover:text-[var(--gp-primary)]">
                      전체 보기 <ChevronRight size={15} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    {tasks.map(({ iconSrc, label, value, unit }) => (
                      <button
                        key={label}
                        onClick={() => onShowToast?.(`'${label}' 처리 화면은 준비 중입니다.`)}
                        className="w-full border border-[#E6E8EA] rounded-[4px] px-[32px] py-[22px] flex items-center justify-between hover:border-[var(--gp-primary)] transition-colors"
                      >
                        <div className="flex items-center gap-[16px]">
                          <img src={iconSrc} alt="" width={24} height={24} className="w-[24px] h-[24px]" />
                          <span className="text-[16px] font-medium text-[#131416]">{label}</span>
                        </div>
                        <div className="flex items-center gap-[16px]">
                          <span className="flex items-baseline gap-[4px]">
                            <span className="text-[24px] font-semibold text-[#0B50D0]">{value}</span>
                            <span className="text-[16px] text-[#131416]">{unit}</span>
                          </span>
                          <ChevronRight size={15} className="text-[#8A949E]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
