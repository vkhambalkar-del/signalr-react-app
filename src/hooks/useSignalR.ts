import { useState, useEffect, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseSignalROptions {
  hubUrl: string;
  accessToken?: string;
  accessTokenFactory?: () => string | Promise<string>;
  autoConnect?: boolean;
}

interface SignalRMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export function useSignalR({
  hubUrl,
  accessToken,
  accessTokenFactory,
  autoConnect = true,
}: UseSignalROptions) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );
  const [messages, setMessages] = useState<SignalRMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Initialize connection with access token
  useEffect(() => {
    // Determine the token factory to use
    const tokenFactory = accessTokenFactory || (accessToken ? () => accessToken : undefined);

    const connectionBuilder = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: tokenFactory,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information);

    const newConnection = connectionBuilder.build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    // Handle connection state changes
    newConnection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
      setConnectionState(signalR.HubConnectionState.Reconnecting);
    });

    newConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
      setConnectionState(signalR.HubConnectionState.Connected);
    });

    newConnection.onclose((error) => {
      console.log('SignalR connection closed', error);
      setConnectionState(signalR.HubConnectionState.Disconnected);
    });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [hubUrl, accessToken, accessTokenFactory]);

  // Register message listener
  useEffect(() => {
    if (!connection) return;

    // Listen for incoming messages - adjust method name based on your server
    const handleReceiveMessage = (message: string) => {
      console.log('Received message:', message);
      const newMessage: SignalRMessage = {
        id: crypto.randomUUID(),
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    // Common method names - add more as needed based on your SignalR hub
    connection.on('ReceiveMessage', handleReceiveMessage);
    connection.on('newMessage', handleReceiveMessage);
    connection.on('message', handleReceiveMessage);

    return () => {
      connection.off('ReceiveMessage', handleReceiveMessage);
      connection.off('newMessage', handleReceiveMessage);
      connection.off('message', handleReceiveMessage);
    };
  }, [connection]);

  // Auto-connect
  useEffect(() => {
    if (autoConnect && connection && connectionState === signalR.HubConnectionState.Disconnected) {
      startConnection();
    }
  }, [autoConnect, connection, connectionState]);

  const startConnection = useCallback(async () => {
    if (!connection) return;

    try {
      setError(null);
      await connection.start();
      setConnectionState(signalR.HubConnectionState.Connected);
      console.log('SignalR connected successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      console.error('SignalR connection error:', err);
    }
  }, [connection]);

  const stopConnection = useCallback(async () => {
    if (!connection) return;

    try {
      await connection.stop();
      setConnectionState(signalR.HubConnectionState.Disconnected);
    } catch (err) {
      console.error('Error stopping connection:', err);
    }
  }, [connection]);

  const sendMessage = useCallback(
    async (methodName: string, ...args: unknown[]) => {
      if (!connection || connectionState !== signalR.HubConnectionState.Connected) {
        console.error('Cannot send message: not connected');
        return;
      }

      try {
        await connection.invoke(methodName, ...args);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    [connection, connectionState]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connection,
    connectionState,
    isConnected: connectionState === signalR.HubConnectionState.Connected,
    messages,
    error,
    startConnection,
    stopConnection,
    sendMessage,
    clearMessages,
  };
}
