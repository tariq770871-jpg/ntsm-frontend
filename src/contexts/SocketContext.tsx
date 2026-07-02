import { createContext, useContext, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'online' | 'offline' | 'warning' | 'info';
  read: boolean;
  createdAt: string;
}

interface SocketContextType {
  socket: any | null;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
});

// Stub provider - Express backend doesn't support WebSocket
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const unreadCount = 0;

  const markAsRead = (_id: string) => {};
  const markAllAsRead = () => {};

  return (
    <SocketContext.Provider value={{ socket: null, notifications: [], unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
