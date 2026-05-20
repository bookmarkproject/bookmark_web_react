import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { BookRecord } from '@/models/bookRecord';

const QUESTIONS = [
  {
    title: '오늘 읽은 내용 요약',
    subtitle: '오늘 읽은 내용을 요약해보세요.',
  },
  {
    title: '가장 인상 깊었던 문장/구절',
    subtitle: '오늘 읽은 내용 중 가장 인상 깊었던 문장이나 구절은 무엇인가요? 이유도 적어보세요.',
  },
  {
    title: '내가 생각한 질문',
    subtitle: '오늘 읽은 내용에 대해 스스로 질문을 만들어보세요.',
  },
  {
    title: '배운 점 또는 적용할 점',
    subtitle: '오늘 읽은 내용에서 배운 점이나 실제로 적용할 수 있는 점은 무엇인가요?',
  },
];

export default function BookRecordWritePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookRecord = location.state?.bookRecord as BookRecord | undefined;
  const seconds = (location.state?.seconds as number | undefined) ?? 0;

  const totalPage = bookRecord?.book.page ?? 1;

  const [isOver, setIsOver] = useState(false);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(Math.min(2, totalPage));
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''));

  const pageStartItems = useMemo(
    () => Array.from({ length: totalPage }, (_, i) => i + 1),
    [totalPage]
  );
  const pageEndItems = useMemo(
    () => Array.from({ length: totalPage - pageStart }, (_, i) => pageStart + 1 + i),
    [pageStart, totalPage]
  );

  const handlePageStartChange = (val: number) => {
    setPageStart(val);
    setPageEnd(val + 1);
  };

  const setAnswer = (idx: number, val: string) =>
    setAnswers((prev) => prev.map((a, i) => (i === idx ? val : a)));

  const handleSubmit = () => {
    // API 연결 예정 (readingTime = Math.floor(seconds / 60))
    void seconds;
    void navigate;
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
      {/* 헤더 — 뒤로가기 없음 */}
      <div className="bg-[#4E3CDB] flex items-center justify-center h-[56px] shrink-0">
        <h1 className="text-[17px] font-bold text-white">독서 기록하기</h1>
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

          {/* 독서 진행 */}
          <div className="mt-8">
            <p className="text-[22px] font-bold tracking-[-0.44px]">독서 진행</p>

            {/* 미완독 */}
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="radio"
                name="progress"
                checked={!isOver}
                onChange={() => setIsOver(false)}
                className="w-4 h-4 accent-[#4E3CDB]"
              />
              <span className="text-[14px] font-bold text-black">아직 완독하지 못했어요.</span>
            </label>

            {/* 미완독 선택 시 — 페이지 드롭다운 */}
            {!isOver && (
              <div className="flex items-center flex-wrap gap-x-2 gap-y-2 mt-2 ml-3">
                <PageSelect
                  value={pageStart}
                  items={pageStartItems}
                  onChange={handlePageStartChange}
                />
                <span className="text-[14px]">페이지 부터</span>
                <PageSelect
                  value={pageEnd}
                  items={pageEndItems}
                  onChange={setPageEnd}
                />
                <span className="text-[14px]">까지 읽었어요.</span>
              </div>
            )}

            {/* 완독 */}
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="radio"
                name="progress"
                checked={isOver}
                onChange={() => setIsOver(true)}
                className="w-4 h-4 accent-[#4E3CDB]"
              />
              <span className="text-[14px] font-bold text-black">완독했어요!</span>
            </label>
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
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[14px] font-bold mb-4 active:opacity-80 transition-opacity"
          >
            기록하기
          </button>

        </div>
      </div>
    </div>
  );
}

/* ────────── 서브 컴포넌트 ────────── */

function PageSelect({
  value,
  items,
  onChange,
}: {
  value: number;
  items: number[];
  onChange: (v: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-[70px] h-[36px] px-2 rounded-[8px] border border-black/10 bg-white text-[14px] outline-none"
    >
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
