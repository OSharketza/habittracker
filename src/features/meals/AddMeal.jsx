import React, { useState } from 'react';
import { useMeals } from '../../context/MealContext';
import Button from '../../components/Button';
import { Plus } from 'lucide-react';

const AddMeal = () => {
    const { addMeal } = useMeals();
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.calories) return;
        addMeal(
            formData.name,
            formData.calories,
            formData.protein || 0,
            formData.carbs || 0,
            formData.fat || 0
        );
        setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Log a Meal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Meal Item (e.g. Oatmeal)"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={formData.calories}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="protein"
                    placeholder="Protein (g)"
                    value={formData.protein}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs (g)"
                    value={formData.carbs}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
                <input
                    type="number"
                    name="fat"
                    placeholder="Fat (g)"
                    value={formData.fat}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                />
            </div>
            <Button type="submit" style={{ width: '100%' }}>Add Entry</Button>
        </form>
    );
};

export default AddMeal;
