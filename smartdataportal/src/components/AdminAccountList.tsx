import { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import Checkbox from './Checkbox';
import FilterSelect from './FilterSelect';

interface AdminAccountListProps {
  onShowToast?: (msg: string) => void;
  onCreate?: () => void;
}

const summary = [
  { label: '전체 관리자', value: '8명' },
  { label: '최고관리자', value: '3명' },
  { label: '승인 대기', value: '2명' },
  { label: '비활성', value: '5명' },
];

interface Row {
  no: number;
  name: string;
  email: string;
  role: string;
  status: '활성' | '승인대기' | '비활성';
  loginType: string;
  lastLogin: string;
  created: string;
}

const rows: Row[] = [
  { no: 99, name: '운영관리자', email: 'admin@gm.go.kr', role: '최고 관리자', status: '활성', loginType: 'Google', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 98, name: '콘텐츠 관리자', email: 'contents@gm.go.kr', role: '콘텐츠 관리자', status: '활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 97, name: '승인 요청자', email: 'user01@gm.go.kr', role: '운영 관리자', status: '승인대기', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 96, name: '시스템 담당자', email: 'user01@gm.go.kr', role: '운영 관리자', status: '승인대기', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 95, name: '이전 담당자', email: 'user01@gm.go.kr', role: '조회 관리자', status: '비활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 94, name: '자료 관리자', email: 'user01@gm.go.kr', role: '콘텐츠 관리자', status: '활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 92, name: '홍보 담당자', email: 'user01@gm.go.kr', role: '콘텐츠 관리자', status: '활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 91, name: '승인 요청자', email: 'user01@gm.go.kr', role: '운영 관리자', status: '활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 90, name: '승인 요청자', email: 'user01@gm.go.kr', role: '운영 관리자', status: '승인대기', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
  { no: 89, name: '승인 요청자', email: 'user01@gm.go.kr', role: '운영 관리자', status: '비활성', loginType: 'Naver', lastLogin: '2026.05.28 09:04', created: '2026.05.20' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case '활성': return 'bg-[#EAF6EC] text-[#3FA654]';
    case '승인대기': return 'bg-[#FFF3E0] text-[#ED8B16]';
    case '비활성':
    default: return 'bg-[#F4F5F6] text-[#8A949E]';
  }
};

export default function AdminAccountList({ onShowToast, onCreate }: AdminAccountListProps) {
  const [activePage, setActivePage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('전체');
  const [roleF, setRoleF] = useState('전체');
  const [loginF, setLoginF] = useState('전체');

  const q = search.trim();
  const filtered = rows.filter(r =>
    (statusF === '전체' || r.status === statusF) &&
    (roleF === '전체' || r.role === roleF) &&
    (loginF === '전체' || r.loginType === loginF) &&
    (q === '' || r.name.includes(q) || r.email.includes(q))
  );

  const reset = () => {
    setSearch(''); setStatusF('전체'); setRoleF('전체'); setLoginF('전체');
  };

  return (
    <main className="flex-1 p-[32px] flex flex-col gap-[24px] bg-white">
      {/* Title row */}
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[28px] font-bold text-[#1E2124]">관리자 계정</h1>
          <p className="text-[16px] text-[#464C53]">광명 스마트데이터포털 관리자 CMS에 접근 가능한 계정, 권한 등급, 최근 로그인 상태를 관리합니다.</p>
        </div>
        <button
          onClick={onCreate}
          className="h-[48px] px-[20px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold flex items-center gap-[6px] shrink-0 hover:bg-[var(--gp-primary-strong)] transition-colors"
        >
          <Plus size={18} /> 관리자 등록
        </button>
      </div>

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
          <input type="text" placeholder="이름 또는 이메일 검색" value={search} onChange={e => setSearch(e.target.value)} />
          <Search className="gp-ico" size={20} />
        </div>
        <div className="flex items-center gap-[24px] ml-auto flex-wrap">
          <FilterSelect label="상태" width="w-[110px]" options={['전체', '활성', '승인대기', '비활성']} value={statusF} onChange={setStatusF} />
          <FilterSelect label="권한 등급" width="w-[150px]" options={['전체', '최고 관리자', '운영 관리자', '콘텐츠 관리자', '조회 관리자']} value={roleF} onChange={setRoleF} />
          <FilterSelect label="로그인 유형" width="w-[130px]" options={['전체', 'Google', 'Naver', 'Kakao']} value={loginF} onChange={setLoginF} />
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
            <span className="w-[120px] px-[12px]">관리자명</span>
            <span className="flex-1 px-[12px] min-w-0">이메일</span>
            <span className="w-[120px] px-[8px] text-center">권한 등급</span>
            <span className="w-[90px] px-[8px] text-center">상태</span>
            <span className="w-[100px] px-[8px] text-center">로그인 유형</span>
            <span className="w-[150px] px-[8px] text-center">최근 로그인</span>
            <span className="w-[110px] px-[8px] text-center">등록일</span>
            <span className="w-[80px] px-[8px] text-center">관리</span>
          </div>
          {filtered.map((row, idx) => (
            <div key={idx} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA] hover:bg-[#F9FAFB]">
              <span className="w-[52px] flex justify-center"><Checkbox /></span>
              <span className="w-[60px] px-[8px] text-center">{row.no}</span>
              <span className="w-[120px] px-[12px] truncate">{row.name}</span>
              <span className="flex-1 px-[12px] min-w-0 truncate text-[#464C53]">{row.email}</span>
              <span className="w-[120px] px-[8px] text-center text-[#464C53]">{row.role}</span>
              <span className="w-[90px] px-[8px] flex justify-center">
                <span className={`inline-flex items-center px-[10px] py-[3px] rounded-[16px] text-[12px] font-semibold ${statusBadge(row.status)}`}>{row.status}</span>
              </span>
              <span className="w-[100px] px-[8px] text-center text-[#464C53]">{row.loginType}</span>
              <span className="w-[150px] px-[8px] text-center text-[#464C53]">{row.lastLogin}</span>
              <span className="w-[110px] px-[8px] text-center text-[#464C53]">{row.created}</span>
              <span className="w-[80px] px-[8px] flex items-center justify-center text-[13px]">
                <button onClick={onCreate} className="text-[#0B50D0] hover:underline">수정</button>
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
    </main>
  );
}
