import { useState } from 'react';
import { Search, ChevronRight, ExternalLink, Activity, Users, Map, Database, FileText } from 'lucide-react';

const frequentPlatforms = [
  {
    title: '광명시 건물에너지정보 플랫폼',
    desc: '광명시 내 건축물 에너지 사용 현황과 탄소배출 관련 정보를 확인할 수 있는 플랫폼입니다.',
    tags: ['에너지', '건물', '탄소배출'],
    icon: <img src="/icons/icon_platform_building.svg" alt="건물에너지" className="w-[64px] h-[80px]" />,
  },
  {
    title: '기후의병',
    desc: '광명시민이 생활 속 탄소중립 활동에 참여하고 실천 정보를 확인할 수 있는 시민참여 플랫폼입니다.',
    tags: ['시민참여', '탄소저감', '기후행동'],
    icon: <img src="/icons/icon_platform_citizen.svg" alt="기후의병" className="w-[64px] h-[80px]" />,
  },
  {
    title: '광명 시티맵',
    desc: '광명시의 공간 정보와 도시 시설 정보를 지도 기반으로 확인할 수 있는 플랫폼입니다.',
    tags: ['지도', '공간정보', '도시시설'],
    icon: <img src="/icons/icon_platform_map.svg" alt="시티맵" className="w-[64px] h-[80px]" />,
  },
  {
    title: '공공데이터포털',
    desc: '정부의 공공기관이 개방하는 다양한 공공데이터를 검색하고 활용할 수 있는 국가 데이터 포털입니다.',
    tags: ['공공데이터', 'API', '데이터 개방'],
    icon: <img src="/icons/icon_platform_data.svg" alt="공공데이터" className="w-[64px] h-[80px]" />,
  },
];

const filters = [
  { id: 'all', label: '전체' },
  { id: 'gm', label: '광명시 플랫폼' },
  { id: 'public', label: '공공 데이터' },
  { id: 'policy', label: '정책·통계' },
  { id: 'smart', label: '스마트도시' },
  { id: 'citizen', label: '시민참여' },
  { id: 'carbon', label: '탄소저감 실천기관' },
];

const categoryData = [
  {
    category: 'A',
    title: '광명시 플랫폼',
    platforms: [
      {
        title: '광명시 건물에너지정보 플랫폼',
        desc: '광명시 건축물의 에너지 사용과 탄소배출 정보를 확인할 수 있습니다.',
        tags: ['에너지', '건물', '탄소배출'],
        relatedMenu: 'Energy Mile',
      },
      {
        title: '기후의병',
        desc: '광명시민의 탄소중립 실천 활동과 시민참여 프로그램을 안내합니다.',
        tags: ['시민참여', '기후행동', '탄소저감'],
        relatedMenu: '개인탄소저감활동',
      },
      {
        title: '광명시티맵',
        desc: '광명시 공간정보와 도시 시설 정보를 지도 기반으로 확인할 수 있습니다.',
        tags: ['지도', '공간정보', '도시시설'],
        relatedMenu: '데이터시각화',
      },
    ]
  },
  {
    category: 'B',
    title: '공공 데이터 플랫폼',
    platforms: [
      {
        title: '공공 데이터 포털',
        desc: '국가 및 공공기관이 개방하는 데이터와 API를 통해 확인할 수 있습니다.',
        tags: ['공공데이터', 'API', '데이터개방'],
        relatedMenu: '데이터목록',
      },
      {
        title: '광명시티맵',
        desc: '광명시 공간정보와 도시 시설 정보를 지도 기반으로 확인할 수 있습니다.',
        tags: ['지도', '공간정보', '도시시설'],
        relatedMenu: '데이터시각화',
      },
    ]
  },
  {
    category: 'C',
    title: '정책·통계 플랫폼',
    platforms: [
      {
        title: 'KOSIS 국가통계포털',
        desc: '인구, 산업, 환경 등 국가 통계를 확인할 수 있는 통계 플랫폼입니다.',
        tags: ['통계', '인구', '정책자료'],
        relatedMenu: '정책 참고',
      },
      {
        title: '건축도시정책정보센터',
        desc: '건축·도시 정책과 관련된 연구자료와 정책 동향을 확인할 수 있습니다.',
        tags: ['건축', '도시정책', '연구자료'],
        relatedMenu: '개인탄소저감활동',
      },
    ]
  },
  {
    category: 'D',
    title: '스마트도시 / 데이터허브',
    platforms: [
      {
        title: '스마트시티 코리아',
        desc: '국내 스마트도시 정책과 사업 정보를 확인할 수 있는 플랫폼입니다.',
        tags: ['스마트도시', '정책', '사례'],
        relatedMenu: '강소형스마트도시 광명',
      },
      {
        title: '대구 데이터허브 플랫폼',
        desc: '지자체 데이터허브의 데이터 기반 활용 사례를 참고할 수 있습니다.',
        tags: ['데이터허브', '지자체', '벤치마킹'],
        relatedMenu: '데이터시각화',
      },
      {
        title: '스마트시티 코리아',
        desc: '국내 스마트도시 정책과 사업 정보를 확인할 수 있는 플랫폼입니다.',
        tags: ['스마트도시', '정책', '사례'],
        relatedMenu: '강소형스마트도시 광명',
      },
    ]
  }
];

const allPlatforms = [
  { name: '공공데이터포털', category: '공공 데이터', providedInfo: '공공데이터 · API', relatedMenu: '데이터 목록' },
  { name: '광명시 건물에너지정보 플랫폼', category: '광명시 플랫폼', providedInfo: '건물에너지 · 탄소배출', relatedMenu: 'Energy Mile' },
  { name: '기후의병', category: '시민참여', providedInfo: '탄소저감 실천 활동', relatedMenu: '시민탄소저감활동' },
  { name: '광명역 태양광 발전량 데이터', category: '지도', providedInfo: '공간정보 · 도시시설', relatedMenu: '데이터 시각화' },
  { name: '광명역 태양광 발전량 데이터', category: '정책 · 통계', providedInfo: '국가통계', relatedMenu: '정책 참고' },
];

const tagColors = [
  { text: '#FF910F', bg: '#FFF0DE' }, // orange
  { text: '#3FA654', bg: '#EAF6EC' }, // green
  { text: '#7F42E9', bg: '#F7F0FC' }, // purple
  { text: '#614100', bg: '#FFF3DB' }, // brown
  { text: '#1F687A', bg: '#EDF6F8' }, // dark cyan
  { text: '#256EF4', bg: '#ECF2FE' }, // blue
];

const getBadgeStyle = (tag: string) => {
  const predefinedMap: Record<string, number> = {
    '에너지': 5,
    '건물': 1,
    '탄소배출': 0,
    '시민참여': 5,
    '기후행동': 1,
    '탄소저감': 0,
    '공공데이터': 5,
    'API': 1,
    '데이터개방': 0,
    '지도': 5,
    '공간정보': 1,
    '도시시설': 0,
    '통계': 2,
    '인구': 3,
    '정책자료': 4,
    '건축': 2,
    '도시정책': 3,
    '연구자료': 4,
    '스마트도시': 5,
    '정책': 1,
    '사례': 0,
    '데이터허브': 2,
    '지자체': 3,
    '벤치마킹': 4,
  };
  
  const idx = predefinedMap[tag];
  if (idx !== undefined) {
    const color = tagColors[idx];
    return { color: color.text, backgroundColor: color.bg };
  }
  
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = tagColors[Math.abs(hash) % tagColors.length];
  return { color: color.text, backgroundColor: color.bg };
};

export default function RelatedPlatforms() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="w-full bg-[var(--bg-page)] pb-20 font-pretendard-gov">
      {/* Banner */}
      <div 
        className="w-full h-[280px] relative flex items-center mb-[40px] border-b border-[var(--border-1)]"
        style={{
          background: "url('/images/banner_bg_연관플랫폼.svg') no-repeat right center / cover",
          backgroundColor: '#F5F8FC'
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-0 relative z-10 flex flex-col gap-[8px] pl-4 lg:pl-0">
          <h1 className="text-[40px] font-bold text-[var(--fg-1)] font-score">
            연관플랫폼
          </h1>
          <p className="text-[16px] text-[var(--fg-3)] leading-relaxed font-score">
            광명 스마트데이터포털과 연결된 데이터, 정책, 시민참여, 스마트도시 플랫폼을 한곳에서 확인하세요.
            <br />
            탄소중립 스마트도시 데이터를 중심으로 다양한 공공 플랫폼과 연결됩니다.
            <br />
            필요한 사이트로 분류별로 탐색하고 외부 플랫폼으로 바로 이동할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-0 flex flex-col">
        
        {/* 자주 찾는 연계 플랫폼 */}
        <section>
          <div className="mb-6">
            <h2 className="text-[24px] font-bold text-[var(--fg-1)] mb-[4px]">자주 찾는 연계 플랫폼</h2>
            <p className="text-[var(--fg-3)] text-[16px]">광명 스마트데이터포털과 가장 밀접하게 연결되는 주요 플랫폼을 빠르게 연결하세요.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frequentPlatforms.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[12px] border border-[var(--border-1)] p-[16px] flex flex-col hover:shadow-lg transition-shadow duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-[var(--fg-1)] mb-2 break-keep">{item.title}</h3>
                    <p className="text-[14px] text-[var(--fg-3)] leading-relaxed break-keep">{item.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-[8px] py-[4px] text-[12px] font-semibold rounded-[4px]" style={getBadgeStyle(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="gp-btn gp-btn--secondary w-full justify-center" style={{ height: '36px', minHeight: '36px' }}>
                  바로가기
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Search & Filter - using gp styles */}
        <section className="mt-[70px] mb-[32px]">
          <div className="w-full border border-[var(--border-1)] rounded-[12px] bg-white px-[32px] py-[39px] flex flex-col items-center gap-[32px]">
            {/* Search row */}
            <div className="flex items-center gap-[8px] w-full justify-center">
              <div className="gp-searchfield w-full max-w-[560px]">
                <input
                  type="text"
                  placeholder="플랫폼명 또는 키워드를 검색하세요"
                />
                <Search className="gp-ico" size={20} />
              </div>
              <button className="gp-btn gp-btn--primary gp-btn--h48 shrink-0" style={{ padding: '0 40px' }}>검색</button>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-[32px] py-[8px] rounded-[8px] border text-[16px] transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-[var(--gp-primary)] text-white border-[var(--gp-primary)] font-semibold'
                      : 'bg-white text-[#464C53] border-[#CDD1D5] font-normal hover:border-[var(--gp-primary)] hover:text-[var(--gp-primary)]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 분류별 플랫폼 찾기 */}
        <section>
          <div className="mb-6">
            <h2 className="text-[24px] font-bold text-[var(--fg-1)] mb-[4px]">분류별 플랫폼 찾기</h2>
            <p className="text-[var(--fg-3)] text-[16px]">목적에 맞는 플랫폼을 선택해 관련 정보를 확인하세요.</p>
          </div>

          <div className="flex flex-wrap gap-4 xl:gap-[6px]">
            {categoryData.map((cat, idx) => (
              <div key={idx} className={`bg-[var(--light-primary-50,#ECF2FE)] rounded-[8px] p-[16px] border border-[var(--border-1)] w-full ${cat.platforms.length === 3 ? 'xl:w-[856px]' : 'xl:w-[578px]'}`}>
                <div className="flex items-center gap-3 mb-[12px]">
                  <span className="w-[24px] h-[24px] flex items-center justify-center bg-[var(--gp-primary)] text-white font-semibold text-[16px] rounded-[4px]">
                    {cat.category}
                  </span>
                  <h3 className="font-semibold text-[16px] text-[var(--gp-primary)]">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-[12px]">
                  {cat.platforms.map((plat, pIdx) => (
                    <div key={pIdx} className="bg-white rounded-[12px] border border-[var(--border-1)] p-[16px] flex flex-col hover:border-[var(--gp-primary)] transition-colors hover:shadow-md group h-full w-full sm:w-[266px]">
                      <h4 className="font-semibold text-[18px] text-[var(--fg-1)] mb-[2px] break-keep">{plat.title}</h4>
                      <p className="text-[14px] font-normal text-[var(--fg-3)] leading-relaxed mb-[8px] break-keep">{plat.desc}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-[16px]">
                         {plat.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-[8px] py-[4px] text-[12px] font-semibold rounded-[4px]" style={getBadgeStyle(tag)}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto text-[13px] font-medium text-[var(--fg-1)] mb-4 flex items-center gap-2 border-t border-[var(--border-1)] pt-4">
                        <span className="px-[8px] py-[4px] text-[12px] font-semibold rounded-[4px] bg-[#F4F5F6] text-[#58616A]">관련 메뉴</span>
                        {plat.relatedMenu}
                      </div>

                      <button className="gp-btn gp-btn--secondary gp-btn--sm w-full justify-center">
                        바로가기
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 연계 다이어그램 */}
        <section className="bg-[#F3FAFF] rounded-[12px] pl-[56px] pr-10 h-[202px] flex items-center justify-between overflow-hidden relative my-[60px]">
          <div className="relative z-10">
            <h2 className="text-[20px] font-bold text-[var(--fg-1)] mb-[4px] leading-tight whitespace-nowrap">광명 스마트데이터포털은 다양한 플랫폼과 데이터를 연결합니다.</h2>
            <p className="text-[var(--fg-3)] text-[16px] leading-relaxed">
              공공 데이터, 광명시 서비스, 시민참여 플랫폼, 정책·통계 자료는<br />
              광명 스마트데이터포털의 데이터 탐색과 시각화 경험으로 연결됩니다.
            </p>
          </div>
          
          <div className="relative h-full flex items-center justify-end z-10 pl-6">
             <img src="/images/img_platform.svg" alt="플랫폼 연결 다이어그램" className="h-[140px] w-auto object-contain" />
          </div>
        </section>

        {/* 전체 연관 플랫폼 테이블 */}
        <section>
           <div className="mb-6">
            <h2 className="text-[24px] font-bold text-[var(--fg-1)] mb-[4px]">전체 연관 플랫폼</h2>
            <p className="text-[var(--fg-3)] text-[16px]">광명 스마트데이터포털과 관련된 플랫폼을 분류별로 확인하고 외부 사이트로 이동할 수 있습니다.</p>
          </div>

          <div className="gp-table-container bg-white">
            <table className="gp-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>플랫폼명</th>
                  <th style={{ width: '18%' }}>분류</th>
                  <th style={{ width: '22%' }}>제공 정보</th>
                  <th style={{ width: '18%' }}>관련 메뉴</th>
                  <th style={{ width: '12%', textAlign: 'center' }}>이동</th>
                </tr>
              </thead>
              <tbody>
                {allPlatforms.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-[var(--fg-1)]">{row.name}</td>
                    <td>{row.category}</td>
                    <td>{row.providedInfo}</td>
                    <td>{row.relatedMenu}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="gp-btn gp-btn--secondary gp-btn--sm whitespace-nowrap inline-flex items-center justify-center mx-auto">
                        바로가기
                        <ExternalLink size={14} className="ml-1 shrink-0" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
