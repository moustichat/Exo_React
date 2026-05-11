import type { SessionUser } from '../types';
import { readJson, extractUser } from './http-client';

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
