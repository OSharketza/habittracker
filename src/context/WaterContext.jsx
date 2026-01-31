import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const WaterContext = createContext();

export const useWater = () => useContext(WaterContext);

export const WaterProvider = ({ children }) => {
    const { user } = useAuth();
    const [waterIntake, setWaterIntake] = useState(0);
    const [loading, setLoading] = useState(false);

    // Keep goal local
    const [waterGoal, setWaterGoal] = useState(() => {
        return localStorage.getItem('waterGoal') || 2500;
    });

    useEffect(() => {
        if (!user) {
            setWaterIntake(0);
            return;
        }

        const fetchTodayWater = async () => {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('water_logs')
                .select('amount')
                .eq('date', today)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching water:', error);
            } else {
                const total = data.reduce((acc, log) => acc + log.amount, 0);
                setWaterIntake(total);
            }
            setLoading(false);
        };

        fetchTodayWater();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('waterGoal', waterGoal);
    }, [waterGoal]);

    const addWater = async (amount) => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        const { error } = await supabase
            .from('water_logs')
            .insert([{ user_id: user.id, date: today, amount: Number(amount) }]);

        if (error) {
            console.error('Error adding water:', error);
            return;
        }

        setWaterIntake(prev => prev + Number(amount));
    };

    const resetWater = async () => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];

        const { error } = await supabase
            .from('water_logs')
            .delete()
            .eq('date', today)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error resetting water:', error);
            return;
        }

        setWaterIntake(0);
    };

    return (
        <WaterContext.Provider value={{
            waterIntake,
            waterGoal,
            setWaterGoal,
            addWater,
            resetWater,
            loading
        }}>
            {children}
        </WaterContext.Provider>
    );
};
