import React from 'react';
import { useMeals } from '../../context/MealContext';
import { Trash2 } from 'lucide-react';

const MealList = () => {
    const { getTodayMeals, removeMeal } = useMeals();
    const meals = getTodayMeals();

    if (meals.length === 0) {
        return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No meals logged today.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {meals.map(meal => (
                <div key={meal.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ margin: 0 }}>{meal.name}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span style={{ color: 'var(--accent-danger)' }}>{meal.calories} kcal</span>
                            <span style={{ margin: '0 8px' }}>•</span>
                            <span>P: {meal.protein}g  C: {meal.carbs}g  F: {meal.fat}g</span>
                        </div>
                    </div>
                    <button
                        onClick={() => removeMeal(meal.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MealList;
