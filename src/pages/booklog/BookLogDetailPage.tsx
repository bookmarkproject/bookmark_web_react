import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';
import type { BookLogQuestion } from '@/models/bookLog';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { bookLogApi } from '@/api/bookLogApi';

const TITLES = [
  '오늘 읽은 내용 요약',
  '가장 인상 깊었던 문장/구절',
  '내가 생각한 질문',
  '배운 점 또는 적용할 점',
];

export default function BookLogDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logId } = useParams<{ logId: string }>();
  const { toast, showToast } = useToast();

  const bookRecord = location.state?.bookRecord as BookRecord | undefined;

  const [questions, setQuestions] = useState<BookLogQuestion[] | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!logId || hasRun.current) return;
    hasRun.current = true;

    const fetch = async () => {
      try {
        const res = await bookLogApi.getQuestionsByLogId(Number(logId));
        setQuestions(res.data);
      } catch {
        showToast('독서 기록을 불러오는 데 실패했습니다.', true);
        setQuestions([]);
      }
    };
    fetch();
  }, []);

  if (!bookRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/30 text-[15px]">독서 기록 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { book } = bookRecord;
  const imgUrl = book.imageUrl.replace('coversum', 'cover500');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="bg-[#4E3CDB] flex items-center px-4 h-[56px] shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white text-xl">‹</button>
        <h1 className="text-[17px] font-bold text-white ml-2">지난 독서 기록</h1>
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

          {/* 질문 & 답변 */}
          <div className="mt-10 flex flex-col">
            {questions === null ? (
              <QuestionSkeleton />
            ) : questions.length === 0 ? (
              <p className="text-[15px] text-black/40">기록된 내용이 없습니다.</p>
            ) : (
              questions.map((q, i) => (
                <QuestionItem
                  key={q.id}
                  index={i}
                  title={TITLES[i] ?? `질문 ${i + 1}`}
                  question={q.question}
                  answer={q.answer}
                />
              ))
            )}
          </div>

        </div>
      </div>

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function QuestionItem({
  index,
  title,
  question,
  answer,
}: {
  index: number;
  title: string;
  question: string;
  answer: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-[22px] font-bold tracking-[-0.44px] text-black">
        {index + 1}. {title}
      </p>
      <p className="mt-[5px] text-[14px] font-bold text-[rgba(23,20,46,0.62)] tracking-[-0.28px] leading-snug">
        {question}
      </p>
      <div className="mt-3 w-full min-h-[100px] rounded-[16px] px-3 py-3 bg-[rgba(126,52,37,0.09)]">
        <p className="text-[12px] font-bold text-[rgba(23,20,46,0.62)] tracking-[-0.24px] leading-relaxed whitespace-pre-wrap">
          {answer}
        </p>
      </div>
    </div>
  );
}

function QuestionSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex flex-col gap-2">
          <div className="h-6 w-48 rounded bg-black/10" />
          <div className="h-4 w-64 rounded bg-black/10" />
          <div className="h-[100px] rounded-[16px] bg-black/10 mt-1" />
        </div>
      ))}
    </div>
  );
}
