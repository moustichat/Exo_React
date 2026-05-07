import { useEffect, useState } from 'react';
import { EventCard } from '../components/events/EventCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { eventService } from '../services';
import type { Event, EventCategory, EventFilters, EventSort } from '../types';

const categories: Array<{ label: string; value: EventCategory | '' }> = [
  { label: 'Toutes', value: '' },
  { label: 'Concert', value: 'Concert' },
  { label: 'Conférence', value: 'Conference' },
  { label: 'Festival', value: 'Festival' },
  { label: 'Sport', value: 'Sport' },
  { label: 'Théâtre', value: 'Theatre' },
  { label: 'Autre', value: 'Other' },
];

const sortOptions: Array<{ label: string; value: EventSort }> = [
  { label: 'Date croissante', value: 'date-asc' },
  { label: 'Date décroissante', value: 'date-desc' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
];

const initialFilters: EventFilters = {
  query: '',
  city: '',
  category: '',
  sort: 'date-asc',
  minPrice: '',
  maxPrice: '',
};

export const Search = () => {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getAll(filters);
        if (isMounted) {
          setEvents(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleChange = (name: keyof EventFilters, value: string) => {
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.06),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.04),_transparent_28%)]" />
          <div className="relative space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">Recherche avancée</p>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">Trouve l’évènement qui te correspond</h1>
            <p className="max-w-2xl text-slate-600 dark:text-slate-300">
              Recherche par mot-clé, ville, catégorie ou budget. Trie ensuite les résultats pour aller droit au but.
            </p>
          </div>
        </Card>

        <Card>
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
              <p className="text-2xl font-bold text-slate-950 dark:text-white">{events.length}</p>
              <p>Résultats visibles</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
              <p className="text-2xl font-bold text-slate-950 dark:text-white">{filters.query ? 'Filtré' : 'Tout'}</p>
              <p>Vue courante</p>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="space-y-2 xl:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recherche</span>
            <input
              type="text"
              value={filters.query ?? ''}
              onChange={(event) => handleChange('query', event.target.value)}
              placeholder="Nom, description, lieu..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ville</span>
            <input
              type="text"
              value={filters.city ?? ''}
              onChange={(event) => handleChange('city', event.target.value)}
              placeholder="Paris"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Catégorie</span>
            <select
              value={filters.category ?? ''}
              onChange={(event) => handleChange('category', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            >
              {categories.map((category) => (
                <option key={category.value || 'all'} value={category.value}>{category.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tri</span>
            <select
              value={filters.sort ?? 'date-asc'}
              onChange={(event) => handleChange('sort', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            >
              {sortOptions.map((sortOption) => (
                <option key={sortOption.value} value={sortOption.value}>{sortOption.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prix min</span>
            <input
              type="number"
              min="0"
              value={filters.minPrice ?? ''}
              onChange={(event) => handleChange('minPrice', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prix max</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice ?? ''}
              onChange={(event) => handleChange('maxPrice', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleReset}>Réinitialiser</Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Chargement des évènements...</div>
      ) : events.length === 0 ? (
        <Card className="text-center">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">Aucun évènement trouvé</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Essaie de retirer un filtre ou de changer la recherche.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} compact />
          ))}
        </div>
      )}
    </div>
  );
};