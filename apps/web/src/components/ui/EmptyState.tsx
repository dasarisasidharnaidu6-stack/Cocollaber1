import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px dashed var(--c-warm-sand)',
      }}
    >
      {icon && (
        <div style={{ marginBottom: '1rem', color: 'var(--c-medium-mocha)', fontSize: '2rem' }}>
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--c-dark-cocoa)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--c-medium-mocha)',
          maxWidth: '460px',
          lineHeight: 1.6,
          marginBottom: action ? '1.5rem' : '0',
        }}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
