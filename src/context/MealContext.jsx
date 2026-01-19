import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const MealContext = createContext();

export const useMeals = () => useContext(MealContext);

export const MealProvider = ({ children }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Keep calorie goal local for now or move to profile later
    const [calorieGoal, setCalorieGoal] = useState(() => {
        return localStorage.getItem('calorieGoal') || 2000;
    });

    useEffect(() => {
        if (!user) {
            setMeals([]);
            return;
        }

        const fetchMeals = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching meals:', error);
            } else {
                setMeals(data);
            }
            setLoading(false);
        };

        fetchMeals();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('calorieGoal', calorieGoal);
    }, [calorieGoal]);

    const addMeal = async (name, calories, protein, carbs, fat) => {
        if (!user) return;

        const newMeal = {
            user_id: user.id,
            name,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
            date: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
            .from('meals')
            .insert([newMeal])
            .select()
            .single();

        if (error) {
            console.error('Error adding meal:', error);
            return;
        }

        setMeals(prev => [...prev, data]);
    };

    const removeMeal = async (id) => {
        const { error } = await supabase
            .from('meals')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error removing meal:', error);
            return;
        }

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
            setCalorieGoal,
            loading
        }}>
            {children}
        </MealContext.Provider>
    );
};
