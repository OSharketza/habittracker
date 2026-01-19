import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const SleepContext = createContext();

export const useSleep = () => useContext(SleepContext);

export const SleepProvider = ({ children }) => {
    const { user } = useAuth();
    const [sleepLogs, setSleepLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Keep sleep goal local for now
    const [sleepGoal, setSleepGoal] = useState(() => {
        return localStorage.getItem('sleepGoal') || 8;
    });

    useEffect(() => {
        if (!user) {
            setSleepLogs([]);
            return;
        }

        const fetchSleepLogs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('sleep_logs')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                console.error('Error fetching sleep logs:', error);
            } else {
                setSleepLogs(data);
            }
            setLoading(false);
        };

        fetchSleepLogs();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('sleepGoal', sleepGoal);
    }, [sleepGoal]);

    const addSleepLog = async (hours, quality) => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Upsert logic (requires unique constraint on user_id, date)
        const logData = {
            user_id: user.id,
            date: today,
            hours: Number(hours),
            quality
        };

        const { data, error } = await supabase
            .from('sleep_logs')
            .upsert(logData, { onConflict: 'user_id, date' })
            .select()
            .single();

        if (error) {
            console.error('Error logging sleep:', error);
            return;
        }

        // Update local state
        setSleepLogs(prev => {
            const todayIndex = prev.findIndex(l => l.date === today);
            if (todayIndex > -1) {
                const updated = [...prev];
                updated[todayIndex] = data; // Update existing
                return updated;
            }
            return [...prev, data]; // Add new
        });

        // Also update sleepGoal if it's different (optional, but keep consistent)
        // Check if data returned is null (if error happened but not caught)
        if (!data) return;
    };

    const getTodaySleep = () => {
        const today = new Date().toISOString().split('T')[0];
        return sleepLogs.find(l => l.date === today);
    };

    const getAverageSleep = () => {
        if (sleepLogs.length === 0) return 0;
        const total = sleepLogs.reduce((acc, log) => acc + Number(log.hours), 0);
        return (total / sleepLogs.length).toFixed(1);
    };

    return (
        <SleepContext.Provider value={{
            sleepLogs,
            addSleepLog,
            getTodaySleep,
            getAverageSleep,
            sleepGoal,
            setSleepGoal,
            loading
        }}>
            {children}
        </SleepContext.Provider>
    );
};
