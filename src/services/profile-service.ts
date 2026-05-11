import type { SessionUser } from '../types';
import { readJson } from './http-client';

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
