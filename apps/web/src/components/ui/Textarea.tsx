import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, characterCount, id, maxLength, value, style, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && (
            <label
              htmlFor={inputId}
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
          {characterCount && maxLength && (
            <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          style={{
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            color: 'var(--c-dark-cocoa)',
            backgroundColor: '#FFFFFF',
            border: `1px solid ${error ? 'var(--c-dark-cocoa)' : 'var(--c-warm-sand)'}`,
            borderRadius: '6px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical',
            lineHeight: 1.5,
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            width: '100%',
            ...style,
          }}
          className={`cocol-textarea ${error ? 'cocol-textarea-error' : ''} ${className}`}
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

Textarea.displayName = 'Textarea';
