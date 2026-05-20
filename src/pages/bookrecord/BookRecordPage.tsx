import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';
import type { BookLog } from '@/models/bookLog';

export default function BookRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const bookRecord = location.state?.bookRecord as BookRecord | undefined;

  // UI-only: 로그 목록 (API 연결 전)
  const [bookLogs] = useState<BookLog[] | null>(null);

  if (!bookRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/30 text-[15px]">독서 기록 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { book, page, readingTime, status } = bookRecord;
  const totalPage = book.page ?? 1;
  const percent = ((page / totalPage) * 100).toFixed(2);
  const imgUrl = book.imageUrl.replace('coversum', 'cover500');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center px-4 h-[56px] shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white text-xl">‹</button>
        <h1 className="text-[17px] font-bold text-white ml-2">독서 기록</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="w-full max-w-[361px] mx-auto flex flex-col">

          {/* 책 표지 */}
          <img
            src={imgUrl}
            alt={book.title}
            className="w-full aspect-square rounded-[10px] object-cover"
          />

          {/* 책 정보 */}
          <div className="mt-4 flex flex-col gap-0.5">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-black leading-snug">
              {book.title}
            </p>
            <p className="text-[14px] text-[rgba(23,20,46,0.62)] tracking-[-0.24px]">
              {book.author} - {book.publisher} 출판사
            </p>
          </div>

          {/* 독서 요약 */}
          <div className="mt-8">
            <p className="text-[22px] font-bold tracking-[-0.44px]">독서 요약</p>

            <div className="mt-2.5 flex gap-[100px]">
              <StatItem label="총 독서 시간" value={`${readingTime} 분`} />
              <StatItem label="총 페이지" value={`${page}  /  ${book.page ?? '-'}`} />
            </div>

            {/* 진행 바 */}
            <div className="mt-8 h-3 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4E3CDB] transition-all"
                style={{ width: `${Math.min((page / totalPage) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-black/50">
              {page} / {book.page}  {percent}%
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-8 flex flex-col gap-4">
            {status === '독서중' && (
              <button
                onClick={() => navigate(`/book/record/${id}/timer`, { state: { bookRecord } })}
                className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[13px] font-bold active:opacity-80 transition-opacity"
              >
                계속 읽기
              </button>
            )}
            {status === '완독' && (
              <button
                onClick={() => navigate(`/book/record/${id}/over`, { state: { bookRecord } })}
                className="w-full h-[50px] rounded-[56px] bg-black/10 text-black text-[13px] font-bold active:opacity-80 transition-opacity"
              >
                완독 감상평
              </button>
            )}
          </div>

          {/* 지난 독서 기록 */}
          <div className="mt-8">
            <p className="text-[22px] font-bold tracking-[-0.44px]">지난 독서 기록</p>
            <div className="mt-6">
              {bookLogs === null ? (
                <LogSkeleton />
              ) : bookLogs.length === 0 ? (
                <p className="text-[15px] font-bold text-black">저장된 독서 기록이 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-[25px]">
                  {bookLogs.map((log) => (
                    <li key={log.id}>
                      <LogItem
                        log={log}
                        onTap={() =>
                          navigate(
                            `/book/record/${id}/log/${log.id}`,
                            { state: { bookRecord } }
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-[15px] text-[rgba(23,20,46,0.62)] tracking-[-0.075px]">{label}</p>
      <p className="text-[17px] font-bold text-black tracking-[-0.34px]">{value}</p>
    </div>
  );
}

function LogItem({ log, onTap }: { log: BookLog; onTap: () => void }) {
  const formattedDate = log.readingDate.replaceAll('-', '.');

  return (
    <button onClick={onTap} className="flex items-start gap-5 w-full text-left">
      {/* 북마크 아이콘 */}
      <div className="w-10 h-10 rounded-full bg-[#4E3CDB] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[17px] font-bold text-black tracking-[-0.34px]">
          {formattedDate} 독서
        </p>
        <p className="text-[13px] text-black/70 tracking-[-0.26px]">
          페이지 : {log.pageStart} ~ {log.pageEnd}
        </p>
        <p className="text-[13px] text-black/70 tracking-[-0.26px]">
          시간 : {log.readingTime} 분
        </p>
      </div>
    </button>
  );
}

function LogSkeleton() {
  return (
    <div className="flex flex-col gap-[25px]">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-start gap-5 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-black/10 shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-4 w-32 rounded bg-black/10" />
            <div className="h-3 w-24 rounded bg-black/10" />
            <div className="h-3 w-20 rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
