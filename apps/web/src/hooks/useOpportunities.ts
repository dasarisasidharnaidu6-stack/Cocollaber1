'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Opportunity, OpportunityCreate } from '@/lib/api/client';

export interface OpportunityFilters {
  q?: string;
  domain?: string;
  compensation_type?: string;
  is_remote?: boolean;
}

export function useOpportunities(initialFilters: OpportunityFilters = {}) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunityFilters>(initialFilters);

  const loadOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (filters.q || filters.domain || filters.compensation_type || filters.is_remote !== undefined) {
        const res = await apiClient.discovery.search(filters);
        setOpportunities(res.items || []);
      } else {
        const res = await apiClient.opportunities.list({
          domain: filters.domain,
          compensation_type: filters.compensation_type,
          is_remote: filters.is_remote,
        });
        setOpportunities(res.items || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const updateFilters = (newFilters: Partial<OpportunityFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const createOpportunity = async (data: OpportunityCreate): Promise<Opportunity> => {
    const opp = await apiClient.opportunities.create(data);
    setOpportunities((prev) => [opp, ...prev]);
    return opp;
  };

  return {
    opportunities,
    isLoading,
    error,
    filters,
    setFilters: updateFilters,
    reload: loadOpportunities,
    createOpportunity,
  };
}
