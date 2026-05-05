import { useNavigate, useLocation } from 'react-router-dom';

function maskEmail(email: string): string {
  const atIdx = email.indexOf('@');
  return `${email.substring(0, 2)}****${email.substring(atIdx)}`;
}

export default function SearchEmailResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string | undefined;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-4 h-[56px] border-b border-black/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-xl">‹</button>
        <h1 className="text-[17px] font-bold ml-2">이메일 찾기</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-4 py-6">
        <div className="w-full max-w-[361px] mx-auto flex flex-col">

          <p className="text-[18px] font-bold">발견된 이메일</p>
          <p className="text-[17px] mt-5 leading-relaxed">
            안녕하세요, 회원님의 이메일은<br />
            {email ? maskEmail(email) : '-'} 입니다.
          </p>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-8 active:opacity-80 transition-opacity"
          >
            로그인 화면으로
          </button>

        </div>
      </div>
    </div>
  );
}
