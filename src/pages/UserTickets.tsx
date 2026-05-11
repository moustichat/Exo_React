import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TicketsList } from '../components/tickets/TicketsList';


export const UserTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/tickets' } });
      return;
    }
  }, [user, navigate]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Espace utilisateur</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Mes billets</h1>
      </section>

      <TicketsList />
    </div>
  );
};
