import { useState } from 'react';
import type { Event, EventCategory } from '../../types';
import { Button } from '../ui/Button';

const categories = ['Concert', 'Conference', 'Festival', 'Sport', 'Theatre', 'Other'] as const;

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  onCancel: () => void;
  message?: string;
}

export const EventForm = ({ initialData, onSubmit, onCancel, message }: EventFormProps) => {
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
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    date: initialData?.date ? initialData.date.split('T')[0] + 'T' + new Date(initialData.date).toTimeString().slice(0, 5) : getTomorrowNoon(),
    duree: initialData?.duree ?? '01:00:00',
    location: initialData?.location ?? '',
    city: initialData?.city ?? '',
    category: (initialData?.category ?? 'Other') as EventCategory,
    totalSeats: initialData?.total_seats?.toString() ?? '',
    price: initialData?.price?.toString() ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((curr) => ({ ...curr, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const seatCount = parseInt(formData.totalSeats);
      const price = parseFloat(formData.price);

      if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.city || !formData.totalSeats || !formData.price) {
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
        seats_available: initialData ? undefined : seatCount,
        price,
      };

      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      {message && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Titre de l'événement</span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Catégorie</span>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Date et heure</span>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Durée (hh:mm:ss)</span>
          <input
            type="text"
            value={formData.duree}
            onChange={(e) => handleChange('duree', e.target.value)}
            placeholder="01:00:00"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Lieu</span>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ville</span>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nombre de places</span>
          <input
            type="number"
            value={formData.totalSeats}
            onChange={(e) => handleChange('totalSeats', e.target.value)}
            required
            min="1"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prix (€)</span>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-300"
        />
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sauvegarde...' : initialData ? 'Mettre à jour' : 'Créer l\'événement'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};
