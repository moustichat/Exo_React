export const Footer = () => {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Exo Events</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Une interface simple pour découvrir des événements, acheter des billets et retrouver ses réservations.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">Navigation</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><a href="/search" className="hover:text-slate-950 dark:hover:text-white">Recherche</a></li>
              <li><a href="/tickets" className="hover:text-slate-950 dark:hover:text-white">Mes billets</a></li>
              <li><a href="/account" className="hover:text-slate-950 dark:hover:text-white">Paramètres</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">Aide</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><span>Connexion requise pour acheter un billet.</span></li>
              <li><span>La recherche est accessible sans compte.</span></li>
              <li><span>Les paramètres sont enregistrés côté front.</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2026 Exo Events. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
