import React from 'react';
import { useWater } from '../context/WaterContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Droplet, Plus, Info } from 'lucide-react';
import ReminderSettings from '../components/ReminderSettings';

const WaterPage = () => {
    const { waterIntake, waterGoal, addWater } = useWater();
    const percentage = Math.min(100, (waterIntake / waterGoal) * 100);

    return (
        <div className="container fade-in">
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Deep Hydration</h1>
                <p className="text-muted">Optimize your cognitive and physical performance.</p>
            </div>

            <div className="grid-auto">
                <div className="glass-panel" style={{ 
                    padding: '40px 24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '450px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* The Animated Bottle */}
                    <div style={{
                        width: '140px',
                        height: '280px',
                        border: '6px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px 10px 40px 40px',
                        position: 'relative',
                        background: 'rgba(0,0,0,0.2)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        overflow: 'hidden'
                    }}>
                        {/* Wave Animation */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: `${percentage}%`,
                            background: 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)',
                            transition: 'height 1.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            zIndex: 1
                        }}>
                            <div className="water-wave" />
                        </div>

                        {/* Graduation Marks */}
                        <div style={{ position: 'absolute', right: '10px', top: '20%', bottom: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                            <div style={{ width: '8px', height: '2px', background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.4)' }} />
                            <div style={{ width: '8px', height: '2px', background: 'rgba(255,255,255,0.2)' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-info)' }}>{waterIntake}<span style={{ fontSize: '1rem', opacity: 0.5 }}>ml</span></div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>GOAL: {waterGoal}ml</div>
                    </div>

                    {percentage >= 100 && (
                        <div className="fade-in" style={{ marginTop: '16px', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            <Droplet size={16} fill="currentColor" /> Hydration Peak Reached
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Fuel Station">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Button variant="secondary" onClick={() => addWater(250)} style={{ flexDirection: 'column', height: '100px', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🥛</span>
                                <span style={{ fontSize: '0.85rem' }}>Small (250ml)</span>
                            </Button>
                            <Button variant="secondary" onClick={() => addWater(500)} style={{ flexDirection: 'column', height: '100px', gap: '8px' }}>
                                <span style={{ fontSize: '1.5rem' }}>💧</span>
                                <span style={{ fontSize: '0.85rem' }}>Large (500ml)</span>
                            </Button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <input
                                type="number"
                                placeholder="Custom Amount (ml)"
                                id="custom-water"
                                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                            <Button onClick={() => {
                                const val = document.getElementById('custom-water').value;
                                if (val) {
                                    addWater(Number(val));
                                    document.getElementById('custom-water').value = '';
                                }
                            }}>
                                <Plus size={20} />
                            </Button>
                        </div>
                    </Card>

                    <ReminderSettings module="water" label="Hydration" />

                    <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
                         <div style={{ color: 'var(--accent-info)' }}><Info size={24} /></div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                              Did you know? Even 1% dehydration can lead to a significant drop in focus and memory. Aim for a "steady sip" pattern throughout the morning.
                         </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .water-wave {
                    position: absolute;
                    top: -20px;
                    left: 0;
                    width: 200%;
                    height: 40px;
                    background: radial-gradient(circle at 50% 100%, #06b6d4 0%, transparent 70%);
                    opacity: 0.5;
                    animation: wave 4s linear infinite;
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default WaterPage;
