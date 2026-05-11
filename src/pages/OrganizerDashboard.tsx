import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event, EventCategory, Ticket } from '../types';
import { organizerService, eventService } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Concert',
  'Conference',
  'Festival',
  'Sport',
  'Theatre',
  'Other',
] as const;

export const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [restoreMessage, setRestoreMessage] = useState('');
  
  const getTomorrowNoon = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const hours = String(tomorrow.getHours()).padStart(2, '0');
    const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: getTomorrowNoon(),
    duree: '01:00:00',
    location: '',
    city: '',
    category: 'Other' as EventCategory,
    totalSeats: '',
    price: '',
  });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const getTicketSummaries = (tickets: Ticket[] = []) => {
    const summaries = new Map<string, { id: string; name: string; email: string; quantity: number }>();

    tickets.forEach((ticket) => {
      const ticketUser = ticket.user;
      const key = ticketUser?.id ?? ticket.userId;
      const current = summaries.get(key);

      summaries.set(key, {
        id: key,
        name: ticketUser?.name ?? 'Utilisateur inconnu',
        email: ticketUser?.email ?? '',
        quantity: (current?.quantity ?? 0) + ticket.quantity,
      });
    });

    return [...summaries.values()].sort((left, right) => right.quantity - left.quantity);
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate('/');
      return;
    }

    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    setLoading(true);

    const fetchEvents = async () => {
      try {
        const data = await organizerService.getMyEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setFormMessage('');
      const seatCount = parseInt(formData.totalSeats);
      const price = parseFloat(formData.price);

      if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.city || !formData.totalSeats || !formData.price) {
        setFormMessage('Tous les champs sont obligatoires.');
        return;
      }

      const data = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        duree: formData.duree,
        location: formData.location,
        city: formData.city,
        category: formData.category,
        total_seats: seatCount,
        seats_available: editingEventId ? undefined : seatCount,
        price,
      };

      if (editingEventId) {
        // Édition
        await eventService.update(editingEventId, data);
        setFormMessage('Événement mis à jour avec succès.');
        setEditingEventId(null);
      } else {
        // Création
        await eventService.create(data);
        setFormMessage('Événement créé avec succès.');
      }

      setFormData({
        title: '',
        description: '',
        date: getTomorrowNoon(),
        duree: '01:00:00',
        location: '',
        city: '',
        category: 'Other',
        totalSeats: '',
        price: '',
      });
      setShowForm(false);

      const updatedEvents = await organizerService.getMyEvents();
      setEvents(updatedEvents);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde.');
      console.error('Failed to save event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0] + 'T' + new Date(event.date).toTimeString().slice(0, 5),
      duree: event.duree || '',
      location: event.location,
      city: event.city || '',
      category: event.category || 'Other',
      totalSeats: event.total_seats?.toString() || '',
      price: event.price?.toString() || '',
    });
    setShowForm(true);
    setFormMessage('');
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      description: '',
      date: getTomorrowNoon(),
      duree: '01:00:00',
      location: '',
      city: '',
      category: 'Other',
      totalSeats: '',
      price: '',
    });
    setShowForm(false);
    setFormMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      setDeleteMessage('');
      // Optimistic update: mark as deleted immediately
      setEvents(events.map((e) => e.id === id ? { ...e, isDeleted: true } : e));
      await eventService.delete(id);
      setDeleteMessage('Événement supprimé avec succès.');
      setTimeout(() => setDeleteMessage(''), 3000);
    } catch (error) {
      setDeleteMessage(error instanceof Error ? error.message : 'Erreur lors de la suppression.');
      // Revert optimistic update on error
      const updatedEvents = await organizerService.getMyEvents();
      setEvents(updatedEvents);
      console.error('Failed to delete event:', error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setRestoreMessage('');
      await eventService.restore(id);
      const event = events.find((e) => e.id === id);
      if (event) {
        event.isDeleted = false;
        setEvents([...events]);
      }
      setRestoreMessage('Événement restauré avec succès.');
      setTimeout(() => setRestoreMessage(''), 3000);
    } catch (error) {
      setRestoreMessage(error instanceof Error ? error.message : 'Erreur lors de la restauration.');
      console.error('Failed to restore event:', error);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Gestion</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Mes événements</h1>
      </section>

      <div className="flex gap-3">
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary">
            + Créer un événement
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              {editingEventId ? 'Modifier l\'événement' : 'Créer un événement'}
            </h2>
          </div>

          {formMessage && (
            <div className={`rounded-2xl px-4 py-3 text-sm ${
              formMessage.includes('Erreur') 
                ? 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900' 
                : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
            }`}>
              {formMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Titre</span>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date</span>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Durée</span>
                <input
                  type="time"
                  step="1"
                  value={formData.duree}
                  onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Lieu</span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ville</span>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Catégorie</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Capacité totale</span>
                <input
                  type="number"
                  min="1"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prix du billet (€)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                {editingEventId ? 'Mettre à jour' : 'Créer l\'événement'}
              </Button>
              <Button type="button" onClick={handleCancelEdit} variant="secondary" className="flex-1">
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      {deleteMessage && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {deleteMessage}
        </div>
      )}

      {restoreMessage && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900">
          {restoreMessage}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-600 dark:text-slate-300">Chargement de vos événements...</div>
      ) : !showForm && events.length === 0 ? (
        <Card className="text-center">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">Tu n'as pas encore créé d'événement</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Clique sur "Créer un événement" pour commencer.</p>
        </Card>
      ) : !showForm ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className={`space-y-4 flex flex-col ${event.isDeleted ? 'opacity-60' : ''}`}>
              {event.isDeleted && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-200">
                  ⚠️ Cet événement a été supprimé
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">{event.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
              </div>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                <p>📍 {event.location}, {event.city}</p>
                <p>👥 Capacité: {event.total_seats} | Disponibles: {event.seats_available}</p>
                <p>💰 {event.price}€</p>
                <p>🎟️ Billets vendus: {event.tickets?.reduce((total, ticket) => total + ticket.quantity, 0) ?? 0}</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Acheteurs</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setExpandedEventId((current) => (current === event.id ? null : event.id))}
                  >
                    {expandedEventId === event.id ? 'Masquer' : 'Voir les détails'}
                  </Button>
                </div>

                {expandedEventId === event.id && (
                  <div className="space-y-3">
                    {getTicketSummaries(event.tickets ?? []).length === 0 ? (
                      <p className="text-sm text-slate-600 dark:text-slate-300">Aucun billet vendu pour le moment.</p>
                    ) : (
                      <div className="space-y-2">
                        {getTicketSummaries(event.tickets ?? []).map((buyer) => (
                          <div key={buyer.id} className="rounded-xl bg-white px-3 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-700">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-950 dark:text-white">{buyer.name}</p>
                                {buyer.email && <p className="text-xs text-slate-500 dark:text-slate-400">{buyer.email}</p>}
                              </div>
                              <p className="text-base font-bold text-slate-950 dark:text-white">{buyer.quantity} place{buyer.quantity > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-2">
                {!event.isDeleted ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(event)}
                    >
                      Éditer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(event.id)}
                    >
                      Supprimer
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRestore(event.id)}
                  >
                    Restaurer
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
};