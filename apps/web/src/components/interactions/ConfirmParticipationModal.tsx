'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface ConfirmParticipationModalProps {
  isOpen: boolean;
  opportunityTitle: string;
  onClose: () => void;
  onConfirm: (role: string) => Promise<void>;
}

export const ConfirmParticipationModal: React.FC<ConfirmParticipationModalProps> = ({
  isOpen,
  opportunityTitle,
  onClose,
  onConfirm,
}) => {
  const [role, setRole] = useState('Collaborator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm(role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to confirm participation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Mutual Collaboration"
      description={`Record confirmed participation for "${opportunityTitle}"`}
    >
      <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <p style={{ color: 'var(--c-dark-cocoa)', fontSize: '0.875rem', fontWeight: 600 }}>{error}</p>
        )}
        <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', lineHeight: 1.5 }}>
          Confirming participation signals that both sides have aligned on roles, scope, and the declared
          compensation terms.
        </p>
        <Input
          label="Collaboration Role / Responsibility"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Confirm Collaboration
          </Button>
        </div>
      </form>
    </Modal>
  );
};
