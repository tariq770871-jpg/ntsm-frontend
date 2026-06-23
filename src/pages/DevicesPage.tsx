import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Plus, X, Pencil, Trash2 } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  location: string;
  status: string;
  ip: string;
  type: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filtered, setFiltered] = useState<Device[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', location: '', ip: '', type: 'router' });
  const [editForm, setEditForm] = useState<Device | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(devices.filter(d => 
      d.name.toLowerCase().includes(s) || 
      d.location.toLowerCase().includes(s) ||
      d.ip.includes(s)
    ));
  }, [search, devices]);

  const fetchDevices = () => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/devices`)
      .then(res => { setDevices(res.data); setFiltered(res.data); })
      .catch(() => toast.error('فشل تحميل الأجهزة'))
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/devices`, form);
      toast.success('تم إضافة الجهاز');
      setModal(false);
      setForm({ name: '', location: '', ip: '', type: 'router' });
      fetchDevices();
    } catch {
      toast.error('فشل إضافة الجهاز');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setSubmitting(true);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/devices/${editForm.id}`, editForm);
      toast.success('تم تحديث الجهاز');
      setEditModal(false);
      setEditForm(null);
      fetchDevices();
    } catch {
      toast.error('فشل تحديث الجهاز');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/devices/${deleteId}`);
      toast.success('تم حذف الجهاز');
      setDeleteId(null);
      fetchDevices();
    } catch {
      toast.error('فشل حذف الجهاز');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">الأجهزة</h1>
        <button onClick={() => setModal(true)} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" /> إضافة جهاز
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-slate-400 text-sm border-b border-slate-700/50">
              <th className="text-right py-3 px-4">الجهاز</th>
              <th className="text-right py-3 px-4">النوع</th>
              <th className="text-right py-3 px-4">الموقع</th>
              <th className="text-right py-3 px-4">IP</th>
              <th className="text-right py-3 px-4">الحالة</th>
              <th className="text-right py-3 px-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((device) => (
              <tr key={device.id} className="border-b border-slate-700/30 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-white font-medium">{device.name}</td>
                <td className="py-3 px-4 text-slate-400">{device.type}</td>
                <td className="py-3 px-4 text-slate-400">{device.location}</td>
                <td className="py-3 px-4 text-slate-400 font-mono text-left" dir="ltr">{device.ip}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                    device.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' :
                    device.status === 'warning' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      device.status === 'online' ? 'bg-emerald-400' : 
                      device.status === 'warning' ? 'bg-orange-400' : 'bg-red-400'
                    }`} />
                    {device.status === 'online' ? 'متصل' : device.status === 'warning' ? 'تحذير' : 'غير متصل'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditForm(device); setEditModal(true); }} className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(device.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">لا توجد نتائج</div>
        )}
      </div>

      {/* Add Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">إضافة جهاز جديد</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="block text-sm text-slate-300 mb-1">اسم الجهاز</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">الموقع</label><input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">IP</label><input required value={form.ip} onChange={e => setForm({...form, ip: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-left" dir="ltr" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">النوع</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"><option value="router">Router</option><option value="switch">Switch</option><option value="ap">Access Point</option><option value="mikrotik">MikroTik</option></select></div>
              <button type="submit" disabled={submitting} className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors disabled:opacity-50">{submitting ? 'جاري الإضافة...' : 'إضافة'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">تعديل جهاز</h2>
              <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div><label className="block text-sm text-slate-300 mb-1">اسم الجهاز</label><input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">الموقع</label><input required value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">IP</label><input required value={editForm.ip} onChange={e => setEditForm({...editForm, ip: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-left" dir="ltr" /></div>
              <div><label className="block text-sm text-slate-300 mb-1">النوع</label><select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"><option value="router">Router</option><option value="switch">Switch</option><option value="ap">Access Point</option><option value="mikrotik">MikroTik</option></select></div>
              <button type="submit" disabled={submitting} className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg transition-colors disabled:opacity-50">{submitting ? 'جاري التحديث...' : 'تحديث'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">تأكيد الحذف</h2>
            <p className="text-slate-400 mb-6">هل أنت متأكد من حذف هذا الجهاز؟ لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">إلغاء</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
