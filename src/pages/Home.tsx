import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { EventCard } from '../components/events/EventCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { eventService } from '../services';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll({ sort: 'date-asc' });
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => undefined;
  }, []);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.06),_transparent_25%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.04),_transparent_25%)]" />
          <div className="relative space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">Billetterie simple</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Découvre les prochains évènements et réserve en quelques clics.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              L’accueil affiche un aperçu des évènements. La recherche dédiée te permet de filtrer, trier et trouver ce qui t’intéresse.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/search">
                <Button>Rechercher un évènement</Button>
              </Link>
              {isAuthenticated ? (
                <Link to="/tickets">
                  <Button variant="secondary">Voir mes billets</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="secondary">Se connecter</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">Ce que tu peux faire</p>
          <ul className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <li>• Parcourir les événements sur la page d’accueil.</li>
            <li>• Ouvrir la fiche détaillée de chaque événement.</li>
            <li>• Acheter un billet après connexion.</li>
            <li>• Retrouver tes billets et tes paramètres utilisateur.</li>
          </ul>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Aperçu</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Évènements mis en avant</h2>
          </div>
          <Link to="/search" className="hidden sm:block">
            <Button variant="secondary">Voir tous les évènements</Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-600 dark:text-slate-300">Chargement des évènements...</div>
        ) : events.length === 0 ? (
          <Card className="text-center">
            <p className="text-lg font-semibold text-slate-950 dark:text-white">Aucun évènement pour le moment</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
