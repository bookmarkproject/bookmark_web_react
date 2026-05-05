import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchEmailPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

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

          <p className="text-[18px] font-bold">이름을 입력하세요</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white"
            />
          </div>

          <p className="text-[18px] font-bold mt-6">휴대폰 번호를 입력하세요</p>
          <div className="mt-4">
            <input
              type="tel"
              placeholder="010xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="w-full h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white"
            />
          </div>

          <button
            onClick={() => {}}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-12 active:opacity-80 transition-opacity"
          >
            이메일 찾기
          </button>

        </div>
      </div>
    </div>
  );
}
