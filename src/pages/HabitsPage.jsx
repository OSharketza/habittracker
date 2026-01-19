import React from 'react';
import AddHabit from '../features/habits/AddHabit';
import HabitList from '../features/habits/HabitList';
import Card from '../components/Card';
import { useHabits } from '../context/HabitContext';
import ProgressBar from '../components/ProgressBar';

const HabitsPage = () => {
    const { getTodayProgress, habits } = useHabits();
    const progress = getTodayProgress();
    const today = new Date().toISOString().split('T')[0];
    const completedCount = habits.filter(h => h.completedDates.includes(today)).length;

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Habits</h1>
                    <p className="text-muted">Build better routines, one day at a time.</p>
                </div>
            </div>

            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Card title="Today's Progress">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <ProgressBar value={progress} color="var(--accent-primary)" height="12px" />
                        </div>
                        <span style={{ fontWeight: 'bold' }}>{Math.round(progress)}%</span>
                    </div>
                    <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                        {completedCount} of {habits.length} completed
                    </p>
                </Card>
            </div>

            <Card style={{ padding: '32px' }}>
                <AddHabit />
                <HabitList />
            </Card>
        </div>
    );
};

export default HabitsPage;
