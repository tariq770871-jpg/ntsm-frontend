import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import {
  LayoutDashboard, Server, Map, MessageSquare, Wrench, FileText, Settings, LogOut,
  Menu, X, Wifi, Bell
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/devices', label: 'الأجهزة', icon: Server },
  { path: '/map', label: 'الخريطة', icon: Map },
  { path: '/chat', label: 'الرسائل', icon: MessageSquare },
  { path: '/maintenance', label: 'الصيانة', icon: Wrench },
  { path: '/requests', label: 'الطلبات', icon: FileText },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex" dir="rtl">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-l border-slate-700/50 transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm">NTSM</h1>
                <p className="text-[10px] text-slate-400">نظام الدعم الفني</p>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                } ${!sidebarOpen && 'justify-center'}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <div className={`flex items-center gap-3 mb-3 px-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name || 'المستخدم'}</p>
                <p className="text-[10px] text-slate-400">{user?.role === 'admin' ? 'مدير' : user?.role === 'support' ? 'دعم' : 'مهندس'}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {menuItems.find(m => m.path === location.pathname)?.label || 'NTSM'}
          </h2>
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute left-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="font-bold">التنبيهات</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-cyan-400 hover:text-cyan-300">قراءة الكل</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-slate-500 text-sm">لا توجد تنبيهات</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-3 border-b border-slate-700/30 cursor-pointer hover:bg-slate-700/30 transition-colors ${!n.read ? 'bg-cyan-500/5' : ''}`}>
                        <p className="text-sm text-white">{n.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString('ar-SA')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
