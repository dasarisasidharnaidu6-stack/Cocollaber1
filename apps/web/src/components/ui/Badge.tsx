import React from 'react';

export type BadgeVariant =
  | 'paid'
  | 'unpaid'
  | 'stipend'
  | 'credit_recognition'
  | 'unspecified'
  | 'domain'
  | 'status_open'
  | 'status_closed';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'domain', children, style, className = '', ...props }) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
  };

  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    paid: {
      backgroundColor: 'var(--c-dark-cocoa)',
      color: 'var(--c-cream)',
      borderColor: 'var(--c-dark-cocoa)',
    },
    unpaid: {
      backgroundColor: 'var(--c-cream)',
      color: 'var(--c-dark-cocoa)',
      borderColor: 'var(--c-warm-sand)',
    },
    stipend: {
      backgroundColor: 'var(--c-soft-caramel)',
      color: 'var(--c-dark-cocoa)',
      borderColor: 'var(--c-warm-sand)',
    },
    credit_recognition: {
      backgroundColor: 'var(--c-medium-mocha)',
      color: 'var(--c-cream)',
      borderColor: 'var(--c-medium-mocha)',
    },
    unspecified: {
      backgroundColor: 'rgba(221, 170, 102, 0.15)',
      color: 'var(--c-medium-mocha)',
      border: '1px dashed var(--c-warm-sand)',
    },
    domain: {
      backgroundColor: 'var(--bg-surface-elevated)',
      color: 'var(--c-medium-mocha)',
      borderColor: 'var(--border-subtle)',
    },
    status_open: {
      backgroundColor: 'rgba(241, 200, 136, 0.4)',
      color: 'var(--c-dark-cocoa)',
      borderColor: 'var(--c-warm-sand)',
    },
    status_closed: {
      backgroundColor: 'rgba(139, 90, 54, 0.1)',
      color: 'var(--c-medium-mocha)',
      borderColor: 'var(--c-medium-mocha)',
    },
  };

  // Helper label formatting for compensation types
  let displayContent = children;
  if (typeof children === 'string') {
    if (children === 'unpaid') displayContent = 'Unpaid Collaboration';
    else if (children === 'paid') displayContent = 'Paid Opportunity';
    else if (children === 'stipend') displayContent = 'Stipend / Grant';
    else if (children === 'credit_recognition') displayContent = 'Attribution / Credit';
  }

  return (
    <span
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
      className={`cocol-badge cocol-badge-${variant} ${className}`}
      {...props}
    >
      {displayContent}
    </span>
  );
};
