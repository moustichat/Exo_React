import type { Ticket } from '../types';
import { readJson } from './http-client';

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

  async removeTicketQuantity(ticketId: number, quantity: number): Promise<void> {
    const response = await fetch(`/api/v1/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    await readJson(response, 'Failed to remove tickets');
  },
};
