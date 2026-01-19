import React, { useState, useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { Moon, Star } from 'lucide-react';

const SleepPage = () => {
    const { addSleepLog, getTodaySleep, sleepGoal, getAverageSleep } = useSleep();
    const todaySleep = getTodaySleep();

    const [hours, setHours] = useState('');
    const [quality, setQuality] = useState('Good');

    useEffect(() => {
        if (todaySleep) {
            setHours(todaySleep.hours);
            setQuality(todaySleep.quality);
        }
    }, [todaySleep]);

    const handleSave = (e) => {
        e.preventDefault();
        if (!hours) return;
        addSleepLog(hours, quality);
    };

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Quick Snooze</h1>
                    <p className="text-muted">Rest well, live well.</p>
                </div>
            </div>

            <div className="grid-auto" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Card title="Rest Overview">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{todaySleep ? todaySleep.hours : 0}</span>
                            <span style={{ color: 'var(--text-muted)' }}>h / {sleepGoal}h</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Avg: {getAverageSleep()}h</div>
                            <div className="text-muted">Past 7 Days</div>
                        </div>
                    </div>
                    <ProgressBar value={todaySleep ? todaySleep.hours : 0} max={sleepGoal} color="var(--accent-primary)" height="12px" />
                </Card>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Card title="Log Last Night's Sleep">
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Duration (Hours)</label>
                            <input
                                type="number"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1.25rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>Sleep Quality</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['Poor', 'Fair', 'Good', 'Excellent'].map(q => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => setQuality(q)}
                                        className={quality === q ? 'btn-primary' : ''}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: quality === q ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                            background: quality === q ? 'var(--accent-primary)' : 'transparent',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" style={{ padding: '16px', fontSize: '1.1rem' }}>Update Log</Button>
                    </form>
                </Card>
            </div>

        </div>
    );
};

export default SleepPage;
