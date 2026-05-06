import { useNavigate, useLocation } from 'react-router-dom';
import type { Book } from '@/models/book';
import { useAppSelector } from '@/store/hooks';

export default function BookDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book as Book | undefined;

  const bookRecords = useAppSelector((s) => s.bookRecord.bookRecords);
  const existingRecord = book
    ? bookRecords.find((r) => r.book.isbn === book.isbn && r.status === '독서중')
    : undefined;

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/30 text-[15px]">도서 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const imgUrl = book.imageUrl.replace('coversum', 'cover500');
  const publishDate = book.publishDate.replaceAll('-', '.');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center px-4 h-[56px] shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white text-xl">‹</button>
        <h1 className="text-[17px] font-bold text-white ml-2">도서 상세</h1>
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
            <p className="text-[22px] font-bold tracking-[-0.22px] text-black leading-snug">
              {book.title}
            </p>
            <p className="text-[14px] text-[rgba(23,20,46,0.62)] tracking-[-0.24px]">
              {book.author} - {book.publisher} 출판사
            </p>
            <p className="text-[14px] text-[rgba(23,20,46,0.62)] tracking-[-0.24px]">
              {publishDate} 출판
            </p>
          </div>

          {/* 소개 */}
          <p className="mt-4 text-[14px] text-[rgba(23,20,46,0.62)] tracking-[-0.24px] leading-relaxed">
            {book.contents}
          </p>

          {/* 액션 버튼 */}
          <button
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[15px] font-bold mt-8 active:opacity-80 transition-opacity"
          >
            {existingRecord ? '계속 읽기' : '기록하기'}
          </button>

        </div>
      </div>
    </div>
  );
}
