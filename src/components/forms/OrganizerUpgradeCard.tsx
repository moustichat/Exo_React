import { useState } from 'react';
import { Button } from '../ui/Button';
import { useFormMessage } from '../../hooks/useFormMessage';

interface OrganizerUpgradeCardProps {
  onBecomeOrganizer: () => Promise<void>;
}

export const OrganizerUpgradeCard = ({ onBecomeOrganizer }: OrganizerUpgradeCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, setMessage, setMessageWithAutoReset } = useFormMessage();

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      setMessage('');
      await onBecomeOrganizer();
      setMessageWithAutoReset('Ton compte est maintenant en mode organisateur.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de passer en mode organisateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Espace organisateur</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Passe ton compte en organisateur pour créer des évènements.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        Active le mode organisateur pour accéder à la création d'événements.
      </div>
      
      <Button type="button" onClick={handleClick} disabled={isSubmitting}>
        {isSubmitting ? 'Activation...' : 'Devenir organisateur'}
      </Button>
    </div>
  );
};
