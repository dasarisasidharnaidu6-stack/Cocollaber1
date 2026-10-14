'use client';

import React, { useState } from 'react';
import { OpportunityCreate, CompensationType } from '@/lib/api/client';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface OpportunityFormProps {
  initialValues?: Partial<OpportunityCreate>;
  onSubmit: (data: OpportunityCreate) => Promise<void>;
  isLoading?: boolean;
}

const COMPENSATION_CHOICES = [
  { value: 'unpaid', label: 'Unpaid Collaboration (Open source, research, mutual learning)' },
  { value: 'stipend', label: 'Stipend / Micro-Grant (Specified grant or living support)' },
  { value: 'paid', label: 'Paid Project (Fixed fee, milestone, or contract)' },
  { value: 'credit_recognition', label: 'Attribution & Credit (Co-authorship, public credit)' },
];

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [domainName, setDomainName] = useState((initialValues?.attributes?.domain as string) || 'Open Source Software');
  const [compensationType, setCompensationType] = useState<CompensationType>(initialValues?.compensation_type || 'unpaid');
  const [compensationDetails, setCompensationDetails] = useState(initialValues?.compensation_details || '');
  const [isRemote, setIsRemote] = useState(initialValues?.is_remote ?? true);
  const [locationText, setLocationText] = useState(initialValues?.location_text || '');
  const [tagsInput, setTagsInput] = useState((initialValues?.attributes?.tags as string[] || []).join(', '));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters long to provide clear context for collaborators.');
      return;
    }
    if (!compensationDetails.trim()) {
      setError('Compensation terms are mandatory on CoCollaber for full transparency.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: OpportunityCreate = {
      title: title.trim(),
      description: description.trim(),
      opportunity_type: 'collaboration',
      compensation_type: compensationType,
      compensation_details: compensationDetails.trim(),
      is_remote: isRemote,
      location_text: isRemote ? null : locationText.trim(),
      attributes: {
        domain: domainName,
        tags,
      },
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Failed to publish opportunity');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--c-warm-sand)',
        boxShadow: '0 4px 16px rgba(59, 30, 8, 0.06)',
      }}
    >
      {error && (
        <div
          style={{
            backgroundColor: '#FAF0E6',
            borderLeft: '4px solid var(--c-dark-cocoa)',
            padding: '1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: 'var(--c-dark-cocoa)',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Title */}
      <Input
        label="Opportunity Title"
        placeholder="e.g. Digitizing Ancient Epigraphic Inscriptions into Open Corpus"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={120}
        helperText="Clearly state what collaborative initiative you are undertaking."
      />

      {/* Domain */}
      <Input
        label="Domain / Field of Work"
        placeholder="e.g. Digital Humanities, Computational Biology, Sound Design"
        value={domainName}
        onChange={(e) => setDomainName(e.target.value)}
        required
        helperText="CoCollaber is domain-agnostic: enter any discipline or field."
      />

      {/* Description */}
      <Textarea
        label="Opportunity Description & Purpose"
        placeholder="Describe the initiative, the scope of work, what kind of collaborator you are looking for, and what working together looks like..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={6}
        maxLength={5000}
        characterCount
      />

      {/* Mandatory Compensation Transparency Section */}
      <div
        style={{
          border: '1px solid var(--c-warm-sand)',
          backgroundColor: '#FAF5EE',
          padding: '1.5rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--c-dark-cocoa)',
              margin: 0,
            }}
          >
            Mandatory Compensation Transparency
          </h4>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--c-cream)',
              backgroundColor: 'var(--c-dark-cocoa)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
            }}
          >
            CoCollaber Principle #5
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', margin: 0, lineHeight: 1.5 }}>
          Opportunities on CoCollaber can be unpaid or paid. Every opportunity must honestly declare its financial status so collaborators are never misled.
        </p>

        <Select
          label="Compensation Classification"
          options={COMPENSATION_CHOICES}
          value={compensationType}
          onChange={(e) => setCompensationType(e.target.value as CompensationType)}
          required
        />

        <Textarea
          label="Compensation Terms & Details"
          placeholder="For paid: specify exact amount/rate and milestones. For unpaid/attribution: explain intellectual credit, co-authorship, or community structure."
          value={compensationDetails}
          onChange={(e) => setCompensationDetails(e.target.value)}
          required
          rows={3}
          maxLength={300}
          characterCount
        />
      </div>

      {/* Remote & Location */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9375rem',
            color: 'var(--c-dark-cocoa)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
            style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--c-dark-cocoa)' }}
          />
          This opportunity is fully remote
        </label>

        {!isRemote && (
          <Input
            label="Location Details"
            placeholder="e.g. Berlin, Germany or Hybrid in Kyoto"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            required={!isRemote}
          />
        )}
      </div>

      {/* Tags */}
      <Input
        label="Tags & Capabilities (comma-separated)"
        placeholder="e.g. Python, Translation, Archival Research, Open Source"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        helperText="Helps other participants discover this opportunity across disciplines."
      />

      {/* Submit Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Publish Opportunity
        </Button>
      </div>
    </form>
  );
};
