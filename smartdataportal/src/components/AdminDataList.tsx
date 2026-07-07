import { useState } from 'react';
import { Search, ChevronDown, Calendar, X } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';
import DatePicker from './DatePicker';
import SortSelect from './SortSelect';

interface AdminDataListProps {
  onShowToast?: (msg: string) => void;
  registerOpen?: boolean;
  onCloseRegister?: () => void;
}

const summary = [
  { label: '전체 데이터', value: '99건' },
  { label: '공개', value: '72건' },
  { label: '비공개', value: '14건' },
  { label: '갱신필요', value: '2개' },
];

interface Row {
  no: number;
  mile: string;
  name: string;
  type: string;
  provider: string;
  cycle: string;
  status: '공개' | '비공개';
  updated: string;
}

const rows: Row[] = [
  { no: 99, mile: 'Energy Mile', name: '신재생 태양광 발전량 데이터', type: '센서', provider: '케빈랩', cycle: '실시간', status: '공개', updated: '2026.05.20' },
  { no: 98, mile: 'Energy Mile', name: 'AI 예측 발전량 데이터', type: '통계', provider: '케빈랩', cycle: '일간', status: '공개', updated: '2026.05.20' },
  { no: 97, mile: 'Mobility Mile', name: '전기이륜차 운행 데이터', type: '센서', provider: '우아한형제들', cycle: '수시', status: '공개', updated: '2026.05.20' },
  { no: 96, mile: 'Mobility Mile', name: 'BSS 배터리 교환 데이터', type: '센서', provider: 'LG', cycle: '실시간', status: '비공개', updated: '2026.05.20' },
  { no: 95, mile: 'Safety Mile', name: 'AIoT 우수관로 수위 데이터', type: '센서', provider: '스파이어테크놀로지', cycle: '실시간', status: '공개', updated: '2026.05.20' },
  { no: 94, mile: 'Safety Mile', name: '그린배리어 미세먼지 데이터', type: '센서', provider: '영진기술', cycle: '수시', status: '공개', updated: '2026.05.20' },
  { no: 93, mile: 'Data Mile', name: '주민등록인구 통계', type: '행정데이터', provider: '광명시', cycle: '일간', status: '공개', updated: '2026.05.20' },
  { no: 92, mile: 'Data Mile', name: '대기오염 측정정보', type: '행정데이터', provider: '광명시', cycle: '수시', status: '공개', updated: '2026.05.20' },
  { no: 91, mile: 'Data Mile', name: '공영주차장 현황', type: '공간정보', provider: '광명시', cycle: '월간', status: '공개', updated: '2026.05.20' },
  { no: 90, mile: 'Energy Mile', name: '공공건물 태양광발전시설', type: '공간정보', provider: '광명시', cycle: '월간', status: '비공개', updated: '2026.05.20' },
];

const statusBadge = (status: string) =>
  status === '공개' ? 'bg-[#EAF6EC] text-[#3FA654]' : 'bg-[#F4F5F6] text-[#58616A]';

export default function AdminDataList({ onShowToast, registerOpen, onCloseRegister }: AdminDataListProps) {
  const [activePage, setActivePage] = useState(1);
  const [editTarget, setEditTarget] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [mileF, setMileF] = useState('전체');
  const [typeF, setTypeF] = useState('전체');
  const [statusF, setStatusF] = useState('전체');
  const closeModal = () => { setEditTarget(null); onCloseRegister?.(); };

  const mileMap: Record<string, string> = { '에너지 마일': 'Energy Mile', '모빌리티 마일': 'Mobility Mile', '세이프티 마일': 'Safety Mile', '데이터 마일': 'Data Mile' };
  const q = search.trim();
  const filtered = rows.filter(r =>
    (mileF === '전체' || r.mile === mileMap[mileF]) &&
    (typeF === '전체' || r.type === typeF) &&
    (statusF === '전체' || r.status === statusF) &&
    (q === '' || r.name.includes(q) || r.provider.includes(q))
  );
  const reset = () => { setSearch(''); setMileF('전체'); setTypeF('전체'); setStatusF('전체'); };

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
          <input type="text" placeholder="데이터명, 제공기관 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="마일 구분" width="w-[140px]" options={['전체', '에너지 마일', '모빌리티 마일', '세이프티 마일', '데이터 마일']} value={mileF} onChange={setMileF} />
          <FilterSelect label="데이터 유형" width="w-[130px]" options={['전체', '센서', '공간정보', '행정데이터', '통계']} value={typeF} onChange={setTypeF} />
          <FilterSelect label="상태" width="w-[110px]" options={['전체', '공개', '비공개']} value={statusF} onChange={setStatusF} />
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
            <span className="w-[120px] px-[12px]">마일 구분</span>
            <span className="flex-1 px-[12px] min-w-0">데이터명</span>
            <span className="w-[110px] px-[8px] text-center">데이터 유형</span>
            <span className="w-[90px] px-[8px] text-center">제공기관</span>
            <span className="w-[90px] px-[8px] text-center">갱신주기</span>
            <span className="w-[80px] px-[8px] text-center">상태</span>
            <span className="w-[110px] px-[8px] text-center">최근 갱신일</span>
            <span className="w-[150px] px-[8px] text-center">관리</span>
          </div>
          {filtered.map((row, idx) => (
            <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
              <span className="w-[52px] flex justify-center"><Checkbox /></span>
              <span className="w-[60px] px-[8px] text-center">{row.no}</span>
              <span className="w-[120px] px-[12px] truncate">{row.mile}</span>
              <span onClick={() => setEditTarget(row)} className="flex-1 px-[12px] min-w-0 truncate cursor-pointer hover:text-[var(--gp-primary)] hover:underline">{row.name}</span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.type}</span>
              <span className="w-[90px] px-[8px] text-center text-[#464C53]">{row.provider}</span>
              <span className="w-[90px] px-[8px] text-center text-[#464C53]">{row.cycle}</span>
              <span className="w-[80px] px-[8px] flex justify-center">
                <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
              </span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.updated}</span>
              <span className="w-[150px] px-[8px] flex items-center justify-center gap-[6px] text-[13px]">
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">보기</button>
                <span className="text-[#CDD1D5]">·</span>
                <button onClick={() => setEditTarget(row)} className="text-[#0B50D0] hover:underline">수정</button>
                <span className="text-[#CDD1D5]">·</span>
                <button onClick={() => onShowToast?.(`'${row.name}' 삭제`)} className="text-[#DE3412] hover:underline">삭제</button>
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
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">데이터명</span>
                <input type="text" placeholder="데이터명을 입력하세요" defaultValue={editTarget?.name} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">마일 구분</span>
                <button onClick={() => onShowToast?.('마일 구분 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.mile ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">데이터 유형</span>
                <button onClick={() => onShowToast?.('데이터 유형 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.type ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">제공기관</span>
                <input type="text" placeholder="제공기관을 입력하세요" defaultValue={editTarget?.provider} className="flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] text-[14px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">갱신주기</span>
                <button onClick={() => onShowToast?.('갱신주기 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.cycle ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">상태</span>
                <button onClick={() => onShowToast?.('상태 선택은 준비 중입니다.')} className={`flex-1 h-[44px] px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] hover:border-[var(--gp-primary)] transition-colors ${editTarget ? 'text-[#131416]' : 'text-[#8A949E]'}`}>
                  {editTarget?.status ?? '선택하세요'} <ChevronDown size={16} className="text-[#7C8896]" />
                </button>
              </div>

              <div className="flex items-center gap-[16px]">
                <span className="w-[88px] shrink-0 font-medium text-[#131416]">최근 갱신일</span>
                <DatePicker defaultValue={editTarget?.updated ?? '2026-10-10'} />
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
