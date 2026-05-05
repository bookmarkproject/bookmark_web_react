import { useState, useCallback } from 'react';

interface ToastState {
  message: string;
  isError: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
