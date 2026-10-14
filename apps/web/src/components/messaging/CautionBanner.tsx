import React from 'react';

export const CautionBanner: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FAF5EE',
        border: '1px solid var(--c-warm-sand)',
        borderLeft: '4px solid var(--c-medium-mocha)',
        borderRadius: '6px',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">
        🛡️
      </span>
      <div>
        <h5
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--c-dark-cocoa)',
            margin: 0,
            marginBottom: '0.2rem',
          }}
        >
          CoCollaber Trust & Safety Protocol
        </h5>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--c-medium-mocha)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          CoCollaber never asks for off-platform payment transfers, bank credentials, or private identity documents.
          Keep initial project alignment transparent. If a participant asks for off-platform fees or misrepresents
          compensation, report the conversation immediately.
        </p>
      </div>
    </div>
  );
};
