import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/api/authApi';
import { mailApi } from '@/api/mailApi';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'남자' | '여자'>('남자');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNicknameOk, setIsNicknameOk] = useState(false);
  const [isPiChecked, setIsPiChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  useEffect(() => {
    const maxDay = getDaysInMonth(year, month);
    if (day > maxDay) setDay(maxDay);
  }, [year, month]);

  useEffect(() => {
    setIsNicknameOk(false);
  }, [nickname]);

  const handleSendVerification = async () => {
    if (!email) { showToast('이메일을 입력해주세요.', true); return; }
    try {
      await mailApi.sendVerification(email);
      showToast('인증번호가 발송되었습니다.');
    } catch {
      showToast('인증번호 발송에 실패했습니다.', true);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) { showToast('인증 코드를 입력해주세요.', true); return; }
    try {
      const res = await mailApi.checkCode(email, code);
      if (res.data.isVerified) {
        setIsEmailVerified(true);
        showToast('인증되었습니다.');
      } else {
        showToast('인증에 실패했습니다.', true);
      }
    } catch {
      showToast('인증에 실패했습니다.', true);
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) { showToast('닉네임을 입력해주세요.', true); return; }
    try {
      await authApi.checkNickname(nickname);
      setIsNicknameOk(true);
      showToast('사용 가능한 닉네임입니다.');
    } catch {
      showToast('이미 사용 중인 닉네임입니다.', true);
    }
  };

  const validate = () => {
    if (!name) { showToast('이름을 입력해주세요.', true); return false; }
    if (!isEmailVerified) { showToast('이메일 인증을 진행해주세요.', true); return false; }
    if (!password) { showToast('비밀번호를 입력해주세요.', true); return false; }
    if (password !== passwordConfirm) { showToast('비밀번호가 일치하지 않습니다.', true); return false; }
    if (!phone) { showToast('휴대폰 번호를 입력해주세요.', true); return false; }
    if (!nickname) { showToast('닉네임을 입력해주세요.', true); return false; }
    if (!isNicknameOk) { showToast('닉네임 중복확인을 해주세요.', true); return false; }
    if (!isPiChecked) { showToast('개인정보 수집에 동의해주세요.', true); return false; }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      await authApi.signup({
        email, password, name, nickname,
        gender,
        phoneNumber: phone,
        birthday: `${year}-${mm}-${dd}`,
      });
      showToast('회원가입에 성공했습니다.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (e: any) {
      showToast(e.response?.data?.message || '회원가입에 실패했습니다.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center px-4 h-[56px] border-b border-black/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-xl">
          ‹
        </button>
        <h1 className="text-[17px] font-bold ml-2">회원가입</h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full max-w-[361px] mx-auto flex flex-col gap-4">

          <h2 className="text-[22px] font-bold">계정 만들기</h2>

          {/* 이름 */}
          <Field label="이름">
            <Input placeholder="이름" value={name} onChange={setName} />
          </Field>

          {/* 이메일 */}
          <Field label="이메일">
            <div className="flex gap-3">
              <Input
                flex
                placeholder="이메일"
                value={email}
                onChange={setEmail}
                type="email"
                disabled={isEmailVerified}
              />
              <ActionButton onClick={handleSendVerification} disabled={isEmailVerified}>
                인증 요청
              </ActionButton>
            </div>
            <div className="flex gap-3">
              <Input
                flex
                placeholder="이메일 인증 코드"
                value={code}
                onChange={setCode}
                disabled={isEmailVerified}
              />
              <ActionButton onClick={handleVerifyCode} disabled={isEmailVerified}>
                인증
              </ActionButton>
            </div>
            {isEmailVerified && (
              <p className="text-[13px] text-[#4E3CDB] font-medium">✓ 이메일 인증 완료</p>
            )}
          </Field>

          {/* 비밀번호 */}
          <Field label="비밀번호">
            <Input placeholder="비밀번호" value={password} onChange={setPassword} type="password" />
            <p className="text-[10px] text-black/50 leading-relaxed">
              비밀번호는 영어, 숫자, 특수문자(!@#$%^&*())를 1개 이상 포함하여 8~16자로 입력 해야합니다.
            </p>
            <Input placeholder="비밀번호 확인" value={passwordConfirm} onChange={setPasswordConfirm} type="password" />
          </Field>

          {/* 성별 */}
          <Field label="성별">
            <Select value={gender} onChange={(v) => setGender(v as '남자' | '여자')}>
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </Select>
          </Field>

          {/* 휴대폰 번호 */}
          <Field label="휴대폰 번호">
            <Input
              placeholder="010xxxxxxxx"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 11))}
              type="tel"
            />
          </Field>

          {/* 생년월일 */}
          <Field label="생년월일">
            <div className="flex gap-2">
              <Select flex value={year} onChange={(v) => setYear(Number(v))}>
                {years.map((y) => <option key={y} value={y}>{y}년</option>)}
              </Select>
              <Select flex value={month} onChange={(v) => setMonth(Number(v))}>
                {months.map((m) => <option key={m} value={m}>{m}월</option>)}
              </Select>
              <Select flex value={day} onChange={(v) => setDay(Number(v))}>
                {days.map((d) => <option key={d} value={d}>{d}일</option>)}
              </Select>
            </div>
          </Field>

          {/* 닉네임 */}
          <Field label="닉네임">
            <div className="flex gap-3">
              <Input flex placeholder="닉네임을 입력하세요." value={nickname} onChange={setNickname} />
              <ActionButton onClick={handleCheckNickname}>중복확인</ActionButton>
            </div>
            {isNicknameOk && (
              <p className="text-[13px] text-[#4E3CDB] font-medium">✓ 사용 가능한 닉네임</p>
            )}
          </Field>

          {/* 개인정보 동의 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPiChecked}
              onChange={(e) => setIsPiChecked(e.target.checked)}
              className="w-4 h-4 accent-[#4E3CDB]"
            />
            <span className="text-[14px]">개인정보 수집에 동의합니다.</span>
          </label>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full h-[50px] rounded-[56px] bg-[#4E3CDB] text-white text-[17px] font-bold mt-2 disabled:opacity-50 active:opacity-80 transition-opacity"
          >
            {loading ? '처리 중...' : '회원 가입'}
          </button>

        </div>
      </div>

      {toast && <Toast message={toast.message} isError={toast.isError} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-bold">{label}</p>
      {children}
    </div>
  );
}

function Input({
  placeholder, value, onChange, type = 'text', disabled = false, flex = false,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
  flex?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${flex ? 'flex-1' : 'w-full'} h-[48px] px-4 rounded-[12px] text-[15px] outline-none border border-black/10 bg-white disabled:bg-black/5 disabled:text-black/40`}
    />
  );
}

function ActionButton({
  onClick, disabled = false, children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-[48px] px-4 rounded-[12px] bg-[#4E3CDB] text-white text-[15px] font-bold whitespace-nowrap disabled:opacity-50 active:opacity-80 transition-opacity"
    >
      {children}
    </button>
  );
}

function Select({
  value, onChange, children, flex = false,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
  flex?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${flex ? 'flex-1' : 'w-full'} h-[48px] px-3 rounded-[12px] border border-black/10 bg-white text-[15px] outline-none`}
    >
      {children}
    </select>
  );
}
