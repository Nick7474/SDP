import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';

interface AdminPlatformProps {
  onShowToast?: (msg: string) => void;
  registerOpen?: boolean;
  onCloseRegister?: () => void;
}

const summary = [
  { label: '전체 플랫폼', value: '12건' },
  { label: '노출중', value: '3건' },
  { label: '미노출', value: '2건' },
  { label: '숨김 메뉴', value: '5개' },
];

interface Row {
  no: number;
  category: string;
  name: string;
  menu: string;
  status: '노출' | '숨김';
  order: number;
  url: string;
}

const rows: Row[] = [
  { no: 99, category: '광명시 플랫폼', name: '광명시 건물에너지정보 플랫폼', menu: 'Energy Mile', status: '노출', order: 1, url: '있음' },
  { no: 98, category: '시민참여', name: '기후의병', menu: '개인탄소저감활동', status: '노출', order: 2, url: '있음' },
  { no: 97, category: '공공데이터', name: '공공데이터포털', menu: '데이터목록', status: '노출', order: 3, url: '있음' },
  { no: 96, category: '정책 · 통계', name: 'KOSIS 국가통계포털', menu: '정책 참고', status: '숨김', order: 4, url: '있음' },
  { no: 95, category: '지도', name: '광명시티맵', menu: '연관플랫폼', status: '숨김', order: 5, url: '있음' },
  { no: 94, category: '광명시 플랫폼', name: '광명시 건물에너지정보 플랫폼', menu: 'Energy Mile', status: '노출', order: 6, url: '있음' },
  { no: 93, category: '지도', name: '광명시티맵', menu: '연관플랫폼', status: '노출', order: 7, url: '있음' },
  { no: 92, category: '공공데이터', name: '공공데이터포털', menu: '데이터목록', status: '숨김', order: 8, url: '있음' },
  { no: 91, category: '시민참여', name: '기후의병', menu: '개인탄소저감활동', status: '노출', order: 9, url: '있음' },
  { no: 90, category: '광명시 플랫폼', name: '광명시 건물에너지정보 플랫폼', menu: 'Energy Mile', status: '노출', order: 10, url: '있음' },
];

const statusBadge = (status: string) =>
  status === '노출' ? 'bg-[#EAF6EC] text-[#3FA654]' : 'bg-[#F4F5F6] text-[#8A949E]';

export default function AdminPlatform({ onShowToast, registerOpen, onCloseRegister }: AdminPlatformProps) {
  const [activePage, setActivePage] = useState(1);
  const [editTarget, setEditTarget] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [catF, setCatF] = useState('전체');
  const [statusF, setStatusF] = useState('전체');
  const [menuF, setMenuF] = useState('전체');
  const closeModal = () => { setEditTarget(null); onCloseRegister?.(); };

  const q = search.trim();
  const filtered = rows.filter(r =>
    (catF === '전체' || r.category === catF) &&
    (statusF === '전체' || r.status === statusF) &&
    (menuF === '전체' || r.menu === menuF) &&
    (q === '' || r.name.includes(q) || r.menu.includes(q))
  );
  const reset = () => { setSearch(''); setCatF('전체'); setStatusF('전체'); setMenuF('전체'); };

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
          <input type="text" placeholder="플랫폼명, 관련 메뉴 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="카테고리" width="w-[150px]" options={['전체', '광명시 플랫폼', '시민참여', '공공데이터', '정책 · 통계', '지도']} value={catF} onChange={setCatF} />
          <FilterSelect label="노출 상태" width="w-[120px]" options={['전체', '노출', '숨김']} value={statusF} onChange={setStatusF} />
          <FilterSelect label="관련 메뉴" width="w-[160px]" options={['전체', 'Energy Mile', '개인탄소저감활동', '데이터목록', '정책 참고', '연관플랫폼']} value={menuF} onChange={setMenuF} />
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
            <span className="w-[140px] px-[12px]">카테고리</span>
            <span className="flex-1 px-[12px] min-w-0">플랫폼명</span>
            <span className="w-[150px] px-[12px]">관련 메뉴</span>
            <span className="w-[90px] px-[8px] text-center">노출 상태</span>
            <span className="w-[90px] px-[8px] text-center">노출 순서</span>
            <span className="w-[110px] px-[8px] text-center">바로가기 URL</span>
            <span className="w-[80px] px-[8px] text-center">관리</span>
          </div>
          {filtered.map((row, idx) => (
            <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
              <span className="w-[52px] flex justify-center"><Checkbox /></span>
              <span className="w-[60px] px-[8px] text-center">{row.no}</span>
              <span className="w-[140px] px-[12px] truncate">{row.category}</span>
              <span onClick={() => setEditTarget(row)} className="flex-1 px-[12px] min-w-0 truncate cursor-pointer hover:text-[var(--gp-primary)] hover:underline">{row.name}</span>
              <span className="w-[150px] px-[12px] truncate text-[#464C53]">{row.menu}</span>
              <span className="w-[90px] px-[8px] flex justify-center">
                <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
              </span>
              <span className="w-[90px] px-[8px] text-center text-[#464C53]">{row.order}</span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.url}</span>
              <span className="w-[80px] px-[8px] flex items-center justify-center text-[13px]">
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">수정</button>
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
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">플랫폼명</span>
                <input type="text" placeholder="플랫폼명을 입력하세요" defaultValue={editTarget?.name} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">카테고리</span>
                <button onClick={() => onShowToast?.('카테고리 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.category ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">관련 메뉴</span>
                <button onClick={() => onShowToast?.('관련 메뉴 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.menu ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">노출 상태</span>
                <button onClick={() => onShowToast?.('노출 상태 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.status ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">노출 순서</span>
                <input type="text" placeholder="노출 순서를 입력하세요" defaultValue={editTarget ? String(editTarget.order) : undefined} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">바로가기 URL</span>
                <input type="text" placeholder="https://" defaultValue={editTarget ? 'https://platform.gm.go.kr' : undefined} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
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
