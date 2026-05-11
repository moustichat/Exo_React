import type { Event, EventFilters } from '../types';
import { readJson } from './http-client';

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function sortEvents(events: Event[], sort?: EventFilters['sort']) {
  const sorted = [...events];
  switch (sort) {
    case 'date-desc':
      return sorted.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
    case 'price-asc':
      return sorted.sort((left, right) => (left.price ?? 0) - (right.price ?? 0));
    case 'price-desc':
      return sorted.sort((left, right) => (right.price ?? 0) - (left.price ?? 0));
    case 'date-asc':
    default:
      return sorted.sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
  }
}

function filterEvents(events: Event[], params?: EventFilters) {
  return sortEvents(events.filter((event) => {
    const query = normalize(params?.query);
    const city = normalize(params?.city);
    const category = params?.category;
    const minPrice = params?.minPrice ? Number(params.minPrice) : null;
    const maxPrice = params?.maxPrice ? Number(params.maxPrice) : null;

    const queryOk = query
      ? [event.title, event.description, event.city, event.location, event.category].some((field) => normalize(field).includes(query))
      : true;
    const cityOk = city ? normalize(event.city ?? event.location).includes(city) : true;
    const categoryOk = category ? normalize(event.category).includes(normalize(category)) : true;
    const minPriceOk = minPrice !== null ? (event.price ?? 0) >= minPrice : true;
    const maxPriceOk = maxPrice !== null ? (event.price ?? 0) <= maxPrice : true;

    return queryOk && cityOk && categoryOk && minPriceOk && maxPriceOk;
  }), params?.sort);
}

export const eventService = {
  async getAll(params?: EventFilters) {
    const response = await fetch('/api/v1/events', {
      credentials: 'include',
    });
    const payload = await readJson<{ success: boolean; data: { events: Event[] } }>(response, 'Failed to fetch events');
    return filterEvents(payload.data.events, params);
  },

  async getById(id: string) {
    const response = await fetch(`/api/v1/events/${id}`, {
      credentials: 'include',
    });
    const payload = await readJson<{ success: boolean; data: { event: Event } }>(response, 'Failed to fetch event');
    return payload.data.event;
  },

  async create(data: Partial<Event>) {
    const response = await fetch('/api/v1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const payload = await readJson<{ success: boolean; data: { event: Event } }>(response, 'Failed to create event');
    return payload.data.event;
  },

  async update(id: string, data: Partial<Event>) {
    const response = await fetch(`/api/v1/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const payload = await readJson<{ success: boolean; data: { event: Event } }>(response, 'Failed to update event');
    return payload.data.event;
  },

  async delete(id: string) {
    const response = await fetch(`/api/v1/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await readJson(response, 'Failed to delete event');
  },

  async getMyEvents() {
    const response = await fetch('/api/v1/events/my-events', {
      credentials: 'include',
    });
    const payload = await readJson<{ success: boolean; data: { events: Event[] } }>(response, 'Failed to fetch my events');
    return payload.data.events;
  },

  async restore(id: string) {
    const response = await fetch(`/api/v1/events/${id}/restore`, {
      method: 'POST',
      credentials: 'include',
    });
    const payload = await readJson<{ success: boolean; data: { event: Event } }>(response, 'Failed to restore event');
    return payload.data.event;
  },
};
