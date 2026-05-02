interface Props {
  hintText: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

export default function LoginTextField({ hintText, value, onChange, type = 'text' }: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={hintText}
      className="
        w-full max-w-[361px] h-[50px] px-5
        rounded-[20px] text-[12px] outline-none
        placeholder:text-[15px] placeholder:text-black/30
      "
      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
    />
  );
}
