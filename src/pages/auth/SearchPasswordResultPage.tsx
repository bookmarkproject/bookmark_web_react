import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/api/authApi';

export default function SearchPasswordResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const changePasswordToken = location.state?.changePasswordToken as string | undefined;

  const { toast, showToast } = useToast();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!password) { showToast('비밀번호를 입력해주세요.', true); return; }
    if (password !== passwordConfirm) { showToast('비밀번호가 일치하지 않습니다.', true); return; }
    if (!changePasswordToken) { showToast('인증 정보가 없습니다. 다시 시도해주세요.', true); return; }

    setLoading(true);
    try {
      await authApi.changePassword(password, changePasswordToken);
      showToast('비밀번호가 변경되었습니다.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (e: any) {
      showToast(e.response?.data?.message || '비밀번호 변경에 실패했습니다.', true);
    } finally {
      setLoading(false);
    }
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

          <p className="text-[18px] font-bold">새 비밀번호 입력</p>

          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white"
          />
          <p className="text-[10px] text-black/50 leading-relaxed -mt-2">
            비밀번호는 영어, 숫자, 특수문자(!@#$%^&*())를 1개 이상 포함하여 8~16자로 입력 해야합니다.
          </p>

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white"
          />

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-8 disabled:opacity-50 active:opacity-80 transition-opacity"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>

        </div>
      </div>

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}
