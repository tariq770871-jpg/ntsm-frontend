import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Map, Radio, MessageSquare, Wrench, ClipboardList, Settings, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // إغلاق القائمة تلقائياً عند تغيير المسار (للجوال)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
      {/* زر الهامبرغر المحسن */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 p-3 bg-gray-900 text-white rounded-full shadow-lg lg:hidden hover:bg-gray-700 transition-all duration-300"
        aria-label="فتح القائمة"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* خلفية شفافة للإغلاق */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* القائمة الجانبية المحسنة */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-gray-950 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64 lg:bg-gray-900`}
      >
        {/* رأس القائمة */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={24} className="text-blue-400" />
            <span className="font-bold text-lg">NTSM</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {filtered.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
