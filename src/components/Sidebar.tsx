import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Map, Radio, MessageSquare, Wrench, ClipboardList, Settings, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
    <>
      {/* زر الهامبرغر */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-md lg:hidden"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* خلفية شفافة للإغلاق */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* القائمة الجانبية */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="p-4 font-bold text-xl flex items-center justify-between">
          <span>NTSM</span>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1">
          {filtered.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 p-3 hover:bg-gray-800 ${
                location.pathname === link.to ? 'bg-gray-800' : ''
              }`}
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
    </>
  );
}
