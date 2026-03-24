import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import TrendSparkline from '../components/TrendSparkline';
import { triggerPerfectDayConfetti } from '../utils/celebration';
import { useAgents } from '../agents/useAgents';
import { CheckSquare, Droplets, Utensils, Sparkles, CheckCircle, TrendingUp, Users, HeartHandshake, Zap } from 'lucide-react';
import { getDailyQuote } from '../utils/quotes';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { useMeals } from '../context/MealContext';
import { useWater } from '../context/WaterContext';
import { useSleep } from '../context/SleepContext';
import { useAccountability } from '../context/AccountabilityContext';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  const { habits, getTodayProgress, weeklyIdentitySummary, identityMomentum } = useHabits();
  const { getTodayStats, calorieGoal, setCalorieGoal } = useMeals();
  const { waterIntake, waterGoal, setWaterGoal } = useWater();
  const { getTodaySleep, sleepGoal, setSleepGoal } = useSleep();
  const { schemaReady, incomingInvites, members, habitsById, profiles } = useAccountability();
  const agents = useAgents();

  const todaySleep = getTodaySleep();
  const sleepHours = todaySleep ? Number(todaySleep.hours) : 0;
  const caloriesConsumed = getTodayStats().calories;
  const dailyQuote = useMemo(() => getDailyQuote(), []);
  const [manifestationDone, setManifestationDone] = useState(false);

  const mockTrends = {
    habits: [60, 80, 75, 90, 100, 85, 95],
    water: [1200, 1500, 1800, 2000, 1800, 2100, 2300],
    sleep: [6, 7, 7.5, 6, 8, 7.2, 7.5],
    calories: [1800, 2100, 1900, 2200, 2050, 1950, 2000]
  };

  useEffect(() => {
    if (!user) return;
    const checkManifestation = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('manifestations')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`);
      if (data?.length > 0) setManifestationDone(true);
    };
    checkManifestation();
  }, [user]);

  const habitProgress = Number(getTodayProgress().toFixed(0));

  const wellnessScore = useMemo(() => {
    const scores = [
      habitProgress,
      Math.min((waterIntake / waterGoal) * 100, 100),
      Math.min((sleepHours / sleepGoal) * 100, 100),
      Math.min((caloriesConsumed / calorieGoal) * 100, 100)
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / 4) || 0;
  }, [habitProgress, waterIntake, waterGoal, sleepHours, sleepGoal, caloriesConsumed, calorieGoal]);

  useEffect(() => {
    if (wellnessScore === 100) {
      triggerPerfectDayConfetti();
    }
  }, [wellnessScore]);

  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState({ calories: calorieGoal, water: waterGoal, sleep: sleepGoal });

  const handleGoalChange = (event) => setTempGoals({ ...tempGoals, [event.target.name]: event.target.value });

  const saveGoals = async () => {
    setCalorieGoal(Number(tempGoals.calories));
    setWaterGoal(Number(tempGoals.water));
    setSleepGoal(Number(tempGoals.sleep));
    await supabase
      .from('profiles')
      .update({
        daily_calorie_target: tempGoals.calories,
        daily_water_target: tempGoals.water,
        daily_sleep_target: tempGoals.sleep
      })
      .eq('id', user.id);
    setIsEditingGoals(false);
  };

  const topIdentity = weeklyIdentitySummary[0];
  const identityReflections = identityMomentum.slice(0, 3);
  const supportPulse = members
    .filter((member) => member.user_id === user?.id)
    .slice(0, 2);

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', marginBottom: '4px' }}>
            Peak Performance
          </h1>
          <p className="text-muted">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DAILY SCORE</div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{wellnessScore}%</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-dark)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="url(#blue-gradient)"
              strokeWidth="15"
              strokeDasharray={`${(wellnessScore / 100) * 534} 534`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: '900' }}>{wellnessScore}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>INDEX</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>AI Insights</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {agents.insights.trend} {agents.motivation.spark}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <StatItem label="Habits" val={`${habitProgress}%`} trend={mockTrends.habits} color="#10b981" />
            <StatItem label="Water" val={`${waterIntake}ml`} trend={mockTrends.water} color="#06b6d4" />
            <StatItem label="Sleep" val={`${sleepHours}h`} trend={mockTrends.sleep} color="#7c3aed" />
            <StatItem label="Fuel" val={caloriesConsumed} trend={mockTrends.calories} color="#ef4444" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Link to="/habits" className="glass-card hover-highlight" style={quickLinkStyle}>
          <CheckSquare size={20} color="#10b981" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '0.85rem' }}>Log Habit</div>
        </Link>
        <Link to="/water" className="glass-card hover-highlight" style={quickLinkStyle}>
          <Droplets size={20} color="#06b6d4" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '0.85rem' }}>+ Water</div>
        </Link>
        <Link to="/meals" className="glass-card hover-highlight" style={quickLinkStyle}>
          <Utensils size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '0.85rem' }}>Add Meal</div>
        </Link>
        <Link to="/manifestations" className="glass-card hover-highlight" style={quickLinkStyle}>
          <Sparkles size={20} color="#c026d3" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '0.85rem' }}>Manifest</div>
        </Link>
      </div>

      <div className="grid-auto">
        <Card title="Identity Momentum">
          {topIdentity ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>You are becoming</div>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '6px' }}>{topIdentity.identityLabel}</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {topIdentity.completionsThisWeek} completions this week from {topIdentity.habitName}.
                </div>
              </div>
              {identityReflections.map((item) => (
                <div key={item.habitId} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.identityLabel}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.reflection}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Create a habit identity on the Habits page to start getting reflections here.</div>
          )}
        </Card>

        <Card title="Support Pulse">
          {schemaReady && (incomingInvites.length > 0 || supportPulse.length > 0) ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {incomingInvites.slice(0, 2).map((invite) => {
                const habit = habitsById[invite.habit_id];
                const inviter = profiles[invite.inviter_user_id];
                return (
                  <div key={invite.id} className="glass-card" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '6px' }}>
                      <Users size={16} color="var(--accent-primary)" /> Pending invite
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {inviter?.displayName || 'A friend'} invited you to {invite.role === 'participant' ? 'join' : 'support'} "{habit?.name || 'a habit'}".
                    </div>
                  </div>
                );
              })}
              {supportPulse.map((group) => (
                <div key={group.id} className="glass-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '6px' }}>
                    <Users size={16} color="var(--accent-primary)" /> {habitsById[group.habit_id]?.name || 'Habit support'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                    You are a {group.role} for {profiles[group.invited_by_user_id]?.displayName || 'your friend'}.
                  </div>
                  <span style={pillStyle}>
                    <HeartHandshake size={12} /> habit-level support active
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Habit-level support invites will appear here when a friend adds you to one specific habit.
            </div>
          )}
        </Card>
      </div>

      <div className="grid-auto" style={{ marginTop: '24px' }}>
        <Card title="Today's Habits">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {habits.slice(0, 3).map((habit) => (
              <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', gap: '12px' }}>
                <div>
                  <div>{habit.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{habit.identityLabel}</div>
                </div>
                {habit.completedDates.includes(new Date().toISOString().split('T')[0]) ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : (
                  <TrendingUp size={18} color="rgba(255,255,255,0.2)" />
                )}
              </div>
            ))}
            <Link to="/habits" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Go to Habits →</Link>
          </div>
        </Card>

        <Card title="AI Skills">
          <div style={{ display: 'grid', gap: '12px' }}>
            <div className="glass-card" style={{ padding: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Zap size={16} className="text-secondary" /> 
                <strong>Habit Architect</strong>
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Let AI design your routine based on goals.</p>
            </div>
            <div className="glass-card" style={{ padding: '12px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Zap size={16} className="text-secondary" /> 
                <strong>Manifestation Mirror</strong>
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Sentiment reflection on your journal.</p>
            </div>
          </div>
        </Card>
      </div>

      {isEditingGoals && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Adjust Goals</h3>
              <button onClick={() => setIsEditingGoals(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calories</label>
                <input type="number" name="calories" value={tempGoals.calories} onChange={handleGoalChange} style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '10px', color: 'white' }} />
              </div>
              <Button onClick={saveGoals}>Save New Plan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatItem = ({ label, val, trend, color }) => (
  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '16px' }}>
    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label.toUpperCase()}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>{val}</div>
    <TrendSparkline data={trend} color={color} width={120} height={24} />
  </div>
);

const quickLinkStyle = {
  padding: '16px',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'white'
};

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border-glass)',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

export default Dashboard;
