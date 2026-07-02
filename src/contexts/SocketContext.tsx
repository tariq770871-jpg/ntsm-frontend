import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

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

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!token || !apiUrl) return;

    let newSocket: any = null;
    try {
      // Dynamic import to avoid crash if socket.io-client fails
      import('socket.io-client').then(({ io }) => {
        newSocket = io(apiUrl, {
          transports: ['websocket', 'polling'],
          auth: { token },
          reconnectionAttempts: 5,
          reconnectionDelay: 3000,
          timeout: 10000,
        });

        newSocket.on('connect', () => {
          console.log('Socket connected');
        });

        newSocket.on('device:status', (data: { deviceName: string; status: string; location: string }) => {
          const notif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message: `${data.deviceName} في ${data.location} ${data.status === 'online' ? 'متصل الآن' : 'غير متصل'}`,
            type: data.status === 'online' ? 'online' : 'offline',
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [notif, ...prev]);
          toast(notif.message, {
            icon: data.status === 'offline' ? '🔴' : '🟢',
          });
        });

        newSocket.on('device:warning', (data: { deviceName: string; message: string }) => {
          const notif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message: `${data.deviceName}: ${data.message}`,
            type: 'warning',
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications(prev => [notif, ...prev]);
          toast(notif.message, { icon: '⚠️' });
        });

        newSocket.on('connect_error', (err: any) => {
          console.warn('Socket connection error:', err.message);
        });

        setSocket(newSocket);
      }).catch((err) => {
        console.warn('Failed to load socket.io-client:', err);
      });
    } catch (err) {
      console.warn('Socket init error:', err);
    }

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
