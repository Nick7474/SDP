import { Calendar, Eye, Info, Download, ChevronRight } from 'lucide-react';

interface NoticeDetailProps {
  onShowToast?: (msg: string) => void;
  onNavigate?: (page: any) => void;
}

const attachments = [
  { name: '광명스마트데이터포털_서비스 점검 안내.pdf', size: '1.2 MB', type: 'PDF', cls: 'bg-[#FFF6F6] border-[#DE3412] text-[#DE3412]' },
  { name: '데이터 갱신_항목_목록.xlsx', size: '1.2 MB', type: 'XLSX', cls: 'bg-[#F5FFFA] border-[#3FA654] text-[#3FA654]' },
];

export default function NoticeDetail({ onShowToast, onNavigate }: NoticeDetailProps) {
  return (
    <div className="w-full bg-white pt-[40px] pb-20 font-pretendard-gov">
      <div className="max-w-[1440px] mx-auto px-0 flex flex-col gap-[40px] items-end">
        <div className="w-full flex flex-col gap-[40px]">

          {/* 제목 + 본문 */}
          <div className="w-full flex flex-col gap-[24px]">

            {/* 제목 카드 */}
            <div className="relative border border-[#E6E8EA] rounded-[12px] bg-white px-[39px] py-[31px]">
              <div className="flex flex-col gap-[22px] pr-[120px]">
                <div className="flex flex-col gap-[10px]">
                  <div className="flex gap-[8px] items-center">
                    <span className="inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[13px] bg-white border border-[#DE3412] text-[#DE3412]">중요</span>
                    <span className="inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[13px] bg-[#ECF2FE] border border-[#256EF4] text-[#0B50D0]">서비스 점검</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <h1 className="text-[32px] font-bold text-[#131416] leading-[1.5] tracking-[1px]">광명 스마트데이터포털 서비스 정기 점검 안내</h1>
                    <p className="text-[16px] text-[#464C53] leading-[1.5]">안정적인 서비스 제공을 위한 시스템 정기 점검 일정을 안내드립니다.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-[32px] items-center text-[14px]">
                  <div className="flex gap-[6px] items-center">
                    <Calendar size={20} className="text-[#5A6878]" />
                    <span className="flex gap-[8px] items-center">
                      <span className="text-[#464C53]">등록일</span>
                      <span className="font-semibold text-[#1E2124]">2026.05.08</span>
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <Eye size={20} className="text-[#5A6878]" />
                    <span className="flex gap-[8px] items-center">
                      <span className="text-[#464C53]">조회수</span>
                      <span className="font-semibold text-[#1E2124]">255</span>
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <img src="/icons/ic_public_20.svg" alt="" width={20} height={20} className="w-[20px] h-[20px]" />
                    <span className="flex gap-[8px] items-center">
                      <span className="text-[#464C53]">작성자</span>
                      <span className="font-semibold text-[#1E2124]">관리자</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 공유 / 인쇄 */}
              <div className="absolute top-[15px] right-[15px] flex gap-[12px] items-center">
                <button
                  onClick={() => onShowToast?.('공유 링크가 복사되었습니다.')}
                  className="w-[39px] h-[40px] rounded-[4px] border border-[#E6E8EA] bg-white flex items-center justify-center hover:border-[var(--gp-primary)] transition-colors"
                  aria-label="공유"
                >
                  <img src="/icons/ic_copy_20.svg" alt="" width={20} height={20} className="w-[20px] h-[20px]" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-[39px] h-[40px] rounded-[4px] border border-[#E6E8EA] bg-white flex items-center justify-center hover:border-[var(--gp-primary)] transition-colors"
                  aria-label="인쇄"
                >
                  <img src="/icons/ic_print_20.svg" alt="" width={20} height={20} className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>

            {/* 본문 카드 */}
            <div className="border border-[#E6E8EA] rounded-[12px] bg-white overflow-hidden">
              <div className="px-[39px] pt-[31px] pb-[31px] flex flex-col gap-[24px] text-[16px] text-[#131416] leading-[1.5]">
                <div>
                  <p>안녕하세요. 광명 스마트데이터포털 운영팀입니다.</p>
                  <p className="h-[24px]" aria-hidden="true">&nbsp;</p>
                  <p>안정적인 서비스 제공을 위해 아래와 같이 시스템 정기 점검을 진행합니다.</p>
                </div>

                <div className="flex flex-col gap-[10px]">
                  <div className="flex gap-[8px]"><span className="font-semibold shrink-0">점검 일시 :</span><span>2026년 5월 20일 22:00 ~ 24:00</span></div>
                  <div className="flex gap-[8px]"><span className="font-semibold shrink-0">점검 대상 :</span><span>데이터 지도, 데이터 목록, 연관플랫폼 일부 기능</span></div>
                  <div className="flex gap-[8px]"><span className="font-semibold shrink-0">점검 영향 :</span><span>점검 시간 동안 일부 메뉴 접속이 원활하지 않을 수 있습니다.</span></div>
                </div>

                <div>
                  <p>이용에 불편을 드려 죄송합니다.</p>
                  <p>보다 안정적인 서비스 제공을 위해 최선을 다하겠습니다.</p>
                </div>

                {/* 점검 정보 콜아웃 */}
                <div className="bg-[#F6F9FF] border border-[#E5ECF9] rounded-[6px] px-[19px] py-[19px]">
                  <div className="flex gap-[6px] items-center mb-[16px]">
                    <Info size={20} className="text-[#0B50D0]" />
                    <span className="text-[16px] font-semibold text-[#0B50D0]">점검 정보</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[8px] gap-x-[40px] text-[14px] text-[#131416]">
                    <div className="flex gap-[16px]"><span className="font-semibold w-[56px] shrink-0">점검 일시</span><span>2026.05.20　22:00~24:00</span></div>
                    <div className="flex gap-[16px]"><span className="font-semibold w-[56px] shrink-0">점검 대상</span><span>데이터 지도, 데이터 목록, 연관 플랫폼</span></div>
                    <div className="flex gap-[16px]"><span className="font-semibold w-[56px] shrink-0">영향 범위</span><span>일부 메뉴 접속 지연</span></div>
                    <div className="flex gap-[16px]"><span className="font-semibold w-[56px] shrink-0">문의</span><span>광명 스마트데이터포털 운영관리자</span></div>
                  </div>
                </div>
              </div>

              {/* 첨부파일 */}
              <div className="border-t border-[#E6E8EA]">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-stretch h-[50px] border-b border-[#E6E8EA] last:border-b-0">
                    <div className="w-[120px] shrink-0 flex items-center pl-[39px] border-r border-[#E6E8EA]">
                      {idx === 0 && <span className="text-[14px] font-semibold text-[#131416]">첨부파일</span>}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-[16px] pl-[19px] pr-[20px]">
                      <span className="text-[14px] font-medium text-[#131416] truncate">{file.name}</span>
                      <div className="flex items-center gap-[16px] shrink-0">
                        <span className="text-[14px] text-[#131416]">{file.size}</span>
                        <span className={`inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[13px] border ${file.cls}`}>{file.type}</span>
                        <button
                          onClick={() => onShowToast?.(`'${file.name}' 다운로드를 시작합니다.`)}
                          className="h-[32px] px-[10px] rounded-[4px] border border-[var(--gp-primary)] bg-white text-[var(--gp-primary)] text-[14px] font-medium flex items-center gap-[4px] hover:bg-[var(--gp-primary-soft)] transition-colors"
                        >
                          <Download size={16} /> 다운로드
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 이전 글 / 다음 글 */}
          <div className="border border-[#E6E8EA] rounded-[12px] bg-white overflow-hidden">
            {[
              { label: '이전 글', title: '데이터지도 메뉴 일부 지표 갱신 안내' },
              { label: '다음 글', title: '연관플랫폼 외부 링크 이동 안내' },
            ].map((nav, idx) => (
              <div
                key={idx}
                onClick={() => onShowToast?.(`'${nav.title}' 글로 이동합니다.`)}
                className={`flex items-center h-[42px] cursor-pointer hover:bg-[var(--bg-subtle)] ${idx === 0 ? 'border-b border-[#E6E8EA]' : ''}`}
              >
                <div className="w-[120px] shrink-0 flex items-center pl-[39px] border-r border-[#E6E8EA] h-full">
                  <span className="text-[14px] font-semibold text-[#131416]">{nav.label}</span>
                </div>
                <span className="flex-1 pl-[19px] text-[14px] font-medium text-[#131416] truncate">{nav.title}</span>
                <ChevronRight size={18} className="mr-[24px] text-[#8A949E] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-[12px] items-center">
          <button
            onClick={() => onShowToast?.('이전 글로 이동합니다.')}
            className="h-[48px] px-[24px] rounded-[8px] border border-[var(--gp-primary)] bg-white text-[var(--gp-primary)] text-[16px] font-semibold flex items-center gap-[8px] hover:bg-[var(--gp-primary-soft)] transition-colors"
          >
            이전글 보기 <ChevronRight size={18} />
          </button>
          <button
            onClick={() => onNavigate?.('notice')}
            className="h-[48px] px-[30px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
