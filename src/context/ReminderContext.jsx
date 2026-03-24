import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
    const { user } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReminders = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('reminders')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;
            setReminders(data || []);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchReminders();
        } else {
            setReminders([]);
            setLoading(false);
        }
    }, [user, fetchReminders]);

    const updateReminder = async (module, reminderTime, isEnabled) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('reminders')
                .upsert({
                    user_id: user.id,
                    module,
                    reminder_time: reminderTime,
                    is_enabled: isEnabled,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, module' })
                .select();

            if (error) throw error;
            
            setReminders(prev => {
                const index = prev.findIndex(r => r.module === module);
                if (index >= 0) {
                    const next = [...prev];
                    next[index] = data[0];
                    return next;
                }
                return [...prev, data[0]];
            });
            return data[0];
        } catch (error) {
            console.error('Error updating reminder:', error);
            throw error;
        }
    };

    // Notification Logic
    useEffect(() => {
        if (!user || reminders.length === 0) return;

        const checkReminders = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // HH:mm format

            reminders.forEach(reminder => {
                if (reminder.is_enabled && reminder.reminder_time) {
                    // Normalize reminder_time (Supabase might return "HH:mm:ss" or "HH:mm")
                    const normalizedTime = reminder.reminder_time.slice(0, 5);
                    
                    if (currentTime === normalizedTime) {
                        // Avoid multiple notifications in the same minute
                        const lastNotifiedKey = `last_notified_${reminder.module}`;
                        const lastNotified = localStorage.getItem(lastNotifiedKey);
                        const today = now.toDateString();

                        if (lastNotified !== today) {
                            showNotification(reminder.module);
                            localStorage.setItem(lastNotifiedKey, today);
                        }
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [user, reminders]);

    const showNotification = (module) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            const titles = {
                habits: "Time for your habits!",
                meals: "Don't forget to log your meal!",
                workouts: "Workout time! Stay active.",
                sleep: "Time to wind down for sleep.",
                water: "Stay hydrated! Drink some water.",
                manifestations: "Take a moment for your daily manifestation."
            };

            new Notification("Habit Planner Reminder", {
                body: titles[module] || `Reminder for ${module}`,
                icon: "/favicon.ico"
            });
        }
    };

    const requestPermission = async () => {
        if (!("Notification" in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === "granted";
    };

    return (
        <ReminderContext.Provider value={{ reminders, updateReminder, loading, requestPermission }}>
            {children}
        </ReminderContext.Provider>
    );
};

export const useReminders = () => {
    const context = useContext(ReminderContext);
    if (!context) {
        throw new Error('useReminders must be used within a ReminderProvider');
    }
    return context;
};
