import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import MealsPage from './pages/MealsPage';
import WorkoutsPage from './pages/WorkoutsPage';
import SleepPage from './pages/SleepPage';
import WaterPage from './pages/WaterPage';
import ThemeToggle from './components/ThemeToggle';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuth } from './context/AuthContext';
import { LayoutDashboard, CheckSquare, Utensils, Dumbbell, Moon, Droplets, LogOut } from 'lucide-react';

function App() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Navigation */}
        <nav className="glass-panel" style={{
          width: '240px',
          margin: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          height: 'calc(100vh - 32px)',
          position: 'sticky',
          top: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
              HabiTrack
            </div>
            <ThemeToggle />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavLink to="/habits" icon={<CheckSquare size={20} />} label="Habits" />
            <NavLink to="/meals" icon={<Utensils size={20} />} label="Meals" />
            <NavLink to="/workouts" icon={<Dumbbell size={20} />} label="Workouts" />
            <NavLink to="/sleep" icon={<Moon size={20} />} label="Sleep" />
            <NavLink to="/water" icon={<Droplets size={20} />} label="Water" />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={signOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--accent-danger)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const NavLink = ({ to, icon, label }) => (
  <Link to={to} style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--bg-glass)';
      e.currentTarget.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default App;
