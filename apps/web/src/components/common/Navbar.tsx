'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--c-warm-sand)',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.65rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              letterSpacing: '-0.02em',
            }}
          >
            CoCollaber
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--c-medium-mocha)',
              backgroundColor: 'var(--c-cream)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              border: '1px solid rgba(221, 170, 102, 0.4)',
            }}
          >
            v1.0
          </span>
        </Link>

        {/* Primary Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            fontSize: '0.9375rem',
            fontWeight: 500,
          }}
        >
          <Link
            href="/discover"
            style={{
              color: 'var(--c-dark-cocoa)',
              textDecoration: 'none',
              padding: '0.25rem 0',
              borderBottom: '2px solid transparent',
            }}
          >
            Discover Opportunities
          </Link>

          <Link
            href="/opportunities/new"
            style={{
              color: 'var(--c-dark-cocoa)',
              textDecoration: 'none',
              padding: '0.25rem 0',
            }}
          >
            Create Opportunity
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/messages"
                style={{
                  color: 'var(--c-dark-cocoa)',
                  textDecoration: 'none',
                }}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                style={{
                  color: 'var(--c-dark-cocoa)',
                  textDecoration: 'none',
                }}
              >
                My Profile
              </Link>
            </>
          )}

          <Link
            href="/moderation"
            style={{
              color: 'var(--c-medium-mocha)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Moderation
          </Link>
        </nav>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--c-dark-cocoa)',
                }}
              >
                {profile?.display_name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Join CoCollaber
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
