'use client';

import React, { useState } from 'react';
import { Seek, SeekCreate } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface SeeksListProps {
  seeks: Seek[];
  isEditable?: boolean;
  onAddSeek?: (seek: SeekCreate) => Promise<void>;
  onDeleteSeek?: (seekId: string) => Promise<void>;
}

export const SeeksList: React.FC<SeeksListProps> = ({
  seeks,
  isEditable = false,
  onAddSeek,
  onDeleteSeek,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !onAddSeek) return;
    setIsLoading(true);
    try {
      await onAddSeek({ title: title.trim(), domain: domain.trim() || null });
      setTitle('');
      setDomain('');
      setIsAdding(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--c-warm-sand)',
        borderRadius: '10px',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(221, 170, 102, 0.3)',
          paddingBottom: '0.75rem',
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              margin: 0,
            }}
          >
            What I Am Seeking
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
            Collaborators, skills & opportunities sought ({seeks.length} / 10)
          </span>
        </div>

        {isEditable && !isAdding && seeks.length < 10 && (
          <Button variant="secondary" size="sm" onClick={() => setIsAdding(true)}>
            + Add Seek
          </Button>
        )}
      </div>

      {/* Adding Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--c-cream)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Input
            placeholder="e.g. Front-end developer to build search visualization for inscriptions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <Input
            placeholder="Domain / Field (e.g. Open Source Software)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setTitle('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Save Seek
            </Button>
          </div>
        </form>
      )}

      {/* Seeks list */}
      {seeks.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', fontStyle: 'italic', margin: 0 }}>
          No seeks declared yet.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: 0 }}>
          {seeks.map((seek) => (
            <li
              key={seek.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#FAF5EE',
                borderRadius: '6px',
                border: '1px solid rgba(221, 170, 102, 0.3)',
              }}
            >
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--c-dark-cocoa)', margin: 0 }}>
                  {seek.title}
                </p>
                {seek.domain && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
                    {seek.domain}
                  </span>
                )}
              </div>
              {isEditable && onDeleteSeek && (
                <button
                  onClick={() => onDeleteSeek(seek.id)}
                  aria-label="Remove seek"
                  style={{
                    color: 'var(--c-medium-mocha)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.2rem 0.4rem',
                  }}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
