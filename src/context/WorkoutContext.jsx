import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const useWorkouts = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState(() => {
        const saved = localStorage.getItem('workouts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }, [workouts]);

    const addWorkout = (type, duration, caloriesBurned, intensity) => {
        const newWorkout = {
            id: Date.now().toString(),
            type,
            duration: Number(duration),
            caloriesBurned: Number(caloriesBurned),
            intensity, // low, medium, high
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        setWorkouts(prev => [...prev, newWorkout]);
    };

    const removeWorkout = (id) => {
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
            caloriesBurned: acc.caloriesBurned + w.caloriesBurned,
            count: acc.count + 1
        }), { duration: 0, caloriesBurned: 0, count: 0 });
    };

    return (
        <WorkoutContext.Provider value={{
            workouts,
            addWorkout,
            removeWorkout,
            getTodayWorkouts,
            getTodayStats
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};
