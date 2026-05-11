import { useState } from 'react';
import { Button } from '../ui/Button';
import { useFormMessage } from '../../hooks/useFormMessage';

interface PasswordFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const PasswordForm = ({ onSubmit }: PasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, setMessage, setMessageWithAutoReset } = useFormMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setMessage('');
      await onSubmit(currentPassword, nextPassword);
      setCurrentPassword('');
      setNextPassword('');
      setMessageWithAutoReset('Mot de passe mis à jour.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de changer le mot de passe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {message}
        </div>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Mot de passe actuel</span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nouveau mot de passe</span>
        <input
          type="password"
          value={nextPassword}
          onChange={(e) => setNextPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
        />
      </label>

      <Button type="submit" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
      </Button>
    </form>
  );
};
