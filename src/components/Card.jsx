import React from 'react';

const Card = ({ children, title, className = '', style = {} }) => {
    return (
        <div className={`glass-panel ${className}`} style={{ padding: '24px', ...style }}>
            {title && <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
