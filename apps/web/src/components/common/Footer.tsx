import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--c-warm-sand)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(221, 170, 102, 0.3)',
          }}
        >
          {/* Brand Philosophy */}
          <div>
            <h4
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--c-dark-cocoa)',
                marginBottom: '0.75rem',
              }}
            >
              CoCollaber
            </h4>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--c-medium-mocha)',
                lineHeight: 1.6,
                marginBottom: '1rem',
              }}
            >
              &ldquo;What opportunity are you looking for, and what opportunity can you offer?&rdquo;
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--c-dark-cocoa)',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              People &harr; Opportunities &harr; People
            </p>
          </div>

          {/* Core Principles */}
          <div>
            <h5
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--c-dark-cocoa)',
                marginBottom: '1rem',
              }}
            >
              Foundational Principles
            </h5>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--c-medium-mocha)',
              }}
            >
              <li>• Opportunity-first architecture</li>
              <li>• Fluid multi-dimensional identities</li>
              <li>• Mandatory compensation transparency</li>
              <li>• Unpaid and collaborative work welcomed</li>
              <li>• Domain-agnostic open exchange</li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h5
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--c-dark-cocoa)',
                marginBottom: '1rem',
              }}
            >
              Ecosystem
            </h5>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--c-medium-mocha)',
              }}
            >
              <Link href="/discover">Explore All Opportunities</Link>
              <Link href="/opportunities/new">Publish an Opportunity</Link>
              <Link href="/moderation">Trust & Moderation Queue</Link>
              <Link href="/login">Account Access</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--c-medium-mocha)',
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} CoCollaber Ecosystem. Open collaboration without silos.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Express</span>
            <span>&rarr;</span>
            <span>Discover</span>
            <span>&rarr;</span>
            <span>Connect</span>
            <span>&rarr;</span>
            <span>Collaborate</span>
            <span>&rarr;</span>
            <span>Grow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
