import React from 'react';

const Card = ({ children, title, className = '', style = {} }) => {
    return (
        <div className={`glass-panel ${className}`} style={{ padding: 'clamp(16px, 4vw, 24px)', ...style }}>
            {title && <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
