import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import AddWorkout from '../features/workouts/AddWorkout';
import WorkoutList from '../features/workouts/WorkoutList';
import Card from '../components/Card';
import ReminderSettings from '../components/ReminderSettings';
import { Activity, Zap, Flame, Target } from 'lucide-react';

const WorkoutsPage = () => {
    const { getTodayStats } = useWorkouts();
    const stats = getTodayStats();

    return (
        <div className="container fade-in">
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>High Performance</h1>
                <p className="text-muted">Push your limits and track your physiological adaptation.</p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                   <StatCard icon={<Zap size={24} />} label="Intensity" value="Active" color="#3b82f6" />
                   <StatCard icon={<Flame size={24} />} label="Metabolic Burn" value={`${stats.caloriesBurned} kcal`} color="#ef4444" />
                   <StatCard icon={<Activity size={24} />} label="Duration" value={`${stats.duration}m`} color="#10b981" />
                   <StatCard icon={<Target size={24} />} label="Sessions" value={stats.count} color="#f59e0b" />
                </div>
            </div>

            <div className="grid-auto">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-panel" style={{ padding: '32px' }}>
                        <AddWorkout />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={20} className="text-muted" /> Today's Training
                        </h3>
                        <WorkoutList />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <ReminderSettings module="workouts" label="Workout" />
                    <Card title="Training Insight">
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Optimal training frequency for longevity is 3 sessions of Zone 2 cardio (45 min) and 2 sessions of progressive resistance training per week.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: `${color}15`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color 
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{value}</div>
        </div>
    </div>
);

export default WorkoutsPage;
