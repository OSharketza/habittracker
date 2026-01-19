import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import Button from '../../components/Button';
import { Plus } from 'lucide-react';

const AddHabit = () => {
    const [name, setName] = useState('');
    const { addHabit } = useHabits();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addHabit(name);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add a new habit..."
                style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-full)',
                    padding: '12px 20px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem'
                }}
            />
            <Button type="submit" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={24} />
            </Button>
        </form>
    );
};

export default AddHabit;
