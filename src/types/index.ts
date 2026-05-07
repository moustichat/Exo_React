export type EventCategory = 'Concert' | 'Conference' | 'Festival' | 'Sport' | 'Theatre' | 'Other';

export type UserRole = 'USER' | 'ORGANIZER' | 'ADMIN';

export type EventSort = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  duree?: string;
  location: string;
  city?: string;
  price?: number;
  total_seats?: number;
  seats_available?: number;
  category?: EventCategory;
  organizerId: string;
  picture?: number | null;
  createdAt: string;
  updatedAt: string;
  capacity?: number;
  ticketPrice?: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  quantity: number;
  totalPrice: number;
  event?: Event;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface EventFilters {
  query?: string;
  city?: string;
  category?: EventCategory | '';
  sort?: EventSort;
  minPrice?: string;
  maxPrice?: string;
}
