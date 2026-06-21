import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Map, Radio, MessageSquare, Wrench, ClipboardList, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', icon: Radio, label: 'لوحة التحكم', roles: ['admin', 'support', 'engineer'] },
    { to: '/map', icon: Map, label: 'الخريطة', roles: ['admin', 'support', 'engineer'] },
    { to: '/devices', icon: Radio, label: 'الأجهزة', roles: ['admin', 'support'] },
    { to: '/chat', icon: MessageSquare, label: 'المحادثات', roles: ['admin', 'support', 'engineer'] },
    { to: '/maintenance', icon: Wrench, label: 'الصيانة', roles: ['admin', 'support'] },
    { to: '/requests', icon: ClipboardList, label: 'طلبات الإحداثيات', roles: ['admin', 'support'] },
    { to: '/settings', icon: Settings, label: 'الإعدادات', roles: ['admin'] },
  ];

  const filtered = links.filter(l => l.roles.includes(user?.role || ''));

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 font-bold text-xl">NOC System</div>
      <nav className="flex-1">
        {filtered.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 p-3 hover:bg-gray-800 ${location.pathname === link.to ? 'bg-gray-800' : ''}`}
          >
            <link.icon size={20} />
            {link.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="flex items-center gap-2 p-4 hover:bg-gray-800 text-red-400">
        <LogOut size={20} />
        تسجيل الخروج
      </button>
    </aside>
  );
}
