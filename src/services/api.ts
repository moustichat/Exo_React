import type { Event, EventFilters, SessionUser, Ticket } from '../types';

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

async function readJson<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'message' in payload
      ? String((payload as { message?: unknown }).message ?? fallbackMessage)
      : fallbackMessage;
    throw new Error(message);
  }
  return payload as T;
}

function extractUser(payload: unknown): SessionUser {
  const response = payload as { data?: { user?: SessionUser }; user?: SessionUser };
  const user = response.data?.user ?? response.user;
  if (!user) {
    throw new Error('Réponse utilisateur invalide');
  }
  return user;
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

export const ticketService = {
  async getUserTickets(): Promise<Ticket[]> {
    const response = await fetch('/api/v1/users/tickets', {
      credentials: 'include',
    });
    const payload = await readJson<{ success: boolean; data: { tickets: Ticket[] } }>(response, 'Failed to fetch tickets');
    return payload.data.tickets;
  },

  async buyTicket(eventId: string, quantity = 1): Promise<Ticket> {
    const response = await fetch('/api/v1/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ eventId, quantity }),
    });
    const payload = await readJson<{ success: boolean; data: { ticket: Ticket } }>(response, 'Failed to buy tickets');
    return payload.data.ticket;
  },
};

export const profileService = {
  async updateProfile(payload: { name?: string; email?: string }) {
    const response = await fetch('/api/v1/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const result = await readJson<{ success: boolean; data: { user: SessionUser } }>(response, 'Failed to update profile');
    return result.data.user;
  },

  async updatePassword(currentPassword: string, nextPassword: string) {
    const response = await fetch('/api/v1/users/me/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword: nextPassword }),
    });
    await readJson<{ success: boolean }>(response, 'Failed to update password');
  },
};

export const authService = {
  async getCurrentUser() {
    const response = await fetch('/api/v1/auth/me', {
      credentials: 'include',
    });

    if (response.status === 401) {
      return null;
    }

    const payload = await readJson<{ success: boolean; data: { user: SessionUser } }>(response, 'Failed to fetch current user');
    return payload.data.user;
  },

  async login(email: string, password: string) {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const payload = await readJson<{ success: boolean; data: { user: SessionUser } }>(response, 'Email ou mot de passe invalide');
    return extractUser(payload);
  },

  async register(email: string, password: string, name: string) {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });

    const payload = await readJson<{ success: boolean; data: { user: SessionUser } }>(response, 'Impossible de créer le compte');
    return extractUser(payload);
  },

  async logout() {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => undefined);
  },

  async becomeOrganizer() {
    const response = await fetch('/api/v1/auth/become-organizer', {
      method: 'POST',
      credentials: 'include',
    });

    const payload = await readJson<{ success: boolean; data: { user: SessionUser } }>(response, 'Impossible de devenir organisateur');
    return extractUser(payload);
  },
};

export const organizerService = {
  async getMyEvents() {
    return eventService.getMyEvents();
  },
};
