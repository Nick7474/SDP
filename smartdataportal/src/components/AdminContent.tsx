import { useState } from 'react';
import { Plus, Search, ChevronDown, Calendar, Paperclip } from 'lucide-react';
import AdminNoticeForm from './AdminNoticeForm';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';
import AdminArchive from './AdminArchive';
import AdminDataList from './AdminDataList';
import AdminPopup from './AdminPopup';
import AdminPlatform from './AdminPlatform';
import DateRangePicker from './DateRangePicker';
import SortSelect from './SortSelect';

interface AdminContentProps {
  onShowToast?: (msg: string) => void;
  onTabChange?: (tab: string) => void;
}

const tabs = ['공지사항 관리', '자료실 관리', '데이터목록 관리', '팝업 · 배너 관리', '연관플랫폼 관리'];

const summary = [
  { label: '전체 공지', value: '128건' },
  { label: '게시중', value: '24건' },
  { label: '비공개', value: '5건' },
  { label: '중요 공지', value: '3건' },
];

interface Row {
  no: number;
  cat: string;
  title: string;
  status: '게시중' | '공개' | '비공개';
  important: boolean;
  file: boolean;
  created: string;
  updated: string;
}

const rows: Row[] = [
  { no: 128, cat: '중요', title: '광명 스마트데이터포털 서비스 정기 점검 안내', status: '게시중', important: true, file: true, created: '2026.05.20', updated: '2026.05.20' },
  { no: 127, cat: '데이터 갱신', title: '데이터지도 Energy Mile 지표 갱신 안내', status: '공개', important: false, file: true, created: '2026.05.20', updated: '2026.05.20' },
  { no: 126, cat: '이용 안내', title: '연관플랫폼 외부 링크 이동 안내', status: '비공개', important: false, file: false, created: '2026.05.20', updated: '2026.05.20' },
  { no: 125, cat: '공지', title: '개인탄소저감활동 페이지 이용 안내', status: '비공개', important: false, file: false, created: '2026.05.20', updated: '2026.05.20' },
  { no: 124, cat: '공지', title: '시스템 점검에 따른 서비스 일시 중단 안내', status: '비공개', important: false, file: false, created: '2026.05.20', updated: '2026.05.20' },
  { no: 123, cat: '안내', title: '개인정보처리방침 변경 안내', status: '비공개', important: true, file: true, created: '2026.05.20', updated: '2026.05.20' },
  { no: 123, cat: '데이터 갱신', title: '데이터 시각화 인구지표 업데이트 안내', status: '게시중', important: true, file: true, created: '2026.05.20', updated: '2026.05.20' },
  { no: 122, cat: '안내', title: '개인정보처리방침 변경 안내', status: '게시중', important: false, file: false, created: '2026.05.20', updated: '2026.05.20' },
  { no: 121, cat: '서비스 안내', title: '모바일 웹 서비스 개선 사항 안내', status: '비공개', important: false, file: true, created: '2026.05.20', updated: '2026.05.20' },
  { no: 120, cat: '안내', title: '개인정보처리방침 변경 안내', status: '비공개', important: false, file: true, created: '2026.05.20', updated: '2026.05.20' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case '게시중': return 'bg-[#ECF2FE] text-[#0B50D0]';
    case '공개': return 'bg-[#EAF6EC] text-[#3FA654]';
    case '비공개':
    default: return 'bg-[#F4F5F6] text-[#58616A]';
  }
};

export default function AdminContent({ onShowToast, onTabChange }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState('공지사항 관리');
  const [activePage, setActivePage] = useState(1);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [popupRegisterOpen, setPopupRegisterOpen] = useState(false);
  const [dataRegisterOpen, setDataRegisterOpen] = useState(false);
  const [archiveRegisterOpen, setArchiveRegisterOpen] = useState(false);
  const [platformRegisterOpen, setPlatformRegisterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catF, setCatF] = useState('전체');
  const [statusF, setStatusF] = useState('전체');

  const q = search.trim();
  const filtered = rows.filter(r =>
    (catF === '전체' || r.cat === catF) &&
    (statusF === '전체' || r.status === statusF) &&
    (q === '' || r.title.includes(q))
  );
  const reset = () => { setSearch(''); setCatF('전체'); setStatusF('전체'); };

  const openEdit = (row: Row) => { setEditRow(row); setView('edit'); };

  const registerLabel =
    activeTab === '공지사항 관리' ? '공지 등록'
    : activeTab === '자료실 관리' ? '자료 등록'
    : activeTab === '데이터목록 관리' ? '데이터 등록'
    : activeTab === '팝업 · 배너 관리' ? '팝업 · 배너 등록'
    : activeTab === '연관플랫폼 관리' ? '플랫폼 등록'
    : '등록';

  if (view === 'create') {
    return <AdminNoticeForm onShowToast={onShowToast} onBack={() => setView('list')} />;
  }

  if (view === 'edit' && editRow) {
    return (
      <AdminNoticeForm
        mode="edit"
        initial={{
          title: editRow.title,
          category: editRow.cat,
          important: editRow.important,
          fileName: editRow.file ? 'img.png' : undefined,
          content: editRow.title,
          noPeriod: true,
        }}
        onShowToast={onShowToast}
        onBack={() => setView('list')}
      />
    );
  }

  return (
    <main className="flex-1 p-[32px] flex flex-col gap-[24px] bg-white">
      {/* Title row */}
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[28px] font-bold text-[#1E2124]">콘텐츠 관리</h1>
          <p className="text-[16px] text-[#464C53]">공지사항, 자료실, 데이터 목록, 팝업 · 배너, 연관플랫폼 콘텐츠를 통합 관리합니다.</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === '공지사항 관리') setView('create');
            else if (activeTab === '팝업 · 배너 관리') setPopupRegisterOpen(true);
            else if (activeTab === '데이터목록 관리') setDataRegisterOpen(true);
            else if (activeTab === '자료실 관리') setArchiveRegisterOpen(true);
            else if (activeTab === '연관플랫폼 관리') setPlatformRegisterOpen(true);
            else onShowToast?.(`'${registerLabel}' 화면은 준비 중입니다.`);
          }}
          className="h-[48px] px-[20px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold flex items-center gap-[6px] shrink-0 hover:bg-[var(--gp-primary-strong)] transition-colors"
        >
          <Plus size={18} /> {registerLabel}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CDD1D5]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); onTabChange?.(tab); }}
            className={`h-[44px] px-[24px] text-[16px] -mb-px border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#0B50D0] text-[#0B50D0] font-bold'
                : 'border-transparent text-[#B1B8BE] font-medium hover:text-[var(--gp-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '공지사항 관리' && (
      <>
      {/* Summary bar */}
      <div className="flex items-center gap-[24px] bg-[#F4F5F6] rounded-[8px] px-[24px] py-[16px]">
        {summary.map((s, idx) => (
          <div key={s.label} className="flex items-center gap-[24px]">
            {idx > 0 && <span className="w-px h-[14px] bg-[#CDD1D5]" />}
            <span className="flex items-center gap-[8px] text-[14px] text-[#464C53]">
              {s.label} <b className="text-[#0B50D0] font-semibold">{s.value}</b>
            </span>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-[16px] flex-wrap">
        <div className="gp-searchfield" style={{ flex: '0 0 350px', width: '350px' }}>
          <input type="text" placeholder="제목,내용 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="구분" width="w-[130px]" options={['전체', '중요', '데이터 갱신', '이용 안내', '공지', '안내', '서비스 안내']} value={catF} onChange={setCatF} />
          <FilterSelect label="상태" width="w-[110px]" options={['전체', '게시중', '공개', '비공개']} value={statusF} onChange={setStatusF} />
          <DateRangePicker label="기간 선택" />
          <div className="flex items-center gap-[12px] ml-[24px]">
            <button
              onClick={() => onShowToast?.('검색 결과를 불러왔습니다.')}
              className="h-[48px] px-[28px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
            >
              검색
            </button>
            <button
              onClick={reset}
              className="h-[48px] px-[20px] rounded-[8px] border border-[#CDD1D5] bg-white text-[16px] font-medium text-[#464C53] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] mt-[8px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-[16px] text-[#1E2124]">총 <b className="font-semibold">{filtered.length}</b>건</span>
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => onShowToast?.('선택한 항목을 삭제합니다.')}
            className="h-[40px] px-[16px] rounded-[8px] border border-[#CDD1D5] bg-white text-[14px] font-medium text-[#464C53] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
          >
            선택 삭제
          </button>
          <SortSelect />
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#E6E8EA] rounded-[4px] overflow-hidden">
        <div className="flex bg-[#F4F5F6] h-[44px] items-center text-[14px] font-semibold text-[#131416]">
          <span className="w-[52px] flex justify-center"><Checkbox /></span>
          <span className="w-[60px] px-[8px] text-center">번호</span>
          <span className="w-[110px] px-[12px]">구분</span>
          <span className="flex-1 px-[12px] min-w-0">제목</span>
          <span className="w-[90px] px-[8px] text-center">상태</span>
          <span className="w-[70px] px-[8px] text-center">중요</span>
          <span className="w-[64px] px-[8px] text-center">첨부</span>
          <span className="w-[110px] px-[8px] text-center">등록일</span>
          <span className="w-[110px] px-[8px] text-center">수정일</span>
          <span className="w-[150px] px-[8px] text-center">관리</span>
        </div>
        {filtered.map((row, idx) => (
          <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
            <span className="w-[52px] flex justify-center"><Checkbox /></span>
            <span className="w-[60px] px-[8px] text-center">{row.no}</span>
            <span className="w-[110px] px-[12px] truncate">{row.cat}</span>
            <span onClick={() => openEdit(row)} className="flex-1 px-[12px] min-w-0 truncate cursor-pointer hover:text-[var(--gp-primary)] hover:underline">{row.title}</span>
            <span className="w-[90px] px-[8px] flex justify-center">
              <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
            </span>
            <span className={`w-[70px] px-[8px] text-center ${row.important ? 'font-semibold text-[#1E2124]' : 'text-[#8A949E]'}`}>{row.important ? '예' : '아니오'}</span>
            <span className="w-[64px] px-[8px] flex justify-center">
              {row.file ? <Paperclip size={16} className="text-[#5A6878]" /> : <span className="text-[#8A949E]">-</span>}
            </span>
            <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.created}</span>
            <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.updated}</span>
            <span className="w-[150px] px-[8px] flex items-center justify-center gap-[6px] text-[13px]">
              <button onClick={() => onShowToast?.(`'${row.title}' 보기`)} className="text-[#0B50D0] hover:underline">보기</button>
              <span className="text-[#CDD1D5]">·</span>
              <button onClick={() => openEdit(row)} className="text-[#0B50D0] hover:underline">수정</button>
              <span className="text-[#CDD1D5]">·</span>
              <button onClick={() => onShowToast?.(`'${row.title}' 삭제`)} className="text-[#DE3412] hover:underline">삭제</button>
            </span>
          </div>
        ))}
      </div>

      </div>

      {/* Pagination */}
      <div className="gp-pager mt-[8px]">
        <button className="nav" aria-label="이전" onClick={() => setActivePage(p => Math.max(1, p - 1))}>‹ 이전</button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} aria-current={activePage === num ? 'true' : undefined} onClick={() => setActivePage(num)}>{num}</button>
        ))}
        <button className="nav" disabled style={{ background: 'transparent', cursor: 'default' }}>…</button>
        <button aria-current={activePage === 120 ? 'true' : undefined} onClick={() => setActivePage(120)}>120</button>
        <button className="nav" aria-label="다음" onClick={() => setActivePage(p => Math.min(120, p + 1))}>다음 ›</button>
      </div>
      </>
      )}

      {activeTab === '자료실 관리' && (
        <AdminArchive
          onShowToast={onShowToast}
          registerOpen={archiveRegisterOpen}
          onCloseRegister={() => setArchiveRegisterOpen(false)}
        />
      )}

      {activeTab === '데이터목록 관리' && (
        <AdminDataList
          onShowToast={onShowToast}
          registerOpen={dataRegisterOpen}
          onCloseRegister={() => setDataRegisterOpen(false)}
        />
      )}

      {activeTab === '팝업 · 배너 관리' && (
        <AdminPopup
          onShowToast={onShowToast}
          registerOpen={popupRegisterOpen}
          onCloseRegister={() => setPopupRegisterOpen(false)}
        />
      )}

      {activeTab === '연관플랫폼 관리' && (
        <AdminPlatform
          onShowToast={onShowToast}
          registerOpen={platformRegisterOpen}
          onCloseRegister={() => setPlatformRegisterOpen(false)}
        />
      )}
    </main>
  );
}
