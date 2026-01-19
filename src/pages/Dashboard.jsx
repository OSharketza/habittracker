import React from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { CheckSquare, Droplets, Moon, Utensils, Flame } from 'lucide-react';

const Dashboard = () => {
    // Mock data for now
    const stats = {
        habitsCompleted: 3,
        totalHabits: 5,
        waterIntake: 1250,
        waterGoal: 2500,
        sleepHours: 6.5,
        sleepGoal: 8,
        calories: 1450,
        calorieGoal: 2200
    };

    return (
        <div className="container fade-in">
            <h1>Hello, Onam</h1>

            {/* Top Stats Row */}
            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Card title="Daily Progress">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="text-muted">Habits Completed</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{stats.habitsCompleted}/{stats.totalHabits}</span>
                    </div>
                    <ProgressBar value={stats.habitsCompleted} max={stats.totalHabits} color="var(--accent-success)" />
                </Card>

                <Card title="Wellness Score">
                    <div className="flex-center" style={{ height: '100%', minHeight: '60px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            82%
                        </span>
                    </div>
                </Card>
            </div>

            {/* Quick Actions Grid */}
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>At a Glance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>

                {/* Water Widget */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-info)' }}>
                            <Droplets size={24} />
                        </div>
                        <span className="text-muted">Water</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.waterIntake}ml</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {stats.waterGoal}ml goal</div>
                    </div>
                    <ProgressBar value={stats.waterIntake} max={stats.waterGoal} color="var(--accent-info)" height="6px" />
                </div>

                {/* Sleep Widget */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                            <Moon size={24} />
                        </div>
                        <span className="text-muted">Sleep</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.sleepHours}h</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {stats.sleepGoal}h goal</div>
                    </div>
                    <ProgressBar value={stats.sleepHours} max={stats.sleepGoal} color="var(--accent-primary)" height="6px" />
                </div>

                {/* Calories Widget */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '8px', borderRadius: '12px', color: 'var(--accent-danger)' }}>
                            <Flame size={24} />
                        </div>
                        <span className="text-muted">Calories</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.calories}</div>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>of {stats.calorieGoal} kcal</div>
                    </div>
                    <ProgressBar value={stats.calories} max={stats.calorieGoal} color="var(--accent-danger)" height="6px" />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
