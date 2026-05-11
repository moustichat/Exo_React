import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Ticket } from '../../types';
import { ticketService } from '../../services';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const TicketsList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantityToRemoveByTicket, setQuantityToRemoveByTicket] = useState<Record<number, number>>({});
  const [actionMessage, setActionMessage] = useState('');
  const [removingTicketId, setRemovingTicketId] = useState<number | null>(null);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data);
      setQuantityToRemoveByTicket((current) => {
        const next: Record<number, number> = {};
        for (const ticket of data) {
          next[ticket.id] = current[ticket.id] ?? 1;
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRemoveQuantity = async (ticket: Ticket) => {
    const quantityToRemove = quantityToRemoveByTicket[ticket.id] ?? 1;

    try {
      setActionMessage('');
      setRemovingTicketId(ticket.id);
      await ticketService.removeTicketQuantity(ticket.id, quantityToRemove);
      setActionMessage(`Tu as supprimé ${quantityToRemove} place${quantityToRemove > 1 ? 's' : ''}.`);
      await fetchTickets();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : 'Impossible de supprimer ces places.');
    } finally {
      setRemovingTicketId(null);
    }
  };

  if (loading) {
    return <div className="py-6 text-center text-slate-600 dark:text-slate-300">Chargement de vos billets...</div>;
  }

  if (tickets.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-lg font-semibold text-slate-950 dark:text-white">Tu n'as pas encore acheté de billet.</p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Commence par parcourir les évènements disponibles.</p>
        <Link to="/search" className="mt-4 inline-block">
          <Button variant="secondary">Découvrir les évènements</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {actionMessage && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {actionMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className={`space-y-4 ${ticket.event?.isDeleted ? 'opacity-75' : ''}`}>
          {ticket.event && (
            <>
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
                    value={quantityToRemoveByTicket[ticket.id] ?? 1}
                    onChange={(event) => {
                      const nextQuantity = Number(event.target.value);
                      if (!Number.isFinite(nextQuantity)) {
                        return;
                      }

                      setQuantityToRemoveByTicket((current) => ({
                        ...current,
                        [ticket.id]: Math.min(ticket.quantity, Math.max(1, nextQuantity)),
                      }));
                    }}
                    className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                  />

                  <Button
                    type="button"
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleRemoveQuantity(ticket)}
                    disabled={removingTicketId === ticket.id}
                  >
                    Supprimer {Math.min(quantityToRemoveByTicket[ticket.id] ?? 1, ticket.quantity)} place{Math.min(quantityToRemoveByTicket[ticket.id] ?? 1, ticket.quantity) > 1 ? 's' : ''}
                  </Button>
                </div>
              </div>

              <Link to={`/events/${ticket.event.id}`} className="block">
                <Button variant="secondary" className="w-full">Voir l'évènement</Button>
              </Link>
            </>
          )}
          </Card>
        ))}
      </div>
    </div>
  );
};