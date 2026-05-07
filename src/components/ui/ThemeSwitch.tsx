import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
