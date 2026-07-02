import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Archive, Wifi, Activity, Server, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || '';

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
    <div className={`bg-gradient-to-br ${gradients[color] || ''} border rounded-xl p-6 backdrop-blur-sm`}>
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

const activityData = [
  { name: 'الأحد', devices: 4 },
  { name: 'الإثنين', devices: 3 },
  { name: 'الثلاثاء', devices: 7 },
  { name: 'الأربعاء', devices: 5 },
  { name: 'الخميس', devices: 8 },
  { name: 'الجمعة', devices: 6 },
  { name: 'السبت', devices: 9 },
];

const statusData = [
  { name: 'متصل', value: 22, color: '#10b981' },
  { name: 'غير متصل', value: 2, color: '#ef4444' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }
    axios.get(`${API_URL}/devices/stats`)
      .then(res => setStats(res.data))
      .catch((err) => {
        console.warn('Failed to load device stats:', err.message);
        setError('تعذر تحميل إحصائيات الأجهزة');
      })
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">لوحة التحكم - إدارة الدعم الفني والصيانة للشبكات</h1>
          <button onClick={() => window.print()} className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" /> تصدير PDF
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
            {error} - يعرض بيانات تجريبية
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map(card => (
            <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} color={card.color} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" />نشاط الأجهزة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="devices" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400" />حالة الأجهزة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-sm text-slate-300">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" />نظرة عامة</h2>
          <p className="text-slate-400">مرحباً بك في لوحة التحكم. النظام يعمل بكفاءة. آخر تحديث: {new Date().toLocaleString('ar-SA')}</p>
        </div>
      </div>
    </div>
  );
}
