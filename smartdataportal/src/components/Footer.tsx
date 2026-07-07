export default function Footer() {
  return (
    <footer className="bg-[#3B3E43] border-t border-[#4B4E53] h-[110px] w-full flex items-center">
      <div className="max-w-[1440px] w-full mx-auto px-4 min-[1440px]:px-0 flex items-center">
        {/* Logo */}
        <img 
          src="/images/logo_footer.png" 
          alt="광명시" 
          className="h-[46px] object-contain shrink-0" 
        />
        {/* Text Area */}
        <div className="ml-[80px] flex flex-col justify-center gap-[10px] font-pretendard-gov text-left shrink-0">
          <div className="text-[12px] text-[#A3A5A8] leading-none font-normal">
            우)14234|경기도 광명시 시청로 20| 광명시 민원콜센터: 1688-3399 (02-2680-2114)
          </div>
          <div className="text-[12px] text-[#838588] leading-none font-normal tracking-wide">
            COPYRIGHT(C) 2022 GWANGMYEONG CITY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}

