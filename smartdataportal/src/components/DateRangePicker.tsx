import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  label?: string;
  defaultStart?: string;
  defaultEnd?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function DateRangePicker({ label = '기간 선택', defaultStart = '2026-10-10', defaultEnd = '2026-11-10' }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [view, setView] = useState(() => {
    const base = parse(defaultStart) || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const pickDay = (day: number) => {
    const ds = toStr(new Date(year, month, day));
    if (!start || (start && end)) {
      setStart(ds);
      setEnd('');
    } else {
      if (ds < start) {
        setStart(ds);
      } else {
        setEnd(ds);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative flex items-center gap-[8px]">
      {label && <span className="text-[14px] font-medium text-[#464C53] whitespace-nowrap">{label}</span>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-[48px] w-[240px] px-[14px] rounded-[6px] border border-[#CDD1D5] bg-white flex items-center justify-between text-[14px] text-[#131416] hover:border-[var(--gp-primary)] transition-colors"
      >
        <span className="whitespace-nowrap">{start || '시작일'}　-　{end || '종료일'}</span>
        <Calendar size={18} className="text-[#7C8896] shrink-0" />
      </button>

      {open && (
        <>
          {/* outside click catcher */}
          <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />

          {/* Calendar popover */}
          <div className="absolute top-[52px] right-0 z-[80] w-[280px] bg-white rounded-[10px] border border-[#E6E8EA] shadow-[0_8px_24px_rgba(22,36,59,0.12)] p-[16px]">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-[12px]">
              <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#5A6878] hover:bg-[#F4F5F6]">
                <ChevronLeft size={18} />
              </button>
              <span className="text-[14px] font-semibold text-[#131416]">{year}년 {month + 1}월</span>
              <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#5A6878] hover:bg-[#F4F5F6]">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 mb-[4px]">
              {WEEKDAYS.map((w, i) => (
                <span key={w} className={`h-[28px] flex items-center justify-center text-[12px] font-medium ${i === 0 ? 'text-[#E0483D]' : i === 6 ? 'text-[#256EF4]' : 'text-[#8A949E]'}`}>{w}</span>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-y-[2px]">
              {cells.map((day, idx) => {
                if (day === null) return <span key={`e${idx}`} />;
                const ds = toStr(new Date(year, month, day));
                const isStart = ds === start;
                const isEnd = ds === end;
                const inRange = start && end && ds > start && ds < end;
                return (
                  <button
                    key={ds}
                    type="button"
                    onClick={() => pickDay(day)}
                    className={`h-[32px] flex items-center justify-center text-[13px] transition-colors ${
                      isStart || isEnd
                        ? 'bg-[var(--gp-primary)] text-white rounded-[6px] font-semibold'
                        : inRange
                          ? 'bg-[var(--gp-primary-soft)] text-[var(--gp-primary)]'
                          : 'text-[#131416] hover:bg-[#F4F5F6] rounded-[6px]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-[8px] mt-[12px] pt-[12px] border-t border-[#F0F2F5]">
              <button type="button" onClick={() => { setStart(''); setEnd(''); }} className="h-[32px] px-[12px] rounded-[6px] text-[13px] text-[#5A6878] hover:bg-[#F4F5F6]">초기화</button>
              <button type="button" onClick={() => setOpen(false)} className="h-[32px] px-[14px] rounded-[6px] bg-[var(--gp-primary)] text-white text-[13px] font-medium hover:bg-[var(--gp-primary-strong)]">확인</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
