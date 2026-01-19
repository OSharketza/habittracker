import React, { useState } from 'react';
import { useMeals } from '../context/MealContext';
import AddMeal from '../features/meals/AddMeal';
import MealList from '../features/meals/MealList';
import Button from '../components/Button';
import { List } from 'lucide-react';
import CalorieChart from '../features/meals/CalorieChart';

const MealsPage = () => {
    const { getTodayStats, getTodayMeals, calorieGoal } = useMeals();
    const stats = getTodayStats();
    const [isChartOpen, setIsChartOpen] = useState(false);

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="page-title">Meals & Nutrition</h2>
                <Button variant="outline" onClick={() => setIsChartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <List size={18} />
                    View Calorie Chart
                </Button>
            </div>

            <CalorieChart
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                onSelect={(item) => setIsChartOpen(false)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Calories</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>
                        {stats.calories} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>/ {calorieGoal}</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Protein</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.protein}g</div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Carbs</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.carbs}g</div>
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Fat</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.fat}g</div>
                </div>
            </div>

            <AddMeal />
            <MealList />
        </div>
    );
};

export default MealsPage;
