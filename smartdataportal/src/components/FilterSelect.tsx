import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  label?: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  width?: string;
  size?: 'h40' | 'h48';
  onChange?: (v: string) => void;
}

/**
 * 공통 필터 드롭다운 (디자인시스템: gp-select-btn 트리거 + gp-dropdown-menu/item)
 * 라벨 + 선택값 트리거 + 펼침 메뉴 구조. 관리자 필터 등에서 사용.
 * 제어(value) / 비제어(defaultValue) 모두 지원.
 */
export default function FilterSelect({ label, options, defaultValue, value: controlledValue, width = 'w-[120px]', size = 'h48', onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? options[0]);
  const value = controlledValue !== undefined ? controlledValue : internal;

  return (
    <div className="flex items-center gap-[8px]">
      {label && <span className="text-[14px] font-medium text-[#464C53] whitespace-nowrap">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`gp-select-btn gp-select-btn--${size} ${width}`}
        >
          <span className="text-[14px] text-[#131416] whitespace-nowrap">{value}</span>
          <ChevronDown size={16} className="text-[#7C8896] shrink-0" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <div className="gp-dropdown-menu" style={{ display: 'flex', minWidth: '140px' }}>
              {options.map(opt => (
                <button
                  key={opt}
                  className={`gp-dropdown-item ${value === opt ? 'active' : ''}`}
                  onClick={() => { if (controlledValue === undefined) setInternal(opt); setOpen(false); onChange?.(opt); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
