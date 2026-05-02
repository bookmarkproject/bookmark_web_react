interface Props {
  text: string;
  onClick: () => void;
  backgroundColor: string;
  textColor: string;
  border?: string;
}

export default function LoginButton({ text, onClick, backgroundColor, textColor, border }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-[361px] h-[50px] rounded-[56px] text-[17px] font-bold active:opacity-80 transition-opacity"
      style={{ backgroundColor, color: textColor, border: border ?? 'none' }}
    >
      {text}
    </button>
  );
}
