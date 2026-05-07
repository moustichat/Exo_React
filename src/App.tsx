import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { UserTickets } from './pages/UserTickets';
import { Search } from './pages/Search';
import { EventDetails } from './pages/EventDetails';
import { Account } from './pages/Account';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/tickets" element={<UserTickets />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
