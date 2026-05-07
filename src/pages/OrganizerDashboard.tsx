import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event, EventCategory } from '../types';
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    city: '',
    category: 'Other' as EventCategory,
    capacity: '',
    ticketPrice: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user?.role !== 'ORGANIZER') {
      navigate('/');
      return;
    }

    const organizerId = user.id;

    const fetchEvents = async () => {
      try {
        const data = await organizerService.getMyEvents(organizerId);
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    try {
      const seatCount = parseInt(formData.capacity);
      const ticketPrice = parseFloat(formData.ticketPrice);
      const data = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        city: formData.city,
        category: formData.category,
        organizerId: user.id,
        total_seats: seatCount,
        seats_available: seatCount,
        price: ticketPrice,
      };
      await eventService.create(data);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        city: '',
        category: 'Other',
        capacity: '',
        ticketPrice: '',
      });
      setShowForm(false);
      const updatedEvents = await organizerService.getMyEvents(user.id);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await eventService.delete(id);
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Gestion de mes événements
        </h1>
        <Button 
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Créer un événement'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Créer un nouvel événement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as EventCategory})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacité
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prix du billet (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Créer l'événement
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chargement de vos événements...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Vous n'avez pas encore créé d'événement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {event.description}
              </p>
              <div className="space-y-2 mb-4 text-sm text-gray-700 dark:text-gray-300">
                <p>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                <p>📍 {event.location}</p>
                <p>👥 Capacité: {event.capacity}</p>
                <p>💰 {event.ticketPrice}€</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
