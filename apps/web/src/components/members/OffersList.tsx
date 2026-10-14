'use client';

import React, { useState } from 'react';
import { Offer, OfferCreate } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface OffersListProps {
  offers: Offer[];
  isEditable?: boolean;
  onAddOffer?: (offer: OfferCreate) => Promise<void>;
  onDeleteOffer?: (offerId: string) => Promise<void>;
}

export const OffersList: React.FC<OffersListProps> = ({
  offers,
  isEditable = false,
  onAddOffer,
  onDeleteOffer,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !onAddOffer) return;
    setIsLoading(true);
    try {
      await onAddOffer({ title: title.trim(), domain: domain.trim() || null });
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
            What I Can Offer
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
            Capabilities, perspectives & expertise ({offers.length} / 10)
          </span>
        </div>

        {isEditable && !isAdding && offers.length < 10 && (
          <Button variant="secondary" size="sm" onClick={() => setIsAdding(true)}>
            + Add Offer
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
            placeholder="e.g. Ancient Greek & Latin translation & TEI markup"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <Input
            placeholder="Domain / Field (e.g. Digital Humanities)"
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
              Save Offer
            </Button>
          </div>
        </form>
      )}

      {/* Offers list */}
      {offers.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', fontStyle: 'italic', margin: 0 }}>
          No offers declared yet.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: 0 }}>
          {offers.map((offer) => (
            <li
              key={offer.id}
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
                  {offer.title}
                </p>
                {offer.domain && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
                    {offer.domain}
                  </span>
                )}
              </div>
              {isEditable && onDeleteOffer && (
                <button
                  onClick={() => onDeleteOffer(offer.id)}
                  aria-label="Remove offer"
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
