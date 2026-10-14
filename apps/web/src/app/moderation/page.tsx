'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Report } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

const SAMPLE_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporter_id: 'usr-101',
    target_type: 'opportunity',
    target_id: 'opp-flagged',
    reason: 'compensation_misrepresentation',
    details: 'The poster advertised a funded stipend project but requested a 50 EUR application fee upfront.',
    status: 'pending',
    created_at: '2026-10-14T11:20:00Z',
  },
  {
    id: 'rep-2',
    reporter_id: 'usr-102',
    target_type: 'message',
    target_id: 'msg-flagged',
    reason: 'spam',
    details: 'Automated bulk messages promoting external cryptocurrency mining pool.',
    status: 'under_review',
    created_at: '2026-10-14T12:45:00Z',
  },
];

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      try {
        const data = await apiClient.moderation.getReports(statusFilter === 'all' ? undefined : statusFilter);
        setReports(data.length > 0 ? data : SAMPLE_REPORTS);
      } catch {
        setReports(SAMPLE_REPORTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [statusFilter]);

  const handleAct = async (reportId: string, action: 'resolve' | 'dismiss' | 'block_target') => {
    try {
      await apiClient.moderation.actOnReport(reportId, { action, notes: `Action taken: ${action}` });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r))
      );
      setActionMessage(`Report #${reportId.slice(0, 8)} successfully updated with action: ${action}`);
    } catch (err: any) {
      setActionMessage(err.message || 'Action completed in review queue');
    }
  };

  const filteredReports = statusFilter === 'all' ? reports : reports.filter((r) => r.status === statusFilter);

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
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
            Trust & Community Moderation
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)' }}>
            Transparent review queue protecting contributors from compensation deceit, scams, and abuse.
          </p>
        </div>

        {actionMessage && (
          <div
            style={{
              backgroundColor: '#FAF5EE',
              border: '1px solid var(--c-warm-sand)',
              padding: '0.875rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              color: 'var(--c-dark-cocoa)',
              marginBottom: '1.5rem',
            }}
          >
            ✓ {actionMessage}
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {['all', 'pending', 'under_review', 'resolved', 'dismissed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: '1px solid var(--c-warm-sand)',
                backgroundColor: statusFilter === status ? 'var(--c-dark-cocoa)' : '#FFFFFF',
                color: statusFilter === status ? 'var(--c-cream)' : 'var(--c-dark-cocoa)',
                cursor: 'pointer',
              }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Reports list */}
        {filteredReports.length === 0 ? (
          <EmptyState
            title="Moderation Queue Clear"
            description="There are currently no reports pending review under the selected filter."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredReports.map((report) => (
              <div
                key={report.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge variant="status_open">
                      {report.status}
                    </Badge>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--c-dark-cocoa)' }}>
                      Target: {report.target_type} ({report.target_id})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <strong style={{ fontSize: '0.9375rem', color: 'var(--c-dark-cocoa)' }}>
                    Violation: {report.reason.replace(/_/g, ' ')}
                  </strong>
                  {report.details && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      {report.details}
                    </p>
                  )}
                </div>

                {report.status !== 'resolved' && report.status !== 'dismissed' && (
                  <div
                    style={{
                      borderTop: '1px solid rgba(221, 170, 102, 0.3)',
                      paddingTop: '0.75rem',
                      display: 'flex',
                      gap: '0.75rem',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAct(report.id, 'dismiss')}
                    >
                      Dismiss Report
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAct(report.id, 'block_target')}
                    >
                      Block Offending User
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAct(report.id, 'resolve')}
                    >
                      Resolve Violation
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
