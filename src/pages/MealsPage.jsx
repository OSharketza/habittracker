import React, { useState } from 'react';
import { useMeals } from '../context/MealContext';
import AddMeal from '../features/meals/AddMeal';
import MealList from '../features/meals/MealList';
import Button from '../components/Button';
import MacroRing from '../components/MacroRing';
import ReminderSettings from '../components/ReminderSettings';
import ProgressBar from '../components/ProgressBar';
import { ChefHat, PieChart } from 'lucide-react';

const MealsPage = () => {
    const { getTodayStats, calorieGoal } = useMeals();
    const stats = getTodayStats();

    return (
        <div className="container fade-in">
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Fuel & Focus</h1>
                <p className="text-muted">High-performance nutrition for your goals.</p>
            </div>

            {/* Performance Nutrition Deck */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Macro Balance</h3>
                        <PieChart size={18} className="text-muted" />
                    </div>
                    <MacroRing protein={stats.protein} carbs={stats.carbs} fat={stats.fat} size={180} />
                </div>

                <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Caloric Window</h3>
                        <ChefHat size={18} className="text-muted" />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stats.calories}</span>
                            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ {calorieGoal} kcal</span>
                        </div>
                        <ProgressBar value={stats.calories} max={calorieGoal} color="var(--accent-danger)" height="12px" />
                        <div style={{ marginTop: '24px' }}>
                            <div className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                {stats.calories > calorieGoal ? 
                                    "You've exceeded your target. Focus on light, high-protein options for the rest of the day." :
                                    `You have ${calorieGoal - stats.calories} kcal remaining. Perfect for a balanced dinner.`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-auto">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <AddMeal />
                    <div>
                        <h3 style={{ marginBottom: '20px' }}>Meal Log</h3>
                        <MealList />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <ReminderSettings module="meals" label="Meal Tracking" />
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Nutrition Rule #1</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Eat a high-protein meal within 1 hour of waking to boost metabolic flexibility and maintain muscle mass.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealsPage;
