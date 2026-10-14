'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, OpportunityCreate } from '@/lib/api/client';
import { OpportunityForm } from '@/components/opportunities/OpportunityForm';

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: OpportunityCreate) => {
    setIsSubmitting(true);
    try {
      const opp = await apiClient.opportunities.create(data);
      router.push(`/opportunities/${opp.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Navigation back */}
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

        {/* Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              marginBottom: '0.5rem',
            }}
          >
            Publish an Opportunity
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)', lineHeight: 1.5 }}>
            Invite others into your collaborative vision. Whether paid or unpaid, clearly define the work,
            expectations, and terms to build trust from day one.
          </p>
        </div>

        {/* The Form */}
        <OpportunityForm onSubmit={handleCreate} isLoading={isSubmitting} />
      </div>
    </main>
  );
}
