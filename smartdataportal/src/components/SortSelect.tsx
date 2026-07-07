import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortSelectProps {
  options?: string[];
  defaultValue?: string;
  width?: string;
  size?: 'h40' | 'h48';
  onChange?: (v: string) => void;
}

export default function SortSelect({ options = ['최신순', '날짜순'], defaultValue, width = 'w-[110px]', size = 'h40', onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? options[0]);

  return (
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
          <div className="gp-dropdown-menu" style={{ display: 'flex', minWidth: '120px' }}>
            {options.map(opt => (
              <button
                key={opt}
                className={`gp-dropdown-item ${value === opt ? 'active' : ''}`}
                onClick={() => { setValue(opt); setOpen(false); onChange?.(opt); }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
