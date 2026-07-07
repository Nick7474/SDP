import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';
import SortSelect from './SortSelect';

interface AdminArchiveProps {
  onShowToast?: (msg: string) => void;
  registerOpen?: boolean;
  onCloseRegister?: () => void;
}

const summary = [
  { label: '전체 자료', value: '86건' },
  { label: '공개', value: '72건' },
  { label: '비공개', value: '14건' },
  { label: '첨부파일', value: '98개' },
];

interface Row {
  no: number;
  type: string;
  title: string;
  fileName: string;
  format: string;
  status: '공개' | '비공개';
  downloads: number;
  created: string;
}

const rows: Row[] = [
  { no: 86, type: '이용 가이드', title: '광명 스마트데이터포털 서비스 정기 점검 안내', fileName: 'ecoview_guide.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 85, type: '데이터 목록', title: '데이터 목록 명세서 (2026.05)', fileName: 'data_catalog_202605.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 84, type: '보고서', title: '광명시 에너지 운영 리포트 (2025년 1분기)', fileName: 'energy_report.pdf', format: 'PDF', status: '비공개', downloads: 127, created: '2026.05.20' },
  { no: 83, type: '서식', title: '서비스 신청서 (기관용)', fileName: 'service_report.pdf', format: 'PDF', status: '비공개', downloads: 127, created: '2026.05.20' },
  { no: 82, type: '매뉴얼', title: '관리자 매뉴얼 v2.1', fileName: 'admin_manual.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 81, type: '기타', title: '플랫폼 API 연동가이드', fileName: 'api_integration.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 80, type: '보고서', title: '광명시 에너지 운영 리포트 (2025년 1분기)', fileName: 'ecoview_guide.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 79, type: '서식', title: '서비스 신청서 (기관용)', fileName: 'ecoview_guide.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 78, type: '이용 가이드', title: '광명 스마트데이터포털 서비스 정기 점검 안내', fileName: 'ecoview_guide.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
  { no: 77, type: '매뉴얼', title: '관리자 매뉴얼 v2.1', fileName: 'admin_manual.pdf', format: 'PDF', status: '공개', downloads: 127, created: '2026.05.20' },
];

const statusBadge = (status: string) =>
  status === '공개' ? 'bg-[#EAF6EC] text-[#3FA654]' : 'bg-[#F4F5F6] text-[#58616A]';

export default function AdminArchive({ onShowToast, registerOpen, onCloseRegister }: AdminArchiveProps) {
  const [activePage, setActivePage] = useState(1);
  const [editTarget, setEditTarget] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('전체');
  const [formatF, setFormatF] = useState('전체');
  const closeModal = () => { setEditTarget(null); onCloseRegister?.(); };

  const q = search.trim();
  const filtered = rows.filter(r =>
    (typeF === '전체' || r.type === typeF) &&
    (formatF === '전체' || r.format === formatF) &&
    (q === '' || r.title.includes(q) || r.fileName.includes(q))
  );
  const reset = () => { setSearch(''); setTypeF('전체'); setFormatF('전체'); };

  return (
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
          <input type="text" placeholder="자료실, 설명 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="자료 유형" width="w-[130px]" options={['전체', '이용 가이드', '데이터 목록', '보고서', '서식', '매뉴얼', '기타']} value={typeF} onChange={setTypeF} />
          <FilterSelect label="파일 형식" width="w-[120px]" options={['전체', 'PDF', 'HWP', 'DOCX', 'XLSX', 'ZIP']} value={formatF} onChange={setFormatF} />
          <DateRangePicker label="등록기간" />
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
            <span className="w-[110px] px-[12px]">자료 유형</span>
            <span className="flex-1 px-[12px] min-w-0">제목</span>
            <span className="w-[180px] px-[12px]">파일명</span>
            <span className="w-[90px] px-[8px] text-center">파일형식</span>
            <span className="w-[90px] px-[8px] text-center">상태</span>
            <span className="w-[100px] px-[8px] text-center">다운로드 수</span>
            <span className="w-[110px] px-[8px] text-center">등록일</span>
            <span className="w-[150px] px-[8px] text-center">관리</span>
          </div>
          {filtered.map((row, idx) => (
            <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
              <span className="w-[52px] flex justify-center"><Checkbox /></span>
              <span className="w-[60px] px-[8px] text-center">{row.no}</span>
              <span className="w-[110px] px-[12px] truncate">{row.type}</span>
              <span onClick={() => setEditTarget(row)} className="flex-1 px-[12px] min-w-0 truncate cursor-pointer hover:text-[var(--gp-primary)] hover:underline">{row.title}</span>
              <span className="w-[180px] px-[12px] truncate text-[#464C53]">{row.fileName}</span>
              <span className="w-[90px] px-[8px] text-center text-[#464C53]">{row.format}</span>
              <span className="w-[90px] px-[8px] flex justify-center">
                <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
              </span>
              <span className="w-[100px] px-[8px] text-center text-[#464C53]">{row.downloads}</span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.created}</span>
              <span className="w-[150px] px-[8px] flex items-center justify-center gap-[6px] text-[13px]">
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">보기</button>
                <span className="text-[#CDD1D5]">·</span>
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">수정</button>
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

      {/* 등록 / 수정 모달 */}
      {(registerOpen || editTarget) && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            key={editTarget ? `edit-${editTarget.no}` : 'create'}
            className="bg-white rounded-[12px] w-[520px] max-w-full p-[24px] relative animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[24px]">
              <h2 className="text-[20px] font-bold text-[#131416]">{editTarget ? '수정하기' : '등록하기'}</h2>
              <button onClick={closeModal} className="text-[#8A949E] hover:text-[#131416]" aria-label="닫기">
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-[16px] mb-[28px] text-[14px]">
              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">제목</span>
                <input type="text" placeholder="자료 제목을 입력하세요" defaultValue={editTarget?.title} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">자료 유형</span>
                <button onClick={() => onShowToast?.('자료 유형 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.type ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">파일 형식</span>
                <button onClick={() => onShowToast?.('파일 형식 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.format ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">상태</span>
                <button onClick={() => onShowToast?.('상태 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.status ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">첨부파일</span>
                <div className="flex-1 flex items-center h-[44px] rounded-[8px] border border-[#CDD1D5] overflow-hidden">
                  <button onClick={() => onShowToast?.('파일 선택은 준비 중입니다.')} className="h-full px-[16px] bg-[#F4F5F6] border-r border-[#CDD1D5] text-[14px] font-medium text-[#464C53] hover:bg-[#ECEEF0] transition-colors shrink-0">파일 선택</button>
                  <span className={`px-[14px] text-[14px] ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>{editTarget?.fileName ?? '선택된 파일 없음'}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-[12px]">
              <button
                onClick={closeModal}
                className="flex-1 h-[48px] rounded-[8px] border border-[var(--gp-primary)] bg-white text-[16px] font-semibold text-[var(--gp-primary)] hover:bg-[var(--gp-primary-soft)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { onShowToast?.(editTarget ? '저장되었습니다.' : '등록되었습니다.'); closeModal(); }}
                className="flex-1 h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
              >
                {editTarget ? '저장' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
