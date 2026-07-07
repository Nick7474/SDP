import React, { useState } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';

interface ResourceArchiveProps {
  onShowToast: (msg: string) => void;
}

interface RecommendCard {
  id: number;
  category: string;
  title: string;
  desc: string;
  icon: string;
  tagClass: string;
}

interface TableRow {
  id: number;
  num: number;
  category: string;
  title: string;
  fileType: 'PDF' | 'PPT';
  date: string;
  views: number;
}

export default function ResourceArchive({ onShowToast }: ResourceArchiveProps) {
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('최신순');

  const tabs = ['전체', '사업계획서', '홍보자료', '회의자료', '성과자료', '공고자료', '기타'];

  const recommendCards: RecommendCard[] = [
    {
      id: 1,
      category: '사업계획서',
      title: '광명시 강소형 스마트도시 조성사업 계획서',
      desc: 'PDF · 사업계획의 추진 전략',
      icon: '/icons/ic_pdf.png',
      tagClass: 'text-[#6E74D6] bg-[#F3EFFF]',
    },
    {
      id: 2,
      category: '홍보자료',
      title: 'MILE EASY 광명 시민 안내자료',
      desc: 'PDF/PPT · 시민 안내 자료',
      icon: '/icons/ic_ppt.png',
      tagClass: 'text-[#ED8B16] bg-[#FFF3E0]',
    },
    {
      id: 3,
      category: '성과자료',
      title: '스마트도시 솔루션 성과자료',
      desc: 'PDF · 주요 KPI 및 기대효과',
      icon: '/icons/ic_pdf.png',
      tagClass: 'text-[#1587E1] bg-[#E6F2FD]',
    },
  ];

  const tableData: TableRow[] = [
    { id: 1, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 2, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 세부계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 3, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 4, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 5, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 6, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 7, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 세부계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 8, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 9, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
    { id: 10, num: 99, category: '사업계획서', title: '광명시 강소형 스마트도시 조성사업 계획서', fileType: 'PDF', date: '2026-06-05', views: 128 },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(`"${searchQuery}" 검색 조건으로 자료를 필터링합니다.`);
  };

  const handleDownload = (title: string) => {
    onShowToast(`"${title}" 파일의 다운로드를 실행하였습니다.`);
  };

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* 1. Hero Banner Area (280px Height) */}
      <div 
        className="w-full bg-[#F5F8FC] relative flex items-center overflow-hidden shrink-0 select-none"
        style={{
          height: '280px',
          background: "url('/images/banner_bg_자료실.png') no-repeat right center / cover",
        }}
      >
        <div className="max-w-[1440px] w-full mx-auto px-0">
          <div className="flex flex-col text-left">
            <h1 className="font-score font-bold text-[40px] text-[#16243B] leading-tight mb-[8px]">
              자료실
            </h1>
            <p className="font-score text-[16px] text-[#4E5968] font-normal leading-[1.6]">
              광명시 강소형 스마트도시 조성사업의 주요 자료를 확인하고 다운로드할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Container (1440px) */}
      <div className="max-w-[1440px] w-full mx-auto px-0 pt-[32px] pb-[60px] flex flex-col">
        
        {/* filter chips & search input */}
        <div className="flex items-center justify-between w-full shrink-0 bg-white border border-[var(--border-light)] rounded-[12px] p-[24px] mb-[24px]">
          {/* Left filter chips (디자인시스템 gp-chip 적용) */}
          <div className="flex items-center gap-[10px] flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    onShowToast(`"${tab}" 카테고리로 필터링합니다.`);
                  }}
                  className={`gp-chip ${isActive ? 'gp-chip--active' : ''}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Right search Form (디자인시스템 gp-searchbar, gp-searchfield, gp-btn 적용) */}
          <form onSubmit={handleSearchSubmit} className="gp-searchbar max-w-[380px] items-center">
            <div className="gp-searchfield">
              <input
                type="text"
                placeholder="자료명을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-pretendard-gov"
              />
              <Search className="gp-ico" />
            </div>
            <button
              type="submit"
              className="gp-btn gp-btn--primary font-pretendard-gov shrink-0"
              style={{ height: '48px', width: '80px' }}
            >
              검색
            </button>
          </form>
        </div>

        {/* 3. Recommend Cards (3 Columns) */}
        <div className="grid grid-cols-3 gap-[24px] w-full shrink-0 mb-[40px]">
          {recommendCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white border border-[#E6E8EA] rounded-[12px] p-[16px] flex gap-[16px] hover:shadow-[0_4px_16px_rgba(22,36,59,0.06)] transition-all duration-300 w-full group items-start"
            >
              {/* Left Document Icon */}
              <img 
                src={card.icon} 
                alt={card.category} 
                className="w-[70px] h-[70px] object-contain shrink-0 mt-0.5 group-hover:scale-105 transition-transform" 
              />
              
              {/* Right Contents */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-left">
                  <span className={`text-[13px] font-bold px-[8px] py-[3px] rounded-[4px] inline-block mb-[6px] font-pretendard-gov ${card.tagClass}`}>
                    {card.category}
                  </span>
                  <h3 className="font-pretendard-gov text-[17px] font-bold text-[#16243B] leading-snug truncate pr-1" title={card.title}>
                    {card.title}
                  </h3>
                  <p className="font-pretendard-gov text-[14px] text-[#7C8896] mt-[2px] leading-tight font-normal">
                    {card.desc}
                  </p>
                </div>
                
                {/* Download Button */}
                <div className="flex justify-end mt-[8px]">
                  <button
                    onClick={() => handleDownload(card.title)}
                    className="gp-btn gp-btn--secondary gp-btn--sm font-pretendard-gov font-semibold transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>다운로드</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Complete List (Table) */}
        <div className="flex flex-col gap-[16px] w-full shrink-0 mb-[24px]">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col gap-[32px] text-left">
              <h2 className="font-pretendard-gov text-[24px] font-bold text-[#16243B] leading-none">
                전체 자료
              </h2>
              <span className="text-[14px] font-normal text-[var(--fg-3)] leading-none">
                총 <b className="font-semibold text-[var(--fg-1)]">242</b>건
              </span>
            </div>
            
            {/* Sort Select Trigger Container */}
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="gp-select-btn gp-select-btn--h40 font-pretendard-gov"
              >
                <span>{sortBy}</span>
                <ChevronDown size={16} className={`text-[#7C8896] transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortDropdownOpen && (
                <div className="gp-dropdown-menu">
                  <button 
                    onClick={() => {
                      setSortBy('최신순');
                      setIsSortDropdownOpen(false);
                      onShowToast('최신순으로 정렬 방식을 변경합니다.');
                    }}
                    className={`gp-dropdown-item ${sortBy === '최신순' ? 'active' : ''}`}
                  >
                    최신순
                  </button>
                  <button 
                    onClick={() => {
                      setSortBy('조회수순');
                      setIsSortDropdownOpen(false);
                      onShowToast('조회수순으로 정렬 방식을 변경합니다.');
                    }}
                    className={`gp-dropdown-item ${sortBy === '조회수순' ? 'active' : ''}`}
                  >
                    조회수순
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table Container (디자인시스템 gp-table 적용) */}
          <div className="gp-table-container">
            <table className="gp-table">
              <thead>
                <tr>
                  <th className="w-[80px] !text-center">번호</th>
                  <th className="w-[120px] text-left px-4">구분</th>
                  <th className="text-left px-4">자료명</th>
                  <th className="w-[100px] !text-center">파일형식</th>
                  <th className="w-[130px] !text-center">등록일</th>
                  <th className="w-[100px] !text-center">조회수</th>
                  <th className="w-[140px] !text-center">다운로드</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td className="!text-center font-pretendard-gov" style={{ color: 'var(--fg-4)' }}>{row.num}</td>
                    <td className="text-left px-4 font-pretendard-gov" style={{ color: 'var(--fg-2)' }}>{row.category}</td>
                    <td className="text-left px-4">
                      <div 
                        onClick={() => onShowToast(`"${row.title}" 자료 정보를 확인합니다.`)}
                        className="ttl hover:text-[var(--gp-primary)] hover:underline cursor-pointer truncate max-w-[500px]"
                      >
                        {row.title}
                      </div>
                    </td>
                    <td className="!text-center">
                      <span className={`gp-filetag gp-filetag--${row.fileType.toLowerCase()}`}>
                        {row.fileType}
                      </span>
                    </td>
                    <td className="!text-center font-pretendard-gov" style={{ color: 'var(--fg-3)' }}>{row.date}</td>
                    <td className="!text-center font-pretendard-gov" style={{ color: 'var(--fg-3)' }}>{row.views}</td>
                    <td className="!text-center !px-0">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDownload(row.title)}
                          className="gp-btn gp-btn--secondary gp-btn--sm gap-1 mx-auto"
                        >
                          <Download size={12} />
                          <span>다운로드</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Pagination Area (디자인시스템 gp-pager 적용) */}
        <div className="gp-pager mt-[10px] select-none">
          <button 
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                onShowToast(`이전 페이지로 이동합니다.`);
              }
            }}
            className="nav"
            aria-label="이전"
          >
            ‹ 이전
          </button>
          
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                onShowToast(`${pageNum} 페이지로 이동합니다.`);
              }}
              aria-current={currentPage === pageNum ? "true" : undefined}
            >
              {pageNum}
            </button>
          ))}
          
          <button className="nav" disabled style={{ background: 'transparent', cursor: 'default' }}>…</button>
          
          <button
            onClick={() => {
              setCurrentPage(120);
              onShowToast(`120 페이지로 이동합니다.`);
            }}
            aria-current={currentPage === 120 ? "true" : undefined}
          >
            120
          </button>

          <button 
            onClick={() => {
              if (currentPage < 120) {
                setCurrentPage(currentPage + 1);
                onShowToast(`다음 페이지로 이동합니다.`);
              }
            }}
            className="nav"
            aria-label="다음"
          >
            다음 ›
          </button>
        </div>

      </div>
    </div>
  );
}
