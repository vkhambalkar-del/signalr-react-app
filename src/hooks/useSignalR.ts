import { useEffect, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setConnectionState,
  addMessage,
  clearMessages as clearMessagesAction,
  setError,
} from '../store/slices/signalRSlice';

interface UseSignalROptions {
  hubUrl: string;
  autoConnect?: boolean;
}

export function useSignalR({
  hubUrl,
  autoConnect = true,
}: UseSignalROptions) {
  const dispatch = useAppDispatch();
  const { connectionState, isConnected, messages, error } = useAppSelector(
    (state) => state.signalR
  );

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Initialize connection
  useEffect(() => {
    if (!hubUrl) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = newConnection;

    // Handle connection state changes
    newConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      dispatch(setConnectionState('Reconnecting'));
    });

    newConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
      dispatch(setConnectionState('Connected'));
    });

    newConnection.onclose(() => {
      console.log('SignalR connection closed');
      dispatch(setConnectionState('Disconnected'));
    });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [hubUrl, dispatch]);

  // Register message listener
  useEffect(() => {
    const connection = connectionRef.current;
    if (!connection) return;

    // Listen for incoming messages
    const handleReceiveMessage = (message: string) => {
      console.log('Received message:', message);
      dispatch(addMessage({
        id: crypto.randomUUID(),
        content: message,
        timestamp: new Date().toISOString(),
      }));
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
  }, [dispatch]);

  // Auto-connect
  useEffect(() => {
    if (autoConnect && connectionRef.current && connectionState === 'Disconnected') {
      startConnection();
    }
  }, [autoConnect, connectionState]);

  const startConnection = useCallback(async () => {
    const connection = connectionRef.current;
    if (!connection) return;

    try {
      dispatch(setError(null));
      dispatch(setConnectionState('Connecting'));
      await connection.start();
      dispatch(setConnectionState('Connected'));
      console.log('SignalR connected successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      dispatch(setError(errorMessage));
      dispatch(setConnectionState('Disconnected'));
      console.error('SignalR connection error:', err);
    }
  }, [dispatch]);

  const stopConnection = useCallback(async () => {
    const connection = connectionRef.current;
    if (!connection) return;

    try {
      dispatch(setConnectionState('Disconnecting'));
      await connection.stop();
      dispatch(setConnectionState('Disconnected'));
    } catch (err) {
      console.error('Error stopping connection:', err);
    }
  }, [dispatch]);

  const sendMessage = useCallback(
    async (methodName: string, ...args: unknown[]) => {
      const connection = connectionRef.current;
      if (!connection || connectionState !== 'Connected') {
        console.error('Cannot send message: not connected');
        return;
      }

      try {
        await connection.invoke(methodName, ...args);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    [connectionState]
  );

  const clearMessages = useCallback(() => {
    dispatch(clearMessagesAction());
  }, [dispatch]);

  return {
    connection: connectionRef.current,
    connectionState,
    isConnected,
    messages,
    error,
    startConnection,
    stopConnection,
    sendMessage,
    clearMessages,
  };
}
