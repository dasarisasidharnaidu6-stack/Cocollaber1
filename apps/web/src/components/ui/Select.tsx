import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, id, style, className = '', ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--c-dark-cocoa)',
            }}
          >
            {label}
            {props.required && <span style={{ color: 'var(--c-medium-mocha)', marginLeft: '0.2rem' }}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          style={{
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            color: 'var(--c-dark-cocoa)',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${error ? 'var(--c-dark-cocoa)' : 'var(--c-warm-sand)'}`,
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            cursor: 'pointer',
            width: '100%',
            ...style,
          }}
          className={`cocol-select ${error ? 'cocol-select-error' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
