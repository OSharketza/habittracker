import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    // variants: primary, secondary, outline, ghost

    const getStyle = () => {
        switch (variant) {
            case 'outline':
                return {
                    background: 'transparent',
                    border: '1px solid var(--accent-primary)',
                    color: 'var(--accent-primary)'
                };
            case 'ghost':
                return {
                    background: 'transparent',
                    color: 'var(--text-secondary)'
                };
            default: // primary
                return {}; // Handled by CSS class btn-primary
        }
    };

    return (
        <button
            className={`btn-primary ${className}`}
            style={getStyle()}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
