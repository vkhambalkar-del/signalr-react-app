import { useSignalR } from './hooks/useSignalR';
import styles from './App.module.css';
import { version } from '../package.json';

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || '';

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
    autoConnect: true,
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Azure SignalR Demo <span className={styles.version}>v{version}</span></h1>

      {/* Connection Status */}
      <div className={styles.connectionStatus}>
        <span
          className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}
        />
        <span>Status: {connectionState}</span>
      </div>

      {/* Error Display */}
      {error && <div className={styles.errorMessage}>Error: {error}</div>}

      {/* Connection Controls */}
      <div className={styles.controls}>
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
      <div className={styles.messagesContainer}>
        <h2 className={styles.messagesTitle}>Incoming Messages ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className={styles.noMessages}>No messages received yet. Waiting for incoming messages...</p>
        ) : (
          <ul className={styles.messagesList}>
            {messages.map((msg) => (
              <li key={msg.id} className={styles.messageItem}>
                <span className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <span className={styles.messageContent}>{msg.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Configuration Info */}
      <div className={styles.configInfo}>
        <p>
          <strong>Hub URL:</strong> {SIGNALR_HUB_URL || 'Not configured'}
        </p>
      </div>
    </div>
  );
}

export default App;
