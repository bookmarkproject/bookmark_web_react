import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { memberApi } from '@/api/memberApi';
import { useMemberStore } from '@/store/memberStore';

export default function SplashPage() {
  const navigate = useNavigate();
  const { refreshToken } = useAuthStore();
  const { setMember } = useMemberStore();

  useEffect(() => {
    const init = async () => {
      if (!refreshToken) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const res = await memberApi.getMe();
        setMember(res.data);
        navigate('/home', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    };
    init();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <p className="text-[#4E3CDB] text-2xl font-bold">Bookmark</p>
    </div>
  );
}
