import { useAuth } from '../contexts/AuthContext';
import { Bell } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="font-bold">مرحباً، {user?.name}</h1>
      <div className="relative">
        <Bell size={24} className="text-gray-600 cursor-pointer" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
      </div>
    </header>
  );
}
