import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { eventService, ticketService } from '../services';
import type { Event, Ticket } from '../types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export const EventDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [existingPurchase, setExistingPurchase] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const currentEvent = await eventService.getById(id);
        if (!isMounted) {
          return;
        }

        setEvent(currentEvent);

        if (isAuthenticated) {
          const tickets = await ticketService.getUserTickets();
          const existingTicket = tickets.find((ticket: Ticket) => ticket.eventId === id);
          setExistingPurchase(existingTicket?.quantity ?? null);
        } else {
          setExistingPurchase(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!event) {
      return;
    }

    const seatsAvailable = event.seats_available ?? event.total_seats ?? 0;
    if (quantity > seatsAvailable) {
      setQuantity(Math.max(1, seatsAvailable));
    }
  }, [event, quantity]);

  const handleProtectedAction = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handlePurchase = async () => {
    if (!event) {
      return;
    }

    try {
      const ticket = await ticketService.buyTicket(event.id, quantity);
      const purchasedQty = (ticket as any).purchasedQuantity || ticket.quantity;
      setMessage(`Billet validé pour ${purchasedQty} place${purchasedQty > 1 ? 's' : ''}.`);
      setEvent((currentEvent) => currentEvent
        ? { ...currentEvent, seats_available: Math.max(0, (currentEvent.seats_available ?? 0) - quantity) }
        : currentEvent,
      );
      setExistingPurchase(ticket.quantity);
      setQuantity(1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de valider l\'achat.');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-600 dark:text-slate-300">Chargement de l’évènement...</div>;
  }

  if (!event) {
    return (
      <Card className="text-center">
        <p className="text-lg font-semibold text-slate-950 dark:text-white">Évènement introuvable</p>
        <Link to="/search" className="mt-4 inline-block">
          <Button variant="secondary">Retour à la recherche</Button>
        </Link>
      </Card>
    );
  }

  const seatsAvailable = event.seats_available ?? event.total_seats ?? 0;
  const totalSeats = event.total_seats ?? seatsAvailable;
  const price = event.price ?? 0;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.16),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.06),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.04),_transparent_28%)]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700 dark:bg-amber-400/20 dark:text-amber-200">
                {event.category ?? 'Other'}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {event.city ?? event.location}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {formatDate(event.date)}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-slate-950 dark:text-white sm:text-5xl">{event.title}</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{event.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Prix</p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{price} €</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Places restantes</p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{seatsAvailable}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Capacité</p>
                <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{totalSeats}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Achat de billet</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Valider la réservation</h2>
          </div>

          {message && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
              {message}
            </div>
          )}

          {isAuthenticated ? (
            <div className="space-y-4">
              {existingPurchase ? (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900">
                  Tu as déjà acheté {existingPurchase} place{existingPurchase > 1 ? 's' : ''} pour cet événement.
                </div>
              ) : null}

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nombre de places</span>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-10 w-10 p-0 text-lg"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuer le nombre de places"
                  >
                    −
                  </Button>

                  <div className="flex flex-col items-center text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Places à acheter</p>
                    <input
                      type="number"
                      min={1}
                      max={seatsAvailable}
                      step={1}
                      value={quantity}
                      onChange={(event) => {
                        const nextQuantity = Number(event.target.value);
                        if (!Number.isFinite(nextQuantity)) {
                          setQuantity(1);
                          return;
                        }

                        setQuantity(Math.min(seatsAvailable, Math.max(1, nextQuantity)));
                      }}
                      className="mt-1 w-28 border-0 bg-transparent text-center text-4xl font-black text-slate-950 outline-none [appearance:textfield] dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label="Nombre de places à acheter"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-10 w-10 p-0 text-lg"
                    onClick={() => setQuantity((current) => Math.min(seatsAvailable, current + 1))}
                    disabled={quantity >= seatsAvailable}
                    aria-label="Augmenter le nombre de places"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                Total à payer: <span className="font-bold text-slate-950 dark:text-white">{price * quantity} €</span>
              </div>

              <Button className="w-full" onClick={handlePurchase} disabled={seatsAvailable <= 0}>
                Valider l’achat
              </Button>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Connecte-toi pour acheter ce billet. Tu pourras ensuite choisir le nombre de places à réserver.</p>
              <div className="flex gap-3">
                <Button onClick={handleProtectedAction}>Connexion</Button>
                <Link to="/register" state={{ from: location.pathname }}>
                  <Button variant="secondary">Inscription</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};