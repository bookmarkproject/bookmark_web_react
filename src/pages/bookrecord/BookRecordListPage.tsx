import { useNavigate } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';
import BottomNavBar from '@/components/BottomNavBar';
import { useAppSelector } from '@/store/hooks';

export default function BookRecordListPage() {
  const navigate = useNavigate();
  const recordingBooks = useAppSelector((s) =>
    s.bookRecord.bookRecords.filter((r) => r.status === '독서중')
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center justify-center h-[56px] shrink-0">
        <h1 className="text-[17px] font-bold text-white">기록 중인 책</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {recordingBooks.length === 0 ? (
          <EmptyState onSearch={() => navigate('/book/search')} />
        ) : (
          <ul className="flex flex-col gap-5">
            {recordingBooks.map((record) => (
              <li key={record.id}>
                <RecordItem
                  record={record}
                  onTap={() =>
                    navigate(`/book/record/${record.id}`, { state: { bookRecord: record } })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar currentIndex={2} />
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function RecordItem({ record, onTap }: { record: BookRecord; onTap: () => void }) {
  const truncate = (s: string, max: number) =>
    s.length > max ? `${s.slice(0, max)}...` : s;

  return (
    <button onClick={onTap} className="flex items-start gap-[10px] w-full text-left">
      <img
        src={record.book.imageUrl}
        alt={record.book.title}
        className="w-[60px] h-[70px] object-cover rounded-[4px] shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <p className="text-[15px] font-bold text-black leading-snug">
          {truncate(record.book.title, 20)}
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-[rgba(23,20,46,0.62)]">
          {truncate(record.book.author, 20)}
        </p>
      </div>
    </button>
  );
}

function EmptyState({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 pt-8">
      <p className="text-[20px] text-black/60">현재 기록 중인 책이 없습니다.</p>
      <button
        onClick={onSearch}
        className="h-[40px] px-8 rounded-[56px] bg-[#4E3CDB] text-white text-[14px] font-bold active:opacity-80 transition-opacity"
      >
        책 검색하기
      </button>
    </div>
  );
}
