import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SignalRMessage {
  id: string;
  content: string;
  timestamp: string;
}

type ConnectionState = 'Disconnected' | 'Connecting' | 'Connected' | 'Disconnecting' | 'Reconnecting';

interface SignalRState {
  connectionState: ConnectionState;
  isConnected: boolean;
  messages: SignalRMessage[];
  error: string | null;
  hubUrl: string;
}

const initialState: SignalRState = {
  connectionState: 'Disconnected',
  isConnected: false,
  messages: [],
  error: null,
  hubUrl: '',
};

const signalRSlice = createSlice({
  name: 'signalR',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<ConnectionState>) => {
      state.connectionState = action.payload;
      state.isConnected = action.payload === 'Connected';
    },
    setHubUrl: (state, action: PayloadAction<string>) => {
      state.hubUrl = action.payload;
    },
    addMessage: (state, action: PayloadAction<SignalRMessage>) => {
      state.messages.unshift(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetConnection: (state) => {
      state.connectionState = 'Disconnected';
      state.isConnected = false;
      state.error = null;
    },
  },
});

export const {
  setConnectionState,
  setHubUrl,
  addMessage,
  clearMessages,
  setError,
  resetConnection,
} = signalRSlice.actions;

export default signalRSlice.reducer;
