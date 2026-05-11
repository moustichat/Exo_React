import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { TicketsList } from '../components/tickets/TicketsList';
import { ProfileForm } from '../components/forms/ProfileForm';
import { PasswordForm } from '../components/forms/PasswordForm';
import { OrganizerUpgradeCard } from '../components/forms/OrganizerUpgradeCard';

export const Account = () => {
  const { user, updateProfile, updatePassword, becomeOrganizer } = useAuth();
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    setInitialName(user?.name ?? '');
    setInitialEmail(user?.email ?? '');
  }, [user]);

  return (
    <div className="space-y-8">
      <section id="tickets">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Mes billets</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Billets achetés</h1>
      </section>

      <TicketsList />

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Paramètres</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Mon compte</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Modifie ton nom d'utilisateur et ton mot de passe depuis cette page simple.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Profil</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Informations visibles dans ton espace utilisateur.</p>
          </div>

          <ProfileForm 
            initialName={initialName} 
            initialEmail={initialEmail}
            onSubmit={(name, email) => updateProfile({ name, email })}
          />
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Mot de passe</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Change ton mot de passe quand tu veux.</p>
          </div>

          <PasswordForm onSubmit={updatePassword} />
        </Card>

        {user?.role === 'USER' && (
          <Card>
            <OrganizerUpgradeCard onBecomeOrganizer={becomeOrganizer} />
          </Card>
        )}
      </div>
    </div>
  );
};
