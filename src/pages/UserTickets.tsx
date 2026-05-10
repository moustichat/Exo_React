import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Ticket } from '../types';
import { ticketService } from '../services';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const UserTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/tickets' } });
      return;
    }

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

    // Allow regular users and organizers/admins to view their tickets
    if (!['USER', 'ORGANIZER', 'ADMIN'].includes(user.role)) {
      navigate('/');
      return;
    }

    fetchTickets();
  }, [user, navigate]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Espace utilisateur</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Mes billets</h1>
      </section>

      {loading ? (
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Chargement de vos billets...</div>
      ) : tickets.length === 0 ? (
        <Card className="text-center">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">Tu n’as pas encore acheté de billet.</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Commence par parcourir les évènements disponibles.</p>
          <Link to="/search" className="mt-4 inline-block">
            <Button variant="secondary">Découvrir les évènements</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="space-y-4">
              {ticket.event && (
                <>
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

                  <Link to={`/events/${ticket.event.id}`} className="block">
                    <Button variant="secondary" className="w-full">Voir l’évènement</Button>
                  </Link>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
