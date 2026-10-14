import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'flat' | 'subtle' | 'elevated';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'subtle',
  interactive = false,
  style,
  className = '',
  ...props
}) => {
  const elevationMap = {
    flat: {
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--c-warm-sand)',
      boxShadow: 'none',
    },
    subtle: {
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(221, 170, 102, 0.4)',
      boxShadow: '0 2px 8px rgba(59, 30, 8, 0.04)',
    },
    elevated: {
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--c-warm-sand)',
      boxShadow: '0 8px 20px rgba(59, 30, 8, 0.08)',
    },
  };

  return (
    <div
      style={{
        borderRadius: '10px',
        padding: '1.5rem',
        transition: interactive ? 'transform 200ms ease, box-shadow 200ms ease' : undefined,
        cursor: interactive ? 'pointer' : undefined,
        ...elevationMap[elevation],
        ...style,
      }}
      className={`cocol-card ${interactive ? 'cocol-card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
