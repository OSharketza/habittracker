import React, { createContext, useContext, useState, useEffect } from 'react';

const MealContext = createContext();

export const useMeals = () => useContext(MealContext);

export const MealProvider = ({ children }) => {
    const [meals, setMeals] = useState(() => {
        const saved = localStorage.getItem('meals');
        return saved ? JSON.parse(saved) : [];
    });

    const [calorieGoal, setCalorieGoal] = useState(() => {
        return localStorage.getItem('calorieGoal') || 2000;
    });

    useEffect(() => {
        localStorage.setItem('meals', JSON.stringify(meals));
    }, [meals]);

    useEffect(() => {
        localStorage.setItem('calorieGoal', calorieGoal);
    }, [calorieGoal]);

    const addMeal = (name, calories, protein, carbs, fat) => {
        const newMeal = {
            id: Date.now().toString(),
            name,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        setMeals(prev => [...prev, newMeal]);
    };

    const removeMeal = (id) => {
        setMeals(prev => prev.filter(m => m.id !== id));
    };

    const getTodayMeals = () => {
        const today = new Date().toISOString().split('T')[0];
        return meals.filter(m => m.date === today);
    };

    const getTodayStats = () => {
        const todayMeals = getTodayMeals();
        return todayMeals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    return (
        <MealContext.Provider value={{
            meals,
            addMeal,
            removeMeal,
            getTodayMeals,
            getTodayStats,
            calorieGoal,
            setCalorieGoal
        }}>
            {children}
        </MealContext.Provider>
    );
};
