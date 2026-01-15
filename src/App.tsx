import { useSignalR } from './hooks/useSignalR';
import './App.css';

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || '';
const SIGNALR_ACCESS_TOKEN = import.meta.env.VITE_SIGNALR_ACCESS_TOKEN || '';

function App() {
  const {
    isConnected,
    connectionState,
    messages,
    error,
    startConnection,
    stopConnection,
    clearMessages,
  } = useSignalR({
    hubUrl: SIGNALR_HUB_URL,
    accessToken: SIGNALR_ACCESS_TOKEN,
    autoConnect: true,
  });

  return (
    <div className="app-container">
      <h1>Azure SignalR Demo</h1>

      {/* Connection Status */}
      <div className="connection-status">
        <span
          className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}
        />
        <span>Status: {connectionState}</span>
      </div>

      {/* Error Display */}
      {error && <div className="error-message">Error: {error}</div>}

      {/* Connection Controls */}
      <div className="controls">
        <button onClick={startConnection} disabled={isConnected}>
          Connect
        </button>
        <button onClick={stopConnection} disabled={!isConnected}>
          Disconnect
        </button>
        <button onClick={clearMessages} disabled={messages.length === 0}>
          Clear Messages
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-container">
        <h2>Incoming Messages ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className="no-messages">No messages received yet. Waiting for incoming messages...</p>
        ) : (
          <ul className="messages-list">
            {messages.map((msg) => (
              <li key={msg.id} className="message-item">
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <span className="message-content">{msg.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Configuration Info */}
      <div className="config-info">
        <p>
          <strong>Hub URL:</strong> {SIGNALR_HUB_URL || 'Not configured'}
        </p>
      </div>
    </div>
  );
}

export default App;
