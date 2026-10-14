import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, disabled, style, className = '', ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 600,
      borderRadius: '6px',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.65 : 1,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
      border: '1px solid transparent',
      lineHeight: 1.25,
      whiteSpace: 'nowrap',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '0.4rem 0.75rem', fontSize: '0.8125rem' },
      md: { padding: '0.625rem 1.25rem', fontSize: '0.9375rem' },
      lg: { padding: '0.875rem 1.75rem', fontSize: '1.0625rem' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--c-dark-cocoa)',
        color: 'var(--c-cream)',
        borderColor: 'var(--c-dark-cocoa)',
        boxShadow: '0 2px 4px rgba(59, 30, 8, 0.12)',
      },
      secondary: {
        backgroundColor: 'var(--c-soft-caramel)',
        color: 'var(--c-dark-cocoa)',
        borderColor: 'var(--c-warm-sand)',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--c-dark-cocoa)',
        borderColor: 'var(--c-medium-mocha)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--c-dark-cocoa)',
        borderColor: 'transparent',
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          ...baseStyle,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        className={`cocol-btn cocol-btn-${variant} ${className}`}
        {...props}
      >
        {isLoading && (
          <span
            style={{
              display: 'inline-block',
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
