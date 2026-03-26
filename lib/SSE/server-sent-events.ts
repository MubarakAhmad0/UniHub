// hooks/useServerSentEvents.ts
import { useEffect, useState } from "react";

interface UseSSEProps {
  url: string;
  onMessage?: (data: any) => void;
}

export function useServerSentEvents({ url, onMessage }: UseSSEProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
      onMessage?.(data);
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { isConnected, lastMessage };
}
