import { useState, useCallback } from 'react';

export const useFormMessage = () => {
  const [message, setMessage] = useState('');

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  const setMessageWithAutoReset = useCallback((msg: string, delayMs = 3000) => {
    setMessage(msg);
    if (!msg.startsWith('Erreur') && !msg.includes('invalide') && !msg.includes('Impossible')) {
      setTimeout(clearMessage, delayMs);
    }
  }, [clearMessage]);

  return { message, setMessage, clearMessage, setMessageWithAutoReset };
};
