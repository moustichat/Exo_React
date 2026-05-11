import { useState } from 'react';
import { Button } from '../ui/Button';
import { useFormMessage } from '../../hooks/useFormMessage';

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  onSubmit: (name: string, email: string) => Promise<void>;
}

export const ProfileForm = ({ initialName, initialEmail, onSubmit }: ProfileFormProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, setMessage, setMessageWithAutoReset } = useFormMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setMessage('');
      await onSubmit(name, email);
      setMessageWithAutoReset('Paramètres enregistrés.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de sauvegarder le profil.');
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
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nom d'utilisateur</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
        />
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  );
};
