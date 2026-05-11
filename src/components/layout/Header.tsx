import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ThemeSwitch } from '../ui/ThemeSwitch';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-950 dark:text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-amber-400 dark:text-slate-950">
            E
          </span>
          <span>
            Exo Events
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">Billetterie simple</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`} to="/">
            Accueil
          </NavLink>
          <NavLink className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`} to="/search">
            Recherche
          </NavLink>
          {isAuthenticated && (
            <>
              {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                <NavLink className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`} to="/organizer">
                  Evénements
                </NavLink>
              )}
              <NavLink className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`} to="/account">
                Mon compte
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitch />
          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-800/80 dark:ring-slate-700">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary" size="sm">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Inscription</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
