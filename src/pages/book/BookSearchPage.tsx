import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '@/models/book';
import BottomNavBar from '@/components/BottomNavBar';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { bookApi } from '@/api/bookApi';

export default function BookSearchPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    inputRef.current?.blur();
    setLoading(true);
    try {
      const res = await bookApi.search(query.trim());
      setBooks(res.data);
    } catch {
      showToast('도서 검색에 실패했습니다.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center justify-center h-[56px] shrink-0">
        <h1 className="text-[17px] font-bold text-white">도서 검색</h1>
      </div>

      {/* 검색창 */}
      <div className="px-4 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="책 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 h-[48px] px-4 rounded-[56px] bg-black/5 text-[15px] outline-none placeholder:text-black/30"
          />
          <button onClick={handleSearch} disabled={loading} className="p-1 text-black/70 disabled:opacity-40 active:opacity-50 transition-opacity">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[30px] h-[30px]">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {books === null ? (
          <EmptySearch />
        ) : books.length === 0 ? (
          <NoResult query={query} />
        ) : (
          <ul className="flex flex-col gap-[25px]">
            {books.map((book, i) => (
              <li key={book.isbn}>
                <BookItem
                  book={book}
                  index={i + 1}
                  onTap={() => navigate(`/book/${book.isbn}`, { state: { book } })}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar currentIndex={1} />

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function BookItem({ book, index, onTap }: { book: Book; index: number; onTap: () => void }) {
  return (
    <button onClick={onTap} className="flex gap-[15px] w-full text-left">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-[103px] h-[152px] rounded-[6px] object-cover shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <p className="text-[17px] font-bold text-black/50">{index}</p>
        <p className="mt-[5px] text-[15px] font-bold text-black leading-snug line-clamp-2">
          {book.title}
        </p>
        <p className="mt-[5px] text-[12px] text-[rgba(23,20,46,0.62)] truncate">
          {book.author}
        </p>
        <p className="mt-[5px] text-[13px] text-[rgba(23,20,46,0.62)] line-clamp-3 leading-relaxed">
          {book.contents}
        </p>
      </div>
    </button>
  );
}

function EmptySearch() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <p className="text-[15px] text-black/30">검색어를 입력해주세요.</p>
    </div>
  );
}

function NoResult({ query }: { query: string }) {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <p className="text-[15px] text-black/30">
        "<span className="text-black/50">{query}</span>" 검색 결과가 없습니다.
      </p>
    </div>
  );
}
