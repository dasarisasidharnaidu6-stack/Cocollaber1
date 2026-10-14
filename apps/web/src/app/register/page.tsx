'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        display_name: displayName.trim(),
        email: email.trim(),
        password,
      });
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--c-warm-sand)',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(59, 30, 8, 0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              marginBottom: '0.5rem',
            }}
          >
            Join CoCollaber
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--c-medium-mocha)' }}>
            Enter a global, domain-agnostic ecosystem of shared possibilities.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FAF0E6',
              borderLeft: '4px solid var(--c-dark-cocoa)',
              padding: '0.875rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: 'var(--c-dark-cocoa)',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Your Name or Alias"
            placeholder="e.g. Elena Rostova or Linnea"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            autoFocus
            helperText="How other collaborators will address you."
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)', margin: 0, lineHeight: 1.4 }}>
            By creating an account, you agree to honor honest compensation disclosure and uphold safe collaboration.
          </p>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Create Account & Set Identity
          </Button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(221, 170, 102, 0.3)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--c-medium-mocha)',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--c-dark-cocoa)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
