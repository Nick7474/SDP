import { useState } from 'react';
import { Info } from 'lucide-react';
import Checkbox from './Checkbox';

interface LoginProps {
  onShowToast?: (msg: string) => void;
  onLoginSuccess?: () => void;
}

// 프로토타입 데모 계정 (백엔드 인증 API 연동 시 이 검증부를 교체)
const DEMO_ID = 'admin';
const DEMO_PW = '1234';

export default function Login({ onShowToast, onLoginSuccess }: LoginProps) {
  const [remember, setRemember] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (userId.trim() === DEMO_ID && userPw === DEMO_PW) {
      setError(false);
      // 포털 관리자 세션 플래그 저장 (Admin 접근 가드에서 확인)
      sessionStorage.setItem(
        'sdp-admin-auth',
        JSON.stringify({ user: userId, role: '포털 관리자', at: new Date().toISOString() })
      );
      onShowToast?.('로그인되었습니다.');
      onLoginSuccess?.();
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full bg-[#EBEEF2] py-[60px] px-4 flex justify-center font-pretendard-gov">
      <div className="w-[470px] max-w-full bg-white rounded-[16px] p-[40px] shadow-[0_4px_20px_rgba(22,36,59,0.06)]">
        {/* Title */}
        <h1 className="text-[24px] font-bold text-[#16243B]">로그인</h1>
        <p className="text-[14px] text-[#5A6878] mt-[6px] mb-[28px]">광명 스마트데이터포털에 오신 것을 환영합니다.</p>

        {/* 아이디 */}
        <label className="block text-[14px] font-semibold text-[#16243B] mb-[8px]">아이디</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => { setUserId(e.target.value); if (error) setError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          placeholder="아이디를 입력하세요"
          className="w-full h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)] mb-[20px]"
        />

        {/* 비밀번호 */}
        <label className="block text-[14px] font-semibold text-[#16243B] mb-[8px]">비밀번호</label>
        <input
          type="password"
          value={userPw}
          onChange={(e) => { setUserPw(e.target.value); if (error) setError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          placeholder="비밀번호를 입력하세요"
          className="w-full h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)] mb-[16px]"
        />

        {/* 오류 메시지 */}
        {error && (
          <p className="text-[13px] text-[#D64550] mb-[12px]">아이디 또는 비밀번호가 올바르지 않습니다.</p>
        )}

        {/* 아이디 저장 */}
        <label className="flex items-center gap-[8px] mb-[20px] cursor-pointer w-fit">
          <Checkbox checked={remember} onChange={setRemember} />
          <span className="text-[14px] text-[#5A6878]">아이디 저장</span>
        </label>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
        >
          로그인
        </button>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center gap-[12px] mt-[28px] text-[14px] text-[#5A6878]">
          <button onClick={() => onShowToast?.('아이디 찾기 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">아이디 찾기</button>
          <span className="w-px h-[12px] bg-[#CDD1D5]" />
          <button onClick={() => onShowToast?.('비밀번호 찾기 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">비밀번호 찾기</button>
          <span className="w-px h-[12px] bg-[#CDD1D5]" />
          <button onClick={() => onShowToast?.('회원가입 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">회원가입</button>
        </div>

        {/* 테스트 계정 안내 */}
        <div className="flex items-center justify-center gap-[6px] mt-[20px] text-[13px] text-[#8A949E]">
          <Info size={14} className="shrink-0" />
          <span>테스트 계정 &nbsp;·&nbsp; 아이디: <b className="text-[#5A6878]">admin</b> &nbsp;/&nbsp; 비밀번호: <b className="text-[#5A6878]">1234</b></span>
        </div>
      </div>
    </div>
  );
}
