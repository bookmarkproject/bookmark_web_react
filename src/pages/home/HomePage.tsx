import { useNavigate } from 'react-router-dom';
import type { Book } from '@/models/book';
import type { BookRecord } from '@/models/bookRecord';
import BottomNavBar from '@/components/BottomNavBar';
import { useAppSelector } from '@/store/hooks';

export default function HomePage() {
  const navigate = useNavigate();
  const member = useAppSelector((s) => s.member.member);
  const recordingBooks = useAppSelector((s) => s.bookRecord.bookRecords);

  // UI-only: 빈 배열로 초기화 (API 연결 전)
  const bestSellers: Book[] = [];
  const latestBooks: Book[] = [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center justify-center h-[56px] shrink-0">
        <h1 className="text-[17px] font-bold text-white">책갈피</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-8">

        {/* 이달의 베스트셀러 */}
        <section>
          <SectionHeader
            title="이달의 베스트셀러"
            subtitle="이달의 베스트셀러 도서입니다."
          />
          <div className="mt-5">
            {bestSellers.length === 0 ? (
              <SkeletonRow />
            ) : (
              <HorizontalBookList
                books={bestSellers}
                onTap={(book) => navigate(`/book/${book.isbn}`)}
              />
            )}
          </div>
        </section>

        {/* 신작 도서 */}
        <section>
          <SectionHeader
            title="신작 도서"
            subtitle="이달의 신작 도서입니다."
          />
          <div className="mt-5">
            {latestBooks.length === 0 ? (
              <SkeletonRow />
            ) : (
              <HorizontalBookList
                books={latestBooks}
                onTap={(book) => navigate(`/book/${book.isbn}`)}
              />
            )}
          </div>
        </section>

        {/* 현재 기록 중인 책 */}
        <section>
          <SectionHeader
            title="현재 기록 중인 책"
            subtitle={`${member?.nickname ?? ''}님이 기록 중인 책 입니다.`}
          />
          <div className="mt-5">
            {recordingBooks.length === 0 ? (
              <EmptyRecordingBooks onSearch={() => navigate('/book/search')} />
            ) : (
              <HorizontalRecordingList
                records={recordingBooks}
                onContinue={(r) => navigate(`/book/record/${r.id}`)}
                onDetail={(r) => navigate(`/book/${r.book.isbn}`)}
              />
            )}
          </div>
        </section>

      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar currentIndex={0} />
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-[22px] font-bold leading-tight tracking-[-0.44px]">{title}</p>
      <p className="text-[14px] text-[rgba(23,20,46,0.62)] mt-0.5">{subtitle}</p>
    </div>
  );
}

function HorizontalBookList({ books, onTap }: { books: Book[]; onTap: (b: Book) => void }) {
  return (
    <div className="flex gap-[14px] overflow-x-auto pb-1 no-scrollbar">
      {books.map((book) => (
        <BookCard key={book.isbn} book={book} onTap={() => onTap(book)} />
      ))}
    </div>
  );
}

function BookCard({ book, onTap }: { book: Book; onTap: () => void }) {
  const truncate = (s: string) => (s.length > 8 ? `${s.slice(0, 8)}...` : s);
  const imgUrl = book.imageUrl.replace('coversum', 'cover500');

  return (
    <button onClick={onTap} className="flex flex-col shrink-0 w-[160px] text-left">
      <img
        src={imgUrl}
        alt={book.title}
        className="w-[160px] h-[160px] rounded-[14px] object-cover"
      />
      <p className="mt-1 text-[15px] font-bold tracking-[-0.3px] text-black leading-snug">
        {truncate(book.title)}
      </p>
      <p className="text-[13px] tracking-[-0.26px] text-[rgba(23,20,46,0.62)]">
        {truncate(book.author)}
      </p>
    </button>
  );
}

function HorizontalRecordingList({
  records,
  onContinue,
  onDetail,
}: {
  records: BookRecord[];
  onContinue: (r: BookRecord) => void;
  onDetail: (r: BookRecord) => void;
}) {
  return (
    <div className="flex gap-[14px] overflow-x-auto pb-1 no-scrollbar">
      {records.map((record) => (
        <RecordingBookCard
          key={record.id}
          record={record}
          onContinue={() => onContinue(record)}
          onDetail={() => onDetail(record)}
        />
      ))}
    </div>
  );
}

function RecordingBookCard({
  record,
  onContinue,
  onDetail,
}: {
  record: BookRecord;
  onContinue: () => void;
  onDetail: () => void;
}) {
  const truncate = (s: string) => (s.length > 8 ? `${s.slice(0, 8)}...` : s);
  const imgUrl = record.book.imageUrl.replace('coversum', 'cover500');
  const totalPage = record.book.page ?? 1;
  const percent = ((record.page / totalPage) * 100).toFixed(2);

  return (
    <div className="flex flex-col shrink-0 w-[160px]">
      <img
        src={imgUrl}
        alt={record.book.title}
        className="w-[160px] h-[160px] rounded-[14px] object-cover"
      />
      <p className="mt-1 text-[15px] font-bold tracking-[-0.3px] text-black leading-snug">
        {truncate(record.book.title)}
      </p>
      <p className="text-[13px] tracking-[-0.26px] text-[rgba(23,20,46,0.62)]">
        {truncate(record.book.author)}
      </p>

      {/* 진행 바 */}
      <div className="mt-1.5 h-3 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4E3CDB] transition-all"
          style={{ width: `${Math.min((record.page / totalPage) * 100, 100)}%` }}
        />
      </div>
      <p className="text-[8px] text-black/50 mt-0.5">
        {record.page} / {totalPage} &nbsp;{percent}%
      </p>

      {/* 버튼 */}
      <div className="flex gap-2 mt-2.5">
        <button
          onClick={onContinue}
          className="flex-1 h-10 rounded-[10px] bg-[#4E3CDB] text-white text-[9px] font-bold active:opacity-80 transition-opacity"
        >
          계속 읽기
        </button>
        <button
          onClick={onDetail}
          className="flex-1 h-10 rounded-[10px] bg-[rgba(47,37,126,0.09)] text-black text-[9px] font-bold active:opacity-80 transition-opacity"
        >
          책 정보 보기
        </button>
      </div>
    </div>
  );
}

function EmptyRecordingBooks({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
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

function SkeletonRow() {
  return (
    <div className="flex gap-[14px] overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col shrink-0 w-[160px] animate-pulse">
          <div className="w-[160px] h-[160px] rounded-[14px] bg-black/10" />
          <div className="mt-2 h-[14px] w-24 rounded bg-black/10" />
          <div className="mt-1 h-[12px] w-16 rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}
