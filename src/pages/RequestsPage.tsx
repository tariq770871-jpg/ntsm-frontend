import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Clock } from 'lucide-react';

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/coordinate-requests`)
      .then(res => setRequests(res.data))
      .catch(() => setRequests([]))
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
      <h1 className="text-2xl font-bold mb-6">طلبات التنسيق</h1>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center text-slate-500">
            لا توجد طلبات
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white">{req.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    req.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                    req.priority === 'medium' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {req.priority === 'high' ? 'عالي' : req.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    req.status === 'in-progress' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {req.status === 'completed' ? 'مكتمل' : req.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3">{req.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                {new Date(req.createdAt).toLocaleString('ar-SA')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
