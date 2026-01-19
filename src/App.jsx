import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import MealsPage from './pages/MealsPage';
import WorkoutsPage from './pages/WorkoutsPage';
import SleepPage from './pages/SleepPage';
import WaterPage from './pages/WaterPage';
import ThemeToggle from './components/ThemeToggle';
import { LayoutDashboard, CheckSquare, Utensils, Dumbbell, Moon, Droplets } from 'lucide-react';

function App() {
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
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/habits" icon={<CheckSquare size={20} />} label="Habits" />
            <NavItem to="/meals" icon={<Utensils size={20} />} label="Meals" />
            <NavItem to="/workouts" icon={<Dumbbell size={20} />} label="Workouts" />
            <NavItem to="/sleep" icon={<Moon size={20} />} label="Sleep" />
            <NavItem to="/water" icon={<Droplets size={20} />} label="Water" />
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '16px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/water" element={<WaterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const NavItem = ({ to, icon, label }) => (
  <Link to={to} style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
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
