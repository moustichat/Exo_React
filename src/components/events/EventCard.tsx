import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export const EventCard = ({ event, compact = false }: EventCardProps) => {
  const seatsAvailable = event.seats_available ?? event.total_seats ?? 0;
  const seatsTotal = event.total_seats ?? seatsAvailable;

  return (
    <Card className={`flex h-full flex-col overflow-hidden ${compact ? 'p-5' : ''}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
            {event.category ?? 'Other'}
          </p>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">{event.title}</h3>
        </div>
        <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-amber-400 dark:text-slate-950">
          {event.price ?? 0} €
        </div>
      </div>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {event.description}
      </p>

      <div className="mt-auto space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>📅 {formatDate(event.date)}</p>
        <p>📍 {event.city ?? event.location}</p>
        <p>🎟️ {seatsAvailable} places restantes sur {seatsTotal}</p>
      </div>

      <div className="mt-5">
        <Link to={`/events/${event.id}`} className="block">
          <Button variant="secondary" className="w-full">
            Voir les détails
          </Button>
        </Link>
      </div>
    </Card>
  );
};