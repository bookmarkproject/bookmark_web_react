import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import LoginTextField from '@/components/LoginTextField';
import LoginButton from '@/components/LoginButton';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/authSlice';
import { setMember } from '@/store/memberSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast, showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) { showToast('이메일을 입력해주세요.', true); return; }
    if (!password) { showToast('비밀번호를 입력해주세요.', true); return; }
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      dispatch(setAccessToken(res.data.accessToken));
      dispatch(setMember(res.data));
      showToast('로그인에 성공했습니다.');
      setTimeout(() => navigate('/home', { replace: true }), 500);
    } catch (e: any) {
      showToast(e.response?.data?.message || '로그인에 실패했습니다.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-5 overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-[361px] mt-16">

        {/* 로고 + 앱명 */}
        <img src={logo} alt="책갈피 로고" className="w-[55px] h-[55px]" style={{ filter: 'invert(23%) sepia(95%) saturate(2000%) hue-rotate(230deg) brightness(80%)' }} />
        <p className="text-[20px] font-bold mt-2" style={{ letterSpacing: '4px' }}>
          책갈피
        </p>

        {/* 슬로건 */}
        <p
          className="text-[28px] font-bold text-center mt-8"
          style={{ letterSpacing: '-1.4px', lineHeight: '1.35' }}
        >
          지금 바로<br />나의 독서를 기록하세요!
        </p>

        {/* 입력 필드 */}
        <div className="flex flex-col items-center gap-[15px] w-full mt-8">
          <LoginTextField
            hintText="이메일"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <LoginTextField
            hintText="비밀번호"
            value={password}
            onChange={setPassword}
            type="password"
            onEnter={handleLogin}
          />
        </div>

        {/* 버튼 목록 */}
        <div className="flex flex-col items-center gap-3 w-full mt-8">
          <LoginButton
            text={loading ? '로그인 중...' : '로그인'}
            onClick={handleLogin}
            backgroundColor="#4E3CDB"
            textColor="#ffffff"
            disabled={loading}
          />
          <LoginButton
            text="이메일을 잊으셨나요?"
            onClick={() => navigate('/search/email')}
            backgroundColor="rgba(0,0,0,0.04)"
            textColor="#000000"
          />
          <LoginButton
            text="비밀번호를 잊으셨나요?"
            onClick={() => navigate('/search/password')}
            backgroundColor="rgba(245,245,245,0.5)"
            textColor="#000000"
          />
          <LoginButton
            text="회원가입"
            onClick={() => navigate('/signup')}
            backgroundColor="#ffffff"
            textColor="#000000"
            border="0.5px solid rgba(0,0,0,0.2)"
          />
        </div>

      </div>
      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}
