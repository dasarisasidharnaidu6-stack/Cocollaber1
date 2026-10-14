'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { MessageThread } from '@/components/messaging/MessageThread';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmParticipationModal } from '@/components/interactions/ConfirmParticipationModal';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>('conn-1');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const { connections, messages, isLoading, sendMessage } = useMessages(selectedConnectionId);

  const handleSendMessage = async (content: string) => {
    if (!selectedConnectionId) return;
    await sendMessage(selectedConnectionId, content);
  };

  const handleConfirmCollaboration = async (role: string) => {
    // Confirm participation on opportunity
    await apiClient.participations.confirm('opp-1', user?.id || 'acc-demo', role);
    setConfirmSuccess(true);
  };

  return (
    <main style={{ padding: '3.5rem 0', flex: 1 }}>
      <div className="container">
        {/* Heading */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--c-dark-cocoa)',
                margin: 0,
              }}
            >
              Collaborations & Messages
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--c-medium-mocha)', marginTop: '0.25rem' }}>
              Direct alignment with collaborators under transparent terms.
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setConfirmModalOpen(true)}
          >
            ✓ Confirm Participation
          </Button>
        </div>

        {confirmSuccess && (
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
            ✓ Collaboration confirmed! Both participants have formally acknowledged the partnership.
          </div>
        )}

        {/* Two-pane layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {/* Left: Connection threads */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--c-warm-sand)',
              borderRadius: '10px',
              padding: '1rem',
              height: '620px',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--c-medium-mocha)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(221, 170, 102, 0.3)',
              }}
            >
              Active Collaborations
            </h3>

            {connections.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--c-medium-mocha)', fontStyle: 'italic' }}>
                No active conversations yet. Express interest in an opportunity to start collaborating!
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {connections.map((conn) => {
                  const isSelected = conn.id === selectedConnectionId;
                  return (
                    <li
                      key={conn.id}
                      onClick={() => setSelectedConnectionId(conn.id)}
                      style={{
                        padding: '0.875rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--c-cream)' : 'transparent',
                        border: isSelected ? '1px solid var(--c-warm-sand)' : '1px solid transparent',
                        transition: 'background-color 150ms ease',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--c-dark-cocoa)' }}>
                        Collaborator #{conn.account_id_2.slice(0, 8)}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--c-medium-mocha)' }}>
                        Status: {conn.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right: Message Stream */}
          <div>
            {selectedConnectionId ? (
              <MessageThread
                messages={messages}
                currentUserId={user?.id || 'acc-demo'}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <EmptyState
                title="Select a Conversation"
                description="Choose an active conversation from the left to view messages and coordinate collaboration."
              />
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmParticipationModal
          isOpen={confirmModalOpen}
          opportunityTitle="Digitizing Ancient Epigraphic Inscriptions into Open Corpus"
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmCollaboration}
        />
      </div>
    </main>
  );
}
