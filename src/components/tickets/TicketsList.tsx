import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Ticket } from '../../types';
import { ticketService } from '../../services';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TicketCard } from './TicketCard';
import { useFormMessage } from '../../hooks/useFormMessage';

export const TicketsList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingTicketId, setRemovingTicketId] = useState<number | null>(null);
  const { message: actionMessage, setMessage: setActionMessage, setMessageWithAutoReset } = useFormMessage();

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRemoveQuantity = async (ticket: Ticket, quantityToRemove: number) => {
    try {
      setActionMessage('');
      setRemovingTicketId(ticket.id);
      await ticketService.removeTicketQuantity(ticket.id, quantityToRemove);
      setMessageWithAutoReset(`Tu as supprimé ${quantityToRemove} place${quantityToRemove > 1 ? 's' : ''}.`);
      await fetchTickets();
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
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onDelete={(quantity) => handleRemoveQuantity(ticket, quantity)}
            isLoading={removingTicketId === ticket.id}
          />
        ))}
      </div>
    </div>
  );
};