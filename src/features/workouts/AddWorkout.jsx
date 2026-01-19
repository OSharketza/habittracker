import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import Button from '../../components/Button';

const AddWorkout = () => {
    const { addWorkout } = useWorkouts();
    const [formData, setFormData] = useState({
        type: '',
        duration: '',
        caloriesBurned: '',
        intensity: 'Medium'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.type || !formData.duration) return;
        addWorkout(formData.type, formData.duration, formData.caloriesBurned || 0, formData.intensity);
        setFormData({ type: '', duration: '', caloriesBurned: '', intensity: 'Medium' });
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Log Workout</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                    type="text"
                    name="type"
                    placeholder="Activity (e.g. Running)"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (mins)"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="caloriesBurned"
                    placeholder="Calories Burned"
                    value={formData.caloriesBurned}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <select
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }} // NOTE: Select styling is tricky in pure CSS without custom implementation, keeping simple
                >
                    <option value="Low" style={{ color: 'black' }}>Low Intensity</option>
                    <option value="Medium" style={{ color: 'black' }}>Medium Intensity</option>
                    <option value="High" style={{ color: 'black' }}>High Intensity</option>
                </select>
            </div>
            <Button type="submit" style={{ width: '100%' }}>Log Session</Button>
        </form>
    );
};

export default AddWorkout;
