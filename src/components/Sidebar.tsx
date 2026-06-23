import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Map, Radio, MessageSquare, Wrench, ClipboardList, Settings, 
  LogOut, Menu, X, Sun, Moon, Bell 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // إغلاق القائمة تلقائياً عند التنقل
  useEffect(() => { setOpen(false); }, [location.pathname]);
  
  // تفعيل الوضع الداكن
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const links = [
    { to: '/dashboard', icon: Radio, label: 'لوحة التحكم', roles: ['admin', 'support', 'engineer'] },
    { to: '/map', icon: Map, label: 'الخريطة', roles: ['admin', 'support', 'engineer'] },
    { to: '/devices', icon: Radio, label: 'الأجهزة', roles: ['admin', 'support'] },
    { to: '/chat', icon: MessageSquare, label: 'المحادثات', roles: ['admin', 'support', 'engineer'] },
    { to: '/maintenance', icon: Wrench, label: 'الصيانة', roles: ['admin', 'support'] },
    { to: '/requests', icon: ClipboardList, label: 'الطلبات', roles: ['admin', 'support'] },
    { to: '/settings', icon: Settings, label: 'الإعدادات', roles: ['admin'] },
  ];

  const filtered = links.filter(l => l.roles.includes(user?.role || ''));

  return (
    <>
      {/* زر الهامبرغر للجوال */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-gray-900 text-white rounded-full shadow-lg lg:hidden hover:bg-gray-800"
      >
        <Menu size={24} />
      </button>

      {/* خلفية شفافة للإغلاق */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* القائمة الجانبية */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col z-40 transform transition-transform duration-300 shadow-2xl border-l border-gray-200 dark:border-gray-700 ${
        open ? 'translate-x-0' : 'translate-x-full'
      } lg:translate-x-0 lg:static lg:w-64`}>
        
        {/* رأس القائمة */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={24} className="text-blue-600" />
            <span className="font-bold text-lg">NTSM</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X size={24} /></button>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {filtered.map(link => (
            <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === link.to 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}>
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* أزرار التحكم */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
          </button>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
