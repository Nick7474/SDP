import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentPage: 'home' | 'intro' | 'archive' | 'map' | 'cityMap' | 'dataList' | 'dataDetail' | 'personalCarbon' | 'relatedPlatforms' | 'notice' | 'noticeDetail' | 'admin' | 'login';
  onNavigate: (page: 'home' | 'intro' | 'archive' | 'map' | 'cityMap' | 'dataList' | 'dataDetail' | 'personalCarbon' | 'relatedPlatforms' | 'notice' | 'noticeDetail' | 'admin' | 'login') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 관리자 메뉴는 포털 관리자로 로그인한 경우에만 노출(시민에겐 숨김). 네비게이션마다 재평가됨.
  const isAdminAuthed = typeof window !== 'undefined' && !!sessionStorage.getItem('sdp-admin-auth');

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[var(--border-1)] backdrop-blur-md bg-white/95">
      {/* Top Banner Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-[var(--gp-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:z-[100] focus:outline-none focus:ring-2 focus:ring-[var(--gp-primary)]">
        본문 바로가기
      </a>

      <div className="max-w-[1440px] mx-auto px-0 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="flex items-center shrink-0"
        >
          <img 
            src="/images/logo.svg" 
            alt="광명 스마트데이터포털" 
            width={215} 
            height={60} 
            className="w-[215px] h-[60px] object-contain"
          />
        </a>

        {/* Desktop GNB Navigation */}
        <nav className="hidden lg:flex lg:flex-1 lg:justify-center items-center gap-[50px] h-full lg:ml-[80px]">
          {/* 강소형스마트도시 광명 (대메뉴 + 소메뉴) */}
          <div className="relative group flex items-center h-full cursor-pointer">
            <a 
              href="#intro" 
              onClick={(e) => {
                e.preventDefault();
                onNavigate('intro');
              }}
              className={`font-score text-[16px] font-bold transition-colors py-2 ${
                currentPage === 'intro' || currentPage === 'archive'
                  ? 'text-[var(--gp-primary)]'
                  : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
              }`}
            >
              강소형스마트도시 광명
            </a>
            {/* 드롭다운 소메뉴 */}
            <div className="absolute top-[75px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="w-[180px] bg-white border border-[#E6E8EA] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.16)] p-[12px] flex flex-col gap-[12px]">
                <a 
                  href="#intro" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('intro');
                  }}
                  className={`px-[16px] py-[9px] rounded-[6px] text-[16px] transition-colors font-pretendard-gov ${
                    currentPage === 'intro'
                      ? 'font-semibold text-[var(--gp-primary)] bg-[#ECF2FE]'
                      : 'font-medium text-[#1E2124] hover:bg-[#ECF2FE] hover:text-[var(--gp-primary)]'
                  }`}
                >
                  사업소개
                </a>
                <a 
                  href="#resources" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('archive');
                  }}
                  className={`px-[16px] py-[9px] rounded-[6px] text-[16px] transition-colors font-pretendard-gov ${
                    currentPage === 'archive'
                      ? 'font-semibold text-[var(--gp-primary)] bg-[#ECF2FE]'
                      : 'font-medium text-[#1E2124] hover:bg-[#ECF2FE] hover:text-[var(--gp-primary)]'
                  }`}
                >
                  자료실
                </a>
              </div>
            </div>
          </div>

          {/* 데이터 지도 (대메뉴 + 소메뉴) */}
          <div className="relative group flex items-center h-full cursor-pointer">
            <a 
              href="#map" 
              onClick={(e) => {
                e.preventDefault();
                onNavigate('map');
              }}
              className={`font-score text-[16px] font-bold transition-colors py-2 ${
                currentPage === 'map'
                  ? 'text-[var(--gp-primary)]'
                  : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
              }`}
            >
              데이터 지도
            </a>
            {/* 드롭다운 소메뉴 */}
            <div className="absolute top-[75px] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="w-[180px] bg-white border border-[#E6E8EA] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.16)] p-[12px] flex flex-col gap-[12px]">
                <a 
                  href="#map" 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('map');
                  }}
                  className={`px-[16px] py-[9px] rounded-[6px] text-[16px] transition-colors font-pretendard-gov ${
                    currentPage === 'map'
                      ? 'font-semibold text-[var(--gp-primary)] bg-[#ECF2FE]'
                      : 'font-medium text-[#1E2124] hover:bg-[#ECF2FE] hover:text-[var(--gp-primary)]'
                  }`}
                >
                  마일별 데이터
                </a>
                <a
                  href="#city-map" onClick={(e) => { e.preventDefault(); onNavigate('cityMap'); }}
                  className={`px-[16px] py-[9px] rounded-[6px] text-[16px] transition-colors font-pretendard-gov ${
                    currentPage === 'cityMap'
                      ? 'font-semibold text-[var(--gp-primary)] bg-[#ECF2FE]'
                      : 'font-medium text-[#1E2124] hover:bg-[#ECF2FE] hover:text-[var(--gp-primary)]'
                  }`}
                >
                  광명시 데이터
                </a>
              </div>
            </div>
          </div>

          <a 
            href="#data-list" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dataList');
            }}
            className={`font-score text-[16px] font-bold transition-colors py-2 ${
              currentPage === 'dataList'
                ? 'text-[var(--gp-primary)]'
                : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
            }`}
          >
            데이터 목록
          </a>
          <a 
            href="#personal-carbon" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('personalCarbon');
            }}
            className={`font-score text-[16px] font-bold transition-colors py-2 ${
              currentPage === 'personalCarbon'
                ? 'text-[var(--gp-primary)]'
                : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
            }`}
          >
            시민탄소저감활동
          </a>
          <a 
            href="#partner-banner" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('relatedPlatforms');
            }}
            className={`font-score text-[16px] font-bold transition-colors py-2 ${
              currentPage === 'relatedPlatforms'
                ? 'text-[var(--gp-primary)]'
                : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
            }`}
          >
            연관플랫폼
          </a>
          <a
            href="#notice"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('notice');
            }}
            className={`font-score text-[16px] font-bold transition-colors py-2 ${
              currentPage === 'notice' || currentPage === 'noticeDetail'
                ? 'text-[var(--gp-primary)]'
                : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
            }`}
          >
            공지사항
          </a>
          {/* 관리자 메뉴: 포털 관리자 로그인 시에만 노출 (시민 미노출) */}
          {isAdminAuthed && (
          <a
            href="#admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('admin');
            }}
            className={`font-score text-[16px] font-bold transition-colors py-2 ${
              currentPage === 'admin'
                ? 'text-[var(--gp-primary)]'
                : 'text-[#0F0F10] hover:text-[var(--gp-primary)]'
            }`}
          >
            관리자
          </a>
          )}
        </nav>

        {/* 로고 폭만큼 우측 스페이서 → GNB를 헤더 정중앙에 정렬 */}
        <div className="hidden lg:block shrink-0 w-[215px]" aria-hidden="true" />

        {/* Right Utility Buttons */}
        {/* 로그인 임시 주석처리 (요청 시 복구)
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-[8px] font-pretendard-gov text-[16px] font-normal text-[#0F0F10] hover:text-[var(--gp-primary)] transition-colors cursor-pointer"
          >
            <img src="/icons/ic_login.svg" alt="" className="w-5 h-5 object-contain" />
            <span>로그인</span>
          </button>
        </div>
        */}

        {/* Mobile menu toggle button */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-[#0F0F10] hover:bg-[var(--gp-primary-soft)] rounded-md transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-[var(--border-2)] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-5 flex flex-col gap-4">
            {/* 로그인 임시 주석처리 (요청 시 복구)
            <div className="p-3 border-b border-[var(--border-1)] flex justify-between items-center">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }}
                className="flex items-center gap-[8px] font-pretendard-gov text-[15px] font-normal text-[#0F0F10] hover:text-[var(--gp-primary)] transition-colors cursor-pointer"
              >
                <img src="/icons/ic_login.svg" alt="" className="w-5 h-5 object-contain" />
                <span>로그인</span>
              </button>
            </div>
            */}

            <nav className="flex flex-col gap-2">
              {/* 강소형스마트도시 광명 */}
              <div className="flex flex-col border border-[var(--border-1)] rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 font-score text-[15px] font-bold text-[var(--gp-primary)] bg-[var(--gp-primary-soft)] border-b border-[var(--border-1)]">
                  <span>강소형스마트도시 광명</span>
                </div>
                <div className="flex flex-col bg-slate-50 px-3 py-1.5 gap-1">
                  <a 
                    href="#intro" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('intro');
                    }}
                    className={`flex items-center justify-between py-2 text-[14px] font-pretendard-gov ${
                      currentPage === 'intro'
                        ? 'font-semibold text-[var(--gp-primary)]'
                        : 'font-medium text-[#0F0F10] hover:text-[var(--gp-primary)]'
                    }`}
                  >
                    <span>사업소개</span>
                    <ArrowRight size={12} />
                  </a>
                  <a 
                    href="#resources" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('archive');
                    }}
                    className={`flex items-center justify-between py-2 text-[14px] font-pretendard-gov ${
                      currentPage === 'archive'
                        ? 'font-semibold text-[var(--gp-primary)]'
                        : 'font-medium text-[#0F0F10] hover:text-[var(--gp-primary)]'
                    }`}
                  >
                    <span>자료실</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              {/* 데이터 지도 */}
              <div className="flex flex-col border border-[var(--border-1)] rounded-lg overflow-hidden mt-1">
                <div className={`flex items-center justify-between px-3 py-2.5 font-score text-[15px] font-bold border-b border-[var(--border-1)] ${
                  currentPage === 'map' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10] bg-slate-100'
                }`}>
                  <span>데이터 지도</span>
                </div>
                <div className="flex flex-col bg-slate-50 px-3 py-1.5 gap-1">
                  <a 
                    href="#map" 
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      onNavigate('map');
                    }}
                    className={`flex items-center justify-between py-2 text-[14px] font-pretendard-gov ${
                      currentPage === 'map'
                        ? 'font-semibold text-[var(--gp-primary)]'
                        : 'font-medium text-[#0F0F10] hover:text-[var(--gp-primary)]'
                    }`}
                  >
                    <span>마일별 데이터</span>
                    <ArrowRight size={12} />
                  </a>
                  <a 
                    href="#city-map" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate('cityMap'); }}
                    className="flex items-center justify-between py-2 text-[14px] font-medium text-[#0F0F10] hover:text-[var(--gp-primary)] transition-colors font-pretendard-gov"
                  >
                    <span>광명시 데이터</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              <a 
                href="#data-list" 
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('dataList');
                }}
                className={`flex items-center justify-between px-3 py-3 font-score text-[15px] font-bold hover:bg-[var(--bg-subtle)] rounded-md mt-1 ${
                  currentPage === 'dataList' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10]'
                }`}
              >
                <span>데이터 목록</span>
                <ArrowRight size={14} />
              </a>
              <a 
                href="#personal-carbon" 
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('personalCarbon');
                }}
                className={`flex items-center justify-between px-3 py-3 font-score text-[15px] font-bold hover:bg-[var(--bg-subtle)] rounded-md ${
                  currentPage === 'personalCarbon' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10]'
                }`}
              >
                <span>시민탄소저감활동</span>
                <ArrowRight size={14} />
              </a>
              <a 
                href="#partner-banner" 
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('relatedPlatforms');
                }}
                className={`flex items-center justify-between px-3 py-3 font-score text-[15px] font-bold hover:bg-[var(--bg-subtle)] rounded-md ${
                  currentPage === 'relatedPlatforms' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10]'
                }`}
              >
                <span>연관플랫폼</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#notice"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('notice');
                }}
                className={`flex items-center justify-between px-3 py-3 font-score text-[15px] font-bold hover:bg-[var(--bg-subtle)] rounded-md ${
                  currentPage === 'notice' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10]'
                }`}
              >
                <span>공지사항</span>
                <ArrowRight size={14} />
              </a>
              {/* 관리자 메뉴: 포털 관리자 로그인 시에만 노출 (시민 미노출) */}
              {isAdminAuthed && (
              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className={`flex items-center justify-between px-3 py-3 font-score text-[15px] font-bold hover:bg-[var(--bg-subtle)] rounded-md ${
                  currentPage === 'admin' ? 'text-[var(--gp-primary)] bg-[var(--gp-primary-soft)]' : 'text-[#0F0F10]'
                }`}
              >
                <span>관리자</span>
                <ArrowRight size={14} />
              </a>
              )}
            </nav>
            
            <div className="border-t border-[var(--border-1)] pt-4 flex justify-between text-xs text-[var(--fg-4)]">
              <span>디자인 시스템 v1.0 준수</span>
              <span>Gwangmyeong City</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
