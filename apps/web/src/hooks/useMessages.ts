'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Connection, Message } from '@/lib/api/client';

export function useMessages(activeConnectionId?: string) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.connections.list();
      setConnections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (connectionId: string) => {
    try {
      const msgs = await apiClient.connections.getMessages(connectionId);
      setMessages(msgs);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
    }
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  useEffect(() => {
    if (activeConnectionId) {
      loadMessages(activeConnectionId);
    }
  }, [activeConnectionId, loadMessages]);

  const sendMessage = async (connectionId: string, content: string) => {
    const newMsg = await apiClient.connections.sendMessage(connectionId, content);
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  };

  return {
    connections,
    messages,
    isLoading,
    error,
    reloadConnections: loadConnections,
    reloadMessages: () => activeConnectionId && loadMessages(activeConnectionId),
    sendMessage,
  };
}
