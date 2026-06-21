import { useEffect, useState } from 'react';
import axios from 'axios';

interface Device {
  id: string;
  name: string;
  ssid: string;
  ip_address: string;
  status: string;
  type: string;
  last_seen_at: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/devices`).then(res => setDevices(res.data));
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متصل';
      case 'offline': return 'غير متصل';
      default: return status;
    }
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">الأجهزة</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">SSID</th>
              <th className="p-3 text-right">IP</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">النوع</th>
              <th className="p-3 text-right">آخر ظهور</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(d => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.ssid || '—'}</td>
                <td className="p-3">{d.ip_address || '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    d.status === 'online' ? 'bg-green-100 text-green-800' :
                    d.status === 'offline' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusText(d.status)}
                  </span>
                </td>
                <td className="p-3">{d.type}</td>
                <td className="p-3">{d.last_seen_at ? new Date(d.last_seen_at).toLocaleString('ar') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
