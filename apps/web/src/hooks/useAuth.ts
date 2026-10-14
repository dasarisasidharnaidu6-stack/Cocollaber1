'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, UserAccount, Profile, LoginRequest, RegisterRequest } from '@/lib/api/client';

export interface UseAuthReturn {
  user: UserAccount | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cocol_token') : null;
      if (!token) {
        setIsLoading(false);
        return;
      }
      const account = await apiClient.auth.me();
      setUser(account);

      try {
        const prof = await apiClient.members.getMyProfile();
        setProfile(prof);
      } catch {
        // Profile might not be created yet
      }
    } catch {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cocol_token');
      }
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await apiClient.auth.login(req);
      if (typeof window !== 'undefined' && res.access_token) {
        localStorage.setItem('cocol_token', res.access_token);
      }
      setUser(res.account);
      try {
        const prof = await apiClient.members.getMyProfile();
        setProfile(prof);
      } catch {
        // Optional profile fetch
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest) => {
    setIsLoading(true);
    try {
      const res = await apiClient.auth.register(req);
      if (typeof window !== 'undefined' && res.access_token) {
        localStorage.setItem('cocol_token', res.access_token);
      }
      setUser(res.account);
      try {
        const prof = await apiClient.members.getMyProfile();
        setProfile(prof);
      } catch {
        // Optional profile fetch
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.auth.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cocol_token');
      }
      setUser(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const prof = await apiClient.members.getMyProfile();
      setProfile(prof);
    } catch {
      // Ignore
    }
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
  };
}
