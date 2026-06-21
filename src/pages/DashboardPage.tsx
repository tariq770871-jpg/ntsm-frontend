import { useEffect, useState } from 'react';
import axios from 'axios';
import { Radio, AlertTriangle, Archive, Wifi } from 'lucide-react';

interface Stats {
  total: number;
  online: number;
  offline: number;
  archived: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/devices/stats`).then(res => setStats(res.data));
  }, []);

  const cards = [
    { label: 'الإجمالي', value: stats?.total || 0, icon: Radio, color: 'bg-blue-500' },
    { label: 'متصل', value: stats?.online || 0, icon: Wifi, color: 'bg-green-500' },
    { label: 'غير متصل', value: stats?.offline || 0, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'الأرشيف', value: stats?.archived || 0, icon: Archive, color: 'bg-gray-500' },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم - إدارة الدعم الفني والصيانة للشبكات</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`${card.color} text-white p-6 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <card.icon size={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
