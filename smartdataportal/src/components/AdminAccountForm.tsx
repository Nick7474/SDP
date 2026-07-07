import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Checkbox from './Checkbox';

interface AdminAccountFormProps {
  onShowToast?: (msg: string) => void;
  onBack?: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-[80px] shrink-0 text-[14px] font-semibold text-[#131416]">
      {children} <span className="text-[#DE3412]">*</span>
    </span>
  );
}

function SelectField({ value, onShowToast }: { value: string; onShowToast?: (m: string) => void }) {
  return (
    <button
      onClick={() => onShowToast?.('선택 옵션은 준비 중입니다.')}
      className="flex-1 h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[15px] text-[#131416] hover:border-[var(--gp-primary)] transition-colors"
    >
      {value} <ChevronDown size={18} className="text-[#7C8896]" />
    </button>
  );
}

const initialPerms: Record<string, { read: boolean; write: boolean }> = {
  '대시보드': { read: true, write: false },
  '공지사항 관리': { read: true, write: true },
  '자료실 관리': { read: false, write: false },
  '데이터목록 관리': { read: false, write: true },
  '팝업 · 배너 관리': { read: true, write: false },
  '연관플랫폼 관리': { read: true, write: false },
  '관리자 계정': { read: false, write: true },
};

export default function AdminAccountForm({ onShowToast, onBack }: AdminAccountFormProps) {
  const [perms, setPerms] = useState(initialPerms);

  const toggle = (menu: string, key: 'read' | 'write') =>
    setPerms(prev => ({ ...prev, [menu]: { ...prev[menu], [key]: !prev[menu][key] } }));

  const Check = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <Checkbox checked={checked} onChange={onChange} />
  );

  return (
    <main className="flex-1 p-[32px] flex flex-col gap-[32px] bg-white">
      {/* Title */}
      <h1 className="text-[28px] font-bold text-[#1E2124]">관리자 등록</h1>

      {/* Form card */}
      <div className="border border-[#E6E8EA] rounded-[12px] bg-white p-[32px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[24px]">
          <FieldLabel>관리자명</FieldLabel>
          <input type="text" placeholder="관리자명을 입력하세요" className="flex-1 h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
        </div>
        <div className="flex items-center gap-[24px]">
          <FieldLabel>이메일</FieldLabel>
          <input type="text" placeholder="이메일을 입력하세요" className="flex-1 h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]" />
        </div>
        <div className="flex items-center gap-[24px]">
          <FieldLabel>로그인 유형</FieldLabel>
          <SelectField value="Google" onShowToast={onShowToast} />
        </div>
        <div className="flex items-center gap-[24px]">
          <FieldLabel>권한 등급</FieldLabel>
          <SelectField value="운영 관리자" onShowToast={onShowToast} />
        </div>
        <div className="flex items-center gap-[24px]">
          <FieldLabel>상태</FieldLabel>
          <SelectField value="승인대기" onShowToast={onShowToast} />
        </div>
        <div className="flex items-center gap-[24px]">
          <FieldLabel>최근 로그인</FieldLabel>
          <input type="text" value="-" disabled className="flex-1 h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] bg-[#F4F5F6] text-[15px] text-[#8A949E] outline-none" />
        </div>
        <div className="flex items-start gap-[24px]">
          <span className="w-[80px] shrink-0 pt-[14px] text-[14px] font-semibold text-[#131416]">상태 <span className="text-[#DE3412]">*</span></span>
          <textarea placeholder="담당자 변경 또는 비활성 사유를 입력하세요." className="flex-1 h-[100px] p-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none resize-none focus:border-[var(--gp-primary)]" />
        </div>
      </div>

      {/* Permission settings */}
      <div className="flex flex-col gap-[16px]">
        <h2 className="text-[20px] font-bold text-[#1E2124]">관리자 권한 설정</h2>
        <div className="border border-[#E6E8EA] rounded-[4px] overflow-hidden">
          <div className="flex bg-[#F4F5F6] h-[44px] items-center text-[14px] font-semibold text-[#131416]">
            <span className="flex-1 px-[16px]">메뉴</span>
            <span className="w-[200px] px-[16px] text-center">조회</span>
            <span className="w-[200px] px-[16px] text-center">등록 · 수정</span>
          </div>
          {Object.keys(perms).map((menu) => (
            <div key={menu} className="flex items-center h-[48px] text-[14px] text-[#1E2124] border-t border-[#E6E8EA]">
              <span className="flex-1 px-[16px]">{menu}</span>
              <span className="w-[200px] px-[16px] flex justify-center">
                <Check checked={perms[menu].read} onChange={() => toggle(menu, 'read')} />
              </span>
              <span className="w-[200px] px-[16px] flex justify-center">
                <Check checked={perms[menu].write} onChange={() => toggle(menu, 'write')} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-[160px] h-[48px] rounded-[8px] border border-[#CDD1D5] bg-white text-[16px] font-medium text-[#464C53] hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)] transition-colors"
        >
          취소
        </button>
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => onShowToast?.('임시저장되었습니다.')}
            className="w-[160px] h-[48px] rounded-[8px] border border-[var(--gp-primary)] bg-white text-[16px] font-semibold text-[var(--gp-primary)] hover:bg-[var(--gp-primary-soft)] transition-colors"
          >
            임시저장
          </button>
          <button
            onClick={() => { onShowToast?.('관리자가 등록되었습니다.'); onBack?.(); }}
            className="w-[160px] h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
          >
            등록
          </button>
        </div>
      </div>
    </main>
  );
}
