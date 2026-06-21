import { useState } from 'react';
import axios from 'axios';

export default function MaintenancePage() {
  const [form, setForm] = useState({
    deviceId: '',
    costFuel: '',
    costParts: '',
    costOther: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/maintenance-logs`, {
      ...form,
      costFuel: parseFloat(form.costFuel) || 0,
      costParts: parseFloat(form.costParts) || 0,
      costOther: parseFloat(form.costOther) || 0,
    });
    setForm({ deviceId: '', costFuel: '', costParts: '', costOther: '', description: '' });
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">تكاليف الصيانة</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">الوقود</label>
            <input type="number" value={form.costFuel} onChange={e => setForm({...form, costFuel: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
          <div>
            <label className="block text-sm mb-1">قطع الغيار</label>
            <input type="number" value={form.costParts} onChange={e => setForm({...form, costParts: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
          <div>
            <label className="block text-sm mb-1">أخرى</label>
            <input type="number" value={form.costOther} onChange={e => setForm({...form, costOther: e.target.value})} className="w-full p-2 border rounded text-left" />
          </div>
          <div>
            <label className="block text-sm mb-1">معرف الجهاز</label>
            <input type="text" value={form.deviceId} onChange={e => setForm({...form, deviceId: e.target.value})} className="w-full p-2 border rounded text-left" required />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">الوصف</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 border rounded text-right" rows={3} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">حفظ</button>
      </form>
    </div>
  );
}
