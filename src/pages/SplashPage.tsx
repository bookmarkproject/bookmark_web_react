import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { memberApi } from '@/api/memberApi';
import { setMember } from '@/store/memberSlice';

export default function SplashPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  useEffect(() => {
    const init = async () => {
      if (!refreshToken) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const res = await memberApi.getMe();
        dispatch(setMember(res.data));
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
