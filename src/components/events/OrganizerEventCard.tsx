import { useState } from 'react';
import type { Event } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BuyersPanel } from './BuyersPanel';

function formatDateTime(dateValue: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue));
}

interface OrganizerEventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}

export const OrganizerEventCard = ({ event, onEdit, onDelete, onRestore }: OrganizerEventCardProps) => {
  const [showBuyers, setShowBuyers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const buyerCount = event.tickets?.length ?? 0;
  const seatsAvailable = event.seats_available ?? event.total_seats ?? 0;

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(event.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await onRestore(event.id);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card className={`space-y-4 ${event.isDeleted ? 'opacity-50' : ''}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">{event.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ville : {event.city ?? 'Non renseignée'}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Lieu : {event.location}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">📅 {formatDateTime(event.date)}</p>
          </div>
          {event.isDeleted && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-400/20 dark:text-red-200">
              Supprimé
            </span>
          )}
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">Prix</p>
          <p className="font-bold text-slate-950 dark:text-white">{event.price} €</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">Places</p>
          <p className="font-bold text-slate-950 dark:text-white">{seatsAvailable}/{event.total_seats}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">Acheteurs</p>
          <p className="font-bold text-slate-950 dark:text-white">{buyerCount}</p>
        </div>
      </div>

      {buyerCount > 0 && (
        <button
          type="button"
          onClick={() => setShowBuyers(!showBuyers)}
          className="text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          {showBuyers ? '▼ Masquer les acheteurs' : '▶ Voir les acheteurs'}
        </button>
      )}

      {showBuyers && buyerCount > 0 && (
        <BuyersPanel event={event} />
      )}

      <div className="flex gap-2">
        {!event.isDeleted ? (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(event)}
              className="flex-1"
            >
              Éditer
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRestore}
            disabled={isRestoring}
            className="w-full"
          >
            {isRestoring ? 'Restauration...' : 'Restaurer'}
          </Button>
        )}
      </div>
    </Card>
  );
};
