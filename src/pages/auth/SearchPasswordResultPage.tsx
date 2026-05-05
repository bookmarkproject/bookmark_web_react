import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPasswordResultPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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
            onClick={() => {}}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-8 active:opacity-80 transition-opacity"
          >
            비밀번호 변경
          </button>

        </div>
      </div>
    </div>
  );
}
