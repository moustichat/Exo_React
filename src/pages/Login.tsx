import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
      <Card className="w-full">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-950 dark:text-white">
          Connexion
        </h1>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Pas encore de compte?{' '}
            <Link to="/register" state={{ from: redirectTo }} className="font-semibold text-slate-950 underline decoration-amber-400 underline-offset-4 dark:text-white">
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
