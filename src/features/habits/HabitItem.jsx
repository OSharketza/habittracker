import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

const HabitItem = ({ habit }) => {
    const { toggleHabit, removeHabit } = useHabits();
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = habit.completedDates.includes(today);

    return (
        <div className="glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={() => toggleHabit(habit.id)}
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: isCompleted ? 'none' : '2px solid var(--text-muted)',
                        background: isCompleted ? 'var(--accent-success)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.2s'
                    }}
                >
                    {isCompleted && <Check size={16} color="white" />}
                </button>
                <div>
                    <h4 style={{ margin: 0 }}>{habit.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{habit.category}</span>
                </div>
            </div>

            <button
                onClick={() => removeHabit(habit.id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '8px'
                }}
                className="hover-danger"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default HabitItem;
