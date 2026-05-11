import type { Event } from '../../types';
import { Card } from '../ui/Card';

interface BuyersSummary {
  id: string;
  name: string;
  email: string;
  quantity: number;
}

interface BuyersPanelProps {
  event: Event;
}

export const BuyersPanel = ({ event }: BuyersPanelProps) => {
  const buyers = getBuyersSummaries(event.tickets ?? []);

  if (buyers.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        Aucun acheteur pour cet événement.
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">Acheteurs ({buyers.length})</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{buyers.reduce((sum, b) => sum + b.quantity, 0)} places vendues</p>
      </div>

      <div className="space-y-2">
        {buyers.map((buyer) => (
          <div key={buyer.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{buyer.name}</p>
              <p className="truncate text-xs text-slate-600 dark:text-slate-400">{buyer.email}</p>
            </div>
            <div className="ml-2 text-right">
              <p className="font-bold text-slate-950 dark:text-white">{buyer.quantity}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">place{buyer.quantity > 1 ? 's' : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

function getBuyersSummaries(tickets: any[] = []) {
  const summaries = new Map<string, BuyersSummary>();

  tickets.forEach((ticket) => {
    const ticketUser = ticket.user;
    const key = ticketUser?.id ?? ticket.userId;
    const current = summaries.get(key);

    summaries.set(key, {
      id: key,
      name: ticketUser?.name ?? 'Utilisateur inconnu',
      email: ticketUser?.email ?? '',
      quantity: (current?.quantity ?? 0) + ticket.quantity,
    });
  });

  return [...summaries.values()].sort((left, right) => right.quantity - left.quantity);
}
