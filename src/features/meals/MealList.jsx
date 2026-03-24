import React from 'react';
import { useMeals } from '../../context/MealContext';
import { Trash2, Utensils } from 'lucide-react';

const MealList = () => {
    const { getTodayMeals, removeMeal } = useMeals();
    const meals = getTodayMeals();

    if (meals.length === 0) {
        return (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Utensils size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <div>No meals logged today.</div>
            </div>
        );
    }

    // Grouping logic isn't strictly necessary if we just want a cleaner list, 
    // but we can sort them by time or order.
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {meals.map(meal => (
                <div key={meal.id} className="glass-card fade-in" style={{ 
                    padding: '16px 20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.03)',
                    transition: 'all 0.2s'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '10px', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#ef4444'
                        }}>
                             {meal.calories > 500 ? '🍖' : '🥗'}
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{meal.name}</h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '8px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{meal.calories} kcal</span>
                                <span style={{ opacity: 0.3 }}>|</span>
                                <span>P {meal.protein}g</span>
                                <span>C {meal.carbs}g</span>
                                <span>F {meal.fat}g</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => removeMeal(meal.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
                        className="hover-danger"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MealList;
