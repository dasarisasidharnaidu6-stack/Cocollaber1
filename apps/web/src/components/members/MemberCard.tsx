import React from 'react';
import { Profile } from '@/lib/api/client';
import { Card } from '@/components/ui/Card';

export interface MemberCardProps {
  profile: Profile;
}

export const MemberCard: React.FC<MemberCardProps> = ({ profile }) => {
  return (
    <Card elevation="subtle">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--c-soft-caramel)',
            color: 'var(--c-dark-cocoa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.25rem',
            border: '2px solid var(--c-warm-sand)',
            flexShrink: 0,
          }}
        >
          {profile.display_name.charAt(0).toUpperCase()}
        </div>
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
            {profile.display_name}
          </h4>
          {profile.headline && (
            <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', margin: '0.2rem 0' }}>
              {profile.headline}
            </p>
          )}
          {profile.is_location_public && profile.location_text && (
            <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
              📍 {profile.location_text}
            </span>
          )}
        </div>
      </div>

      {profile.bio && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--c-dark-cocoa)',
            lineHeight: 1.55,
            marginBottom: '1rem',
          }}
        >
          {profile.bio}
        </p>
      )}

      {profile.offers && profile.offers.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-medium-mocha)' }}>
            Offers:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
            {profile.offers.slice(0, 3).map((off) => (
              <span
                key={off.id}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--c-cream)',
                  border: '1px solid var(--c-warm-sand)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  color: 'var(--c-dark-cocoa)',
                }}
              >
                {off.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
