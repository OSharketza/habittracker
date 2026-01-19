import React, { createContext, useContext, useState, useEffect } from 'react';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    const addHabit = (name, category = 'general') => {
        const newHabit = {
            id: Date.now().toString(),
            name,
            category,
            completedDates: [], // Array of ISO date strings
            createdAt: new Date().toISOString()
        };
        setHabits(prev => [...prev, newHabit]);
    };

    const removeHabit = (id) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    const toggleHabit = (id, date = new Date().toISOString().split('T')[0]) => {
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const isCompleted = h.completedDates.includes(date);
                return {
                    ...h,
                    completedDates: isCompleted
                        ? h.completedDates.filter(d => d !== date)
                        : [...h.completedDates, date]
                };
            }
            return h;
        }));
    };

    const getTodayProgress = () => {
        if (habits.length === 0) return 0;
        const today = new Date().toISOString().split('T')[0];
        const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
        return (completedCount / habits.length) * 100;
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, removeHabit, toggleHabit, getTodayProgress }}>
            {children}
        </HabitContext.Provider>
    );
};
