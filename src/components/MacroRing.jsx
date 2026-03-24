import React from 'react';

const MacroRing = ({ protein = 0, carbs = 0, fat = 0, size = 160 }) => {
    const total = protein + carbs + fat || 1;
    const pPct = (protein / total) * 100;
    const cPct = (carbs / total) * 100;
    const fPct = (fat / total) * 100;

    const radius = size * 0.4;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    // Stroke offsets
    const pOffset = 0;
    const cOffset = (pPct / 100) * circumference;
    const fOffset = ((pPct + cPct) / 100) * circumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size * 0.12} />

                {/* Protein Segment */}
                <circle cx={center} cy={center} r={radius} fill="none"
                    stroke="#a855f7" strokeWidth={size * 0.12}
                    strokeDasharray={`${(pPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-pOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                />

                {/* Carbs Segment */}
                <circle cx={center} cy={center} r={radius} fill="none"
                    stroke="#06b6d4" strokeWidth={size * 0.12}
                    strokeDasharray={`${(cPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-cOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                />

                {/* Fat Segment */}
                <circle cx={center} cy={center} r={radius} fill="none"
                    stroke="#ef4444" strokeWidth={size * 0.12}
                    strokeDasharray={`${(fPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-fOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                />

                {/* Center Label */}
                <text x={center} y={center} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={size * 0.1} fontWeight="bold"
                    style={{ transform: `rotate(90deg)`, transformOrigin: 'center' }}>
                    Macros
                </text>
            </svg>

            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
                    <span className="text-secondary">P: {protein}g</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }} />
                    <span className="text-secondary">C: {carbs}g</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <span className="text-secondary">F: {fat}g</span>
                </div>
            </div>
        </div>
    );
};

export default MacroRing;
