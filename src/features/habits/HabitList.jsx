import React from 'react';
import { useHabits } from '../../context/HabitContext';
import HabitItem from './HabitItem';

const HabitList = () => {
    const { habits } = useHabits();

    if (habits.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No habits added yet. Start your journey!
            </div>
        );
    }

    return (
        <div className="habit-list">
            {habits.map(habit => (
                <HabitItem key={habit.id} habit={habit} />
            ))}
        </div>
    );
};

export default HabitList;
