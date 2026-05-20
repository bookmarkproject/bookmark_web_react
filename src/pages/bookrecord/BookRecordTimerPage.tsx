import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';

export default function BookRecordTimerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const bookRecord = location.state?.bookRecord as BookRecord | undefined;

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
    setIsStart(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const firstButtonLabel = !isStart
    ? '독서 시작하기'
    : isRunning
    ? '독서 잠시 쉬기'
    : '독서 이어하기';

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigate(`/book/record/${id}/write`, { state: { bookRecord, seconds } });
  };

  if (!bookRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/30 text-[15px]">독서 기록 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center px-4 h-[56px] shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white text-xl">‹</button>
        <h1 className="text-[17px] font-bold text-white ml-2">독서 하기</h1>
      </div>

      {/* 본문 — 세로 중앙 정렬 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-[10px]">

        {/* 타이머 */}
        <p className="text-[48px] font-bold text-black tracking-tight mb-[10px]">
          {formatTime(seconds)}
        </p>

        {/* 시작 / 일시정지 / 이어하기 버튼 */}
        <button
          onClick={isRunning ? stopTimer : startTimer}
          className="w-full max-w-[361px] h-[50px] rounded-[12px] bg-[#4E3CDB] text-white text-[13px] font-bold active:opacity-80 transition-opacity"
        >
          {firstButtonLabel}
        </button>

        {/* 독서 그만 하기 버튼 — 시작 후에만 표시 */}
        {isStart && (
          <button
            onClick={handleStop}
            className="w-full max-w-[361px] h-[50px] rounded-[12px] bg-[#4E3CDB] text-white text-[13px] font-bold active:opacity-80 transition-opacity"
          >
            독서 그만 하기
          </button>
        )}

      </div>
    </div>
  );
}
