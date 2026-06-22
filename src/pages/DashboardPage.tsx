import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Archive, Wifi, Activity, Server } from 'lucide-react';

interface Stats {
  total: number;
  online: number;
  offline: number;
  archived: number;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const gradients: any = {
    'bg-blue-500': 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    'bg-green-500': 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    'bg-red-500': 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    'bg-gray-500': 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400',
  };

  return (
    <div className={`bg-gradient-to-br ${gradients[color]} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 text-white">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/devices/stats`)
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'الإجمالي', value: stats?.total || 0, icon: Server, color: 'bg-blue-500' },
    { label: 'متصل', value: stats?.online || 0, icon: Wifi, color: 'bg-green-500' },
    { label: 'غير متصل', value: stats?.offline || 0, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'الأرشيف', value: stats?.archived || 0, icon: Archive, color: 'bg-gray-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">لوحة التحكم - إدارة الدعم الفني والصيانة للشبكات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map(card => (
            <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} color={card.color} />
          ))}
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            نظرة عامة
          </h2>
          <p className="text-slate-400">مرحباً بك في لوحة التحكم. اختر قسم من القائمة الجانبية للبدء.</p>
        </div>
      </div>
    </div>
  );
}
