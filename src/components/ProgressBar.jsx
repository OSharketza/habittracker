import React from 'react';

const ProgressBar = ({ value, max = 100, color = 'var(--accent-primary)', height = '8px' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-full)',
            height,
            overflow: 'hidden'
        }}>
            <div style={{
                width: `${percentage}%`,
                background: color,
                height: '100%',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
        </div>
    );
};

export default ProgressBar;
