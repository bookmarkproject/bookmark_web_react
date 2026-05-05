import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { mailApi } from '@/api/mailApi';

export default function SearchPasswordPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [changePasswordToken, setChangePasswordToken] = useState('');

  const handleSendVerification = async () => {
    if (!email) { showToast('이메일을 입력해주세요.', true); return; }
    try {
      await mailApi.sendVerification(email);
      showToast('인증번호가 발송되었습니다.');
    } catch {
      showToast('인증번호 발송에 실패했습니다.', true);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) { showToast('인증번호를 입력해주세요.', true); return; }
    try {
      const res = await mailApi.checkCode(email, code, 'passwordChange');
      if (res.data.isVerified && res.data.passwordChangeToken) {
        setIsEmailVerified(true);
        setChangePasswordToken(res.data.passwordChangeToken);
        showToast('인증되었습니다.');
      } else {
        showToast('인증에 실패했습니다.', true);
      }
    } catch {
      showToast('인증에 실패했습니다.', true);
    }
  };

  const handleSubmit = () => {
    if (!name) { showToast('이름을 입력해주세요.', true); return; }
    if (!isEmailVerified) { showToast('이메일 인증을 진행해주세요.', true); return; }
    navigate('/search/password/result', {
      replace: true,
      state: { changePasswordToken },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-4 h-[56px] border-b border-black/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-xl">‹</button>
        <h1 className="text-[17px] font-bold ml-2">비밀번호 찾기</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-4 py-6">
        <div className="w-full max-w-[361px] mx-auto flex flex-col gap-4">

          {/* 이름 */}
          <p className="text-[18px] font-bold">이름을 입력하세요</p>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white"
          />

          {/* 이메일 */}
          <p className="text-[18px] font-bold mt-2">이메일을 입력하세요</p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailVerified}
              className="flex-1 h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white disabled:bg-black/5 disabled:text-black/40"
            />
            <button
              onClick={handleSendVerification}
              disabled={isEmailVerified}
              className="h-[48px] px-4 rounded-[12px] bg-[#4E3CDB] text-white text-[15px] font-bold whitespace-nowrap disabled:opacity-50 active:opacity-80 transition-opacity"
            >
              인증 요청
            </button>
          </div>

          {/* 인증번호 */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEmailVerified}
              className="flex-1 h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white disabled:bg-black/5 disabled:text-black/40"
            />
            <button
              onClick={handleVerifyCode}
              disabled={isEmailVerified}
              className="h-[48px] px-4 rounded-[12px] bg-[#4E3CDB] text-white text-[15px] font-bold whitespace-nowrap disabled:opacity-50 active:opacity-80 transition-opacity"
            >
              인증
            </button>
          </div>

          {isEmailVerified && (
            <p className="text-[13px] text-[#4E3CDB] font-medium">✓ 이메일 인증 완료</p>
          )}

          {/* 비밀번호 찾기 버튼 */}
          <button
            onClick={handleSubmit}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-8 active:opacity-80 transition-opacity"
          >
            비밀번호 찾기
          </button>

        </div>
      </div>

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}
