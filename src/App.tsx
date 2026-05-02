import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from '@/pages/SplashPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import SearchEmailPage from '@/pages/auth/SearchEmailPage';
import SearchEmailResultPage from '@/pages/auth/SearchEmailResultPage';
import SearchPasswordPage from '@/pages/auth/SearchPasswordPage';
import SearchPasswordResultPage from '@/pages/auth/SearchPasswordResultPage';
import HomePage from '@/pages/home/HomePage';
import BookSearchPage from '@/pages/book/BookSearchPage';
import BookDetailPage from '@/pages/book/BookDetailPage';
import BookRecordListPage from '@/pages/bookrecord/BookRecordListPage';
import BookRecordPage from '@/pages/bookrecord/BookRecordPage';
import BookRecordTimerPage from '@/pages/bookrecord/BookRecordTimerPage';
import BookRecordWritePage from '@/pages/bookrecord/BookRecordWritePage';
import BookRecordOverWritePage from '@/pages/bookrecord/BookRecordOverWritePage';
import BookLogDetailPage from '@/pages/booklog/BookLogDetailPage';
import BookLogDetailOverPage from '@/pages/booklog/BookLogDetailOverPage';
import MyPage from '@/pages/mypage/MyPage';
import PrivacyTermsPage from '@/pages/mypage/PrivacyTermsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 스플래시 — 토큰 확인 후 홈 또는 로그인으로 리다이렉트 */}
        <Route path="/" element={<SplashPage />} />

        {/* 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/search/email" element={<SearchEmailPage />} />
        <Route path="/search/email/result" element={<SearchEmailResultPage />} />
        <Route path="/search/password" element={<SearchPasswordPage />} />
        <Route path="/search/password/result" element={<SearchPasswordResultPage />} />

        {/* 메인 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/book/search" element={<BookSearchPage />} />
        <Route path="/book/:isbn" element={<BookDetailPage />} />

        {/* 독서 기록 */}
        <Route path="/book/record" element={<BookRecordListPage />} />
        <Route path="/book/record/:id" element={<BookRecordPage />} />
        <Route path="/book/record/:id/timer" element={<BookRecordTimerPage />} />
        <Route path="/book/record/:id/write" element={<BookRecordWritePage />} />
        <Route path="/book/record/:id/over" element={<BookRecordOverWritePage />} />

        {/* 독서 로그 */}
        <Route path="/book/record/:recordId/log/:logId" element={<BookLogDetailPage />} />
        <Route path="/book/record/:recordId/log/:logId/over" element={<BookLogDetailOverPage />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/privacy" element={<PrivacyTermsPage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
