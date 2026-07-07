import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, X, Check, ArrowRight,
  Users, Leaf, TreePine,
} from 'lucide-react';

const HIDE_KEY = 'gm-splash-hide-date';

type Span = { text: string; color: string };
type Slide = {
  titleLine1: Span[];
  titleLine2: Span[];
  subtitle: [string, string];
};

const DARK = '#131416';
const ACCENT = '#044e9e';

/** 3단 캐러셀 기획: ① 개요(도시 일러스트) → ② 4개 마일 지표 → ③ 시민 참여 현황 */
const SLIDES: Slide[] = [
  {
    titleLine1: [{ text: '데이터로 보는 ', color: DARK }],
    titleLine2: [{ text: '광명 탄소중립', color: ACCENT }, { text: ' 스마트 도시', color: DARK }],
    subtitle: ['에너지 · 모빌리티 · 안전 · 데이터 마일 기반', '도시지표를 광명 스마트데이터포털에서 확인하세요.'],
  },
  {
    titleLine1: [{ text: '4개 마일로 보는', color: DARK }],
    titleLine2: [{ text: '우리 도시 ', color: DARK }, { text: '데이터 지표', color: ACCENT }],
    subtitle: ['우리 도시 4개 마일 지표를', '데이터 지도에서 확인하세요.'],
  },
  {
    titleLine1: [{ text: '시민과 함께 만드는', color: DARK }],
    titleLine2: [{ text: '탄소중립', color: ACCENT }, { text: ' 스마트 도시', color: DARK }],
    subtitle: ['시민탄소저감활동에 참여하고', '나의 실천이 만드는 변화를 확인하세요.'],
  },
];

/** 슬라이드 ②: 4개 마일 요약 카드 (색상·마일 핀은 '데이터 지도' 화면과 동일) */
const MAP_MILES = [
  { label: '에너지 마일', color: '#1587E1', soft: '#e7f2fd', value: '12.4', unit: 'GWh', pin: '/icons/mappin_en.png' },
  { label: '모빌리티 마일', color: '#1AAA5E', soft: '#e6f6ee', value: '62.3', unit: '%', pin: '/icons/mappin_mo.png' },
  { label: '세이프티 마일', color: '#ED8B16', soft: '#fdf1e1', value: '88.5', unit: '점', pin: '/icons/mappin_sf.png' },
  { label: '데이터 마일', color: '#6E74D6', soft: '#edeefb', value: '512', unit: '종', pin: '/icons/mappin_dm.png' },
];

type Props = {
  onNavigate: (page: 'intro' | 'map' | 'personalCarbon') => void;
  /** 스플래시가 닫히거나(또는 오늘 미노출로) 종료된 시점 — 이후 지도 온보딩 시작 트리거 */
  onResolved?: () => void;
};

/** 슬라이드 ②·③ 공용 배경: 테마별 그라데이션 + 은은한 스카이라인 (블루=데이터 / 그린=시민) */
function PanelBackdrop({ theme = 'blue' }: { theme?: 'blue' | 'green' }) {
  const grad = theme === 'green'
    ? 'linear-gradient(135deg,#e7f6ee 0%,#f3fbf6 58%,#ffffff 100%)'
    : 'linear-gradient(135deg,#e9f0fb 0%,#f4f8fd 58%,#ffffff 100%)';
  const sky = theme === 'green' ? '#cfead9' : '#d7e3f4';
  return (
    <>
      <div className="absolute inset-0" style={{ background: grad }} />
      <svg className="absolute left-0 bottom-0 w-[600px] h-[96px]" viewBox="0 0 600 96" preserveAspectRatio="none" aria-hidden="true">
        <g fill={sky} opacity="0.5">
          <rect x="18" y="48" width="26" height="48" rx="2" />
          <rect x="50" y="30" width="22" height="66" rx="2" />
          <rect x="78" y="58" width="20" height="38" rx="2" />
          <rect x="360" y="52" width="22" height="44" rx="2" />
          <rect x="388" y="36" width="26" height="60" rx="2" />
          <rect x="420" y="60" width="18" height="36" rx="2" />
          <rect x="500" y="44" width="24" height="52" rx="2" />
          <rect x="530" y="30" width="22" height="66" rx="2" />
          <rect x="558" y="56" width="20" height="40" rx="2" />
        </g>
      </svg>
    </>
  );
}

/** 슬라이드 ②: '데이터 지도' 미리보기 — 광명시 지도(크게) + 지도 위 마일 핀 + 범례 카드 */
function MapPreview() {
  const PINS = [
    { pin: '/icons/mappin_en.png', x: 470, y: 172 },
    { pin: '/icons/mappin_dm.png', x: 522, y: 208 },
    { pin: '/icons/mappin_mo.png', x: 496, y: 266 },
    { pin: '/icons/mappin_sf.png', x: 460, y: 326 },
  ];
  return (
    <>
      {/* 광명시 데이터 지도 (히어로) */}
      <img
        src="/images/datamap.png"
        alt="광명시 데이터 지도"
        draggable={false}
        className="absolute select-none pointer-events-none"
        style={{ left: 388, top: 120, width: 184, height: 270, filter: 'drop-shadow(0 12px 22px rgba(20,60,120,0.16))' }}
      />
      {/* 지도 위 마일 핀 */}
      {PINS.map((p, i) => (
        <img key={i} src={p.pin} alt="" draggable={false}
          className="absolute select-none pointer-events-none"
          style={{ left: p.x, top: p.y, width: 24, height: 30 }} />
      ))}
      {/* 범례 카드: 4개 마일 지표 */}
      <div
        className="absolute rounded-[12px] bg-white"
        style={{ left: 284, top: 170, width: 166, height: 158, padding: 14, boxShadow: '0 8px 22px rgba(20,40,80,0.12)' }}
      >
        <p className="text-[11px] font-semibold m-0 mb-[9px]" style={{ color: '#8a949e' }}>4대 마일 지표</p>
        {MAP_MILES.map((m) => (
          <div key={m.label} className="flex items-center gap-[7px] mb-[9px] last:mb-0">
            <img src={m.pin} alt="" className="w-[13px] h-[16px] shrink-0" draggable={false} />
            <span className="text-[12px] font-medium flex-1" style={{ color: '#464c53' }}>{m.label.replace(' 마일', '')}</span>
            <span className="flex items-baseline gap-[1px]">
              <b className="text-[13px] font-extrabold" style={{ color: m.color }}>{m.value}</b>
              <span className="text-[10px] font-medium" style={{ color: '#8a949e' }}>{m.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/** 슬라이드 ③: 시민 참여 대시보드 — 목표 달성률 원형 게이지 + 하단 스탯 칩(그린 테마) */
function ParticipationVisual() {
  const pct = 78, r = 52, circ = 2 * Math.PI * r, off = circ * (1 - pct / 100);
  const CHIPS = [
    { Icon: Users, color: '#044e9e', soft: '#e6eefb', value: '12,480', unit: '명', label: '참여 시민' },
    { Icon: Leaf, color: '#06a85b', soft: '#e6f7ee', value: '-32.5', unit: '%', label: '탄소저감' },
    { Icon: TreePine, color: '#2f9e44', soft: '#e6f7ee', value: '1,248', unit: '그루', label: '심은 나무' },
  ];
  return (
    <>
      {/* 목표 달성률 게이지 (히어로) */}
      <div className="absolute" style={{ left: 406, top: 46, width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#dcefe4" strokeWidth="13" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke="url(#gaugeG)" strokeWidth="13" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#06a85b" /><stop offset="1" stopColor="#4bd98a" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <b className="text-[30px] font-extrabold leading-none" style={{ color: '#0b8f4d' }}>78%</b>
          <span className="text-[11px] font-medium mt-[4px]" style={{ color: '#6d7882' }}>목표 달성률</span>
        </div>
      </div>

      {/* 하단 스탯 칩 3개 */}
      {CHIPS.map((c, i) => {
        const Icon = c.Icon;
        return (
          <div
            key={c.label}
            className="absolute rounded-[12px] bg-white flex flex-col justify-between"
            style={{ left: 300 + i * 92, top: 238, width: 84, height: 78, padding: 11, boxShadow: '0 6px 18px rgba(20,40,80,0.10)' }}
          >
            <span className="flex items-center justify-center rounded-[8px]" style={{ width: 26, height: 26, background: c.soft, color: c.color }}>
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <div>
              <p className="m-0 flex items-baseline gap-[1px] leading-none">
                <b className="text-[16px] font-extrabold" style={{ color: c.color }}>{c.value}</b>
                <span className="text-[10px] font-medium" style={{ color: '#8a949e' }}>{c.unit}</span>
              </p>
              <p className="text-[10.5px] m-0 mt-[3px]" style={{ color: '#8a949e' }}>{c.label}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * 사이트 첫 진입 시 노출되는 광명 스마트데이터포털 안내 스플래시 (3단 캐러셀)
 * - ① 개요는 Figma 도시 일러스트(2038:45089), ②·③은 데이터 지표/시민 참여 비주얼로 상세 구성
 * - 왼쪽 메시지·오른쪽 비주얼이 슬라이드마다 전환 / 화살표·점·카운터·자동전환 동작
 * - "오늘 하루 보지 않기" 체크 후 닫으면 당일 재노출 안 함(localStorage)
 */
export default function SplashModal({ onNavigate, onResolved }: Props) {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const dontShowRef = useRef(false);

  useEffect(() => { dontShowRef.current = dontShow; }, [dontShow]);

  useEffect(() => {
    let show = true;
    try {
      show = localStorage.getItem(HIDE_KEY) !== new Date().toDateString();
    } catch {
      show = true;
    }
    if (show) setOpen(true);
    else onResolved?.(); // 오늘 미노출 → 즉시 종료로 간주(지도 온보딩 진행)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = SLIDES.length;
  const go = (n: number) => setIdx((p) => (n + total) % total);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  const close = () => {
    if (dontShowRef.current) {
      try { localStorage.setItem(HIDE_KEY, new Date().toDateString()); } catch { /* ignore */ }
    }
    setOpen(false);
    onResolved?.();
  };

  const goDetail = () => {
    // ② 데이터 지도(map), ③ 시민탄소저감활동(personalCarbon), ① 사업소개(intro)
    onNavigate(idx === 1 ? 'map' : idx === 2 ? 'personalCarbon' : 'intro');
    close();
  };

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 5초 자동 전환 (hover 시 정지)
  useEffect(() => {
    if (!open || paused) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % total), 5000);
    return () => clearInterval(t);
  }, [open, paused, total]);

  if (!open) return null;

  const slide = SLIDES[idx];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="광명 스마트데이터포털 안내"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ transform: 'scale(min(1, (100vw - 32px) / 600, (100vh - 32px) / 550))' }}
        className="relative w-[600px] h-[550px] bg-white rounded-[16px] overflow-hidden shadow-[4px_4px_20px_0px_rgba(0,0,0,0.2)] font-pretendard-gov"
      >
        {/* 상단 패널 (600x425): 슬라이드별 비주얼 + 공용 텍스트 */}
        <div className="absolute left-0 top-0 w-[600px] h-[425px] overflow-hidden">
          {/* 오른쪽 비주얼(슬라이드별) */}
          {idx === 0 ? (
            <img
              src="/images/splash_eco_panel.png"
              alt=""
              draggable={false}
              className="block w-[600px] h-[425px] select-none pointer-events-none"
            />
          ) : (
            <>
              <PanelBackdrop theme={idx === 2 ? 'green' : 'blue'} />
              {idx === 1 ? <MapPreview /> : <ParticipationVisual />}
            </>
          )}

          {/* 텍스트 블록 (슬라이드마다 전환) */}
          <div className="absolute left-[40px] top-[40px] w-[345px] flex flex-col gap-[8px] items-start">
            <div className="flex items-center justify-center px-[12px] py-[5px] rounded-[4px]" style={{ background: '#d8e5fd' }}>
              <p className="text-[14px] font-bold leading-[1.5] whitespace-nowrap" style={{ color: ACCENT }}>
                광명 스마트데이터포털 안내
              </p>
            </div>
            <div key={idx} className="flex flex-col gap-[14px] items-start w-full animate-in fade-in duration-500">
              <div className="text-[32px] font-extrabold leading-[1.4] whitespace-nowrap" style={{ letterSpacing: '1px' }}>
                <p className="m-0">
                  {slide.titleLine1.map((s, i) => <span key={i} style={{ color: s.color }}>{s.text}</span>)}
                </p>
                <p className="m-0">
                  {slide.titleLine2.map((s, i) => <span key={i} style={{ color: s.color }}>{s.text}</span>)}
                </p>
              </div>
              <div className="text-[16px] font-medium leading-[1.5]" style={{ color: '#1e2124' }}>
                <p className="m-0 whitespace-nowrap">{slide.subtitle[0]}</p>
                <p className="m-0 whitespace-nowrap">{slide.subtitle[1]}</p>
              </div>
            </div>
          </div>

          {/* 자세히 보기 버튼 (3개 슬라이드 공통). ①은 이미지에 그려진 버튼을 그대로 덮어 통일 */}
          <button
            onClick={goDetail}
            className="absolute left-[38px] top-[272px] w-[141px] h-[40px] rounded-[8px] flex items-center gap-[8px] pl-[20px] cursor-pointer transition-colors hover:brightness-110"
            style={{ background: ACCENT }}
          >
            <span className="text-white text-[15px] font-semibold whitespace-nowrap">자세히 보기</span>
            <ArrowRight size={16} color="#fff" strokeWidth={2.4} />
          </button>
        </div>

        {/* 캐러셀 컨트롤 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[444px] flex items-center gap-[24px]">
          <button onClick={prev} aria-label="이전" className="w-[36px] h-[36px] rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f4f7fb]" style={{ borderColor: '#e6e8ea', color: '#8a949e' }}>
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-[8px]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`${i + 1}번 슬라이드`}
                className="rounded-full transition-all cursor-pointer"
                style={{
                  width: i === idx ? '20px' : '8px',
                  height: '8px',
                  background: i === idx ? ACCENT : '#cdd1d5',
                }}
              />
            ))}
          </div>
          <button onClick={next} aria-label="다음" className="w-[36px] h-[36px] rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f4f7fb]" style={{ borderColor: '#e6e8ea', color: ACCENT }}>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* 페이지 카운터 */}
        <div className="absolute left-[517px] top-[450px] flex items-center gap-[6px] text-[14px] font-medium leading-[1.5]">
          <span style={{ color: '#1e2124' }}>{String(idx + 1).padStart(2, '0')}</span>
          <span style={{ color: '#8a949e' }}>/</span>
          <span style={{ color: '#8a949e' }}>{String(total).padStart(2, '0')}</span>
        </div>

        {/* 푸터 바 */}
        <div className="absolute left-0 top-[494px] w-[600px] h-[56px] border-t" style={{ borderColor: '#f4f5f6' }}>
          <label className="absolute left-[28px] top-1/2 -translate-y-1/2 flex items-center gap-[6px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="sr-only"
            />
            <span
              className="w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center"
              style={{ borderColor: dontShow ? ACCENT : '#cdd1d5', background: dontShow ? ACCENT : '#fff' }}
            >
              {dontShow && <Check size={14} color="#fff" strokeWidth={3} />}
            </span>
            <span className="text-[14px] font-medium" style={{ color: '#1e2124' }}>오늘 하루 보지 않기</span>
          </label>
          <button onClick={close} className="absolute right-[20px] top-1/2 -translate-y-1/2 flex items-center gap-[2px] cursor-pointer">
            <span className="text-[14px] font-medium" style={{ color: '#1e2124' }}>닫기</span>
            <X size={24} color="#1e2124" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
