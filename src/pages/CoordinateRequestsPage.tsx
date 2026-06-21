import { useEffect, useState } from 'react';
import axios from 'axios';

interface Request {
  id: string;
  deviceName: string;
  lat: number;
  lng: number;
  description: string;
  status: string;
  createdAt: string;
  engineer: { name: string };
}

export default function CoordinateRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/coordinate-requests`).then(res => setRequests(res.data));
  }, []);

  const handleApprove = async (id: string) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/coordinate-requests/${id}/approve`, { reviewerId: 'current-user-id' });
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = async (id: string) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/coordinate-requests/${id}/reject`, { reviewerId: 'current-user-id', reason: 'مرفوض' });
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">طلبات الإحداثيات</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">اسم الجهاز</th>
              <th className="p-3 text-right">المهندس</th>
              <th className="p-3 text-right">الإحداثيات</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.deviceName || '—'}</td>
                <td className="p-3">{r.engineer?.name}</td>
                <td className="p-3">{r.lat.toFixed(6)}, {r.lng.toFixed(6)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    r.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(r.status)}
                  </span>
                </td>
                <td className="p-3">
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(r.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">موافقة</button>
                      <button onClick={() => handleReject(r.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">رفض</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
