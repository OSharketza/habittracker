import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch habits and their completions on mount
    useEffect(() => {
        if (!user) {
            setHabits([]);
            return;
        }

        const fetchHabits = async () => {
            setLoading(true);
            // Fetch user's habits
            const { data: habitsData, error: habitsError } = await supabase
                .from('habits')
                .select('*')
                .order('created_at', { ascending: true });

            if (habitsError) {
                console.error('Error fetching habits:', habitsError);
                setLoading(false);
                return;
            }

            // Fetch completions for the visible date range (or all for simplicity now)
            // Optimizing: fetch all completions for these habits
            const habitIds = habitsData.map(h => h.id);
            if (habitIds.length === 0) {
                setHabits([]);
                setLoading(false);
                return;
            }

            const { data: completionsData, error: completionsError } = await supabase
                .from('habit_completions')
                .select('*')
                .in('habit_id', habitIds);

            if (completionsError) {
                console.error('Error fetching completions:', completionsError);
            }

            // Merge completions into habits structure for frontend compatibility
            // Structure: { ...habit, completedDates: ['2023-01-01', ...] }
            const mergedHabits = habitsData.map(habit => {
                const completedDates = completionsData
                    .filter(c => c.habit_id === habit.id)
                    .map(c => c.date);
                return { ...habit, completedDates };
            });

            setHabits(mergedHabits);
            setLoading(false);
        };

        fetchHabits();
    }, [user]);

    const addHabit = async (name, category = 'general') => {
        if (!user) return;

        // Insert into DB
        const { data, error } = await supabase
            .from('habits')
            .insert([{ user_id: user.id, name, category }])
            .select()
            .single();

        if (error) {
            console.error('Error adding habit:', error);
            return;
        }

        // Update local state
        setHabits(prev => [...prev, { ...data, completedDates: [] }]);
    };

    const removeHabit = async (id) => {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error removing habit:', error);
            return;
        }

        setHabits(prev => prev.filter(h => h.id !== id));
    };

    const toggleHabit = async (id, date = new Date().toISOString().split('T')[0]) => {
        const habitIndex = habits.findIndex(h => h.id === id);
        if (habitIndex === -1) return;

        const habit = habits[habitIndex];
        const isCompleted = habit.completedDates.includes(date);

        // Optimistic UI update
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                return {
                    ...h,
                    completedDates: isCompleted
                        ? h.completedDates.filter(d => d !== date)
                        : [...h.completedDates, date]
                };
            }
            return h;
        }));

        if (isCompleted) {
            // Remove completion
            const { error } = await supabase
                .from('habit_completions')
                .delete()
                .match({ habit_id: id, date });

            if (error) console.error('Error uncompleting habit:', error);
        } else {
            // Add completion
            const { error } = await supabase
                .from('habit_completions')
                .insert([{ habit_id: id, date, user_id: user.id }]);

            if (error) console.error('Error completing habit:', error);
        }
    };

    const getTodayProgress = () => {
        if (habits.length === 0) return 0;
        const today = new Date().toISOString().split('T')[0];
        const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
        return (completedCount / habits.length) * 100;
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, removeHabit, toggleHabit, getTodayProgress, loading }}>
            {children}
        </HabitContext.Provider>
    );
};

