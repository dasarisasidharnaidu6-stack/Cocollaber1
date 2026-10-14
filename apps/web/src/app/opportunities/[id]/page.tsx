'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient, Opportunity, SAMPLE_OPPORTUNITIES } from '@/lib/api/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { InterestModal } from '@/components/interactions/InterestModal';
import { ReportModal } from '@/components/interactions/ReportModal';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await apiClient.opportunities.get(id);
        setOpportunity(data);
      } catch (err: any) {
        // Fallback to sample matching if offline
        const found = SAMPLE_OPPORTUNITIES.find((o) => o.id === id);
        if (found) {
          setOpportunity(found);
        } else {
          setError(err.message || 'Opportunity not found');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadOpportunity();
  }, [id]);

  const handleExpressInterest = async (message: string) => {
    if (!opportunity) return;
    await apiClient.interactions.expressInterest(opportunity.id, message);
    setInterestSuccess(true);
  };

  if (isLoading) {
    return (
      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <Skeleton width="30%" height="1.5rem" style={{ marginBottom: '1.5rem' }} />
          <Skeleton width="85%" height="3rem" style={{ marginBottom: '1rem' }} />
          <Skeleton width="100%" height="8rem" style={{ marginBottom: '2rem' }} />
        </div>
      </main>
    );
  }

  if (error || !opportunity) {
    return (
      <main style={{ padding: '4rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', color: 'var(--c-dark-cocoa)' }}>
            Opportunity Not Found
          </h2>
          <p style={{ color: 'var(--c-medium-mocha)', margin: '1rem 0 2rem 0' }}>
            {error || 'This opportunity could not be located or may have been archived.'}
          </p>
          <Link href="/discover">
            <Button variant="primary">Return to Discovery</Button>
          </Link>
        </div>
      </main>
    );
  }

  const domain = (opportunity.attributes?.domain as string) || 'Open Opportunity';
  const tags = (opportunity.attributes?.tags as string[]) || [];

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/discover"
            style={{
              fontSize: '0.875rem',
              color: 'var(--c-medium-mocha)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            &larr; Back to Discover
          </Link>
        </div>

        {/* Success Alert if interest was submitted */}
        {interestSuccess && (
          <div
            style={{
              backgroundColor: '#FAF5EE',
              border: '1px solid var(--c-warm-sand)',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong style={{ color: 'var(--c-dark-cocoa)', display: 'block' }}>
                Interest Expressed Successfully!
              </strong>
              <span style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)' }}>
                The creator has been notified. Check your messages to continue alignment.
              </span>
            </div>
            <Link href="/messages">
              <Button variant="secondary" size="sm">
                View Messages
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content Card */}
        <article
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--c-warm-sand)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 4px 16px rgba(59, 30, 8, 0.05)',
          }}
        >
          {/* Metadata badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--c-medium-mocha)',
              }}
            >
              {domain}
            </span>
            <span>•</span>
            <Badge variant={opportunity.compensation_type}>
              {opportunity.compensation_type}
            </Badge>
            <span>•</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)' }}>
              {opportunity.is_remote ? '🌐 Remote' : `📍 ${opportunity.location_text || 'In-person'}`}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.4rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            {opportunity.title}
          </h1>

          {/* Description */}
          <div
            style={{
              fontSize: '1.0625rem',
              color: 'var(--c-dark-cocoa)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              marginBottom: '2rem',
            }}
          >
            {opportunity.description}
          </div>

          {/* Mandatory Compensation Disclosure Callout */}
          <div
            style={{
              backgroundColor: '#FAF5EE',
              border: '1px solid var(--c-warm-sand)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h3
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--c-dark-cocoa)',
                  margin: 0,
                }}
              >
                Declared Compensation Terms
              </h3>
              <Badge variant={opportunity.compensation_type}>
                {opportunity.compensation_type}
              </Badge>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--c-dark-cocoa)', lineHeight: 1.6, margin: 0 }}>
              {opportunity.compensation_details || 'Standard open collaboration attribution applies.'}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--c-medium-mocha)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Disciplines & Skills
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.8125rem',
                      backgroundColor: 'var(--c-cream)',
                      border: '1px solid var(--c-warm-sand)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px',
                      color: 'var(--c-dark-cocoa)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div
            style={{
              borderTop: '1px solid rgba(221, 170, 102, 0.3)',
              paddingTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setInterestModalOpen(true)}
              >
                Express Collaborative Interest
              </Button>
            </div>

            <button
              onClick={() => setReportModalOpen(true)}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--c-medium-mocha)',
                textDecoration: 'underline',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              Report this Opportunity
            </button>
          </div>
        </article>

        {/* Interest Modal */}
        <InterestModal
          isOpen={interestModalOpen}
          opportunityTitle={opportunity.title}
          onClose={() => setInterestModalOpen(false)}
          onSubmit={handleExpressInterest}
        />

        {/* Report Modal */}
        <ReportModal
          isOpen={reportModalOpen}
          targetType="opportunity"
          targetId={opportunity.id}
          targetTitle={opportunity.title}
          onClose={() => setReportModalOpen(false)}
        />
      </div>
    </main>
  );
}
