'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { apiClient, ReportReason } from '@/lib/api/client';

export interface ReportModalProps {
  isOpen: boolean;
  targetType: 'account' | 'opportunity' | 'message';
  targetId: string;
  targetTitle?: string;
  onClose: () => void;
  onReportSuccess?: () => void;
}

const REPORT_REASONS = [
  { value: 'compensation_misrepresentation', label: 'Compensation Misrepresentation (hidden fees, false terms)' },
  { value: 'scam', label: 'Deceptive Offer / Scam / Phishing' },
  { value: 'spam', label: 'Spam or Automated Solicitation' },
  { value: 'harassment', label: 'Harassment or Hostile Behavior' },
  { value: 'inappropriate', label: 'Inappropriate or Illegal Content' },
  { value: 'other', label: 'Other Policy Violation' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetType,
  targetId,
  targetTitle,
  onClose,
  onReportSuccess,
}) => {
  const [reason, setReason] = useState<ReportReason>('compensation_misrepresentation');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.moderation.createReport({
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim() || null,
      });
      setSubmitted(true);
      if (onReportSuccess) onReportSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setDetails('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Trust & Safety Report"
      description={targetTitle ? `Report for "${targetTitle}"` : `Report this ${targetType}`}
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <span style={{ fontSize: '2.5rem' }}>✓</span>
          <h4
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.2rem',
              color: 'var(--c-dark-cocoa)',
              marginTop: '0.75rem',
            }}
          >
            Report Submitted
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', marginTop: '0.5rem' }}>
            Thank you for helping maintain community integrity on CoCollaber. Our moderation team has
            queued this report for immediate review.
          </p>
          <Button variant="primary" onClick={handleClose} style={{ marginTop: '1.25rem' }}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <p style={{ color: 'var(--c-dark-cocoa)', fontSize: '0.875rem', fontWeight: 600 }}>{error}</p>
          )}
          <Select
            label="Violation Category"
            options={REPORT_REASONS}
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
            required
          />
          <Textarea
            label="Incident Details"
            placeholder="Please provide factual details or context regarding the policy violation..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            maxLength={1000}
            characterCount
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
