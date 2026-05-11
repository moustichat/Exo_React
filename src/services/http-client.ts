import type { SessionUser } from '../types';

export async function readJson<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'message' in payload
      ? String((payload as { message?: unknown }).message ?? fallbackMessage)
      : fallbackMessage;
    throw new Error(message);
  }
  return payload as T;
}

export function extractUser(payload: unknown): SessionUser {
  const response = payload as { data?: { user?: SessionUser }; user?: SessionUser };
  const user = response.data?.user ?? response.user;
  if (!user) {
    throw new Error('Réponse utilisateur invalide');
  }
  return user;
}
