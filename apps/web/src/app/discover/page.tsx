'use client';

import React from 'react';
import Link from 'next/link';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityFilter } from '@/components/opportunities/OpportunityFilter';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function DiscoverPage() {
  const { opportunities, isLoading, error, filters, setFilters, reload } = useOpportunities();

  const handleReset = () => {
    setFilters({ q: '', domain: undefined, compensation_type: undefined, is_remote: undefined });
  };

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--c-dark-cocoa)',
                margin: 0,
              }}
            >
              Discover Opportunities
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)', marginTop: '0.35rem' }}>
              Explore collaborative projects, research efforts, and open-source initiatives across disciplines.
            </p>
          </div>

          <Link href="/opportunities/new">
            <Button variant="primary" size="md">
              + Post Opportunity
            </Button>
          </Link>
        </div>

        {/* Filter Controls */}
        <OpportunityFilter filters={filters} onChange={setFilters} onReset={handleReset} />

        {/* Status & Results */}
        {error && (
          <div
            style={{
              backgroundColor: '#FAF0E6',
              borderLeft: '4px solid var(--c-dark-cocoa)',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: 'var(--c-dark-cocoa)',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--c-medium-mocha)' }}>
          Showing <strong>{opportunities.length}</strong> available opportunit{opportunities.length === 1 ? 'y' : 'ies'}
        </div>

        {/* Grid View */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--c-warm-sand)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <Skeleton width="40%" height="1.2rem" />
                <Skeleton width="90%" height="1.8rem" />
                <Skeleton width="100%" height="3.5rem" />
                <Skeleton width="60%" height="1rem" style={{ marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState
            title="No Opportunities Found"
            description="No opportunities matched your active search query or filters. Try adjusting your terms or resetting filters."
            action={
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset All Filters
              </Button>
            }
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
