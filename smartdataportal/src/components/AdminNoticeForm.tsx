import { useState } from 'react';
import {
  ChevronDown, Bold, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link2, Image as ImageIcon,
} from 'lucide-react';
import Checkbox from './Checkbox';
import DateRangePicker from './DateRangePicker';

interface NoticeInitial {
  title?: string;
  category?: string;
  important?: boolean;
  status?: '게시' | '임시저장';
  fileName?: string;
  content?: string;
  noPeriod?: boolean;
}

interface AdminNoticeFormProps {
  mode?: 'create' | 'edit';
  initial?: NoticeInitial;
  onShowToast?: (msg: string) => void;
  onBack?: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-[80px] shrink-0 pt-[14px] text-[14px] font-semibold text-[#131416]">
      {children} <span className="text-[#DE3412]">*</span>
    </span>
  );
}

export default function AdminNoticeForm({ mode = 'create', initial, onShowToast, onBack }: AdminNoticeFormProps) {
  const isEdit = mode === 'edit';
  const [important, setImportant] = useState(initial?.important ?? false);
  const [status, setStatus] = useState<'게시' | '임시저장'>(initial?.status ?? '게시');
  const [noPeriod, setNoPeriod] = useState(initial?.noPeriod ?? false);

  return (
    <main className="flex-1 p-[32px] flex flex-col gap-[24px] bg-white">
      {/* Title */}
      <div className="flex flex-col gap-[4px]">
        <h1 className="text-[28px] font-bold text-[#1E2124]">{isEdit ? '공지사항 수정' : '공지사항 등록'}</h1>
        {!isEdit && <p className="text-[16px] text-[#464C53]">시민에게 안내할 공지사항을 등록합니다.</p>}
      </div>

      {/* Form card */}
      <div className="border border-[#E6E8EA] rounded-[12px] bg-white p-[32px] flex flex-col gap-[24px]">
        {/* 제목 */}
        <div className="flex items-start gap-[24px]">
          <FieldLabel>제목</FieldLabel>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            defaultValue={initial?.title}
            className="flex-1 h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)]"
          />
        </div>

        {/* 구분 / 중요공지 / 상태 */}
        <div className="flex items-center gap-[24px] flex-wrap">
          <div className="flex items-center gap-[24px]">
            <FieldLabel>구분</FieldLabel>
            <button
              onClick={() => onShowToast?.('구분 선택은 준비 중입니다.')}
              className="w-[300px] h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[15px] text-[#131416] hover:border-[var(--gp-primary)] transition-colors"
            >
              {initial?.category ?? '전체'} <ChevronDown size={18} className="text-[#7C8896]" />
            </button>
          </div>

          <div className="flex items-center gap-[12px] ml-[24px]">
            <span className="text-[14px] font-semibold text-[#131416]">중요 공지</span>
            <button
              onClick={() => setImportant(!important)}
              role="switch"
              aria-checked={important}
              className={`w-[44px] h-[24px] rounded-full transition-colors relative shrink-0 ${important ? 'bg-[var(--gp-primary)]' : 'bg-[#CDD1D5]'}`}
            >
              <span className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white transition-all ${important ? 'left-[22px]' : 'left-[2px]'}`} />
            </button>
            <span className="text-[14px] text-[#464C53]">중요 공지로 등록</span>
          </div>

          <div className="flex items-center gap-[40px] ml-auto">
            <span className="text-[14px] font-semibold text-[#131416]">상태 <span className="text-[#DE3412]">*</span></span>
            <div className="flex items-center gap-[16px]">
              {(['게시', '임시저장'] as const).map(opt => (
                <button key={opt} onClick={() => setStatus(opt)} className="flex items-center gap-[6px]">
                  <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center ${status === opt ? 'border-[var(--gp-primary)]' : 'border-[#CDD1D5]'}`}>
                    {status === opt && <span className="w-[10px] h-[10px] rounded-full bg-[var(--gp-primary)]" />}
                  </span>
                  <span className="text-[14px] text-[#131416]">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 첨부파일 */}
        <div className="flex items-start gap-[24px]">
          <FieldLabel>첨부파일</FieldLabel>
          <div className="flex-1 flex flex-col gap-[8px]">
            <div className="flex items-center h-[48px] rounded-[8px] border border-[#CDD1D5] overflow-hidden">
              <button
                onClick={() => onShowToast?.('파일 선택은 준비 중입니다.')}
                className="h-full px-[16px] bg-[#F4F5F6] border-r border-[#CDD1D5] text-[14px] font-medium text-[#464C53] hover:bg-[#ECEEF0] transition-colors shrink-0"
              >
                파일 선택
              </button>
              <span className={`px-[16px] text-[14px] ${initial?.fileName ? 'text-[#131416]' : 'text-[#8A949E]'}`}>{initial?.fileName ?? '선택된 파일 없음'}</span>
            </div>
            <p className="text-[13px] text-[#464C53]">· 파일은 최대 10MB까지 첨부 가능합니다. (허용 확장자: jpg, jpeg, png, pdf, hwp, docx, xlsx)</p>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex items-start gap-[24px]">
          <FieldLabel>내용</FieldLabel>
          <div className="flex-1 border border-[#CDD1D5] rounded-[8px] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-[4px] h-[40px] px-[12px] border-b border-[#E6E8EA] bg-[#FAFBFC] text-[#5A6878]">
              <button onClick={() => onShowToast?.('서식 기능은 준비 중입니다.')} className="flex items-center gap-[2px] text-[13px] px-[6px] hover:text-[var(--gp-primary)]">본문 <ChevronDown size={14} /></button>
              <span className="w-px h-[16px] bg-[#E6E8EA] mx-[4px]" />
              <span className="font-bold text-[14px] px-[4px]">A</span>
              {[Bold, Underline, Strikethrough].map((Icon, i) => (
                <button key={i} className="p-[4px] hover:text-[var(--gp-primary)]"><Icon size={16} /></button>
              ))}
              <span className="w-px h-[16px] bg-[#E6E8EA] mx-[4px]" />
              {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
                <button key={i} className="p-[4px] hover:text-[var(--gp-primary)]"><Icon size={16} /></button>
              ))}
              <span className="w-px h-[16px] bg-[#E6E8EA] mx-[4px]" />
              {[ListOrdered, List, Link2, ImageIcon].map((Icon, i) => (
                <button key={i} className="p-[4px] hover:text-[var(--gp-primary)]"><Icon size={16} /></button>
              ))}
            </div>
            <textarea
              placeholder="내용을 입력하세요."
              defaultValue={initial?.content}
              className="w-full h-[180px] p-[16px] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none resize-none"
            />
          </div>
        </div>

        {/* 등록기간 */}
        <div className="flex items-center gap-[24px]">
          <span className="w-[80px] shrink-0 text-[14px] font-semibold text-[#131416]">등록기간</span>
          <div className="flex items-center gap-[12px]">
            <DateRangePicker label="" />
            <label className="flex items-center gap-[8px] ml-[8px] cursor-pointer">
              <Checkbox checked={noPeriod} onChange={setNoPeriod} />
              <span className="text-[14px] text-[#464C53]">기간 제한 없음</span>
            </label>
          </div>
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
            onClick={() => { onShowToast?.(isEdit ? '공지사항이 저장되었습니다.' : '공지사항이 등록되었습니다.'); onBack?.(); }}
            className="w-[160px] h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
          >
            {isEdit ? '저장' : '등록'}
          </button>
        </div>
      </div>
    </main>
  );
}
