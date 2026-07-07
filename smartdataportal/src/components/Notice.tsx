import { useState } from 'react';
import { Search, Paperclip, ChevronDown } from 'lucide-react';

interface NoticeProps {
  onShowToast?: (msg: string) => void;
  onNavigate?: (page: any) => void;
}

interface NoticeRow {
  no: number;
  pinned?: boolean;
  category: string;
  title: string;
  hasFile: boolean;
  date: string;
  views: number;
}

const FILTER_TABS = ['전체', '공지', '서비스 점검', '데이터 갱신', '이용안내', '정책 안내'];
const SORT_OPTIONS = ['최신순', '조회순', '제목순'];

const NOTICE_ROWS: NoticeRow[] = [
  { no: 100, pinned: true, category: '서비스 점검', title: '광명 스마트데이터포털 서비스 정기 점검 안내', hasFile: true, date: '2026-06-05', views: 1245 },
  { no: 99, category: '데이터 갱신', title: '데이터 시각화 Energy Mile 지표 갱신 안내', hasFile: true, date: '2026-06-05', views: 128 },
  { no: 98, category: '이용안내', title: '연관플랫폼 외부 링크 이동 안내', hasFile: false, date: '2026-06-05', views: 128 },
  { no: 97, category: '공지', title: '개인탄소저감활동 페이지 이용 안내', hasFile: false, date: '2026-06-05', views: 325 },
  { no: 96, category: '서비스 점검', title: '광명 스마트데이터포털 데이터목록 API 점검 안내', hasFile: true, date: '2026-06-05', views: 516 },
  { no: 95, category: '데이터 갱신', title: '강소형스마트도시 광명 사업소개 자료 업데이트 안내', hasFile: true, date: '2026-06-05', views: 128 },
  { no: 94, category: '정책 안내', title: '탄소중립 스마트도시 데이터 제공 기준 안내', hasFile: true, date: '2026-06-05', views: 402 },
  { no: 93, category: '공지', title: '광명 스마트데이터포털 이용 가이드 안내', hasFile: false, date: '2026-06-05', views: 655 },
  { no: 92, category: '데이터 갱신', title: '데이터 시각화 Energy Mile 지표 갱신 안내', hasFile: false, date: '2026-06-05', views: 128 },
  { no: 91, category: '데이터 갱신', title: '강소형스마트도시 광명 사업소개 자료 업데이트 안내', hasFile: true, date: '2026-06-05', views: 128 },
];

export default function Notice({ onShowToast, onNavigate }: NoticeProps) {
  const [activeTab, setActiveTab] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('최신순');
  const [sortOpen, setSortOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const rows = activeTab === '전체'
    ? NOTICE_ROWS
    : NOTICE_ROWS.filter(r => r.category === activeTab);

  return (
    <div className="w-full bg-white pb-20 font-pretendard-gov">
      {/* Hero Banner */}
      <div
        className="w-full h-[280px] relative flex items-center mb-[40px] border-b border-[#E6E8EA]"
        style={{
          background: "url('/images/banner_bg_공지사항.svg') no-repeat right center / auto 100%",
          backgroundColor: '#F3F7FF',
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-0 relative z-10 flex flex-col gap-[8px]">
          <h1 className="text-[40px] font-bold text-[#16243B] font-score">공지사항</h1>
          <p className="text-[16px] text-[#5A6878] leading-relaxed font-score">
            광명 스마트데이터포털의 주요 소식, 서비스 점검, 데이터 갱신 및 운영 안내를 확인하세요.<br />
            중요한 안내와 최신 공지를 빠르게 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Search + Filter Card */}
      <div className="max-w-[1440px] mx-auto px-0 mb-[32px]">
        <div className="w-full border border-[#E6E8EA] rounded-[12px] bg-white px-[32px] py-[39px] flex flex-col items-center gap-[32px]">
          {/* Search row */}
          <div className="flex items-center gap-[8px] w-full justify-center">
            <div className="gp-searchfield w-full max-w-[560px]">
              <input
                type="text"
                placeholder="자료명을 검색하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onShowToast?.(`'${keyword || '전체'}' 검색 결과를 불러왔습니다.`); }}
              />
              <Search className="gp-ico" size={20} />
            </div>
            <button
              onClick={() => onShowToast?.(`'${keyword || '전체'}' 검색 결과를 불러왔습니다.`)}
              className="gp-btn gp-btn--primary gp-btn--h48 shrink-0"
              style={{ padding: '0 40px' }}
            >
              검색
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-[12px]">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setActivePage(1); }}
                className={`px-[32px] py-[8px] rounded-[8px] border text-[16px] transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--gp-primary)] text-white border-[var(--gp-primary)] font-semibold'
                    : 'bg-white text-[#464C53] border-[#CDD1D5] font-normal hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="max-w-[1440px] mx-auto px-0">
        <div className="flex items-end justify-between mb-[16px]">
          <span className="text-[16px] font-normal text-[#1E2124]">
            총 <b className="font-medium">{rows.length}</b> 건
          </span>
          <div className="relative">
            <button
              className="gp-select-btn gp-select-btn--h48 w-[120px]"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen(!sortOpen)}
            >
              <span className="text-[#131416] font-normal whitespace-nowrap">{sort}</span>
              <ChevronDown size={20} className="text-[#7C8896] shrink-0" />
            </button>
            {sortOpen && (
              <div className="gp-dropdown-menu" style={{ display: 'flex', minWidth: '96px' }}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`gp-dropdown-item ${sort === opt ? 'active' : ''}`}
                    onClick={() => { setSort(opt); setSortOpen(false); }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="gp-table-container">
          <table className="gp-table">
            <thead>
              <tr>
                <th style={{ width: '88px', textAlign: 'center', whiteSpace: 'nowrap' }}>번호</th>
                <th style={{ width: '180px', textAlign: 'left' }}>구분</th>
                <th style={{ textAlign: 'left' }}>제목</th>
                <th style={{ width: '140px', textAlign: 'center' }}>첨부</th>
                <th style={{ width: '170px', textAlign: 'left' }}>등록일</th>
                <th style={{ width: '140px', textAlign: 'left' }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.no}-${row.title}`}
                  className="cursor-pointer"
                  onClick={() => onNavigate ? onNavigate('noticeDetail') : onShowToast?.(`'${row.title}' 상세 내용을 불러왔습니다.`)}
                >
                  <td style={{ textAlign: 'center' }}>
                    {row.pinned ? (
                      <img src="/icons/ic_pin.svg" alt="공지" width={24} height={24} className="inline-block w-[24px] h-[24px]" />
                    ) : (
                      <span className="text-[#555]">{row.no}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'left' }} className="text-[#555]">{row.category}</td>
                  <td style={{ textAlign: 'left' }} className="text-[#555]">{row.title}</td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasFile ? (
                      <Paperclip size={18} className="inline-block text-[#5A6878]" />
                    ) : (
                      <span className="text-[#1E2124]">-</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'left' }} className="text-[#555]">{row.date}</td>
                  <td style={{ textAlign: 'left' }} className="text-[#555]">{row.views.toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }} className="text-[#7C8896] py-[40px]">
                    해당 분류의 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="gp-pager mt-[32px]">
          <button className="nav" aria-label="이전" onClick={() => setActivePage(p => Math.max(1, p - 1))}>‹ 이전</button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              aria-current={activePage === num ? "true" : undefined}
              onClick={() => setActivePage(num)}
            >
              {num}
            </button>
          ))}
          <button className="nav" disabled style={{ background: 'transparent', cursor: 'default' }}>…</button>
          <button aria-current={activePage === 120 ? "true" : undefined} onClick={() => setActivePage(120)}>120</button>
          <button className="nav" aria-label="다음" onClick={() => setActivePage(p => Math.min(120, p + 1))}>다음 ›</button>
        </div>
      </div>
    </div>
  );
}
