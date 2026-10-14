import React from 'react';
import Link from 'next/link';
import { Opportunity } from '@/lib/api/client';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const domain = (opportunity.attributes?.domain as string) || 'Open Opportunity';
  const tags = (opportunity.attributes?.tags as string[]) || [];

  return (
    <Card elevation="subtle" interactive style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header tags: Domain + Compensation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--c-medium-mocha)',
          }}
        >
          {domain}
        </span>
        <Badge variant={opportunity.compensation_type}>
          {opportunity.compensation_type}
        </Badge>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--c-dark-cocoa)',
          lineHeight: 1.3,
          marginBottom: '0.75rem',
        }}
      >
        <Link
          href={`/opportunities/${opportunity.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {opportunity.title}
        </Link>
      </h3>

      {/* Description Snippet */}
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--c-medium-mocha)',
          lineHeight: 1.55,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {opportunity.description}
      </p>

      {/* Compensation Details Note */}
      {opportunity.compensation_details && (
        <div
          style={{
            backgroundColor: 'rgba(241, 200, 136, 0.2)',
            borderLeft: '3px solid var(--c-warm-sand)',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 4px 4px 0',
            fontSize: '0.8125rem',
            color: 'var(--c-dark-cocoa)',
            marginBottom: '1rem',
          }}
        >
          <strong style={{ fontWeight: 600 }}>Terms: </strong>
          {opportunity.compensation_details}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(221, 170, 102, 0.15)',
                color: 'var(--c-medium-mocha)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Meta & Action */}
      <div
        style={{
          borderTop: '1px solid rgba(221, 170, 102, 0.3)',
          paddingTop: '0.875rem',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          color: 'var(--c-medium-mocha)',
        }}
      >
        <span>
          {opportunity.is_remote ? '🌐 Remote' : `📍 ${opportunity.location_text || 'In-person'}`}
        </span>
        <Link
          href={`/opportunities/${opportunity.id}`}
          style={{
            color: 'var(--c-dark-cocoa)',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
};
