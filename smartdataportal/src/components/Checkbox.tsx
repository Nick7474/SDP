import { useState } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 공통 체크박스 컴포넌트 (Figma: CheckBox Type B)
 * - Off: 흰 배경 + #CDD1D5 테두리, rounded-4, 20px
 * - On: primary 채움 + 흰색 체크
 * - 제어(checked) / 비제어(defaultChecked) 모두 지원
 */
export default function Checkbox({ checked, defaultChecked = false, onChange, disabled, className = '' }: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
        isChecked ? 'bg-[var(--gp-primary)] border-[var(--gp-primary)]' : 'bg-white border-[#CDD1D5]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {isChecked && <Check size={14} strokeWidth={3} className="text-white" />}
    </button>
  );
}
