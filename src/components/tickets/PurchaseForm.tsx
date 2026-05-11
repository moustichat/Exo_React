import { useState } from 'react';
import type { Event } from '../../types';
import { Button } from '../ui/Button';

interface PurchaseFormProps {
  event: Event;
  onPurchase: (quantity: number) => Promise<void>;
  disabled: boolean;
  message?: string;
}

export const PurchaseForm = ({ event, onPurchase, disabled, message }: PurchaseFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const seatsAvailable = event.seats_available ?? event.total_seats ?? 0;
  const price = event.price ?? 0;

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onPurchase(quantity);
      setQuantity(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nombre de places</span>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10 w-10 p-0 text-lg"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1 || disabled}
            aria-label="Diminuer le nombre de places"
          >
            −
          </Button>

          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Places à acheter</p>
            <input
              type="number"
              min={1}
              max={seatsAvailable}
              step={1}
              value={quantity}
              disabled={disabled}
              onChange={(e) => {
                const nextQuantity = Number(e.target.value);
                if (!Number.isFinite(nextQuantity)) {
                  setQuantity(1);
                  return;
                }
                setQuantity(Math.min(seatsAvailable, Math.max(1, nextQuantity)));
              }}
              className="mt-1 w-28 border-0 bg-transparent text-center text-4xl font-black text-slate-950 outline-none [appearance:textfield] dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="Nombre de places à acheter"
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10 w-10 p-0 text-lg"
            onClick={() => setQuantity((current) => Math.min(seatsAvailable, current + 1))}
            disabled={quantity >= seatsAvailable || disabled}
            aria-label="Augmenter le nombre de places"
          >
            +
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
        Total à payer: <span className="font-bold text-slate-950 dark:text-white">{price * quantity} €</span>
      </div>

      <Button 
        className="w-full" 
        onClick={handleClick} 
        disabled={seatsAvailable <= 0 || disabled || isLoading}
      >
        {isLoading ? 'Validation...' : 'Valider l\'achat'}
      </Button>
    </div>
  );
};
