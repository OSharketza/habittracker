import React, { useState, useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import TrendSparkline from '../components/TrendSparkline';
import { Moon, Star, AlertTriangle, TrendingDown, Info } from 'lucide-react';
import ReminderSettings from '../components/ReminderSettings';

const SleepPage = () => {
    const { addSleepLog, getTodaySleep, sleepGoal, getAverageSleep } = useSleep();
    const todaySleep = getTodaySleep();
    const avgSleep = getAverageSleep();
    
    // Mock data for trends
    const sleepTrend = [5.5, 6, 8, 7.5, 6, 7.2, 7.5];
    const sleepDebt = (sleepGoal * 7) - sleepTrend.reduce((a, b) => a + b, 0);

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
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Rest Architecture</h1>
                <p className="text-muted">Recovery is the foundation of peak cognitive performance.</p>
            </div>

            {/* Recovery Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Rest Quality</h3>
                        <Moon size={18} className="text-muted" />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{todaySleep ? todaySleep.hours : 0}<span style={{ fontSize: '1.2rem', opacity: 0.5 }}>h</span></div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>TONIGHT / {sleepGoal}h GOAL</div>
                    </div>
                    <ProgressBar value={todaySleep ? todaySleep.hours : 0} max={sleepGoal} color="var(--accent-primary)" height="12px" />
                </div>

                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Recovery Debt</h3>
                        <AlertTriangle size={18} style={{ color: sleepDebt > 2 ? '#ef4444' : 'var(--text-muted)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                         <div>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: sleepDebt > 2 ? '#ef4444' : 'var(--accent-success)' }}>{sleepDebt.toFixed(1)}h</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SEVEN DAY DEFICIT</div>
                         </div>
                         <TrendSparkline data={sleepTrend} color="var(--accent-primary)" width={120} height={40} />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {sleepDebt > 5 ? 
                            "High sleep debt detected. Cognitive performance may be impaired by up to 20% today." :
                            "Your recovery debt is stable. You are operating at optimal cognitive capacity."
                        }
                    </p>
                </div>
            </div>

            <div className="grid-auto">
                <Card title="Log Recovery">
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hours of Sleep</label>
                            <input
                                type="number"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-secondary)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rest Quality</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {['Poor', 'Fair', 'Good', 'Elite'].map(q => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => setQuality(q)}
                                        style={{
                                            padding: '12px 8px',
                                            borderRadius: '10px',
                                            border: quality === q ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                            background: quality === q ? 'var(--accent-primary)' : 'transparent',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: quality === q ? 'bold' : 'normal',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" style={{ padding: '16px' }}>Update Log</Button>
                    </form>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                     <ReminderSettings module="sleep" label="Sleep" />
                     <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
                         <div style={{ color: 'var(--accent-warning)' }}><Info size={24} /></div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                              Elite Performance Tip: Try "Non-Sleep Deep Rest" (NSDR) if you didn't hit your 7.5h goal last night. Even 15 minutes can reset your cortisol levels.
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SleepPage;
