import React from 'react';
import { useMeals } from '../context/MealContext';
import AddMeal from '../features/meals/AddMeal';
import MealList from '../features/meals/MealList';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const MealsPage = () => {
    const { getTodayStats, calorieGoal } = useMeals();
    const stats = getTodayStats();

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Nutrition</h1>
                    <p className="text-muted">Track your daily fuel and macros.</p>
                </div>
            </div>

            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Card title="Calorie Intake">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.calories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {calorieGoal}</span></span>
                        <span style={{ color: 'var(--text-muted)' }}>kcal</span>
                    </div>
                    <ProgressBar value={stats.calories} max={calorieGoal} color="var(--accent-danger)" height="12px" />
                </Card>

                <Card title="Macro Breakdown">
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{stats.protein}g</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Protein</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--accent-warning)', fontWeight: 'bold', fontSize: '1.25rem' }}>{stats.carbs}g</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Carbs</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--accent-success)', fontWeight: 'bold', fontSize: '1.25rem' }}>{stats.fat}g</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Fat</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                <AddMeal />
                <div>
                    <h3 style={{ marginBottom: '16px' }}>Today's Log</h3>
                    <MealList />
                </div>
            </div>
        </div>
    );
};

export default MealsPage;
