import React from 'react';
import Link from 'next/link';
import { SAMPLE_OPPORTUNITIES } from '@cocollaber/api-client';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Editorial Hero Section */}
      <section
        style={{
          borderBottom: '1px solid var(--c-warm-sand)',
          backgroundColor: '#FFFFFF',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-block',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--c-medium-mocha)',
              backgroundColor: 'var(--c-cream)',
              border: '1px solid var(--c-warm-sand)',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              marginBottom: '1.5rem',
            }}
          >
            People &harr; Opportunities &harr; People
          </div>

          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '3.25rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '1.75rem',
            }}
          >
            &ldquo;What opportunity are you looking for, and what opportunity can you offer?&rdquo;
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--c-medium-mocha)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            CoCollaber is an open, domain-agnostic collaboration ecosystem. Connect across
            disciplines through shared purpose, transparent terms, and fluid identities.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Link href="/discover">
              <Button variant="primary" size="lg">
                Discover Opportunities &rarr;
              </Button>
            </Link>
            <Link href="/opportunities/new">
              <Button variant="secondary" size="lg">
                Express an Opportunity
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Core Loop Showcase */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(221, 170, 102, 0.3)',
          backgroundColor: '#FAF5EE',
        }}
      >
        <div className="container">
          <p
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--c-medium-mocha)',
              marginBottom: '1.5rem',
            }}
          >
            The CoCollaber Product Loop
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            {[
              { step: '01', title: 'Express', desc: 'Declare your fluid offers & seeks' },
              { step: '02', title: 'Discover', desc: 'Faceted search across any domain' },
              { step: '03', title: 'Connect', desc: 'Direct, honest interest alignment' },
              { step: '04', title: 'Collaborate', desc: 'Transparent terms and roles' },
              { step: '05', title: 'Grow', desc: 'Attribution, experience, or grant' },
              { step: '06', title: 'Create', desc: 'Publish new shared opportunities' },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--c-warm-sand)',
                  borderRadius: '8px',
                  padding: '1.25rem 0.75rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--c-medium-mocha)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {item.step}
                </span>
                <strong
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '1.1rem',
                    color: 'var(--c-dark-cocoa)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {item.title}
                </strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--c-medium-mocha)', lineHeight: 1.3 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(221, 170, 102, 0.3)',
              paddingBottom: '1rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--c-dark-cocoa)',
                  margin: 0,
                }}
              >
                Curated Opportunities
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--c-medium-mocha)', marginTop: '0.25rem' }}>
                Diverse initiatives actively seeking collaborators across disciplines.
              </p>
            </div>
            <Link
              href="/discover"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--c-dark-cocoa)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Browse All Opportunities &rarr;
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {SAMPLE_OPPORTUNITIES.slice(0, 3).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Manifesto */}
      <section
        style={{
          borderTop: '1px solid var(--c-warm-sand)',
          backgroundColor: '#FFFFFF',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              backgroundColor: '#FAF5EE',
              borderRadius: '12px',
              border: '1px solid var(--c-warm-sand)',
              padding: '2.5rem',
            }}
          >
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--c-dark-cocoa)',
                marginBottom: '1rem',
              }}
            >
              Why CoCollaber is Different
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              CoCollaber is neither a transactional freelance gig board nor an algorithmic social feed.
              We believe great human progress happens when people are free to offer their unique capabilities
              and seek authentic collaborators under open, honest terms.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <strong style={{ color: 'var(--c-dark-cocoa)', display: 'block', marginBottom: '0.25rem' }}>
                  ✓ Transparent Compensation
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)' }}>
                  Whether an initiative is paid, stipend-funded, or unpaid collaboration, financial terms are declared upfront.
                </span>
              </div>
              <div>
                <strong style={{ color: 'var(--c-dark-cocoa)', display: 'block', marginBottom: '0.25rem' }}>
                  ✓ Fluid Multidisciplinary Identity
                </strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)' }}>
                  You are not confined to a single job title. Declare your multi-faceted offers and seeks freely.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
