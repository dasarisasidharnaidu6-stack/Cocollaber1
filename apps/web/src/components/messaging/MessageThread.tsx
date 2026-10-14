'use client';

import React, { useState } from 'react';
import { Message } from '@/lib/api/client';
import { CautionBanner } from '@/components/messaging/CautionBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsSending(true);
    try {
      await onSendMessage(inputText.trim());
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '620px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid var(--c-warm-sand)',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner */}
      <div style={{ padding: '1rem 1.25rem 0 1.25rem' }}>
        <CautionBanner />
      </div>

      {/* Messages stream */}
      <div
        style={{
          flex: 1,
          padding: '1rem 1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              color: 'var(--c-medium-mocha)',
              fontSize: '0.875rem',
            }}
          >
            No messages yet. Send a greeting to begin collaborating!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  backgroundColor: isMe ? 'var(--c-dark-cocoa)' : 'var(--c-cream)',
                  color: isMe ? 'var(--c-cream)' : 'var(--c-dark-cocoa)',
                  borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '0.75rem 1rem',
                  border: isMe ? 'none' : '1px solid rgba(221, 170, 102, 0.4)',
                  boxShadow: '0 1px 3px rgba(59, 30, 8, 0.05)',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
                <span
                  style={{
                    display: 'block',
                    textAlign: isMe ? 'right' : 'left',
                    fontSize: '0.6875rem',
                    color: isMe ? 'rgba(248, 239, 227, 0.7)' : 'var(--c-medium-mocha)',
                    marginTop: '0.35rem',
                  }}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(221, 170, 102, 0.3)',
          display: 'flex',
          gap: '0.75rem',
          backgroundColor: '#FAF5EE',
        }}
      >
        <Input
          placeholder="Write a message about this collaboration..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading || isSending}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSending}
          disabled={!inputText.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
