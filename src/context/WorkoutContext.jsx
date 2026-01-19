import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

export const useWorkouts = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setWorkouts([]);
            return;
        }

        const fetchWorkouts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching workouts:', error);
            } else {
                setWorkouts(data);
            }
            setLoading(false);
        };

        fetchWorkouts();
    }, [user]);

    const addWorkout = async (type, duration, caloriesBurned, intensity) => {
        if (!user) return;

        const newWorkout = {
            user_id: user.id,
            type,
            duration: Number(duration),
            calories_burned: Number(caloriesBurned), // Note column name change to match DB
            intensity,
            date: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
            .from('workouts')
            .insert([newWorkout])
            .select()
            .single();

        if (error) {
            console.error('Error adding workout:', error);
            return;
        }

        // Map back to camelCase if needed, or update usage sites. 
        // DB returns 'calories_burned'. Frontend uses 'caloriesBurned'.
        // Let's normalize data processing or state.
        // Simplest: store as is from DB, but map for frontend consistency if lots of usage.
        // Or just map here.
        const formattedData = {
            ...data,
            caloriesBurned: data.calories_burned
        };

        setWorkouts(prev => [...prev, formattedData]);
    };

    const removeWorkout = async (id) => {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error removing workout:', error);
            return;
        }

        setWorkouts(prev => prev.filter(w => w.id !== id));
    };

    const getTodayWorkouts = () => {
        const today = new Date().toISOString().split('T')[0];
        return workouts.filter(w => w.date === today);
    };

    const getTodayStats = () => {
        const todayWorkouts = getTodayWorkouts();
        return todayWorkouts.reduce((acc, w) => ({
            duration: acc.duration + w.duration,
            caloriesBurned: acc.caloriesBurned || acc.calories_burned || 0, // Handle both casing
            count: acc.count + 1
        }), { duration: 0, caloriesBurned: 0, count: 0 });
    };

    return (
        <WorkoutContext.Provider value={{
            workouts,
            addWorkout,
            removeWorkout,
            getTodayWorkouts,
            getTodayStats,
            loading
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};
