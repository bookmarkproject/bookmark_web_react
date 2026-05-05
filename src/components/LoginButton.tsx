interface Props {
  text: string;
  onClick: () => void;
  backgroundColor: string;
  textColor: string;
  border?: string;
  disabled?: boolean;
}

export default function LoginButton({ text, onClick, backgroundColor, textColor, border, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full max-w-[361px] h-[50px] rounded-[56px] text-[17px] font-bold active:opacity-80 transition-opacity disabled:opacity-50"
      style={{ backgroundColor, color: textColor, border: border ?? 'none' }}
    >
      {text}
    </button>
  );
}
