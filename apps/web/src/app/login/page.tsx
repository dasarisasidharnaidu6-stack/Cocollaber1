'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.push('/discover');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
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
          maxWidth: '440px',
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
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--c-medium-mocha)' }}>
            Sign in to continue discovering and offering opportunities.
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
            label="Email Address"
            type="email"
            placeholder="you@domain.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In
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
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            style={{
              color: 'var(--c-dark-cocoa)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
