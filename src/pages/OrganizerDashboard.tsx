import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import { organizerService, eventService } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EventForm } from '../components/forms/EventForm';
import { OrganizerEventCard } from '../components/events/OrganizerEventCard';
import { useAuth } from '../context/AuthContext';
import { useFormMessage } from '../hooks/useFormMessage';

export const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { message: formMessage, setMessage: setFormMessage, setMessageWithAutoReset: setFormMessageAuto } = useFormMessage();
  const { message: deleteMessage, setMessage: setDeleteMessage, setMessageWithAutoReset: setDeleteMessageAuto } = useFormMessage();
  const { message: restoreMessage, setMessage: setRestoreMessage, setMessageWithAutoReset: setRestoreMessageAuto } = useFormMessage();

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

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

  const handleSubmit = async (data: Partial<Event>) => {
    try {
      setFormMessage('');
      
      if (editingEvent) {
        await eventService.update(editingEvent.id, data);
        setFormMessageAuto('Événement mis à jour avec succès.');
      } else {
        await eventService.create(data);
        setFormMessageAuto('Événement créé avec succès.');
      }

      setShowForm(false);
      setEditingEvent(null);

      const updatedEvents = await organizerService.getMyEvents();
      setEvents(updatedEvents);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde.');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
    setFormMessage('');
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setShowForm(false);
    setFormMessage('');
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteMessage('');
      // Optimistic update: mark as deleted immediately
      setEvents(events.map((e) => e.id === id ? { ...e, isDeleted: true } : e));
      await eventService.delete(id);
      setDeleteMessageAuto('Événement supprimé avec succès.');
    } catch (error) {
      setDeleteMessage(error instanceof Error ? error.message : 'Erreur lors de la suppression.');
      // Revert optimistic update on error
      const updatedEvents = await organizerService.getMyEvents();
      setEvents(updatedEvents);
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
      setRestoreMessageAuto('Événement restauré avec succès.');
    } catch (error) {
      setRestoreMessage(error instanceof Error ? error.message : 'Erreur lors de la restauration.');
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
        <EventForm
          initialData={editingEvent ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          message={formMessage}
        />
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
            <OrganizerEventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
