import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
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
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import { LayoutDashboard, CheckSquare, Utensils, Dumbbell, Moon, Droplets, LogOut, Settings, Target } from 'lucide-react';
import ManifestationPage from './pages/ManifestationPage';

function App() {
  const { user, signOut } = useAuth();

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            {/* Desktop Side Navigation */}
            <nav className="glass-panel desktop-nav" style={{
              width: '260px',
              margin: '16px',
              padding: '24px',
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <DesktopNavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <DesktopNavLink to="/habits" icon={<CheckSquare size={20} />} label="Habits" />
                <DesktopNavLink to="/meals" icon={<Utensils size={20} />} label="Meals" />
                <DesktopNavLink to="/workouts" icon={<Dumbbell size={20} />} label="Workouts" />
                <DesktopNavLink to="/sleep" icon={<Moon size={20} />} label="Sleep" />
                <DesktopNavLink to="/water" icon={<Droplets size={20} />} label="Water" />
                <DesktopNavLink to="/manifestations" icon={<Target size={20} />} label="Manifestations" />
                <DesktopNavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
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
            <main style={{ flex: 1, overflowX: 'hidden' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/meals" element={<MealsPage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
                <Route path="/sleep" element={<SleepPage />} />
                <Route path="/water" element={<WaterPage />} />
                <Route path="/manifestations" element={<ManifestationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <nav className="mobile-nav glass-panel" style={{
            position: 'fixed',
            bottom: '12px',
            left: '12px',
            right: '12px',
            height: '70px',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 1000,
            borderRadius: '20px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
            margin: 0
          }}>
            <MobileNavLink to="/" icon={<LayoutDashboard size={22} />} />
            <MobileNavLink to="/habits" icon={<CheckSquare size={22} />} />
            <MobileNavLink to="/meals" icon={<Utensils size={22} />} />
            <MobileNavLink to="/workouts" icon={<Dumbbell size={22} />} />
            <MobileNavLink to="/settings" icon={<Settings size={22} />} />
          </nav>
        </div>
      )}
    </Router>
  );
}

const DesktopNavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: 'var(--radius-md)',
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: isActive ? 'var(--bg-glass)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    }}>
      {icon}
      <span>{label}</span>
      {isActive && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
    </Link>
  );
};

const MobileNavLink = ({ to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      background: isActive ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    }}>
      {icon}
    </Link>
  );
};

export default App;
