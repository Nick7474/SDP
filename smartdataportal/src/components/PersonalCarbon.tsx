import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { ChevronRight } from 'lucide-react';

const chartData = [
  { month: '1월', activities: 820, reduction: 8.2 },
  { month: '2월', activities: 940, reduction: 9.3 },
  { month: '3월', activities: 1860, reduction: 11.9 },
  { month: '4월', activities: 940, reduction: 10.3 },
  { month: '5월', activities: 1060, reduction: 11.2 },
  { month: '6월', activities: 1180, reduction: 45.7 },
  { month: '7월', activities: 1245, reduction: 48.7 },
  { month: '8월', activities: 940, reduction: 38.6 },
  { month: '9월', activities: 1060, reduction: 28.6 },
  { month: '10월', activities: 820, reduction: 20.6 },
  { month: '11월', activities: 1245, reduction: 30.2 },
  { month: '12월', activities: 940, reduction: 36.2 },
];

export default function PersonalCarbon() {
  return (
    <div className="w-full bg-white pb-20 font-pretendard-gov animate-in fade-in duration-300">
      {/* Banner */}
      <div 
        className="w-full h-[280px] bg-[#F5F8FC] relative flex items-center mb-[40px] border-b border-[#E6E8EA]"
        style={{
          background: "url('/images/banner_bg_개인탄소저감활동.svg') no-repeat right center / cover",
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-0 relative z-10 flex flex-col gap-[8px]">
          <h1 className="text-[40px] font-bold text-[#16243B] font-score">시민탄소저감활동</h1>
          <p className="text-[16px] text-[#5A6878] leading-relaxed font-score">
            광명시민의 탄소저감 실천 현황을 데이터로 확인하고,<br/>생활 속 탄소중립 활동에 참여해 보세요.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-0">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-[24px] mb-[60px]">
          {/* Card 1 */}
          <div className="gp-card p-[32px] bg-white border border-[var(--border-2)] hover:border-[var(--gp-primary)] transition-colors flex flex-col relative min-h-[180px]">
            <div className="flex items-start gap-[16px] mb-[16px]">
              <img src="/icons/ic_community_flat.svg" alt="누적 참여 활동" className="w-[60px] h-[60px] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[16px] text-[#464C53] font-medium">누적 참여 활동</span>
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[28px] font-bold text-[#16243B] leading-tight">12,480</span>
                  <span className="text-[14px] font-medium text-[var(--fg-3)]">건</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--border-light)] pt-[12px]">
              <span className="gp-badge gp-badge--info self-start">2026.05 기준</span>
              <span className="text-[14px] font-normal text-[var(--fg-3)]">기후의병 및 연계 활동 기준 집계</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="gp-card p-[32px] bg-white border border-[var(--border-2)] hover:border-[var(--gp-primary)] transition-colors flex flex-col relative min-h-[180px]">
            <div className="flex items-start gap-[16px] mb-[16px]">
              <img src="/icons/ic_leaf_flat.svg" alt="예상 탄소 저감량" className="w-[60px] h-[60px] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[16px] text-[#464C53] font-medium">예상 탄소 저감량</span>
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[28px] font-bold text-[#16243B] leading-tight">38.6</span>
                  <span className="text-[14px] font-medium text-[var(--fg-3)]">tCO₂eq</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--border-light)] pt-[12px]">
              <span className="gp-badge gp-badge--info self-start">2026.05 기준</span>
              <span className="text-[14px] font-normal text-[var(--fg-3)]">활동별 산정 기준에 따른 추정치</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="gp-card p-[32px] bg-white border border-[var(--border-2)] hover:border-[var(--gp-primary)] transition-colors flex flex-col relative min-h-[180px]">
            <div className="flex items-start gap-[16px] mb-[16px]">
              <img src="/icons/ic_calendar_flat.svg" alt="이번 달 참여" className="w-[60px] h-[60px] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[16px] text-[#464C53] font-medium">이번 달 참여</span>
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[28px] font-bold text-[#16243B] leading-tight">1,245</span>
                  <span className="text-[14px] font-medium text-[var(--fg-3)]">건</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--border-light)] pt-[12px]">
              <span className="gp-badge gp-badge--info self-start">2026.05 기준</span>
              <span className="text-[14px] font-normal text-[var(--fg-3)]">월간 집계 활동 수</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="gp-card p-[32px] bg-white border border-[var(--border-2)] hover:border-[var(--gp-primary)] transition-colors flex flex-col relative min-h-[180px]">
            <div className="flex items-start gap-[16px] mb-[16px]">
              <img src="/icons/ic_link_flat.svg" alt="연계 프로그램" className="w-[60px] h-[60px] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[16px] text-[#464C53] font-medium">연계 프로그램</span>
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[28px] font-bold text-[#16243B] leading-tight">8</span>
                  <span className="text-[14px] font-medium text-[var(--fg-3)]">개</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--border-light)] pt-[12px]">
              <span className="gp-badge gp-badge--info self-start">2026.05 기준</span>
              <span className="text-[14px] font-normal text-[var(--fg-3)]">시민 참여형 탄소중립 활동</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-[60px]">
          <h2 className="text-[24px] font-bold text-[#16243B] mb-[4px]">광명시 탄소저감 활동 현황</h2>
          <p className="text-[16px] text-[var(--fg-3)] mb-[24px]">시민 참여 활동을 집계하여 월별 변화와 주요 실천 분야를 확인할 수 있습니다.</p>
          
          <div className="gp-card p-[24px] bg-white border border-[var(--border-2)]">
            <div className="flex justify-between items-center mb-[32px]">
              <h3 className="text-[18px] font-bold text-[#16243B]">월별 참여 추이 및 예상 탄소 저감량</h3>
              <span className="text-[13px] text-[var(--fg-4)] font-medium">2026.05 기준</span>
            </div>
            
            <div className="w-full h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
                >
                  <CartesianGrid vertical={false} stroke="var(--border-1)" strokeWidth={1} yAxisId="left" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#36445A', fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#36445A', fontSize: 13 }}
                    domain={[0, 2000]}
                    tickCount={6}
                    label={{ value: '참여활동(건)', position: 'insideTopLeft', offset: -15, fill: '#36445A', fontSize: 12, dy: -15 }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#36445A', fontSize: 13 }}
                    domain={[0, 50]}
                    tickCount={6}
                    label={{ value: '예상 탄소 저감량 (tCO₂eq)', position: 'insideTopRight', offset: -15, fill: '#36445A', fontSize: 12, dy: -15 }}
                  />
                  <Tooltip 
                    cursor={{fill: 'var(--bg-subtle)'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-2)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={20}
                    wrapperStyle={{ bottom: 0, position: 'absolute' }}
                    content={() => (
                      <div className="flex justify-center items-center gap-6">
                        <div className="flex items-center gap-[6px]">
                          <svg width="24" height="10" viewBox="0 0 24 10">
                            <line x1="0" y1="5" x2="24" y2="5" stroke="var(--status-success)" strokeWidth="2" />
                            {/* 파란 사각형(10x10)과 비율이 맞도록 지름 8x8(r=4)로 설정 */}
                            <circle cx="12" cy="5" r="4" fill="var(--status-success)" />
                          </svg>
                          <span className="text-[14px] text-[#16243B] font-normal">예상 탄소저감량(tCO₂eq)</span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                          <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--gp-point)', borderRadius: '1px' }}></div>
                          <span className="text-[14px] text-[#16243B] font-normal">참여활동(건)</span>
                        </div>
                      </div>
                    )}
                  />
                  <Bar yAxisId="left" dataKey="activities" name="참여활동(건)" fill="var(--gp-point)" barSize={32} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="activities" position="top" fill="var(--gp-point)" fontSize={12} fontWeight={600} offset={8} />
                  </Bar>
                  <Line 
                    yAxisId="right" 
                    type="linear" 
                    dataKey="reduction" 
                    name="예상 탄소저감량(tCO₂eq)" 
                    stroke="var(--status-success)" 
                    strokeWidth={2} 
                    dot={(props: any) => {
                      const { cx, cy } = props;
                      if (typeof cx !== 'number' || Number.isNaN(cx) || typeof cy !== 'number' || Number.isNaN(cy)) return <g></g>;
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={5} fill="#fff" />
                          <circle cx={cx} cy={cy} r={4} fill="var(--status-success)" />
                        </g>
                      );
                    }}
                    activeDot={{ r: 6, fill: 'var(--status-success)', stroke: '#fff', strokeWidth: 2 }}
                  >
                    <LabelList 
                      dataKey="reduction" 
                      content={(props: any) => {
                        const { x, y, value } = props;
                        if (typeof x !== 'number' || Number.isNaN(x) || typeof y !== 'number' || Number.isNaN(y)) return <g></g>;
                        // 막대(너비 32px, 즉 중심에서 16px)를 벗어나도록 x를 +16 이상으로 이동하고, 선을 가리지 않도록 y를 약간 아래로 내립니다.
                        return (
                          <foreignObject x={x + 16} y={y + 4} width={60} height={24} style={{ overflow: 'visible' }}>
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px', 
                              fontWeight: 500, 
                              padding: '2px 4px', 
                              backgroundColor: '#ffffff', 
                              borderRadius: '2px',
                              color: 'var(--status-success)',
                              lineHeight: 1,
                              whiteSpace: 'nowrap'
                            }}>
                              {value}
                            </div>
                          </foreignObject>
                        );
                      }} 
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Visualization Sub-cards */}
        <div className="mb-[60px]">
          <h2 className="text-[24px] font-bold text-[#16243B] mb-[4px]">기후의병 탄소저감 데이터 시각화</h2>
          
          <div className="grid grid-cols-3 gap-[24px]">
            {/* Sub Card 1 */}
            <div className="gp-card p-[24px] bg-white border border-[var(--border-2)] hover:border-[var(--gp-primary)] transition-colors flex flex-col">
              <div className="flex gap-[20px] mb-[16px]">
                <img src="/icons/ic_reusable_90.svg" alt="다회용기" className="w-[90px] h-[90px] shrink-0" />
                <div>
                  <h3 className="text-[18px] font-bold text-[#16243B] mb-[4px]">다회용기 사용</h3>
                  <p className="text-[14px] text-[var(--fg-3)] leading-relaxed mb-[8px]">
                    배달·포장 시 다회용기 사용으로<br/>일회용 폐기물 발생을 줄입니다.
                  </p>
                  <div className="flex items-center gap-[8px] text-[14px]">
                    <span className="font-bold text-[#16243B]">예상 효과</span>
                    <span className="w-[1px] h-[12px] bg-[#D2DAE6]"></span>
                    <span className="text-[var(--fg-3)]">온실가스 감축 및 자원 절약</span>
                  </div>
                </div>
              </div>
              <button className="h-[36px] w-full bg-white border border-[#145CA8] text-[#145CA8] rounded-[8px] hover:bg-[#F0F6FD] transition-colors mt-auto font-medium text-[14px] flex justify-center items-center">
                참여 방법 보기 <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {/* Sub Card 2 */}
            <div className="gp-card p-[24px] bg-white border border-[var(--border-2)] hover:border-[#16B364] transition-colors flex flex-col">
              <div className="flex gap-[20px] mb-[16px]">
                <img src="/icons/ic_bus_90.svg" alt="대중교통" className="w-[90px] h-[90px] shrink-0" />
                <div>
                  <h3 className="text-[18px] font-bold text-[#16243B] mb-[4px]">대중교통 · 친환경 이동</h3>
                  <p className="text-[14px] text-[var(--fg-3)] leading-relaxed mb-[8px]">
                    대중교통, 전기차, 공유 모빌리티 이용으로<br/>수송 부문 배출을 줄입니다.
                  </p>
                  <div className="flex items-center gap-[8px] text-[14px]">
                    <span className="font-bold text-[#16243B]">예상 효과</span>
                    <span className="w-[1px] h-[12px] bg-[#D2DAE6]"></span>
                    <span className="text-[var(--fg-3)]">수송 탄소 저감</span>
                  </div>
                </div>
              </div>
              <button className="h-[36px] w-full bg-white border border-[#145CA8] text-[#145CA8] rounded-[8px] hover:bg-[#F0F6FD] transition-colors mt-auto font-medium text-[14px] flex justify-center items-center">
                관련 데이터 보기 <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {/* Sub Card 3 */}
            <div className="gp-card p-[24px] bg-white border border-[var(--border-2)] hover:border-[#F59E0B] transition-colors flex flex-col">
              <div className="flex gap-[20px] mb-[16px]">
                <img src="/icons/ic_building_90.svg" alt="건물 에너지" className="w-[90px] h-[90px] shrink-0" />
                <div>
                  <h3 className="text-[18px] font-bold text-[#16243B] mb-[4px]">건물 에너지 절감</h3>
                  <p className="text-[14px] text-[var(--fg-3)] leading-relaxed mb-[8px]">
                    전기·난방 사용량 절감으로<br/>건물 부문 온실가스를 줄입니다.
                  </p>
                  <div className="flex items-center gap-[8px] text-[14px]">
                    <span className="font-bold text-[#16243B]">예상 효과</span>
                    <span className="w-[1px] h-[12px] bg-[#D2DAE6]"></span>
                    <span className="text-[var(--fg-3)]">에너지 사용 절감</span>
                  </div>
                </div>
              </div>
              <button className="h-[36px] w-full bg-white border border-[#145CA8] text-[#145CA8] rounded-[8px] hover:bg-[#F0F6FD] transition-colors mt-auto font-medium text-[14px] flex justify-center items-center">
                건물 에너지 정보 보기 <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Call to action bottom box */}
        <div className="w-full h-[120px] bg-[#F0F6FD] rounded-[16px] px-[40px] flex items-center justify-between">
          <div className="flex items-center gap-[24px]">
            <img src="/icons/ic_nature_60.svg" alt="Nature" className="w-[60px] h-[60px] shrink-0" />
            <div>
              <h2 className="text-[24px] font-bold text-[#16243B]">생활 속 탄소저감 활동에 참여해 보세요</h2>
              <p className="text-[16px] text-[var(--fg-3)]">광명시의 탄소중립은 시민의 작은 실천과 도시 데이터가 함께 만들어갑니다.</p>
            </div>
          </div>
          <button
  className="gp-btn gp-btn--h48 gp-btn--primary px-[24px] rounded-[8px] font-bold text-[16px] shadow-sm flex items-center"
  onClick={() => window.open('https://netzero.gm.go.kr/contents/content.php?cIdx=43&fboard=board_point1&actionMode=intro', '_blank')}
>
  탄소저금통 바로가기 <ChevronRight size={20} className="ml-1" />
</button>
        </div>

      </div>
    </div>
  );
}
