
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type MessageHandler = (data: unknown) => void;

interface WsContextValue {
  ws: WebSocket | null;
  connected: boolean;
  send: (data: unknown) => void;
  subscribe: (handler: MessageHandler) => () => void;
}

const WsContext = createContext<WsContextValue | null>(null);

const WS_URL = import.meta.env.VITE_WS_URL as string;

export function WsProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.addEventListener('open', () => setConnected(true));
    socket.addEventListener('close', () => setConnected(false));

    socket.addEventListener('message', (event) => {
      let msg: any;
      try {
        msg = JSON.parse(event.data as string);
      } catch {
        msg = event.data;
      }
      console.log('WebSocket message received:', msg);
      if (msg?.data?.action === 'canceled-match') {
        window.location.href = `/page?content=parking-cancelled`
      }
      if (msg?.data?.action === 'accepted-match') {
        window.location.href = `/parking-match/${msg?.data?.match_user_id}`
      }
      handlersRef.current.forEach((h) => h(msg));
    });

    return () => {
      socket.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, []);

  const send = useCallback((data: unknown) => {
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }, []);

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  return (
    <WsContext.Provider value={{ ws: wsRef.current, connected, send, subscribe }}>
      {children}
    </WsContext.Provider>
  );
}

export function useWs() {
  const ctx = useContext(WsContext);
  if (!ctx) throw new Error('useWs must be used inside <WsProvider>');
  return ctx;
}
