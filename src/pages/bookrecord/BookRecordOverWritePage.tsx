import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { bookLogApi } from '@/api/bookLogApi';

const QUESTIONS = [
  { title: '책의 핵심',       subtitle: '이 책이 전하려는 가장 중요한 메시지는 무엇일까요?' },
  { title: '나의 깨달음',     subtitle: '이 책을 읽고 나에게 생긴 새로운 시각은 무엇일까요?' },
  { title: '인상 깊은 장면',  subtitle: '기억에 오래 남을 만한 문장이나 장면은 무엇일까요?' },
  { title: '적용과 변화',     subtitle: '이 책의 내용을 내 삶에 어떻게 적용할 수 있을까요?' },
  { title: '비판적 시선',     subtitle: '책에서 아쉬웠던 점이나 동의하기 어려운 주장은 무엇일까요?' },
  { title: '나와의 연결고리', subtitle: '이 책은 내 삶의 어떤 경험과 연결될까요?' },
  { title: '여운과 확장',     subtitle: '이 책 다음에 읽으면 좋을 만한 책은 무엇일까요?' },
];

export default function BookRecordOverWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast, showToast } = useToast();

  const bookRecord = location.state?.bookRecord as BookRecord | undefined;
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''));
  const [loading, setLoading] = useState(false);

  const setAnswer = (idx: number, val: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === idx ? val : a)));

  const handleSubmit = async () => {
    if (answers.some((a) => !a.trim())) {
      showToast('모든 질문에 대한 답변을 해주세요.', true);
      return;
    }
    if (!bookRecord) return;

    setLoading(true);
    try {
      await bookLogApi.saveOverLog({
        bookRecordId: bookRecord.id,
        questions: QUESTIONS.map((q) => q.subtitle),
        answers,
        logType: '완독',
      });
      navigate(`/book/record/${id ?? bookRecord.id}`, {
        replace: true,
        state: { bookRecord },
      });
    } catch (e: any) {
      showToast(e.response?.data?.message || '기록에 실패했습니다.', true);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-[17px] font-bold text-white ml-2">완독 감상평 작성</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="w-full max-w-[361px] mx-auto flex flex-col">

          {/* 책 표지 */}
          <img src={imgUrl} alt={book.title} className="w-full aspect-square rounded-[10px] object-cover" />

          {/* 책 정보 */}
          <div className="mt-4 flex flex-col gap-0.5">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-black leading-snug">{book.title}</p>
            <p className="text-[14px] text-[rgba(23,20,46,0.62)] tracking-[-0.24px]">
              {book.author} - {book.publisher} 출판사
            </p>
          </div>

          {/* 질문 섹션 */}
          <div className="mt-8 flex flex-col">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="mb-10">
                <p className="text-[22px] font-bold tracking-[-0.44px] text-black">
                  {i + 1}. {q.title}
                </p>
                <p className="mt-[5px] text-[14px] font-bold text-[rgba(23,20,46,0.62)] tracking-[-0.28px] leading-snug">
                  {q.subtitle}
                </p>
                <textarea
                  value={answers[i]}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  placeholder="여기에 답변하세요"
                  rows={3}
                  className="mt-3 w-full rounded-[16px] px-3 py-3 text-[12px] text-black bg-[rgba(126,52,37,0.09)] placeholder:text-black/50 outline-none resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* 기록하기 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[14px] font-bold mb-4 disabled:opacity-50 active:opacity-80 transition-opacity"
          >
            {loading ? '기록 중...' : '기록하기'}
          </button>

        </div>
      </div>

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}
