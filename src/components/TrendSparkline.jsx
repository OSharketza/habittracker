import React from 'react';

const TrendSparkline = ({ data = [], color = 'var(--accent-primary)', width = 100, height = 30 }) => {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data) || 1;
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{ opacity: 0.8 }}
            />
            {/* Area under curve */}
            <polyline
                fill={color}
                fillOpacity="0.1"
                points={`${width},${height} 0,${height} ${points}`}
            />
        </svg>
    );
};

export default TrendSparkline;
