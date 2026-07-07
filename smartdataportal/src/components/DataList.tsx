import React, { useState } from 'react';
import { Search, Filter, RefreshCw, List, LayoutGrid, Download, FilePlus, ExternalLink, ChevronDown, UserPlus, X } from 'lucide-react';
import Checkbox from './Checkbox';

interface DataListProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (page: any) => void;
}

export default function DataList({ onShowToast, onNavigate }: DataListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filterFormat, setFilterFormat] = useState('전체');
  const [filterScope, setFilterScope] = useState('전체');
  const [filterYear, setFilterYear] = useState('전체');
  const [filterCycle, setFilterCycle] = useState('전체');
  const [filterSort, setFilterSort] = useState('최신순');

  const keywords = ['탄소배출', '태양광 발전량', 'DRT', '미세먼지', '침수위험', '공공건물 에너지', '기후변화', '광명역세권'];
  const tabs = ['전체', '에너지', '교통·이동', '환경·기후', '안전·재난', '탄소중립', '공공시설', '시민참여', '행정·정책'];

  const dummyData = [
    { id: 1, title: '신재생 태양광 발전량 데이터', desc: '케빈랩 연계 태양광 발전소의 시간대별 발전량·누적발전량 및 AI 예측 발전량 데이터', sector: '에너지', format: 'API', scope: '공개', cycle: '시간 단위', date: '2026.05.07', views: 1652 },
    { id: 2, title: '친환경 배달 전기이륜차 운행 데이터', desc: '우아한형제들 연계 전기이륜차 라이더 수·이동거리·배달건수 및 BSS 배터리 교환 데이터', sector: '교통·이동', format: 'API', scope: '부분 공개', cycle: '일 단위', date: '2026.05.07', views: 231 },
    { id: 3, title: 'AIoT 우수관로 수위 데이터', desc: '스파이어테크놀로지 연계 맨홀·지표면 수위, 수위레벨 및 홍수 경보등급 실시간 데이터', sector: '안전·재난', format: 'JSON', scope: '공개', cycle: '실시간', date: '2026.05.07', views: 204 },
    { id: 4, title: 'IoT 그린배리어 미세먼지 데이터', desc: '영진기술 연계 미세먼지·초미세먼지 농도 및 온습도·풍향풍속 측정 데이터', sector: '환경·기후', format: 'JSON', scope: '공개', cycle: '시간 단위', date: '2026.05.07', views: 198 },
    { id: 5, title: '광명시 주민등록인구 통계', desc: '정책플랫폼 연계 광명시 행정동별 주민등록 인구·세대 통계 데이터', sector: '행정·정책', format: 'CSV, API', scope: '공개', cycle: '일 단위', date: '2026.05.07', views: 128 },
  ];

  return (
    <div className="w-full bg-white pb-20 font-pretendard-gov">
      {/* Banner */}
      <div 
        className="w-full h-[280px] bg-[#F5F8FC] relative flex items-center mb-[40px] border-b border-[#E6E8EA]"
        style={{
          background: "url('/images/banner_bg_데이터목록.svg') no-repeat right center / cover",
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-0 relative z-10 flex flex-col gap-[8px]">
          <h1 className="text-[40px] font-bold text-[#16243B] font-score">데이터 목록</h1>
          <p className="text-[16px] text-[#5A6878] leading-relaxed font-score">
            광명시 스마트도시 · 탄소중립 데이터를 검색하고, 필요한 데이터를 다운로드하거나 요청할 수 있습니다.<br/>
            에너지, 교통 · 이동, 환경 · 기후, 안전 · 재난, 공공시설 데이터를 한곳에서 확인하세요.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-[1440px] mx-auto px-0 mb-[40px]">
        <div className="w-full border border-[#E6E8EA] rounded-[16px] p-[32px] flex flex-col items-center justify-center bg-white">
          <div className="flex items-center mb-[20px] w-full justify-center">
            <div className="gp-searchfield w-full max-w-[600px]">
              <input 
                type="text" 
                placeholder="데이터명, 키워드, 분야를 입력하세요" 
              />
              <Search className="gp-ico" size={24} />
            </div>
            <button className="gp-btn gp-btn--primary gp-btn--h48 px-[32px] ml-[8px]">검색</button>
            <button 
              className="gp-btn gp-btn--secondary gp-btn--h48 ml-[40px]" style={{ padding: '0 16px' }}
              onClick={() => setIsFilterOpen(true)}
            >
              <img src="/icons/ic_filter.svg" className="gp-ico mr-1.5" alt="filter" /> 상세검색
            </button>
            <button className="gp-btn gp-btn--secondary gp-btn--h48 ml-[16px]" style={{ padding: '0 16px' }}>
              <img src="/icons/ic_reset_20.svg" className="gp-ico mr-1.5" alt="reset" /> 필터 초기화
            </button>
          </div>

          <div className="flex items-center gap-[12px] w-full justify-center">
            <span className="text-[14px] font-bold text-[#16243B] shrink-0 mr-2">추천 검색어</span>
            <div className="flex flex-wrap gap-[8px]">
              {keywords.map(kw => (
                <span key={kw} className="gp-suggest cursor-pointer">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Menu */}
      <div className="max-w-[1440px] mx-auto px-0 mb-[40px]">
        <div className="flex flex-wrap gap-[10px]">
          {tabs.map((tab, i) => (
            <button 
              key={tab} 
              className={`px-[32px] py-[10px] rounded-[8px] border text-[15px] font-medium transition-colors ${
                i === 0 
                  ? 'bg-[var(--gp-primary)] text-white border-[var(--gp-primary)] shadow-sm' 
                  : 'bg-white text-[#5A6878] border-[#E6E8EA] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] w-[564px] max-w-[95vw] p-[32px] shadow-xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-[32px]">
              <h2 className="text-[24px] font-bold text-[#16243B]">상세검색</h2>
              <button 
                onClick={() => { setIsFilterOpen(false); setActiveDropdown(null); }} 
                className="w-[32px] h-[32px] flex items-center justify-center text-[#7C8896] hover:text-[#16243B] hover:bg-[#F5F8FC] rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-[32px] gap-x-[24px] mb-[40px]">
              {/* 포맷 */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-bold text-[#16243B]">파일 포맷</label>
                <div className="relative">
                  <button 
                    className="gp-select-btn gp-select-btn--h48 w-full" 
                    aria-haspopup="listbox" 
                    aria-expanded={activeDropdown === 'format'}
                    onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                  >
                    <span>{filterFormat}</span>
                    <ChevronDown size={16} className="text-[#7C8896]" />
                  </button>
                  {activeDropdown === 'format' && (
                    <div className="gp-dropdown-menu w-full" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                      {['전체', 'CSV', 'XLSX', 'JSON', 'API', 'SHEET', 'PDF'].map(opt => (
                        <button key={opt} className={`gp-dropdown-item ${filterFormat === opt ? 'active' : ''}`} onClick={() => { setFilterFormat(opt); setActiveDropdown(null); }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 공개범위 */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-bold text-[#16243B]">공개범위</label>
                <div className="relative">
                  <button 
                    className="gp-select-btn gp-select-btn--h48 w-full" 
                    aria-haspopup="listbox" 
                    aria-expanded={activeDropdown === 'scope'}
                    onClick={() => setActiveDropdown(activeDropdown === 'scope' ? null : 'scope')}
                  >
                    <span>{filterScope}</span>
                    <ChevronDown size={16} className="text-[#7C8896]" />
                  </button>
                  {activeDropdown === 'scope' && (
                    <div className="gp-dropdown-menu w-full" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                      {['전체', '공개', '부분 공개', '외부 링크'].map(opt => (
                        <button key={opt} className={`gp-dropdown-item ${filterScope === opt ? 'active' : ''}`} onClick={() => { setFilterScope(opt); setActiveDropdown(null); }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 등록년도 */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-bold text-[#16243B]">등록년도</label>
                <div className="relative">
                  <button 
                    className="gp-select-btn gp-select-btn--h48 w-full" 
                    aria-haspopup="listbox" 
                    aria-expanded={activeDropdown === 'year'}
                    onClick={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
                  >
                    <span>{filterYear}</span>
                    <ChevronDown size={16} className="text-[#7C8896]" />
                  </button>
                  {activeDropdown === 'year' && (
                    <div className="gp-dropdown-menu w-full" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                      {['전체', '2026', '2025', '2024'].map(opt => (
                        <button key={opt} className={`gp-dropdown-item ${filterYear === opt ? 'active' : ''}`} onClick={() => { setFilterYear(opt); setActiveDropdown(null); }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 수집주기 */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-bold text-[#16243B]">수집주기</label>
                <div className="relative">
                  <button 
                    className="gp-select-btn gp-select-btn--h48 w-full" 
                    aria-haspopup="listbox" 
                    aria-expanded={activeDropdown === 'cycle'}
                    onClick={() => setActiveDropdown(activeDropdown === 'cycle' ? null : 'cycle')}
                  >
                    <span>{filterCycle}</span>
                    <ChevronDown size={16} className="text-[#7C8896]" />
                  </button>
                  {activeDropdown === 'cycle' && (
                    <div className="gp-dropdown-menu w-full" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                      {['전체', '실시간', '시간 단위', '일 단위', '월 단위', '반기 단위'].map(opt => (
                        <button key={opt} className={`gp-dropdown-item ${filterCycle === opt ? 'active' : ''}`} onClick={() => { setFilterCycle(opt); setActiveDropdown(null); }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* 정렬 */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-bold text-[#16243B]">정렬</label>
                <div className="relative">
                  <button 
                    className="gp-select-btn gp-select-btn--h48 w-full" 
                    aria-haspopup="listbox" 
                    aria-expanded={activeDropdown === 'sort'}
                    onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                  >
                    <span>{filterSort}</span>
                    <ChevronDown size={16} className="text-[#7C8896]" />
                  </button>
                  {activeDropdown === 'sort' && (
                    <div className="gp-dropdown-menu w-full" style={{ display: 'flex', position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                      {['최신순', '조회순', '다운로드순', '데이터명순'].map(opt => (
                        <button key={opt} className={`gp-dropdown-item ${filterSort === opt ? 'active' : ''}`} onClick={() => { setFilterSort(opt); setActiveDropdown(null); }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-[12px]">
              <button 
                onClick={() => { setIsFilterOpen(false); setActiveDropdown(null); }}
                className="gp-btn gp-btn--h48 w-[260px] border border-[#D5D9E0] text-[#36445A] bg-white hover:bg-[#F5F8FC]"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  setIsFilterOpen(false);
                  setActiveDropdown(null);
                  onShowToast("상세검색 필터가 적용되었습니다.");
                }}
                className="gp-btn gp-btn--primary gp-btn--h48 w-[260px]"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="max-w-[1440px] mx-auto px-0 mb-[60px]">
        {/* Table Toolbar */}
        <div className="flex items-end justify-between mb-[16px]">
          <span className="text-[14px] font-normal text-[var(--fg-3)]">총 <b className="font-semibold text-[var(--fg-1)]">128</b>건</span>
          <div className="flex items-center gap-[8px]">
            <button 
              onClick={() => onShowToast("선택하신 데이터를 다운로드합니다.")}
              className="gp-btn gp-btn--h40 gp-btn--ghost"
              style={{ padding: '0 16px' }}
            >
              <img src="/icons/ic_download_16.svg" alt="" className="w-[18px] h-[18px] mr-1.5" /> 선택 다운로드
            </button>
            <button 
              onClick={() => onShowToast("데이터 제공 요청 페이지로 이동합니다.")}
              className="gp-btn gp-btn--h40 gp-btn--ghost"
              style={{ padding: '0 16px' }}
            >
              <img src="/icons/ic_login_16.svg" alt="" className="w-[18px] h-[18px] mr-1.5" /> 데이터 요청
            </button>
            <button 
              onClick={() => window.open('https://www.data.go.kr/', '_blank')}
              className="gp-btn gp-btn--h40 gp-btn--ghost"
              style={{ padding: '0 16px' }}
            >
              <img src="/icons/ic_site_16.svg" alt="" className="w-[18px] h-[18px] mr-1.5" /> 공공데이터 포털 바로가기
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="gp-table-container">
          <table className="gp-table gp-table--datalist">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>선택</th>
                <th style={{ textAlign: 'left' }}>구분</th>
                <th style={{ width: '120px', textAlign: 'center' }}>분야</th>
                <th style={{ width: '120px', textAlign: 'center' }}>형식</th>
                <th style={{ width: '120px', textAlign: 'center' }}>공개범위</th>
                <th style={{ width: '120px', textAlign: 'center' }}>수집주기</th>
                <th style={{ width: '120px', textAlign: 'center' }}>기준일</th>
                <th style={{ width: '100px', textAlign: 'right' }}>조회수</th>
                <th style={{ width: '180px', textAlign: 'center' }}>기능</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F5F8FC]"
                >
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox />
                  </td>
                  <td>
                    <div className="ttl">{item.title}</div>
                    <div className="sub">{item.desc}</div>
                  </td>
                  <td style={{ textAlign: 'center' }} className="text-[15px] text-[#36445A]">
                    {item.sector}
                  </td>
                  <td style={{ textAlign: 'center' }} className="text-[15px] text-[#36445A]">
                    {item.format}
                  </td>
                  <td style={{ textAlign: 'center' }} className="text-[15px] text-[#36445A]">
                    {item.scope}
                  </td>
                  <td style={{ textAlign: 'center' }} className="text-[15px] text-[#36445A]">{item.cycle}</td>
                  <td style={{ textAlign: 'center' }} className="num text-[15px] text-[#5A6878]">{item.date}</td>
                  <td style={{ textAlign: 'right' }} className="num text-[15px] text-[#5A6878]">{item.views}</td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => onShowToast("데이터 다운로드를 시작합니다.")}
                        className="gp-btn gp-btn--sm gp-btn--secondary whitespace-nowrap"
                      >
                        <Download size={14} className="mr-1" /> 다운로드
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="gp-pager mt-[40px]">
          <button className="nav" aria-label="이전">‹ 이전</button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} aria-current={num === 1 ? "true" : undefined}>
              {num}
            </button>
          ))}
          <button className="nav" disabled style={{ background: 'transparent', cursor: 'default' }}>…</button>
          <button>120</button>
          <button className="nav" aria-label="다음">다음 ›</button>
        </div>
      </div>

      {/* Popular Data Section */}
      <div className="max-w-[1440px] mx-auto px-0 mb-[60px]">
        <h2 className="text-[24px] font-bold text-[#16243B] mb-[24px]">많이 찾는 데이터</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Card 1 */}
          <div 
            className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" 
            style={{ boxShadow: 'none' }}
            onClick={() => onShowToast("준비 중인 기능입니다.")}
          >
            <div className="flex gap-4 mb-[32px]">
              <img src="/icons/ic_leaf_2.svg" alt="탄소" className="w-[80px] h-[80px] shrink-0" />
              <div className="flex flex-col">
                <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">탄소배출 현황 데이터</h3>
                <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">광명역세권 탄소배출량과 감축현황을 확인할 수 있는 핵심 데이터</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] px-[24px]">
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                <span className="text-[14px] text-[var(--gp-primary)] font-bold">탄소중립</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                <div className="flex gap-1">
                  <span className="gp-filetag gp-filetag--api">API</span>
                  <span className="gp-filetag gp-filetag--csv">CSV</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">조회수</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">1,245</span>
              </div>
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">다운로드</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">320</span>
              </div>
            </div>
            <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
              상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
            </button>
          </div>

          {/* Card 2 */}
          <div 
            className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" 
            style={{ boxShadow: 'none' }}
            onClick={() => onShowToast("준비 중인 기능입니다.")}
          >
            <div className="flex gap-4 mb-[32px]">
              <img src="/icons/ic_bus_2.svg" alt="교통" className="w-[80px] h-[80px] shrink-0" />
              <div className="flex flex-col">
                <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">광명역세권 교통량 데이터</h3>
                <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">주요 도로와 DRT 운행현황을 비교할 수 있는 교통 데이터</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] px-[24px]">
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                <span className="text-[14px] text-[#1AAA5E] font-bold">교통·이동</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                <div className="flex gap-1">
                  <span className="gp-filetag gp-filetag--api">API</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">조회수</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">968</span>
              </div>
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">다운로드</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">256</span>
              </div>
            </div>
            <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
              상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
            </button>
          </div>

          {/* Card 3 */}
          <div 
            className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" 
            style={{ boxShadow: 'none' }}
            onClick={() => onShowToast("준비 중인 기능입니다.")}
          >
            <div className="flex gap-4 mb-[32px]">
              <img src="/icons/ic_building_2.svg" alt="에너지" className="w-[80px] h-[80px] shrink-0" />
              <div className="flex flex-col">
                <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">공공건물 에너지 사용 데이터</h3>
                <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">공공건물의 월별 에너지 사용량과 월간 현황 데이터</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] px-[24px]">
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                <span className="text-[14px] text-[#ED8B16] font-bold">에너지·건물</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                <div className="flex gap-1">
                  <span className="gp-filetag gp-filetag--csv">CSV</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">조회수</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">1,245</span>
              </div>
              <div className="flex items-center gap-1 text-[#5A6878]">
                <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                <span className="text-[14px]">다운로드</span>
                <span className="text-[15px] font-bold text-[#16243B] ml-1">320</span>
              </div>
            </div>
            <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
              상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="max-w-[1440px] mx-auto px-0">
        <div className="w-full h-[150px] bg-[#EBF3FC] rounded-[16px] flex items-center justify-between px-[60px]">
          <div className="flex items-center gap-[24px]">
            <img src="/images/img_document_hq.png" alt="document" className="w-[170px] h-[138px] object-contain" />
            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold text-[var(--gp-primary)] mb-[6px]">필요한 데이터가 없으신가요?</h3>
              <p className="text-[16px] text-[#5A6878]">공개되지 않은 데이터는 관리자 검토 후 제공 가능 여부를 안내합니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-[16px]">
            <button 
              onClick={() => onShowToast("데이터 요청 페이지로 이동합니다.")}
              className="gp-btn gp-btn--lg gp-btn--primary"
            >
              데이터 요청하기
            </button>
            <button 
              onClick={() => window.open('https://www.data.go.kr/', '_blank')}
              className="gp-btn gp-btn--lg bg-white border border-[var(--gp-primary)] text-[var(--gp-primary)] hover:bg-[var(--gp-primary-soft)]"
            >
              공공데이터포털 바로가기 <img src="/icons/ic_external.svg" alt="external" className="w-[20px] h-[20px] ml-1" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
