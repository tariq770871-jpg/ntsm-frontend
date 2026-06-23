import { useEffect, useState } from 'react';
import axios from 'axios';
import { Wrench, Calendar, User } from 'lucide-react';

interface MaintenanceLog {
  id: string;
  deviceName: string;
  description: string;
  engineerName: string;
  status: string;
  createdAt: string;
}

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/maintenance-logs`)
      .then(res => setLogs(res.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سجلات الصيانة</h1>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center text-slate-500">
            لا توجد سجلات صيانة
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white">{log.deviceName}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  log.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  log.status === 'in-progress' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {log.status === 'completed' ? 'مكتمل' : log.status === 'in-progress' ? 'قيد العمل' : 'معلق'}
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{log.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {log.engineerName}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(log.createdAt).toLocaleString('ar-SA')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
