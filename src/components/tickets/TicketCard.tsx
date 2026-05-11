import { useState } from 'react';
import type { Ticket } from '../../types';
import { Button } from '../ui/Button';

interface TicketCardProps {
  ticket: Ticket;
  onDelete: (quantity: number) => Promise<void>;
  isLoading?: boolean;
}

export const TicketCard = ({ ticket, onDelete, isLoading = false }: TicketCardProps) => {
  const [quantityToRemove, setQuantityToRemove] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!ticket.event) {
    return null;
  }

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await onDelete(quantityToRemove);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 ${ticket.event.isDeleted ? 'opacity-75' : ''}`}>
      {ticket.event.isDeleted && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">
          🗑️ Événement supprimé
        </div>
      )}
      
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Billet acheté</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{ticket.event.title}</h2>
      </div>

      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{ticket.event.description}</p>

      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>📅 {new Date(ticket.event.date).toLocaleDateString('fr-FR')}</p>
        <p>📍 {ticket.event.city ?? ticket.event.location}</p>
        <p>💰 {ticket.totalPrice} €</p>
        <p>🕒 {new Date(ticket.purchaseDate).toLocaleString('fr-FR')}</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 px-5 py-4 text-white shadow-lg dark:from-amber-400 dark:to-amber-300 dark:text-slate-950">
        <p className="text-xs uppercase tracking-[0.28em] text-white/70 dark:text-slate-700">Places achetées</p>
        <p className="mt-1 text-5xl font-black leading-none">{ticket.quantity}</p>
        <p className="mt-2 text-sm font-medium text-white/80 dark:text-slate-800">
          place{ticket.quantity > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Supprimer une partie</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={ticket.quantity}
            value={quantityToRemove}
            onChange={(e) => {
              const nextQuantity = Number(e.target.value);
              if (!Number.isFinite(nextQuantity)) {
                return;
              }
              setQuantityToRemove(Math.min(ticket.quantity, Math.max(1, nextQuantity)));
            }}
            className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />

          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={handleRemove}
            disabled={isDeleting || isLoading}
          >
            Supprimer {Math.min(quantityToRemove, ticket.quantity)} place{Math.min(quantityToRemove, ticket.quantity) > 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};
