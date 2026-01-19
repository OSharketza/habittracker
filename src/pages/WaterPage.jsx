import React from 'react';
import { useWater } from '../context/WaterContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Droplets, Plus } from 'lucide-react';

const WaterPage = () => {
    const { waterIntake, waterGoal, addWater } = useWater();
    const percentage = Math.min(100, (waterIntake / waterGoal) * 100);

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1>Hydration</h1>
                    <p className="text-muted">Stay refreshed.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {/* Visual Bottle/Tracker */}
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '240px',
                        border: '4px solid rgba(255,255,255,0.2)',
                        borderRadius: '0 0 40px 40px',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${percentage}%`,
                            background: 'var(--accent-info)',
                            transition: 'height 1s ease-in-out',
                            opacity: 0.8
                        }}>
                            {/* Bubbles could go here with CSS animations */}
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{waterIntake}ml</div>
                        <div className="text-muted">of {waterGoal}ml Goal</div>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Quick Add">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Button variant="outline" onClick={() => addWater(250)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Droplets size={24} />
                                <span>+250ml</span>
                            </Button>
                            <Button variant="outline" onClick={() => addWater(500)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Droplets size={32} />
                                <span>+500ml</span>
                            </Button>
                        </div>
                    </Card>

                    <Card title="Custom Entry">
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="number"
                                placeholder="Amount (ml)"
                                id="custom-water"
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                            <Button onClick={() => {
                                const val = document.getElementById('custom-water').value;
                                if (val) {
                                    addWater(val);
                                    document.getElementById('custom-water').value = '';
                                }
                            }}>
                                <Plus />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WaterPage;
