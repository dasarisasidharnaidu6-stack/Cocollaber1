'use client';

import React from 'react';
import { OpportunityFilters } from '@/hooks/useOpportunities';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface OpportunityFilterProps {
  filters: OpportunityFilters;
  onChange: (filters: Partial<OpportunityFilters>) => void;
  onReset: () => void;
}

const COMPENSATION_OPTIONS = [
  { value: '', label: 'All Compensation Types' },
  { value: 'unpaid', label: 'Unpaid Collaboration' },
  { value: 'stipend', label: 'Stipend / Micro-Grant' },
  { value: 'paid', label: 'Paid Project' },
  { value: 'credit_recognition', label: 'Attribution / Credit Recognition' },
];

export const OpportunityFilter: React.FC<OpportunityFilterProps> = ({ filters, onChange, onReset }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--c-warm-sand)',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(59, 30, 8, 0.04)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        {/* Search */}
        <Input
          label="Search by Topic or Keyword"
          placeholder="e.g. Epigraphy, WebGL, Sensors..."
          value={filters.q || ''}
          onChange={(e) => onChange({ q: e.target.value })}
        />

        {/* Compensation Type */}
        <Select
          label="Compensation Structure"
          options={COMPENSATION_OPTIONS}
          value={filters.compensation_type || ''}
          onChange={(e) => onChange({ compensation_type: e.target.value || undefined })}
        />

        {/* Remote toggle & reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '2.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--c-dark-cocoa)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={filters.is_remote ?? false}
              onChange={(e) => onChange({ is_remote: e.target.checked ? true : undefined })}
              style={{
                width: '1rem',
                height: '1rem',
                accentColor: 'var(--c-dark-cocoa)',
                cursor: 'pointer',
              }}
            />
            Remote Only
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            style={{ marginLeft: 'auto' }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
