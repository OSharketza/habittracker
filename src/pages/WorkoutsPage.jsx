import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import AddWorkout from '../features/workouts/AddWorkout';
import WorkoutList from '../features/workouts/WorkoutList';
import Card from '../components/Card';

const WorkoutsPage = () => {
    const { getTodayStats } = useWorkouts();
    const stats = getTodayStats();

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Active Life</h1>
                    <p className="text-muted">Stay active, stay healthy.</p>
                </div>
            </div>

            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Card title="Today's Activity">
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--accent-info)', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.duration}m</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Duration</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--accent-warning)', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.caloriesBurned}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Calories</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--accent-success)', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.count}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Sessions</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                <AddWorkout />
                <div>
                    <h3 style={{ marginBottom: '16px' }}>Today's Workouts</h3>
                    <WorkoutList />
                </div>
            </div>
        </div>
    );
};

export default WorkoutsPage;
