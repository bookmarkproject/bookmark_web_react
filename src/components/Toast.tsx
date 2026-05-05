interface Props {
  message: string;
  isError: boolean;
}

export default function Toast({ message, isError }: Props) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-white text-sm font-medium z-50 shadow-lg whitespace-nowrap ${
        isError ? 'bg-red-500' : 'bg-[#4E3CDB]'
      }`}
    >
      {message}
    </div>
  );
}
