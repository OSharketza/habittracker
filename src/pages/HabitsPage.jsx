import React from 'react';
import AddHabit from '../features/habits/AddHabit';
import HabitList from '../features/habits/HabitList';
import Card from '../components/Card';
import { useHabits } from '../context/HabitContext';
import ProgressBar from '../components/ProgressBar';
import ReminderSettings from '../components/ReminderSettings';
import SupportInboxPanel from '../components/SupportInboxPanel';
import { useAgents } from '../agents/useAgents';
import { Sparkles, Trophy, Zap } from 'lucide-react';

const HabitsPage = () => {
    const { getTodayProgress, getTodayCompletedCount, habits, weeklyIdentitySummary } = useHabits();
    const agents = useAgents();
    const progress = getTodayProgress();
    const completedCount = getTodayCompletedCount();
    const topIdentity = weeklyIdentitySummary[0];

    return (
        <div className="container fade-in">
            <div style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>Routines</h1>
                    <p className="text-muted">Build habits that reinforce who you are becoming.</p>
                </div>
                {progress === 100 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 20px', borderRadius: 'var(--radius-full)', color: 'var(--accent-success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <Trophy size={18} />
                        <span style={{ fontWeight: 'bold' }}>All Done for Today!</span>
                    </div>
                )}
            </div>

            {/* Performance Summary */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Card style={{ padding: '32px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={20} color="var(--accent-primary)" /> Today's Focus
                        </h3>
                        <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <ProgressBar value={progress} color="var(--accent-primary)" height="14px" />
                    </div>
                    <div className="text-muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>{completedCount} of {habits.length} routines completed</span>
                        <span>{habits.length - completedCount} remaining</span>
                    </div>
                    {topIdentity && (
                        <div className="glass-card" style={{ marginTop: '16px', padding: '14px' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Identity momentum</div>
                            <div style={{ fontWeight: '700' }}>{topIdentity.identityLabel}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {topIdentity.completionsThisWeek} reps this week through {topIdentity.habitName}.
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid-auto">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <AddHabit />
                    <div>
                        <HabitList />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <ReminderSettings module="habits" label="Daily Habits" />
                    <SupportInboxPanel />
                    <Card title="Habit Architect">
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                            AI-powered routine suggestions to help you build consistency.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {agents.architect.getSuggestions('fitness').map((habit, idx) => (
                                <div 
                                    key={idx} 
                                    className="glass-card hover-highlight" 
                                    onClick={() => agents.architect.applySuggestion(habit)}
                                    style={{ padding: '10px', fontSize: '0.85rem', border: '1px solid var(--border-glass)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Zap size={14} className="text-secondary" /> {habit}
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card title="Pro Tip">
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Identity-based habits stick better than outcome-only goals. If the habit is "Read 10 pages," the deeper win is proving "I am a reader."
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HabitsPage;
