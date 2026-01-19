import React, { createContext, useContext, useState, useEffect } from 'react';

const WaterContext = createContext();

export const useWater = () => useContext(WaterContext);

export const WaterProvider = ({ children }) => {
    const [waterIntake, setWaterIntake] = useState(() => {
        // Only track for today, reset if date changes (simplified logic for now)
        const saved = localStorage.getItem('waterToday');
        const savedDate = localStorage.getItem('waterDate');
        const today = new Date().toISOString().split('T')[0];

        if (savedDate === today && saved) {
            return Number(saved);
        }
        return 0;
    });

    const [waterGoal, setWaterGoal] = useState(() => {
        return localStorage.getItem('waterGoal') || 2500;
    });

    useEffect(() => {
        localStorage.setItem('waterToday', waterIntake);
        localStorage.setItem('waterDate', new Date().toISOString().split('T')[0]);
    }, [waterIntake]);

    useEffect(() => {
        localStorage.setItem('waterGoal', waterGoal);
    }, [waterGoal]);

    const addWater = (amount) => {
        setWaterIntake(prev => prev + Number(amount));
    };

    const resetWater = () => {
        setWaterIntake(0);
    };

    return (
        <WaterContext.Provider value={{
            waterIntake,
            waterGoal,
            setWaterGoal,
            addWater,
            resetWater
        }}>
            {children}
        </WaterContext.Provider>
    );
};
