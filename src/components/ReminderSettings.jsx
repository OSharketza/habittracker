import React, { useState, useEffect } from 'react';
import { useReminders } from '../context/ReminderContext';
import Button from './Button';
import { Bell, BellOff, Hourglass } from 'lucide-react';

const ReminderSettings = ({ module, label }) => {
    const { reminders, updateReminder, requestPermission } = useReminders();
    const [isEnabled, setIsEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [saving, setSaving] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState(Notification.permission);

    useEffect(() => {
        const reminder = reminders.find(r => r.module === module);
        if (reminder) {
            setIsEnabled(reminder.is_enabled);
            setReminderTime(reminder.reminder_time ? reminder.reminder_time.slice(0, 5) : '09:00');
        }
    }, [reminders, module]);

    const handleToggle = async () => {
        setSaving(true);
        try {
            await updateReminder(module, reminderTime, !isEnabled);
            setIsEnabled(!isEnabled);
        } catch (error) {
            console.error('Failed to toggle reminder:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleTimeChange = async (e) => {
        const newTime = e.target.value;
        setReminderTime(newTime);
        setSaving(true);
        try {
            await updateReminder(module, newTime, isEnabled);
        } catch (error) {
            console.error('Failed to update reminder time:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleRequestPermission = async () => {
        const granted = await requestPermission();
        setPermissionStatus(granted ? 'granted' : 'denied');
    };

    return (
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isEnabled ? <Bell size={20} className="text-primary" /> : <BellOff size={20} className="text-muted" />}
                    <h4 style={{ margin: 0 }}>{label} Reminder</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {saving && <Hourglass size={14} className="animate-spin" />}
                    <label className="switch">
                        <input type="checkbox" checked={isEnabled} onChange={handleToggle} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            {isEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Remind me at:</span>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={handleTimeChange}
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                    
                    {permissionStatus !== 'granted' && (
                        <div style={{ 
                            padding: '8px 12px', 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            borderRadius: '8px', 
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                        }}>
                            <span>Enable notifications to receive alerts.</span>
                            <Button size="sm" onClick={handleRequestPermission} style={{ background: 'var(--accent-warning)', color: 'black' }}>
                                Allow
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReminderSettings;
