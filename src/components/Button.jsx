import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  style = {},
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--gradient-main)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
        };
      case 'secondary':
        return {
          background: 'var(--bg-glass)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-glass)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-glass)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none'
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 16px', fontSize: '0.85rem' };
      case 'lg':
        return { padding: '16px 32px', fontSize: '1.1rem' };
      default:
        return { padding: '12px 24px', fontSize: '1rem' };
    }
  };

  const baseStyles = {
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    outline: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-hover-effect ${className}`}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
    >
      {children}
    </button>
  );
};

export default Button;
