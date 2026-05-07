import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Account = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setProfileMessage('');
      await updateProfile({ name, email });
      setProfileMessage('Paramètres enregistrés.');
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Impossible de sauvegarder le profil.');
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setPasswordMessage('');
      await updatePassword(currentPassword, nextPassword);
      setCurrentPassword('');
      setNextPassword('');
      setPasswordMessage('Mot de passe mis à jour.');
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : 'Impossible de changer le mot de passe.');
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Paramètres</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Mon compte</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Modifie ton nom d’utilisateur et ton mot de passe depuis cette page simple.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Profil</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Informations visibles dans ton espace utilisateur.</p>
          </div>

          {profileMessage && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nom d’utilisateur</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <Button type="submit">Enregistrer</Button>
          </form>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Mot de passe</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Change ton mot de passe quand tu veux.</p>
          </div>

          {passwordMessage && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
              {passwordMessage}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Mot de passe actuel</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nouveau mot de passe</span>
              <input
                type="password"
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <Button type="submit" variant="secondary">Modifier le mot de passe</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};