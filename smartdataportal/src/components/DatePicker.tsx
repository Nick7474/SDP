import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  defaultValue?: string;
  heightClass?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  if (!s) return null;
  const norm = s.replace(/\./g, '-').replace(/-$/, '');
  const [y, m, d] = norm.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function DatePicker({ defaultValue = '2026-10-10', heightClass = 'h-[44px]' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => { const p = parse(defaultValue); return p ? toStr(p) : '2026-10-10'; });
  const [view, setView] = useState(() => {
    const base = parse(value) || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full ${heightClass} px-[14px] rounded-[8px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] text-[#131416] hover:border-[var(--gp-primary)] transition-colors`}
      >
        <span className="whitespace-nowrap">{value}</span>
        <Calendar size={16} className="text-[#7C8896] shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+4px)] left-0 z-[95] w-[280px] bg-white rounded-[10px] border border-[#E6E8EA] shadow-[0_8px_24px_rgba(22,36,59,0.12)] p-[16px]">
            <div className="flex items-center justify-between mb-[12px]">
              <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#5A6878] hover:bg-[#F4F5F6]">
                <ChevronLeft size={18} />
              </button>
              <span className="text-[14px] font-semibold text-[#131416]">{year}년 {month + 1}월</span>
              <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#5A6878] hover:bg-[#F4F5F6]">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-[4px]">
              {WEEKDAYS.map((w, i) => (
                <span key={w} className={`h-[28px] flex items-center justify-center text-[12px] font-medium ${i === 0 ? 'text-[#E0483D]' : i === 6 ? 'text-[#256EF4]' : 'text-[#8A949E]'}`}>{w}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-[2px]">
              {cells.map((day, idx) => {
                if (day === null) return <span key={`e${idx}`} />;
                const ds = toStr(new Date(year, month, day));
                const isSel = ds === value;
                return (
                  <button
                    key={ds}
                    type="button"
                    onClick={() => { setValue(ds); setOpen(false); }}
                    className={`h-[32px] flex items-center justify-center text-[13px] rounded-[6px] transition-colors ${
                      isSel ? 'bg-[var(--gp-primary)] text-white font-semibold' : 'text-[#131416] hover:bg-[#F4F5F6]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
