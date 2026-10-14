import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, disabled, style, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--c-dark-cocoa)',
              letterSpacing: '0.01em',
            }}
          >
            {label}
            {props.required && <span style={{ color: 'var(--c-medium-mocha)', marginLeft: '0.2rem' }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          style={{
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            color: 'var(--c-dark-cocoa)',
            backgroundColor: disabled ? 'rgba(221, 170, 102, 0.1)' : '#FFFFFF',
            border: `1px solid ${error ? 'var(--c-dark-cocoa)' : 'var(--c-warm-sand)'}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            width: '100%',
            ...style,
          }}
          className={`cocol-input ${error ? 'cocol-input-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--c-dark-cocoa)', fontWeight: 500, margin: 0 }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--c-medium-mocha)', margin: 0 }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
