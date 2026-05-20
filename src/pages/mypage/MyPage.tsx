import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearAccessToken } from '@/store/authSlice';
import { clearMember } from '@/store/memberSlice';
import { clearBookRecords } from '@/store/bookRecordSlice';
import { memberApi } from '@/api/memberApi';
import BottomNavBar from '@/components/BottomNavBar';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

type ModalType = 'support' | 'withdraw' | null;

export default function MyPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const member = useAppSelector((s) => s.member.member);
  const { toast, showToast } = useToast();

  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchProfileUrl();
  }, []);

  const fetchProfileUrl = async () => {
    try {
      const res = await memberApi.getProfileImageUrl();
      setProfileUrl(res.data as string);
    } catch {
      setProfileUrl(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await memberApi.uploadProfileImage(formData);
      const res = await memberApi.getProfileImageUrl();
      setProfileUrl(res.data as string);
      showToast('저장되었습니다.');
    } catch {
      showToast('이미지 업로드에 실패했습니다.', true);
    }
    e.target.value = '';
  };

  const handleLogout = () => {
    dispatch(clearAccessToken());
    dispatch(clearMember());
    dispatch(clearBookRecords());
    navigate('/login', { replace: true });
  };

  const handleWithdraw = async () => {
    if (!member) return;
    setWithdrawing(true);
    try {
      await memberApi.deleteAccount(member.id);
      dispatch(clearAccessToken());
      dispatch(clearMember());
      dispatch(clearBookRecords());
      navigate('/login', { replace: true });
    } catch {
      showToast('회원탈퇴에 실패했습니다.', true);
    } finally {
      setWithdrawing(false);
      setModal(null);
    }
  };

  const MENUS = [
    {
      icon: <BookIcon />,
      title: '기록 중인 책 보기',
      onTap: () => navigate('/book/record'),
    },
    {
      icon: <SupportIcon />,
      title: '고객 센터',
      onTap: () => setModal('support'),
    },
    {
      icon: <PrivacyIcon />,
      title: '개인 정보 수집 및 이용',
      onTap: () => navigate('/mypage/privacy'),
    },
    {
      icon: <LogoutIcon />,
      title: '로그아웃',
      onTap: handleLogout,
    },
    {
      icon: <WithdrawIcon />,
      title: '회원탈퇴',
      onTap: () => setModal('withdraw'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center justify-center h-[56px] shrink-0">
        <h1 className="text-[17px] font-bold text-white">마이 페이지</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="w-full max-w-[361px] mx-auto flex flex-col items-center">

          {loadingProfile ? (
            <div className="mt-10 w-20 h-20 rounded-full bg-black/10 animate-pulse" />
          ) : (
            <div className="mt-10 relative">
              {/* 프로필 이미지 */}
              <div
                className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
                onClick={handleImageClick}
              >
                {profileUrl ? (
                  <img src={profileUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PersonIcon />
                  </div>
                )}
              </div>
              {/* 편집 버튼 */}
              <button
                onClick={handleImageClick}
                className="absolute bottom-0.5 right-1 bg-black/60 rounded-lg p-1"
              >
                <EditIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* 닉네임 */}
          <p className="mt-1.5 text-[28px] font-bold tracking-[-0.56px] text-black">
            {member?.nickname ?? '알 수 없음'}
          </p>

          {/* 이름 + 이메일 */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[14px] text-black/60">{member?.name ?? ''}</span>
            <span className="text-[14px] text-black/60">{member?.email ?? ''}</span>
          </div>

          {/* 구분선 */}
          <div className="w-full mt-5 border-t border-[rgba(110,80,73,0.2)]" />

          {/* 메뉴 */}
          <div className="w-full flex flex-col">
            {MENUS.map((menu) => (
              <button
                key={menu.title}
                onClick={menu.onTap}
                className="flex items-center gap-4 w-full text-left mt-6 px-2.5"
              >
                <span className="text-black">{menu.icon}</span>
                <span className="text-[18px] font-bold tracking-[-0.36px] text-black">
                  {menu.title}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <BottomNavBar currentIndex={3} />

      {/* 고객 센터 모달 */}
      {modal === 'support' && (
        <BottomSheet onClose={() => setModal(null)}>
          <div className="flex items-center gap-4">
            <MailIcon />
            <span className="text-[15px] font-bold">Gmail : bookmarkapp2025@gmail.com</span>
          </div>
          <button
            onClick={() => setModal(null)}
            className="mt-4 w-full h-10 rounded-lg bg-gray-200 text-black font-bold text-[14px]"
          >
            닫기
          </button>
        </BottomSheet>
      )}

      {/* 회원탈퇴 모달 */}
      {modal === 'withdraw' && (
        <BottomSheet onClose={() => setModal(null)}>
          <div className="flex items-start gap-3">
            <WarningIcon />
            <p className="text-[15px] font-bold leading-snug">
              회원 탈퇴시 저장된 모든 데이터가 삭제됩니다.{'\n'}회원 탈퇴를 진행하시겠습니까?
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-5">
            <button
              onClick={() => setModal(null)}
              className="px-6 h-10 rounded-lg bg-gray-200 text-black font-bold text-[14px]"
            >
              취소
            </button>
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="px-6 h-10 rounded-lg bg-[#4E3CDB] text-white font-bold text-[14px] disabled:opacity-50"
            >
              {withdrawing ? '처리 중...' : '확인'}
            </button>
          </div>
        </BottomSheet>
      )}

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}

function BottomSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] px-5 py-6 max-w-[430px] mx-auto">
        {children}
      </div>
    </>
  );
}

/* ── 아이콘 ── */
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
    </svg>
  );
}
function PrivacyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  );
}
function WithdrawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zM2 18c0 2 2 4 8 4s8-2 8-4v-2H2v2z" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-white">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0 text-orange-500">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}
