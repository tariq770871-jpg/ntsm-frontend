import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'online' | 'offline' | 'warning' | 'info';
  read: boolean;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      auth: { token },
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

      if (data.status === 'offline') {
        toast.error(notif.message, { icon: <WifiOff className="w-5 h-5 text-red-400" /> });
      } else if (data.status === 'online') {
        toast.success(notif.message, { icon: <Wifi className="w-5 h-5 text-emerald-400" /> });
      }
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
      toast(notif.message, { icon: <AlertTriangle className="w-5 h-5 text-orange-400" /> });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
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
