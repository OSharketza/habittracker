import React, { createContext, useContext, useState, useEffect } from 'react';

const SleepContext = createContext();

export const useSleep = () => useContext(SleepContext);

export const SleepProvider = ({ children }) => {
    const [sleepLogs, setSleepLogs] = useState(() => {
        const saved = localStorage.getItem('sleepLogs');
        return saved ? JSON.parse(saved) : [];
    });

    const [sleepGoal, setSleepGoal] = useState(() => {
        return localStorage.getItem('sleepGoal') || 8;
    });

    useEffect(() => {
        localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));
    }, [sleepLogs]);

    useEffect(() => {
        localStorage.setItem('sleepGoal', sleepGoal);
    }, [sleepGoal]);

    const addSleepLog = (hours, quality) => {
        const today = new Date().toISOString().split('T')[0];
        // Check if entry exists for today and update or add new
        const existingIndex = sleepLogs.findIndex(l => l.date === today);

        if (existingIndex > -1) {
            const updatedLogs = [...sleepLogs];
            updatedLogs[existingIndex] = { ...updatedLogs[existingIndex], hours: Number(hours), quality };
            setSleepLogs(updatedLogs);
        } else {
            const newLog = {
                id: Date.now().toString(),
                date: today,
                hours: Number(hours),
                quality // 'Poor', 'Fair', 'Good', 'Excellent'
            };
            setSleepLogs(prev => [...prev, newLog]);
        }
    };

    const getTodaySleep = () => {
        const today = new Date().toISOString().split('T')[0];
        return sleepLogs.find(l => l.date === today);
    };

    const getAverageSleep = () => {
        if (sleepLogs.length === 0) return 0;
        const total = sleepLogs.reduce((acc, log) => acc + log.hours, 0);
        return (total / sleepLogs.length).toFixed(1);
    };

    return (
        <SleepContext.Provider value={{
            sleepLogs,
            addSleepLog,
            getTodaySleep,
            getAverageSleep,
            sleepGoal,
            setSleepGoal
        }}>
            {children}
        </SleepContext.Provider>
    );
};
