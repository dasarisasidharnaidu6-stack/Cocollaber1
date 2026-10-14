'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient, OfferCreate, SeekCreate } from '@/lib/api/client';
import { OffersList } from '@/components/members/OffersList';
import { SeeksList } from '@/components/members/SeeksList';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfilePage() {
  const { profile, isLoading, refreshProfile } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [locationText, setLocationText] = useState(profile?.location_text || '');
  const [isLocationPublic, setIsLocationPublic] = useState(profile?.is_location_public ?? true);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await apiClient.members.updateMyProfile({
        display_name: displayName,
        headline,
        bio,
        location_text: locationText,
        is_location_public: isLocationPublic,
      });
      await refreshProfile();
      setIsEditingProfile(false);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddOffer = async (offer: OfferCreate) => {
    await apiClient.members.addOffer(offer);
    await refreshProfile();
  };

  const handleDeleteOffer = async (offerId: string) => {
    await apiClient.members.deleteOffer(offerId);
    await refreshProfile();
  };

  const handleAddSeek = async (seek: SeekCreate) => {
    await apiClient.members.addSeek(seek);
    await refreshProfile();
  };

  const handleDeleteSeek = async (seekId: string) => {
    await apiClient.members.deleteSeek(seekId);
    await refreshProfile();
  };

  if (isLoading) {
    return (
      <main style={{ padding: '3.5rem 0', flex: 1 }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <Skeleton width="40%" height="2.5rem" style={{ marginBottom: '1.5rem' }} />
          <Skeleton width="100%" height="12rem" style={{ marginBottom: '2rem' }} />
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Profile Card Header */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--c-warm-sand)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 16px rgba(59, 30, 8, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-soft-caramel)',
                  color: 'var(--c-dark-cocoa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 700,
                  border: '2px solid var(--c-warm-sand)',
                }}
              >
                {(profile?.display_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--c-dark-cocoa)',
                    margin: 0,
                  }}
                >
                  {profile?.display_name || 'My Profile'}
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)', margin: '0.25rem 0' }}>
                  {profile?.headline || 'No headline set yet'}
                </p>
                {profile?.is_location_public && profile?.location_text && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--c-medium-mocha)' }}>
                    📍 {profile.location_text}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!isEditingProfile) {
                  setDisplayName(profile?.display_name || '');
                  setHeadline(profile?.headline || '');
                  setBio(profile?.bio || '');
                  setLocationText(profile?.location_text || '');
                  setIsLocationPublic(profile?.is_location_public ?? true);
                }
                setIsEditingProfile(!isEditingProfile);
              }}
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Input
                label="Headline"
                placeholder="e.g. Computational Linguist & Classical Epigraphist"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <Textarea
                label="Bio & Vision"
                placeholder="Describe your creative or scientific background, values, and collaboration interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Location (City, Country)"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={isLocationPublic}
                      onChange={(e) => setIsLocationPublic(e.target.checked)}
                      style={{ accentColor: 'var(--c-dark-cocoa)' }}
                    />
                    Display location publicly
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button type="submit" variant="primary" isLoading={saveLoading}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          ) : (
            profile?.bio && (
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--c-dark-cocoa)',
                  lineHeight: 1.6,
                  margin: 0,
                  borderTop: '1px solid rgba(221, 170, 102, 0.3)',
                  paddingTop: '1rem',
                }}
              >
                {profile.bio}
              </p>
            )
          )}
        </div>

        {/* Fluid Multi-Identity Grid: Offers & Seeks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <OffersList
            offers={profile?.offers || []}
            isEditable
            onAddOffer={handleAddOffer}
            onDeleteOffer={handleDeleteOffer}
          />
          <SeeksList
            seeks={profile?.seeks || []}
            isEditable
            onAddSeek={handleAddSeek}
            onDeleteSeek={handleDeleteSeek}
          />
        </div>
      </div>
    </main>
  );
}
