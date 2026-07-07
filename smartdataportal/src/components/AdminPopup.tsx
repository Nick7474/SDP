import { useState } from 'react';
import { Search, ChevronDown, Calendar, X } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';
import DatePicker from './DatePicker';

interface AdminPopupProps {
  onShowToast?: (msg: string) => void;
  registerOpen?: boolean;
  onCloseRegister?: () => void;
}

const summary = [
  { label: '전체 항목', value: '12건' },
  { label: '노출중', value: '3건' },
  { label: '종료 예정', value: '2건' },
  { label: '숨김', value: '5개' },
];

interface Row {
  no: number;
  title: string;
  position: string;
  status: '노출' | '숨김' | '종료';
  start: string;
  end: string;
  link: string;
}

const rows: Row[] = [
  { no: 99, title: '메인 화면 안내 배너', position: '메인 상단', status: '노출', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 98, title: '서비스 정기 점검 안내', position: '전체 화면 팝업', status: '노출', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 97, title: '기후의병 참여 안내', position: '메인 중단', status: '숨김', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 96, title: '연관플랫폼 이용 안내', position: '공지사항 상단', status: '숨김', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 95, title: '데이터목록 이용 가이드', position: '메인 하단', status: '노출', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 94, title: '모바일 앱 서비스 출시 안내', position: '메인 상단', status: '노출', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 93, title: '광명시 데이터 리포트 안내', position: '전체 화면 팝업', status: '종료', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 92, title: '설문조사 참여 이벤트', position: '메인 상단', status: '숨김', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 91, title: '브라우저 지원 종료 안내', position: '메인 상단', status: '종료', start: '2026.05.01', end: '2026.05.30', link: '있음' },
  { no: 90, title: '신규 데이터셋 오픈 안내', position: '메인 상단', status: '숨김', start: '2026.05.01', end: '2026.05.30', link: '있음' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case '노출': return 'bg-[#EAF6EC] text-[#3FA654]';
    case '종료': return 'bg-[#E2E5E9] text-[#464C53]';
    case '숨김':
    default: return 'bg-[#F4F5F6] text-[#8A949E]';
  }
};

export default function AdminPopup({ onShowToast, registerOpen, onCloseRegister }: AdminPopupProps) {
  const [activePage, setActivePage] = useState(1);
  const [previewRow, setPreviewRow] = useState<Row | null>(null);
  const [editTarget, setEditTarget] = useState<Row | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('전체');
  const [posF, setPosF] = useState('전체');
  const [statusF, setStatusF] = useState('전체');
  const closeModal = () => { setEditTarget(null); onCloseRegister?.(); };

  const typeOf = (p: string) => (p.includes('팝업') ? '팝업' : '배너');
  const q = search.trim();
  const filtered = rows.filter(r =>
    (typeF === '전체' || typeOf(r.position) === typeF) &&
    (posF === '전체' || r.position === posF) &&
    (statusF === '전체' || r.status === statusF) &&
    (q === '' || r.title.includes(q))
  );
  const reset = () => { setSearch(''); setTypeF('전체'); setPosF('전체'); setStatusF('전체'); };

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
          <input type="text" placeholder="배너명 또는 팝업명 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="유형" width="w-[110px]" options={['전체', '팝업', '배너']} value={typeF} onChange={setTypeF} />
          <FilterSelect label="노출 위치" width="w-[150px]" options={['전체', '메인 상단', '메인 중단', '메인 하단', '전체 화면 팝업', '공지사항 상단']} value={posF} onChange={setPosF} />
          <FilterSelect label="상태" width="w-[110px]" options={['전체', '노출', '숨김', '종료']} value={statusF} onChange={setStatusF} />
          <DateRangePicker label="게시기간" />
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
          <button
            onClick={() => onShowToast?.('선택한 항목을 삭제합니다.')}
            className="h-[40px] px-[16px] rounded-[8px] border border-[#CDD1D5] bg-white text-[14px] font-medium text-[#464C53] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
          >
            선택 삭제
          </button>
        </div>

        {/* Table */}
        <div className="border border-[#E6E8EA] rounded-[4px] overflow-hidden">
          <div className="flex bg-[#F4F5F6] h-[44px] items-center text-[14px] font-semibold text-[#131416]">
            <span className="w-[52px] flex justify-center"><Checkbox /></span>
            <span className="w-[60px] px-[8px] text-center">번호</span>
            <span className="flex-1 px-[12px] min-w-0">제목</span>
            <span className="w-[140px] px-[12px]">노출 위치</span>
            <span className="w-[90px] px-[8px] text-center">노출 상태</span>
            <span className="w-[110px] px-[8px] text-center">게시 시작일</span>
            <span className="w-[110px] px-[8px] text-center">게시 종료일</span>
            <span className="w-[70px] px-[8px] text-center">링크</span>
            <span className="w-[150px] px-[8px] text-center">관리</span>
          </div>
          {filtered.map((row, idx) => (
            <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
              <span className="w-[52px] flex justify-center"><Checkbox /></span>
              <span className="w-[60px] px-[8px] text-center">{row.no}</span>
              <span className="flex-1 px-[12px] min-w-0 truncate">{row.title}</span>
              <span className="w-[140px] px-[12px] truncate text-[#464C53]">{row.position}</span>
              <span className="w-[90px] px-[8px] flex justify-center">
                <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
              </span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.start}</span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.end}</span>
              <span className="w-[70px] px-[8px] text-center text-[#464C53]">{row.link}</span>
              <span className="w-[150px] px-[8px] flex items-center justify-center gap-[6px] text-[13px]">
                <button onClick={() => setPreviewRow(row)} className="text-[#0B50D0] hover:underline">보기</button>
                <span className="text-[#CDD1D5]">·</span>
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">수정</button>
                <span className="text-[#CDD1D5]">·</span>
                <button onClick={() => setDeleteTarget(row)} className="text-[#DE3412] hover:underline">삭제</button>
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

      {/* 미리보기 모달 */}
      {previewRow && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPreviewRow(null)}
        >
          <div
            className="bg-white rounded-[12px] w-[520px] max-w-full p-[24px] relative animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[20px]">
              <h2 className="text-[20px] font-bold text-[#131416]">미리보기</h2>
              <button onClick={() => setPreviewRow(null)} className="text-[#8A949E] hover:text-[#131416]" aria-label="닫기">
                <X size={22} />
              </button>
            </div>

            {/* 배너 미리보기 */}
            <div className="rounded-[8px] overflow-hidden border border-[#E6E8EA] mb-[20px]">
              <div className="relative h-[160px] bg-gradient-to-r from-[#EAF2FE] to-[#D8E9FB] flex items-center">
                <div className="relative z-10 pl-[22px] pr-[10px]">
                  <p className="text-[16px] font-bold text-[#0B3B7A] leading-snug">데이터로 보는<br />광명 탄소중립 스마트 도시</p>
                  <button className="mt-[10px] h-[26px] px-[12px] rounded-[4px] bg-[var(--gp-primary)] text-white text-[11px] font-medium">자세히 보기</button>
                </div>
                <img src="/images/popup_preview_map.png" alt="배너 미리보기" className="absolute right-0 top-1/2 -translate-y-1/2 h-[140px] w-auto object-contain" />
              </div>
            </div>

            {/* 정보 */}
            <div className="flex flex-col gap-[12px] text-[14px] mb-[24px]">
              {[
                ['제목', previewRow.title],
                ['유형', '배너'],
                ['노출 위치', previewRow.position],
                ['노출 상태', previewRow.status === '노출' ? '노출중' : previewRow.status],
                ['게시기간', `${previewRow.start} ~ ${previewRow.end}`],
                ['바로가기', 'http://ecoview.gm.go.kr'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-[16px]">
                  <span className="w-[72px] shrink-0 text-[#8A949E]">{label}</span>
                  <span className="text-[#8A949E]">|</span>
                  <span className="text-[#131416]">{value}</span>
                </div>
              ))}
            </div>

            {/* 확인 */}
            <button
              onClick={() => setPreviewRow(null)}
              className="w-full h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

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
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">제목</span>
                <input type="text" placeholder="배너 또는 팝업 제목 입력" defaultValue={editTarget?.title} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">노출 위치</span>
                <button onClick={() => onShowToast?.('노출 위치 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.position ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">노출 상태</span>
                <button onClick={() => onShowToast?.('노출 상태 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.status ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">게시 시작일</span>
                <DatePicker defaultValue="2026-10-10" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">게시 종료일</span>
                <DatePicker defaultValue="2026-11-10" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">바로가기 링크</span>
                <input type="text" placeholder="https://" defaultValue={editTarget ? 'main.banner/com/' : undefined} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[80px] shrink-0 font-medium text-[#131416]">이미지 등록</span>
                <div className="flex-1 flex items-center h-[44px] rounded-[8px] border border-[#CDD1D5] overflow-hidden">
                  <button onClick={() => onShowToast?.('파일 선택은 준비 중입니다.')} className="h-full px-[16px] bg-[#F4F5F6] border-r border-[#CDD1D5] text-[14px] font-medium text-[#464C53] hover:bg-[#ECEEF0] transition-colors shrink-0">파일 선택</button>
                  <span className={`px-[14px] text-[14px] ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>{editTarget ? 'main_banner.jpeg' : '선택된 파일 없음'}</span>
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

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-[12px] w-[440px] max-w-full px-[24px] pt-[40px] pb-[24px] animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-[16px] font-medium text-[#131416] mb-[28px]">정말 삭제하시겠습니까?</p>
            <div className="flex items-center gap-[12px]">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-[48px] rounded-[8px] border border-[#CDD1D5] bg-white text-[16px] font-medium text-[#464C53] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { onShowToast?.(`'${deleteTarget.title}' 항목이 삭제되었습니다.`); setDeleteTarget(null); }}
                className="flex-1 h-[48px] rounded-[8px] bg-[#DE3412] text-white text-[16px] font-semibold hover:bg-[#C32E0F] transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
