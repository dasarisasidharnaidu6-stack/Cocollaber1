'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

export interface InterestModalProps {
  isOpen: boolean;
  opportunityTitle: string;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

export const InterestModal: React.FC<InterestModalProps> = ({
  isOpen,
  opportunityTitle,
  onClose,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(message);
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to express interest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Express Collaborative Interest"
      description={`Share how your capabilities align with "${opportunityTitle}"`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <p style={{ color: 'var(--c-dark-cocoa)', fontSize: '0.875rem', fontWeight: 600 }}>{error}</p>
        )}
        <Textarea
          label="Introductory Message"
          placeholder="Introduce yourself, mention which of your offers/skills connect with this opportunity, and what you hope to build together..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={500}
          characterCount
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Submit Interest
          </Button>
        </div>
      </form>
    </Modal>
  );
};
