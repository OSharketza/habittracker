import React from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { Trash2, Timer, Flame, Zap } from 'lucide-react';

const WorkoutList = () => {
    const { getTodayWorkouts, removeWorkout } = useWorkouts();
    const workouts = getTodayWorkouts();

    if (workouts.length === 0) {
        return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No workouts logged today. Get moving!</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workouts.map(workout => (
                <div key={workout.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ margin: 0, marginBottom: '8px' }}>{workout.type}</h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Timer size={14} /> {workout.duration} min</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={14} /> {workout.caloriesBurned} kcal</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} /> {workout.intensity}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => removeWorkout(workout.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default WorkoutList;
