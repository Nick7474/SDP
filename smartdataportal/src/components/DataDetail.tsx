import { Download, Code, FileText, Scale, MapPin, Leaf, Battery, Building2 } from 'lucide-react';

interface DataDetailProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (page: any) => void;
}

export default function DataDetail({ onShowToast, onNavigate }: DataDetailProps) {
  return (
    <div className="pb-16 bg-[var(--bg-page)]">
      <div className="max-w-[1440px] mx-auto px-0 pt-[32px]">
        
        {/* Top Header Box */}
        <div className="gp-card px-[40px] py-[32px] mb-[16px]">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-[8px] mb-[16px]">
                <span className="gp-badge gp-badge--primary-outline">에너지·건물</span>
                <span className="gp-badge gp-badge--primary-outline">공개</span>
                <span className="gp-badge gp-badge--neutral-outline">CSV</span>
                <span className="gp-badge gp-badge--neutral-outline">API</span>
              </div>
              <h1 className="text-[32px] font-bold text-[#16243B] font-pretendard-gov leading-tight mb-[4px]">
                광명역세권 건물 에너지 사용량 데이터
              </h1>
              <p className="text-[16px] text-[var(--fg-3)] mb-[24px]">
                광명역세권 주요 건축물의 월별 에너지 사용량 및 탄소배출 추정 데이터를 제공합니다.
              </p>
              
              <div className="flex items-center gap-[32px] text-[15px] text-[var(--fg-3)]">
                <div className="flex items-center gap-[6px]">
                  <img src="/icons/ic_calendar_20.svg" alt="calendar" className="w-[20px] h-[20px]" />
                  <span>기준일 <strong className="text-[var(--fg-1)] font-semibold ml-1">2026.05.08</strong></span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <img src="/icons/ic_reset_20.svg" alt="reset" className="w-[20px] h-[20px]" />
                  <span>수집주기 <strong className="text-[var(--fg-1)] font-semibold ml-1">월 단위</strong></span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <img src="/icons/ic_public_20.svg" alt="public" className="w-[20px] h-[20px]" />
                  <span>제공기관 <strong className="text-[var(--fg-1)] font-semibold ml-1">광명시</strong></span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <img src="/icons/ic_view_20.svg" alt="view" className="w-[20px] h-[20px]" />
                  <span>조회수 <strong className="text-[var(--fg-1)] font-semibold ml-1">255</strong></span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-[12px] shrink-0 w-[240px]">
              <button 
                onClick={() => onShowToast("데이터를 다운로드합니다.")}
                className="gp-btn gp-btn--h48 gp-btn--primary w-full flex items-center justify-center"
              >
                <img src="/icons/ic_btn_download.svg" alt="다운로드" className="w-[18px] h-[18px] mr-2" /> 다운로드
              </button>
              <button 
                onClick={() => onShowToast("API 이용안내 페이지로 이동합니다.")}
                className="gp-btn gp-btn--h48 gp-btn--secondary w-full flex items-center justify-center"
              >
                <img src="/icons/ic_btn_api.svg" alt="API" className="w-[18px] h-[18px] mr-2" /> API 이용안내
              </button>
              <button 
                onClick={() => onShowToast("데이터 요청 페이지로 이동합니다.")}
                className="gp-btn gp-btn--h48 gp-btn--secondary w-full flex items-center justify-center"
              >
                <img src="/icons/ic_btn_document.svg" alt="문서" className="w-[18px] h-[18px] mr-2" /> 데이터 요청
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Boxes */}
        <div className="grid grid-cols-4 gap-[24px] mb-[40px]">
          <div className="gp-card p-[32px] flex items-center gap-[24px]">
            <img src="/icons/ic_building3.svg" alt="제공기관" className="w-[48px] h-[48px]" />
            <div>
              <div className="text-[14px] text-[var(--fg-3)] mb-1">제공기관</div>
              <div className="text-[20px] font-bold text-[var(--fg-1)] font-pretendard-gov">광명시</div>
            </div>
          </div>
          <div className="gp-card p-[32px] flex items-center gap-[24px]">
            <img src="/icons/ic_calendar3.svg" alt="수집주기" className="w-[48px] h-[48px]" />
            <div>
              <div className="text-[14px] text-[var(--fg-3)] mb-1">수집주기</div>
              <div className="text-[20px] font-bold text-[var(--fg-1)] font-pretendard-gov">월 단위</div>
            </div>
          </div>
          <div className="gp-card p-[32px] flex items-center gap-[24px]">
            <img src="/icons/ic_document3.svg" alt="파일형식" className="w-[48px] h-[48px]" />
            <div>
              <div className="text-[14px] text-[var(--fg-3)] mb-1">파일형식</div>
              <div className="text-[20px] font-bold text-[var(--fg-1)] font-pretendard-gov">CSV, API</div>
            </div>
          </div>
          <div className="gp-card p-[32px] flex items-center gap-[24px]">
            <img src="/icons/ic_fairness3.svg" alt="이용조건" className="w-[48px] h-[48px]" />
            <div>
              <div className="text-[14px] text-[var(--fg-3)] mb-1">이용조건</div>
              <div className="text-[20px] font-bold text-[var(--gp-primary)] font-pretendard-gov">공공누리 제 1유형</div>
            </div>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="flex gap-[48px] mb-[60px]">
          {/* Left Column */}
          <div className="w-[1010px] shrink-0 flex flex-col gap-[40px]">
            
            {/* 데이터 설명 */}
            <section>
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[16px]">데이터 설명</h3>
              <div className="gp-card p-[24px] text-[16px] text-[var(--fg-2)] leading-relaxed">
                <p>본 데이터는 광명역세권 내 업무·상업·공공 건축물의 월별 에너지 사용량과 탄소배출량을 집계한 자료입니다.<br/>
                전력 및 가스 사용량을 기반으로 산정된 탄소배출량을 함께 제공하여, 건물 에너지 효율 분석 및 탄소중립 정책 수립에 활용될 수 있습니다.</p>
                <div className="mt-[24px]">
                  <div className="font-bold text-[18px] text-[var(--fg-1)] mb-2">주요 항목</div>
                  <ul className="list-disc list-inside text-[var(--fg-3)] space-y-1">
                    <li>건물명 · 건물유형 · 기준일 · 전력사용량(kWh) · 가스사용량(m³) · 탄소배출량(tCO₂eq) · 전월 대비 증감율</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제공 파일 / API 정보 */}
            <section>
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[16px]">제공 파일 / API 정보</h3>
              <div className="gp-table-container mb-[16px]">
                <table className="gp-table">
                  <thead>
                    <tr>
                      <th className="w-[80px] !text-center whitespace-nowrap">번호</th>
                      <th className="text-left">파일명</th>
                      <th className="w-[80px] !text-center">형식</th>
                      <th className="w-[100px] !text-center">용량</th>
                      <th className="w-[180px]">설명</th>
                      <th className="w-[140px] !text-center">다운로드</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="!text-center">1</td>
                      <td>광명역세권_건물에너지_20260522.csv</td>
                      <td className="!text-center">CSV</td>
                      <td className="!text-center">2.4MB</td>
                      <td>2026년 05월 데이터</td>
                      <td className="!text-center">
                        <div className="flex justify-center">
                          <button onClick={() => onShowToast("다운로드를 시작합니다.")} className="gp-btn gp-btn--sm gp-btn--secondary whitespace-nowrap">
                            <Download size={14} className="mr-1" /> 다운로드
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="!text-center">2</td>
                      <td>광명역세권_건물에너지_API명세서.pdf</td>
                      <td className="!text-center">PDF</td>
                      <td className="!text-center">1.2MB</td>
                      <td>API 연동 데이터</td>
                      <td className="!text-center">
                        <div className="flex justify-center">
                          <button onClick={() => onShowToast("문서를 다운로드합니다.")} className="gp-btn gp-btn--sm gp-btn--secondary whitespace-nowrap">
                            <Download size={14} className="mr-1" /> 다운로드
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* API Box */}
              <div className="bg-[#F5FBFF] border border-[#E2E8F0] rounded-[12px] py-[24px] pl-[32px] pr-[32px] h-[144px] flex items-center gap-[32px]">
                <div className="w-[76px] h-[76px] shrink-0">
                  <img src="/images/img_api.svg" alt="API" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 grid grid-cols-1 gap-y-3">
                  <div className="flex items-center">
                    <span className="text-[14px] font-semibold text-[var(--fg-3)] w-[100px]">엔드포인트</span>
                    <span className="text-[15px] text-[var(--fg-1)] font-mono">/api/ecoview/energy/building-usage</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[14px] font-semibold text-[var(--fg-3)] w-[100px]">인증방식</span>
                    <span className="text-[15px] text-[var(--fg-1)]">API Key</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[14px] font-semibold text-[var(--fg-3)] w-[100px]">제공 방식</span>
                    <span className="text-[15px] text-[var(--fg-1)]">일 단위 갱신</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 데이터 미리보기 */}
            <section>
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[16px]">데이터 미리보기</h3>
              <div className="gp-table-container">
                <table className="gp-table">
                  <thead>
                    <tr>
                      <th className="text-left">건물명</th>
                      <th className="w-[100px] !text-center">건물유형</th>
                      <th className="w-[100px] !text-center">기준일</th>
                      <th className="w-[160px] !text-right whitespace-nowrap">전력사용량(kWh)</th>
                      <th className="w-[160px] !text-right whitespace-nowrap">가스사용량(m³)</th>
                      <th className="w-[180px] !text-right whitespace-nowrap">탄소배출량(tCO₂eq)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td>광명역 KTX 빌딩</td>
                        <td style={{ textAlign: 'center' }}>업무시설</td>
                        <td style={{ textAlign: 'center' }}>2026-05</td>
                        <td style={{ textAlign: 'right' }}>1,245,320</td>
                        <td style={{ textAlign: 'right' }}>112,540</td>
                        <td style={{ textAlign: 'right' }}>452.35</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 활용 예시 */}
            <section>
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[16px]">활용 예시</h3>
              <div className="grid grid-cols-3 gap-[16px]">
                <div className="gp-card !py-[20px] !px-[17px] h-[105px] flex items-center gap-[20px] hover:border-[var(--gp-primary)] transition-colors">
                  <img src="/icons/ic_monitor_70.svg" alt="icon" className="w-[70px] h-[70px] shrink-0" />
                  <div className="flex flex-col gap-[6px]">
                    <div className="font-semibold text-[18px] text-[var(--fg-1)]">건물 에너지 절감 분석</div>
                    <p className="text-[14px] font-normal text-[var(--fg-3)] leading-snug">
                      건물별 에너지 사용량을 비교하여<br/>절감 포인트를 도출할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="gp-card !py-[20px] !px-[17px] h-[105px] flex items-center gap-[20px] hover:border-[var(--status-success)] transition-colors">
                  <img src="/icons/ic_leaf_70.svg" alt="icon" className="w-[70px] h-[70px] shrink-0" />
                  <div className="flex flex-col gap-[6px]">
                    <div className="font-semibold text-[18px] text-[var(--fg-1)]">월별 탄소배출 추세 파악</div>
                    <p className="text-[14px] font-normal text-[var(--fg-3)] leading-snug">
                      월별 탄소배출량 변화를 시각화하여<br/>감축 성과를 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="gp-card !py-[20px] !px-[17px] h-[105px] flex items-center gap-[20px] hover:border-[#F59E0B] transition-colors">
                  <img src="/icons/ic_data_70.svg" alt="icon" className="w-[70px] h-[70px] shrink-0" />
                  <div className="flex flex-col gap-[6px]">
                    <div className="font-semibold text-[18px] text-[var(--fg-1)]">공공건물 효율 비교</div>
                    <p className="text-[14px] font-normal text-[var(--fg-3)] leading-snug">
                      공공건물 간 에너지 효율을 비교하여<br/>효율 개선 계획 수립에 활용합니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="w-[382px] shrink-0 flex flex-col gap-[24px]">
            
            {/* 메타데이터 */}
            <div className="gp-card p-[32px]">
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[24px]">메타데이터</h3>
              <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">분류체계</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">에너지 - 건물</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">공개범위</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">공개</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">등록일</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">2026.05.01</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">수정일</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">2026.05.09</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">라이선스</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">공공누리 제 1유형</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">제공기관</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">광명시</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">담당부서</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">스마트도시과</span>
                </div>
                <div className="flex justify-between items-center pt-[4px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">연락처</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">02-2121-4545</span>
                </div>
              </div>
            </div>

            {/* 다운로드 정보 */}
            <div className="gp-card p-[32px]">
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[24px]">다운로드 정보</h3>
              <div className="flex flex-col gap-[16px] mb-[32px]">
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">다운로드</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">68</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-[16px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">조회수</span>
                  <span className="text-[15px] text-[var(--fg-1)] font-normal">232</span>
                </div>
                <div className="flex justify-between items-center pt-[4px]">
                  <span className="text-[15px] text-[var(--fg-3)] font-normal">API 호출</span>
                  <span className="text-[15px] text-[var(--gp-primary)] font-normal cursor-pointer hover:underline" onClick={() => onShowToast("API 연동 기능을 확인합니다.")}>가능</span>
                </div>
              </div>
              <button 
                onClick={() => onShowToast("데이터를 다운로드합니다.")}
                className="gp-btn gp-btn--h48 gp-btn--primary w-full"
              >
                <Download size={18} className="mr-2" /> 데이터 다운로드
              </button>
            </div>

            {/* 문의 및 요청 */}
            <div className="gp-card p-[32px] bg-[#F8F9FA] border-none flex-1 flex flex-col">
              <h3 className="text-[24px] font-bold text-[var(--fg-1)] font-pretendard-gov mb-[16px]">문의 및 요청</h3>
              <p className="text-[18px] text-[var(--fg-3)] leading-relaxed mb-[24px] break-keep">
                데이터 활용 방법이나 추가 제공<br />가능 여부가 필요하신가요?
              </p>
              <button 
                onClick={() => onShowToast("데이터 요청 창구로 연결합니다.")}
                className="gp-btn gp-btn--h48 gp-btn--secondary w-full bg-white mt-auto"
              >
                <img src="/icons/ic_btn_document_color.svg" alt="document" className="w-[24px] h-[24px]" />
                데이터 요청하기
              </button>
            </div>

          </div>
        </div>

        {/* 관련 데이터 */}
        <div className="mb-[60px]">
          <h2 className="text-[24px] font-bold text-[#16243B] font-pretendard-gov mb-[24px]">관련 데이터</h2>
          <div className="grid grid-cols-3 gap-[24px]">
            {/* Card 1 */}
            <div className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" style={{ boxShadow: 'none' }} onClick={() => onShowToast("상세 정보 페이지로 이동합니다.")}>
              <div className="flex gap-4 mb-[32px]">
                <img src="/icons/ic_leaf_2.svg" alt="탄소" className="w-[80px] h-[80px] shrink-0" />
                <div className="flex flex-col">
                  <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">탄소배출 현황 데이터</h3>
                  <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">광명역세권 탄소배출량과 감축현황을 확인할 수 있는 핵심 데이터</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] px-[24px]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                  <span className="text-[14px] text-[var(--gp-primary)] font-bold">탄소중립</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                  <div className="flex gap-1">
                    <span className="gp-filetag gp-filetag--api">API</span>
                    <span className="gp-filetag gp-filetag--csv">CSV</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">조회수</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">1,245</span>
                </div>
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">다운로드</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">320</span>
                </div>
              </div>
              <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
                상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" style={{ boxShadow: 'none' }} onClick={() => onShowToast("상세 정보 페이지로 이동합니다.")}>
              <div className="flex gap-4 mb-[32px]">
                <img src="/icons/ic_bus_2.svg" alt="교통" className="w-[80px] h-[80px] shrink-0" />
                <div className="flex flex-col">
                  <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">광명역세권 교통량 데이터</h3>
                  <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">주요 도로와 DRT 운행현황을 비교할 수 있는 교통 데이터</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] px-[24px]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                  <span className="text-[14px] text-[#1AAA5E] font-bold">교통·이동</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                  <div className="flex gap-1">
                    <span className="gp-filetag gp-filetag--api">API</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">조회수</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">968</span>
                </div>
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">다운로드</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">256</span>
                </div>
              </div>
              <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
                상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="gp-card gp-card--hover flex flex-col h-full cursor-pointer" style={{ boxShadow: 'none' }} onClick={() => onShowToast("상세 정보 페이지로 이동합니다.")}>
              <div className="flex gap-4 mb-[32px]">
                <img src="/icons/ic_building_2.svg" alt="에너지" className="w-[80px] h-[80px] shrink-0" />
                <div className="flex flex-col">
                  <h3 className="text-[20px] font-semibold text-[#16243B] mb-2 leading-tight">공공건물 에너지 사용 데이터</h3>
                  <p className="text-[16px] font-normal text-[#5A6878] leading-snug line-clamp-2">공공건물의 월별 에너지 사용량과 월간 현황 데이터</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] px-[24px]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">분야</span>
                  <span className="text-[14px] text-[#ED8B16] font-bold">에너지·건물</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5A6878] font-medium">형식</span>
                  <div className="flex gap-1">
                    <span className="gp-filetag gp-filetag--csv">CSV</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px] pt-[16px] border-t border-[#F0F3F8] mt-auto px-[24px]">
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_view_20.svg" alt="view" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">조회수</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">1,245</span>
                </div>
                <div className="flex items-center gap-1 text-[#5A6878]">
                  <img src="/icons/ic_download.svg" alt="download" className="w-[16px] h-[16px]" />
                  <span className="text-[14px]">다운로드</span>
                  <span className="text-[15px] font-bold text-[#16243B] ml-1">320</span>
                </div>
              </div>
              <button className="gp-btn gp-btn--h48 w-full border border-[var(--gp-primary)] text-[var(--gp-primary)] bg-white hover:bg-[var(--gp-primary-soft)] text-[15px]">
                상세보기 <img src="/icons/ic_btn_arrow.svg" alt="arrow" className="w-[20px] h-[20px] -translate-y-[1px]" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="w-full h-[150px] bg-[#EBF3FC] rounded-[16px] flex items-center justify-between px-[60px]">
          <div className="flex items-center gap-[24px]">
            <img src="/images/img_document_hq.png" alt="document" className="w-[170px] h-[138px] object-contain" />
            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold text-[var(--gp-primary)] mb-[6px]">필요한 데이터가 없으신가요?</h3>
              <p className="text-[16px] text-[#5A6878]">공개되지 않은 데이터는 관리자 검토 후 제공 가능 여부를 안내합니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-[16px]">
            <button 
              onClick={() => onShowToast("데이터 요청 페이지로 이동합니다.")}
              className="gp-btn gp-btn--lg gp-btn--primary"
            >
              데이터 요청하기
            </button>
            <button 
              onClick={() => window.open('https://www.data.go.kr/', '_blank')}
              className="gp-btn gp-btn--lg bg-white border border-[var(--gp-primary)] text-[var(--gp-primary)] hover:bg-[var(--gp-primary-soft)]"
            >
              공공데이터포털 바로가기 <img src="/icons/ic_external.svg" alt="external" className="w-[20px] h-[20px] ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
